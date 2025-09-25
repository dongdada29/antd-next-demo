import { useState } from 'react';
import { Form, Input, Button, Card, Space, message } from 'antd';

interface BasicFormProps {
  title?: string;
  onSubmit?: (values: any) => void;
  loading?: boolean;
  initialValues?: Record<string, any>;
  fields?: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'email' | 'password';
  required?: boolean;
  placeholder?: string;
  rules?: any[];
}

export const BasicForm = ({ 
  title = '基础表单',
  onSubmit, 
  loading = false,
  initialValues = {},
  fields = [
    { name: 'name', label: '姓名', type: 'input', required: true, placeholder: '请输入姓名' },
    { name: 'email', label: '邮箱', type: 'email', required: true, placeholder: '请输入邮箱' }
  ]
}: BasicFormProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
      message.success('表单提交成功！');
      console.log('Form values:', values);
    }
  };

  const handleFinishFailed = (errorInfo: any) => {
    message.error('请检查表单输入');
    console.log('Failed:', errorInfo);
  };

  const renderField = (field: FormField) => {
    const rules = field.rules || (field.required ? [{ required: true, message: `请输入${field.label}` }] : []);
    
    switch (field.type) {
      case 'textarea':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={rules}
          >
            <Input.TextArea 
              placeholder={field.placeholder}
              rows={4}
            />
          </Form.Item>
        );
      case 'email':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[
              ...rules,
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              type="email"
              placeholder={field.placeholder}
            />
          </Form.Item>
        );
      case 'password':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={rules}
          >
            <Input.Password 
              placeholder={field.placeholder}
            />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={rules}
          >
            <Input 
              placeholder={field.placeholder}
            />
          </Form.Item>
        );
    }
  };

  return (
    <Card title={title}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
      >
        {fields.map(renderField)}
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};