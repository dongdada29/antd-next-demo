'use client';

import React from 'react';
import { Card, Progress, Row, Col, Statistic, Tag, Alert } from 'antd';
import { 
  ThunderboltOutlined, 
  ClockCircleOutlined, 
  WifiOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export const PerformanceMonitor: React.FC = () => {
  const { metrics, isSupported, getPerformanceScore } = usePerformanceMonitor();

  if (!isSupported) {
    return (
      <Alert
        message="性能监控不可用"
        description="当前浏览器不支持 Performance API"
        type="warning"
        showIcon
      />
    );
  }

  const score = getPerformanceScore();

  const getScoreColor = (score: number | null) => {
    if (!score) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'exception';
  };

  const formatTime = (time: number) => {
    return time ? `${time.toFixed(2)}ms` : 'N/A';
  };

  const formatSize = (size: number) => {
    return size ? `${size.toFixed(2)}MB` : 'N/A';
  };

  return (
    <div style={{ padding: '16px' }}>
      <Row gutter={[16, 16]}>
        {/* 性能评分 */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="性能评分"
              value={score || 0}
              suffix="/ 100"
              prefix={<ThunderboltOutlined />}
            />
            {score && (
              <Progress
                percent={score}
                status={getScoreColor(score) as any}
                showInfo={false}
                size="small"
              />
            )}
          </Card>
        </Col>

        {/* 页面加载性能 */}
        <Col xs={24} sm={12} md={18}>
          <Card title="页面加载性能" size="small">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="首次内容绘制"
                  value={formatTime(metrics.pageLoad?.firstContentfulPaint || 0)}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="最大内容绘制"
                  value={formatTime(metrics.pageLoad?.largestContentfulPaint || 0)}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="DOM 加载完成"
                  value={formatTime(metrics.pageLoad?.domContentLoaded || 0)}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="页面加载完成"
                  value={formatTime(metrics.pageLoad?.loadComplete || 0)}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 运行时性能 */}
        <Col xs={24} sm={12} md={12}>
          <Card title="运行时性能" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="内存使用"
                  value={formatSize(metrics.runtime?.memoryUsage || 0)}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="JS 堆大小"
                  value={formatSize(metrics.runtime?.jsHeapSize || 0)}
                />
              </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
              <Tag color="blue">
                组件数量: {metrics.runtime?.componentCount || 0}
              </Tag>
            </div>
          </Card>
        </Col>

        {/* 网络性能 */}
        <Col xs={24} sm={12} md={12}>
          <Card title="网络性能" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="连接类型"
                  value={metrics.network?.connectionType || 'unknown'}
                  prefix={<WifiOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="下行速度"
                  value={metrics.network?.downlink || 0}
                  suffix="Mbps"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="往返时间"
                  value={metrics.network?.rtt || 0}
                  suffix="ms"
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 用户交互性能 */}
        {metrics.interaction && (
          <Col xs={24}>
            <Card title="用户交互性能" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="首次输入延迟"
                    value={formatTime(metrics.interaction.firstInputDelay || 0)}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="累积布局偏移"
                    value={(metrics.interaction.cumulativeLayoutShift || 0).toFixed(4)}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

// 轻量级性能指示器
export const PerformanceIndicator: React.FC = () => {
  const { getPerformanceScore } = usePerformanceMonitor();
  const score = getPerformanceScore();

  if (!score) return null;

  const getColor = () => {
    if (score >= 90) return '#52c41a';
    if (score >= 70) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'white',
        borderRadius: '4px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `2px solid ${getColor()}`,
      }}
    >
      <div style={{ fontSize: '12px', color: '#666' }}>性能评分</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: getColor() }}>
        {score}
      </div>
    </div>
  );
};