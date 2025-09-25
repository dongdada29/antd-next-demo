import { Button, Space, Table, Card, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';

interface BasicTableProps<T = any> extends Omit<TableProps<T>, 'columns' | 'title'> {
  title?: string;
  data?: T[];
  columns?: TableColumn<T>[];
  loading?: boolean;
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  showActions?: boolean;
  actionWidth?: number;
}

interface TableColumn<T> {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filters?: { text: string; value: any }[];
  filterMultiple?: boolean;
}

export const BasicTable = <T extends Record<string, any>>({
  title = '数据列表',
  data = [],
  columns = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  actionWidth = 180,
  ...tableProps
}: BasicTableProps<T>) => {
  
  const defaultColumns: TableColumn<T>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '启用' },
          inactive: { color: 'red', text: '禁用' },
          pending: { color: 'orange', text: '待审核' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '启用', value: 'active' },
        { text: '禁用', value: 'inactive' },
        { text: '待审核', value: 'pending' },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: true,
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
  ];

  const actionColumn: ColumnsType<T>[0] = {
    title: '操作',
    key: 'action',
    width: actionWidth,
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        {onView && (
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            查看
          </Button>
        )}
        {onEdit && (
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
        )}
        {onDelete && (
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => onDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        )}
      </Space>
    ),
  };

  const finalColumns = [
    ...(columns.length > 0 ? columns : defaultColumns),
    ...(showActions ? [actionColumn] : [])
  ];

  return (
    <Card title={title}>
      <Table
        columns={finalColumns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </Card>
  );
};