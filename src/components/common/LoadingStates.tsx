'use client';

import React from 'react';
import { Spin, Skeleton, Card, Table, List, Space, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 自定义加载图标
const customLoadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

/**
 * 页面级加载组件
 */
export const PageLoading: React.FC<{
  tip?: string;
  size?: 'small' | 'default' | 'large';
}> = ({ tip = '加载中...', size = 'large' }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    padding: '50px 0'
  }}>
    <Spin indicator={customLoadingIcon} size={size} tip={tip} />
  </div>
);

/**
 * 内容区域加载组件
 */
export const ContentLoading: React.FC<{
  tip?: string;
  children?: React.ReactNode;
}> = ({ tip = '加载中...', children }) => (
  <div style={{ position: 'relative', minHeight: '100px' }}>
    <Spin tip={tip} spinning={true}>
      {children || <div style={{ height: '100px' }} />}
    </Spin>
  </div>
);

/**
 * 按钮加载状态
 */
export const ButtonLoading: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  [key: string]: any;
}> = ({ loading, children, ...props }) => (
  <Button loading={loading} {...props}>
    {children}
  </Button>
);

/**
 * 表格骨架屏
 */
export const TableSkeleton: React.FC<{
  columns?: number;
  rows?: number;
}> = ({ columns = 4, rows = 5 }) => (
  <Card>
    <Skeleton active paragraph={{ rows: rows + 1 }} />
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} style={{ marginBottom: 16 }}>
        <Skeleton.Input 
          style={{ width: '100%', height: 40 }} 
          active 
          size="small" 
        />
      </div>
    ))}
  </Card>
);

/**
 * 列表骨架屏
 */
export const ListSkeleton: React.FC<{
  items?: number;
  avatar?: boolean;
  title?: boolean;
  content?: boolean;
}> = ({ 
  items = 5, 
  avatar = true, 
  title = true, 
  content = true 
}) => (
  <div>
    {Array.from({ length: items }).map((_, index) => (
      <Card key={index} style={{ marginBottom: 16 }}>
        <Skeleton
          avatar={avatar}
          title={title}
          paragraph={{ rows: content ? 2 : 0 }}
          active
        />
      </Card>
    ))}
  </div>
);

/**
 * 表单骨架屏
 */
export const FormSkeleton: React.FC<{
  fields?: number;
}> = ({ fields = 4 }) => (
  <Card>
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index}>
          <Skeleton.Input style={{ width: 100, marginBottom: 8 }} active size="small" />
          <Skeleton.Input style={{ width: '100%' }} active />
        </div>
      ))}
      <Skeleton.Button style={{ width: 100 }} active />
    </Space>
  </Card>
);

/**
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC<{
  count?: number;
  avatar?: boolean;
}> = ({ count = 3, avatar = false }) => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} style={{ width: 300 }}>
        <Skeleton
          avatar={avatar}
          title={{ width: '60%' }}
          paragraph={{ rows: 3 }}
          active
        />
      </Card>
    ))}
  </div>
);

/**
 * 详情页骨架屏
 */
export const DetailSkeleton: React.FC = () => (
  <Card>
    <div style={{ marginBottom: 24 }}>
      <Skeleton.Input style={{ width: 200, height: 32 }} active />
    </div>
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      <Skeleton.Avatar size={64} active />
      <div style={{ flex: 1 }}>
        <Skeleton title={{ width: '40%' }} paragraph={{ rows: 2 }} active />
      </div>
    </div>
    <Skeleton paragraph={{ rows: 6 }} active />
  </Card>
);

/**
 * 统计卡片骨架屏
 */
export const StatsSkeleton: React.FC<{
  count?: number;
}> = ({ count = 4 }) => (
  <div style={{ display: 'flex', gap: 16 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} style={{ flex: 1, textAlign: 'center' }}>
        <Skeleton.Input style={{ width: 60, height: 40, marginBottom: 8 }} active />
        <Skeleton.Input style={{ width: 80 }} active size="small" />
      </Card>
    ))}
  </div>
);

/**
 * 图表骨架屏
 */
export const ChartSkeleton: React.FC<{
  height?: number;
}> = ({ height = 300 }) => (
  <Card>
    <div style={{ marginBottom: 16 }}>
      <Skeleton.Input style={{ width: 150 }} active />
    </div>
    <Skeleton.Image style={{ width: '100%', height }} active />
  </Card>
);

/**
 * 搜索结果骨架屏
 */
export const SearchSkeleton: React.FC<{
  results?: number;
}> = ({ results = 5 }) => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <Skeleton.Input style={{ width: '100%', height: 40 }} active />
    </div>
    {Array.from({ length: results }).map((_, index) => (
      <Card key={index} style={{ marginBottom: 16 }}>
        <Skeleton
          title={{ width: '70%' }}
          paragraph={{ rows: 2, width: ['100%', '80%'] }}
          active
        />
      </Card>
    ))}
  </div>
);

/**
 * 导航骨架屏
 */
export const NavigationSkeleton: React.FC = () => (
  <div style={{ padding: 16 }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton.Input key={index} style={{ width: '100%' }} active size="large" />
      ))}
    </Space>
  </div>
);

/**
 * 智能加载组件
 * 根据加载时间自动切换显示方式
 */
export const SmartLoading: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  delay?: number; // 延迟显示加载状态的时间（毫秒）
  timeout?: number; // 超时后显示骨架屏的时间（毫秒）
}> = ({ 
  loading, 
  children, 
  skeleton, 
  delay = 200, 
  timeout = 1000 
}) => {
  const [showLoading, setShowLoading] = React.useState(false);
  const [showSkeleton, setShowSkeleton] = React.useState(false);

  React.useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;

    if (loading) {
      // 延迟显示加载状态
      delayTimer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      // 超时后显示骨架屏
      if (skeleton) {
        timeoutTimer = setTimeout(() => {
          setShowSkeleton(true);
        }, timeout);
      }
    } else {
      setShowLoading(false);
      setShowSkeleton(false);
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(timeoutTimer);
    };
  }, [loading, delay, timeout, skeleton]);

  if (!loading) {
    return <>{children}</>;
  }

  if (showSkeleton && skeleton) {
    return <>{skeleton}</>;
  }

  if (showLoading) {
    return <ContentLoading />;
  }

  return <>{children}</>;
};