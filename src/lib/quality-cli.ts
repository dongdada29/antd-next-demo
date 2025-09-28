#!/usr/bin/env node

/**
 * 代码质量管理 CLI 工具
 * 提供命令行接口进行代码质量检查和改进
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { CodeQualityChecker, QualityCheckOptions } from './code-quality-checker';
import { QualityImprovementSystem } from './quality-improvement-system';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const program = new Command();

program
  .name('quality-cli')
  .description('AI Agent 代码质量管理工具')
  .version('1.0.0');

/**
 * 检查代码质量命令
 */
program
  .command('check')
  .description('执行代码质量检查')
  .option('-f, --files <patterns...>', '指定要检查的文件模式')
  .option('--no-tests', '排除测试文件')
  .option('--fix', '自动修复可修复的问题')
  .option('-r, --report', '生成详细报告')
  .option('-o, --output <path>', '报告输出路径')
  .action(async (options) => {
    const spinner = ora('正在执行代码质量检查...').start();
    
    try {
      const checker = new CodeQualityChecker();
      
      const checkOptions: QualityCheckOptions = {
        files: options.files,
        includeTests: options.tests,
        fixable: options.fix,
        generateReport: options.report,
        outputPath: options.output,
      };
      
      const report = await checker.checkQuality(checkOptions);
      
      spinner.stop();
      
      // 显示结果
      displayQualityResults(report);
      
      // 如果启用自动修复
      if (options.fix) {
        const fixSpinner = ora('正在自动修复问题...').start();
        await checker.autoFix(checkOptions);
        fixSpinner.succeed('自动修复完成');
      }
      
    } catch (error) {
      spinner.fail('代码质量检查失败');
      console.error(chalk.red('错误:'), error);
      process.exit(1);
    }
  });

/**
 * 生成改进计划命令
 */
program
  .command('improve')
  .description('生成代码质量改进计划')
  .option('-i, --input <path>', '质量报告文件路径')
  .option('-o, --output <path>', '改进计划输出路径')
  .action(async (options) => {
    const spinner = ora('正在生成改进计划...').start();
    
    try {
      let report;
      
      if (options.input && existsSync(options.input)) {
        // 从文件加载报告
        const reportData = readFileSync(options.input, 'utf-8');
        report = JSON.parse(reportData);
      } else {
        // 执行新的质量检查
        const checker = new CodeQualityChecker();
        report = await checker.checkQuality({ generateReport: false });
      }
      
      const improvementSystem = new QualityImprovementSystem();
      const plan = improvementSystem.generateImprovementPlan(report);
      
      spinner.stop();
      
      // 显示改进计划
      displayImprovementPlan(plan);
      
      // 保存计划
      if (options.output || !options.input) {
        improvementSystem.saveImprovementPlan(plan, options.output);
      }
      
    } catch (error) {
      spinner.fail('生成改进计划失败');
      console.error(chalk.red('错误:'), error);
      process.exit(1);
    }
  });

/**
 * 快速修复命令
 */
program
  .command('fix')
  .description('自动修复可修复的代码质量问题')
  .option('-f, --files <patterns...>', '指定要修复的文件模式')
  .option('--dry-run', '预览修复内容，不实际修改文件')
  .action(async (options) => {
    const spinner = ora('正在自动修复代码质量问题...').start();
    
    try {
      const checker = new CodeQualityChecker();
      
      if (options.dryRun) {
        // 预览模式
        const report = await checker.checkQuality({
          files: options.files,
          fixable: false,
        });
        
        spinner.stop();
        
        const fixableIssues = report.issues.filter(issue => issue.fixable);
        console.log(chalk.blue('\n📋 可自动修复的问题:'));
        fixableIssues.forEach(issue => {
          console.log(`  ${chalk.yellow('•')} ${issue.file}:${issue.line} - ${issue.message}`);
        });
        console.log(chalk.green(`\n总计: ${fixableIssues.length} 个可修复问题`));
      } else {
        // 实际修复
        await checker.autoFix({
          files: options.files,
        });
        
        spinner.succeed('自动修复完成');
      }
      
    } catch (error) {
      spinner.fail('自动修复失败');
      console.error(chalk.red('错误:'), error);
      process.exit(1);
    }
  });

/**
 * 监控命令
 */
