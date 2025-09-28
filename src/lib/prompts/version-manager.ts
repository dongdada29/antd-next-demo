/**
 * 提示词版本管理系统
 * 提供提示词的版本控制、更新机制和回滚功能
 */

export interface PromptVersion {
  id: string;
  version: string;
  content: string;
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    changelog: string[];
    tags: string[];
  };
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  metrics: {
    usage: number;
    success: number;
    feedback: number;
    performance: number;
  };
}

export interface VersionHistory {
  promptId: string;
  versions: PromptVersion[];
  currentVersion: string;
  branches: Record<string, string>; // branch name -> version
}

export interface UpdatePolicy {
  autoUpdate: boolean;
  updateChannel: 'stable' | 'beta' | 'alpha';
  rollbackOnError: boolean;
  maxVersions: number;
  updateInterval: number; // in hours
}

export interface MigrationRule {
  fromVersion: string;
  toVersion: string;
  transformations: {
    find: string | RegExp;
    replace: string;
    description: string;
  }[];
  validation: (content: string) => boolean;
}

/**
 * 版本管理器类
 */
export class VersionManager {
  private histories: Map<string, VersionHistory> = new Map();
  private policies: Map<string, UpdatePolicy> = new Map();
  private migrations: Map<string, MigrationRule[]> = new Map();
  private updateCallbacks: Map<string, ((version: PromptVersion) => void)[]> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
    this.setupMigrationRules();
  }

  /**
   * 初始化默认更新策略
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicy: UpdatePolicy = {
      autoUpdate: false,
      updateChannel: 'stable',
      rollbackOnError: true,
      maxVersions: 10,
      updateInterval: 24, // 24 hours
    };

    // 为不同类型的提示词设置策略
    this.policies.set('system', { ...defaultPolicy, autoUpdate: true });
    this.policies.set('component', { ...defaultPolicy, updateChannel: 'beta' });
    this.policies.set('page', defaultPolicy);
    this.policies.set('style', { ...defaultPolicy, maxVersions: 5 });
  }

  /**
   * 设置迁移规则
   */
  private setupMigrationRules(): void {
    // 示例迁移规则：从 v1.0 到 v1.1
    const v1_0_to_v1_1: MigrationRule = {
      fromVersion: '1.0.0',
      toVersion: '1.1.0',
      transformations: [
        {
          find: /className={cn\(/g,
          replace: 'className={cn(',
          description: '更新 cn 函数调用格式'
        },
        {
          find: 'React.FC',
          replace: 'React.FunctionComponent',
          description: '使用完整的 React.FunctionComponent 类型'
        }
      ],
      validation: (content: string) => {
        return content.includes('React.FunctionComponent') || !content.includes('React.FC');
      }
    };

    this.migrations.set('1.0.0->1.1.0', [v1_0_to_v1_1]);
  }

  /**
   * 创建新版本
   */
  createVersion(
    promptId: string,
    content: string,
    metadata: Partial<PromptVersion['metadata']>
  ): PromptVersion {
    const history = this.getOrCreateHistory(promptId);
    const currentVersion = this.getCurrentVersion(promptId);
    const newVersionNumber = this.generateVersionNumber(currentVersion?.version || '0.0.0');

    const version: PromptVersion = {
      id: `${promptId}-${newVersionNumber}`,
      version: newVersionNumber,
      content,
      metadata: {
        author: metadata.author || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: metadata.description || '',
        changelog: metadata.changelog || [],
        tags: metadata.tags || [],
      },
      validation: this.validateContent(content),
      metrics: {
        usage: 0,
        success: 0,
        feedback: 0,
        performance: 0,
      },
    };

    // 添加到历史记录
    history.versions.push(version);
    history.currentVersion = newVersionNumber;

    // 清理旧版本
    this.cleanupOldVersions(promptId);

    // 触发更新回调
    this.triggerUpdateCallbacks(promptId, version);

    return version;
  }

  /**
   * 获取当前版本
   */
  getCurrentVersion(promptId: string): PromptVersion | null {
    const history = this.histories.get(promptId);
    if (!history) return null;

    return history.versions.find(v => v.version === history.currentVersion) || null;
  }

  /**
   * 获取指定版本
   */
  getVersion(promptId: string, version: string): PromptVersion | null {
    const history = this.histories.get(promptId);
    if (!history) return null;

    return history.versions.find(v => v.version === version) || null;
  }

  /**
   * 获取版本历史
   */
  getVersionHistory(promptId: string): VersionHistory | null {
    return this.histories.get(promptId) || null;
  }

  /**
   * 切换到指定版本
   */
  switchToVersion(promptId: string, version: string): boolean {
    const history = this.histories.get(promptId);
    if (!history) return false;

    const targetVersion = history.versions.find(v => v.version === version);
    if (!targetVersion) return false;

    const previousVersion = history.currentVersion;
    history.currentVersion = version;

    // 记录版本切换
    this.logVersionSwitch(promptId, previousVersion, version);

    // 触发更新回调
    this.triggerUpdateCallbacks(promptId, targetVersion);

    return true;
  }

  /**
   * 回滚到上一个版本
   */
  rollback(promptId: string): boolean {
    const history = this.histories.get(promptId);
    if (!history || history.versions.length < 2) return false;

    const currentIndex = history.versions.findIndex(v => v.version === history.currentVersion);
    if (currentIndex <= 0) return false;

    const previousVersion = history.versions[currentIndex - 1];
    return this.switchToVersion(promptId, previousVersion.version);
  }

  /**
   * 更新提示词内容
   */
  updatePrompt(
    promptId: string,
    content: string,
    changelog: string[] = []
  ): PromptVersion {
    const currentVersion = this.getCurrentVersion(promptId);
    const metadata = currentVersion ? { ...currentVersion.metadata } : {};
    
    metadata.changelog = [...(metadata.changelog || []), ...changelog];
    metadata.updatedAt = new Date().toISOString();

    return this.createVersion(promptId, content, metadata);
  }

  /**
   * 应用迁移
   */
  applyMigration(promptId: string, fromVersion: string, toVersion: string): boolean {
    const migrationKey = `${fromVersion}->${toVersion}`;
    const rules = this.migrations.get(migrationKey);
    if (!rules) return false;

    const currentVersion = this.getCurrentVersion(promptId);
    if (!currentVersion || currentVersion.version !== fromVersion) return false;

    let content = currentVersion.content;

    // 应用所有转换规则
    for (const rule of rules) {
      for (const transformation of rule.transformations) {
        content = content.replace(transformation.find, transformation.replace);
      }

      // 验证迁移结果
      if (!rule.validation(content)) {
        console.error(`Migration validation failed for ${promptId}`);
        return false;
      }
    }

    // 创建新版本
    this.createVersion(promptId, content, {
      description: `Migrated from ${fromVersion} to ${toVersion}`,
      changelog: rules.flatMap(rule => 
        rule.transformations.map(t => t.description)
      ),
    });

    return true;
  }

  /**
   * 检查更新
   */
  async checkForUpdates(promptId: string): Promise<{
    hasUpdate: boolean;
    latestVersion?: string;
    changelog?: string[];
  }> {
    // 模拟检查远程更新
    const currentVersion = this.getCurrentVersion(promptId);
    if (!currentVersion) {
      return { hasUpdate: false };
    }

    // 这里应该连接到实际的更新服务
    const mockLatestVersion = this.generateVersionNumber(currentVersion.version);
    const hasUpdate = this.compareVersions(mockLatestVersion, currentVersion.version) > 0;

    return {
      hasUpdate,
      latestVersion: hasUpdate ? mockLatestVersion : undefined,
      changelog: hasUpdate ? ['Bug fixes and improvements'] : undefined,
    };
  }

  /**
   * 自动更新
   */
  async autoUpdate(promptId: string): Promise<boolean> {
    const policy = this.getUpdatePolicy(promptId);
    if (!policy.autoUpdate) return false;

    const updateInfo = await this.checkForUpdates(promptId);
    if (!updateInfo.hasUpdate) return false;

    try {
      // 模拟下载和应用更新
      const newContent = await this.downloadUpdate(promptId, updateInfo.latestVersion!);
      
      this.createVersion(promptId, newContent, {
        description: `Auto-update to ${updateInfo.latestVersion}`,
        changelog: updateInfo.changelog || [],
      });

      return true;
    } catch (error) {
      console.error(`Auto-update failed for ${promptId}:`, error);
      
      if (policy.rollbackOnError) {
        this.rollback(promptId);
      }
      
      return false;
    }
  }

  /**
   * 设置更新策略
   */
  setUpdatePolicy(promptId: string, policy: Partial<UpdatePolicy>): void {
    const currentPolicy = this.getUpdatePolicy(promptId);
    this.policies.set(promptId, { ...currentPolicy, ...policy });
  }

  /**
   * 获取更新策略
   */
  getUpdatePolicy(promptId: string): UpdatePolicy {
    return this.policies.get(promptId) || this.policies.get('default') || {
      autoUpdate: false,
      updateChannel: 'stable',
      rollbackOnError: true,
      maxVersions: 10,
      updateInterval: 24,
    };
  }

  /**
   * 注册更新回调
   */
  onUpdate(promptId: string, callback: (version: PromptVersion) => void): void {
    const callbacks = this.updateCallbacks.get(promptId) || [];
    callbacks.push(callback);
    this.updateCallbacks.set(promptId, callbacks);
  }

  /**
   * 获取版本统计
   */
  getVersionStats(promptId: string): {
    totalVersions: number;
    currentVersion: string;
    totalUsage: number;
    averageSuccess: number;
  } | null {
    const history = this.histories.get(promptId);
    if (!history) return null;

    const totalUsage = history.versions.reduce((sum, v) => sum + v.metrics.usage, 0);
    const totalSuccess = history.versions.reduce((sum, v) => sum + v.metrics.success, 0);

    return {
      totalVersions: history.versions.length,
      currentVersion: history.currentVersion,
      totalUsage,
      averageSuccess: totalUsage > 0 ? totalSuccess / totalUsage : 0,
    };
  }

  /**
   * 导出版本历史
   */
  exportHistory(promptId: string): VersionHistory | null {
    return this.histories.get(promptId) || null;
  }

  /**
   * 导入版本历史
   */
  importHistory(history: VersionHistory): void {
    this.histories.set(history.promptId, history);
  }

  // 私有辅助方法

  private getOrCreateHistory(promptId: string): VersionHistory {
    let history = this.histories.get(promptId);
    if (!history) {
      history = {
        promptId,
        versions: [],
        currentVersion: '1.0.0',
        branches: { main: '1.0.0' },
      };
      this.histories.set(promptId, history);
    }
    return history;
  }

  private generateVersionNumber(currentVersion: string): string {
    const parts = currentVersion.split('.').map(Number);
    parts[2] = (parts[2] || 0) + 1; // 增加补丁版本号
    return parts.join('.');
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }

    return 0;
  }

  private validateContent(content: string): PromptVersion['validation'] {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基本验证
    if (content.length < 50) {
      errors.push('内容过短');
    }

    if (!content.includes('TypeScript')) {
      warnings.push('缺少 TypeScript 相关内容');
    }

    if (!content.includes('shadcn/ui')) {
      warnings.push('缺少 shadcn/ui 相关内容');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private cleanupOldVersions(promptId: string): void {
    const history = this.histories.get(promptId);
    const policy = this.getUpdatePolicy(promptId);
    
    if (history && history.versions.length > policy.maxVersions) {
      // 保留最新的版本，删除最旧的
      history.versions = history.versions
        .sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime())
        .slice(0, policy.maxVersions);
    }
  }

  private triggerUpdateCallbacks(promptId: string, version: PromptVersion): void {
    const callbacks = this.updateCallbacks.get(promptId) || [];
    callbacks.forEach(callback => {
      try {
        callback(version);
      } catch (error) {
        console.error(`Update callback failed for ${promptId}:`, error);
      }
    });
  }

  private logVersionSwitch(promptId: string, from: string, to: string): void {
    console.log(`Version switch for ${promptId}: ${from} -> ${to}`);
  }

  private async downloadUpdate(promptId: string, version: string): Promise<string> {
    // 模拟下载更新内容
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Updated content for ${promptId} version ${version}`;
  }
}

/**
 * 默认版本管理器实例
 */
export const versionManager = new VersionManager();