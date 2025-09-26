# AI Agent 通用配置指南

本项目为各种 AI Agent 配置了结构化的开发工作流程，通过 slash commands 实现规范化的 AI 辅助开发。

## 🤖 支持的 AI Agent

| Agent | 支持状态 | 优势场景 | 配置文件 |
|-------|---------|----------|----------|
| Claude Code | ✅ 完全支持 | 复杂架构设计、详细分析 | claude.md |
| GitHub Copilot | ✅ 支持 | 快速代码生成、模式识别 | 本文件 |
| Cursor | ✅ 支持 | 实时编辑、上下文理解 | 本文件 |
| Windsurf | ✅ 支持 | 多文件协作、项目管理 | 本文件 |
| Gemini CLI | ✅ 支持 | 多模态分析、代码理解 | 本文件 |
| Codex CLI | ⚠️ 部分支持 | 快速补全、简单任务 | 本文件 |

## 🚀 可用的 Slash Commands

### 基础设置命令

#### `/constitution`
**建立项目治理原则和开发指导方针**
- **用途**: 创建项目的核心原则、编码规范、架构指导
- **输出**: `.ai/memory/constitution.md`
- **推荐 Agent**: Claude Code, Gemini CLI
- **示例**:
```
/constitution

为这个 Next.js + shadcn/ui 项目建立开发规范：
- 使用 TypeScript 严格模式
- 遵循 WCAG 2.1 AA 可访问性标准  
- 强制使用 pnpm 包管理
- 组件必须支持 forwardRef 和 className
- 优先使用 Tailwind CSS，避免自定义 CSS
- 实现响应式设计和暗色模式支持
```

### 需求分析命令

#### `/specify`
**定义功能需求和用户故事**
- **用途**: 创建详细的功能规格说明
- **前置条件**: `/constitution`
- **输出**: `specs/{feature-id}/requirements.md`
- **推荐 Agent**: Claude Code, Gemini CLI
- **示例**:
```
/specify

创建一个用户管理系统，包含以下功能：
- 用户列表展示（支持分页、搜索、筛选）
- 用户信息的增删改查
- 角色权限管理
- 批量操作功能
- 导入导出用户数据
- 用户状态管理（启用/禁用）

重点关注：
- 企业级数据安全要求
- 响应式设计支持
- 可访问性合规
- 高性能数据处理
```

#### `/clarify`
**澄清未明确的需求领域**
- **用途**: 通过结构化问答澄清模糊需求
- **前置条件**: `/specify`
- **输出**: `specs/{feature-id}/clarifications.md`
- **推荐 Agent**: Claude Code, Gemini CLI
- **示例**:
```
/clarify

请帮我澄清用户管理系统的以下方面：
- 用户权限的具体层级和范围
- 数据验证规则和错误处理策略
- UI 交互模式和用户体验要求
- 性能指标和扩展性需求
```

### 设计和规划命令

#### `/design`
**创建技术设计和架构方案**
- **用途**: 设计系统架构、组件结构、数据流
- **前置条件**: `/specify`, `/clarify`
- **输出**: `specs/{feature-id}/design.md`
- **推荐 Agent**: Claude Code, Windsurf
- **示例**:
```
/design

基于用户管理系统需求，设计：
- 组件架构和层次结构
- 状态管理策略（使用 Zustand）
- API 接口设计
- 数据模型和类型定义
- 路由和导航结构
- 错误处理和加载状态管理
```

#### `/plan`
**制定技术实施计划**
- **用途**: 选择技术栈，制定实施策略
- **前置条件**: `/design`
- **输出**: `specs/{feature-id}/implementation-plan.md`, `specs/{feature-id}/tech-stack.md`
- **推荐 Agent**: Claude Code, Windsurf
- **示例**:
```
/plan

为用户管理系统制定实施计划：

技术栈：
- 前端：Next.js 14 + TypeScript + shadcn/ui + Tailwind CSS
- 状态管理：Zustand + TanStack Query
- 表单：React Hook Form + Zod
- 测试：Vitest + React Testing Library
- 包管理：pnpm

实施策略：
- 采用组件驱动开发
- 实现渐进式功能交付
- 确保测试驱动开发
- 优先考虑性能和可访问性
```

#### `/tasks`
**生成可执行的任务列表**
- **用途**: 将计划分解为具体的开发任务
- **前置条件**: `/plan`
- **输出**: `specs/{feature-id}/tasks.md`
- **推荐 Agent**: Claude Code, Windsurf
- **示例**:
```
/tasks

将用户管理系统分解为具体的开发任务：
- 按优先级排序
- 包含预估工作量
- 明确任务依赖关系
- 指定验收标准
- 包含测试要求
```

### 验证和分析命令

#### `/analyze`
**跨制品一致性和覆盖率分析**
- **用途**: 验证需求、设计、任务的一致性
- **前置条件**: `/tasks`
- **输出**: `specs/{feature-id}/analysis.md`
- **推荐 Agent**: Claude Code, Gemini CLI
- **示例**:
```
/analyze

分析用户管理系统的：
- 需求覆盖完整性
- 设计与需求的一致性
- 任务与设计的对应关系
- 潜在风险和依赖问题
- 测试覆盖率评估
```

### 实施命令

#### `/implement`
**执行所有任务构建功能**
- **用途**: 根据任务列表实施完整功能
- **前置条件**: `/tasks`, `/analyze`
- **输出**: 完整的代码实现
- **推荐 Agent**: 所有 Agent
- **示例**:
```
/implement

开始实施用户管理系统：
- 按任务优先级顺序执行
- 确保每个任务完成后进行验证
- 生成相应的测试用例
- 创建使用文档
- 进行性能优化
```