program
  .command('watch')
  .description('监控代码质量变化')
  .option('-i, --interval <seconds>', '检查间隔（秒）', '300')
  .option('--threshold <score>', '质量分数阈值', '80')
  .action(async (options) => {
    const interval = parseInt(options.interval) * 1000;
    const threshold = parseInt(options.threshold);
    
    console.log(chalk.blue('🔍 开始监控代码质量...'));
    console.log(chalk.gray(`检查间隔: ${options.interval}秒`));
    console.log(chalk.gray(`质量阈值: ${threshold}分`));
    
    const checker = new CodeQualityChecker();
    let previousScore = 0;
    
    const checkQuality = async () => {
      try {
        const report = await checker.checkQuality({ generateReport: false });
        const currentScore = report.metrics.overallScore;
        
        // 显示当前状态
        const scoreColor = currentScore >= threshold ? chalk.green : chalk.red;
        const trend = currentScore > previousScore ? '📈' : 
                     currentScore < previousScore ? '📉' : '➡️';
        
        console.log(`${new Date().toLocaleTimeString()} ${trend} 质量分数: ${scoreColor(currentScore)}/100`);
        
        // 如果分数低于阈值，显示警告
        if (currentScore < threshold) {
          console.log(chalk.red(`⚠️  质量分数低于阈值 ${threshold}，建议立即改进`));
        }
        
        // 如果分数显著下降，显示警告
        if (previousScore > 0 && currentScore < previousScore - 5) {
          console.log(chalk.yellow(`⚠️  质量分数下降了 ${previousScore - currentScore} 分`));
        }
        
        previousScore = currentScore;
        
      } catch (error) {
        console.error(chalk.red('质量检查失败:'), error);
      }
    };
    
    // 立即执行一次检查
    await checkQuality();
    
    // 设置定时检查
    setInterval(checkQuality, interval);
  });

/**
 * 配置命令
 */
program
  .command('config')
  .description('配置代码质量标准')
  .option('--init', '初始化配置文件')
  .option('--show', '显示当前配置')
  .action(async (options) => {
    if (options.init) {
      await initializeConfig();
    } else if (options.show) {
      showCurrentConfig();
    } else {
      console.log(chalk.yellow('请指定操作: --init 或 --show'));
    }
  });

/**
 * 显示质量检查结果
 */
