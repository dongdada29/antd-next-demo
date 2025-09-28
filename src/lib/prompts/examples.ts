/**
 * 提示词系统使用示例
 * 展示如何使用提示词管理系统的各种功能
 */

import {
  PromptLibrary,
  promptManager,
  contextBuilder,
  versionManager,
  PromptContext,
  ContextBuilderOptions,
} from './index';

/**
 * 基础使用示例
 */
export class PromptExamples {
  /**
   * 示例1: 生成 Button 组件
   */
  static async generateButtonComponent(): Promise<string> {
    const context: PromptContext = {
      task: 'component',
      target: 'Button',
      requirements: [
        '支持多种变体（default、destructive、outline）',
        '提供不同尺寸选项（sm、md、lg）',
        '支持加载状态和禁用状态',
        '实现完整的可访问性支持',
      ],
      constraints: [
        '必须基于 shadcn/ui Button 组件',
        '使用 TypeScript 严格模式',
        '遵循项目编码规范',
      ],
      preferences: {
        complexity: 'medium',
        performance: 'optimized',
        accessibility: 'enhanced',
        responsive: true,
        darkMode: true,
      },
    };

    const options: ContextBuilderOptions = {
      includeSystemPrompts: true,
      includeV0Specifications: true,
      componentTypes: ['button'],
      styleCategories: ['styling', 'interaction', 'accessibility'],
    };

    const builtContext = await contextBuilder.buildContext(context, options);
    return builtContext.prompt;
  }

  /**
   * 示例2: 生成仪表板页面
   */
  static async generateDashboardPage(): Promise<string> {
    const context: PromptContext = {
      task: 'page',
      target: 'AdminDashboard',
      requirements: [
        '显示关键业务指标统计',
        '实现数据可视化图表',
        '提供实时数据更新',
        '支持数据筛选和导出',
      ],
      constraints: [
        '使用 Next.js App Router',
        '集成 Recharts 图表库',
        '实现响应式布局',
      ],
      preferences: {
        complexity: 'complex',
        performance: 'high-performance',
        accessibility: 'full-compliance',
        responsive: true,
        darkMode: true,
      },
    };

    const options: ContextBuilderOptions = {
      includeSystemPrompts: true,
      pageTypes: ['dashboard'],
      styleCategories: ['styling', 'interaction', 'performance'],
    };

    const builtContext = await contextBuilder.buildContext(context, options);
    return builtContext.prompt;
  }

  /**
   * 示例3: 快速组件生成
   */
  static generateQuickComponent(componentType: string): string {
    return contextBuilder.buildQuickContext(
      'component',
      componentType,
      [`创建一个基础的 ${componentType} 组件`]
    );
  }

  /**
   * 示例4: 代码调试
   */
  static generateDebugPrompt(code: string, error: string): string {
    return contextBuilder.buildDebugContext(code, error, {
      task: 'optimization',
      target: 'debug',
      preferences: {
        complexity: 'medium',
        performance: 'standard',
        accessibility: 'basic',
        responsive: true,
        darkMode: false,
      },
    });
  }

  /**
   * 示例5: 使用模板生成提示词
   */
  static generateFromTemplate(): string {
    return promptManager.generateFromTemplate('component-generator', {
      componentType: 'Card',
      componentName: 'ProductCard',
      baseComponent: 'shadcn/ui Card',
      variants: ['default', 'featured', 'compact'],
      sizes: ['sm', 'md', 'lg'],
      features: [
        '显示产品图片和信息',
        '支持价格和折扣显示',
        '提供操作按钮（加入购物车、收藏）',
        '实现悬停效果和动画',
      ],
      responsive: true,
      ariaLabels: true,
      keyboardNavigation: true,
      screenReader: true,
    });
  }

