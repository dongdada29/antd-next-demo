import { Layout, Card, Button, Space, Breadcrumb, Divider } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, HomeOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

const { Content } = Layout;

interface FormPageLayoutProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onBack?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  showBackButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  breadcrumbs?: Array<{
    title: string;
    href?: string;
  }>;
  extra?: ReactNode;
}

export const FormPageLayout = ({
  title = '表单页面',
  subtitle,
  children,
  onBack,
  onSave,
  onCancel,
  showBackButton = true,
  showSaveButton = true,
  showCancelButton = true,
  saveButtonText = '保存',
  cancelButtonText = '取消',
  loading = false,
  breadcrumbs = [
    { title: '首页', href: '/' },
    { title: '表单页面' }
  ],
  extra
}: FormPageLayoutProps) => {

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
      {showCancelButton && onCancel && (
        <Button onClick={onCancel}>
          {cancelButtonText}
        </Button>
      )}
      {showSaveButton && onSave && (
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          loading={loading}
          onClick={onSave}
        >
          {saveButtonText}
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

        {/* 表单内容区域 */}
        <Card>
          {children}
        </Card>
      </Content>
    </Layout>
  );
};