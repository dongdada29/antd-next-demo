/**
 * Error Tracking and Reporting System
 * Collects, categorizes, and reports errors for monitoring and debugging
 */

export interface ErrorReport {
  id: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context: {
    templateId?: string;
    templateVersion?: string;
    userId?: string;
    sessionId: string;
    userAgent: string;
    url: string;
    component?: string;
    action?: string;
  };
  metadata?: Record<string, any>;
  fingerprint: string;
  tags: string[];
}

export interface ErrorStats {
  totalErrors: number;
  errorsByLevel: Record<string, number>;
  errorsByTemplate: {
    templateId: string;
    count: number;
    rate: number;
  }[];
  errorsByFingerprint: {
    fingerprint: string;
    message: string;
    count: number;
    firstSeen: string;
    lastSeen: string;
  }[];
  timeRange: {
    start: string;
    end: string;
  };
}

export interface ErrorTrackingConfig {
  endpoint: string;
  apiKey?: string;
  maxReports: number;
  flushInterval: number;
  enableStackTrace: boolean;
  enableBreadcrumbs: boolean;
  enablePerformanceContext: boolean;
  ignorePatterns: RegExp[];
  beforeSend?: (report: ErrorReport) => ErrorReport | null;
}

export class ErrorTracker {
  private config: ErrorTrackingConfig;
  private reportQueue: ErrorReport[] = [];
  private breadcrumbs: Array<{ timestamp: number; message: string; category: string }> = [];
  private flushTimer?: NodeJS.Timeout;
  private sessionId: string;
  private userId?: string;

  constructor(config: Partial<ErrorTrackingConfig> = {}) {
    this.config = {
      endpoint: '/api/errors',
      maxReports: 100,
      flushInterval: 10000, // 10 seconds
      enableStackTrace: true,
      enableBreadcrumbs: true,
      enablePerformanceContext: true,
      ignorePatterns: [
        /Script error/,
        /Non-Error promise rejection captured/,
        /ResizeObserver loop limit exceeded/
      ],
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.startFlushTimer();
  }

  /**
   * Report an error manually
   */
  reportError(error: Error, context?: Partial<ErrorReport['context']>, metadata?: Record<string, any>): void {
    this.captureError(error, 'error', context, metadata);
  }

  /**
   * Report a warning
   */
  reportWarning(message: string, context?: Partial<ErrorReport['context']>, metadata?: Record<string, any>): void {
    this.captureMessage(message, 'warning', context, metadata);
  }

  /**
   * Report an info message
   */
  reportInfo(message: string, context?: Partial<ErrorReport['context']>, metadata?: Record<string, any>): void {
    this.captureMessage(message, 'info', context, metadata);
  }

  /**
   * Add breadcrumb for debugging context
   */
  addBreadcrumb(message: string, category: string = 'default'): void {
    if (!this.config.enableBreadcrumbs) return;

    this.breadcrumbs.push({
      timestamp: Date.now(),
      message,
      category
    });

    // Keep only last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs = this.breadcrumbs.slice(-50);
    }
  }

  /**
   * Set user context
   */
  setUser(userId: string, metadata?: Record<string, any>): void {
    this.userId = userId;
    this.addBreadcrumb(`User set: ${userId}`, 'user');
  }

  /**
   * Set template context
   */
  setTemplateContext(templateId: string, templateVersion: string): void {
    this.addBreadcrumb(`Template context: ${templateId}@${templateVersion}`, 'template');
  }

