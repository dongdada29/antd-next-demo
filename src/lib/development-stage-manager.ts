/**
 * 开发阶段管理器
 * 实现"静态→接口→动态"的分阶段开发流程
 */

export enum DevelopmentStage {
  STATIC = 'static',
  API_INTEGRATION = 'api_integration', 
  DYNAMIC = 'dynamic',
  COMPLETED = 'completed'
}

export interface StageTask {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  validationFn?: () => Promise<boolean>;
}

export interface StageDefinition {
  stage: DevelopmentStage;
  title: string;
  description: string;
  tasks: StageTask[];
  completionCriteria: string[];
  nextStage?: DevelopmentStage;
  previousStage?: DevelopmentStage;
}

export interface ProjectProgress {
  currentStage: DevelopmentStage;
  completedStages: DevelopmentStage[];
  stageProgress: Record<DevelopmentStage, number>; // 0-100 percentage
  lastUpdated: Date;
}

export class DevelopmentStageManager {
  private stages: Map<DevelopmentStage, StageDefinition>;
  private progress: ProjectProgress;

  constructor() {
    this.stages = new Map();
    this.initializeStages();
    this.progress = {
      currentStage: DevelopmentStage.STATIC,
      completedStages: [],
      stageProgress: {
        [DevelopmentStage.STATIC]: 0,
        [DevelopmentStage.API_INTEGRATION]: 0,
        [DevelopmentStage.DYNAMIC]: 0,
        [DevelopmentStage.COMPLETED]: 0
      },
      lastUpdated: new Date()
    };
  }

  private initializeStages(): void {
    // 静态页面阶段
    this.stages.set(DevelopmentStage.STATIC, {
      stage: DevelopmentStage.STATIC,
      title: '静态页面创建',
      description: '使用Ant Design组件创建静态页面布局和基础交互',
      tasks: [
        {
          id: 'static-layout',
          title: '创建页面布局',
          description: '设计并实现页面的基础布局结构',
          required: true,
          completed: false
        },
        {
          id: 'static-components',
          title: '实现UI组件',
          description: '使用Ant Design组件构建界面元素',
          required: true,
          completed: false
        },
        {
          id: 'static-mock-data',
          title: '添加模拟数据',
          description: '创建模拟数据以展示页面效果',
          required: true,
          completed: false
        },
        {
          id: 'static-responsive',
          title: '响应式设计',
          description: '确保页面在不同设备上的显示效果',
          required: false,
          completed: false
        }
      ],
      completionCriteria: [
        '页面能够正常渲染',
        '所有UI组件显示正确',
        '模拟数据展示完整',
        '基础交互功能正常'
      ],
      nextStage: DevelopmentStage.API_INTEGRATION
    });

    // API集成阶段
    this.stages.set(DevelopmentStage.API_INTEGRATION, {
      stage: DevelopmentStage.API_INTEGRATION,
      title: 'API接口集成',
      description: '收集接口文档并创建API服务层',
      tasks: [
        {
          id: 'api-documentation',
          title: '收集接口文档',
          description: '获取并验证后端API接口文档',
          required: true,
          completed: false
        },
        {
          id: 'api-types',
          title: '生成类型定义',
          description: '基于接口文档生成TypeScript类型',
          required: true,
          completed: false
        },
        {
          id: 'api-services',
          title: '创建API服务',
          description: '实现API调用函数和错误处理',
          required: true,
          completed: false
        },
        {
          id: 'api-testing',
          title: '测试API集成',
          description: '验证API调用和数据处理的正确性',
          required: false,
          completed: false
        }
      ],
      completionCriteria: [
        '接口文档格式正确',
        '类型定义完整',
        'API服务函数可用',
        '错误处理机制完善'
      ],
      previousStage: DevelopmentStage.STATIC,
      nextStage: DevelopmentStage.DYNAMIC
    });

    // 动态数据阶段
    this.stages.set(DevelopmentStage.DYNAMIC, {
      stage: DevelopmentStage.DYNAMIC,
      title: '动态数据加载',
      description: '将静态页面转换为动态数据驱动页面',
      tasks: [
        {
          id: 'dynamic-hooks',
          title: '实现数据Hooks',
          description: '创建数据获取和状态管理Hooks',
          required: true,
          completed: false
        },
        {
          id: 'dynamic-integration',
          title: '集成动态数据',
          description: '将API调用集成到页面组件中',
          required: true,
          completed: false
        },
        {
          id: 'dynamic-routing',
          title: '处理路由参数',
          description: '基于URL参数加载相应数据',
          required: true,
          completed: false
        },
        {
          id: 'dynamic-optimization',
          title: '性能优化',
          description: '实现缓存、预加载等性能优化',
          required: false,
          completed: false
        }
      ],
      completionCriteria: [
        '数据能够动态加载',
        '路由参数处理正确',
        '加载和错误状态完善',
        '用户体验流畅'
      ],
      previousStage: DevelopmentStage.API_INTEGRATION,
      nextStage: DevelopmentStage.COMPLETED
    });

    // 完成阶段
    this.stages.set(DevelopmentStage.COMPLETED, {
      stage: DevelopmentStage.COMPLETED,
      title: '开发完成',
      description: '所有功能开发完成，应用可以正常使用',
      tasks: [],
      completionCriteria: [
        '所有功能正常工作',
        '代码质量符合标准',
        '用户体验良好'
      ],
      previousStage: DevelopmentStage.DYNAMIC
    });
  }

