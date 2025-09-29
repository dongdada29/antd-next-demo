# XAGI AI Template React Next App - 发布指南

## 概述

本指南详细说明如何发布 `@xagi/ai-template-react-next-app` 模板包到 npm 注册表。

## 发布前准备

### 1. 环境检查

确保您的开发环境满足以下要求：

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- npm 账户已登录 (`npm login`)

### 2. 版本管理

在发布前，确保版本号符合语义化版本规范：

```bash
# 检查当前版本
pnpm version:current

# 更新版本号
pnpm version:patch  # 补丁版本 (1.2.0 -> 1.2.1)
pnpm version:minor  # 次要版本 (1.2.0 -> 1.3.0)
pnpm version:major  # 主要版本 (1.2.0 -> 2.0.0)
```

### 3. 代码质量检查

发布前必须通过所有质量检查：

```bash
# 运行完整验证
pnpm validate:full

# 或分步检查
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

## 发布流程

### 1. 初始化模板配置

```bash
# 初始化模板配置（如果尚未完成）
pnpm template:init
```

这将创建 `template.json` 配置文件。

### 2. 验证模板

```bash
# 验证模板配置和文件结构
pnpm template:validate
```

验证包括：
- 配置文件完整性
- 必要文件存在性
- TypeScript 类型检查
- ESLint 代码检查
- 测试通过
- 构建成功

### 3. 打包模板

```bash
# 打包模板为 .tgz 文件
pnpm template:package
```

这将：
- 验证模板
- 创建 `.npmignore` 文件
- 使用 `npm pack` 打包
- 将包文件移动到 `dist/` 目录

### 4. 预览发布

```bash
# 预览发布（不实际发布）
pnpm template:publish:dry
```

这将执行完整的发布流程，但不会实际发布到 npm。

### 5. 正式发布

```bash
# 发布到 npm
pnpm template:publish
```

发布过程包括：
- 验证模板
- 打包模板
- 检查 npm 登录状态
- 检查版本是否已存在
- 发布到 npm
- 显示发布信息

### 6. 验证发布

发布完成后，验证包是否成功发布：

```bash
# 检查包信息
npm view @xagi/ai-template-react-next-app

# 测试安装
npx @xagi/ai-template-react-next-app@latest test-install
```

## 发布后操作

### 1. 更新文档

- 更新 `RELEASE_NOTES.md`
- 更新 `CHANGELOG.md`
- 更新 GitHub 仓库的 Releases

### 2. 通知用户

- 在项目讨论区发布更新通知
- 更新相关文档链接
- 通知依赖此模板的项目

### 3. 监控

- 监控 npm 下载统计
- 关注用户反馈和问题
- 收集使用数据

## 故障排除

### 常见问题

#### 1. npm 登录问题

```bash
# 检查登录状态
npm whoami

# 重新登录
npm login
```

#### 2. 版本冲突

```bash
# 检查已发布版本
npm view @xagi/ai-template-react-next-app versions --json

# 强制发布（谨慎使用）
pnpm template:publish --force
```

#### 3. 构建失败

```bash
# 清理并重新构建
pnpm clean
pnpm install
pnpm build
```

#### 4. 测试失败

```bash
# 运行特定测试
pnpm test:unit
pnpm test:integration
pnpm test:a11y
```

### 错误处理

如果发布过程中遇到错误：

1. **检查错误信息**：仔细阅读错误输出
2. **验证环境**：确保所有依赖正确安装
3. **清理缓存**：删除 `node_modules` 和锁文件，重新安装
4. **检查权限**：确保有发布到 `@xagi` 组织的权限
5. **联系支持**：如果问题持续，联系 XAGI 团队

## 自动化发布

### GitHub Actions

可以设置 GitHub Actions 来自动化发布流程：

```yaml
name: Publish Template

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Validate template
        run: pnpm template:validate
      
      - name: Publish to npm
        run: pnpm template:publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 版本标签

使用 Git 标签来管理版本：

```bash
# 创建版本标签
git tag v1.2.0
git push origin v1.2.0

# 删除标签（如果需要）
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0
```

## 最佳实践

### 1. 版本管理

- 遵循语义化版本规范
- 在发布前更新 `CHANGELOG.md`
- 使用有意义的提交信息

### 2. 质量保证

- 始终在发布前运行完整验证
- 确保所有测试通过
- 检查代码覆盖率

### 3. 文档更新

- 及时更新 README
- 维护准确的 API 文档
- 提供清晰的迁移指南

### 4. 用户支持

- 及时响应用户问题
- 提供详细的使用示例
- 维护活跃的社区

## 联系支持

如果在发布过程中遇到问题，可以通过以下方式获得支持：

- 📧 邮箱: support@xagi.ai
- 💬 GitHub Discussions: [项目讨论区](https://github.com/xagi/ai-template-react-next-app/discussions)
- 🐛 GitHub Issues: [问题报告](https://github.com/xagi/ai-template-react-next-app/issues)

---

**祝您发布顺利！** 🚀
