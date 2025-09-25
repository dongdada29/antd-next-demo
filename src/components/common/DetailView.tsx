import { Card, Descriptions, Button, Space, Tag, Avatar, Divider, Empty } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';

interface DetailViewProps {
  title?: string;
  data?: Record<string, any>;
  loading?: boolean;
  onEdit?: () => void;
  onBack?: () => void;
  fields?: DetailField[];
  showBackButton?: boolean;
  showEditButton?: boolean;
}

interface DetailField {
  key: string;
  label: string;
  render?: (value: any, record: Record<string, any>) => React.ReactNode;
  span?: number;
}

export const DetailView = ({
  title = '详情信息',
  data,
  loading = false,
  onEdit,
  onBack,
  showBackButton = true,
  showEditButton = true,
  fields = []
}: DetailViewProps) => {

  const defaultFields: DetailField[] = [
    {
      key: 'id',
      label: 'ID',
      span: 1,
    },
    {
      key: 'name',
      label: '名称',
      span: 2,
    },
    {
      key: 'status',
      label: '状态',
      span: 1,
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '启用' },
          inactive: { color: 'red', text: '禁用' },
          pending: { color: 'orange', text: '待审核' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      key: 'description',
      label: '描述',
      span: 3,
    },
    {
      key: 'createdAt',
      label: '创建时间',
      span: 1,
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      key: 'updatedAt',
      label: '更新时间',
      span: 1,
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
  ];

  const finalFields = fields.length > 0 ? fields : defaultFields;

  const renderFieldValue = (field: DetailField, value: any) => {
    if (field.render) {
      return field.render(value, data || {});
    }
    
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    
    return String(value);
  };

  const extra = (
    <Space>
      {showBackButton && onBack && (
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          返回
        </Button>
      )}
      {showEditButton && onEdit && (
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          编辑
        </Button>
      )}
    </Space>
  );

  if (!data) {
    return (
      <Card title={title} extra={extra}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card title={title} extra={extra} loading={loading}>
      <Descriptions
        bordered
        column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        size="middle"
      >
        {finalFields.map((field) => (
          <Descriptions.Item
            key={field.key}
            label={field.label}
            span={field.span}
          >
            {renderFieldValue(field, data[field.key])}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};