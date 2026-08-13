# BobcGn's Notes

> 一个持续生长的中文技术数字花园，记录学习、实践与复盘。

本站基于 [Quartz v4](https://quartz.jzhao.xyz/) 和 Obsidian 构建并自动发布，在线访问：[bobcgn.github.io/BobcGn-Blogs](https://bobcgn.github.io/BobcGn-Blogs)。

## 内容方向

目前收录 70 余篇笔记，核心内容包括：

- **人工智能与 Agent 工程**：提示词、上下文、循环与脚手架工程，MCP、多智能体、Agent 实践及安全治理。
- **后端与跨平台开发**：Kotlin/KMP/CMP、Java、Go、Rust、Python、Spring、Ktor，以及 Docker、Redis、RabbitMQ、MyBatis 等。
- **工程原理与架构**：依赖注入、服务端引擎、消息队列、测试、构建、Git 工作流与全域架构设计。
- **前端与数据**：HTML/CSS、JavaScript、Vue、MySQL 与 SQLDelight。
- **算法与运维**：数据结构、排序、哈希、LeetCode，以及 Linux、Nginx、可观测性、容器与云原生。

这是一个持续修订的知识库：笔记既记录结论，也保留推导、踩坑和实践过程。

## 本地运行

要求：Node.js 22+ 与 npm 10.9+。

```bash
npm install
npx quartz build --serve
```

默认会启动本地预览服务；笔记位于 [`content/`](content/) 目录，站点配置位于 [`quartz.config.ts`](quartz.config.ts)。

## 贡献与联系

欢迎通过 Issue 或 Pull Request 交流、勘误与补充。如果你对文章内容有建议，也可以通过 [GitHub @BobcGn](https://github.com/BobcGn) 联系我。

## 致谢

本项目使用 [Quartz](https://github.com/jackyzha0/quartz) 构建。感谢其提供轻量、开放的数字花园发布能力。
