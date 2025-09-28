/**
 * Template Update System
 * Handles automatic updates, version management, and synchronization
 */

import { templateRegistry, Template, TemplateMetadata } from './template-registry';
import { templateMarketplace } from './template-marketplace';

export interface UpdateConfig {
  autoUpdate: boolean;
  checkInterval: number; // in milliseconds
  backupBeforeUpdate: boolean;
  allowBreakingUpdates: boolean;
  notificationEndpoint?: string;
}

export interface UpdateResult {
  templateId: string;
  success: boolean;
  oldVersion: string;
  newVersion: string;
  breaking: boolean;
  changelog?: string;
  error?: string;
  backupPath?: string;
}

export interface UpdateNotification {
  type: 'update_available' | 'update_completed' | 'update_failed';
  templateId: string;
  templateName: string;
  currentVersion: string;
  latestVersion: string;
  breaking: boolean;
  changelog?: string;
  error?: string;
  timestamp: string;
}

export class TemplateUpdater {
  private config: UpdateConfig;
  private updateInterval?: NodeJS.Timeout;
  private isUpdating = false;
  private updateQueue: string[] = [];

  constructor(config: Partial<UpdateConfig> = {}) {
    this.config = {
      autoUpdate: false,
      checkInterval: 24 * 60 * 60 * 1000, // 24 hours
      backupBeforeUpdate: true,
      allowBreakingUpdates: false,
      ...config
    };
  }

  /**
   * Start automatic update checking
   */
  startAutoUpdate(): void {
    if (this.updateInterval) {
      this.stopAutoUpdate();
    }

    this.updateInterval = setInterval(async () => {
      try {
        await this.checkAndUpdateAll();
      } catch (error) {
        console.error('Auto-update check failed:', error);
      }
    }, this.config.checkInterval);

    console.log(`Auto-update started with ${this.config.checkInterval / 1000}s interval`);
  }