function displayQualityResults(report: any): void {
  const { metrics, issues } = report;
  
  console.log('\n' + chalk.bold.blue('📊 代码质量报告'));
  console.log('='.repeat(50));
  
  // 整体评分
  const scoreColor = metrics.overallScore >= 80 ? chalk.green : 
                    metrics.overallScore >= 60 ? chalk.yellow : chalk.red;
  console.log(`${chalk.bold('整体评分:')} ${scoreColor(metrics.overallScore)}/100`);
  
  // 各项指标
  console.log('\n' + chalk.bold('📋 详细指标:'));
  const categories = [
    { name: 'ESLint', key: 'linting', icon: '🔍' },
    { name: '格式化', key: 'formatting', icon: '✨' },
    { name: 'TypeScript', key: 'typeScript', icon: '🔷' },
    { name: '复杂度', key: 'complexity', icon: '🧩' },
    { name: '测试覆盖率', key: 'testCoverage', icon: '🧪' },
    { name: '可访问性', key: 'accessibility', icon: '♿' },
    { name: '性能', key: 'performance', icon: '⚡' },
    { name: '安全性', key: 'security', icon: '🔒' },
    { name: '文档', key: 'documentation', icon: '📚' },
  ];
  
  categories.forEach(category => {
    const score = metrics[category.key].score;
    const color = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;
    console.log(`  ${category.icon} ${category.name.padEnd(12)} ${color(score.toString().padStart(3))}/100`);
  });
  
  // 问题统计
  if (issues.length > 0) {
    console.log('\n' + chalk.bold('⚠️  发现的问题:'));
    const errorCount = issues.filter((i: any) => i.severity === 'error').length;
    const warningCount = issues.filter((i: any) => i.severity === 'warning').length;
    
    if (errorCount > 0) {
      console.log(`  ${chalk.red('错误:')} ${errorCount} 个`);
    }
    if (warningCount > 0) {
      console.log(`  ${chalk.yellow('警告:')} ${warningCount} 个`);
    }
    
    // 显示前5个问题
    console.log('\n' + chalk.bold('🔍 主要问题:'));
    issues.slice(0, 5).forEach((issue: any, index: number) => {
      const severityColor = issue.severity === 'error' ? chalk.red : chalk.yellow;
      console.log(`  ${index + 1}. ${severityColor(issue.severity.toUpperCase())} ${issue.message}`);
      console.log(`     ${chalk.gray(issue.file)}:${issue.line}:${issue.column}`);
    });
    
    if (issues.length > 5) {
      console.log(`  ${chalk.gray(`... 还有 ${issues.length - 5} 个问题`)}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
}

/**
 * 显示改进计划
 */
function displayImprovementPlan(plan: any): void {
  console.log('\n' + chalk.bold.blue('📋 代码质量改进计划'));
  console.log('='.repeat(50));
  
  console.log(`${chalk.bold('当前评分:')} ${plan.currentScore}/100`);
  console.log(`${chalk.bold('目标评分:')} ${plan.targetScore}/100`);
  console.log(`${chalk.bold('预计时间:')} ${plan.estimatedTimeframe}`);
  console.log(`${chalk.bold('总体目标:')} ${plan.overallGoal}`);
  
  // 快速改进
  if (plan.quickWins.length > 0) {
    console.log('\n' + chalk.bold.green('⚡ 快速改进 (低成本高收益):'));
    plan.quickWins.forEach((suggestion: any, index: number) => {
      console.log(`  ${index + 1}. ${suggestion.title}`);
      console.log(`     ${chalk.gray(suggestion.description)}`);
      console.log(`     ${chalk.blue('影响:')} ${suggestion.impact} | ${chalk.blue('工作量:')} ${suggestion.effort}`);
    });
  }
  
  // 阶段性计划
  if (plan.phases.length > 0) {
    console.log('\n' + chalk.bold.blue('📅 阶段性计划:'));
    plan.phases.forEach((phase: any, index: number) => {
      console.log(`\n  ${chalk.bold(`阶段 ${index + 1}: ${phase.name}`)}`);
      console.log(`  ${chalk.gray(`持续时间: ${phase.duration}`)}`);
      console.log(`  ${chalk.gray(`预期提升: ${phase.expectedImprovement} 分`)}`);
      
      phase.suggestions.forEach((suggestion: any, suggestionIndex: number) => {
        console.log(`    ${suggestionIndex + 1}. ${suggestion.title}`);
      });
    });
  }
  
  // 长期目标
  if (plan.longTermGoals.length > 0) {
    console.log('\n' + chalk.bold.yellow('🎯 长期目标:'));
    plan.longTermGoals.forEach((goal: any, index: number) => {
      console.log(`  ${index + 1}. ${goal.title}`);
      console.log(`     ${chalk.gray(goal.description)}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
}

/**
 * 初始化配置文件
 */
async function initializeConfig(): Promise<void> {
  const spinner = ora('正在初始化配置文件...').start();
  
  try {
    const configPath = join(process.cwd(), '.quality-config.json');
    
    const defaultConfig = {
      thresholds: {
        overall: 80,
        linting: 90,
        formatting: 95,
        typeScript: 85,
        complexity: 70,
        testCoverage: 80,
        accessibility: 90,
        performance: 75,
        security: 95,
        documentation: 70,
      },
      rules: {
        autoFix: true,
        generateReports: true,
        watchMode: false,
      },
      notifications: {
        enabled: false,
        webhook: '',
        email: '',
      },
    };
    
    require('fs').writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    
    spinner.succeed(`配置文件已创建: ${configPath}`);
    console.log(chalk.green('✅ 可以编辑配置文件来自定义质量标准'));
    
  } catch (error) {
    spinner.fail('初始化配置文件失败');
    console.error(chalk.red('错误:'), error);
  }
}

/**
 * 显示当前配置
 */
function showCurrentConfig(): void {
  const configPath = join(process.cwd(), '.quality-config.json');
  
  if (!existsSync(configPath)) {
    console.log(chalk.yellow('⚠️  配置文件不存在，请先运行 --init 创建配置'));
    return;
  }
  
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    
    console.log('\n' + chalk.bold.blue('⚙️  当前配置'));
    console.log('='.repeat(30));
    console.log(JSON.stringify(config, null, 2));
    
  } catch (error) {
    console.error(chalk.red('读取配置文件失败:'), error);
  }
}

// 错误处理
process.on('uncaughtException', (error) => {
  console.error(chalk.red('未捕获的异常:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('未处理的 Promise 拒绝:'), reason);
  process.exit(1);
});

// 解析命令行参数
program.parse();

export default program;