  /**
   * 示例6: 专家级上下文构建
   */
  static async generateExpertContext(): Promise<string> {
    const context: PromptContext = {
      task: 'component',
      target: 'DataTable',
      requirements: [
        '支持大数据集的虚拟滚动',
        '实现复杂的排序和筛选',
        '提供列的拖拽排序',
        '支持行选择和批量操作',
      ],
      constraints: [
        '使用 @tanstack/react-table',
        '性能要求极高',
        '完全的可访问性支持',
      ],
      preferences: {
        complexity: 'complex',
        performance: 'high-performance',
        accessibility: 'full-compliance',
        responsive: true,
        darkMode: true,
      },
    };

    const builtContext = await contextBuilder.buildExpertContext(
      context,
      ['performance', 'accessibility']
    );

    return builtContext.prompt;
  }

  /**
   * 示例7: 版本管理
   */
  static demonstrateVersionManagement(): void {
    const promptId = 'button-component';
    
    // 创建初始版本
    const v1 = versionManager.createVersion(
      promptId,
      'Initial button component prompt...',
      {
        author: 'developer',
        description: 'Initial version of button component prompt',
        changelog: ['Created basic button component structure'],
        tags: ['component', 'ui', 'button'],
      }
    );

    console.log('Created version:', v1.version);

    // 更新提示词
    const v2 = versionManager.updatePrompt(
      promptId,
      'Updated button component prompt with accessibility...',
      ['Added accessibility requirements', 'Improved TypeScript types']
    );

    console.log('Updated to version:', v2.version);

    // 获取版本历史
    const history = versionManager.getVersionHistory(promptId);
    console.log('Version history:', history);

    // 回滚到上一版本
    const rollbackSuccess = versionManager.rollback(promptId);
    console.log('Rollback success:', rollbackSuccess);

    // 获取当前版本
    const current = versionManager.getCurrentVersion(promptId);
    console.log('Current version:', current?.version);
  }

  /**
   * 示例8: 提示词搜索和推荐
   */
  static searchAndRecommend(): void {
    // 搜索相关提示词
    const searchResults = PromptLibrary.searchPrompts('button');
    console.log('Search results:', searchResults);

    // 获取推荐的提示词组合
    const recommended = PromptLibrary.getRecommendedPrompts({
      task: 'component',
      complexity: 'medium',
      features: ['responsive', 'accessibility'],
    });

    console.log('Recommended prompts:', recommended);
  }

  /**
   * 示例9: 提示词验证和优化
   */
  static validateAndOptimize(): void {
    const sampleCode = `
      const Button = ({ children, ...props }) => {
        return <button {...props}>{children}</button>
      }
    `;

    // 验证代码是否符合 V0 规范
    const validation = PromptLibrary.validateCode(sampleCode);
    console.log('Validation result:', validation);

    // 优化提示词
    const samplePrompt = 'Create a button component...';
    const optimization = contextBuilder.validateAndOptimize(samplePrompt);
    console.log('Optimization result:', optimization);
  }

  /**
   * 示例10: 批量处理和性能监控
   */
  static async batchProcessing(): Promise<void> {
    const components = ['Button', 'Input', 'Card', 'Table', 'Form'];
    const results: string[] = [];

    // 批量生成组件提示词
    for (const component of components) {
      const startTime = Date.now();
      
      try {
        const prompt = contextBuilder.buildQuickContext(
          'component',
          component,
          [`创建 ${component} 组件`]
        );
        
        results.push(prompt);
        
        // 记录性能指标
        const responseTime = Date.now() - startTime;
        promptManager.recordUsage(component.toLowerCase(), true, responseTime);
        
        console.log(`Generated ${component} prompt in ${responseTime}ms`);
      } catch (error) {
        console.error(`Failed to generate ${component} prompt:`, error);
        promptManager.recordUsage(component.toLowerCase(), false, Date.now() - startTime);
      }
    }

    // 获取性能统计
    components.forEach(component => {
      const metrics = promptManager.getMetrics(component.toLowerCase());
      if (metrics) {
        console.log(`${component} metrics:`, metrics);
      }
    });
  }
}

