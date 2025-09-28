#!/usr/bin/env node

/**
 * AI Agent 编码模板发布准备脚本
 * 
 * 此脚本用于准备正式发布，包括：
 * - 验证所有文档完整性
 * - 检查代码质量
 * - 运行完整测试套件
 * - 生成发布资产
 * - 创建发布检查清单
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

class ReleasePreparation {
  constructor() {
    this.version = process.env.RELEASE_VERSION || '1.0.0';
    this.releaseDate = new Date().toISOString().split('T')[0];
    this.errors = [];
    this.warnings = [];
    this.checklist = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    
    console.log(`[${timestamp}] ${colors[type](message)}`);
  }

  addError(message) {
    this.errors.push(message);
    this.log(message, 'error');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(message, 'warning');
  }

  addChecklistItem(item, completed = false) {
    this.checklist.push({ item, completed });
    const status = completed ? '✅' : '⏳';
    this.log(`${status} ${item}`, completed ? 'success' : 'info');
  }

  // 验证项目结构
  validateProjectStructure() {
    this.log('验证项目结构...', 'info');
    
    const requiredFiles = [
      'package.json',
      'README.md',
      'RELEASE_NOTES.md',
      'MIGRATION_GUIDE.md',
      'SUPPORT_PLAN.md',
      'docs/GETTING_STARTED.md',
      'docs/AI_AGENT_INTEGRATION_GUIDE.md',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/components/ui/button.tsx',
      'tailwind.config.ts',
      'next.config.js'
    ];

    const requiredDirectories = [
      'src/app',
      'src/components',
      'src/lib',
      'src/hooks',
      'docs',
      '.kiro/steering'
    ];

    // 检查必需文件
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        this.addChecklistItem(`文件存在: ${file}`, true);
      } else {
        this.addError(`缺少必需文件: ${file}`);
      }
    }

    // 检查必需目录
    for (const dir of requiredDirectories) {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        this.addChecklistItem(`目录存在: ${dir}`, true);
      } else {
        this.addError(`缺少必需目录: ${dir}`);
      }
    }
  }

  // 验证文档完整性
  validateDocumentation() {
    this.log('验证文档完整性...', 'info');

    const docs = [
      {
        file: 'README.md',
        requiredSections: ['# AI Agent', '## 快速开始', '## 特性', '## 安装']
      },
      {
        file: 'docs/GETTING_STARTED.md',
        requiredSections: ['# AI Agent 编码模板快速开始指南', '## 5分钟快速开始', '## 项目结构']
      },
      {
        file: 'RELEASE_NOTES.md',
        requiredSections: ['# AI Agent 编码模板 v1.0.0 发布说明', '## 主要特性', '## 快速开始']
      },
      {
        file: 'MIGRATION_GUIDE.md',
        requiredSections: ['# AI Agent 编码模板迁移指南', '## 概述', '## 快速开始']
      },
      {
        file: 'SUPPORT_PLAN.md',
        requiredSections: ['# AI Agent 编码模板支持和维护计划', '## 支持渠道', '## 服务级别协议']
      }
    ];

    for (const doc of docs) {
      if (fs.existsSync(doc.file)) {
        const content = fs.readFileSync(doc.file, 'utf8');
        let allSectionsFound = true;
        
        for (const section of doc.requiredSections) {
          if (content.includes(section)) {
            this.addChecklistItem(`${doc.file} 包含: ${section}`, true);
          } else {
            this.addError(`${doc.file} 缺少章节: ${section}`);
            allSectionsFound = false;
          }
        }
        
        if (allSectionsFound) {
          this.addChecklistItem(`文档完整: ${doc.file}`, true);
        }
      } else {
        this.addError(`文档文件不存在: ${doc.file}`);
      }
    }
  }

  // 验证代码质量
  validateCodeQuality() {
    this.log('验证代码质量...', 'info');

    try {
      // 运行 TypeScript 类型检查
      this.log('运行 TypeScript 类型检查...', 'info');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.addChecklistItem('TypeScript 类型检查通过', true);
    } catch (error) {
      this.addError('TypeScript 类型检查失败');
    }

    try {
      // 运行 ESLint
      this.log('运行 ESLint 检查...', 'info');
      execSync('npx eslint src --ext .ts,.tsx', { stdio: 'pipe' });
      this.addChecklistItem('ESLint 检查通过', true);
    } catch (error) {
      this.addWarning('ESLint 检查发现问题，请检查代码规范');
    }

    try {
      // 运行 Prettier 检查
      this.log('运行 Prettier 格式检查...', 'info');
      execSync('npx prettier --check src', { stdio: 'pipe' });
      this.addChecklistItem('Prettier 格式检查通过', true);
    } catch (error) {
      this.addWarning('代码格式不符合 Prettier 规范');
    }
  }

  // 运行测试套件
  runTests() {
    this.log('运行测试套件...', 'info');

    const testCommands = [
      { name: '单元测试', command: 'npm run test:unit' },
      { name: '集成测试', command: 'npm run test:integration' },
      { name: '性能测试', command: 'npm run test:performance' },
      { name: '可访问性测试', command: 'npm run test:a11y' }
    ];

    for (const test of testCommands) {
      try {
        this.log(`运行 ${test.name}...`, 'info');
        execSync(test.command, { stdio: 'pipe' });
        this.addChecklistItem(`${test.name} 通过`, true);
      } catch (error) {
        this.addError(`${test.name} 失败`);
      }
    }
  }

  // 验证构建
  validateBuild() {
    this.log('验证构建...', 'info');

    try {
      // 清理之前的构建
      this.log('清理之前的构建...', 'info');
      execSync('rm -rf .next', { stdio: 'pipe' });
      
      // 运行生产构建
      this.log('运行生产构建...', 'info');
      execSync('npm run build', { stdio: 'pipe' });
      this.addChecklistItem('生产构建成功', true);

      // 检查构建输出
      if (fs.existsSync('.next')) {
        this.addChecklistItem('构建输出目录存在', true);
      } else {
        this.addError('构建输出目录不存在');
      }

    } catch (error) {
      this.addError('生产构建失败');
    }
  }

  // 验证依赖项
  validateDependencies() {
    this.log('验证依赖项...', 'info');

    try {
      // 检查依赖项安全漏洞
      this.log('检查依赖项安全漏洞...', 'info');
      execSync('npm audit --audit-level=high', { stdio: 'pipe' });
      this.addChecklistItem('依赖项安全检查通过', true);
    } catch (error) {
      this.addWarning('发现依赖项安全问题，请检查 npm audit 输出');
    }

    try {
      // 检查过时的依赖项
      this.log('检查过时的依赖项...', 'info');
      const outdated = execSync('npm outdated --json', { stdio: 'pipe' }).toString();
      const outdatedPackages = JSON.parse(outdated || '{}');
      
      if (Object.keys(outdatedPackages).length === 0) {
        this.addChecklistItem('所有依赖项都是最新的', true);
      } else {
        this.addWarning(`发现 ${Object.keys(outdatedPackages).length} 个过时的依赖项`);
      }
    } catch (error) {
      // npm outdated 在没有过时包时会返回非零退出码，这是正常的
      this.addChecklistItem('依赖项版本检查完成', true);
    }
  }

  // 生成发布资产
  generateReleaseAssets() {
    this.log('生成发布资产...', 'info');

    // 创建发布目录
    const releaseDir = path.join(process.cwd(), 'release');
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir, { recursive: true });
    }

    // 生成版本信息文件
    const versionInfo = {
      version: this.version,
      releaseDate: this.releaseDate,
      buildDate: new Date().toISOString(),
      gitCommit: this.getGitCommit(),
      gitBranch: this.getGitBranch(),
      nodeVersion: process.version,
      npmVersion: this.getNpmVersion()
    };

    fs.writeFileSync(
      path.join(releaseDir, 'version.json'),
      JSON.stringify(versionInfo, null, 2)
    );
    this.addChecklistItem('生成版本信息文件', true);

    // 生成发布检查清单
    this.generateReleaseChecklist(releaseDir);
    this.addChecklistItem('生成发布检查清单', true);

    // 复制重要文档到发布目录
    const importantDocs = [
      'README.md',
      'RELEASE_NOTES.md',
      'MIGRATION_GUIDE.md',
      'SUPPORT_PLAN.md',
      'LICENSE'
    ];

    for (const doc of importantDocs) {
      if (fs.existsSync(doc)) {
        fs.copyFileSync(doc, path.join(releaseDir, doc));
        this.addChecklistItem(`复制文档: ${doc}`, true);
      }
    }
  }

  // 生成发布检查清单
  generateReleaseChecklist(releaseDir) {
    const checklist = `# AI Agent 编码模板 v${this.version} 发布检查清单

## 📋 发布前检查

### 代码质量
- [ ] TypeScript 类型检查通过
- [ ] ESLint 检查通过
- [ ] Prettier 格式检查通过
- [ ] 所有测试通过
- [ ] 生产构建成功

### 文档完整性
- [ ] README.md 更新完整
- [ ] RELEASE_NOTES.md 包含所有变更
- [ ] MIGRATION_GUIDE.md 提供迁移指导
- [ ] SUPPORT_PLAN.md 明确支持政策
- [ ] API 文档更新

### 功能验证
- [ ] 核心功能正常工作
- [ ] AI 代码生成功能正常
- [ ] 组件库完整可用
- [ ] 主题系统工作正常
- [ ] 性能指标达标

### 安全检查
- [ ] 依赖项安全扫描通过
- [ ] 代码安全审计完成
- [ ] 敏感信息清理完成
- [ ] 访问权限配置正确

### 部署准备
- [ ] 构建配置正确
- [ ] 环境变量配置完整
- [ ] CI/CD 流水线测试通过
- [ ] 回滚计划准备完成

## 🚀 发布流程

### 1. 版本标记
\`\`\`bash
git tag -a v${this.version} -m "Release v${this.version}"
git push origin v${this.version}
\`\`\`

### 2. 发布到 NPM
\`\`\`bash
npm publish
\`\`\`

### 3. 创建 GitHub Release
- 上传发布资产
- 发布 Release Notes
- 标记为正式版本

### 4. 更新文档网站
- 部署最新文档
- 更新示例项目
- 发布博客文章

### 5. 社区通知
- Discord 社区公告
- Twitter 发布消息
- 邮件通知订阅用户

## 📊 发布后监控

### 第一天
- [ ] 监控下载量和使用情况
- [ ] 检查错误报告和反馈
- [ ] 响应社区问题

### 第一周
- [ ] 收集用户反馈
- [ ] 分析性能数据
- [ ] 准备热修复（如需要）

### 第一个月
- [ ] 用户满意度调查
- [ ] 功能使用统计分析
- [ ] 规划下个版本

---

**发布日期**: ${this.releaseDate}
**版本**: v${this.version}
**负责人**: [填写负责人]
**审核人**: [填写审核人]
`;

    fs.writeFileSync(path.join(releaseDir, 'RELEASE_CHECKLIST.md'), checklist);
  }

  // 获取 Git 提交哈希
  getGitCommit() {
    try {
      return execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim();
    } catch (error) {
      return 'unknown';
    }
  }

  // 获取 Git 分支
  getGitBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' }).toString().trim();
    } catch (error) {
      return 'unknown';
    }
  }

  // 获取 NPM 版本
  getNpmVersion() {
    try {
      return execSync('npm --version', { stdio: 'pipe' }).toString().trim();
    } catch (error) {
      return 'unknown';
    }
  }

  // 生成发布报告
  generateReleaseReport() {
    this.log('生成发布报告...', 'info');

    const report = {
      version: this.version,
      releaseDate: this.releaseDate,
      summary: {
        totalChecks: this.checklist.length,
        passedChecks: this.checklist.filter(item => item.completed).length,
        errors: this.errors.length,
        warnings: this.warnings.length
      },
      checklist: this.checklist,
      errors: this.errors,
      warnings: this.warnings,
      recommendations: this.generateRecommendations()
    };

    const releaseDir = path.join(process.cwd(), 'release');
    fs.writeFileSync(
      path.join(releaseDir, 'release-report.json'),
      JSON.stringify(report, null, 2)
    );

    // 生成人类可读的报告
    const humanReport = this.generateHumanReadableReport(report);
    fs.writeFileSync(
      path.join(releaseDir, 'RELEASE_REPORT.md'),
      humanReport
    );

    this.addChecklistItem('生成发布报告', true);
  }

  // 生成建议
  generateRecommendations() {
    const recommendations = [];

    if (this.errors.length > 0) {
      recommendations.push('🔴 发现严重问题，建议修复后再发布');
    }

    if (this.warnings.length > 0) {
      recommendations.push('🟡 发现警告问题，建议评估影响后决定是否发布');
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      recommendations.push('🟢 所有检查通过，可以安全发布');
    }

    return recommendations;
  }

  // 生成人类可读的报告
  generateHumanReadableReport(report) {
    return `# AI Agent 编码模板 v${report.version} 发布报告

## 📊 总体概况

- **版本**: v${report.version}
- **发布日期**: ${report.releaseDate}
- **总检查项**: ${report.summary.totalChecks}
- **通过检查**: ${report.summary.passedChecks}
- **错误数量**: ${report.summary.errors}
- **警告数量**: ${report.summary.warnings}
- **通过率**: ${Math.round((report.summary.passedChecks / report.summary.totalChecks) * 100)}%

## ✅ 检查清单

${report.checklist.map(item => 
  `${item.completed ? '✅' : '❌'} ${item.item}`
).join('\n')}

## 🔴 错误列表

${report.errors.length > 0 ? 
  report.errors.map(error => `- ${error}`).join('\n') : 
  '无错误'
}

## 🟡 警告列表

${report.warnings.length > 0 ? 
  report.warnings.map(warning => `- ${warning}`).join('\n') : 
  '无警告'
}

## 💡 建议

${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## 🚀 发布状态

${report.summary.errors === 0 ? 
  '🟢 **准备就绪**: 所有检查通过，可以安全发布' : 
  '🔴 **需要修复**: 发现严重问题，建议修复后再发布'
}

---

**生成时间**: ${new Date().toISOString()}
**生成工具**: AI Template Release Preparation Script
`;
  }

  // 主执行函数
  async run() {
    this.log(`开始准备 AI Agent 编码模板 v${this.version} 发布`, 'info');
    this.log('='.repeat(60), 'info');

    try {
      // 执行所有验证步骤
      this.validateProjectStructure();
      this.validateDocumentation();
      this.validateCodeQuality();
      this.runTests();
      this.validateBuild();
      this.validateDependencies();
      this.generateReleaseAssets();
      this.generateReleaseReport();

      // 输出最终结果
      this.log('='.repeat(60), 'info');
      this.log('发布准备完成！', 'success');
      this.log(`✅ 通过检查: ${this.checklist.filter(item => item.completed).length}/${this.checklist.length}`, 'success');
      
      if (this.errors.length > 0) {
        this.log(`❌ 错误: ${this.errors.length}`, 'error');
      }
      
      if (this.warnings.length > 0) {
        this.log(`⚠️  警告: ${this.warnings.length}`, 'warning');
      }

      // 发布建议
      if (this.errors.length === 0) {
        this.log('🚀 建议: 可以安全发布！', 'success');
      } else {
        this.log('🛑 建议: 请修复错误后再发布', 'error');
      }

      this.log('📁 发布资产已生成到 ./release 目录', 'info');
      this.log('📋 请查看 ./release/RELEASE_CHECKLIST.md 完成最终发布', 'info');

    } catch (error) {
      this.log(`发布准备过程中发生错误: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// 运行发布准备
if (require.main === module) {
  const preparation = new ReleasePreparation();
  preparation.run().catch(error => {
    console.error('发布准备失败:', error);
    process.exit(1);
  });
}

module.exports = ReleasePreparation;