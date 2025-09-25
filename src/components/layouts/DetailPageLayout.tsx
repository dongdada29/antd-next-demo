import { Layout, Card, Button, Space, Breadcrumb, Tabs } from 'antd';
import { ArrowLeftOutlined, EditOutlined, HomeOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

const { Content } = Layout;
const { TabPane } = Tabs;

interface DetailPageLayoutProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onBack?: () => void;
  onEdit?: () => void;
  showBackButton?: boolean;
  showEditButton?: boolean;
  editButtonText?: string;
  loading?: boolean;
  breadcrumbs?: Array<{
    title: string;
    href?: string;
  }>;
  extra?: ReactNode;
  tabs?: Array<{
    key: string;
    label: string;
    content: ReactNode;
  }>;
  activeTabKey?: string;
  onTabChange?: (key: string) => void;
}

export const DetailPageLayout = ({
  title = '详情页面',
  subtitle,
  children,
  onBack,
  onEdit,
  showBackButton = true,
  showEditButton = true,
  editButtonText = '编辑',
  loading = false,
  breadcrumbs = [
    { title: '首页', href: '/' },
    { title: '列表', href: '/list' },
    { title: '详情' }
  ],
  extra,
  tabs,
  activeTabKey,
  onTabChange
}: DetailPageLayoutProps) => {

  const headerActions = (
    <Space>
      {showBackButton && onBack && (
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
        >
          返回
        </Button>
      )}
      {showEditButton && onEdit && (
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          {editButtonText}
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

        {/* 详情内容区域 */}
        {tabs && tabs.length > 0 ? (
          <Card>
            <Tabs
              activeKey={activeTabKey}
              onChange={onTabChange}
              items={tabs.map(tab => ({
                key: tab.key,
                label: tab.label,
                children: tab.content
              }))}
            />
          </Card>
        ) : (
          <Card loading={loading}>
            {children}
          </Card>
        )}
      </Content>
    </Layout>
  );
};