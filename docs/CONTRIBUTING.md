# 贡献指南

欢迎为 AI Agent 编码模板项目做出贡献！本指南将帮助您了解如何参与项目开发，包括代码贡献、文档改进、问题报告等。

## 目录

- [开始之前](#开始之前)
- [开发环境设置](#开发环境设置)
- [贡献类型](#贡献类型)
- [代码贡献流程](#代码贡献流程)
- [代码规范](#代码规范)
- [测试指南](#测试指南)
- [文档贡献](#文档贡献)
- [问题报告](#问题报告)
- [功能请求](#功能请求)
- [社区准则](#社区准则)

## 开始之前

### 行为准则

参与本项目即表示您同意遵守我们的[行为准则](CODE_OF_CONDUCT.md)。我们致力于为所有人提供友好、安全和包容的环境。

### 许可证

通过贡献代码，您同意您的贡献将在 [MIT 许可证](LICENSE) 下发布。

## 开发环境设置

### 系统要求

- Node.js 18.0 或更高版本
- npm 9.0 或更高版本
- Git

### 安装步骤

1. **Fork 项目**
   ```bash
   # 在 GitHub 上 fork 项目到您的账户
   ```

2. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/ai-coding-template.git
   cd ai-coding-template
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **设置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件，添加必要的环境变量
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **运行测试**
   ```bash
   npm test
   ```

### 开发工具配置

#### VS Code 设置

推荐安装以下扩展：

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss"
  ]
}
```

#### Git Hooks

项目使用 Husky 和 lint-staged 进行代码质量检查：

```bash
# 安装 Git hooks
npm run prepare
```

## 贡献类型

我们欢迎以下类型的贡献：

### 🐛 Bug 修复
- 修复现有功能的问题
- 改进错误处理
- 性能优化

### ✨ 新功能
- 添加新的 AI 提示词模板
- 开发新的组件或工具
- 改进用户体验

### 📚 文档改进
- 更新 API 文档
- 添加使用示例
- 翻译文档

### 🧪 测试
- 添加单元测试
- 改进测试覆盖率
- 添加集成测试

### 🎨 设计和 UI
- 改进界面设计
- 优化用户体验
- 添加新的组件样式

## 代码贡献流程

### 1. 创建分支

```bash
# 从 main 分支创建新分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 或者修复 bug
git checkout -b fix/bug-description
```

### 2. 开发和测试

```bash
# 进行开发
# ...

# 运行测试
npm test

# 运行 linting
npm run lint

# 运行类型检查
npm run type-check
```

### 3. 提交代码

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 添加文件
git add .

# 提交（使用规范的提交信息）
git commit -m "feat: add new AI prompt template for forms"
git commit -m "fix: resolve TypeScript error in component generator"
git commit -m "docs: update API documentation"
```

#### 提交信息格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型 (type):**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

**示例:**
```
feat(ai): add support for custom prompt templates

- Add PromptTemplate interface
- Implement template validation
- Add tests for template system

Closes #123
```

### 4. 推送和创建 Pull Request

```bash
# 推送分支
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

### Pull Request 要求

- **标题**: 清晰描述变更内容
- **描述**: 详细说明变更原因和实现方式
- **关联 Issue**: 如果相关，请关联相关的 Issue
- **测试**: 确保所有测试通过
- **文档**: 如果需要，更新相关文档

#### Pull Request 模板

```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 变更描述
简要描述此 PR 的变更内容...

## 相关 Issue
Closes #(issue number)

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 所有 CI 检查通过
```

## 代码规范

### TypeScript 规范

```typescript
// ✅ 推荐
interface ComponentProps {
  title: string;
  description?: string;
  onAction: (id: string) => void;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  description, 
  onAction 
}) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// ❌ 不推荐
const Component = (props: any) => {
  return <div>{props.title}</div>;
};
```

### React 组件规范

```typescript
// ✅ 推荐的组件结构
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

/**
 * Button 组件
 * 
 * @param variant - 按钮变体
 * @param size - 按钮大小
 * @param asChild - 是否作为子元素渲染
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
```

### 样式规范

```typescript
// ✅ 使用 Tailwind CSS 类
<div className="flex items-center justify-between p-4 bg-background border rounded-lg">
  <h3 className="text-lg font-semibold">标题</h3>
  <Button variant="outline" size="sm">操作</Button>
</div>

// ❌ 避免内联样式
<div style={{ display: 'flex', padding: '16px' }}>
  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>标题</h3>
</div>
```

### 文件命名规范

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx          # kebab-case
│   │   └── data-table.tsx
│   └── forms/
│       └── contact-form.tsx
├── lib/
│   ├── utils.ts
│   └── ai-helpers.ts
└── types/
    └── api-types.ts
```

## 测试指南

### 单元测试

```typescript
// components/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
```

### 集成测试

```typescript
// __tests__/integration/ai-generation.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIGenerationDemo } from '@/components/examples/ai-generation-demo';

describe('AI Generation Integration', () => {
  it('generates component code successfully', async () => {
    render(<AIGenerationDemo />);
    
    // 输入提示
    const input = screen.getByPlaceholderText('输入组件描述...');
    await userEvent.type(input, 'Button component');
    
    // 点击生成按钮
    const generateButton = screen.getByRole('button', { name: '生成代码' });
    await userEvent.click(generateButton);
    
    // 等待生成完成
    await waitFor(() => {
      expect(screen.getByText(/生成成功/)).toBeInTheDocument();
    });
    
    // 验证生成的代码
    expect(screen.getByText(/const Button/)).toBeInTheDocument();
  });
});
```

### 测试命令

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test button.test.tsx

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 文档贡献

### 文档类型

1. **API 文档**: 组件和函数的使用说明
2. **教程**: 分步指导和示例
3. **指南**: 最佳实践和设计原则
4. **参考**: 配置选项和技术规范

### 文档写作规范

```markdown
# 组件名称

简要描述组件的用途和功能。

## 安装

\`\`\`bash
npm install @/components/ui/button
\`\`\`

## 使用方法

\`\`\`tsx
import { Button } from '@/components/ui/button';

export default function Example() {
  return (
    <Button variant="default" size="lg">
      点击我
    </Button>
  );
}
\`\`\`

## API 参考

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | 'default' \| 'secondary' \| 'outline' | 'default' | 按钮变体 |
| size | 'default' \| 'sm' \| 'lg' | 'default' | 按钮大小 |
| disabled | boolean | false | 是否禁用 |

### 示例

#### 基础用法
\`\`\`tsx
<Button>默认按钮</Button>
\`\`\`

#### 不同变体
\`\`\`tsx
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
\`\`\`
```

## 问题报告

### 报告 Bug

使用 [Bug 报告模板](https://github.com/your-repo/issues/new?template=bug_report.md) 创建 Issue：

```markdown
**Bug 描述**
清晰简洁地描述 bug。

**重现步骤**
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
描述您期望发生的情况。

**实际行为**
描述实际发生的情况。

**截图**
如果适用，添加截图来帮助解释您的问题。

**环境信息**
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 95.0]
- Node.js: [e.g. 18.0.0]
- 项目版本: [e.g. 1.0.0]

**附加信息**
添加任何其他相关信息。
```

### 安全问题

如果您发现安全漏洞，请不要公开报告。请发送邮件至 security@example.com。

## 功能请求

使用 [功能请求模板](https://github.com/your-repo/issues/new?template=feature_request.md)：

```markdown
**功能描述**
清晰简洁地描述您想要的功能。

**问题描述**
描述这个功能要解决的问题。

**解决方案**
描述您希望的解决方案。

**替代方案**
描述您考虑过的任何替代解决方案或功能。

**附加信息**
添加任何其他相关信息或截图。
```

## 社区准则

### 沟通原则

- **友善和尊重**: 对所有参与者保持友善和尊重
- **建设性反馈**: 提供有建设性的反馈和建议
- **耐心**: 对新贡献者保持耐心
- **包容性**: 欢迎不同背景和经验水平的贡献者

### 代码审查

#### 作为审查者

- 提供具体、可操作的反馈
- 解释"为什么"而不仅仅是"什么"
- 认可好的代码和改进
- 保持友善和专业的语调

#### 作为被审查者

- 对反馈保持开放态度
- 及时回应审查意见
- 解释设计决策的原因
- 感谢审查者的时间和努力

### 获得帮助

如果您需要帮助：

1. **查看文档**: 首先查看现有文档和 FAQ
2. **搜索 Issues**: 查看是否有类似的问题已经被讨论
3. **创建 Issue**: 如果找不到答案，创建新的 Issue
4. **社区讨论**: 参与 GitHub Discussions
5. **联系维护者**: 通过邮件联系项目维护者

## 发布流程

### 版本管理

项目使用 [语义化版本](https://semver.org/)：

- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向后兼容的功能新增
- **PATCH**: 向后兼容的问题修正

### 发布检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号已更新
- [ ] 创建 Git 标签
- [ ] 发布到 npm（如适用）

## 致谢

感谢所有为项目做出贡献的开发者！您的贡献使这个项目变得更好。

### 贡献者

- [贡献者列表](https://github.com/your-repo/graphs/contributors)

### 特别感谢

- shadcn/ui 团队提供的优秀组件库
- Tailwind CSS 团队的出色工作
- React 和 Next.js 社区的持续支持

---

再次感谢您的贡献！如果您有任何问题，请随时联系我们。