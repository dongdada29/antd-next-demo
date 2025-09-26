/**
 * 组件生成提示词
 * 针对不同类型组件的专用提示词
 */

export const COMPONENT_PROMPTS = {
  /**
   * 基础 UI 组件提示词
   */
  UI_COMPONENT: `请创建一个基础 UI 组件，要求：

**组件结构：**
- 使用 React.forwardRef 包装组件
- 设置 displayName 属性
- 支持 className 属性进行样式定制
- 使用 cva 定义组件变体和样式

**类型定义：**
- 继承相应的 HTML 元素属性
- 使用 VariantProps 定义变体类型
- 提供完整的 TypeScript 接口

**样式要求：**
- 使用 Tailwind CSS 实用类
- 实现响应式设计
- 支持暗色模式 (dark: 前缀)
- 使用设计系统的颜色和间距变量

**可访问性：**
- 添加适当的 ARIA 属性
- 支持键盘导航
- 确保颜色对比度符合标准
- 提供屏幕阅读器支持

请生成完整的组件代码，包括导入语句、类型定义、组件实现和导出语句。`,

  /**
   * 表单组件提示词
   */
  FORM_COMPONENT: `请创建一个表单组件，要求：

**表单架构：**
- 使用 React Hook Form 进行表单管理
- 使用 Zod 进行数据验证和类型推断
- 集成 shadcn/ui 表单组件 (Form, Input, Button 等)
- 实现实时验证和错误提示

**组件功能：**
- 支持不同的输入类型（文本、邮箱、密码、选择等）
- 实现字段验证和错误显示
- 提供加载状态和提交反馈
- 支持表单重置和数据预填充

**用户体验：**
- 清晰的错误提示信息
- 合理的表单布局和间距
- 响应式表单设计
- 键盘导航支持

**可访问性：**
- 正确的标签关联 (htmlFor)
- 错误信息与字段关联 (aria-describedby)
- 表单验证状态指示 (aria-invalid)
- 必填字段标识

请生成完整的表单组件，包括验证 schema、类型定义和组件实现。`,

  /**
   * 数据表格组件提示词
   */
  TABLE_COMPONENT: `请创建一个数据表格组件，要求：

**表格功能：**
- 使用 shadcn/ui Table 组件作为基础
- 集成 TanStack Table 进行数据管理
- 实现排序、筛选、分页功能
- 支持行选择和批量操作

**性能优化：**
- 实现虚拟滚动（适用于大数据集）
- 使用 React.memo 优化渲染性能
- 支持懒加载和分页
- 提供加载状态和骨架屏

**用户体验：**
- 响应式表格设计
- 清晰的排序和筛选指示
- 空状态和错误状态处理
- 可访问的表格导航

**可访问性：**
- 正确的表格语义 (table, thead, tbody)
- 列标题关联 (scope="col")
- 排序状态指示 (aria-sort)
- 键盘导航支持

请生成完整的表格组件，包括类型定义、列配置和组件实现。`,

  /**
   * 布局组件提示词
   */
  LAYOUT_COMPONENT: `请创建一个布局组件，要求：

**布局结构：**
- 使用语义化的 HTML 标签 (header, main, aside, footer)
- 实现灵活的网格或 Flexbox 布局
- 支持嵌套布局和组件组合
- 提供插槽 (slots) 支持

**响应式设计：**
- 移动优先的设计策略
- 合理的断点和布局调整
- 可折叠的侧边栏和导航
- 自适应的内容区域

**可访问性：**
- 正确的 landmark 角色
- 跳转链接 (skip links)
- 焦点管理和导航
- 屏幕阅读器友好

**性能考虑：**
- 避免不必要的重渲染
- 实现布局稳定性
- 优化 CLS (Cumulative Layout Shift)
- 支持懒加载内容

请生成完整的布局组件，包括类型定义、样式配置和组件实现。`,

  /**
   * 页面组件提示词
   */
  PAGE_COMPONENT: `请创建一个页面组件，要求：

**页面架构：**
- 使用 Next.js App Router 模式
- 实现适当的 SEO 优化 (metadata)
- 使用 React Server Components 和 Client Components
- 实现错误边界和加载状态

**布局设计：**
- 使用 shadcn/ui 组件构建界面
- 实现响应式布局设计
- 提供清晰的页面标题和导航
- 合理的内容组织和间距

**数据处理：**
- 使用 TanStack Query 进行数据获取
- 实现适当的缓存策略
- 处理加载、错误和空状态
- 提供数据验证和类型安全

**用户体验：**
- 流畅的页面转换
- 清晰的加载指示
- 友好的错误提示
- 直观的交互反馈

请生成完整的页面组件，包括 metadata 配置、组件实现和样式设计。`,

  /**
   * Hook 组件提示词
   */
  HOOK_COMPONENT: `请创建一个自定义 Hook，要求：

**Hook 设计：**
- 遵循 React Hooks 规则和约定
- 提供清晰的输入参数和返回值
- 实现适当的依赖管理和优化
- 支持 TypeScript 类型推断

**功能实现：**
- 封装复杂的状态逻辑
- 提供可复用的业务逻辑
- 实现副作用管理和清理
- 支持异步操作和错误处理

**性能优化：**
- 使用 useMemo 和 useCallback 优化
- 避免不必要的重新计算
- 实现适当的缓存策略
- 支持条件执行和懒加载

**测试友好：**
- 提供可测试的接口
- 支持模拟和存根
- 实现确定性的行为
- 提供调试信息

请生成完整的 Hook 代码，包括类型定义、实现逻辑和使用示例。`,

  /**
   * 工具函数提示词
   */
  UTILITY_COMPONENT: `请创建一个工具函数，要求：

**函数设计：**
- 纯函数设计，无副作用
- 提供清晰的输入输出类型
- 实现适当的参数验证
- 支持函数重载和泛型

**功能实现：**
- 解决特定的业务问题
- 提供可复用的通用逻辑
- 实现高效的算法和数据处理
- 支持链式调用和函数组合

**错误处理：**
- 提供清晰的错误信息
- 实现优雅的降级处理
- 支持错误恢复和重试
- 提供调试和日志功能

**文档和测试：**
- 提供完整的 JSDoc 注释
- 包含使用示例和边界情况
- 实现全面的单元测试
- 提供性能基准测试

请生成完整的工具函数代码，包括类型定义、实现逻辑和测试用例。`,
} as const;

/**
 * 获取组件提示词
 */
export function getComponentPrompt(
  type: keyof typeof COMPONENT_PROMPTS
): string {
  return COMPONENT_PROMPTS[type];
}

/**
 * 根据组件类型获取提示词
 */
export function getPromptByComponentType(componentType: string): string {
  const typeMap: Record<string, keyof typeof COMPONENT_PROMPTS> = {
    'ui': 'UI_COMPONENT',
    'form': 'FORM_COMPONENT',
    'table': 'TABLE_COMPONENT',
    'layout': 'LAYOUT_COMPONENT',
    'page': 'PAGE_COMPONENT',
    'hook': 'HOOK_COMPONENT',
    'utility': 'UTILITY_COMPONENT',
  };

  const promptKey = typeMap[componentType.toLowerCase()] || 'UI_COMPONENT';
  return COMPONENT_PROMPTS[promptKey];
}