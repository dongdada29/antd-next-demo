#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Monitoring and error tracking setup for AI Coding Template
 * Configures performance monitoring, error tracking, and analytics
 */

class MonitoringSetup {
  constructor() {
    this.configPath = path.join(process.cwd(), 'monitoring');
    this.ensureDirectoryExists(this.configPath);
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateSentryConfig() {
    const config = {
      dsn: process.env.SENTRY_DSN || '',
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend: (event) => {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
      integrations: [
        'BrowserTracing',
        'Replay'
      ],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    };

    const configPath = path.join(this.configPath, 'sentry.config.js');
    const content = `// Sentry configuration for error tracking
import { init, BrowserTracing, Replay } from '@sentry/nextjs';

const config = ${JSON.stringify(config, null, 2)};

init({
  dsn: config.dsn,
  environment: config.environment,
  tracesSampleRate: config.tracesSampleRate,
  profilesSampleRate: config.profilesSampleRate,
  beforeSend: config.beforeSend,
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\\/\\/yourapi\\.domain\\.com\\/api/],
    }),
    new Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: config.replaysSessionSampleRate,
  replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
});

export default config;
`;

    fs.writeFileSync(configPath, content);
    this.log(`Generated Sentry configuration: ${configPath}`);
  }

  generateAnalyticsConfig() {
    const config = {
      googleAnalytics: {
        measurementId: process.env.GA_MEASUREMENT_ID || '',
        enabled: process.env.NODE_ENV === 'production'
      },
      mixpanel: {
        token: process.env.MIXPANEL_TOKEN || '',
        enabled: process.env.NODE_ENV === 'production'
      },
      hotjar: {
        hjid: process.env.HOTJAR_ID || '',
        hjsv: 6,
        enabled: process.env.NODE_ENV === 'production'
      }
    };

    const configPath = path.join(this.configPath, 'analytics.config.js');
    const content = `// Analytics configuration
const config = ${JSON.stringify(config, null, 2)};

// Google Analytics
export const initGA = () => {
  if (config.googleAnalytics.enabled && config.googleAnalytics.measurementId) {
    window.gtag('config', config.googleAnalytics.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Mixpanel
export const initMixpanel = () => {
  if (config.mixpanel.enabled && config.mixpanel.token) {
    mixpanel.init(config.mixpanel.token, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    });
  }
};

// Hotjar
export const initHotjar = () => {
  if (config.hotjar.enabled && config.hotjar.hjid) {
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:config.hotjar.hjid,hjsv:config.hotjar.hjsv};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }
};

// Event tracking
export const trackEvent = (eventName, properties = {}) => {
  // Google Analytics
  if (config.googleAnalytics.enabled && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Mixpanel
  if (config.mixpanel.enabled && window.mixpanel) {
    window.mixpanel.track(eventName, properties);
  }
};

export default config;
`;

    fs.writeFileSync(configPath, content);
    this.log(`Generated Analytics configuration: ${configPath}`);
  }

  generatePerformanceConfig() {
    const config = {
      webVitals: {
        enabled: true,
        reportingEndpoint: process.env.WEB_VITALS_ENDPOINT || '/api/web-vitals',
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
      },
      lighthouse: {
        enabled: true,
        thresholds: {
          performance: 90,
          accessibility: 95,
          bestPractices: 90,
          seo: 90
        }
      },
      bundleAnalyzer: {
        enabled: process.env.ANALYZE === 'true',
        openAnalyzer: false,
        generateStatsFile: true
      }
    };

    const configPath = path.join(this.configPath, 'performance.config.js');
    const content = `// Performance monitoring configuration
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const config = ${JSON.stringify(config, null, 2)};

// Web Vitals reporting
export const reportWebVitals = (metric) => {
  if (!config.webVitals.enabled) return;
  
  // Sample rate check
  if (Math.random() > config.webVitals.sampleRate) return;
  
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  });

  // Send to reporting endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon(config.webVitals.reportingEndpoint, body);
  } else {
    fetch(config.webVitals.reportingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(console.error);
  }
};

// Initialize Web Vitals monitoring
export const initWebVitals = () => {
  if (!config.webVitals.enabled) return;
  
  getCLS(reportWebVitals);
  getFID(reportWebVitals);
  getFCP(reportWebVitals);
  getLCP(reportWebVitals);
  getTTFB(reportWebVitals);
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if (!window.PerformanceObserver) return;
  
  // Long tasks
  const longTaskObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 50) {
        reportWebVitals({
          name: 'long-task',
          value: entry.duration,
          id: \`long-task-\${Date.now()}\`,
          delta: entry.duration,
        });
      }
    });
  });
  
  try {
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
  }
  
  // Layout shifts
  const layoutShiftObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        reportWebVitals({
          name: 'layout-shift',
          value: entry.value,
          id: \`layout-shift-\${Date.now()}\`,
          delta: entry.value,
        });
      }
    });
  });
  
  try {
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Layout shift API not supported
  }
};

export default config;
`;

    fs.writeFileSync(configPath, content);
    this.log(`Generated Performance configuration: ${configPath}`);
  }

  generateHealthCheckEndpoint() {
    const healthCheckPath = path.join(process.cwd(), 'src/app/api/health/route.ts');
    const content = `import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database?: boolean;
    redis?: boolean;
    external_apis?: boolean;
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const checks: HealthStatus['checks'] = {};
    
    // Add your health checks here
    // Example: Database check
    // checks.database = await checkDatabase();
    
    // Example: Redis check
    // checks.redis = await checkRedis();
    
    // Example: External API check
    // checks.external_apis = await checkExternalAPIs();
    
    const allChecksPass = Object.values(checks).every(check => check !== false);
    
    const healthStatus: HealthStatus = {
      status: allChecksPass ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks,
    };
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        ...healthStatus,
        responseTime: \`\${responseTime}ms\`,
      },
      {
        status: allChecksPass ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: \`\${Date.now() - startTime}ms\`,
      },
      { status: 503 }
    );
  }
}
`;

    // Ensure directory exists
    const healthDir = path.dirname(healthCheckPath);
    this.ensureDirectoryExists(healthDir);
    
    fs.writeFileSync(healthCheckPath, content);
    this.log(`Generated Health Check endpoint: ${healthCheckPath}`);
  }

  generateMetricsEndpoint() {
    const metricsPath = path.join(process.cwd(), 'src/app/api/metrics/route.ts');
    const content = `import { NextRequest, NextResponse } from 'next/server';

interface Metrics {
  timestamp: string;
  system: {
    memory: NodeJS.MemoryUsage;
    uptime: number;
    version: string;
  };
  performance: {
    responseTime: number;
    requestCount: number;
    errorCount: number;
  };
  custom: Record<string, any>;
}

// Simple in-memory metrics store (use Redis in production)
let requestCount = 0;
let errorCount = 0;
const startTime = Date.now();

export async function GET(request: NextRequest) {
  const requestStartTime = Date.now();
  
  try {
    requestCount++;
    
    const metrics: Metrics = {
      timestamp: new Date().toISOString(),
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        version: process.version,
      },
      performance: {
        responseTime: Date.now() - requestStartTime,
        requestCount,
        errorCount,
      },
      custom: {
        // Add your custom metrics here
        applicationStartTime: startTime,
        environment: process.env.NODE_ENV,
      },
    };
    
    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    errorCount++;
    
    return NextResponse.json(
      {
        error: 'Failed to collect metrics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle custom metrics submission
    // In production, you'd store these in a time-series database
    console.log('Custom metrics received:', body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid metrics data' },
      { status: 400 }
    );
  }
}
`;

    // Ensure directory exists
    const metricsDir = path.dirname(metricsPath);
    this.ensureDirectoryExists(metricsDir);
    
    fs.writeFileSync(metricsPath, content);
    this.log(`Generated Metrics endpoint: ${metricsPath}`);
  }

  generateWebVitalsEndpoint() {
    const webVitalsPath = path.join(process.cwd(), 'src/app/api/web-vitals/route.ts');
    const content = `import { NextRequest, NextResponse } from 'next/server';

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  url: string;
  timestamp: number;
  userAgent: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();
    
    // Validate metric data
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }
    
    // Log metric (in production, send to analytics service)
    console.log('Web Vital metric:', {
      name: metric.name,
      value: metric.value,
      url: metric.url,
      timestamp: new Date(metric.timestamp).toISOString(),
    });
    
    // Here you would typically:
    // 1. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 2. Store in time-series database
    // 3. Trigger alerts if thresholds are exceeded
    
    // Example: Send to Google Analytics
    if (process.env.GA_MEASUREMENT_ID) {
      // Implementation would go here
    }
    
    // Example: Store in database
    // await storeMetric(metric);
    
    // Example: Check thresholds and alert
    // await checkThresholds(metric);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing web vital metric:', error);
    
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    );
  }
}
`;

    // Ensure directory exists
    const webVitalsDir = path.dirname(webVitalsPath);
    this.ensureDirectoryExists(webVitalsDir);
    
    fs.writeFileSync(webVitalsPath, content);
    this.log(`Generated Web Vitals endpoint: ${webVitalsPath}`);
  }

  generateDockerHealthCheck() {
    const dockerfilePath = path.join(process.cwd(), 'Dockerfile.monitoring');
    const content = `# Multi-stage build for monitoring-enabled deployment
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
`;

    fs.writeFileSync(dockerfilePath, content);
    this.log(`Generated Docker monitoring configuration: ${dockerfilePath}`);
  }

  async setup() {
    this.log('Setting up monitoring and error tracking...');
    
    try {
      this.generateSentryConfig();
      this.generateAnalyticsConfig();
      this.generatePerformanceConfig();
      this.generateHealthCheckEndpoint();
      this.generateMetricsEndpoint();
      this.generateWebVitalsEndpoint();
      this.generateDockerHealthCheck();
      
      this.log('✅ Monitoring setup completed successfully!');
      this.log('Next steps:');
      this.log('1. Configure environment variables for external services');
      this.log('2. Install required dependencies: @sentry/nextjs, web-vitals');
      this.log('3. Update your application to use the monitoring hooks');
      this.log('4. Set up external monitoring services (Sentry, GA, etc.)');
      
    } catch (error) {
      this.log(`❌ Monitoring setup failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const monitoring = new MonitoringSetup();
  
  try {
    await monitoring.setup();
    process.exit(0);
  } catch (error) {
    console.error('Monitoring setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { MonitoringSetup };