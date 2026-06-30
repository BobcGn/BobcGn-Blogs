# GitHub Actions 流水线 — 答辩稿

---

## 一、开场：流水线在系统架构中的定位

各位老师好，下面我汇报本项目 GitHub Actions CI/CD 流水线的设计思路与实现细节。

本系统采用 JAMstack 架构，构建产物为纯静态 HTML/CSS/JS 文件。整个站点从"写完文章"到"全球用户可访问"的链路，完全由一条自动化流水线承接。**创作者唯一需要执行的操作是 `git push`，其余全部由机器完成。**

这条流水线的核心价值可以用三个词概括：**自动化、可重复、零人工介入**。

---

## 二、流水线整体架构

### 2.1 触发机制

流水线监听 `main` 分支的 `push` 事件。任何一次 `git push` 到 `main` 都会自动触发整个构建-部署-发布流程。

```yaml
on:
  push:
    branches:
      - main
```

这意味着：创作者在本地 Obsidian 中修改一篇文章 → 执行同步脚本 → `git push` → 流水线自动启动，全程无需登录任何 Web 控制台。

### 2.2 三阶段流水线拓扑

整个流水线由三个顺序执行的 Job 组成：

```
┌─────────────┐     成功      ┌─────────────┐     成功      ┌─────────────┐
│   build      │ ───────────> │   deploy     │ ───────────> │   release   │
│  构建阶段    │              │  部署阶段     │              │  发布阶段    │
└─────────────┘              └─────────────┘              └─────────────┘
```

每个阶段的职责明确、边界清晰：

| 阶段 | Job 名称 | 运行环境 | 核心职责 |
|:---|:---|:---|:---|
| 构建 | `build` | `ubuntu-22.04` | 依赖安装 → Markdown 编译 → 静态产物打包 |
| 部署 | `deploy` | `ubuntu-latest` | 将产物推送至 GitHub Pages 全球 CDN |
| 发布 | `release` | `ubuntu-latest` | 自动提取变更文章列表，生成版本快照 |

---

## 三、构建阶段（build Job）详解

### 3.1 代码检出

```yaml
- uses: actions/checkout@v7
  with:
    fetch-depth: 0
```

这里 `fetch-depth: 0` 是一个关键配置——它要求检出完整的 Git 历史，而不是默认的浅克隆（只取最新一次提交）。原因是：后续的 release 阶段需要通过 `git diff` 比较本次提交与上一次提交的差异，以提取变更的 Markdown 文件列表。如果只做浅克隆，`git diff HEAD~1..HEAD` 将因缺少父提交而失败。

### 3.2 Node.js 运行时环境

```yaml
- uses: actions/setup-node@v6
  with:
    node-version: 22
```

Quartz v4 的 `package.json` 中声明了 `"node": ">=22"` 的引擎约束。Node.js 22 是当前 LTS 版本，支持 ECMAScript Modules（ESM）、Top-level `await` 等特性，是 Quartz 构建管线的最低运行时要求。

### 3.3 依赖安装

```yaml
- name: Install Dependencies
  run: npm ci
```

注意这里使用的是 `npm ci` 而不是 `npm install`。两者的区别至关重要：

| 命令 | 行为 | 适用场景 |
|:---|:---|:---|
| `npm install` | 读取 `package.json`，计算满足 semver 范围的最新版本，更新 `package-lock.json` | 本地开发 |
| `npm ci` | 严格按 `package-lock.json` 锁定的精确版本安装，不修改 lock 文件 | CI/CD 流水线 |

`npm ci` 保证了**构建幂等性（Build Idempotency）**——给定相同的 `package-lock.json`，无论何时何地执行，安装的依赖版本完全一致。这是 CI/CD 可重复性的基石。

### 3.4 Quartz 构建

```yaml
- name: Build Quartz
  run: npx quartz build
```

这条命令触发 Quartz v4 的完整构建管线：

