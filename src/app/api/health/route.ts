import { NextRequest, NextResponse } from 'next/server';

// 健康检查端点
export async function GET(request: NextRequest) {
  try {
    // 检查应用状态
    const healthChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        external_apis: await checkExternalAPIs(),
      }
    };

    // 如果任何检查失败，返回 503
    const hasFailures = Object.values(healthChecks.checks).some(check => !check.healthy);
    
    return NextResponse.json(healthChecks, {
      status: hasFailures ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// 数据库连接检查
async function checkDatabase() {
  try {
    // 这里添加实际的数据库连接检查
    // 例如：await db.raw('SELECT 1');
    return {
      healthy: true,
      responseTime: 0,
      message: 'Database connection successful',
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: 0,
      message: error instanceof Error ? error.message : 'Database check failed',
    };
  }
}

// Redis 连接检查
async function checkRedis() {
  try {
    // 这里添加实际的 Redis 连接检查
    // 例如：await redis.ping();
    return {
      healthy: true,
      responseTime: 0,
      message: 'Redis connection successful',
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: 0,
      message: error instanceof Error ? error.message : 'Redis check failed',
    };
  }
}

// 外部 API 检查
async function checkExternalAPIs() {
  try {
    // 这里添加外部 API 的健康检查
    const checks = await Promise.allSettled([
      // fetch('https://api.example.com/health'),
      // 其他外部服务检查
    ]);

    const allHealthy = checks.every(result => result.status === 'fulfilled');
    
    return {
      healthy: allHealthy,
      responseTime: 0,
      message: allHealthy ? 'All external APIs healthy' : 'Some external APIs failed',
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: 0,
      message: error instanceof Error ? error.message : 'External API check failed',
    };
  }
}