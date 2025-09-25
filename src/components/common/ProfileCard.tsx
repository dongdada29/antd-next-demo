import { Card, Avatar, Button, Space, Tag, Descriptions, Divider } from 'antd';
import { EditOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface ProfileCardProps {
  data?: {
    id?: string | number;
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    title?: string;
    department?: string;
    status?: string;
    bio?: string;
    joinDate?: string;
    lastLogin?: string;
    [key: string]: any;
  };
  loading?: boolean;
  onEdit?: () => void;
  showEditButton?: boolean;
  extra?: React.ReactNode;
}

export const ProfileCard = ({
  data,
  loading = false,
  onEdit,
  showEditButton = true,
  extra
}: ProfileCardProps) => {
  
  if (!data) {
    return (
      <Card loading={loading}>
        <Meta
          avatar={<Avatar size={64} icon={<UserOutlined />} />}
          title="暂无用户信息"
          description="用户数据加载中或不存在"
        />
      </Card>
    );
  }

  const statusColor = {
    active: 'green',
    inactive: 'red',
    pending: 'orange',
  }[data.status as string] || 'default';

  const statusText = {
    active: '在线',
    inactive: '离线',
    pending: '待激活',
  }[data.status as string] || data.status;

  const actions = [];
  
  if (showEditButton && onEdit) {
    actions.push(
      <Button key="edit" type="primary" icon={<EditOutlined />} onClick={onEdit}>
        编辑资料
      </Button>
    );
  }

  return (
    <Card
      loading={loading}
      actions={actions.length > 0 ? actions : undefined}
      extra={extra}
    >
      <Meta
        avatar={
          <Avatar 
            size={64} 
            src={data.avatar} 
            icon={!data.avatar ? <UserOutlined /> : undefined}
          />
        }
        title={
          <Space>
            <span>{data.name || '未知用户'}</span>
            {data.status && (
              <Tag color={statusColor}>{statusText}</Tag>
            )}
          </Space>
        }
        description={
          <div>
            {data.title && (
              <div style={{ marginBottom: 4 }}>
                <strong>{data.title}</strong>
                {data.department && ` · ${data.department}`}
              </div>
            )}
            {data.bio && (
              <div style={{ marginBottom: 8, color: '#666' }}>
                {data.bio}
              </div>
            )}
          </div>
        }
      />
      
      <Divider />
      
      <Descriptions column={1} size="small">
        {data.email && (
          <Descriptions.Item label={<><MailOutlined /> 邮箱</>}>
            {data.email}
          </Descriptions.Item>
        )}
        {data.phone && (
          <Descriptions.Item label={<><PhoneOutlined /> 电话</>}>
            {data.phone}
          </Descriptions.Item>
        )}
        {data.joinDate && (
          <Descriptions.Item label="加入时间">
            {new Date(data.joinDate).toLocaleDateString()}
          </Descriptions.Item>
        )}
        {data.lastLogin && (
          <Descriptions.Item label="最后登录">
            {new Date(data.lastLogin).toLocaleString()}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};