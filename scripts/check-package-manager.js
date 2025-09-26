#!/usr/bin/env node

/**
 * 检查并强制使用 pnpm 作为包管理工具
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkPackageManager() {
  const userAgent = process.env.npm_config_user_agent || '';
  
  // 检查是否使用 pnpm
  if (!userAgent.includes('pnpm')) {
    console.error('❌ 错误: 此项目必须使用 pnpm 作为包管理工具');
    console.error('');
    console.error('请按照以下步骤操作:');
    console.error('');
    console.error('1. 安装 pnpm (如果尚未安装):');
    console.error('   npm install -g pnpm');
    console.error('   # 或者');
    console.error('   curl -fsSL https://get.pnpm.io/install.sh | sh -');
    console.error('');
    console.error('2. 使用 pnpm 安装依赖:');
    console.error('   pnpm install');
    console.error('');
    console.error('3. 使用 pnpm 运行脚本:');
    console.error('   pnpm dev');
    console.error('   pnpm build');
    console.error('   pnpm test');
    console.error('');
    process.exit(1);
  }

  console.log('✅ 正在使用 pnpm 包管理工具');
}

function checkLockFile() {
  const rootDir = process.cwd();
  const pnpmLock = path.join(rootDir, 'pnpm-lock.yaml');
  const npmLock = path.join(rootDir, 'package-lock.json');
  const yarnLock = path.join(rootDir, 'yarn.lock');

  // 检查是否存在其他锁文件
  if (fs.existsSync(npmLock)) {
    console.warn('⚠️  发现 package-lock.json 文件');
    console.warn('   建议删除此文件并使用 pnpm-lock.yaml');
    console.warn('   rm package-lock.json && pnpm install');
  }

  if (fs.existsSync(yarnLock)) {
    console.warn('⚠️  发现 yarn.lock 文件');
    console.warn('   建议删除此文件并使用 pnpm-lock.yaml');
    console.warn('   rm yarn.lock && pnpm install');
  }

  if (fs.existsSync(pnpmLock)) {
    console.log('✅ 找到 pnpm-lock.yaml 锁文件');
  }
}

function checkPnpmVersion() {
  try {
    const version = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 8) {
      console.warn(`⚠️  pnpm 版本 ${version} 可能不兼容`);
      console.warn('   建议升级到 pnpm 8.0.0 或更高版本');
      console.warn('   npm install -g pnpm@latest');
    } else {
      console.log(`✅ pnpm 版本 ${version} 符合要求`);
    }
  } catch (error) {
    console.error('❌ 无法检查 pnpm 版本');
    console.error('   请确保 pnpm 已正确安装');
  }
}

function main() {
  console.log('🔍 检查包管理工具配置...\n');
  
  checkPackageManager();
  checkPnpmVersion();
  checkLockFile();
  
  console.log('\n✨ 包管理工具检查完成!');
}

if (require.main === module) {
  main();
}

module.exports = {
  checkPackageManager,
  checkLockFile,
  checkPnpmVersion
};