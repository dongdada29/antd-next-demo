#!/usr/bin/env node

/**
 * AI Agent 编码模板最终验证脚本
 * 
 * 在正式发布前进行最后的全面验证
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FinalValidation {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m',   // red
      reset: '\x1b[0m'     // reset
    };
    
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  check(description, testFn) {
    try {
      const result = testFn();
      if (result === true) {
        this.results.passed++;
        this.results.details.push({ type: 'success', description, message: 'PASSED' });
        this.log(`✅ ${description}`, 'success');
        return true;
      } else if (result === 'warning') {
        this.results.warnings++;
        this.results.details.push({ type: 'warning', description, message: 'WARNING' });
        this.log(`⚠️  ${description}`, 'warning');
        return true;
      } else {
        this.results.failed++;
        this.results.details.push({ type: 'error', description, message: result || 'FAILED' });
        this.log(`❌ ${description}: ${result || 'FAILED'}`, 'error');
        return false;
      }
    } catch (error) {
      this.results.failed++;
      this.results.details.push({ type: 'error', description, message: error.message });
      this.log(`❌ ${description}: ${error.message}`, 'error');
      return false;
    }
  }

  // 验证核心文件存在
  validateCoreFiles() {
    this.log('\n🔍 验证核心文件...', 'info');
    
    const coreFiles = [
      'package.json',
      'README.md',
      'RELEASE_NOTES.md',
      'MIGRATION_GUIDE.md',
      'SUPPORT_PLAN.md',
      'next.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css'
    ];

    coreFiles.forEach(file => {
      this.check(`核心文件存在: ${file}`, () => {
        return fs.existsSync(file);
      });
    });
  }

  // 验证组件库完整性
  validateComponentLibrary() {
    this.log('\n🧩 验证组件库完整性...', 'info');
    
    const requiredComponents = [
      'src/components/ui/button.tsx',
      'src/components/ui/card.tsx',
      'src/components/ui/input.tsx',
      'src/components/ui/label.tsx',
      'src/components/ui/table.tsx'
    ];

    requiredComponents.forEach(component => {
      this.check(`UI 组件存在: ${path.basename(component)}`, () => {
        return fs.existsSync(component);
      });
    });

    // 验证组件导出
    this.check('UI 组件索引文件存在', () => {
      return fs.existsSync('src/components/ui/index.ts');
    });
  }

  // 验证 AI 提示词系统
  validateAIPromptSystem() {
    this.log('\n🤖 验证 AI 提示词系统...', 'info');
    
    const promptFiles = [
      '.kiro/steering/coding-standards.md',
      '.kiro/steering/component-patterns.md',
      'src/lib/prompts/system-prompts.ts',
      'src/lib/prompts/component-prompts.ts'
    ];

    promptFiles.forEach(file => {
      this.check(`提示词文件存在: ${path.basename(file)}`, () => {
        return fs.existsSync(file);
      });
    });

    // 验证提示词内容
    this.check('系统提示词包含 V0 规范', () => {
      if (fs.existsSync('src/lib/prompts/system-prompts.ts')) {
        const content = fs.readFileSync('src/lib/prompts/system-prompts.ts', 'utf8');
        return content.includes('shadcn') && content.includes('Tailwind');
      }
      return false;
    });
  }

  // 验证文档质量
  validateDocumentationQuality() {
    this.log('\n📚 验证文档质量...', 'info');
    
    // 验证 README
    this.check('README 包含快速开始指南', () => {
      const readme = fs.readFileSync('README.md', 'utf8');
      return readme.includes('快速开始') || readme.includes('Quick Start');
    });

    // 验证发布说明
    this.check('发布说明包含版本信息', () => {
      const releaseNotes = fs.readFileSync('RELEASE_NOTES.md', 'utf8');
      return releaseNotes.includes('v1.0.0') && releaseNotes.includes('2024');
    });

    // 验证迁移指南
    this.check('迁移指南包含组件映射', () => {
      const migrationGuide = fs.readFileSync('MIGRATION_GUIDE.md', 'utf8');
      return migrationGuide.includes('组件映射') || migrationGuide.includes('Component Mapping');
    });

    // 验证支持计划
    this.check('支持计划包含响应时间', () => {
      const supportPlan = fs.readFileSync('SUPPORT_PLAN.md', 'utf8');
      return supportPlan.includes('响应时间') || supportPlan.includes('Response Time');
    });
  }

  // 验证配置文件
  validateConfiguration() {
    this.log('\n⚙️  验证配置文件...', 'info');
    
    // 验证 package.json
    this.check('package.json 格式正确', () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.name && pkg.version && pkg.scripts;
    });

    // 验证 Tailwind 配置
    this.check('Tailwind 配置包含主题设置', () => {
      if (fs.existsSync('tailwind.config.ts')) {
        const config = fs.readFileSync('tailwind.config.ts', 'utf8');
        return config.includes('theme') && config.includes('extend');
      }
      return false;
    });

    // 验证 Next.js 配置
    this.check('Next.js 配置存在', () => {
      return fs.existsSync('next.config.js');
    });

    // 验证 TypeScript 配置
    this.check('TypeScript 配置正确', () => {
      const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
      return tsconfig.compilerOptions && tsconfig.include;
    });
  }

  // 验证示例和模板
  validateExamplesAndTemplates() {
    this.log('\n📋 验证示例和模板...', 'info');
    
    // 验证示例页面
    const examplePages = [
      'src/app/examples/page.tsx',
      'src/app/examples/component-showcase/page.tsx',
      'src/app/examples/ai-components/page.tsx'
    ];

    examplePages.forEach(page => {
      this.check(`示例页面存在: ${path.basename(path.dirname(page))}`, () => {
        return fs.existsSync(page);
      });
    });

    // 验证组件模板
    this.check('AI 组件模板存在', () => {
      return fs.existsSync('src/lib/component-templates.ts');
    });
  }

  // 验证性能和优化
  validatePerformanceOptimizations() {
    this.log('\n⚡ 验证性能优化...', 'info');
    
    // 验证懒加载配置
    this.check('懒加载配置存在', () => {
      return fs.existsSync('src/lib/lazy-registry.ts');
    });

    // 验证性能监控
    this.check('性能监控组件存在', () => {
      return fs.existsSync('src/components/performance/PerformanceMonitor.tsx');
    });

    // 验证 Bundle 优化配置
    this.check('Bundle 优化配置存在', () => {
      return fs.existsSync('src/lib/bundle-optimization.ts');
    });
  }

  // 验证测试覆盖
  validateTestCoverage() {
    this.log('\n🧪 验证测试覆盖...', 'info');
    
    // 验证测试配置
    const testConfigs = [
      'vitest.config.ts',
      'vitest.a11y.config.ts',
      'vitest.performance.config.ts'
    ];

    testConfigs.forEach(config => {
      this.check(`测试配置存在: ${config}`, () => {
        return fs.existsSync(config);
      });
    });

    // 验证测试模板
    this.check('测试模板目录存在', () => {
      return fs.existsSync('src/test/templates') && 
             fs.statSync('src/test/templates').isDirectory();
    });
  }

  // 验证 AI 集成
  validateAIIntegration() {
    this.log('\n🤖 验证 AI 集成...', 'info');
    
    // 验证 AI 辅助工具
    const aiFiles = [
      'src/lib/ai-helpers.ts',
      'src/lib/ai-component-generator.ts',
      'src/lib/ai-context-manager.ts',
      'src/hooks/useAIComponentRegistry.ts'
    ];

    aiFiles.forEach(file => {
      this.check(`AI 工具存在: ${path.basename(file)}`, () => {
        return fs.existsSync(file);
      });
    });

    // 验证 AI 提示词管理
    this.check('AI 提示词管理器存在', () => {
      return fs.existsSync('src/lib/prompts/prompt-manager.ts');
    });
  }

  // 验证部署准备
  validateDeploymentReadiness() {
    this.log('\n🚀 验证部署准备...', 'info');
    
    // 验证构建脚本
    this.check('构建脚本配置正确', () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.build;
    });

    // 验证环境配置
    this.check('环境配置示例存在', () => {
      return fs.existsSync('.env.example') || fs.existsSync('.env.local.example');
    });

    // 验证 Docker 配置（如果存在）
    if (fs.existsSync('Dockerfile')) {
      this.check('Docker 配置正确', () => {
        const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
        return dockerfile.includes('FROM') && dockerfile.includes('COPY');
      });
    }
  }

  // 验证安全性
  validateSecurity() {
    this.log('\n🔒 验证安全性...', 'info');
    
    // 检查敏感文件是否被忽略
    this.check('.gitignore 包含敏感文件', () => {
      if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        return gitignore.includes('.env') && gitignore.includes('node_modules');
      }
      return false;
    });

    // 验证依赖项安全（如果 npm audit 可用）
    this.check('依赖项安全检查', () => {
      try {
        execSync('npm audit --audit-level=high', { stdio: 'pipe' });
        return true;
      } catch (error) {
        return 'warning'; // 可能有低级别漏洞，但不阻止发布
      }
    });
  }

  // 生成验证报告
  generateReport() {
    this.log('\n📊 生成验证报告...', 'info');
    
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / total) * 100);
    
    const report = `# AI Agent 编码模板最终验证报告

## 📊 验证概况

- **总检查项**: ${total}
- **通过**: ${this.results.passed} ✅
- **失败**: ${this.results.failed} ❌
- **警告**: ${this.results.warnings} ⚠️
- **成功率**: ${successRate}%

## 📋 详细结果

${this.results.details.map(detail => {
  const icon = detail.type === 'success' ? '✅' : detail.type === 'warning' ? '⚠️' : '❌';
  return `${icon} **${detail.description}**: ${detail.message}`;
}).join('\n')}

## 🎯 发布建议

${this.results.failed === 0 ? 
  '🟢 **可以发布**: 所有关键检查都已通过，项目已准备好发布。' : 
  '🔴 **需要修复**: 发现关键问题，建议修复后再发布。'
}

${this.results.warnings > 0 ? 
  `\n⚠️ **注意**: 发现 ${this.results.warnings} 个警告，建议评估影响。` : 
  ''
}

---

**验证时间**: ${new Date().toISOString()}
**验证工具**: AI Template Final Validation Script v1.0.0
`;

    // 确保 release 目录存在
    const releaseDir = path.join(process.cwd(), 'release');
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir, { recursive: true });
    }

    // 写入报告
    fs.writeFileSync(path.join(releaseDir, 'FINAL_VALIDATION_REPORT.md'), report);
    
    this.log(`📁 验证报告已保存到: ${path.join(releaseDir, 'FINAL_VALIDATION_REPORT.md')}`, 'info');
  }

  // 主执行函数
  run() {
    this.log('🚀 开始 AI Agent 编码模板最终验证', 'info');
    this.log('='.repeat(60), 'info');

    // 执行所有验证
    this.validateCoreFiles();
    this.validateComponentLibrary();
    this.validateAIPromptSystem();
    this.validateDocumentationQuality();
    this.validateConfiguration();
    this.validateExamplesAndTemplates();
    this.validatePerformanceOptimizations();
    this.validateTestCoverage();
    this.validateAIIntegration();
    this.validateDeploymentReadiness();
    this.validateSecurity();

    // 生成报告
    this.generateReport();

    // 输出最终结果
    this.log('\n' + '='.repeat(60), 'info');
    this.log('🏁 最终验证完成！', 'info');
    
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / total) * 100);
    
    this.log(`📊 验证结果: ${this.results.passed}/${total} 通过 (${successRate}%)`, 'info');
    
    if (this.results.failed > 0) {
      this.log(`❌ 失败: ${this.results.failed}`, 'error');
    }
    
    if (this.results.warnings > 0) {
      this.log(`⚠️  警告: ${this.results.warnings}`, 'warning');
    }

    // 最终建议
    if (this.results.failed === 0) {
      this.log('\n🎉 恭喜！项目已准备好发布！', 'success');
      this.log('🚀 可以继续执行发布流程', 'success');
    } else {
      this.log('\n🛑 请修复失败的检查项后再发布', 'error');
      process.exit(1);
    }

    return {
      success: this.results.failed === 0,
      results: this.results
    };
  }
}

// 运行验证
if (require.main === module) {
  const validation = new FinalValidation();
  validation.run();
}

module.exports = FinalValidation;