```
Markdown 源文件 (.md)
    │
    ▼
FrontMatter Transformer     ← 提取 YAML 元数据（title, date, tags...）
    │
    ▼
ObsidianFlavoredMarkdown    ← 解析 [[wikilink]], >[!callout], Mermaid, LaTeX
    │
    ▼
SyntaxHighlighting          ← 代码块语法高亮（Shiki 引擎）
    │
    ▼
CrawlLinks                  ← 内部链接解析 + 知识图谱拓扑构建
    │
    ▼
RemoveDrafts                ← 过滤 draft: true 的文章
    │
    ▼
ContentPage / FolderPage / TagPage / Assets Emitter
    │
    ▼
public/ 目录                ← 最终静态产物
```

构建产物输出到 `public/` 目录，包含 HTML 页面、CSS 样式表、JavaScript 脚本及图片等静态资源。

### 3.5 产物上传

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v5
  with:
    path: public
```

`actions/upload-pages-artifact` 将 `public/` 目录打包为一个特殊格式的 artifact，供后续的 `deploy-pages` Action 消费。这是 GitHub Pages 官方推荐的部署方式，比传统的 `gh-pages` 分支推送更高效、更可靠。

### 3.6 构建阶段的环境变量

```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
```

这个环境变量是 GitHub Actions 的前瞻性配置，强制 JavaScript Actions 使用 Node.js 24 运行时，确保构建环境的长期兼容性。

---

## 四、部署阶段（deploy Job）详解

### 4.1 依赖关系

```yaml
deploy:
  needs: build
```

`needs: build` 声明了 Job 间的依赖关系——只有 `build` 成功完成后，`deploy` 才会启动。如果构建失败（如 Markdown 语法错误、TypeScript 类型错误），部署不会执行，避免将错误产物发布到生产环境。

### 4.2 GitHub Pages 部署

```yaml
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v5
```

`actions/deploy-pages` 是 GitHub 官方的 Pages 部署 Action，它将上一阶段上传的 artifact 发布到 GitHub Pages 的全球 CDN 边缘节点。部署完成后，`steps.deployment.outputs.page_url` 会输出站点的访问 URL，供 release 阶段引用。

### 4.3 并发控制

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

这是一个重要的生产安全配置：

- `group: "pages"` —— 所有针对 Pages 的部署操作共享同一个并发组
- `cancel-in-progress: false` —— 如果流水线正在部署中，新的部署请求会**排队等待**，而不是取消正在进行的部署

如果设为 `true`，快速连续的多次 push 可能导致正在进行的部署被取消，产生"部署到一半"的不一致状态。`false` 保证每次部署都是完整、原子的。

---

## 五、发布阶段（release Job）详解

### 5.1 条件触发

```yaml
release:
  needs: deploy
  if: "startsWith(github.event.head_commit.message, 'blog: auto publish')"
```

release 阶段不是每次都执行。只有当提交信息以 `blog: auto publish` 开头时才会触发。这种设计允许创作者区分"内容发布"和"配置变更"两种提交类型：

- `git commit -m "blog: auto publish: 新增哈希表总结"` → 触发 release
- `git commit -m "chore: update dependencies"` → 仅触发 build + deploy，不创建 release

### 5.2 变更文章提取

```yaml
- name: Extract changed articles
  id: changes
  run: |
    PAGE_URL="${{ needs.deploy.outputs.page_url }}"
    if git rev-parse HEAD~1 >/dev/null 2>&1; then
      FILES=$(git diff --name-only HEAD~1..HEAD -- 'content/**.md' 2>/dev/null || echo "")
    else
      FILES=""
    fi
```

这段脚本的逻辑：

1. 检查是否存在父提交（首次提交时 `HEAD~1` 不存在）
2. 使用 `git diff --name-only HEAD~1..HEAD` 提取本次提交中变更的文件列表
3. 通过 `-- 'content/**.md'` 过滤器只保留 Markdown 内容文件
4. 将文件路径转换为带有 URL 的 Markdown 链接列表

### 5.3 Release 发布

```yaml
- name: Create Release
  run: |
    gh release create "publish-$(date -u +'%Y%m%d-%H%M%S')" \
      --title "📝 内容更新 — $(TZ='Asia/Shanghai' date +'%Y-%m-%d %H:%M')" \
      --notes-file /tmp/release-notes.md
