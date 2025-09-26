#!/usr/bin/env node

/**
 * AI 模型性能监控工具
 * 监控和分析不同 AI 模型的表现
 */

const fs = require('fs');
const path = require('path');

class AIPerformanceMonitor {
  constructor() {
    this.metricsFile = '.kiro/metrics/ai-performance.json';
    this.ensureMetricsDirectory();
  }

  ensureMetricsDirectory() {
    const dir = path.dirname(this.metricsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  loadMetrics() {
    if (fs.existsSync(this.metricsFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
      } catch (error) {
        console.warn('⚠️  Failed to load metrics, starting fresh');
      }
    }
    return {
      sessions: [],
      summary: {
        claude: { totalTasks: 0, successRate: 0, avgQuality: 0 },
        codex: { totalTasks: 0, successRate: 0, avgQuality: 0 }
      }
    };
  }

  saveMetrics(metrics) {
    fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
  }

  recordSession(model, task, metrics) {
    const data = this.loadMetrics();
    
    const session = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      model: model.toLowerCase(),
      task,
      metrics: {
        codeQuality: metrics.codeQuality || 0,
        completeness: metrics.completeness || 0,
        performance: metrics.performance || 0,
        maintainability: metrics.maintainability || 0,
        timeToComplete: metrics.timeToComplete || 0,
        linesOfCode: metrics.linesOfCode || 0,
        testCoverage: metrics.testCoverage || 0
      },
      success: metrics.success || false,
      notes: metrics.notes || ''
    };

    data.sessions.push(session);
    this.updateSummary(data);
    this.saveMetrics(data);

    console.log(`✅ Recorded session for ${model} - Task: ${task}`);
    return session.id;
  }

  updateSummary(data) {
    const claudeSessions = data.sessions.filter(s => s.model === 'claude');
    const codexSessions = data.sessions.filter(s => s.model === 'codex');

    data.summary.claude = this.calculateModelSummary(claudeSessions);
    data.summary.codex = this.calculateModelSummary(codexSessions);
  }

  calculateModelSummary(sessions) {
    if (sessions.length === 0) {
      return { totalTasks: 0, successRate: 0, avgQuality: 0 };
    }

    const successfulSessions = sessions.filter(s => s.success);
    const successRate = (successfulSessions.length / sessions.length) * 100;
    
    const avgQuality = sessions.reduce((sum, s) => {
      const quality = (
        s.metrics.codeQuality + 
        s.metrics.completeness + 
        s.metrics.maintainability
      ) / 3;
      return sum + quality;
    }, 0) / sessions.length;

    return {
      totalTasks: sessions.length,
      successRate: Math.round(successRate * 100) / 100,
      avgQuality: Math.round(avgQuality * 100) / 100,
      avgTimeToComplete: this.calculateAverage(sessions, 'timeToComplete'),
      avgLinesOfCode: this.calculateAverage(sessions, 'linesOfCode'),
      avgTestCoverage: this.calculateAverage(sessions, 'testCoverage')
    };
  }

  calculateAverage(sessions, metric) {
    const sum = sessions.reduce((acc, s) => acc + (s.metrics[metric] || 0), 0);
    return Math.round((sum / sessions.length) * 100) / 100;
  }

  generateReport() {
    const data = this.loadMetrics();
    
    console.log('\n📊 AI 模型性能报告');
    console.log('='.repeat(50));
    
    this.printModelReport('Claude', data.summary.claude);
    this.printModelReport('Codex', data.summary.codex);
    
    this.printTaskAnalysis(data.sessions);
    this.printRecommendations(data);
  }

  printModelReport(modelName, summary) {
    console.log(`\n🤖 ${modelName} 性能统计:`);
    console.log(`   总任务数: ${summary.totalTasks}`);
    console.log(`   成功率: ${summary.successRate}%`);
    console.log(`   平均质量分: ${summary.avgQuality}/100`);
    
    if (summary.avgTimeToComplete) {
      console.log(`   平均完成时间: ${summary.avgTimeToComplete}分钟`);
    }
    if (summary.avgLinesOfCode) {
      console.log(`   平均代码行数: ${summary.avgLinesOfCode}`);
    }
    if (summary.avgTestCoverage) {
      console.log(`   平均测试覆盖率: ${summary.avgTestCoverage}%`);
    }
  }

  printTaskAnalysis(sessions) {
    console.log('\n📋 任务类型分析:');
    
    const taskTypes = [...new Set(sessions.map(s => s.task))];
    
    taskTypes.forEach(taskType => {
      const taskSessions = sessions.filter(s => s.task === taskType);
      const claudeTaskSessions = taskSessions.filter(s => s.model === 'claude');
      const codexTaskSessions = taskSessions.filter(s => s.model === 'codex');
      
      console.log(`\n   ${taskType}:`);
      
      if (claudeTaskSessions.length > 0) {
        const claudeAvgQuality = this.calculateTaskQuality(claudeTaskSessions);
        console.log(`     Claude: ${claudeTaskSessions.length} 次, 质量 ${claudeAvgQuality}/100`);
      }
      
      if (codexTaskSessions.length > 0) {
        const codexAvgQuality = this.calculateTaskQuality(codexTaskSessions);
        console.log(`     Codex: ${codexTaskSessions.length} 次, 质量 ${codexAvgQuality}/100`);
      }
    });
  }

  calculateTaskQuality(sessions) {
    const avgQuality = sessions.reduce((sum, s) => {
      const quality = (
        s.metrics.codeQuality + 
        s.metrics.completeness + 
        s.metrics.maintainability
      ) / 3;
      return sum + quality;
    }, 0) / sessions.length;
    
    return Math.round(avgQuality * 100) / 100;
  }

  printRecommendations(data) {
    console.log('\n💡 优化建议:');
    
    const claudeSummary = data.summary.claude;
    const codexSummary = data.summary.codex;
    
    // 基于性能数据给出建议
    if (claudeSummary.totalTasks > 0 && codexSummary.totalTasks > 0) {
      if (claudeSummary.avgQuality > codexSummary.avgQuality + 10) {
        console.log('   🎯 Claude 在代码质量方面表现更好，推荐用于复杂任务');
      }
      
      if (codexSummary.avgTimeToComplete < claudeSummary.avgTimeToComplete) {
        console.log('   ⚡ Codex 在速度方面表现更好，推荐用于快速原型');
      }
      
      if (claudeSummary.avgTestCoverage > codexSummary.avgTestCoverage + 15) {
        console.log('   🧪 Claude 在测试生成方面表现更好');
      }
    }
    
    // 通用建议
    console.log('   📚 查看 .kiro/prompts/ 目录获取优化的提示词');
    console.log('   ⚙️  使用 pnpm ai:optimize --task <type> 获取任务特定建议');
  }

  exportReport(format = 'json') {
    const data = this.loadMetrics();
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const filename = `.kiro/reports/ai-performance-${timestamp}.json`;
      this.ensureReportsDirectory();
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
      console.log(`📄 报告已导出到: ${filename}`);
    } else if (format === 'csv') {
      const filename = `.kiro/reports/ai-performance-${timestamp}.csv`;
      this.ensureReportsDirectory();
      this.exportToCSV(data.sessions, filename);
      console.log(`📄 报告已导出到: ${filename}`);
    }
  }

