'use client';

import React from 'react';
import { Badge, Tooltip, Progress, Space, Typography } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PlayCircleOutlined 
} from '@ant-design/icons';
import { DevelopmentStage, type ProjectProgress } from '../../lib/development-stage-manager';

const { Text } = Typography;

interface StageIndicatorProps {
  progress: ProjectProgress;
  size?: 'small' | 'default' | 'large';
  showProgress?: boolean;
  onClick?: () => void;
}

const STAGE_LABELS = {
  [DevelopmentStage.STATIC]: '静态页面',
  [DevelopmentStage.API_INTEGRATION]: 'API集成',
  [DevelopmentStage.DYNAMIC]: '动态数据',
  [DevelopmentStage.COMPLETED]: '已完成'
};

const STAGE_COLORS = {
  [DevelopmentStage.STATIC]: '#1890ff',
  [DevelopmentStage.API_INTEGRATION]: '#722ed1',
  [DevelopmentStage.DYNAMIC]: '#13c2c2',
  [DevelopmentStage.COMPLETED]: '#52c41a'
};

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  progress,
  size = 'default',
  showProgress = true,
  onClick
}) => {
  const currentStageProgress = progress.stageProgress[progress.currentStage] || 0;
  const isCompleted = progress.currentStage === DevelopmentStage.COMPLETED;
  
  const getStageIcon = () => {
    if (isCompleted) {
      return <CheckCircleOutlined style={{ color: STAGE_COLORS[progress.currentStage] }} />;
    }
    if (currentStageProgress > 0) {
      return <ClockCircleOutlined style={{ color: STAGE_COLORS[progress.currentStage] }} />;
    }
    return <PlayCircleOutlined style={{ color: STAGE_COLORS[progress.currentStage] }} />;
  };

  const getOverallProgress = () => {
    const totalStages = Object.keys(progress.stageProgress).length;
    const completedWeight = progress.completedStages.length * 100;
    const currentWeight = currentStageProgress;
    return Math.round((completedWeight + currentWeight) / totalStages);
  };

  const tooltipContent = (
    <div>
      <div><strong>当前阶段:</strong> {STAGE_LABELS[progress.currentStage]}</div>
      <div><strong>阶段进度:</strong> {currentStageProgress}%</div>
      <div><strong>总体进度:</strong> {getOverallProgress()}%</div>
      <div><strong>已完成阶段:</strong> {progress.completedStages.length}</div>
      <div><strong>最后更新:</strong> {progress.lastUpdated.toLocaleString()}</div>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} placement="bottomLeft">
      <div 
        style={{ 
          cursor: onClick ? 'pointer' : 'default',
          padding: size === 'small' ? '4px 8px' : '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${STAGE_COLORS[progress.currentStage]}20`,
          backgroundColor: `${STAGE_COLORS[progress.currentStage]}10`
        }}
        onClick={onClick}
      >
        <Space size="small" align="center">
          <Badge 
            status={isCompleted ? 'success' : 'processing'} 
            text={
              <Space size="small">
                {getStageIcon()}
                <Text strong style={{ fontSize: size === 'small' ? '12px' : '14px' }}>
                  {STAGE_LABELS[progress.currentStage]}
                </Text>
              </Space>
            }
          />
          
          {showProgress && (
            <div style={{ minWidth: size === 'small' ? '60px' : '80px' }}>
              <Progress 
                percent={currentStageProgress}
                size={size === 'small' ? 'small' : 'default'}
                strokeColor={STAGE_COLORS[progress.currentStage]}
                showInfo={size !== 'small'}
                trailColor={`${STAGE_COLORS[progress.currentStage]}20`}
              />
            </div>
          )}
        </Space>
      </div>
    </Tooltip>
  );
};

export default StageIndicator;