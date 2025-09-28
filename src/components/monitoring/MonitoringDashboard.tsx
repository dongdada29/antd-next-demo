'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SystemHealth {
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

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: string;
  nextRun?: string;
  result?: {
    success: boolean;
    message: string;
    duration: number;
  };
}

interface UsageStats {
  totalEvents: number;
  uniqueUsers: number;
  popularTemplates: Array<{
    templateId: string;
    templateName: string;
    downloads: number;
    installs: number;
  }>;
  errorRate: number;
  averagePerformance: {
    downloadTime: number;
    installTime: number;
    generateTime: number;
  };
}

interface ErrorStats {
  totalErrors: number;
  errorsByLevel: Record<string, number>;
  errorsByTemplate: Array<{
    templateId: string;
    count: number;
    rate: number;
  }>;
}

export function MonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'analytics' | 'errors'>('overview');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [healthRes, tasksRes, analyticsRes, errorsRes] = await Promise.all([
        fetch('/api/maintenance?action=health'),
        fetch('/api/maintenance?action=tasks'),
        fetch('/api/analytics'),
        fetch('/api/errors')
      ]);

      if (healthRes.ok) {
        setSystemHealth(await healthRes.json());
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setMaintenanceTasks(tasksData.tasks);
      }

      if (analyticsRes.ok) {
        setUsageStats(await analyticsRes.json());
      }

      if (errorsRes.ok) {
        setErrorStats(await errorsRes.json());
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_task', taskId })
      });

      if (response.ok) {
        loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to run task:', error);
    }
  };

  const toggleTask = async (taskId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: enabled ? 'enable_task' : 'disable_task', 
          taskId 
        })
      });

      if (response.ok) {
        loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
      case 'completed':
        return 'bg-green-500';
      case 'warning':
      case 'running':
        return 'bg-yellow-500';
      case 'critical':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'healthy':
      case 'ok':
      case 'completed':
        return 'default';
      case 'warning':
      case 'running':
        return 'secondary';
      case 'critical':
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
        <Button onClick={loadDashboardData} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tasks', label: 'Maintenance' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'errors', label: 'Errors' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* System Health */}
          {systemHealth && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth.overall)}`}></div>
                  <span className="text-2xl font-bold capitalize">{systemHealth.overall}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last checked: {new Date(systemHealth.timestamp).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Usage Stats */}
          {usageStats && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageStats.totalEvents.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">Unique users: {usageStats.uniqueUsers}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(usageStats.errorRate * 100).toFixed(2)}%</div>
                  <p className="text-xs text-gray-500">
                    Avg response: {usageStats.averagePerformance.downloadTime.toFixed(0)}ms
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Error Stats */}
          {errorStats && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{errorStats.totalErrors.toLocaleString()}</div>
                <p className="text-xs text-gray-500">
                  Critical: {errorStats.errorsByLevel.error || 0}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* System Health Details */}
      {activeTab === 'overview' && systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Disk Space</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Usage: {systemHealth.checks.diskSpace.usage}%</span>
                <Badge variant={getStatusBadgeVariant(systemHealth.checks.diskSpace.status)}>
                  {systemHealth.checks.diskSpace.status}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${getStatusColor(systemHealth.checks.diskSpace.status)}`}
                  style={{ width: `${systemHealth.checks.diskSpace.usage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Usage: {systemHealth.checks.memory.usage.toFixed(1)}%</span>
                <Badge variant={getStatusBadgeVariant(systemHealth.checks.memory.status)}>
                  {systemHealth.checks.memory.status}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${getStatusColor(systemHealth.checks.memory.status)}`}
                  style={{ width: `${systemHealth.checks.memory.usage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Avg: {systemHealth.checks.performance.avgResponseTime}ms</span>
                <Badge variant={getStatusBadgeVariant(systemHealth.checks.performance.status)}>
                  {systemHealth.checks.performance.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Threshold: {systemHealth.checks.performance.threshold}ms
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Maintenance Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Maintenance Tasks</h2>
          <div className="grid gap-4">
            {maintenanceTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{task.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runTask(task.id)}
                        disabled={task.status === 'running'}
                      >
                        Run Now
                      </Button>
                      <Button
                        size="sm"
                        variant={task.enabled ? 'destructive' : 'default'}
                        onClick={() => toggleTask(task.id, !task.enabled)}
                      >
                        {task.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Last Run:</span>{' '}
                      {task.lastRun ? new Date(task.lastRun).toLocaleString() : 'Never'}
                    </div>
                    <div>
                      <span className="font-medium">Next Run:</span>{' '}
                      {task.nextRun ? new Date(task.nextRun).toLocaleString() : 'Not scheduled'}
                    </div>
                    {task.result && (
                      <>
                        <div>
                          <span className="font-medium">Result:</span>{' '}
                          <Badge variant={task.result.success ? 'default' : 'destructive'}>
                            {task.result.success ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>{' '}
                          {(task.result.duration / 1000).toFixed(1)}s
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Message:</span> {task.result.message}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && usageStats && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Usage Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Download Time:</span>
                  <span>{usageStats.averagePerformance.downloadTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Install Time:</span>
                  <span>{usageStats.averagePerformance.installTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Generate Time:</span>
                  <span>{usageStats.averagePerformance.generateTime.toFixed(0)}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Popular Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usageStats.popularTemplates.slice(0, 5).map((template) => (
                    <div key={template.templateId} className="flex items-center justify-between">
                      <span className="font-medium">{template.templateName}</span>
                      <div className="text-sm text-gray-500">
                        {template.downloads} downloads, {template.installs} installs
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Errors Tab */}
      {activeTab === 'errors' && errorStats && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Error Tracking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Errors by Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(errorStats.errorsByLevel).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(level === 'error' ? 'failed' : level)}>
                          {level}
                        </Badge>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errors by Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {errorStats.errorsByTemplate.slice(0, 5).map((template) => (
                    <div key={template.templateId} className="flex items-center justify-between">
                      <span className="font-medium">{template.templateId}</span>
                      <div className="text-sm">
                        {template.count} ({(template.rate * 100).toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}