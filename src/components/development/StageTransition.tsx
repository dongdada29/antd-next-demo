'use client';

import React, { useState } from 'react';
import {
  Modal,
  Steps,
  Button,
  Space,
  Alert,
  List,
  Typography,
  Divider,
  Card,
  Tag,
  Progress
} from 'antd';
import {
  CheckCircleOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { DevelopmentStage, type StageDefinition } from '../../lib/development-stage-manager';

const { Title, Text, Paragraph } = Typography;

interface StageTransitionProps {
  visible: boolean;
  currentStage: StageDefinition;
  nextStage: StageDefinition;
  canTransition: boolean;
  incompleteTasks: string[];
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const StageTransition: React.FC<StageTransitionProps> = ({
  visible,
  currentStage,
  nextStage,
  canTransition,
  incompleteTasks,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '当前阶段检查',
      description: '验证当前阶段完成情况'
    },
    {
      title: '准备下一阶段',
      description: '了解下一阶段要求'
    },
    {
      title: '确认切换',
      description: '确认进入下一阶段'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onConfirm();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStageCheck = () => (
    <div>
      <Alert
        message={canTransition ? "当前阶段已完成" : "当前阶段未完成"}
        type={canTransition ? "success" : "warning"}
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Card title={`当前阶段: ${currentStage.title}`} size="small">
        <Paragraph>{currentStage.description}</Paragraph>
        
        <Divider orientation="left">任务完成情况</Divider>
        <List
          size="small"
          dataSource={currentStage.tasks}
          renderItem={(task) => (
            <List.Item>
              <Space>
                {task.completed ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                )}
                <Text delete={task.completed}>{task.title}</Text>
                {task.required && <Tag color="red" size="small">必需</Tag>}
                {task.completed && <Tag color="green" size="small">已完成</Tag>}
              </Space>
            </List.Item>
          )}
        />

        {!canTransition && incompleteTasks.length > 0 && (
          <>
            <Divider orientation="left">待完成任务</Divider>
            <Alert
              message="请先完成以下必需任务："
              description={
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  {incompleteTasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              }
              type="warning"
              showIcon
            />
          </>
        )}
      </Card>
    </div>
  );

  const renderNextStagePreview = () => (
    <div>
      <Alert
        message="下一阶段预览"
        description="了解即将进入的开发阶段的要求和任务"
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Card title={`下一阶段: ${nextStage.title}`} size="small">
        <Paragraph>{nextStage.description}</Paragraph>
        
        <Divider orientation="left">主要任务</Divider>
        <List
          size="small"
          dataSource={nextStage.tasks}
          renderItem={(task) => (
            <List.Item>
              <Space>
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
                <Text>{task.title}</Text>
                {task.required && <Tag color="blue" size="small">必需</Tag>}
              </Space>
            </List.Item>
          )}
        />

        <Divider orientation="left">完成标准</Divider>
        <List
          size="small"
          dataSource={nextStage.completionCriteria}
          renderItem={(criteria) => (
            <List.Item>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text>{criteria}</Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div>
      <Alert
        message={canTransition ? "准备就绪" : "无法切换"}
        description={
          canTransition 
            ? "所有条件已满足，可以进入下一阶段"
            : "请返回完成当前阶段的必需任务"
        }
        type={canTransition ? "success" : "error"}
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Card size="small">
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>
            {currentStage.title} 
            <ArrowRightOutlined style={{ margin: '0 16px', color: '#1890ff' }} />
            {nextStage.title}
          </Title>
          
          {canTransition ? (
            <Paragraph>
              点击"确认切换"按钮进入 <Text strong>{nextStage.title}</Text> 阶段。
              切换后，您将开始新阶段的开发任务。
            </Paragraph>
          ) : (
            <Paragraph type="secondary">
              请先完成当前阶段的所有必需任务，然后重新尝试切换。
            </Paragraph>
          )}
        </div>
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderCurrentStageCheck();
      case 1:
        return renderNextStagePreview();
      case 2:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <Modal
      title="阶段切换"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>上一步</Button>
          )}
          <Button
            type="primary"
            onClick={handleNext}
            loading={loading}
            disabled={currentStep === 2 && !canTransition}
          >
            {currentStep === steps.length - 1 ? '确认切换' : '下一步'}
          </Button>
        </Space>
      }
    >
      <Steps
        current={currentStep}
        items={steps}
        style={{ marginBottom: '24px' }}
        size="small"
      />

      <div style={{ minHeight: '400px' }}>
        {renderStepContent()}
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Progress 
          percent={Math.round(((currentStep + 1) / steps.length) * 100)}
          size="small"
          showInfo={false}
        />
      </div>
    </Modal>
  );
};

export default StageTransition;