import { Layout, Menu, Card, Row, Col, Statistic, Avatar, Dropdown } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons';
import { ReactNode } from 'react';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children?: ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  stats?: Array<{
    title: string;
    value: number | string;
    prefix?: ReactNode;
    suffix?: ReactNode;
  }>;
  onMenuClick?: (key: string) => void;
  onUserMenuClick?: (key: string) => void;
}

export const DashboardLayout = ({
  children,
  user = { name: '用户' },
  stats = [
    { title: '总用户数', value: 1234 },
    { title: '今日访问', value: 567 },
    { title: '总订单', value: 890 },
    { title: '收入', value: '¥12,345', prefix: '¥' }
  ],
  onMenuClick,
  onUserMenuClick
}: DashboardLayoutProps) => {

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          管理系统
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={({ key }) => onMenuClick?.(key)}
          theme="dark"
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            仪表盘
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => onUserMenuClick?.(key)
              }}
              placement="bottomRight"
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                cursor: 'pointer' 
              }}>
                <Avatar 
                  src={user.avatar} 
                  icon={!user.avatar ? <UserOutlined /> : undefined}
                />
                <span>{user.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ margin: '24px', background: '#f0f2f5' }}>
          {/* 统计卡片 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          
          {/* 主要内容区域 */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};