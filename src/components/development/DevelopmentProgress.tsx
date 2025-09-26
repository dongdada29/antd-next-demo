'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Steps,
  Progress,
  List,
  Button,
  Space,
  Tag,
  Alert,
  Tooltip,
  Modal,
  Typography,
  Divider,
  Row,
  Col
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { DevelopmentStageManager, DevelopmentStage, type StageDefinition, type ProjectProgress } from '../../lib/development-stage-manager';

const { Title, Text, Paragraph } = Typography;

interface DevelopmentProgressProps {
  onStageChange?: (stage: DevelopmentStage) => void;
  onTaskUpdate?: (taskId: string, completed: boolean) => void;
}

export const DevelopmentProgress: React.FC<DevelopmentProgressProps> = ({
  onStageChange,
  onTaskUpdate
}) => {
  const [stageManager] = useState(() => new DevelopmentStageManager());
  const [progress, setProgress] = useState<ProjectProgress>(stageManager.getProgress());
  const [currentStage, setCurrentStage] = useState<StageDefinition | undefined>(stageManager.getCurrentStage());
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // 更新进度状态
  const refreshProgress = () => {
    setProgress(stageManager.getProgress());
    setCurrentStage(stageManager.getCurrentStage());
  };

  // 处理任务状态更新
  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    setLoading(true);
    try {
      await stageManager.updateTaskStatus(taskId, completed);
      refreshProgress();
      onTaskUpdate?.(taskId, completed);
    } catch (error) {
      Modal.error({
        title: '任务更新失败',
        content: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  // 进入下一阶段
  const handleNextStage = async () => {
    setLoading(true);
    try {
      const success = await stageManager.completeCurrentStage();
      if (success) {
        refreshProgress();
        onStageChange?.(stageManager.getProgress().currentStage);
      } else {
        Modal.warning({
          title: '无法进入下一阶段',
          content: '请先完成当前阶段的所有必需任务'
        });
      }
    } catch (error) {
      Modal.error({
        title: '阶段切换失败',
        content: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  // 回到上一阶段
  const handlePreviousStage = () => {
    const success = stageManager.goToPreviousStage();
    if (success) {
      refreshProgress();
      onStageChange?.(stageManager.getProgress().currentStage);
    } else {
      Modal.warning({
        title: '无法回退',
        content: '当前已是第一个阶段'
      });
    }
  };

  // 重置进度
  const handleReset = () => {
    stageManager.resetProgress();
    refreshProgress();
    setShowResetModal(false);
    onStageChange?.(DevelopmentStage.STATIC);
  };

  // 获取阶段步骤配置
  const getStepsConfig = () => {
    const allStages = stageManager.getAllStages();
    return allStages.map(stage => ({
      title: stage.title,
      description: stage.description,
      status: progress.completedStages.includes(stage.stage) 
        ? 'finish' 
        : stage.stage === progress.currentStage 
          ? 'process' 
          : 'wait',
      icon: progress.completedStages.includes(stage.stage) 
        ? <CheckCircleOutlined />
        : stage.stage === progress.currentStage 
          ? <ClockCircleOutlined />
          : undefined
    }));
  };

  // 获取当前阶段进度百分比
  const getCurrentStageProgress = () => {
    return progress.stageProgress[progress.currentStage] || 0;
  };

  // 获取总体进度百分比
  const getOverallProgress = () => {
    const totalStages = Object.keys(progress.stageProgress).length;
    const completedWeight = progress.completedStages.length * 100;
    const currentWeight = getCurrentStageProgress();
    return Math.round((completedWeight + currentWeight) / totalStages);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 总体进度概览 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]} align="middle">
          <Col span={12}>
            <Title level={3} style={{ margin: 0 }}>开发进度跟踪</Title>
            <Text type="secondary">
              当前阶段: {currentStage?.title} | 
              总体进度: {getOverallProgress()}%
            </Text>
          </Col>
          <Col span={12}>
            <Progress 
              percent={getOverallProgress()} 
              status={progress.currentStage === DevelopmentStage.COMPLETED ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 阶段步骤 */}
      <Card title="开发阶段" style={{ marginBottom: '24px' }}>
        <Steps
          current={Object.values(DevelopmentStage).indexOf(progress.currentStage)}
          items={getStepsConfig()}
          direction="horizontal"
          size="small"
        />
      </Card>

      {/* 当前阶段详情 */}
      {currentStage && (
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card 
              title={`当前阶段: ${currentStage.title}`}
              extra={
                <Tag color={getCurrentStageProgress() === 100 ? 'success' : 'processing'}>
                  {getCurrentStageProgress()}% 完成
                </Tag>
              }
            >
              <Paragraph>{currentStage.description}</Paragraph>
              
              <Divider orientation="left">任务清单</Divider>
              <List
                dataSource={currentStage.tasks}
                renderItem={(task) => (
                  <List.Item
                    actions={[
                      <Button
                        key="toggle"
                        type={task.completed ? 'default' : 'primary'}
                        size="small"
                        loading={loading}
                        onClick={() => handleTaskToggle(task.id, !task.completed)}
                        icon={task.completed ? <CheckCircleOutlined /> : undefined}
                      >
                        {task.completed ? '已完成' : '标记完成'}
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          {task.title}
                          {task.required && <Tag color="red" size="small">必需</Tag>}
                          {task.completed && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        </Space>
                      }
                      description={task.description}
                    />
                  </List.Item>
                )}
              />

              <Divider orientation="left">完成标准</Divider>
              <List
                size="small"
                dataSource={currentStage.completionCriteria}
                renderItem={(criteria) => (
                  <List.Item>
                    <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    {criteria}
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col span={8}>
            {/* 操作面板 */}
            <Card title="操作" style={{ marginBottom: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  block
                  disabled={!stageManager.canCompleteCurrentStage()}
                  loading={loading}
                  onClick={handleNextStage}
                  icon={<ArrowRightOutlined />}
                >
                  进入下一阶段
                </Button>
                
                <Button
                  block
                  disabled={!currentStage.previousStage}
                  onClick={handlePreviousStage}
                  icon={<ArrowLeftOutlined />}
                >
                  回到上一阶段
                </Button>

                <Button
                  block
                  danger
                  onClick={() => setShowResetModal(true)}
                  icon={<ReloadOutlined />}
                >
                  重置进度
                </Button>
              </Space>
            </Card>

            {/* 下一步建议 */}
            <Card title="下一步建议" size="small">
              <Alert
                message={stageManager.getNextStepSuggestion()}
                type="info"
                showIcon
              />
            </Card>

            {/* 进度统计 */}
            <Card title="进度统计" size="small" style={{ marginTop: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>当前阶段进度:</Text>
                  <Progress 
                    percent={getCurrentStageProgress()} 
                    size="small" 
                    status={getCurrentStageProgress() === 100 ? 'success' : 'active'}
                  />
                </div>
                <div>
                  <Text>已完成阶段: {progress.completedStages.length}</Text>
                </div>
                <div>
                  <Text>最后更新: {progress.lastUpdated.toLocaleString()}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* 重置确认对话框 */}
      <Modal
        title="确认重置"
        open={showResetModal}
        onOk={handleReset}
        onCancel={() => setShowResetModal(false)}
        okText="确认重置"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="警告"
          description="重置操作将清除所有进度记录，包括已完成的任务和阶段。此操作不可撤销。"
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <p>确定要重置开发进度吗？</p>
      </Modal>
    </div>
  );
};

export default DevelopmentProgress;