  /**
   * 获取当前阶段信息
   */
  getCurrentStage(): StageDefinition | undefined {
    return this.stages.get(this.progress.currentStage);
  }

  /**
   * 获取指定阶段信息
   */
  getStage(stage: DevelopmentStage): StageDefinition | undefined {
    return this.stages.get(stage);
  }

  /**
   * 获取所有阶段
   */
  getAllStages(): StageDefinition[] {
    return Array.from(this.stages.values());
  }

  /**
   * 获取项目进度
   */
  getProgress(): ProjectProgress {
    return { ...this.progress };
  }

  /**
   * 更新任务完成状态
   */
  async updateTaskStatus(taskId: string, completed: boolean): Promise<void> {
    const currentStage = this.getCurrentStage();
    if (!currentStage) return;

    const task = currentStage.tasks.find(t => t.id === taskId);
    if (!task) return;

    // 如果有验证函数，先执行验证
    if (completed && task.validationFn) {
      const isValid = await task.validationFn();
      if (!isValid) {
        throw new Error(`任务 "${task.title}" 验证失败`);
      }
    }

    task.completed = completed;
    this.updateStageProgress();
    this.progress.lastUpdated = new Date();
  }

  /**
   * 计算并更新阶段进度
   */
  private updateStageProgress(): void {
    const currentStage = this.getCurrentStage();
    if (!currentStage) return;

    const totalTasks = currentStage.tasks.length;
    const completedTasks = currentStage.tasks.filter(t => t.completed).length;
    
    this.progress.stageProgress[currentStage.stage] = 
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
  }

  /**
   * 检查当前阶段是否可以完成
   */
  canCompleteCurrentStage(): boolean {
    const currentStage = this.getCurrentStage();
    if (!currentStage) return false;

    // 检查所有必需任务是否完成
    const requiredTasks = currentStage.tasks.filter(t => t.required);
    return requiredTasks.every(t => t.completed);
  }

  /**
   * 完成当前阶段并进入下一阶段
   */
  async completeCurrentStage(): Promise<boolean> {
    if (!this.canCompleteCurrentStage()) {
      return false;
    }

    const currentStage = this.getCurrentStage();
    if (!currentStage || !currentStage.nextStage) {
      return false;
    }

    // 标记当前阶段为已完成
    this.progress.completedStages.push(this.progress.currentStage);
    this.progress.stageProgress[this.progress.currentStage] = 100;

    // 切换到下一阶段
    this.progress.currentStage = currentStage.nextStage;
    this.progress.lastUpdated = new Date();

    return true;
  }

  /**
   * 回退到上一阶段
   */
  goToPreviousStage(): boolean {
    const currentStage = this.getCurrentStage();
    if (!currentStage || !currentStage.previousStage) {
      return false;
    }

    // 从已完成阶段中移除当前阶段
    const index = this.progress.completedStages.indexOf(this.progress.currentStage);
    if (index > -1) {
      this.progress.completedStages.splice(index, 1);
    }

    // 切换到上一阶段
    this.progress.currentStage = currentStage.previousStage;
    this.progress.lastUpdated = new Date();

    return true;
  }

  /**
   * 获取下一步操作建议
   */
  getNextStepSuggestion(): string {
    const currentStage = this.getCurrentStage();
    if (!currentStage) return '无法获取当前阶段信息';

    const incompleteTasks = currentStage.tasks.filter(t => !t.completed && t.required);
    
    if (incompleteTasks.length > 0) {
      const nextTask = incompleteTasks[0];
      return `建议完成任务: ${nextTask.title} - ${nextTask.description}`;
    }

    if (this.canCompleteCurrentStage()) {
      return `当前阶段已完成，可以进入下一阶段: ${currentStage.nextStage}`;
    }

    return '请完成当前阶段的所有必需任务';
  }

  /**
   * 验证阶段切换的合法性
   */
  validateStageTransition(fromStage: DevelopmentStage, toStage: DevelopmentStage): boolean {
    const from = this.stages.get(fromStage);
    const to = this.stages.get(toStage);

    if (!from || !to) return false;

    // 只能前进到下一阶段或回退到上一阶段
    return from.nextStage === toStage || from.previousStage === toStage;
  }

  /**
   * 重置项目进度
   */
  resetProgress(): void {
    this.progress = {
      currentStage: DevelopmentStage.STATIC,
      completedStages: [],
      stageProgress: {
        [DevelopmentStage.STATIC]: 0,
        [DevelopmentStage.API_INTEGRATION]: 0,
        [DevelopmentStage.DYNAMIC]: 0,
        [DevelopmentStage.COMPLETED]: 0
      },
      lastUpdated: new Date()
    };

    // 重置所有任务状态
    this.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        task.completed = false;
      });
    });
  }
}