/**
 * 开发阶段管理相关类型定义
 */

export { 
  DevelopmentStage, 
  type StageTask, 
  type StageDefinition, 
  type ProjectProgress 
} from '../lib/development-stage-manager';

export interface StageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StageTransitionEvent {
  fromStage: DevelopmentStage;
  toStage: DevelopmentStage;
  timestamp: Date;
  reason?: string;
}

export interface DevelopmentMetrics {
  totalTimeSpent: number; // in minutes
  stageTimeSpent: Record<DevelopmentStage, number>;
  tasksCompleted: number;
  totalTasks: number;
  averageTaskTime: number;
}