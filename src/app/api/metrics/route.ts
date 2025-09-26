import { NextRequest, NextResponse } from 'next/server';

// Prometheus 指标端点
export async function GET(request: NextRequest) {
  try {
    const metrics = await collectMetrics();
    
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to collect metrics' },
      { status: 500 }
    );
  }
}

async function collectMetrics(): Promise<string> {
  const timestamp = Date.now();
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  // 基础系统指标
  const metrics = [
    // 应用信息
    `# HELP app_info Application information`,
    `# TYPE app_info gauge`,
    `app_info{version="${process.env.npm_package_version || '1.0.0'}",environment="${process.env.NODE_ENV || 'development'}"} 1`,
    
    // 运行时间
    `# HELP app_uptime_seconds Application uptime in seconds`,
    `# TYPE app_uptime_seconds counter`,
    `app_uptime_seconds ${uptime}`,
    
    // 内存使用
    `# HELP app_memory_usage_bytes Memory usage in bytes`,
    `# TYPE app_memory_usage_bytes gauge`,
    `app_memory_usage_bytes{type="rss"} ${memoryUsage.rss}`,
    `app_memory_usage_bytes{type="heapTotal"} ${memoryUsage.heapTotal}`,
    `app_memory_usage_bytes{type="heapUsed"} ${memoryUsage.heapUsed}`,
    `app_memory_usage_bytes{type="external"} ${memoryUsage.external}`,
    
    // CPU 使用率（如果可用）
    `# HELP app_cpu_usage_percent CPU usage percentage`,
    `# TYPE app_cpu_usage_percent gauge`,
    `app_cpu_usage_percent ${await getCPUUsage()}`,
    
    // HTTP 请求指标（需要中间件收集）
    `# HELP http_requests_total Total number of HTTP requests`,
    `# TYPE http_requests_total counter`,
    ...getHttpMetrics(),
    
    // 自定义业务指标
    `# HELP app_active_users_total Total number of active users`,
    `# TYPE app_active_users_total gauge`,
    `app_active_users_total ${await getActiveUsersCount()}`,
    
    // 错误率
    `# HELP app_errors_total Total number of application errors`,
    `# TYPE app_errors_total counter`,
    ...getErrorMetrics(),
    
    // 响应时间
    `# HELP http_request_duration_seconds HTTP request duration in seconds`,
    `# TYPE http_request_duration_seconds histogram`,
    ...getResponseTimeMetrics(),
  ];
  
  return metrics.join('\n') + '\n';
}

// 获取 CPU 使用率
async function getCPUUsage(): Promise<number> {
  try {
    const startUsage = process.cpuUsage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endUsage = process.cpuUsage(startUsage);
    
    const totalUsage = endUsage.user + endUsage.system;
    const percentage = (totalUsage / 100000) / 1; // 转换为百分比
    
    return Math.min(100, Math.max(0, percentage));
  } catch {
    return 0;
  }
}

// HTTP 请求指标（需要全局状态管理）
function getHttpMetrics(): string[] {
  // 这里应该从全局状态或缓存中获取 HTTP 指标
  // 实际实现需要中间件来收集这些数据
  const mockData = {
    'GET /api/users': 150,
    'POST /api/users': 25,
    'GET /api/health': 300,
  };
  
  return Object.entries(mockData).map(([route, count]) => {
    const [method, path] = route.split(' ');
    return `http_requests_total{method="${method}",path="${path}",status="200"} ${count}`;
  });
}

// 获取活跃用户数
async function getActiveUsersCount(): Promise<number> {
  try {
    // 这里应该从数据库或缓存中获取实际的活跃用户数
    return Math.floor(Math.random() * 1000);
  } catch {
    return 0;
  }
}

// 错误指标
function getErrorMetrics(): string[] {
  // 这里应该从错误收集系统中获取数据
  const mockErrors = {
    'TypeError': 5,
    'NetworkError': 2,
    'ValidationError': 8,
  };
  
  return Object.entries(mockErrors).map(([type, count]) => 
    `app_errors_total{type="${type}"} ${count}`
  );
}

// 响应时间指标
function getResponseTimeMetrics(): string[] {
  // 这里应该从性能监控中获取实际数据
  const buckets = [0.1, 0.25, 0.5, 1, 2.5, 5, 10];
  const mockData = {
    '/api/users': { count: 100, sum: 50.5 },
    '/api/health': { count: 200, sum: 20.2 },
  };
  
  const metrics: string[] = [];
  
  Object.entries(mockData).forEach(([path, data]) => {
    buckets.forEach(bucket => {
      const count = Math.floor(data.count * Math.random());
      metrics.push(`http_request_duration_seconds_bucket{path="${path}",le="${bucket}"} ${count}`);
    });
    
    metrics.push(`http_request_duration_seconds_bucket{path="${path}",le="+Inf"} ${data.count}`);
    metrics.push(`http_request_duration_seconds_count{path="${path}"} ${data.count}`);
    metrics.push(`http_request_duration_seconds_sum{path="${path}"} ${data.sum}`);
  });
  
  return metrics;
}