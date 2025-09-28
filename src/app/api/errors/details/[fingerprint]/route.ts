import { NextRequest, NextResponse } from 'next/server';

// This would typically come from a database
const errorReports: any[] = []; // Import from the main errors route

export async function GET(
  request: NextRequest,
  { params }: { params: { fingerprint: string } }
) {
  try {
    const { fingerprint } = params;

    // Find all reports with this fingerprint
    const reports = errorReports.filter(report => report.fingerprint === fingerprint);

    if (reports.length === 0) {
      return NextResponse.json(
        { error: 'Error fingerprint not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const firstReport = reports.reduce((earliest, report) => 
      report.timestamp < earliest.timestamp ? report : earliest
    );

    const lastReport = reports.reduce((latest, report) => 
      report.timestamp > latest.timestamp ? report : latest
    );

    const affectedUsers = new Set(reports.map(r => r.context.userId).filter(Boolean)).size;

    // Get recent reports (last 10)
    const recentReports = reports
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    const details = {
      fingerprint,
      message: firstReport.message,
      stack: firstReport.stack,
      occurrences: reports.length,
      firstSeen: new Date(firstReport.timestamp).toISOString(),
      lastSeen: new Date(lastReport.timestamp).toISOString(),
      affectedUsers,
      recentReports: recentReports.map(report => ({
        id: report.id,
        timestamp: new Date(report.timestamp).toISOString(),
        level: report.level,
        context: report.context,
        metadata: report.metadata
      }))
    };

    return NextResponse.json(details);
  } catch (error) {
    console.error('Error details error:', error);
    return NextResponse.json(
      { error: 'Failed to get error details' },
      { status: 500 }
    );
  }
}