/**
 * 运行所有示例
 */
export async function runAllExamples(): Promise<void> {
  console.log('=== 提示词系统使用示例 ===\n');

  try {
    // 示例1: Button 组件生成
    console.log('1. 生成 Button 组件提示词:');
    const buttonPrompt = await PromptExamples.generateButtonComponent();
    console.log(buttonPrompt.substring(0, 200) + '...\n');

    // 示例2: 仪表板页面生成
    console.log('2. 生成仪表板页面提示词:');
    const dashboardPrompt = await PromptExamples.generateDashboardPage();
    console.log(dashboardPrompt.substring(0, 200) + '...\n');

    // 示例3: 快速组件生成
    console.log('3. 快速生成 Input 组件提示词:');
    const quickPrompt = PromptExamples.generateQuickComponent('Input');
    console.log(quickPrompt.substring(0, 200) + '...\n');

    // 示例4: 代码调试
    console.log('4. 生成调试提示词:');
    const debugPrompt = PromptExamples.generateDebugPrompt(
      'const Button = () => <button>Click</button>',
      'TypeScript error: Missing props interface'
    );
    console.log(debugPrompt.substring(0, 200) + '...\n');

    // 示例5: 模板使用
    console.log('5. 使用模板生成提示词:');
    const templatePrompt = PromptExamples.generateFromTemplate();
    console.log(templatePrompt.substring(0, 200) + '...\n');

    // 示例6: 专家级上下文
    console.log('6. 生成专家级上下文:');
    const expertPrompt = await PromptExamples.generateExpertContext();
    console.log(expertPrompt.substring(0, 200) + '...\n');

    // 示例7: 版本管理
    console.log('7. 版本管理演示:');
    PromptExamples.demonstrateVersionManagement();
    console.log();

    // 示例8: 搜索和推荐
    console.log('8. 搜索和推荐演示:');
    PromptExamples.searchAndRecommend();
    console.log();

    // 示例9: 验证和优化
    console.log('9. 验证和优化演示:');
    PromptExamples.validateAndOptimize();
    console.log();

    // 示例10: 批量处理
    console.log('10. 批量处理演示:');
    await PromptExamples.batchProcessing();
    console.log();

    console.log('=== 所有示例运行完成 ===');
  } catch (error) {
    console.error('示例运行失败:', error);
  }
}

/**
 * 性能测试
 */
export async function performanceTest(): Promise<void> {
  console.log('=== 性能测试 ===\n');

  const iterations = 100;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    const prompt = contextBuilder.buildQuickContext(
      'component',
      'TestComponent',
      ['测试组件']
    );
    
    if (i % 10 === 0) {
      console.log(`完成 ${i + 1}/${iterations} 次生成`);
    }
  }

  const totalTime = Date.now() - startTime;
  const averageTime = totalTime / iterations;

  console.log(`\n性能测试结果:`);
  console.log(`总时间: ${totalTime}ms`);
  console.log(`平均时间: ${averageTime.toFixed(2)}ms`);
  console.log(`吞吐量: ${(1000 / averageTime).toFixed(2)} 次/秒`);

  // 缓存性能测试
  console.log('\n缓存性能测试:');
  const cacheStartTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    // 重复相同的请求以测试缓存效果
    contextBuilder.buildQuickContext(
      'component',
      'CachedComponent',
      ['缓存测试组件']
    );
  }

  const cacheTime = Date.now() - cacheStartTime;
  const cacheAverageTime = cacheTime / iterations;

  console.log(`缓存总时间: ${cacheTime}ms`);
  console.log(`缓存平均时间: ${cacheAverageTime.toFixed(2)}ms`);
  console.log(`缓存加速比: ${(averageTime / cacheAverageTime).toFixed(2)}x`);

  // 获取缓存统计
  const cacheStats = contextBuilder.getCacheStats();
  console.log('缓存统计:', cacheStats);
}