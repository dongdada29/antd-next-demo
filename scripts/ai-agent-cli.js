#!/usr/bin/env node

/**
 * AI Agent CLI Helper
 * Provides utilities for AI-driven development
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMANDS = {
  init: 'Initialize AI Agent project structure',
  component: 'Generate a new component',
  page: 'Generate a new page',
  hook: 'Generate a new hook',
  test: 'Generate tests for a component',
  validate: 'Validate project structure and code quality',
  docs: 'Generate documentation',
  claude: 'Use Claude-optimized prompts and settings',
  codex: 'Use Codex-optimized prompts and settings',
  optimize: 'Optimize AI model selection for current task',
};

function showHelp() {
  console.log('AI Agent CLI Helper\n');
  console.log('Usage: node scripts/ai-agent-cli.js <command> [options]\n');
  console.log('Commands:');
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(12)} ${desc}`);
  });
  console.log('\nExamples:');
  console.log('  pnpm ai:component --name button --type ui');
  console.log('  pnpm ai:page --name dashboard --layout default');
  console.log('  pnpm ai:validate --fix');
}

function initProject() {
  console.log('🚀 Initializing AI Agent project structure...');
  
  const directories = [
    'src/components/templates',
    'src/lib/ai',
    'src/test/templates',
    '.kiro/templates',
    '.kiro/prompts',
    'docs/components',
    'docs/examples',
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });

  console.log('✨ Project structure initialized successfully!');
}

function generateComponent(options) {
  const { name, type = 'ui', variant = 'default' } = options;
  
  if (!name) {
    console.error('❌ Component name is required');
    process.exit(1);
  }

  console.log(`🔧 Generating ${type} component: ${name}`);

  const componentName = toPascalCase(name);
  const fileName = toKebabCase(name);
  const componentDir = `src/components/${type}`;
  
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const componentPath = path.join(componentDir, `${fileName}.tsx`);
  const testPath = path.join('src/test/components', `${fileName}.test.tsx`);

  // Generate component file
  const componentTemplate = generateComponentTemplate(componentName, type);
  fs.writeFileSync(componentPath, componentTemplate);
  console.log(`✅ Created component: ${componentPath}`);

  // Generate test file
  const testTemplate = generateTestTemplate(componentName, fileName);
  fs.writeFileSync(testPath, testTemplate);
  console.log(`✅ Created test: ${testPath}`);

  // Update index file
  updateIndexFile(componentDir, componentName, fileName);
  
  console.log('✨ Component generated successfully!');
}

function generatePage(options) {
  const { name, layout = 'default' } = options;
  
  if (!name) {
    console.error('❌ Page name is required');
    process.exit(1);
  }

  console.log(`📄 Generating page: ${name}`);

  const pageName = toKebabCase(name);
  const pageDir = `src/app/${pageName}`;
  
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const pagePath = path.join(pageDir, 'page.tsx');
  const pageTemplate = generatePageTemplate(name, layout);
  
  fs.writeFileSync(pagePath, pageTemplate);
  console.log(`✅ Created page: ${pagePath}`);
  
  console.log('✨ Page generated successfully!');
}

function validateProject(options) {
  console.log('🔍 Validating project structure and code quality...');
  
  const { fix = false } = options;
  
  try {
    // Run TypeScript check
    console.log('📝 Checking TypeScript...');
    execSync('pnpm run type-check', { stdio: 'inherit' });
    
    // Run ESLint
    console.log('🔧 Running ESLint...');
    const eslintCmd = fix ? 'pnpm run lint:fix' : 'pnpm run lint';
    execSync(eslintCmd, { stdio: 'inherit' });
    
    // Run tests
    console.log('🧪 Running tests...');
    execSync('pnpm test', { stdio: 'inherit' });
    
    console.log('✅ All validations passed!');
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

function useClaudeMode(options) {
  console.log('🤖 Switching to Claude-optimized mode...');
  
  const { task = 'component' } = options;
  
  console.log(`📋 Task: ${task}`);
  console.log('🎯 Claude strengths:');
  console.log('  - Deep context understanding');
  console.log('  - Comprehensive code generation');
  console.log('  - Detailed documentation');
  console.log('  - Multi-file coordination');
  console.log('  - Advanced refactoring');
  
  console.log('\n📝 Recommended prompts for Claude:');
  console.log('  - Include full project context');
  console.log('  - Request detailed explanations');
  console.log('  - Ask for comprehensive tests');
  console.log('  - Request accessibility compliance');
  console.log('  - Ask for performance optimizations');
  
  console.log('\n📖 See .kiro/prompts/claude-optimized.md for detailed prompts');
}

function useCodexMode(options) {
  console.log('⚡ Switching to Codex-optimized mode...');
  
  const { task = 'component' } = options;
  
  console.log(`📋 Task: ${task}`);
  console.log('🎯 Codex strengths:');
  console.log('  - Fast code generation');
  console.log('  - Pattern recognition');
  console.log('  - Efficient autocompletion');
  console.log('  - Quick fixes');
  console.log('  - Rapid prototyping');
  
  console.log('\n📝 Recommended prompts for Codex:');
  console.log('  - Use concise, clear instructions');
  console.log('  - Focus on specific patterns');
  console.log('  - Request minimal viable solutions');
  console.log('  - Leverage existing code context');
  console.log('  - Use inline comments for guidance');
  
  console.log('\n📖 See .kiro/prompts/codex-optimized.md for detailed prompts');
}

function optimizeAISelection(options) {
  console.log('🎯 AI Model Optimization Recommendations...');
  
  const { task, complexity = 'medium', timeline = 'normal' } = options;
  
  if (!task) {
    console.error('❌ Task type is required for optimization');
    console.log('Available tasks: component, page, hook, test, refactor, docs, fix');
    process.exit(1);
  }
  
  const recommendations = getAIRecommendations(task, complexity, timeline);
  
  console.log(`\n📋 Task: ${task}`);
  console.log(`🔧 Complexity: ${complexity}`);
  console.log(`⏱️  Timeline: ${timeline}`);
  console.log(`\n🤖 Recommended AI Model: ${recommendations.model}`);
  console.log(`📝 Reason: ${recommendations.reason}`);
  console.log(`⚙️  Settings: ${JSON.stringify(recommendations.settings, null, 2)}`);
  
  if (recommendations.prompts) {
    console.log(`\n📖 Recommended prompts file: ${recommendations.prompts}`);
  }
  
  if (recommendations.workflow) {
    console.log('\n🔄 Recommended workflow:');
    recommendations.workflow.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.phase}: ${step.description} (${step.model})`);
    });
  }
}

function getAIRecommendations(task, complexity, timeline) {
  const taskMappings = {
    component: {
      simple: {
        model: 'Codex',
        reason: 'Fast generation for simple components',
        settings: { contextLength: 'minimal', detailLevel: 'basic' },
        prompts: '.kiro/prompts/codex-optimized.md'
      },
      medium: {
        model: 'Claude',
        reason: 'Balanced approach with good practices',
        settings: { contextLength: 'moderate', detailLevel: 'detailed' },
        prompts: '.kiro/prompts/claude-optimized.md'
      },
      complex: {
        model: 'Claude',
        reason: 'Deep understanding needed for complex components',
        settings: { contextLength: 'maximum', detailLevel: 'comprehensive' },
        prompts: '.kiro/prompts/claude-optimized.md',
        workflow: [
          { phase: 'Design', description: 'Architecture and interface design', model: 'Claude' },
          { phase: 'Implementation', description: 'Core component logic', model: 'Claude' },
          { phase: 'Testing', description: 'Comprehensive test suite', model: 'Claude' },
          { phase: 'Documentation', description: 'Usage examples and API docs', model: 'Claude' }
        ]
      }
    },
    fix: {
      simple: {
        model: 'Codex',
        reason: 'Quick fixes and simple corrections',
        settings: { focusOnSpeed: true, contextLength: 'minimal' }
      },
      medium: {
        model: 'Codex',
        reason: 'Efficient problem solving',
        settings: { focusOnSpeed: true, contextLength: 'moderate' }
      },
      complex: {
        model: 'Claude',
        reason: 'Complex debugging requires deep analysis',
        settings: { analyzeImpact: true, contextLength: 'maximum' }
      }
    },
    refactor: {
      simple: {
        model: 'Codex',
        reason: 'Simple refactoring patterns',
        settings: { focusOnPatterns: true }
      },
      medium: {
        model: 'Claude',
        reason: 'Structural changes need careful analysis',
        settings: { preserveCompatibility: true, analyzeImpact: true }
      },
      complex: {
        model: 'Claude',
        reason: 'Complex refactoring requires system understanding',
        settings: { 
          preserveCompatibility: true, 
          analyzeImpact: true, 
          generateMigrationGuide: true 
        },
        workflow: [
          { phase: 'Analysis', description: 'Code structure analysis', model: 'Claude' },
          { phase: 'Planning', description: 'Refactoring strategy', model: 'Claude' },
          { phase: 'Implementation', description: 'Step-by-step refactoring', model: 'Claude' },
          { phase: 'Validation', description: 'Testing and verification', model: 'Claude' }
        ]
      }
    },
    test: {
      simple: {
        model: 'Codex',
        reason: 'Basic test generation',
        settings: { generateBasicTests: true }
      },
      medium: {
        model: 'Claude',
        reason: 'Comprehensive test coverage',
        settings: { includeEdgeCases: true, includeAccessibilityTests: true }
      },
      complex: {
        model: 'Claude',
        reason: 'Advanced testing strategies needed',
        settings: { 
          includeEdgeCases: true, 
          includeAccessibilityTests: true,
          includePerformanceTests: true,
          includeIntegrationTests: true
        }
      }
    },
    docs: {
      simple: {
        model: 'Codex',
        reason: 'Basic documentation generation',
        settings: { generateMinimal: true }
      },
      medium: {
        model: 'Claude',
        reason: 'Detailed documentation with examples',
        settings: { includeExamples: true, includeApiReference: true }
      },
      complex: {
        model: 'Claude',
        reason: 'Comprehensive documentation system',
        settings: { 
          includeExamples: true, 
          includeApiReference: true,
          multiLanguage: true,
          includeArchitectureDocs: true
        }
      }
    }
  };
  
  const taskConfig = taskMappings[task];
  if (!taskConfig) {
    return {
      model: 'Claude',
      reason: 'Default recommendation for unknown task type',
      settings: { contextLength: 'moderate', detailLevel: 'detailed' }
    };
  }
  
  return taskConfig[complexity] || taskConfig.medium || taskConfig.simple;
}

// Utility functions
function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
}

function generateComponentTemplate(componentName, type) {
  return `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const ${componentName.toLowerCase()}Variants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${componentName.toLowerCase()}Variants> {
  // Add custom props here
}

/**
 * ${componentName} component
 * 
 * @example
 * \`\`\`tsx
 * <${componentName}>
 *   Content
 * </${componentName}>
 * \`\`\`
 */
