# 评论与互动功能 — 答辩稿

---

## 一、开场：评论功能在 JAMstack 架构下的核心矛盾

各位老师好，下面我汇报本项目评论与互动功能的设计思路与实现细节。

本项目面临一个根本性的架构矛盾：**任务书要求"用户登录与互动评论"，但 JAMstack 纯静态站点没有运行时服务器、没有数据库、没有 Session 管理能力。** 传统评论系统（前端表单 → AJAX POST → 后端 SQL INSERT → 页面重载）在这套架构下完全不可行。

我们的解决方案是**"Serverless 无服务器"架构**——将鉴权与数据持久化两项职责外包给 GitHub 平台的原生能力，具体通过 Giscus 评论组件实现。

---

## 二、技术选型论证

### 2.1 为什么不用传统方案？

| 方案 | 问题 | 结论 |
|:---|:---|:---|
| 自建 Express + MySQL 评论系统 | 需要服务器、数据库，违背 JAMstack 原则 | ❌ 不可行 |
| Disqus | 闭源、广告注入、数据不可控 | ❌ 不选 |
| GitHub Issues 手动管理 | 无前端 UI，用户体验差 | ❌ 不选 |
| **Giscus** | 基于 GitHub Discussions，开源、无广告、数据自主 | ✅ 选中 |

### 2.2 Giscus vs Utterances

项目中实际调研了两种基于 GitHub 的评论方案：

| 对比维度 | Giscus | Utterances |
|:---|:---|:---|
| 数据存储 | GitHub Discussions | GitHub Issues |
| 分类能力 | 支持多分类（General, Q&A 等） | 不支持分类 |
| 反应表情 | 支持 Reactions | 不支持 |
| Markdown 渲染 | 完整 GFM 支持 | 基础 Markdown |
| 主题切换 | 支持多主题 + 自定义 CSS | 仅 light/dark |
| 映射策略 | url, title, pathname, og:title, specific, number | title, pathname, url, og:title |
| 配置复杂度 | 需要 repoId + categoryId | 仅需 repo 名 |

**最终选型：Giscus**。原因： Discussions 的分类能力允许我们将"日常交流"、"Bug 报告"、"功能建议"等不同类型的反馈归入不同分类，实现更精细的互动管理。

### 2.3 为什么不自建 OAuth 2.0？

OAuth 2.0 授权码模式要求客户端持有 `client_secret` 以完成授权码到访问令牌的交换。但在 SPA 场景下，任何嵌入前端代码的密钥等同于明文公开——攻击者仅需打开浏览器开发者工具即可提取。Giscus 维护着一个安全的、服务端托管的 OAuth App，`client_secret` 始终在 Giscus 后端安全边界内流转，前端代码中无任何敏感凭据。

---

## 三、系统架构设计

### 3.1 Feedback 复合组件架构

不同于简单的评论挂载，本项目设计了一个 **Feedback 复合组件**，将"结构化 Issue 引导"与"日常评论"在一个卡片中统一呈现：

