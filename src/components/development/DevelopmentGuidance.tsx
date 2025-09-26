'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Steps,
  Typography,
  Alert,
  List,
  Button,
  Space,
  Collapse,
  Tag,
  Divider,
  Modal,
  Spin,
  Tabs,
  Row,
  Col,
  Tooltip
} from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
  CodeOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  DevelopmentGuidanceSystem, 
  type StageGuidance, 
  type GuidanceStep,
  type QualityCheckResult 
} from '../../lib/development-guidance';
import { DevelopmentStage } from '../../lib/development-stage-manager';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface DevelopmentGuidanceProps {
  stage: DevelopmentStage;
  onStepComplete?: (stepId: string) => void;
  completedSteps?: string[];
}

export const DevelopmentGuidance: React.FC<DevelopmentGuidanceProps> = ({
  stage,
  onStepComplete,
  completedSteps = []
}) => {
  const [guidanceSystem] = useState(() => new DevelopmentGuidanceSystem());
  const [guidance, setGuidance] = useState<StageGuidance | undefined>();
  const [currentStep, setCurrentStep] = useState(0);
  const [qualityResults, setQualityResults] = useState<QualityCheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    const stageGuidance = guidanceSystem.getGuidance(stage);
    setGuidance(stageGuidance);
  }, [stage, guidanceSystem]);

  // 运行质量检查
  const runQualityChecks = async () => {
    setLoading(true);
    try {
      const results = await guidanceSystem.runQualityChecks(stage);
      setQualityResults(results);
    } catch (error) {
      Modal.error({
        title: '质量检查失败',
        content: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  // 显示代码示例
  const showCode = (code: string) => {
    setSelectedCode(code);
    setShowCodeModal(true);
  };

  // 标记步骤完成
  const markStepComplete = (stepId: string) => {
    onStepComplete?.(stepId);
  };

  if (!guidance) {
    return <div>加载中...</div>;
  }

  const renderStep = (step: GuidanceStep, index: number) => {
    const isCompleted = completedSteps.includes(step.id);
    
    return (
      <Card
        key={step.id}
        size="small"
        style={{ marginBottom: '16px' }}
        title={
          <Space>
            <Text strong>{index + 1}. {step.title}</Text>
            {isCompleted && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
          </Space>
        }
        extra={
          !isCompleted && (
            <Button
              size="small"
              type="primary"
              onClick={() => markStepComplete(step.id)}
            >
              标记完成
            </Button>
          )
        }
      >
        <Paragraph>{step.description}</Paragraph>

        {step.code && (
          <div style={{ marginBottom: '16px' }}>
            <Button
              size="small"
              icon={<CodeOutlined />}
              onClick={() => showCode(step.code!)}
            >
              查看代码示例
            </Button>
          </div>
        )}

        {step.tips.length > 0 && (
          <Alert
            message="💡 提示"
            description={
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                {step.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            }
            type="info"
            showIcon={false}
            style={{ marginBottom: '12px' }}
          />
        )}

        {step.warnings && step.warnings.length > 0 && (
          <Alert
            message="⚠️ 注意"
            description={
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                {step.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon={false}
            style={{ marginBottom: '12px' }}
          />
        )}

        {step.resources && step.resources.length > 0 && (
          <div>
            <Text strong>相关资源:</Text>
            <div style={{ marginTop: '8px' }}>
              {step.resources.map((resource, i) => (
                <Tag
                  key={i}
                  icon={<LinkOutlined />}
                  color="blue"
                  style={{ marginBottom: '4px', cursor: 'pointer' }}
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  {resource.title}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderOverview = () => (
    <Card title="阶段概览">
      <Paragraph>{guidance.overview}</Paragraph>
      
      {guidance.prerequisites.length > 0 && (
        <>
          <Divider orientation="left">前置条件</Divider>
          <List
            size="small"
            dataSource={guidance.prerequisites}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                {item}
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );

  const renderSteps = () => (
    <div>
      <Card title="操作步骤" style={{ marginBottom: '16px' }}>
        <Steps
          current={currentStep}
          size="small"
          items={guidance.steps.map((step, index) => ({
            title: step.title,
            description: completedSteps.includes(step.id) ? '已完成' : '待完成',
            status: completedSteps.includes(step.id) ? 'finish' : index === currentStep ? 'process' : 'wait'
          }))}
          onChange={setCurrentStep}
        />
      </Card>

      {guidance.steps.map((step, index) => renderStep(step, index))}
    </div>
  );

  const renderBestPractices = () => (
    <Card title="最佳实践" icon={<BulbOutlined />}>
      <List
        dataSource={guidance.bestPractices}
        renderItem={(practice) => (
          <List.Item>
            <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            {practice}
          </List.Item>
        )}
      />
    </Card>
  );

  const renderCommonMistakes = () => (
    <Card title="常见错误" icon={<WarningOutlined />}>
      <List
        dataSource={guidance.commonMistakes}
        renderItem={(mistake) => (
          <List.Item>
            <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
            {mistake}
          </List.Item>
        )}
      />
    </Card>
  );

  const renderQualityChecks = () => (
    <Card 
      title="质量检查" 
      extra={
        <Button
          size="small"
          type="primary"
          loading={loading}
          onClick={runQualityChecks}
          icon={<PlayCircleOutlined />}
        >
          运行检查
        </Button>
      }
    >
      {qualityResults.length === 0 ? (
        <div>
          <Paragraph>点击"运行检查"按钮执行代码质量检查</Paragraph>
          <List
            size="small"
            dataSource={guidance.qualityChecks}
            renderItem={(check) => (
              <List.Item>
                <ExclamationCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <Text strong>{check.title}:</Text> {check.description}
              </List.Item>
            )}
          />
        </div>
      ) : (
        <List
          dataSource={qualityResults}
          renderItem={(result) => (
            <List.Item>
              <Alert
                message={result.message}
                type={result.passed ? 'success' : 'error'}
                showIcon
                description={
                  result.suggestions && result.suggestions.length > 0 && (
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                      {result.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  )
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{guidance.title}</Title>
      
      <Tabs defaultActiveKey="overview" type="card">
        <TabPane tab="概览" key="overview">
          {renderOverview()}
        </TabPane>
        
        <TabPane tab="操作步骤" key="steps">
          {renderSteps()}
        </TabPane>
        
        <TabPane tab="最佳实践" key="practices">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              {renderBestPractices()}
            </Col>
            <Col span={12}>
              {renderCommonMistakes()}
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="质量检查" key="quality">
          {renderQualityChecks()}
        </TabPane>
      </Tabs>

      {/* 代码示例模态框 */}
      <Modal
        title="代码示例"
        open={showCodeModal}
        onCancel={() => setShowCodeModal(false)}
        footer={null}
        width={800}
      >
        <SyntaxHighlighter
          language="typescript"
          style={tomorrow}
          customStyle={{
            margin: 0,
            borderRadius: '6px'
          }}
        >
          {selectedCode}
        </SyntaxHighlighter>
      </Modal>
    </div>
  );
};

export default DevelopmentGuidance;