const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(${componentName.toLowerCase()}Variants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
${componentName}.displayName = '${componentName}';

export { ${componentName}, ${componentName.toLowerCase()}Variants };
export type { ${componentName}Props };`;
}

function generateTestTemplate(componentName, fileName) {
  return `import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${fileName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<${componentName} className="custom-class">Content</${componentName}>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<${componentName} ref={ref}>Content</${componentName}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});`;
}

function generatePageTemplate(name, layout) {
  const pageName = toPascalCase(name);
  
  return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${pageName}',
  description: '${pageName} page description',
};

export default function ${pageName}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">${pageName}</h1>
        <p className="text-muted-foreground">
          Welcome to the ${pageName.toLowerCase()} page.
        </p>
      </header>

      <main>
        {/* Page content goes here */}
      </main>
    </div>
  );
}`;
}

function updateIndexFile(componentDir, componentName, fileName) {
  const indexPath = path.join(componentDir, 'index.ts');
  const exportLine = `export { ${componentName} } from './${fileName}';`;
  
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes(exportLine)) {
      fs.appendFileSync(indexPath, `\n${exportLine}`);
    }
  } else {
    fs.writeFileSync(indexPath, exportLine);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {};
  
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      options[key] = value;
    } else if (key) {
      options[key] = true;
    }
  }
  
  return { command, options };
}

// Main execution
function main() {
  const { command, options } = parseArgs();
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'init':
      initProject();
      break;
    case 'component':
      generateComponent(options);
      break;
    case 'page':
      generatePage(options);
      break;
    case 'validate':
      validateProject(options);
      break;
    case 'claude':
      useClaudeMode(options);
      break;
    case 'codex':
      useCodexMode(options);
      break;
    case 'optimize':
      optimizeAISelection(options);
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}