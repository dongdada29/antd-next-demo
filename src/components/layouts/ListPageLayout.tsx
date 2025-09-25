import { Layout, Card, Button, Space, Breadcrumb } from 'antd';
import { PlusOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

const { Content } = Layout;

interface ListPageLayoutProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  searchForm?: ReactNode;
  onAdd?: () => void;
  onRefresh?: () => void;
  showAddButton?: boolean;
  showRefreshButton?: boolean;
  addButtonText?: string;
  loading?: boolean;
  breadcrumbs?: Array<{
    title: string;
    href?: string;
  }>;
  extra?: ReactNode;
  toolbar?: ReactNode;
}

export const ListPageLayout = ({
  title = '列表页面',
  subtitle,
  children,
  searchForm,
  onAdd,
  onRefresh,
  showAddButton = true,
  showRefreshButton = true,
  addButtonText = '新增',
  loading = false,
  breadcrumbs = [
    { title: '首页', href: '/' },
    { title: '列表页面' }
  ],
  extra,
  toolbar
}: ListPageLayoutProps) => {

  const headerActions = (
    <Space>
      {showRefreshButton && onRefresh && (
        <Button 
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={onRefresh}
        >
          刷新
        </Button>
      )}
      {showAddButton && onAdd && (
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          {addButtonText}
        </Button>
      )}
      {extra}
    </Space>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* 面包屑导航 */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb style={{ marginBottom: 16 }}>
            {breadcrumbs.map((crumb, index) => (
              <Breadcrumb.Item key={index} href={crumb.href}>
                {index === 0 && <HomeOutlined />}
                {crumb.title}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}

        {/* 页面头部 */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start' 
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ 
                  margin: '8px 0 0 0', 
                  color: '#666', 
                  fontSize: 14 
                }}>
                  {subtitle}
                </p>
              )}
            </div>
            {headerActions}
          </div>
        </Card>

        {/* 搜索表单区域 */}
        {searchForm && (
          <div style={{ marginBottom: 24 }}>
            {searchForm}
          </div>
        )}

        {/* 工具栏 */}
        {toolbar && (
          <Card style={{ marginBottom: 24 }}>
            {toolbar}
          </Card>
        )}

        {/* 列表内容区域 */}
        {children}
      </Content>
    </Layout>
  );
};