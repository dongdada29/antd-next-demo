/**
 * Usage Analytics System
 * Tracks template usage, performance metrics, and user behavior
 */

export interface UsageEvent {
  type: 'template_download' | 'template_install' | 'template_update' | 'component_generate' | 'page_generate' | 'error' | 'ai_generation' | 'user_feedback' | 'performance_metric';
  templateId?: string;
  templateVersion?: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, any>;
  performance?: {
    duration: number;
    memoryUsage: number;
    cpuUsage?: number;
  };
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  aiGeneration?: {
    promptType: string;
    component: string;
    codeQuality: number;
    success: boolean;
    issues: string[];
    generationTime: number;
  };
  feedback?: {
    rating: number;
    category: string;
    comment?: string;
    context?: string;
  };
}

export interface UsageStats {
  totalEvents: number;
  uniqueUsers: number;
  popularTemplates: {
    templateId: string;
    templateName: string;
    downloads: number;
    installs: number;
    rating: number;
  }[];
  errorRate: number;
  averagePerformance: {
    downloadTime: number;
    installTime: number;
    generateTime: number;
  };
  timeRange: {
    start: string;
    end: string;
  };
}

export interface AnalyticsConfig {
  endpoint: string;
  apiKey?: string;
  batchSize: number;
  flushInterval: number;
  enablePerformanceTracking: boolean;
  enableErrorTracking: boolean;
  enableUserTracking: boolean;
  anonymizeData: boolean;
}

export class UsageAnalytics {
  private config: AnalyticsConfig;
  private eventQueue: UsageEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private sessionId: string;
  private userId?: string;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      endpoint: '/api/analytics',
      batchSize: 50,
      flushInterval: 30000, // 30 seconds
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      enableUserTracking: true,
      anonymizeData: true,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  /**
   * Track template download
   */
  trackTemplateDownload(templateId: string, templateVersion: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'template_download',
      templateId,
      templateVersion,
      metadata
    });
  }

  /**
   * Track template installation
   */
  trackTemplateInstall(templateId: string, templateVersion: string, performance?: { duration: number }): void {
    this.trackEvent({
      type: 'template_install',
      templateId,
      templateVersion,
      performance: performance ? {
        duration: performance.duration,
        memoryUsage: this.getMemoryUsage()
      } : undefined
    });
  }

  /**
   * Track template update
   */
  trackTemplateUpdate(templateId: string, fromVersion: string, toVersion: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'template_update',
      templateId,
      templateVersion: toVersion,
      metadata: {
        ...metadata,
        fromVersion,
        toVersion
      }
    });
  }

  /**
   * Track component generation
   */
  trackComponentGenerate(templateId: string, performance?: { duration: number }, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'component_generate',
      templateId,
      performance: performance ? {
        duration: performance.duration,
        memoryUsage: this.getMemoryUsage()
      } : undefined,
      metadata
    });
  }

  /**
   * Track page generation
   */
  trackPageGenerate(templateId: string, performance?: { duration: number }, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'page_generate',
      templateId,
      performance: performance ? {
        duration: performance.duration,
        memoryUsage: this.getMemoryUsage()
      } : undefined,
      metadata
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, templateId?: string, metadata?: Record<string, any>): void {
    if (!this.config.enableErrorTracking) return;

    this.trackEvent({
      type: 'error',
      templateId,
      error: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      },
      metadata
    });
  }

  /**
   * Track AI code generation
   */
  trackAIGeneration(data: {
    promptType: string;
    component: string;
    codeQuality: number;
    success: boolean;
    issues: string[];
    generationTime: number;
    templateId?: string;
    metadata?: Record<string, any>;
  }): void {
    this.trackEvent({
      type: 'ai_generation',
      templateId: data.templateId,
      aiGeneration: {
        promptType: data.promptType,
        component: data.component,
        codeQuality: data.codeQuality,
        success: data.success,
        issues: data.issues,
        generationTime: data.generationTime
      },
      metadata: data.metadata
    });
  }

  /**
   * Track user feedback
   */
  trackUserFeedback(data: {
    rating: number;
    category: string;
    comment?: string;
    context?: string;
    templateId?: string;
    metadata?: Record<string, any>;
  }): void {
    this.trackEvent({
      type: 'user_feedback',
      templateId: data.templateId,
      feedback: {
        rating: data.rating,
        category: data.category,
        comment: data.comment,
        context: data.context
      },
      metadata: data.metadata
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(data: {
    metric: string;
    value: number;
    context?: string;
    templateId?: string;
    metadata?: Record<string, any>;
  }): void {
    this.trackEvent({
      type: 'performance_metric',
      templateId: data.templateId,
      metadata: {
        metric: data.metric,
        value: data.value,
        context: data.context,
        ...data.metadata
      }
    });
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    if (this.config.enableUserTracking) {
      this.userId = this.config.anonymizeData ? this.hashUserId(userId) : userId;
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(timeRange?: { start: Date; end: Date }): Promise<UsageStats> {
    const params = new URLSearchParams();
    
    if (timeRange) {
      params.append('start', timeRange.start.toISOString());
      params.append('end', timeRange.end.toISOString());
    }

    const response = await fetch(`${this.config.endpoint}/stats?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get usage stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get template analytics
   */
  async getTemplateAnalytics(templateId: string, timeRange?: { start: Date; end: Date }): Promise<{
    downloads: number;
    installs: number;
    updates: number;
    errors: number;
    averageRating: number;
    performanceMetrics: {
      averageDownloadTime: number;
      averageInstallTime: number;
      averageGenerateTime: number;
    };
    usageByVersion: {
      version: string;
      count: number;
    }[];
    errorsByType: {
      type: string;
      count: number;
    }[];
  }> {
    const params = new URLSearchParams({ templateId });
    
    if (timeRange) {
      params.append('start', timeRange.start.toISOString());
      params.append('end', timeRange.end.toISOString());
    }

    const response = await fetch(`${this.config.endpoint}/template-analytics?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get template analytics: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Flush events immediately
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.sendEvents(events);
    } catch (error) {
      // Re-queue events if sending failed
      this.eventQueue.unshift(...events);
      throw error;
    }
  }

  /**
   * Stop analytics tracking
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Flush remaining events
    this.flush().catch(console.error);
  }

  private trackEvent(event: Omit<UsageEvent, 'sessionId' | 'timestamp' | 'userId'>): void {
    const fullEvent: UsageEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userId: this.userId
    };

    this.eventQueue.push(fullEvent);

    // Flush if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush().catch(console.error);
    }
  }

  private async sendEvents(events: UsageEvent[]): Promise<void> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error(`Failed to send analytics events: ${response.statusText}`);
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

  private hashUserId(userId: string): string {
    // Simple hash function for anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash).toString(36)}`;
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    
    // Browser environment
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }

    return 0;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'AI-Template-Analytics/1.0.0'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }
}

// Performance tracking utilities
export class PerformanceTracker {
  private startTime: number;
  private marks: Map<string, number> = new Map();

  constructor() {
    this.startTime = performance.now();
  }

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark?: string): number {
    const endTime = performance.now();
    const startTime = startMark ? this.marks.get(startMark) || this.startTime : this.startTime;
    const duration = endTime - startTime;
    
    this.marks.set(name, duration);
    return duration;
  }

  getDuration(): number {
    return performance.now() - this.startTime;
  }

  getMarks(): Record<string, number> {
    return Object.fromEntries(this.marks);
  }

  reset(): void {
    this.startTime = performance.now();
    this.marks.clear();
  }
}

// Default analytics instance
export const usageAnalytics = new UsageAnalytics();