### 快速开发命令

#### `/component`
**快速生成单个组件**
- **用途**: 快速创建独立组件
- **推荐 Agent**: GitHub Copilot, Cursor, Codex
- **示例**:
```
/component --name UserCard --type display

创建用户卡片组件：
- 显示用户头像、姓名、邮箱、角色
- 支持不同尺寸变体
- 包含操作按钮（编辑、删除）
- 响应式设计
- 完整的 TypeScript 类型
- 可访问性支持
```

#### `/fix`
**快速修复代码问题**
- **用途**: 修复 TypeScript 错误、ESLint 警告等
- **推荐 Agent**: GitHub Copilot, Cursor, Codex
- **示例**:
```
/fix

修复以下问题：
- TypeScript 类型错误
- ESLint 规则违反
- 组件渲染问题
- 性能警告
- 可访问性问题
```

#### `/refactor`
**重构和优化现有代码**
- **用途**: 改进代码结构和性能
- **推荐 Agent**: Claude Code, Cursor, Windsurf
- **示例**:
```
/refactor --target UserList

重构 UserList 组件：
- 提取可复用的子组件
- 优化渲染性能
- 改进状态管理
- 增强类型安全
- 提升可维护性
```

#### `/test`
**生成测试用例**
- **用途**: 为组件和功能生成测试
- **推荐 Agent**: Claude Code, Gemini CLI
- **示例**:
```
/test --component UserCard

为 UserCard 组件生成测试：
- 渲染测试
- 用户交互测试
- 边界条件测试
- 可访问性测试
- 性能测试
```

#### `/docs`
**生成文档和使用指南**
- **用途**: 创建 API 文档和使用说明
- **推荐 Agent**: Claude Code, Gemini CLI
- **示例**:
```
/docs --component UserCard

为 UserCard 组件生成文档：
- API 接口说明
- 使用示例
- 最佳实践
- 常见问题解答
- 设计指南
```

## 🔄 推荐工作流程

### 完整功能开发流程
```
/constitution → /specify → /clarify → /design → /plan → /tasks → /analyze → /implement
```

### 快速组件开发流程
```
/component → /test → /docs
```

### 维护和优化流程
```
/fix → /refactor → /test
```

## 🎯 AI Agent 选择指南

### 复杂任务 (推荐: Claude Code, Gemini CLI)
- 架构设计和系统分析
- 详细需求分析和澄清
- 全面测试策略制定
- 技术文档编写
- 复杂代码重构

### 快速开发 (推荐: GitHub Copilot, Cursor, Codex)
- 快速代码生成和补全
- 简单问题修复
- 模式识别和复制
- 基础组件实现
- 重复性任务自动化

### 协作开发 (推荐: Windsurf, Cursor)
- 多文件协调编辑
- 实时代码协作
- 项目管理和跟踪
- 团队开发支持

## 📋 Agent 特定配置

### GitHub Copilot
```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.advanced": {
    "length": 500,
    "temperature": 0.1
  }
}
```

### Cursor
```json
{
  "cursor.cpp.enableIntelliSense": true,
  "cursor.general.enableCodeActions": true,
  "cursor.chat.enableCodeContext": true
}
```

### Windsurf
```json
{
  "windsurf.ai.model": "claude-3-sonnet",
  "windsurf.ai.temperature": 0.2,
  "windsurf.collaboration.enabled": true
}
```

## 🔧 环境配置

### 环境变量
```bash
# 指定特定功能目录（非 Git 仓库时使用）
export SPECIFY_FEATURE=001-user-management

# AI Agent 类型
export AI_AGENT_TYPE=copilot  # 或 cursor, windsurf, gemini, codex

# 模型偏好设置
export AI_MODEL_PREFERENCE=claude  # 或 codex, gemini
```

### 项目配置文件
- `.ai/settings/models.json` - AI 模型配置
- `.ai/settings/workflow.json` - 工作流程配置
- `.ai/prompts/` - 优化提示词模板
- `components.json` - shadcn/ui 配置
- `package.json` - 项目依赖和脚本

## 📊 性能监控

使用内置的性能监控工具：
```bash
# 记录开发会话
pnpm ai:monitor record copilot component

# 生成性能报告
pnpm ai:report

# 获取优化建议
pnpm ai:optimize --task component --complexity medium
```

## 🚨 注意事项

### 通用注意事项
1. **命令执行顺序**: 遵循前置条件，确保工作流程的连贯性
2. **文件管理**: slash commands 会自动创建和管理相关文件
3. **Git 集成**: 系统会自动创建功能分支和提交记录
4. **质量保证**: 每个阶段都包含验证和检查机制

### Agent 特定限制
- **Codex CLI**: 不支持自定义参数的 slash commands
- **GitHub Copilot**: 主要用于代码补全，复杂分析能力有限
- **Cursor**: 需要在编辑器环境中使用
- **Windsurf**: 需要团队协作环境配置

## 🔗 相关资源

- [Claude Code 专用配置](./claude.md)
- [AI 优化指南](../docs/optimization-guide.md)
- [组件模式指南](../docs/component-patterns.md)
- [编码标准](../docs/coding-standards.md)

通过这套 slash commands 系统，各种 AI Agent 都可以提供结构化、高效的 AI 辅助开发体验。