#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Template Publisher
 * Handles template packaging, validation, and publishing to marketplace
 */

class TemplatePublisher {
  constructor() {
    this.templateDir = path.join(process.cwd(), 'templates');
    this.distDir = path.join(process.cwd(), 'dist');
    this.configFile = path.join(process.cwd(), 'template.config.json');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  /**
   * Initialize template configuration
   */
  async init(templateName) {
    this.log(`Initializing template: ${templateName}`);

    const config = {
      id: templateName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name: templateName,
      description: '',
      version: '1.0.0',
      author: '',
      category: 'component',
      tags: [],
      license: 'MIT',
      dependencies: [],
      compatibility: {
        nextjs: '^14.0.0',
        react: '^18.0.0',
        typescript: '^5.0.0'
      },
      files: {
        include: ['src/**/*'],
        exclude: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
      },
      examples: {
        include: ['examples/**/*'],
        exclude: []
      },
      documentation: 'README.md'
    };

    // Create template directory structure
    const templatePath = path.join(this.templateDir, config.id);
    if (!fs.existsSync(templatePath)) {
      fs.mkdirSync(templatePath, { recursive: true });
      fs.mkdirSync(path.join(templatePath, 'src'));
      fs.mkdirSync(path.join(templatePath, 'examples'));
    }

    // Create template config
    fs.writeFileSync(
      path.join(templatePath, 'template.json'),
      JSON.stringify(config, null, 2)
    );

    // Create README template
    const readmeContent = `# ${config.name}

${config.description || 'Template description goes here'}

## Installation

\`\`\`bash
npx ai-template install ${config.id}
\`\`\`

## Usage

\`\`\`typescript
// Usage example goes here
\`\`\`

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| | | | |

## Examples

See the \`examples/\` directory for usage examples.

## License

${config.license}
`;

    fs.writeFileSync(path.join(templatePath, 'README.md'), readmeContent);

    this.log(`Template initialized at: ${templatePath}`);
    this.log('Next steps:');
    this.log('1. Edit template.json with your template details');
    this.log('2. Add your template files to the src/ directory');
    this.log('3. Add examples to the examples/ directory');
    this.log('4. Update README.md with documentation');
    this.log('5. Run "npm run template:validate" to validate');
    this.log('6. Run "npm run template:publish" to publish');
  }

  /**
   * Validate template structure and configuration
   */
  async validate(templateId) {
    this.log(`Validating template: ${templateId}`);

    const templatePath = path.join(this.templateDir, templateId);
    const configPath = path.join(templatePath, 'template.json');

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template directory not found: ${templatePath}`);
    }

    if (!fs.existsSync(configPath)) {
      throw new Error(`Template configuration not found: ${configPath}`);
    }

    // Load and validate configuration
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const errors = this.validateConfig(config);

    if (errors.length > 0) {
      this.log('Validation errors:', 'error');
      errors.forEach(error => this.log(`- ${error}`, 'error'));
      throw new Error('Template validation failed');
    }

    // Validate file structure
    const fileErrors = await this.validateFiles(templatePath, config);
    if (fileErrors.length > 0) {
      this.log('File validation errors:', 'error');
      fileErrors.forEach(error => this.log(`- ${error}`, 'error'));
      throw new Error('Template file validation failed');
    }

    // Validate TypeScript compilation
    if (this.hasTypeScriptFiles(templatePath)) {
      try {
        await this.validateTypeScript(templatePath);
      } catch (error) {
        this.log(`TypeScript validation failed: ${error.message}`, 'error');
        throw error;
      }
    }

    this.log('✅ Template validation passed');
    return true;
  }

  /**
   * Package template for distribution
   */
  async package(templateId) {
    this.log(`Packaging template: ${templateId}`);

    const templatePath = path.join(this.templateDir, templateId);
    const configPath = path.join(templatePath, 'template.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Create dist directory
    if (!fs.existsSync(this.distDir)) {
      fs.mkdirSync(this.distDir, { recursive: true });
    }

    const packagePath = path.join(this.distDir, `${templateId}-${config.version}.tgz`);

    // Create package structure
    const packageDir = path.join(this.distDir, 'package');
    if (fs.existsSync(packageDir)) {
      fs.rmSync(packageDir, { recursive: true });
    }
    fs.mkdirSync(packageDir, { recursive: true });

    // Copy template files
    await this.copyTemplateFiles(templatePath, packageDir, config);

    // Create package.json for npm compatibility
    const packageJson = {
      name: `@ai-templates/${config.id}`,
      version: config.version,
      description: config.description,
      author: config.author,
      license: config.license,
      keywords: config.tags,
      repository: config.repository,
      homepage: config.homepage,
      files: ['**/*'],
      engines: {
        node: '>=18.0.0'
      }
    };

    fs.writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tarball
    execSync(`tar -czf "${packagePath}" -C "${packageDir}" .`);

    // Clean up temporary package directory
    fs.rmSync(packageDir, { recursive: true });

    this.log(`✅ Template packaged: ${packagePath}`);
    return packagePath;
  }

  /**
   * Publish template to marketplace
   */
  async publish(templateId, options = {}) {
    const { dryRun = false, registry = 'https://api.ai-template-marketplace.com' } = options;

    this.log(`Publishing template: ${templateId}${dryRun ? ' (dry run)' : ''}`);

    // Validate template first
    await this.validate(templateId);

    // Package template
    const packagePath = await this.package(templateId);

    if (dryRun) {
      this.log('Dry run completed - template would be published');
      return;
    }

    // Read template config
    const templatePath = path.join(this.templateDir, templateId);
    const configPath = path.join(templatePath, 'template.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Prepare template data
    const templateData = await this.prepareTemplateData(templatePath, config);

    try {
      // Upload to registry
      const response = await fetch(`${registry}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TEMPLATE_REGISTRY_TOKEN}`
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Publishing failed: ${response.status} ${error}`);
      }

      const result = await response.json();
      
      this.log(`✅ Template published successfully!`);
      this.log(`Template ID: ${result.id}`);
      this.log(`Version: ${result.version}`);
      this.log(`URL: ${result.url}`);

      // Update local config with published info
      config.published = {
        id: result.id,
        version: result.version,
        url: result.url,
        publishedAt: new Date().toISOString()
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    } catch (error) {
      this.log(`❌ Publishing failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * List available templates
   */
  async list() {
    if (!fs.existsSync(this.templateDir)) {
      this.log('No templates found');
      return [];
    }

    const templates = [];
    const entries = fs.readdirSync(this.templateDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const configPath = path.join(this.templateDir, entry.name, 'template.json');
        
        if (fs.existsSync(configPath)) {
          try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            templates.push({
              id: entry.name,
              name: config.name,
              version: config.version,
              description: config.description,
              category: config.category,
              published: config.published || null
            });
          } catch (error) {
            this.log(`Failed to read config for ${entry.name}: ${error.message}`, 'warn');
          }
        }
      }
    }

    return templates;
  }

  validateConfig(config) {
    const errors = [];

    if (!config.id || !/^[a-z0-9-]+$/.test(config.id)) {
      errors.push('Template ID must contain only lowercase letters, numbers, and hyphens');
    }

    if (!config.name || config.name.length < 3) {
      errors.push('Template name must be at least 3 characters long');
    }

    if (!config.description || config.description.length < 10) {
      errors.push('Template description must be at least 10 characters long');
    }

    if (!config.version || !/^\d+\.\d+\.\d+/.test(config.version)) {
      errors.push('Template version must follow semantic versioning (e.g., 1.0.0)');
    }

    if (!config.author) {
      errors.push('Template author is required');
    }

    if (!['component', 'page', 'layout', 'hook', 'utility'].includes(config.category)) {
      errors.push('Template category must be one of: component, page, layout, hook, utility');
    }

    if (!config.license) {
      errors.push('Template license is required');
    }

    return errors;
  }

  async validateFiles(templatePath, config) {
    const errors = [];

    // Check if src directory exists and has files
    const srcPath = path.join(templatePath, 'src');
    if (!fs.existsSync(srcPath)) {
      errors.push('src/ directory is required');
    } else {
      const srcFiles = this.getFiles(srcPath);
      if (srcFiles.length === 0) {
        errors.push('src/ directory must contain at least one file');
      }
    }

    // Check if README exists
    const readmePath = path.join(templatePath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      errors.push('README.md is required');
    }

    // Validate file patterns
    if (config.files && config.files.include) {
      for (const pattern of config.files.include) {
        const files = this.getFilesByPattern(templatePath, pattern);
        if (files.length === 0) {
          errors.push(`No files found matching pattern: ${pattern}`);
        }
      }
    }

    return errors;
  }

  hasTypeScriptFiles(templatePath) {
    const files = this.getFiles(templatePath);
    return files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  }

  async validateTypeScript(templatePath) {
    try {
      execSync('npx tsc --noEmit --skipLibCheck', {
        cwd: templatePath,
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`TypeScript compilation failed: ${error.stdout || error.message}`);
    }
  }

  async copyTemplateFiles(sourcePath, targetPath, config) {
    const files = this.getFiles(sourcePath);
    
    for (const file of files) {
      const relativePath = path.relative(sourcePath, file);
      const targetFile = path.join(targetPath, relativePath);
      const targetDir = path.dirname(targetFile);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(file, targetFile);
    }
  }

  async prepareTemplateData(templatePath, config) {
    const files = [];
    const srcFiles = this.getFiles(path.join(templatePath, 'src'));

    for (const file of srcFiles) {
      const relativePath = path.relative(path.join(templatePath, 'src'), file);
      const content = fs.readFileSync(file, 'utf8');
      const ext = path.extname(file).slice(1);
      
      files.push({
        path: relativePath,
        content,
        type: this.getFileType(ext)
      });
    }

    // Add examples if they exist
    const examples = [];
    const examplesPath = path.join(templatePath, 'examples');
    if (fs.existsSync(examplesPath)) {
      const exampleFiles = this.getFiles(examplesPath);
      
      for (const file of exampleFiles) {
        const relativePath = path.relative(examplesPath, file);
        const content = fs.readFileSync(file, 'utf8');
        const ext = path.extname(file).slice(1);
        
        examples.push({
          path: relativePath,
          content,
          type: this.getFileType(ext)
        });
      }
    }

    // Read documentation
    let documentation = '';
    const readmePath = path.join(templatePath, 'README.md');
    if (fs.existsSync(readmePath)) {
      documentation = fs.readFileSync(readmePath, 'utf8');
    }

    return {
      metadata: {
        ...config,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        downloads: 0,
        rating: 0
      },
      files,
      examples,
      documentation
    };
  }

  getFiles(dir) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  getFilesByPattern(dir, pattern) {
    // Simple pattern matching - in production, use a proper glob library
    const files = this.getFiles(dir);
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return files.filter(file => regex.test(path.relative(dir, file)));
  }

  getFileType(extension) {
    const typeMap = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'css': 'css',
      'scss': 'css',
      'json': 'json',
      'md': 'markdown'
    };

    return typeMap[extension] || 'text';
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const publisher = new TemplatePublisher();

  try {
    switch (command) {
      case 'init':
        const templateName = args[1];
        if (!templateName) {
          console.error('Template name is required');
          process.exit(1);
        }
        await publisher.init(templateName);
        break;

      case 'validate':
        const validateId = args[1];
        if (!validateId) {
          console.error('Template ID is required');
          process.exit(1);
        }
        await publisher.validate(validateId);
        break;

      case 'package':
        const packageId = args[1];
        if (!packageId) {
          console.error('Template ID is required');
          process.exit(1);
        }
        await publisher.package(packageId);
        break;

      case 'publish':
        const publishId = args[1];
        if (!publishId) {
          console.error('Template ID is required');
          process.exit(1);
        }
        const dryRun = args.includes('--dry-run');
        await publisher.publish(publishId, { dryRun });
        break;

      case 'list':
        const templates = await publisher.list();
        console.table(templates);
        break;

      default:
        console.log('Usage:');
        console.log('  node template-publisher.js init <template-name>');
        console.log('  node template-publisher.js validate <template-id>');
        console.log('  node template-publisher.js package <template-id>');
        console.log('  node template-publisher.js publish <template-id> [--dry-run]');
        console.log('  node template-publisher.js list');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { TemplatePublisher };