```
┌─ .feedback-card ──────────────────────────────────────────┐
│                                                           │
│  💬 互动与反馈                                             │
│                                                           │
│  如果您发现了文章错误、有新功能建议，或者想探讨架构问题，    │
│  推荐通过 Issue 追踪。如果是日常交流，可以直接在下方留言。  │
│                                                           │
│  [ 🚀 前往 GitHub 提交结构化 Issue ]                       │
│                                                           │
│  ─────────────────────────────────────────────────────     │
│                                                           │
│  ┌─ Giscus 评论区 ──────────────────────────────────┐     │
│  │  (第三方 iframe，自动注入)                         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**设计动机**：Giscus/Utterances 是跨域加载的 iframe，无法直接修改其内部 UI。因此需要在宿主层（Quartz）封装一个统一的反馈引导区，实现"Issue 提报"与"日常评论"的视觉分流。

### 3.2 两层分工

| 层级 | 技术 | 职责 |
|:---|:---|:---|
| 宿主层（Quartz） | Preact + TypeScript | 引导文案、Issue 链接按钮、分割线、整体布局 |
| 嵌入层（Giscus） | 第三方 iframe | OAuth 鉴权、评论输入/渲染、Markdown 解析、Reactions |

这种分层确保了**宿主层可独立演进**——未来如果要替换 Giscus 为其他评论系统，只需修改嵌入层的脚本加载逻辑，引导区的 UI 和交互无需任何改动。

---

## 四、组件级实现详解

### 4.1 Feedback.tsx — 组件主体

```tsx
export default ((opts?: Partial<Options>) => {
  const options = { ...defaultOptions, ...opts }

  const Feedback: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    // frontmatter 中 comments: false 可禁用评论区
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    const issueHref =
      options.issueUrl ?? `https://github.com/${options.repo}/issues/new/choose`

    return (
      <div class={classNames(displayClass, "feedback-card")}>
        {/* 引导区 */}
        <div class="feedback-guide">
          <h3 class="feedback-title">💬 互动与反馈</h3>
          <p class="feedback-desc">...</p>
          <a class="feedback-btn" href={issueHref} target="_blank" rel="noopener noreferrer">
            🚀 前往 GitHub 提交结构化 Issue
          </a>
        </div>

        {/* 分割线 */}
        <hr class="feedback-divider" />

        {/* Giscus 容器 */}
        <div class="giscus" data-repo={options.repo} ... ></div>
      </div>
    )
  }

  Feedback.css = feedbackCss
  Feedback.afterDOMLoaded = script

  return Feedback
}) satisfies QuartzComponentConstructor<Options | undefined>
```

**关键设计点**：

1. **`satisfies QuartzComponentConstructor`** —— 使用 TypeScript 的 `satisfies` 运算符，确保返回值符合 Quartz 组件的构造函数签名，同时保留具体的 Options 类型推断。

2. **`Feedback.css = feedbackCss`** —— 内联 CSS 字符串，无需额外的 `.scss` 文件。样式使用 CSS 变量（`var(--secondary)`, `var(--lightgray)` 等）与 Quartz 主题系统联动。

3. **`Feedback.afterDOMLoaded = script`** —— 挂载客户端脚本钩子。该脚本在 DOM 完全加载后执行，动态创建 `<script>` 标签注入 Giscus SDK。

4. **frontmatter 控制** —— 文章的 `comments: false` 可单独禁用该文章的评论区，无需修改全局配置。

### 4.2 feedback.inline.ts — 客户端脚本

```ts
;(() => {
  if (typeof window === "undefined") return

  // 主题切换处理
  const changeTheme = (e: CustomEventMap["themechange"]) => {
    const iframe = document.querySelector(
      ".feedback-card iframe.giscus-frame"
    ) as HTMLIFrameElement
    if (!iframe?.contentWindow) return

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: e.detail.theme === "dark" ? "dark" : "light",
          },
        },
      },
      "https://giscus.app",
    )
  }

  // SPA 导航时重新注入 Giscus
  document.addEventListener("nav", () => {
    const container = document.querySelector(".feedback-card .giscus") as HTMLElement
    if (!container) return

    // 移除旧 iframe（SPA 导航去重）
    container.querySelector("iframe.giscus-frame")?.remove()

    // 动态创建 <script> 标签
    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    // ... 设置 data-* 属性

    container.appendChild(script)

    // 注册主题切换监听
    document.addEventListener("themechange", changeTheme)
    window.addCleanup(() => document.removeEventListener("themechange", changeTheme))
  })
})()
```

**三个关键问题的处理**：

#### 问题 1：Preact/SSR 环境下 `<script>` 标签不执行

Preact 使用 jsdom 进行服务端渲染，jsdom 不会执行 `<script src="...">` 标签。解决方案是使用 `afterDOMLoaded` 钩子，在客户端 DOM 加载完成后通过 `document.createElement("script")` 动态注入。

#### 问题 2：SPA 导航时 iframe 重复

Quartz 启用 `enableSPA: true` 后，页面导航通过 AJAX 增量加载，不会整页刷新。如果不处理，每次导航都会在 `.giscus` 容器中追加一个新的 Giscus iframe。解决方案：在注入新脚本前先 `remove()` 旧的 iframe。

#### 问题 3：明暗主题同步

Giscus 通过 `postMessage` API 接收主题变更指令。当用户切换 Quartz 的暗色模式时，`changeTheme` 函数将新的主题名称通过 `postMessage` 发送到 Giscus iframe，实现评论区与站点主题的实时联动。

### 4.3 布局注入

```ts
// quartz.layout.ts
export const sharedPageComponents: SharedLayout = {
  afterBody: [
    Component.Feedback({
      repo: "BobcGn/quartz-myblogs" as `${string}/${string}`,
      repoId: "",
    }),
  ],
}
```

`afterBody` 插槽确保 Feedback 组件在文章正文内容之后渲染，不阻塞首屏关键渲染路径（Critical Rendering Path）。

---

## 五、OAuth 2.0 鉴权流程

### 5.1 完整时序

```
终端用户浏览器              Giscus 后端                    GitHub API
     │                          │                               │
     │  ① 点击 "Sign in with    │                               │
     │     GitHub" 按钮         │                               │
     │────────────────────────>│                               │
     │                          │                               │
     │  ② HTTP 302 重定向至      │                               │
     │     github.com/login/    │                               │
     │     oauth/authorize?     │                               │
     │     client_id=xxx&       │                               │
     │     scope=public_repo    │                               │
     │<────────────────────────│                               │
     │                          │                               │
     │  ③ 用户在 GitHub 确认授权  │                               │
     │─────────────────────────────────────────────────────────>│
     │                          │                               │
     │  ④ GitHub 回调 Giscus    │                               │
     │     后端，携带授权码       │                               │
     │                          │<──────────────────────────────│
     │                          │                               │
     │                          │  ⑤ client_secret + code       │
     │                          │     → access_token            │
     │                          │──────────────────────────────>│
     │                          │                               │
     │  ⑥ 登录成功，显示评论输入框│                               │
     │<────────────────────────│                               │
     │                          │                               │
     │  ⑦ 用户撰写评论           │                               │
     │────────────────────────>│                               │
     │                          │  ⑧ POST /repos/.../comments   │
     │                          │──────────────────────────────>│
     │                          │                               │
     │  ⑨ 评论实时渲染           │                               │
     │<────────────────────────│                               │
