#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Version management system for AI Coding Template
 * Handles semantic versioning, changelog generation, and release preparation
 */

class VersionManager {
  constructor() {
    this.packagePath = path.join(process.cwd(), 'package.json');
    this.changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    this.package = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  getCurrentVersion() {
    return this.package.version;
  }

  parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    if (!match) {
      throw new Error(`Invalid version format: ${version}`);
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4] || null
    };
  }

  incrementVersion(type = 'patch', prerelease = null) {
    const current = this.parseVersion(this.getCurrentVersion());
    
    switch (type) {
      case 'major':
        current.major++;
        current.minor = 0;
        current.patch = 0;
        break;
      case 'minor':
        current.minor++;
        current.patch = 0;
        break;
      case 'patch':
        current.patch++;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }

    let newVersion = `${current.major}.${current.minor}.${current.patch}`;
    if (prerelease) {
      newVersion += `-${prerelease}`;
    }

    return newVersion;
  }

  updatePackageVersion(newVersion) {
    this.package.version = newVersion;
    fs.writeFileSync(this.packagePath, JSON.stringify(this.package, null, 2) + '\n');
    this.log(`Updated package.json version to ${newVersion}`);
  }

  getCommitsSinceLastTag() {
    try {
      const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
      const commits = execSync(`git log ${lastTag}..HEAD --oneline`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(line => line.length > 0);
      
      return commits;
    } catch (error) {
      // No previous tags, get all commits
      const commits = execSync('git log --oneline', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(line => line.length > 0);
      
      return commits;
    }
  }

  categorizeCommits(commits) {
    const categories = {
      breaking: [],
      features: [],
      fixes: [],
      docs: [],
      style: [],
      refactor: [],
      perf: [],
      test: [],
      chore: [],
      other: []
    };

    commits.forEach(commit => {
      const message = commit.toLowerCase();
      
      if (message.includes('breaking') || message.includes('!:')) {
        categories.breaking.push(commit);
      } else if (message.startsWith('feat')) {
        categories.features.push(commit);
      } else if (message.startsWith('fix')) {
        categories.fixes.push(commit);
      } else if (message.startsWith('docs')) {
        categories.docs.push(commit);
      } else if (message.startsWith('style')) {
        categories.style.push(commit);
      } else if (message.startsWith('refactor')) {
        categories.refactor.push(commit);
      } else if (message.startsWith('perf')) {
        categories.perf.push(commit);
      } else if (message.startsWith('test')) {
        categories.test.push(commit);
      } else if (message.startsWith('chore')) {
        categories.chore.push(commit);
      } else {
        categories.other.push(commit);
      }
    });

    return categories;
  }

  generateChangelog(version, commits) {
    const categories = this.categorizeCommits(commits);
    const date = new Date().toISOString().split('T')[0];
    
    let changelog = `## [${version}] - ${date}\n\n`;

    if (categories.breaking.length > 0) {
      changelog += '### ⚠ BREAKING CHANGES\n\n';
      categories.breaking.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.features.length > 0) {
      changelog += '### ✨ Features\n\n';
      categories.features.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.fixes.length > 0) {
      changelog += '### 🐛 Bug Fixes\n\n';
      categories.fixes.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.perf.length > 0) {
      changelog += '### ⚡ Performance Improvements\n\n';
      categories.perf.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.refactor.length > 0) {
      changelog += '### ♻️ Code Refactoring\n\n';
      categories.refactor.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.docs.length > 0) {
      changelog += '### 📚 Documentation\n\n';
      categories.docs.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.test.length > 0) {
      changelog += '### 🧪 Tests\n\n';
      categories.test.forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    if (categories.style.length > 0 || categories.chore.length > 0) {
      changelog += '### 🔧 Maintenance\n\n';
      [...categories.style, ...categories.chore].forEach(commit => {
        changelog += `- ${commit}\n`;
      });
      changelog += '\n';
    }

    return changelog;
  }

  updateChangelog(newVersion, commits) {
    const newEntry = this.generateChangelog(newVersion, commits);
    
    let existingChangelog = '';
    if (fs.existsSync(this.changelogPath)) {
      existingChangelog = fs.readFileSync(this.changelogPath, 'utf8');
    } else {
      existingChangelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }

    // Insert new entry after the header
    const lines = existingChangelog.split('\n');
    const headerEndIndex = lines.findIndex(line => line.startsWith('## '));
    
    if (headerEndIndex === -1) {
      // No existing entries, add after header
      const headerLines = lines.slice(0, 3);
      const updatedChangelog = [...headerLines, '', newEntry, ...lines.slice(3)].join('\n');
      fs.writeFileSync(this.changelogPath, updatedChangelog);
    } else {
      // Insert before first existing entry
      const beforeEntry = lines.slice(0, headerEndIndex);
      const afterEntry = lines.slice(headerEndIndex);
      const updatedChangelog = [...beforeEntry, newEntry, ...afterEntry].join('\n');
      fs.writeFileSync(this.changelogPath, updatedChangelog);
    }

    this.log(`Updated CHANGELOG.md with version ${newVersion}`);
  }

  createGitTag(version) {
    const tagName = `v${version}`;
    
    try {
      execSync(`git add package.json CHANGELOG.md`);
      execSync(`git commit -m "chore: release ${version}"`);
      execSync(`git tag -a ${tagName} -m "Release ${version}"`);
      
      this.log(`Created git tag: ${tagName}`);
      return tagName;
    } catch (error) {
      throw new Error(`Failed to create git tag: ${error.message}`);
    }
  }

  suggestVersionType(commits) {
    const categories = this.categorizeCommits(commits);
    
    if (categories.breaking.length > 0) {
      return 'major';
    } else if (categories.features.length > 0) {
      return 'minor';
    } else if (categories.fixes.length > 0 || categories.perf.length > 0) {
      return 'patch';
    } else {
      return 'patch'; // Default to patch for other changes
    }
  }

  async release(type = null, prerelease = null, dryRun = false) {
    this.log('Starting release process...');
    
    // Get commits since last release
    const commits = this.getCommitsSinceLastTag();
    if (commits.length === 0) {
      this.log('No commits since last release');
      return;
    }

    // Suggest version type if not provided
    if (!type) {
      type = this.suggestVersionType(commits);
      this.log(`Suggested version type: ${type}`);
    }

    // Calculate new version
    const currentVersion = this.getCurrentVersion();
    const newVersion = this.incrementVersion(type, prerelease);
    
    this.log(`Version: ${currentVersion} → ${newVersion}`);
    
    if (dryRun) {
      this.log('DRY RUN - Changes that would be made:');
      this.log(`- Update package.json version to ${newVersion}`);
      this.log(`- Update CHANGELOG.md with ${commits.length} commits`);
      this.log(`- Create git tag v${newVersion}`);
      return;
    }

    // Update package.json
    this.updatePackageVersion(newVersion);
    
    // Update changelog
    this.updateChangelog(newVersion, commits);
    
    // Create git tag
    const tagName = this.createGitTag(newVersion);
    
    this.log(`✅ Release ${newVersion} completed successfully!`);
    this.log(`Next steps:`);
    this.log(`- Push changes: git push origin main`);
    this.log(`- Push tag: git push origin ${tagName}`);
    
    return {
      version: newVersion,
      tag: tagName,
      commits: commits.length
    };
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const versionManager = new VersionManager();
  
  const command = args[0];
  
  switch (command) {
    case 'current':
      console.log(versionManager.getCurrentVersion());
      break;
      
    case 'release':
      const type = args[1]; // major, minor, patch
      const prerelease = args.includes('--prerelease') ? args[args.indexOf('--prerelease') + 1] : null;
      const dryRun = args.includes('--dry-run');
      
      try {
        await versionManager.release(type, prerelease, dryRun);
      } catch (error) {
        console.error('Release failed:', error.message);
        process.exit(1);
      }
      break;
      
    case 'changelog':
      const commits = versionManager.getCommitsSinceLastTag();
      const changelog = versionManager.generateChangelog('unreleased', commits);
      console.log(changelog);
      break;
      
    default:
      console.log('Usage:');
      console.log('  node version-manager.js current');
      console.log('  node version-manager.js release [major|minor|patch] [--prerelease <name>] [--dry-run]');
      console.log('  node version-manager.js changelog');
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { VersionManager };