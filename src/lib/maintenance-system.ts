/**
 * Automated Maintenance System
 * Handles automated updates, cleanup, optimization, and system health checks
 */

import { templateUpdater } from './template-updater';
import { usageAnalytics } from './usage-analytics';
import { errorTracker } from './error-tracking';

export interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  schedule: string; // cron expression
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  result?: {
    success: boolean;
    message: string;
    duration: number;
    details?: Record<string, any>;
  };
}

export interface MaintenanceConfig {
  enableAutoUpdates: boolean;
  enableCleanup: boolean;
  enableOptimization: boolean;
  enableHealthChecks: boolean;
  notificationEndpoint?: string;
  maxConcurrentTasks: number;
  taskTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  checks: {
    diskSpace: { status: 'ok' | 'warning' | 'critical'; usage: number; available: number };
    memory: { status: 'ok' | 'warning' | 'critical'; usage: number; available: number };
    errorRate: { status: 'ok' | 'warning' | 'critical'; rate: number; threshold: number };
    performance: { status: 'ok' | 'warning' | 'critical'; avgResponseTime: number; threshold: number };
    dependencies: { status: 'ok' | 'warning' | 'critical'; failing: string[] };
  };
  timestamp: string;
}

export class MaintenanceSystem {
  private config: MaintenanceConfig;
  private tasks: Map<string, MaintenanceTask> = new Map();
  private runningTasks: Set<string> = new Set();
  private schedulers: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: Partial<MaintenanceConfig> = {}) {
    this.config = {
      enableAutoUpdates: true,
      enableCleanup: true,
      enableOptimization: true,
      enableHealthChecks: true,
      maxConcurrentTasks: 3,
      taskTimeout: 30 * 60 * 1000, // 30 minutes
      retryAttempts: 3,
      retryDelay: 5 * 60 * 1000, // 5 minutes
      ...config
    };

    this.initializeDefaultTasks();
    this.startSchedulers();
  }

  /**
   * Add a maintenance task
   */
  addTask(task: Omit<MaintenanceTask, 'status' | 'result'>): void {
    const fullTask: MaintenanceTask = {
      ...task,
      status: 'idle'
    };

    this.tasks.set(task.id, fullTask);
    this.scheduleTask(fullTask);
  }

  /**
   * Remove a maintenance task
   */
  removeTask(taskId: string): void {
    this.tasks.delete(taskId);
    
    const scheduler = this.schedulers.get(taskId);
    if (scheduler) {
      clearInterval(scheduler);
      this.schedulers.delete(taskId);
    }
  }

  /**
   * Run a task immediately
   */
  async runTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (this.runningTasks.has(taskId)) {
      throw new Error(`Task already running: ${taskId}`);
    }

    if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
      throw new Error('Maximum concurrent tasks reached');
    }

    await this.executeTask(task);
  }

  /**
   * Get all tasks
   */
  getTasks(): MaintenanceTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): MaintenanceTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Enable/disable a task
   */
  setTaskEnabled(taskId: string, enabled: boolean): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = enabled;
      
      if (enabled) {
        this.scheduleTask(task);
      } else {
        const scheduler = this.schedulers.get(taskId);
        if (scheduler) {
          clearInterval(scheduler);
          this.schedulers.delete(taskId);
        }
      }
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const checks = await Promise.all([
      this.checkDiskSpace(),
      this.checkMemoryUsage(),
      this.checkErrorRate(),
      this.checkPerformance(),
      this.checkDependencies()
    ]);

    const [diskSpace, memory, errorRate, performance, dependencies] = checks;

    const overall = this.determineOverallHealth([
      diskSpace.status,
      memory.status,
      errorRate.status,
      performance.status,
      dependencies.status
    ]);

    return {
      overall,
      checks: {
        diskSpace,
        memory,
        errorRate,
        performance,
        dependencies
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Run system optimization
   */
  async optimizeSystem(): Promise<{
    success: boolean;
    optimizations: {
      name: string;
      success: boolean;
      details: string;
      timeSaved?: number;
      spaceSaved?: number;
    }[];
  }> {
    const optimizations = [];

    // Clean up old logs
    try {
      const logCleanup = await this.cleanupLogs();
      optimizations.push({
        name: 'Log Cleanup',
        success: true,
        details: `Cleaned up ${logCleanup.filesRemoved} log files`,
        spaceSaved: logCleanup.spaceSaved
      });
    } catch (error) {
      optimizations.push({
        name: 'Log Cleanup',
        success: false,
        details: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Clean up temporary files
    try {
      const tempCleanup = await this.cleanupTempFiles();
      optimizations.push({
        name: 'Temporary Files Cleanup',
        success: true,
        details: `Cleaned up ${tempCleanup.filesRemoved} temporary files`,
        spaceSaved: tempCleanup.spaceSaved
      });
    } catch (error) {
      optimizations.push({
        name: 'Temporary Files Cleanup',
        success: false,
        details: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Optimize database (if applicable)
    try {
      const dbOptimization = await this.optimizeDatabase();
      optimizations.push({
        name: 'Database Optimization',
        success: true,
        details: `Optimized database queries`,
        timeSaved: dbOptimization.timeSaved
      });
    } catch (error) {
      optimizations.push({
        name: 'Database Optimization',
        success: false,
        details: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Clear caches
    try {
      const cacheCleanup = await this.clearCaches();
      optimizations.push({
        name: 'Cache Cleanup',
        success: true,
        details: `Cleared ${cacheCleanup.cachesCleaned} caches`,
        spaceSaved: cacheCleanup.spaceSaved
      });
    } catch (error) {
      optimizations.push({
        name: 'Cache Cleanup',
        success: false,
        details: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    const success = optimizations.every(opt => opt.success);
    return { success, optimizations };
  }

  /**
   * Stop maintenance system
   */
  stop(): void {
    // Clear all schedulers
    for (const scheduler of this.schedulers.values()) {
      clearInterval(scheduler);
    }
    this.schedulers.clear();

    // Wait for running tasks to complete (with timeout)
    const timeout = setTimeout(() => {
      console.warn('Maintenance system stopped with running tasks');
    }, 30000);

    Promise.all(
      Array.from(this.runningTasks).map(taskId => 
        new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (!this.runningTasks.has(taskId)) {
              clearInterval(checkInterval);
              resolve(undefined);
            }
          }, 1000);
        })
      )
    ).then(() => {
      clearTimeout(timeout);
    });
  }

  private initializeDefaultTasks(): void {
    if (this.config.enableAutoUpdates) {
      this.addTask({
        id: 'auto-update-templates',
        name: 'Auto Update Templates',
        description: 'Check and update templates automatically',
        schedule: '0 2 * * *', // Daily at 2 AM
        enabled: true
      });
    }

    if (this.config.enableCleanup) {
      this.addTask({
        id: 'cleanup-logs',
        name: 'Cleanup Logs',
        description: 'Remove old log files',
        schedule: '0 3 * * 0', // Weekly on Sunday at 3 AM
        enabled: true
      });

      this.addTask({
        id: 'cleanup-temp-files',
        name: 'Cleanup Temporary Files',
        description: 'Remove temporary files and caches',
        schedule: '0 1 * * *', // Daily at 1 AM
        enabled: true
      });
    }

    if (this.config.enableOptimization) {
      this.addTask({
        id: 'optimize-system',
        name: 'System Optimization',
        description: 'Run system optimization tasks',
        schedule: '0 4 * * 0', // Weekly on Sunday at 4 AM
        enabled: true
      });
    }

    if (this.config.enableHealthChecks) {
      this.addTask({
        id: 'health-check',
        name: 'System Health Check',
        description: 'Check system health and send alerts',
        schedule: '*/15 * * * *', // Every 15 minutes
        enabled: true
      });
    }
  }

  private scheduleTask(task: MaintenanceTask): void {
    if (!task.enabled) return;

    // Parse cron expression and calculate next run time
    const nextRun = this.calculateNextRun(task.schedule);
    task.nextRun = nextRun.toISOString();

    // Set up scheduler
    const scheduler = setInterval(async () => {
      if (task.enabled && !this.runningTasks.has(task.id)) {
        await this.executeTask(task);
      }
    }, this.calculateInterval(task.schedule));

    this.schedulers.set(task.id, scheduler);
  }

  private async executeTask(task: MaintenanceTask): Promise<void> {
    if (this.runningTasks.has(task.id)) {
      return;
    }

    this.runningTasks.add(task.id);
    task.status = 'running';
    
    const startTime = Date.now();
    let success = false;
    let message = '';
    let details: Record<string, any> = {};

    try {
      // Set timeout for task execution
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Task timeout')), this.config.taskTimeout);
      });

      const taskPromise = this.runTaskLogic(task);
      const result = await Promise.race([taskPromise, timeoutPromise]) as any;

      success = true;
      message = result.message || 'Task completed successfully';
      details = result.details || {};

    } catch (error) {
      success = false;
      message = error instanceof Error ? error.message : 'Unknown error';
      
      // Retry logic
      if (task.result?.success === false) {
        const retryCount = (task.result.details?.retryCount || 0) + 1;
        
        if (retryCount <= this.config.retryAttempts) {
          details.retryCount = retryCount;
          setTimeout(() => {
            this.executeTask(task);
          }, this.config.retryDelay);
          return;
        }
      }
    } finally {
      const duration = Date.now() - startTime;
      
      task.status = success ? 'completed' : 'failed';
      task.lastRun = new Date().toISOString();
      task.result = {
        success,
        message,
        duration,
        details
      };

      this.runningTasks.delete(task.id);

      // Send notification if configured
      if (this.config.notificationEndpoint) {
        await this.sendNotification(task);
      }
    }
  }

  private async runTaskLogic(task: MaintenanceTask): Promise<{ message: string; details?: Record<string, any> }> {
    switch (task.id) {
      case 'auto-update-templates':
        const updates = await templateUpdater.updateAll();
        return {
          message: `Updated ${updates.filter(u => u.success).length} templates`,
          details: { updates }
        };

      case 'cleanup-logs':
        const logCleanup = await this.cleanupLogs();
        return {
          message: `Cleaned up ${logCleanup.filesRemoved} log files`,
          details: logCleanup
        };

      case 'cleanup-temp-files':
        const tempCleanup = await this.cleanupTempFiles();
        return {
          message: `Cleaned up ${tempCleanup.filesRemoved} temporary files`,
          details: tempCleanup
        };

      case 'optimize-system':
        const optimization = await this.optimizeSystem();
        return {
          message: `System optimization ${optimization.success ? 'completed' : 'partially completed'}`,
          details: optimization
        };

      case 'health-check':
        const health = await this.getSystemHealth();
        if (health.overall !== 'healthy') {
          throw new Error(`System health check failed: ${health.overall}`);
        }
        return {
          message: 'System health check passed',
          details: health
        };

      default:
        throw new Error(`Unknown task: ${task.id}`);
    }
  }

  private async checkDiskSpace(): Promise<{ status: 'ok' | 'warning' | 'critical'; usage: number; available: number }> {
    // Mock implementation - in production, use actual disk space checking
    const usage = 45; // 45% used
    const available = 55; // 55% available
    
    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (usage > 90) status = 'critical';
    else if (usage > 80) status = 'warning';

    return { status, usage, available };
  }

  private async checkMemoryUsage(): Promise<{ status: 'ok' | 'warning' | 'critical'; usage: number; available: number }> {
    if (typeof process !== 'undefined') {
      const memUsage = process.memoryUsage();
      const totalMem = require('os').totalmem();
      const usage = (memUsage.heapUsed / totalMem) * 100;
      const available = 100 - usage;

      let status: 'ok' | 'warning' | 'critical' = 'ok';
      if (usage > 90) status = 'critical';
      else if (usage > 80) status = 'warning';

      return { status, usage, available };
    }

    return { status: 'ok', usage: 0, available: 100 };
  }

  private async checkErrorRate(): Promise<{ status: 'ok' | 'warning' | 'critical'; rate: number; threshold: number }> {
    try {
      const stats = await errorTracker.getErrorStats();
      const rate = stats.totalErrors / Math.max(stats.totalErrors + 1000, 1); // Mock calculation
      const threshold = 0.05; // 5% error rate threshold

      let status: 'ok' | 'warning' | 'critical' = 'ok';
      if (rate > threshold * 2) status = 'critical';
      else if (rate > threshold) status = 'warning';

      return { status, rate, threshold };
    } catch (error) {
      return { status: 'warning', rate: 0, threshold: 0.05 };
    }
  }

  private async checkPerformance(): Promise<{ status: 'ok' | 'warning' | 'critical'; avgResponseTime: number; threshold: number }> {
    // Mock implementation - in production, use actual performance metrics
    const avgResponseTime = 150; // ms
    const threshold = 500; // ms

    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (avgResponseTime > threshold * 2) status = 'critical';
    else if (avgResponseTime > threshold) status = 'warning';

    return { status, avgResponseTime, threshold };
  }

  private async checkDependencies(): Promise<{ status: 'ok' | 'warning' | 'critical'; failing: string[] }> {
    const failing: string[] = [];
    
    // Check external services
    const services = [
      { name: 'Template Registry', url: 'https://api.ai-template-registry.com/health' },
      { name: 'Analytics Service', url: '/api/analytics/health' }
    ];

    for (const service of services) {
      try {
        const response = await fetch(service.url, { timeout: 5000 } as any);
        if (!response.ok) {
          failing.push(service.name);
        }
      } catch (error) {
        failing.push(service.name);
      }
    }

    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (failing.length > services.length / 2) status = 'critical';
    else if (failing.length > 0) status = 'warning';

    return { status, failing };
  }

  private determineOverallHealth(statuses: Array<'ok' | 'warning' | 'critical'>): 'healthy' | 'warning' | 'critical' {
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  }

  private async cleanupLogs(): Promise<{ filesRemoved: number; spaceSaved: number }> {
    // Mock implementation
    return { filesRemoved: 15, spaceSaved: 1024 * 1024 * 50 }; // 50MB
  }

  private async cleanupTempFiles(): Promise<{ filesRemoved: number; spaceSaved: number }> {
    // Mock implementation
    return { filesRemoved: 32, spaceSaved: 1024 * 1024 * 25 }; // 25MB
  }

  private async optimizeDatabase(): Promise<{ timeSaved: number }> {
    // Mock implementation
    return { timeSaved: 150 }; // 150ms average query time improvement
  }

  private async clearCaches(): Promise<{ cachesCleaned: number; spaceSaved: number }> {
    // Mock implementation
    return { cachesCleaned: 5, spaceSaved: 1024 * 1024 * 10 }; // 10MB
  }

  private calculateNextRun(schedule: string): Date {
    // Simple implementation - in production, use a proper cron parser
    const now = new Date();
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next day
  }

  private calculateInterval(schedule: string): number {
    // Simple implementation - in production, use a proper cron parser
    if (schedule.includes('*/15')) return 15 * 60 * 1000; // 15 minutes
    if (schedule.includes('* * *')) return 24 * 60 * 60 * 1000; // Daily
    return 60 * 60 * 1000; // Default to hourly
  }

  private async sendNotification(task: MaintenanceTask): Promise<void> {
    if (!this.config.notificationEndpoint) return;

    try {
      await fetch(this.config.notificationEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'maintenance_task',
          task: {
            id: task.id,
            name: task.name,
            status: task.status,
            result: task.result
          },
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send maintenance notification:', error);
    }
  }
}

// Default maintenance system instance
export const maintenanceSystem = new MaintenanceSystem();