  ensureReportsDirectory() {
    const dir = '.kiro/reports';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  exportToCSV(sessions, filename) {
    const headers = [
      'timestamp', 'model', 'task', 'codeQuality', 'completeness', 
      'performance', 'maintainability', 'timeToComplete', 'linesOfCode', 
      'testCoverage', 'success'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sessions.map(session => [
        session.timestamp,
        session.model,
        session.task,
        session.metrics.codeQuality,
        session.metrics.completeness,
        session.metrics.performance,
        session.metrics.maintainability,
        session.metrics.timeToComplete,
        session.metrics.linesOfCode,
        session.metrics.testCoverage,
        session.success
      ].join(','))
    ].join('\n');
    
    fs.writeFileSync(filename, csvContent);
  }
}

// CLI 接口
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const monitor = new AIPerformanceMonitor();
  
  switch (command) {
    case 'record':
      const model = args[1];
      const task = args[2];
      if (!model || !task) {
        console.error('❌ Usage: record <model> <task>');
        process.exit(1);
      }
      
      // 示例记录 - 实际使用时需要从用户输入获取指标
      const metrics = {
        codeQuality: 85,
        completeness: 90,
        performance: 80,
        maintainability: 88,
        timeToComplete: 15,
        linesOfCode: 120,
        testCoverage: 75,
        success: true,
        notes: 'Generated via CLI'
      };
      
      monitor.recordSession(model, task, metrics);
      break;
      
    case 'report':
      monitor.generateReport();
      break;
      
    case 'export':
      const format = args[1] || 'json';
      monitor.exportReport(format);
      break;
      
    default:
      console.log('AI Performance Monitor');
      console.log('');
      console.log('Commands:');
      console.log('  record <model> <task>  Record a new session');
      console.log('  report                 Generate performance report');
      console.log('  export [format]        Export report (json|csv)');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = AIPerformanceMonitor;