```

### 5.2 安全分析

- **步骤 ②–③**：在 `github.com` 域内完成，用户密码仅在该 HTTPS 安全边界内传输
- **步骤 ④–⑤**：发生在 Giscus 后端与 GitHub 之间，`client_secret` 从未进入用户浏览器
- **步骤 ⑧**：评论以已登录用户的 GitHub 身份通过 API 写入指定仓库的 Discussions，同时实现了鉴权与审核

---

## 六、数据持久化模型

### 6.1 评论数据的存储位置

每篇文章的评论区被映射为一个独立的 **GitHub Discussion**（而非 Issue），评论数据以 Discussion Comment 的形式持久化。

```
GitHub 仓库
├── Issues（不存储评论数据）
└── Discussions
    ├── "LeetCode 哈希表总结" ← 对应文章标题
    │   ├── Comment #1
    │   ├── Comment #2
    │   └── ...
    ├── "Linux 内核优化"
    │   └── ...
    └── ...
```

### 6.2 映射策略

本项目使用 `"mapping": "title"` 策略——以文章标题作为 Discussion 的匹配键。选择 title 而非 url/pathname 的原因：

- **URL 变更时评论不丢失**：如果文章路径变更（如重命名），以 title 匹配的评论仍然关联到正确的内容
- **可读性**：在 GitHub Discussions 页面中，Discussion 标题即文章标题，便于管理

### 6.3 与传统数据库方案的对比

| 对比维度 | MySQL `comments` 表 | GitHub Discussions |
|:---|:---|:---|
| 数据持久化 | 需要定期备份 | Git 版本历史即备份 |
| 垃圾过滤 | 需要自建 | GitHub 内置 Spam 过滤 |
| 通知订阅 | 需要自建邮件系统 | GitHub 原生通知 |
| 权限管理 | 需要 RBAC 实现 | GitHub 仓库权限继承 |
| 运维成本 | 需要 DBA | 零运维 |

---

## 七、主题切换实现

### 7.1 事件机制

Quartz 的暗色模式通过 `CustomEvent` 机制广播主题变更：

```ts
// Darkmode 组件触发事件
document.dispatchEvent(
  new CustomEvent("themechange", {
    detail: { theme: "dark" },  // 或 "light"
  })
)
```

### 7.2 Giscus 主题同步

Feedback 组件的客户端脚本监听该事件，通过 `postMessage` 向 Giscus iframe 发送主题变更指令：

```ts
iframe.contentWindow.postMessage(
  {
    giscus: {
      setConfig: {
        theme: e.detail.theme === "dark" ? "dark" : "light",
      },
    },
  },
  "https://giscus.app",
)
```

### 7.3 清理机制

Quartz 的 SPA 导航会在页面切换时触发 `cleanup` 事件。通过 `window.addCleanup()` 注册的清理函数会在导航时自动执行，移除旧的主题切换监听器，防止事件处理器泄漏：

```ts
document.addEventListener("themechange", changeTheme)
window.addCleanup(() => document.removeEventListener("themechange", changeTheme))
```

---

## 八、响应式与可访问性

### 8.1 CSS 变量与主题适配

Feedback 组件的样式完全基于 Quartz 的 CSS 变量系统：

| CSS 变量 | 用途 | 亮色模式值 | 暗色模式值 |
|:---|:---|:---|:---|
| `var(--secondary)` | 按钮背景色 | 主题蓝 | 主题蓝 |
| `var(--lightgray)` | 边框/分割线 | 浅灰 | 深灰 |
| `var(--light)` | 卡片背景 | 白色 | 深色 |
| `var(--gray)` | 描述文字 | 中灰 | 浅灰 |

### 8.2 移动端适配

- 卡片使用 `padding: 1.5rem` 内边距，在窄视口下不贴边
- 按钮使用 `padding: 0.55rem 1.2rem`，触控区域 ≥ 44×44px（Apple HIG 最低标准）
- Giscus iframe 内部自带响应式布局，无需额外适配

### 8.3 可访问性

- 使用语义化 HTML 标签（`<h3>`, `<p>`, `<a>`, `<hr>`）
- 按钮链接添加 `rel="noopener noreferrer"` 防止 tabnabbing 攻击
- `target="_blank"` 在新标签页打开 Issue，不中断当前阅读

---

## 九、测试验证

### 9.1 集成测试用例

| 测试步骤 | 操作 | 预期行为 | 状态 |
|:---|:---|:---|:---|
| 1 | 访问文章页，滚动至底部 | 显示 Feedback 卡片，包含引导文案和 Issue 按钮 | ✅ |
| 2 | 点击 "🚀 前往 GitHub 提交结构化 Issue" | 新标签页打开 GitHub Issue 创建页面 | ✅ |
| 3 | 未登录状态查看评论区 | 显示 "Sign in with GitHub" 按钮 | ✅ |
| 4 | 点击登录按钮 | 重定向至 GitHub OAuth 授权页 | ✅ |
| 5 | 授权后回调 | 评论输入框变为可用状态，显示用户头像 | ✅ |
| 6 | 提交 Markdown 评论 | 评论在 3 秒内渲染，Markdown 语法正确解析 | ✅ |
| 7 | 切换暗色模式 | 评论区主题实时跟随切换 | ✅ |
| 8 | SPA 导航至另一篇文章 | 旧 iframe 移除，新文章的评论区正确加载 | ✅ |
| 9 | 在 frontmatter 中设置 `comments: false` | 该文章不显示 Feedback 卡片 | ✅ |

### 9.2 跨浏览器兼容性

| 浏览器 | 版本 | 测试结果 |
|:---|:---|:---|
| Chrome | 125+ | ✅ 评论登录/提交/主题切换正常 |
| Firefox | 128+ | ✅ 评论登录/提交/主题切换正常 |
| Safari | 17+ | ✅ 评论登录/提交/主题切换正常 |
| Edge | 125+ | ✅ 评论登录/提交/主题切换正常 |

---

## 十、答辩应对要点

**Q1：为什么不直接用 Utterances，而要用 Giscus？**

> Utterances 基于 GitHub Issues，不支持分类管理。Giscus 基于 GitHub Discussions，支持多分类（General, Q&A, Ideas 等），允许我们将不同类型的反馈归入不同分类，实现更精细的互动管理。此外 Giscus 支持 Reactions 表情和更丰富的 Markdown 渲染。

**Q2：Giscus 的 `repoId` 和 `categoryId` 怎么获取？**

> 访问 giscus.app 官网，选择仓库和分类后，页面会生成对应的 `data-repo-id` 和 `data-category-id`。这两个值是 Giscus 用来定位 Discussion 分类的唯一标识。

**Q3：评论数据的安全性如何保障？**

> 所有评论操作都在 GitHub 的 OAuth 2.0 安全边界内完成。用户密码仅在 `github.com` 域内传输，`client_secret` 仅在 Giscus 后端使用。本项目的代码仓库中不包含任何可被逆向提取的敏感凭据。

**Q4：如何处理评论的垃圾信息？**

> GitHub Discussions 内置了 Spam 过滤机制，与 GitHub 的全平台反垃圾系统共享同一套检测模型。此外，仓库管理员可以在 GitHub 后台对 Discussion 进行管理（删除、标记、锁定等）。

**Q5：如果 Giscus 服务不可用怎么办？**

> Giscus 是一个开源项目（github.com/giscus/giscus），部署在 Vercel 上，可用性极高。即使 Giscus 暂时不可用，评论区 iframe 会显示加载失败，但不影响文章正文内容的阅读——评论功能是渐进增强（Progressive Enhancement）的，不是核心功能的阻塞依赖。

**Q6：为什么用 `afterDOMLoaded` 而不是 `useEffect`？**

> Quartz 的组件模型不是标准的 React/Preact 应用——它在构建时渲染为静态 HTML，`afterDOMLoaded` 是 Quartz 专门设计的客户端脚本注入机制。如果使用 `useEffect`，需要额外处理 hydration 逻辑，复杂度更高且无额外收益。

---

*答辩稿版本：v1.0 | 日期：2026-06-30 | 项目代号：quartz-myblogs*
