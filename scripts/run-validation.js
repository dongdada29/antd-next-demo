#!/usr/bin/env node

/**
 * Comprehensive Validation Runner
 * Runs all validation tests and generates reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ValidationRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      performance: {},
      accessibility: {},
      codeQuality: {},
      reports: []
    };
  }

  async runAllValidations() {
    console.log('🚀 Starting comprehensive validation...\n');

    try {
      // Run functional tests
      await this.runFunctionalTests();
      
      // Run performance tests
      await this.runPerformanceTests();
      
      // Run accessibility tests
      await this.runAccessibilityTests();
      
      // Run code quality validation
      await this.runCodeQualityValidation();
      
      // Run AI code generation tests
      await this.runAICodeTests();
      
      // Generate final report
      await this.generateFinalReport();
      
      console.log('✅ All validations completed successfully!');
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  }

  async runFunctionalTests() {
    console.log('🧪 Running functional tests...');
    
    try {
      const output = execSync('npm run test:unit -- --run --reporter=json', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const testResults = JSON.parse(output);
      this.results.tests.functional = testResults;
      this.updateSummary(testResults);
      
      console.log(`✅ Functional tests: ${testResults.numPassedTests}/${testResults.numTotalTests} passed`);
      
    } catch (error) {
      console.error('❌ Functional tests failed:', error.message);
      this.results.tests.functional = { error: error.message };
    }
  }

  async runPerformanceTests() {
    console.log('⚡ Running performance tests...');
    
    try {
      const output = execSync('npm run test:performance -- --run --reporter=json', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const testResults = JSON.parse(output);
      this.results.tests.performance = testResults;
      this.updateSummary(testResults);
      
      // Run Lighthouse audit
      await this.runLighthouseAudit();
      
      console.log(`✅ Performance tests: ${testResults.numPassedTests}/${testResults.numTotalTests} passed`);
      
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message);
      this.results.tests.performance = { error: error.message };
    }
  }

  async runAccessibilityTests() {
    console.log('♿ Running accessibility tests...');
    
    try {
      const output = execSync('npm run test:a11y -- --run --reporter=json', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const testResults = JSON.parse(output);
      this.results.tests.accessibility = testResults;
      this.updateSummary(testResults);
      
      // Run axe-core audit
      await this.runAxeAudit();
      
      console.log(`✅ Accessibility tests: ${testResults.numPassedTests}/${testResults.numTotalTests} passed`);
      
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error.message);
      this.results.tests.accessibility = { error: error.message };
    }
  }

  async runCodeQualityValidation() {
    console.log('🔍 Running code quality validation...');
    
    try {
      // Run ESLint
      const eslintOutput = execSync('npx eslint src --format json', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const eslintResults = JSON.parse(eslintOutput);
      this.results.codeQuality.eslint = {
        totalFiles: eslintResults.length,
        totalErrors: eslintResults.reduce((sum, file) => sum + file.errorCount, 0),
        totalWarnings: eslintResults.reduce((sum, file) => sum + file.warningCount, 0)
      };
      
      // Run TypeScript check
      execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      this.results.codeQuality.typescript = { status: 'passed' };
      
      // Run Prettier check
      execSync('npx prettier --check src', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      this.results.codeQuality.prettier = { status: 'passed' };
      
      console.log('✅ Code quality validation passed');
      
    } catch (error) {
      console.error('❌ Code quality validation failed:', error.message);
      this.results.codeQuality.error = error.message;
    }
  }

  async runAICodeTests() {
    console.log('🤖 Running AI code generation tests...');
    
    try {
      const output = execSync('npm run test:ai -- --run --reporter=json', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const testResults = JSON.parse(output);
      this.results.tests.aiCode = testResults;
      this.updateSummary(testResults);
      
      console.log(`✅ AI code tests: ${testResults.numPassedTests}/${testResults.numTotalTests} passed`);
      
    } catch (error) {
      console.error('❌ AI code tests failed:', error.message);
      this.results.tests.aiCode = { error: error.message };
    }
  }

  async runLighthouseAudit() {
    console.log('🏠 Running Lighthouse audit...');
    
    try {
      // Start development server
      const serverProcess = execSync('npm run dev &', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Run Lighthouse
      const lighthouseOutput = execSync('npx lighthouse http://localhost:3000 --output json --quiet', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const lighthouseResults = JSON.parse(lighthouseOutput);
      this.results.performance.lighthouse = {
        performance: lighthouseResults.lhr.categories.performance.score * 100,
        accessibility: lighthouseResults.lhr.categories.accessibility.score * 100,
        bestPractices: lighthouseResults.lhr.categories['best-practices'].score * 100,
        seo: lighthouseResults.lhr.categories.seo.score * 100
      };
      
      // Kill server
      execSync('pkill -f "next dev"', { encoding: 'utf8' });
      
      console.log('✅ Lighthouse audit completed');
      
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
      this.results.performance.lighthouse = { error: error.message };
    }
  }

  async runAxeAudit() {
    console.log('🪓 Running axe-core audit...');
    
    try {
      const output = execSync('npx @axe-core/cli http://localhost:3000 --format json', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const axeResults = JSON.parse(output);
      this.results.accessibility.axe = {
        violations: axeResults.violations.length,
        passes: axeResults.passes.length,
        incomplete: axeResults.incomplete.length,
        inapplicable: axeResults.inapplicable.length
      };
      
      console.log('✅ Axe audit completed');
      
    } catch (error) {
      console.error('❌ Axe audit failed:', error.message);
      this.results.accessibility.axe = { error: error.message };
    }
  }

  updateSummary(testResults) {
    if (testResults.numTotalTests) {
      this.results.summary.total += testResults.numTotalTests;
      this.results.summary.passed += testResults.numPassedTests;
      this.results.summary.failed += testResults.numFailedTests;
      this.results.summary.skipped += testResults.numPendingTests || 0;
    }
  }

  async generateFinalReport() {
    console.log('📊 Generating final report...');
    
    // Calculate overall scores
    const overallScore = this.calculateOverallScore();
    
    // Generate recommendations
    const recommendations = this.generateRecommendations();
    
    // Create final report
    const finalReport = {
      ...this.results,
      overallScore,
      recommendations,
      passRate: this.results.summary.total > 0 ? 
        (this.results.summary.passed / this.results.summary.total) * 100 : 0
    };
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
    
    // Generate HTML report
    await this.generateHTMLReport(finalReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    
    // Print summary
    this.printSummary(finalReport);
  }

  calculateOverallScore() {
    let totalScore = 0;
    let scoreCount = 0;
    
    // Test pass rate (40% weight)
    if (this.results.summary.total > 0) {
      const testScore = (this.results.summary.passed / this.results.summary.total) * 100;
      totalScore += testScore * 0.4;
      scoreCount += 0.4;
    }
    
    // Performance score (30% weight)
    if (this.results.performance.lighthouse?.performance) {
      totalScore += this.results.performance.lighthouse.performance * 0.3;
      scoreCount += 0.3;
    }
    
    // Accessibility score (20% weight)
    if (this.results.performance.lighthouse?.accessibility) {
      totalScore += this.results.performance.lighthouse.accessibility * 0.2;
      scoreCount += 0.2;
    }
    
    // Code quality score (10% weight)
    if (this.results.codeQuality.eslint) {
      const codeQualityScore = Math.max(0, 100 - (this.results.codeQuality.eslint.totalErrors * 10));
      totalScore += codeQualityScore * 0.1;
      scoreCount += 0.1;
    }
    
    return scoreCount > 0 ? totalScore / scoreCount : 0;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Test recommendations
    if (this.results.summary.failed > 0) {
      recommendations.push(`Fix ${this.results.summary.failed} failing tests`);
    }
    
    // Performance recommendations
    if (this.results.performance.lighthouse?.performance < 90) {
      recommendations.push('Improve performance score to 90+');
    }
    
    // Accessibility recommendations
    if (this.results.accessibility.axe?.violations > 0) {
      recommendations.push(`Fix ${this.results.accessibility.axe.violations} accessibility violations`);
    }
    
    // Code quality recommendations
    if (this.results.codeQuality.eslint?.totalErrors > 0) {
      recommendations.push(`Fix ${this.results.codeQuality.eslint.totalErrors} ESLint errors`);
    }
    
    return recommendations;
  }

  async generateHTMLReport(report) {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .score { font-size: 2em; font-weight: bold; color: ${report.overallScore >= 80 ? '#22c55e' : report.overallScore >= 60 ? '#f59e0b' : '#ef4444'}; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .pass { color: #22c55e; }
        .fail { color: #ef4444; }
        .warning { color: #f59e0b; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Validation Report</h1>
        <div class="score">${report.overallScore.toFixed(1)}/100</div>
        <p>Generated: ${report.timestamp}</p>
    </div>
    
    <div class="section">
        <h2>Test Summary</h2>
        <table>
            <tr><th>Category</th><th>Total</th><th>Passed</th><th>Failed</th><th>Pass Rate</th></tr>
            <tr>
                <td>All Tests</td>
                <td>${report.summary.total}</td>
                <td class="pass">${report.summary.passed}</td>
                <td class="fail">${report.summary.failed}</td>
                <td>${report.passRate.toFixed(1)}%</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Performance Metrics</h2>
        <table>
            <tr><th>Metric</th><th>Score</th><th>Status</th></tr>
            <tr>
                <td>Performance</td>
                <td>${report.performance.lighthouse?.performance || 'N/A'}</td>
                <td class="${(report.performance.lighthouse?.performance || 0) >= 90 ? 'pass' : 'fail'}">${(report.performance.lighthouse?.performance || 0) >= 90 ? 'Pass' : 'Needs Improvement'}</td>
            </tr>
            <tr>
                <td>Accessibility</td>
                <td>${report.performance.lighthouse?.accessibility || 'N/A'}</td>
                <td class="${(report.performance.lighthouse?.accessibility || 0) >= 90 ? 'pass' : 'fail'}">${(report.performance.lighthouse?.accessibility || 0) >= 90 ? 'Pass' : 'Needs Improvement'}</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>
    `;
    
    const htmlPath = path.join(process.cwd(), 'validation-report.html');
    fs.writeFileSync(htmlPath, htmlTemplate);
    
    console.log(`📄 HTML report saved to: ${htmlPath}`);
  }

  printSummary(report) {
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Overall Score: ${report.overallScore.toFixed(1)}/100`);
    console.log(`Tests: ${report.summary.passed}/${report.summary.total} passed (${report.passRate.toFixed(1)}%)`);
    
    if (report.performance.lighthouse) {
      console.log(`Performance: ${report.performance.lighthouse.performance}/100`);
      console.log(`Accessibility: ${report.performance.lighthouse.accessibility}/100`);
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n🔧 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    
    if (report.overallScore >= 80) {
      console.log('🎉 Excellent! Your project meets high quality standards.');
    } else if (report.overallScore >= 60) {
      console.log('⚠️  Good, but there\'s room for improvement.');
    } else {
      console.log('❌ Needs significant improvement before release.');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const runner = new ValidationRunner();
  runner.runAllValidations().catch(console.error);
}

module.exports = ValidationRunner;