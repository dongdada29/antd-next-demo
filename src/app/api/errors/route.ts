import { NextRequest, NextResponse } from 'next/server';
import { ErrorReport } from '@/lib/error-tracking';

// In-memory storage for demo - use a proper database in production
const errorReports: ErrorReport[] = [];
const maxReports = 5000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reports } = body;

    if (!Array.isArray(reports)) {
      return NextResponse.json(
        { error: 'Reports must be an array' },
        { status: 400 }
      );
    }

    // Validate reports
    for (const report of reports) {
      if (!report.id || !report.message || !report.timestamp || !report.fingerprint) {
        return NextResponse.json(
          { error: 'Invalid report format' },
          { status: 400 }
        );
      }
    }

    // Store reports (keep only recent reports)
    errorReports.push(...reports);
    if (errorReports.length > maxReports) {
      errorReports.splice(0, errorReports.length - maxReports);
    }

    // Log critical errors
    reports.forEach(report => {
      if (report.level === 'error') {
        console.error(`Error Report [${report.fingerprint}]:`, {
          message: report.message,
          templateId: report.context.templateId,
          userId: report.context.userId,
          stack: report.stack
        });
      }
    });

    return NextResponse.json({ success: true, stored: reports.length });
  } catch (error) {
    console.error('Error tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to process error reports' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let filteredReports = errorReports;

    // Filter by time range if provided
    if (start || end) {
      const startTime = start ? new Date(start).getTime() : 0;
      const endTime = end ? new Date(end).getTime() : Date.now();

      filteredReports = errorReports.filter(report => 
        report.timestamp >= startTime && report.timestamp <= endTime
      );
    }

    // Calculate statistics
    const totalErrors = filteredReports.length;
    
    // Errors by level
    const errorsByLevel = filteredReports.reduce((acc, report) => {
      acc[report.level] = (acc[report.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Errors by template
    const templateErrors = new Map<string, number>();
    filteredReports.forEach(report => {
      if (report.context.templateId) {
        const current = templateErrors.get(report.context.templateId) || 0;
        templateErrors.set(report.context.templateId, current + 1);
      }
    });

    const errorsByTemplate = Array.from(templateErrors.entries())
      .map(([templateId, count]) => ({
        templateId,
        count,
        rate: count / Math.max(totalErrors, 1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Errors by fingerprint
    const fingerprintErrors = new Map<string, { message: string; count: number; firstSeen: number; lastSeen: number }>();
    filteredReports.forEach(report => {
      const current = fingerprintErrors.get(report.fingerprint) || {
        message: report.message,
        count: 0,
        firstSeen: report.timestamp,
        lastSeen: report.timestamp
      };
      
      current.count++;
      current.firstSeen = Math.min(current.firstSeen, report.timestamp);
      current.lastSeen = Math.max(current.lastSeen, report.timestamp);
      
      fingerprintErrors.set(report.fingerprint, current);
    });

    const errorsByFingerprint = Array.from(fingerprintErrors.entries())
      .map(([fingerprint, data]) => ({
        fingerprint,
        message: data.message,
        count: data.count,
        firstSeen: new Date(data.firstSeen).toISOString(),
        lastSeen: new Date(data.lastSeen).toISOString()
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const stats = {
      totalErrors,
      errorsByLevel,
      errorsByTemplate,
      errorsByFingerprint,
      timeRange: {
        start: start || (filteredReports.length > 0 ? new Date(Math.min(...filteredReports.map(r => r.timestamp))).toISOString() : new Date().toISOString()),
        end: end || (filteredReports.length > 0 ? new Date(Math.max(...filteredReports.map(r => r.timestamp))).toISOString() : new Date().toISOString())
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get error stats' },
      { status: 500 }
    );
  }
}