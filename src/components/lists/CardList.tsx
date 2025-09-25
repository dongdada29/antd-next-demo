import { Card, Row, Col, Button, Space, Avatar, Tag, Empty, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface CardListProps<T = any> {
  title?: string;
  data?: T[];
  loading?: boolean;
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  renderCard?: (record: T) => React.ReactNode;
  gutter?: [number, number];
  colSpan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
}

export const CardList = <T extends Record<string, any>>({
  title = '卡片列表',
  data = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  renderCard,
  gutter = [16, 16],
  colSpan = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4 }
}: CardListProps<T>) => {

  const defaultRenderCard = (record: T) => {
    const actions: React.ReactNode[] = [];
    
    if (onView) {
      actions.push(
        <Button 
          key="view"
          type="text" 
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onView(record)}
        >
          查看
        </Button>
      );
    }
    
    if (onEdit) {
      actions.push(
        <Button 
          key="edit"
          type="text" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
      );
    }
    
    if (onDelete) {
      actions.push(
        <Button 
          key="delete"
          type="text" 
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record)}
        >
          删除
        </Button>
      );
    }

    return (
      <Card
        hoverable
        actions={actions.length > 0 ? actions : undefined}
        cover={
          record.image ? (
            <img
              alt={record.name || record.title}
              src={record.image}
              style={{ height: 200, objectFit: 'cover' }}
            />
          ) : undefined
        }
      >
        <Meta
          avatar={
            record.avatar ? (
              <Avatar src={record.avatar} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )
          }
          title={record.name || record.title || `项目 ${record.id}`}
          description={
            <div>
              <div style={{ marginBottom: 8 }}>
                {record.description || record.content || '暂无描述'}
              </div>
              {record.status && (
                <div style={{ marginBottom: 8 }}>
                  <Tag color={
                    record.status === 'active' ? 'green' :
                    record.status === 'inactive' ? 'red' : 'orange'
                  }>
                    {record.status === 'active' ? '启用' :
                     record.status === 'inactive' ? '禁用' : '待审核'}
                  </Tag>
                </div>
              )}
              {record.createdAt && (
                <div style={{ fontSize: '12px', color: '#999' }}>
                  创建时间: {new Date(record.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          }
        />
      </Card>
    );
  };

  if (loading) {
    return (
      <Card title={title}>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card title={title}>
      <Row gutter={gutter}>
        {data.map((record, index) => (
          <Col key={record.id || index} {...colSpan}>
            {renderCard ? renderCard(record) : defaultRenderCard(record)}
          </Col>
        ))}
      </Row>
    </Card>
  );
};