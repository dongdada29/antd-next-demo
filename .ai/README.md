# AI Agent 配置目录

本目录包含项目的 AI Agent 配置文件和相关资源。

## 目录结构

```
.ai/
├── README.md                 # 本文件
├── agents/                   # AI Agent 配置
│   ├── claude.md            # Claude Code 配置
│   ├── copilot.md           # GitHub Copilot 配置
│   ├── cursor.md            # Cursor 配置
│   └── general.md           # 通用 Agent 配置
├── prompts/                 # 提示词模板
│   ├── claude-optimized.md # Claude 优化提示词
│   ├── codex-optimized.md  # Codex 优化提示词
│   └── component-prompts.ts # 组件生成提示词
├── templates/               # 代码模板
│   ├── component.template.tsx
│   ├── page.template.tsx
│   ├── hook.template.ts
│   └── test.template.tsx
├── settings/                # AI 配置文件
│   ├── models.json         # AI 模型配置
│   ├── workflow.json       # 工作流配置
│   └── performance.json    # 性能监控配置
├── docs/                    # AI 相关文档
│   ├── optimization-guide.md
│   ├── best-practices.md
│   └── troubleshooting.md
└── memory/                  # AI 记忆和上下文
    ├── constitution.md      # 项目治理原则
    ├── patterns.md         # 代码模式
    └── decisions.md        # 架构决策记录
```

## 使用说明

### 1. AI Agent 配置
- 每个 AI Agent 都有对应的配置文件
- 包含 slash commands、最佳实践、使用指南

### 2. 提示词管理
- 针对不同 AI 模型优化的提示词
- 可复用的组件生成模板
- 任务特定的指导说明

### 3. 代码模板
- 标准化的代码生成模板
- 支持变量替换和自定义
- 确保代码一致性

### 4. 配置管理
- AI 模型选择和优化配置
- 工作流程定义
- 性能监控设置

## 快速开始

1. 查看对应的 AI Agent 配置文件
2. 根据任务类型选择合适的提示词
3. 使用 slash commands 进行结构化开发
4. 监控和优化 AI 使用效果

## 相关命令

```bash
# AI 模型优化
pnpm ai:claude --task component    # 使用 Claude 优化模式
pnpm ai:codex --task fix          # 使用 Codex 快速模式
pnpm ai:optimize --task refactor  # 获取模型选择建议

# 性能监控
pnpm ai:report                    # 生成 AI 性能报告
pnpm ai:monitor record claude component  # 记录开发会话
```

## 贡献指南

1. 新增 AI Agent 支持时，在 `agents/` 目录添加对应配置
2. 优化提示词时，更新 `prompts/` 目录中的模板
3. 改进代码模板时，修改 `templates/` 目录中的文件
4. 更新配置时，同步修改 `settings/` 目录中的 JSON 文件