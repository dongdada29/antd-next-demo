#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Deployment script for AI Coding Template
 * Supports multiple environments and deployment strategies
 */

const ENVIRONMENTS = {
  development: {
    name: 'development',
    url: 'http://localhost:3000',
    branch: 'develop',
    vercelProject: 'ai-template-dev'
  },
  staging: {
    name: 'staging',
    url: 'https://staging.ai-template.com',
    branch: 'develop',
    vercelProject: 'ai-template-staging'
  },
  production: {
    name: 'production',
    url: 'https://ai-template.com',
    branch: 'main',
    vercelProject: 'ai-template-prod'
  }
};

class DeploymentManager {
  constructor(environment = 'development') {
    this.env = ENVIRONMENTS[environment];
    if (!this.env) {
      throw new Error(`Unknown environment: ${environment}`);
    }
    
    this.startTime = Date.now();
    this.deploymentId = `deploy-${Date.now()}`;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  async runCommand(command, options = {}) {
    this.log(`Executing: ${command}`);
    try {
      const result = execSync(command, {
        stdio: 'inherit',
        encoding: 'utf8',
        ...options
      });
      return result;
    } catch (error) {
      this.log(`Command failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async checkPrerequisites() {
    this.log('Checking deployment prerequisites...');
    
    // Check if required tools are installed
    const tools = ['node', 'pnpm', 'git'];
    for (const tool of tools) {
      try {
        await this.runCommand(`${tool} --version`, { stdio: 'pipe' });
        this.log(`✓ ${tool} is available`);
      } catch (error) {
        throw new Error(`Required tool not found: ${tool}`);
      }
    }

    // Check if we're on the correct branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (currentBranch !== this.env.branch) {
      this.log(`Warning: Current branch (${currentBranch}) doesn't match target branch (${this.env.branch})`, 'warn');
    }

    // Check if working directory is clean
    try {
      execSync('git diff-index --quiet HEAD --', { stdio: 'pipe' });
      this.log('✓ Working directory is clean');
    } catch (error) {
      this.log('Warning: Working directory has uncommitted changes', 'warn');
    }
  }

  async runTests() {
    this.log('Running test suite...');
    
    const testCommands = [
      'pnpm lint',
      'pnpm type-check',
      'pnpm test:unit --run',
      'pnpm test:integration --run'
    ];

    for (const command of testCommands) {
      await this.runCommand(command);
    }

    this.log('✓ All tests passed');
  }

  async buildApplication() {
    this.log('Building application...');
    
    // Clean previous builds
    await this.runCommand('rm -rf .next out dist');
    
    // Install dependencies
    await this.runCommand('pnpm install --frozen-lockfile');
    
    // Build application
    await this.runCommand('pnpm build');
    
    // Run bundle analysis
    await this.runCommand('pnpm analyze');
    
    this.log('✓ Application built successfully');
  }

  async runPerformanceTests() {
    this.log('Running performance tests...');
    
    try {
      await this.runCommand('pnpm lighthouse:ci');
      await this.runCommand('pnpm test:performance --run');
      this.log('✓ Performance tests passed');
    } catch (error) {
      this.log('Performance tests failed, but continuing deployment', 'warn');
    }
  }

  async deployToVercel() {
    this.log(`Deploying to Vercel (${this.env.name})...`);
    
    const vercelArgs = this.env.name === 'production' ? '--prod' : '';
    const command = `vercel deploy ${vercelArgs} --token $VERCEL_TOKEN`;
    
    try {
      const deploymentUrl = await this.runCommand(command, { stdio: 'pipe' });
      this.log(`✓ Deployed to: ${deploymentUrl.trim()}`);
      return deploymentUrl.trim();
    } catch (error) {
      this.log('Vercel deployment failed', 'error');
      throw error;
    }
  }

  async deployToDocker() {
    this.log('Building and pushing Docker image...');
    
    const tag = `ai-coding-template:${this.env.name}-${Date.now()}`;
    
    await this.runCommand(`docker build -t ${tag} .`);
    await this.runCommand(`docker push ${tag}`);
    
    this.log(`✓ Docker image pushed: ${tag}`);
    return tag;
  }

  async runHealthCheck(url) {
    this.log(`Running health check on ${url}...`);
    
    const maxRetries = 10;
    const retryDelay = 5000;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${url}/api/health`);
        if (response.ok) {
          this.log('✓ Health check passed');
          return true;
        }
      } catch (error) {
        this.log(`Health check attempt ${i + 1} failed, retrying...`, 'warn');
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    throw new Error('Health check failed after maximum retries');
  }

  async notifyDeployment(success, deploymentUrl) {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    const status = success ? 'SUCCESS' : 'FAILED';
    
    const message = {
      deploymentId: this.deploymentId,
      environment: this.env.name,
      status,
      duration,
      url: deploymentUrl,
      timestamp: new Date().toISOString()
    };

    // Log deployment result
    this.log(`Deployment ${status} in ${duration}s`);
    
    // Send to monitoring system (if configured)
    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
      } catch (error) {
        this.log('Failed to send notification', 'warn');
      }
    }

    // Write deployment log
    const logFile = path.join(__dirname, '../logs/deployments.json');
    const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : [];
    logs.push(message);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }

  async deploy() {
    let deploymentUrl = null;
    let success = false;

    try {
      this.log(`Starting deployment to ${this.env.name}...`);
      
      await this.checkPrerequisites();
      await this.runTests();
      await this.buildApplication();
      await this.runPerformanceTests();
      
      // Deploy based on environment
      if (process.env.DEPLOY_TARGET === 'docker') {
        await this.deployToDocker();
        deploymentUrl = this.env.url;
      } else {
        deploymentUrl = await this.deployToVercel();
      }
      
      await this.runHealthCheck(deploymentUrl);
      
      success = true;
      this.log(`✅ Deployment completed successfully!`);
      
    } catch (error) {
      this.log(`❌ Deployment failed: ${error.message}`, 'error');
      success = false;
      throw error;
    } finally {
      await this.notifyDeployment(success, deploymentUrl);
    }

    return { success, deploymentUrl };
  }
}

// CLI interface
async function main() {
  const environment = process.argv[2] || 'development';
  const deployment = new DeploymentManager(environment);
  
  try {
    await deployment.deploy();
    process.exit(0);
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { DeploymentManager, ENVIRONMENTS };