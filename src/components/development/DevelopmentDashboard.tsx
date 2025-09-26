'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Space,
  Modal,
  message,
  Typography,
  Divider
} from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  SettingOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import { DevelopmentProgress } from './DevelopmentProgress';
import { DevelopmentGuidance } from './DevelopmentGuidance';
import { SmartSuggestions } from './SmartSuggestions';
import { StageIndicator } from './StageIndicator';
import { StageTransition } from './StageTransition';
import { 
  DevelopmentStageManager, 
  DevelopmentStage, 
  type StageDefinition,
  type ProjectProgress 
} from '../../lib/development-stage-manager';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface DevelopmentDashboardProps {
  initialStage?: DevelopmentStage;
  onStageChange?: (stage: DevelopmentStage) => void;
  onTaskComplete?: (taskId: string) => void;
}

export const DevelopmentDashboard: React.FC<DevelopmentDashboardProps> = ({
  initialStage = DevelopmentStage.STATIC,
  onStageChange,
  onTaskComplete
}) => {
  const [stageManager] = useState(() => new DevelopmentStageManager());
  const [progress, setProgress] = useState<ProjectProgress>(stageManager.getProgress());
  const [currentStage, setCurrentStage] = useState<StageDefinition | undefined>();
  const [activeView, setActiveView] = useState<'dashboard' | 'guidance'>('dashboard');
  const [showTransition, setShowTransition] = useState(false);
  const [nextStage, setNextStage] = useState<StageDefinition | undefined>();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // 初始化和更新状态
  useEffect(() => {
    refreshState();
  }, []);

  const refreshState = () => {
    const newProgress = stageManager.getProgress();
    const newCurrentStage = stageManager.getCurrentStage();
    
    setProgress(newProgress);
    setCurrentStage(newCurrentStage);
    
    if (newCurrentStage?.nextStage) {
      setNextStage(stageManager.getStage(newCurrentStage.nextStage));
    }
  };

  // 处理阶段切换
  const handleStageChange = (stage: DevelopmentStage) => {
    refreshState();
    onStageChange?.(stage);
    message.success(`已切换到${stageManager.getCurrentStage()?.title}阶段`);
  };

  // 处理任务完成
  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      await stageManager.updateTaskStatus(taskId, completed);
      refreshState();
      onTaskComplete?.(taskId);
      
      if (completed) {
        message.success('任务已完成');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '任务更新失败');
    }
  };

  // 处理步骤完成
  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
    message.success('步骤已完成');
  };

  // 显示阶段切换对话框
  const showStageTransition = () => {
    if (!currentStage || !nextStage) return;
    setShowTransition(true);
  };

  // 确认阶段切换
  const confirmStageTransition = async () => {
    try {
      const success = await stageManager.completeCurrentStage();
      if (success) {
        setShowTransition(false);
        handleStageChange(stageManager.getProgress().currentStage);
      }
    } catch (error) {
      message.error('阶段切换失败');
    }
  };

  // 应用智能建议
  const handleSuggestionApply = (suggestion: string) => {
    message.info(`已应用建议: ${suggestion.substring(0, 50)}...`);
  };

  const renderSidebar = () => (
    <Sider 
      width={280} 
      theme="light" 
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ 
        borderRight: '1px solid #f0f0f0',
        height: '100vh',
        overflow: 'auto'
      }}
    >
      <div style={{ padding: '16px' }}>
        {!collapsed && (
          <>
            <Title level={4} style={{ marginBottom: '16px' }}>开发助手</Title>
            
            {/* 当前阶段指示器 */}
            <StageIndicator 
              progress={progress}
              onClick={() => setActiveView('dashboard')}
              style={{ marginBottom: '16px' }}
            />

            <Divider />

            {/* 智能建议 */}
            <SmartSuggestions
              stage={progress.currentStage}
              onSuggestionApply={handleSuggestionApply}
              maxSuggestions={3}
            />
          </>
        )}
      </div>
    </Sider>
  );

  const renderHeader = () => (
    <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space size="large">
            <Title level={3} style={{ margin: 0 }}>
              开发流程管理系统
            </Title>
            {currentStage && (
              <span style={{ color: '#666' }}>
                当前阶段: {currentStage.title}
              </span>
            )}
          </Space>
        </Col>
        
        <Col>
          <Space>
            <Button
              type={activeView === 'dashboard' ? 'primary' : 'default'}
              icon={<DashboardOutlined />}
              onClick={() => setActiveView('dashboard')}
            >
              进度面板
            </Button>
            
            <Button
              type={activeView === 'guidance' ? 'primary' : 'default'}
              icon={<BookOutlined />}
              onClick={() => setActiveView('guidance')}
            >
              开发指导
            </Button>

            {stageManager.canCompleteCurrentStage() && nextStage && (
              <Button
                type="primary"
                onClick={showStageTransition}
              >
                进入下一阶段
              </Button>
            )}

            <Button
              icon={<FullscreenOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Space>
        </Col>
      </Row>
    </Header>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DevelopmentProgress
            onStageChange={handleStageChange}
            onTaskUpdate={handleTaskComplete}
          />
        );
      
      case 'guidance':
        return currentStage ? (
          <DevelopmentGuidance
            stage={currentStage.stage}
            onStepComplete={handleStepComplete}
            completedSteps={completedSteps}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {renderSidebar()}
      
      <Layout>
        {renderHeader()}
        
        <Content style={{ padding: '0', overflow: 'auto' }}>
          {renderContent()}
        </Content>
      </Layout>

      {/* 阶段切换对话框 */}
      {showTransition && currentStage && nextStage && (
        <StageTransition
          visible={showTransition}
          currentStage={currentStage}
          nextStage={nextStage}
          canTransition={stageManager.canCompleteCurrentStage()}
          incompleteTasks={
            currentStage.tasks
              .filter(t => t.required && !t.completed)
              .map(t => t.title)
          }
          onConfirm={confirmStageTransition}
          onCancel={() => setShowTransition(false)}
        />
      )}
    </Layout>
  );
};

export default DevelopmentDashboard;