  /**
   * Get error statistics
   */
  async getErrorStats(timeRange?: { start: Date; end: Date }): Promise<ErrorStats> {
    const params = new URLSearchParams();
    
    if (timeRange) {
      params.append('start', timeRange.start.toISOString());
      params.append('end', timeRange.end.toISOString());
    }

    const response = await fetch(`${this.config.endpoint}/stats?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get error stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get error details by fingerprint
   */
  async getErrorDetails(fingerprint: string): Promise<{
    fingerprint: string;
    message: string;
    stack?: string;
    occurrences: number;
    firstSeen: string;
    lastSeen: string;
    affectedUsers: number;
    recentReports: ErrorReport[];
  }> {
    const response = await fetch(`${this.config.endpoint}/details/${fingerprint}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get error details: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Flush error reports immediately
   */
  async flush(): Promise<void> {
    if (this.reportQueue.length === 0) return;

    const reports = [...this.reportQueue];
    this.reportQueue = [];

    try {
      await this.sendReports(reports);
    } catch (error) {
      // Re-queue reports if sending failed
      this.reportQueue.unshift(...reports);
      throw error;
    }
  }

  /**
   * Stop error tracking
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Remove global error handlers
    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleGlobalError);
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }

    // Flush remaining reports
    this.flush().catch(console.error);
  }

  private captureError(error: Error, level: ErrorReport['level'], context?: Partial<ErrorReport['context']>, metadata?: Record<string, any>): void {
    // Check ignore patterns
    if (this.shouldIgnoreError(error.message)) {
      return;
    }

    const report: ErrorReport = {
      id: this.generateReportId(),
      timestamp: Date.now(),
      level,
      message: error.message,
      stack: this.config.enableStackTrace ? error.stack : undefined,
      context: {
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        ...context
      },
      metadata: {
        ...metadata,
        breadcrumbs: this.config.enableBreadcrumbs ? [...this.breadcrumbs] : undefined,
        performance: this.config.enablePerformanceContext ? this.getPerformanceContext() : undefined
      },
      fingerprint: this.generateFingerprint(error),
      tags: this.generateTags(error, context)
    };

    this.processReport(report);
  }

  private captureMessage(message: string, level: ErrorReport['level'], context?: Partial<ErrorReport['context']>, metadata?: Record<string, any>): void {
    const report: ErrorReport = {
      id: this.generateReportId(),
      timestamp: Date.now(),
      level,
      message,
      context: {
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        ...context
      },
      metadata: {
        ...metadata,
        breadcrumbs: this.config.enableBreadcrumbs ? [...this.breadcrumbs] : undefined
      },
      fingerprint: this.generateMessageFingerprint(message),
      tags: this.generateMessageTags(message, context)
    };

    this.processReport(report);
  }

  private processReport(report: ErrorReport): void {
    // Apply beforeSend hook if configured
    if (this.config.beforeSend) {
      const processedReport = this.config.beforeSend(report);
      if (!processedReport) {
        return; // Report was filtered out
      }
      report = processedReport;
    }

    this.reportQueue.push(report);

    // Flush if queue is full
    if (this.reportQueue.length >= this.config.maxReports) {
      this.flush().catch(console.error);
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle uncaught errors
    window.addEventListener('error', this.handleGlobalError.bind(this));

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  private handleGlobalError(event: ErrorEvent): void {
    this.captureError(
      new Error(event.message),
      'error',
      {
        component: 'global',
        action: 'uncaught_error'
      },
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));

    this.captureError(
      error,
      'error',
      {
        component: 'global',
        action: 'unhandled_rejection'
      }
    );
  }

  private shouldIgnoreError(message: string): boolean {
    return this.config.ignorePatterns.some(pattern => pattern.test(message));
  }

  private generateFingerprint(error: Error): string {
    // Create a fingerprint based on error message and stack trace
    const key = `${error.name}:${error.message}:${this.getStackSignature(error.stack)}`;
    return this.hashString(key);
  }

  private generateMessageFingerprint(message: string): string {
    return this.hashString(message);
  }

  private getStackSignature(stack?: string): string {
    if (!stack) return '';
    
    // Extract function names and file paths from stack trace
    const lines = stack.split('\n').slice(1, 4); // Take first 3 stack frames
    return lines.map(line => {
      const match = line.match(/at\s+(.+?)\s+\((.+?)\)/);
      return match ? `${match[1]}@${match[2]}` : line.trim();
    }).join('|');
  }

  private generateTags(error: Error, context?: Partial<ErrorReport['context']>): string[] {
    const tags = [error.name];
    
    if (context?.templateId) {
      tags.push(`template:${context.templateId}`);
    }
    
    if (context?.component) {
      tags.push(`component:${context.component}`);
    }
    
    if (context?.action) {
      tags.push(`action:${context.action}`);
    }

    return tags;
  }

  private generateMessageTags(message: string, context?: Partial<ErrorReport['context']>): string[] {
    const tags = ['message'];
    
    if (context?.templateId) {
      tags.push(`template:${context.templateId}`);
    }
    
    if (context?.component) {
      tags.push(`component:${context.component}`);
    }

    return tags;
  }

  private getPerformanceContext(): Record<string, any> {
    if (typeof performance === 'undefined') return {};

    const navigation = (performance as any).navigation;
    const memory = (performance as any).memory;

    return {
      timing: {
        loadEventEnd: performance.timing?.loadEventEnd,
        domContentLoadedEventEnd: performance.timing?.domContentLoadedEventEnd,
        responseEnd: performance.timing?.responseEnd
      },
      navigation: navigation ? {
        type: navigation.type,
        redirectCount: navigation.redirectCount
      } : undefined,
      memory: memory ? {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      } : undefined
    };
  }

  private async sendReports(reports: ErrorReport[]): Promise<void> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reports })
    });

    if (!response.ok) {
      throw new Error(`Failed to send error reports: ${response.statusText}`);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, this.config.flushInterval);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'AI-Template-ErrorTracker/1.0.0'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }
}

// Default error tracker instance
export const errorTracker = new ErrorTracker();