  /**
   * Stop automatic update checking
   */
  stopAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
      console.log('Auto-update stopped');
    }
  }

  /**
   * Check for updates for all installed templates
   */
  async checkForUpdates(): Promise<{
    id: string;
    name: string;
    currentVersion: string;
    latestVersion: string;
    hasUpdate: boolean;
    breaking: boolean;
    changelog?: string;
  }[]> {
    try {
      const updates = await templateMarketplace.checkForUpdates();
      
      // Send notifications for available updates
      for (const update of updates.filter(u => u.hasUpdate)) {
        await this.sendNotification({
          type: 'update_available',
          templateId: update.id,
          templateName: update.name,
          currentVersion: update.currentVersion,
          latestVersion: update.latestVersion,
          breaking: update.breaking,
          changelog: update.changelog,
          timestamp: new Date().toISOString()
        });
      }

      return updates;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      throw error;
    }
  }

  /**
   * Update specific template
   */
  async updateTemplate(templateId: string, targetVersion?: string): Promise<UpdateResult> {
    if (this.updateQueue.includes(templateId)) {
      throw new Error(`Template ${templateId} is already queued for update`);
    }

    this.updateQueue.push(templateId);

    try {
      // Get current template info
      const currentTemplate = await this.getCurrentTemplate(templateId);
      if (!currentTemplate) {
        throw new Error(`Template ${templateId} not found locally`);
      }

      // Get latest version info
      const versions = await templateRegistry.getTemplateVersions(templateId);
      const latestVersion = targetVersion || versions[0]?.version;
      
      if (!latestVersion) {
        throw new Error(`No versions available for template ${templateId}`);
      }

      if (currentTemplate.metadata.version === latestVersion) {
        return {
          templateId,
          success: true,
          oldVersion: currentTemplate.metadata.version,
          newVersion: latestVersion,
          breaking: false
        };
      }

      // Check if update is breaking
      const targetVersionInfo = versions.find(v => v.version === latestVersion);
      const isBreaking = targetVersionInfo?.breaking || false;

      if (isBreaking && !this.config.allowBreakingUpdates) {
        throw new Error(`Breaking update detected for ${templateId}. Enable allowBreakingUpdates to proceed.`);
      }

      // Create backup if enabled
      let backupPath: string | undefined;
      if (this.config.backupBeforeUpdate) {
        backupPath = await this.createBackup(currentTemplate);
      }

      try {
        // Download new version
        const newTemplate = await templateRegistry.downloadTemplate(templateId, latestVersion);
        
        // Update template files
        await this.replaceTemplateFiles(currentTemplate, newTemplate);
        
        // Update local registry
        await this.updateLocalRegistry(newTemplate);

        const result: UpdateResult = {
          templateId,
          success: true,
          oldVersion: currentTemplate.metadata.version,
          newVersion: latestVersion,
          breaking: isBreaking,
          changelog: targetVersionInfo?.changelog,
          backupPath
        };

        // Send success notification
        await this.sendNotification({
          type: 'update_completed',
          templateId,
          templateName: newTemplate.metadata.name,
          currentVersion: result.oldVersion,
          latestVersion: result.newVersion,
          breaking: isBreaking,
          changelog: result.changelog,
          timestamp: new Date().toISOString()
        });

        return result;

      } catch (error) {
        // Restore from backup if update failed
        if (backupPath) {
          try {
            await this.restoreFromBackup(backupPath, templateId);
          } catch (restoreError) {
            console.error('Failed to restore from backup:', restoreError);
          }
        }

        throw error;
      }

    } catch (error) {
      const result: UpdateResult = {
        templateId,
        success: false,
        oldVersion: 'unknown',
        newVersion: targetVersion || 'latest',
        breaking: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      // Send failure notification
      await this.sendNotification({
        type: 'update_failed',
        templateId,
        templateName: templateId,
        currentVersion: result.oldVersion,
        latestVersion: result.newVersion,
        breaking: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });

      return result;

    } finally {
      // Remove from queue
      const index = this.updateQueue.indexOf(templateId);
      if (index > -1) {
        this.updateQueue.splice(index, 1);
      }
    }
  }

  /**
   * Update all templates that have available updates
   */
  async updateAll(options: {
    includeBreaking?: boolean;
    dryRun?: boolean;
  } = {}): Promise<UpdateResult[]> {
    if (this.isUpdating) {
      throw new Error('Update process is already running');
    }

    this.isUpdating = true;

    try {
      const updates = await this.checkForUpdates();
      const availableUpdates = updates.filter(u => u.hasUpdate);

      if (!options.includeBreaking) {
        availableUpdates.filter(u => !u.breaking);
      }

      if (options.dryRun) {
        console.log('Dry run - would update:', availableUpdates.map(u => `${u.id}@${u.latestVersion}`));
        return [];
      }

      const results: UpdateResult[] = [];

      // Update templates sequentially to avoid conflicts
      for (const update of availableUpdates) {
        try {
          const result = await this.updateTemplate(update.id, update.latestVersion);
          results.push(result);
        } catch (error) {
          results.push({
            templateId: update.id,
            success: false,
            oldVersion: update.currentVersion,
            newVersion: update.latestVersion,
            breaking: update.breaking,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return results;

    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Check and update all templates (used by auto-updater)
   */
  private async checkAndUpdateAll(): Promise<void> {
    if (!this.config.autoUpdate || this.isUpdating) {
      return;
    }

    try {
      await this.updateAll({
        includeBreaking: this.config.allowBreakingUpdates
      });
    } catch (error) {
      console.error('Auto-update failed:', error);
    }
  }

  /**
   * Create backup of current template
   */
  private async createBackup(template: Template): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `./backups/${template.metadata.id}-${template.metadata.version}-${timestamp}`;

    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      // Create backup directory
      await fs.mkdir(backupPath, { recursive: true });

      // Save template metadata
      await fs.writeFile(
        path.join(backupPath, 'metadata.json'),
        JSON.stringify(template.metadata, null, 2)
      );

      // Save template files
      for (const file of template.files) {
        const filePath = path.join(backupPath, file.path);
        const fileDir = path.dirname(filePath);
        
        await fs.mkdir(fileDir, { recursive: true });
        await fs.writeFile(filePath, file.content);
      }

      console.log(`Backup created: ${backupPath}`);
      return backupPath;

    } catch (error) {
      console.error('Failed to create backup:', error);
      throw new Error(`Backup creation failed: ${error}`);
    }
  }

  /**
   * Restore template from backup
   */
  private async restoreFromBackup(backupPath: string, templateId: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      // Read backup metadata
      const metadataPath = path.join(backupPath, 'metadata.json');
      const metadataContent = await fs.readFile(metadataPath, 'utf8');
      const metadata: TemplateMetadata = JSON.parse(metadataContent);

      // Read backup files
      const files = await this.readBackupFiles(backupPath);

      const template: Template = {
        metadata,
        files
      };

      // Restore template files
      await this.replaceTemplateFiles(null, template);
      
      // Update local registry
      await this.updateLocalRegistry(template);

      console.log(`Template ${templateId} restored from backup: ${backupPath}`);

    } catch (error) {
      console.error('Failed to restore from backup:', error);
      throw new Error(`Backup restoration failed: ${error}`);
    }
  }

  private async readBackupFiles(backupPath: string): Promise<any[]> {
    // Implementation would recursively read all files from backup directory
    // This is a simplified version
    return [];
  }

  private async getCurrentTemplate(templateId: string): Promise<Template | null> {
    // Implementation would retrieve current template from local storage
    return null;
  }

  private async replaceTemplateFiles(oldTemplate: Template | null, newTemplate: Template): Promise<void> {
    // Implementation would replace template files on disk
    console.log(`Replacing template files for: ${newTemplate.metadata.id}`);
  }

  private async updateLocalRegistry(template: Template): Promise<void> {
    // Implementation would update local template registry
    console.log(`Updated local registry for: ${template.metadata.id}`);
  }

  private async sendNotification(notification: UpdateNotification): Promise<void> {
    if (!this.config.notificationEndpoint) {
      console.log('Update notification:', notification);
      return;
    }

    try {
      await fetch(this.config.notificationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}

// Default updater instance
export const templateUpdater = new TemplateUpdater();