```

每次发布会创建一个带时间戳的 GitHub Release，包含：

- 变更文章的列表及链接
- 博客访问地址
- Star 仓库链接

这形成了一个**可回溯的内容版本历史**——任何时候都可以通过 GitHub Releases 页面查看某次更新包含了哪些文章变更。

---

## 六、权限与安全设计

### 6.1 最小权限原则

```yaml
permissions:
  contents: read    # 只读代码内容
  pages: write      # 写入 GitHub Pages
  id-token: write   # OIDC 身份令牌（部署认证）
```

流水线只申请了完成工作所必需的最小权限集：

- `contents: read` —— 只能读取代码，不能修改仓库内容（release 阶段单独声明了 `contents: write`）
- `pages: write` —— 只能部署到 GitHub Pages
- `id-token: write` —— 用于 OIDC 身份验证，确保部署操作的来源可信

### 6.2 release 阶段的额外权限

```yaml
release:
  permissions:
    contents: write   # 需要创建 Release 对象
```

release 阶段需要向仓库写入 Release 对象，因此单独声明了 `contents: write`。这种分 Job 的权限声明遵循了"按需授权"的安全最佳实践。

---

## 七、与传统部署方案的对比

| 对比维度 | 传统 VPS/云服务器部署 | GitHub Actions + Pages 部署 |
|:---|:---|:---|
| **部署操作** | SSH 登录 → `git pull` → `npm run build` → 重启服务 | `git push` 自动完成 |
| **运维成本** | 需要维护 OS、Web 服务器、Node.js 运行时 | 零运维 |
| **扩展性** | 需要手动扩容服务器 | CDN 自动扩展 |
| **容灾** | 依赖 DBA 备份策略 | Git 即备份，`git clone` 即恢复 |
| **安全面** | 存在 SSH、Web 服务器、数据库等攻击面 | 无运行时服务，攻击面趋近于零 |
| **成本** | 云服务器月费 | GitHub Pages 免费 |

---

## 八、关键配置项速查表

| 配置项 | 值 | 说明 |
|:---|:---|:---|
| `node-version` | 22 | Quartz v4 最低 Node.js 版本要求 |
| `npm ci` | — | 精确依赖安装，保证构建幂等性 |
| `fetch-depth` | 0 | 完整历史检出，支持 `git diff` |
| `concurrency.cancel-in-progress` | false | 防止部署中断 |
| `release` 条件 | `startsWith(commit, 'blog: auto publish')` | 仅内容提交触发 release |

---

## 九、常见问题与答辩应对

**Q1：为什么用 `npm ci` 而不是 `npm install`？**

> `npm ci` 严格按 lock 文件安装，不修改 lock 文件，保证 CI 环境与本地开发环境的依赖完全一致。这是构建可重复性的基础。如果用 `npm install`，可能会因 semver 范围解析差异导致不同时间构建的产物不一致。

**Q2：`fetch-depth: 0` 会不会导致克隆速度很慢？**

> 对于本项目规模（73 篇 Markdown 文件），完整克隆耗时通常在 2-3 秒，远小于后续 `npm ci` 的耗时。但即使耗时较长，为了保证 `git diff` 的正确性，这个开销是值得的。

**Q3：如果两次 push 间隔很短会怎样？**

> `cancel-in-progress: false` 保证第一次部署完成后再执行第二次。第二次部署会覆盖第一次的产物，最终状态以最后一次 push 为准。

**Q4：release 阶段为什么要有条件触发？**

> 不是所有 push 都是"发布内容"。配置文件变更、依赖更新等非内容提交不应创建 release。通过 commit message 前缀约定，创作者可以精确控制何时创建版本快照。

**Q5：流水线失败了怎么回滚？**

> 由于 Git 是唯一的"数据库"，回滚只需 `git revert <commit-hash>` 并 push，流水线会自动构建并部署回滚后的版本。整个过程不超过 2 分钟。

---

*答辩稿版本：v1.0 | 日期：2026-06-30 | 项目代号：quartz-myblogs*
