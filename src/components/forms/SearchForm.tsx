import { Form, Input, Button, Select, DatePicker, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchFormProps {
  onSearch?: (values: any) => void;
  onReset?: () => void;
  loading?: boolean;
  fields?: SearchField[];
  layout?: 'horizontal' | 'vertical' | 'inline';
}

interface SearchField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'dateRange';
  placeholder?: string;
  options?: { label: string; value: any }[];
}

export const SearchForm = ({
  onSearch,
  onReset,
  loading = false,
  layout = 'inline',
  fields = [
    { name: 'keyword', label: '关键词', type: 'input', placeholder: '请输入搜索关键词' },
    { 
      name: 'status', 
      label: '状态', 
      type: 'select', 
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  ]
}: SearchFormProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    // 过滤空值
    const filteredValues = Object.keys(values).reduce((acc, key) => {
      if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
        acc[key] = values[key];
      }
      return acc;
    }, {} as any);

    if (onSearch) {
      onSearch(filteredValues);
    } else {
      console.log('Search values:', filteredValues);
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
    } else {
      console.log('Form reset');
    }
  };

  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'select':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
          >
            <Select 
              placeholder={field.placeholder}
              allowClear
              style={{ width: 200 }}
            >
              {field.options?.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'dateRange':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
          >
            <RangePicker 
              placeholder={['开始日期', '结束日期']}
              style={{ width: 240 }}
            />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
          >
            <Input 
              placeholder={field.placeholder}
              allowClear
              style={{ width: 200 }}
            />
          </Form.Item>
        );
    }
  };

  return (
    <Card>
      <Form
        form={form}
        layout={layout}
        onFinish={handleFinish}
        autoComplete="off"
      >
        {fields.map(renderField)}
        
        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              loading={loading}
            >
              搜索
            </Button>
            <Button 
              htmlType="button" 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};