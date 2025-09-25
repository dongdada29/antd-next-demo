/**
 * 交互式API文档收集组件
 * 提供用户友好的界面来收集和验证API文档
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Alert,
  Tabs,
  Space,
  Typography,
  Collapse,
  Tag,
  message,
  Modal,
  Tooltip
} from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';

import {
  APIDocumentation,
  ValidationResult,
  DocumentationTemplate
} from '@/types/api-documentation';
import { APIDocumentationValidator, APIDocumentationGuide, REST_API_TEMPLATE } from '@/lib';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface DocumentationCollectorProps {
  onDocumentationComplete?: (doc: APIDocumentation) => void;
  initialData?: Partial<APIDocumentation>;
}

export const DocumentationCollector: React.FC<DocumentationCollectorProps> = ({
  onDocumentationComplete,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [documentation, setDocumentation] = useState<Partial<APIDocumentation>>(
    initialData || {}
  );
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentationTemplate | null>(null);

  const validator = new APIDocumentationValidator();

  const steps = [
    {
      title: '基础信息',
      description: '配置API基本信息'
    },
    {
      title: '认证设置',
      description: '配置认证方式'
    },
    {
      title: '端点定义',
      description: '定义API端点'
    },
    {
      title: '验证完成',
      description: '验证并完成配置'
    }
  ];

  // 验证当前文档
  const validateDocumentation = async () => {
    setIsValidating(true);
    try {
      const result = validator.validate(documentation as APIDocumentation);
      setValidationResult(result);
      
      if (result.isValid) {
        message.success('文档验证通过！');
      } else {
        message.error(`发现 ${result.errors.length} 个错误`);
      }
    } catch (error) {
      message.error('验证过程中出现错误');
    } finally {
      setIsValidating(false);
    }
  };

  // 应用模板
  const applyTemplate = (template: DocumentationTemplate) => {
    const templateData = { ...template.template };
    setDocumentation(templateData);
    form.setFieldsValue(templateData);
    setSelectedTemplate(template);
    message.success('模板已应用');
  };

  // 导出文档
  const exportDocumentation = () => {
    const dataStr = JSON.stringify(documentation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'api-documentation.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    const dataStr = JSON.stringify(documentation, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      message.success('已复制到剪贴板');
    });
  };

  // 渲染基础信息表单
  const renderBasicInfoForm = () => (
    <Card title="API基础信息" className="mb-4">
      <Form
        form={form}
        layout="vertical"
        initialValues={documentation}
        onValuesChange={(_, values) => setDocumentation({ ...documentation, ...values })}
      >
        <Form.Item
          name="title"
          label="API标题"
          rules={[{ required: true, message: '请输入API标题' }]}
          extra="简洁明了的API名称"
        >
          <Input placeholder="例如：用户管理API" />
        </Form.Item>

        <Form.Item
          name="version"
          label="版本号"
          rules={[
            { required: true, message: '请输入版本号' },
            { pattern: /^\d+\.\d+\.\d+/, message: '请使用语义化版本号，如 1.0.0' }
          ]}
          extra="使用语义化版本号格式"
        >
          <Input placeholder="1.0.0" />
        </Form.Item>

        <Form.Item
          name="description"
          label="API描述"
          rules={[{ required: true, message: '请输入API描述' }]}
          extra="详细说明API的用途和功能"
        >
          <TextArea rows={3} placeholder="描述API的主要功能和用途..." />
        </Form.Item>

        <Form.Item
          name="baseURL"
          label="基础URL"
          rules={[
            { required: true, message: '请输入基础URL' },
            { type: 'url', message: '请输入有效的URL' }
          ]}
          extra="API的根地址，包含协议"
        >
          <Input placeholder="https://api.example.com" />
        </Form.Item>
      </Form>
    </Card>
  );

  // 渲染认证设置表单
  const renderAuthForm = () => (
    <Card title="认证配置" className="mb-4">
      <Form
        form={form}
        layout="vertical"
        initialValues={documentation.authentication}
        onValuesChange={(_, values) => 
          setDocumentation({ 
            ...documentation, 
            authentication: values 
          })
        }
      >
        <Form.Item
          name={['authentication', 'type']}
          label="认证类型"
          extra="选择适合的认证方式"
        >
          <Select placeholder="选择认证类型">
            <Select.Option value="bearer">Bearer Token (JWT)</Select.Option>
            <Select.Option value="apiKey">API Key</Select.Option>
            <Select.Option value="basic">Basic Auth</Select.Option>
            <Select.Option value="oauth2">OAuth 2.0</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name={['authentication', 'headerName']}
          label="请求头名称"
          extra="API Key认证时使用的请求头名称"
        >
          <Input placeholder="X-API-Key" />
        </Form.Item>

        <Form.Item
          name={['authentication', 'tokenPrefix']}
          label="Token前缀"
          extra="Bearer认证时的token前缀"
        >
          <Input placeholder="Bearer" />
        </Form.Item>

        <Form.Item
          name={['authentication', 'description']}
          label="认证说明"
          extra="详细说明如何进行认证"
        >
          <TextArea rows={2} placeholder="说明认证的使用方法..." />
        </Form.Item>
      </Form>
    </Card>
  );

  // 渲染端点定义
  const renderEndpointsForm = () => (
    <Card title="API端点定义" className="mb-4">
      <Alert
        message="端点定义"
        description="在这个阶段，您需要定义API的具体端点。建议先从简单的GET接口开始，然后逐步添加其他类型的接口。"
        type="info"
        showIcon
        className="mb-4"
      />
      
      <Tabs defaultActiveKey="manual">
        <TabPane tab="手动定义" key="manual">
          <TextArea
            rows={15}
            placeholder="请粘贴您的API端点JSON配置，或使用模板生成..."
            value={JSON.stringify(documentation.endpoints || [], null, 2)}
            onChange={(e) => {
              try {
                const endpoints = JSON.parse(e.target.value);
                setDocumentation({ ...documentation, endpoints });
              } catch {
                // 忽略JSON解析错误，用户可能正在编辑
              }
            }}
          />
        </TabPane>
        
        <TabPane tab="使用模板" key="template">
          <Space direction="vertical" className="w-full">
            <Button
              type="primary"
              onClick={() => {
                const example = APIDocumentationGuide.getExampleDocumentation();
                setDocumentation({ ...documentation, endpoints: example.endpoints });
                message.success('已应用示例端点');
              }}
            >
              使用示例端点
            </Button>
            
            <Alert
              message="提示"
              description="您可以使用示例端点作为起点，然后根据实际需求进行修改。"
              type="info"
              showIcon
            />
          </Space>
        </TabPane>
      </Tabs>
    </Card>
  );

  // 渲染验证结果
  const renderValidationResult = () => (
    <Card title="文档验证" className="mb-4">
      <Space direction="vertical" className="w-full">
        <Button
          type="primary"
          loading={isValidating}
          onClick={validateDocumentation}
          icon={<CheckCircleOutlined />}
        >
          验证文档
        </Button>

        {validationResult && (
          <div>
            {validationResult.isValid ? (
              <Alert
                message="验证通过"
                description="您的API文档格式正确，可以继续使用。"
                type="success"
                showIcon
              />
            ) : (
              <Alert
                message={`发现 ${validationResult.errors.length} 个错误`}
                description="请修复以下错误后重新验证"
                type="error"
                showIcon
              />
            )}

            {validationResult.errors.length > 0 && (
              <Card title="错误详情" size="small" className="mt-4">
                {validationResult.errors.map((error, index) => (
                  <div key={index} className="mb-2">
                    <Tag color="red">{error.field}</Tag>
                    <Text>{error.message}</Text>
                    {error.suggestion && (
                      <div className="ml-4 mt-1">
                        <Text type="secondary">建议: {error.suggestion}</Text>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {validationResult.warnings && validationResult.warnings.length > 0 && (
              <Card title="警告信息" size="small" className="mt-4">
                {validationResult.warnings.map((warning, index) => (
                  <div key={index} className="mb-2">
                    <Tag color="orange">{warning.field}</Tag>
                    <Text>{warning.message}</Text>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {validationResult?.isValid && (
          <Space>
            <Button
              type="primary"
              onClick={() => onDocumentationComplete?.(documentation as APIDocumentation)}
              icon={<CheckCircleOutlined />}
            >
              完成配置
            </Button>
            <Button
              onClick={exportDocumentation}
              icon={<DownloadOutlined />}
            >
              导出文档
            </Button>
            <Button
              onClick={copyToClipboard}
              icon={<CopyOutlined />}
            >
              复制到剪贴板
            </Button>
          </Space>
        )}
      </Space>
    </Card>
  );

  // 渲染指导面板
  const renderGuidePanel = () => (
    <Card title="编写指南" className="mb-4">
      <Collapse>
        <Panel header="📖 文档编写指南" key="guide">
          <pre className="whitespace-pre-wrap text-sm">
            {APIDocumentationGuide.getWritingGuide()}
          </pre>
        </Panel>
        
        <Panel header="❓ 常见问题" key="faq">
          {APIDocumentationGuide.getFAQ().map((item, index) => (
            <div key={index} className="mb-4">
              <Title level={5}>{item.question}</Title>
              <Paragraph>{item.answer}</Paragraph>
            </div>
          ))}
        </Panel>
        
        <Panel header="✅ 检查清单" key="checklist">
          {APIDocumentationGuide.getChecklist().map((category, index) => (
            <div key={index} className="mb-4">
              <Title level={5}>{category.category}</Title>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="ml-4">
                  <Text>{item}</Text>
                </div>
              ))}
            </div>
          ))}
        </Panel>
      </Collapse>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfoForm();
      case 1:
        return renderAuthForm();
      case 2:
        return renderEndpointsForm();
      case 3:
        return renderValidationResult();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>API文档收集器</Title>
        <Paragraph>
          通过这个工具，您可以轻松创建标准化的API文档。我们将引导您完成整个过程。
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <Steps current={currentStep} items={steps} />
          </Card>

          {renderStepContent()}

          <div className="flex justify-between">
            <Button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              上一步
            </Button>
            
            <Space>
              <Button
                type="primary"
                onClick={() => applyTemplate(REST_API_TEMPLATE)}
              >
                使用模板
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  下一步
                </Button>
              ) : null}
            </Space>
          </div>
        </div>

        <div className="lg:col-span-1">
          {renderGuidePanel()}
        </div>
      </div>

      <Modal
        title="使用指南"
        open={showGuide}
        onCancel={() => setShowGuide(false)}
        footer={null}
        width={800}
      >
        <div className="max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap">
            {APIDocumentationGuide.getWritingGuide()}
          </pre>
        </div>
      </Modal>
    </div>
  );
};