import { NextRequest, NextResponse } from 'next/server';
import { UsageEvent } from '@/lib/usage-analytics';

// In-memory storage for demo - use a proper database in production
const events: UsageEvent[] = [];
const maxEvents = 10000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events: newEvents } = body;

    if (!Array.isArray(newEvents)) {
      return NextResponse.json(
        { error: 'Events must be an array' },
        { status: 400 }
      );
    }

    // Validate events
    for (const event of newEvents) {
      if (!event.type || !event.sessionId || !event.timestamp) {
        return NextResponse.json(
          { error: 'Invalid event format' },
          { status: 400 }
        );
      }
    }

    // Store events (keep only recent events)
    events.push(...newEvents);
    if (events.length > maxEvents) {
      events.splice(0, events.length - maxEvents);
    }

    return NextResponse.json({ success: true, stored: newEvents.length });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics events' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let filteredEvents = events;

    // Filter by time range if provided
    if (start || end) {
      const startTime = start ? new Date(start).getTime() : 0;
      const endTime = end ? new Date(end).getTime() : Date.now();

      filteredEvents = events.filter(event => 
        event.timestamp >= startTime && event.timestamp <= endTime
      );
    }

    // Calculate statistics
    const totalEvents = filteredEvents.length;
    const uniqueUsers = new Set(filteredEvents.map(e => e.userId).filter(Boolean)).size;
    
    // Popular templates
    const templateCounts = new Map<string, { downloads: number; installs: number; name: string }>();
    filteredEvents.forEach(event => {
      if (event.templateId) {
        const current = templateCounts.get(event.templateId) || { downloads: 0, installs: 0, name: event.templateId };
        
        if (event.type === 'template_download') current.downloads++;
        if (event.type === 'template_install') current.installs++;
        
        templateCounts.set(event.templateId, current);
      }
    });

    const popularTemplates = Array.from(templateCounts.entries())
      .map(([templateId, stats]) => ({
        templateId,
        templateName: stats.name,
        downloads: stats.downloads,
        installs: stats.installs,
        rating: 4.5 // Mock rating
      }))
      .sort((a, b) => (b.downloads + b.installs) - (a.downloads + a.installs))
      .slice(0, 10);

    // Error rate
    const errorEvents = filteredEvents.filter(e => e.type === 'error');
    const errorRate = totalEvents > 0 ? errorEvents.length / totalEvents : 0;

    // Performance metrics
    const performanceEvents = filteredEvents.filter(e => e.performance);
    const avgDownloadTime = performanceEvents
      .filter(e => e.type === 'template_download')
      .reduce((sum, e) => sum + (e.performance?.duration || 0), 0) / 
      Math.max(performanceEvents.filter(e => e.type === 'template_download').length, 1);

    const avgInstallTime = performanceEvents
      .filter(e => e.type === 'template_install')
      .reduce((sum, e) => sum + (e.performance?.duration || 0), 0) / 
      Math.max(performanceEvents.filter(e => e.type === 'template_install').length, 1);

    const avgGenerateTime = performanceEvents
      .filter(e => e.type === 'component_generate' || e.type === 'page_generate')
      .reduce((sum, e) => sum + (e.performance?.duration || 0), 0) / 
      Math.max(performanceEvents.filter(e => e.type === 'component_generate' || e.type === 'page_generate').length, 1);

    const stats = {
      totalEvents,
      uniqueUsers,
      popularTemplates,
      errorRate,
      averagePerformance: {
        downloadTime: avgDownloadTime,
        installTime: avgInstallTime,
        generateTime: avgGenerateTime
      },
      timeRange: {
        start: start || new Date(Math.min(...filteredEvents.map(e => e.timestamp))).toISOString(),
        end: end || new Date(Math.max(...filteredEvents.map(e => e.timestamp))).toISOString()
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics stats' },
      { status: 500 }
    );
  }
}