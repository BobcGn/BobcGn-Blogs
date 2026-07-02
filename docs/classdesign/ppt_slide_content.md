# 《个人博客网站的设计与实现》— PPT 幻灯片内容稿

---

## Slide 1: 封面

### 个人博客网站的设计与实现
#### —— 基于 JAMstack 架构的数字花园知识管理系统

| | |
|:---|:---|
| 🎓 课程 | 小学期实践项目 |
| 👤 作者 | BobcGn |
| 🛠 技术栈 | Obsidian · Quartz v4 · TypeScript · Preact · GitHub Actions |
| 📦 架构范式 | JAMstack · Git-backed CMS · Serverless |

---

## Slide 2: 痛点分析 — 为什么不用传统动态博客？

### 传统 MVC 架构（WordPress / LAMP）的三大病灶

| 痛点 | 传统方案 | 问题 |
|:---|:---|:---|
| 🔧 **维护成本** | 服务器 + PHP + MySQL 多层运维 | 任一组件故障即全线不可用 |
| 🛡 **安全风险** | SQL 注入、插件漏洞（WPScan 2025：插件漏洞占比 97%） | 攻击面随插件增长线性扩张 |
| ⚡ **性能瓶颈** | 每次请求：路由 → 查询 → 渲染 → 拼接 | 高并发下 TTFB 飙升至 2000ms+ |

> **结论：** 中心化架构 = 高运维 × 高风险 × 低性能

---

## Slide 3: 核心理念 — 从"流水账"到"数字花园"

### Digital Garden ≠ 传统博客

| 传统博客 | 数字花园 |
|:---|:---|
| 时间线排列，写完即归档 | 网状链接，持续生长 |
| 一次性发布 | 迭代更新，越写越密 |
| 单向阅读 | 知识互联，可视化探索 |

### 本项目的双域解耦设计

```
┌──────────────────────┐          ┌──────────────────────┐
│   Obsidian 私密笔记库  │  rsync   │   Quartz 公开博客站   │
│   (闭源 · 本地创作)    │ ──────> │   (开源 · 云端展示)   │
│   创作域 = 安全边界     │  单向流   │   发布域 = CDN 分发   │
└──────────────────────┘          └──────────────────────┘
```

- ✅ 创作过程完全私密，草稿永不泄露
- ✅ 公开发布仅含显式同步的内容

---

## Slide 4: 技术选型与整体架构（JAMstack）

### JAMstack 三层解耦架构

| 层级 | 职责 | 技术栈 |
|:---|:---|:---|
| 📝 **内容创作层** | Markdown 编写 + `[[wikilink]]` 双向链接 | Obsidian |
| 🔨 **编译构建层** | AST 解析 → HTML/CSS/JS 静态生成 | Quartz v4 / TypeScript / Preact |
| 🌐 **托管分发层** | 全球 CDN 边缘节点分发 | GitHub Pages + Fastly CDN |

[图表建议：画一张三层横向堆叠的架构图，左侧 Obsidian，中间 GitHub Actions 构建管道，右侧 CDN 到终端用户]

### 关键配置

- `Plugin.ObsidianFlavoredMarkdown()` — wikilink / callout / Mermaid / LaTeX
- `Plugin.CrawlLinks()` — `"shortest"` 路径策略 + 知识图谱拓扑构建
- `Plugin.RemoveDrafts()` — `draft: true` 文章构建期过滤

---

## Slide 5: 系统核心工作流（CI/CD Pipeline）

### "git push 即发布" — 全自动三阶段流水线

```
Obsidian 编辑
    │
    ▼
rsync 同步 ──────> git push (main)
                      │
                      ▼
              ┌─────────────────┐
              │  GitHub Actions  │
              │                 │
              │  ① build        │  npm ci → npx quartz build
              │  ② deploy       │  upload-pages-artifact
              │  ③ release      │  gh release create (可选)
              └────────┬────────┘
                       │
                       ▼
               GitHub Pages CDN
               (全球边缘分发)
```

| 关键配置 | 值 | 意义 |
|:---|:---|:---|
| `npm ci`（非 install） | 精确依赖安装 | 构建幂等性，可重复 |
| `cancel-in-progress: false` | 不中断部署 | 保证每次部署完整原子 |
| `fetch-depth: 0` | 完整 Git 历史 | 支持 diff 提取变更文件 |

