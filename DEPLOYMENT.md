# 部署和监控方案

## 概述

本项目采用现代化的容器化部署方案，集成了完整的监控、日志收集和 CI/CD 流水线。

## 架构组件

### 1. 应用层
- **Next.js 应用**: 主要的 Web 应用
- **Redis**: 缓存和会话存储
- **Nginx**: 反向代理和负载均衡

### 2. 监控层
- **Prometheus**: 指标收集和存储
- **Grafana**: 可视化仪表板
- **Loki**: 日志聚合
- **Promtail**: 日志收集代理

### 3. CI/CD 流水线
- **GitHub Actions**: 自动化构建、测试和部署
- **Docker**: 容器化打包
- **安全扫描**: Trivy 漏洞扫描
- **性能测试**: Lighthouse CI

## 快速开始

### 本地开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 类型检查
npm run type-check
```

### Docker 部署

```bash
# 构建镜像
docker build -t antd-next-demo .

# 运行容器
docker run -p 3000:3000 antd-next-demo

# 或使用 docker-compose
docker-compose up -d
```

### 生产环境部署

```bash
# 启动完整的监控栈
docker-compose -f docker-compose.yml up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
```

## 监控和观测

### 访问地址

- **应用**: http://localhost:3000
- **Grafana**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **健康检查**: http://localhost:3000/api/health
- **指标端点**: http://localhost:3000/api/metrics

### 关键指标

#### 应用性能指标
- **响应时间**: HTTP 请求处理时间
- **吞吐量**: 每秒请求数 (RPS)
- **错误率**: 4xx/5xx 错误百分比
- **可用性**: 服务正常运行时间

#### 系统资源指标
- **CPU 使用率**: 处理器负载
- **内存使用**: 堆内存和总内存使用
- **磁盘 I/O**: 读写操作性能
- **网络流量**: 入站和出站流量

#### 业务指标
- **活跃用户数**: 当前在线用户
- **页面访问量**: PV/UV 统计
- **转化率**: 关键业务流程完成率
- **用户体验**: Core Web Vitals

### 告警规则

#### 高优先级告警
- 应用不可用 (健康检查失败)
- 错误率超过 5%
- 响应时间超过 2 秒
- CPU 使用率超过 80%
- 内存使用率超过 85%

#### 中优先级告警
- 磁盘使用率超过 80%
- 网络延迟超过 100ms
- 缓存命中率低于 80%

## 性能优化

### 构建优化
- **代码分割**: 按路由和组件分割
- **Tree Shaking**: 移除未使用代码
- **压缩**: Gzip/Brotli 压缩
- **缓存**: 静态资源长期缓存

### 运行时优化
- **懒加载**: 组件和图片懒加载
- **预加载**: 关键资源预加载
- **缓存策略**: Redis 缓存热点数据
- **CDN**: 静态资源 CDN 分发

### 数据库优化
- **连接池**: 数据库连接复用
- **查询优化**: SQL 查询性能调优
- **索引**: 合理的数据库索引
- **读写分离**: 主从数据库架构

## 安全措施

### 应用安全
- **HTTPS**: 强制 SSL/TLS 加密
- **CSP**: 内容安全策略
- **CORS**: 跨域资源共享控制
- **Rate Limiting**: 请求频率限制

### 容器安全
- **非 root 用户**: 容器内使用非特权用户
- **最小镜像**: 使用 Alpine 基础镜像
- **漏洞扫描**: Trivy 安全扫描
- **镜像签名**: 容器镜像完整性验证

### 网络安全
- **防火墙**: 网络访问控制
- **VPN**: 管理访问通过 VPN
- **日志审计**: 访问日志记录和分析

## 故障排查

### 常见问题

#### 应用启动失败
```bash
# 检查容器日志
docker-compose logs app

# 检查健康状态
curl http://localhost:3000/api/health

# 检查资源使用
docker stats
```

#### 性能问题
```bash
# 查看 Prometheus 指标
curl http://localhost:3000/api/metrics

# 分析 Grafana 仪表板
# 访问 http://localhost:3001

# 运行性能测试
npm run build
npx lighthouse http://localhost:3000
```

#### 内存泄漏
```bash
# 生成堆快照
kill -USR2 <node_process_id>

# 分析内存使用
node --inspect app.js
```

### 日志分析

#### 应用日志
- **位置**: `/var/log/app/`
- **格式**: JSON 结构化日志
- **级别**: ERROR, WARN, INFO, DEBUG

#### 访问日志
- **Nginx**: `/var/log/nginx/access.log`
- **格式**: Combined Log Format
- **分析**: 使用 Grafana 仪表板

#### 错误日志
- **应用错误**: 自动上报到监控系统
- **系统错误**: 通过 Promtail 收集
- **告警**: 自动触发 Slack 通知

## 扩展和维护

### 水平扩展
```bash
# 增加应用实例
docker-compose up -d --scale app=3

# 配置负载均衡
# 更新 nginx.conf 配置
```

### 垂直扩展
```bash
# 调整资源限制
# 修改 docker-compose.yml 中的 resources 配置
```

### 数据备份
```bash
# Redis 数据备份
docker exec redis redis-cli BGSAVE

# 应用数据备份
# 根据实际数据存储方案制定备份策略
```

### 版本更新
```bash
# 滚动更新
docker-compose pull
docker-compose up -d --no-deps app

# 回滚
docker-compose down
docker-compose up -d
```

## 成本优化

### 资源优化
- **自动伸缩**: 根据负载自动调整实例数
- **资源限制**: 合理设置 CPU/内存限制
- **定时任务**: 非高峰期缩减资源

### 存储优化
- **日志轮转**: 定期清理旧日志
- **镜像清理**: 删除未使用的 Docker 镜像
- **数据压缩**: 启用数据压缩存储

## 合规和审计

### 数据保护
- **GDPR**: 用户数据保护合规
- **数据加密**: 敏感数据加密存储
- **访问控制**: 基于角色的访问控制

### 审计日志
- **操作记录**: 管理操作审计
- **访问日志**: 用户访问记录
- **变更追踪**: 配置变更历史

## 联系和支持

- **技术支持**: tech-support@example.com
- **运维团队**: devops@example.com
- **紧急联系**: +86-xxx-xxxx-xxxx

---

更多详细信息请参考各组件的官方文档：
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Prometheus 监控指南](https://prometheus.io/docs/guides/)
- [Grafana 配置文档](https://grafana.com/docs/)