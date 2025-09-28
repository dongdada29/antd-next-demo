import { NextRequest, NextResponse } from 'next/server';
import { maintenanceSystem } from '@/lib/maintenance-system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'tasks':
        const tasks = maintenanceSystem.getTasks();
        return NextResponse.json({ tasks });

      case 'health':
        const health = await maintenanceSystem.getSystemHealth();
        return NextResponse.json(health);

      case 'optimize':
        const optimization = await maintenanceSystem.optimizeSystem();
        return NextResponse.json(optimization);

      default:
        return NextResponse.json({
          status: 'running',
          tasks: maintenanceSystem.getTasks().length,
          timestamp: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Maintenance API error:', error);
    return NextResponse.json(
      { error: 'Failed to process maintenance request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, taskId } = body;

    switch (action) {
      case 'run_task':
        if (!taskId) {
          return NextResponse.json(
            { error: 'Task ID is required' },
            { status: 400 }
          );
        }

        await maintenanceSystem.runTask(taskId);
        return NextResponse.json({ success: true, message: 'Task started' });

      case 'enable_task':
        if (!taskId) {
          return NextResponse.json(
            { error: 'Task ID is required' },
            { status: 400 }
          );
        }

        maintenanceSystem.setTaskEnabled(taskId, true);
        return NextResponse.json({ success: true, message: 'Task enabled' });

      case 'disable_task':
        if (!taskId) {
          return NextResponse.json(
            { error: 'Task ID is required' },
            { status: 400 }
          );
        }

        maintenanceSystem.setTaskEnabled(taskId, false);
        return NextResponse.json({ success: true, message: 'Task disabled' });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Maintenance API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}