---

## Slide 6: 核心技术挑战 — 静态站如何做动态交互？

### 架构矛盾

```
┌───────────────────────────────┐
│  JAMstack 纯静态站点           │
│  ✗ 无运行时服务器              │
│  ✗ 无关系型数据库              │
│  ✗ 无 Session 管理             │
└───────────────────────────────┘
              vs.
┌───────────────────────────────┐
│  任务书功能要求                │
│  ✓ 用户注册登录（OAuth）       │
│  ✓ 互动评论功能               │
│  ✓ 数据持久化                 │
└───────────────────────────────┘
```

> **核心问题：** 在零后端、零数据库的约束下，如何安全地实现鉴权与评论？

---

## Slide 7: 破局方案 — Serverless 双轨制互动架构 ⭐

### 高光方案：数据物理隔离 + OAuth 2.0 安全鉴权

| | 轨道一：Giscus 评论 | 轨道二：Issue Forms |
|:---|:---|:---|
| **用途** | 日常技术交流 | Bug 报告 / 功能建议 |
| **数据存储** | GitHub Discussions | GitHub Issues |
| **鉴权方式** | OAuth 2.0（GitHub 账号） | OAuth 2.0（GitHub 账号） |
| **结构化程度** | Markdown 自由评论 | Issue Form 模板（标题/分类/描述） |
| **用户路径** | 点击登录 → 评论 → 自动归档 | 点击按钮 → 填表 → 自动创建 Issue |

[图表建议：画左右双轨流程图，左侧 Giscus 走向 Discussions，右侧 Issue 走向 Issues，顶部共用 OAuth 2.0 鉴权入口]

### 安全分析 — OAuth 2.0 零凭据暴露

```
用户浏览器 ──①──> GitHub 授权页 (github.com)
                  │ 密码仅在 github.com 域内传输
                  │
                  ├──②──> Giscus 后端 (client_secret 交换)
                  │        │ 前端代码不含任何密钥
                  │
                  └──③──> 评论写入 GitHub API
                           │ 以用户身份 POST，受 GitHub 权限管控
```

---

## Slide 8: 质量保障与测试

### 三重验证体系

| 测试维度 | 方法 | 结果 |
|:---|:---|:---|
| 🔗 **静态检查** | Quartz 构建时 AST 语法树解析 + `CrawlLinks()` 死链检测 | 0 死链，0 语法错误 |
| 📱 **响应式适配** | 桌面 (≥1200px) / 平板 (768–1199px) / 手机 (<768px) | 三栏→两栏→单栏自适应 |
| 🔐 **OAuth 鉴权** | 未登录 → GitHub 授权 → 回调 → 评论写入 → Discussions 持久化 | 全链路跑通 |

### 集成测试关键指标

- ✅ Markdown 评论 3 秒内渲染
- ✅ Reactions 表情实时更新
- ✅ 暗色模式切换评论区同步跟随
- ✅ SPA 导航无 iframe 重复加载

---

## Slide 9: 工程价值与总结

### 四大架构优势

| 优势 | 说明 |
|:---|:---|
| 💰 **零服务器开销** | GitHub Pages 免费托管，无任何月费 |
| 🛡 **天然防攻击** | 纯静态产物，SQL 注入在物理层不可行 |
| ⚡ **极致性能** | CDN 全球分发，TTFB < 50ms |
| 🔄 **一键容灾** | `git clone` + `npm ci` + `npx quartz build` 即可完整重建 |

### 与传统方案的终极对比

| | WordPress (LAMP) | 本项目 (JAMstack) |
|:---|:---|:---|
| 运维 | 服务器 + DB + Web Server | **零运维** |
| 部署 | SSH → 手动操作 | **git push 自动完成** |
| 安全面 | SSH / DB / PHP 多入口 | **无运行时服务** |
| 回滚 | 备份恢复（小时级） | **git revert（秒级）** |

---

## Slide 10: 致谢与 Q&A

### 感谢聆听

**项目名称：** 个人博客网站的设计与实现

**核心关键词：**
`JAMstack` · `Quartz v4` · `数字花园` · `Git-backed CMS` · `OAuth 2.0` · `GitHub Actions`

**在线体验：** https://bobcgn.github.io/quartz-myblogs/

---

### Q & A

> 💬 欢迎提问

---
