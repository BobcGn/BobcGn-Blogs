---
title: 'Koog'
date: 2026-07-07
tags:
  - 开发学习
  - 开发学习/后端开发/框架
---

# 0. Koog 简介
> [!question] 为什么选择Koog？
> ## *与 JVM 和 Kotlin 应用程序集成*
> Koog 提供了一种专为 JVM 和 Kotlin 开发者设计的 Kotlin 领域特定语言 (DSL)。 这确保了与基于 Kotlin 和 Java 的应用程序的平滑集成， 显著提高了生产力并增强了整体开发者体验。
> 
> ## *JetBrains 产品的实际验证*
> Koog 为包括内部 AI 代理在内的多个 JetBrains 产品提供支持。 这种实际集成确保了 Koog 能够根据实际用例持续进行测试、完善和验证。 它专注于实践中的有效方法，融合了广泛反馈和实际产品场景中的见解。 这种集成赋予了 Koog 区别于其他框架的优势。
> 
> ## *开箱即用的高级解决方案*
> Koog 包含预构建的可组合解决方案，可简化并加速智能体系统的开发，使其区别于仅提供基本组件的框架：
>
> - **多种历史压缩策略。** Koog 开箱即用地提供了先进的策略来压缩和管理长期对话，无需手动尝试各种方法。凭借机器学习工程师测试和完善的精心调优的提示、技术和算法，您可以依靠经验证的方法来提高性能。关于压缩策略的更多细节，请参阅[历史压缩](https://docs.koog.ai/history-compression/)。要了解 Koog 如何在实际场景中处理压缩和上下文管理，请查阅[这篇文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)。
> - **无缝 LLM 切换。** 您可以在任何时候将对话切换到不同的大型语言模型 (LLM)，并使用一组新的可用工具，而不会丢失现有对话历史。Koog 会自动重写历史并处理不可用的工具，从而实现平滑过渡和自然的交互流程。
> - **高级持久化。** Koog 允许您恢复完整的智能体状态机，而不仅仅是聊天消息。这使得检查点、故障恢复，甚至回溯到状态机执行中任何时间点的功能成为可能。
> - **健壮的重试组件。** Koog 包含一个重试机制，允许您将智能体系统中的任何一组操作封装起来，并反复重试直到满足可配置的条件。您可以提供反馈并调整每次尝试，以确保可靠的结果。如果 LLM 调用超时、工具未能按预期工作或出现网络问题，Koog 可确保您的智能体即使在暂时性故障期间也能保持弹性和高效运行。有关更多技术细节，请参阅[失败处理](https://docs.koog.ai/prompts/handling-failures/)。
> - **带有 Markdown DSL 的结构化类型化流式传输。** Koog 流式传输 LLM 输出，并使用 Markdown DSL 将其解析为结构化、类型化的事件。您可以为标题、项目符号点或正则表达式模式等特定元素注册处理程序，并实时接收仅相关的部分。这种方法通过 Markdown 提供人类可读的反馈，并使用结构化类型提供机器可解析的数据，有效消除了透明度不足的问题，并增强了用户体验。它确保了可预测的输出和具有渐进式内容渲染的动态用户界面。
> ## *广泛集成、多平台支持、增强可观测性*
> Koog 支持在各种平台和环境中开发和部署智能体应用程序：
>
> - **多平台支持**。您可以在 JVM、JS、WasmJS、Android 和 iOS 目标平台部署您的智能体应用程序。
> - **广泛的 AI 集成**。Koog 集成了主要的 LLM 提供商，包括 OpenAI 和 Anthropic，以及 Bedrock 等企业级 AI 云。它还支持 Ollama 等本地模型。有关可用提供商的完整列表，请参阅[LLM 提供商](https://docs.koog.ai/llm-providers/)。
> - **OpenTelemetry 支持**。Koog 提供与 [W&B Weave](https://wandb.ai/site/weave/) 和 [Langfuse](https://langfuse.com/) 等流行的可观测性提供商的开箱即用集成，用于监控和调试 AI 应用程序。借助原生 OpenTelemetry 支持，您可以使用系统中已有的相同工具来跟踪、记录和测量您的智能体。要了解更多信息，请参阅 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)。
> - **Spring Boot 和 Ktor 集成**。Koog 与广泛使用的企业环境集成。
> 	- 如果您有 Ktor 服务器，您可以将 Koog 作为插件安装，使用配置文件配置提供商，并直接从任何路由调用智能体，而无需手动连接 LLM 客户端。
> 	- 对于 Spring Boot，Koog 提供即用型 bean 和自动配置的 LLM 客户端，使您能够轻松开始构建 AI 驱动的工作流。
> ## *与机器学习工程师和产品团队协作*
> Koog 的独特优势在于其与 JetBrains 机器学习工程师和产品团队的直接协作。 这确保了使用 Koog 构建的特性不仅是理论性的，而是基于实际产品需求进行测试和完善的。 这意味着 Koog 融入了：
>
> - **精心调优的提示和策略**，针对实际性能进行了优化。
> - **经验证的工程方法**，通过产品开发发现和验证，例如其独特的历史压缩策略。您可以在[这篇详细文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)中了解更多信息。
> - **持续改进**，帮助 Koog 保持高效并适应不断变化的需求。

---

# 0.1 Koog 1.0 重大更新（按架构层组织）

> [!important] 里程碑
> Koog 1.0.0 是首个稳定版本，标志着从「快速迭代期」进入「语义化版本」阶段。所有 `@Deprecated` API 已被彻底移除，模块分为 Stable 和 Beta 两个流——生产代码锁定 Stable API，Beta 模块的变化不再影响编译。

## 0.1.1 传输层：HTTP 与 Ktor 解耦

### `KoogHttpClient.Factory` 可插拔机制

> [!note] What
> 将 HTTP 客户端从硬编码的 Ktor 依赖中抽离，引入 `KoogHttpClient.Factory` SPI（Service Provider Interface）机制，实现传输层的可插拔替换。

> [!question] Why
> 1.0 之前，Koog 的所有 LLM API 调用都强绑定了 Ktor HttpClient，导致：
> - Android 端侧部署必须引入整个 Ktor 依赖栈（~2-3MB），与 OkHttp 产生冗余
> - Spring Boot 企业集成无法复用现有的 RestClient / WebClient
> - GraalVM Native Image 编译时，Ktor 的反射特性对 native-image 支持不友好
>
> 解耦后，Koog 自动发现机制会在 classpath 中寻找 Ktor 实现，也允许开发者显式注入 Java HttpClient / OkHttp / Spring RestClient。

> [!tip] How
> - **Android 端侧 Agent**：可以用 OkHttp 替代 Ktor，减少约 2MB 的 APK 体积增量
> - **Spring Boot 集成**：直接复用 `RestClient`，零额外 HTTP 依赖
> - **GraalVM Native Image**：选择 `java.net.http.HttpClient`，规避 Ktor 的反射问题
>
> ```kotlin
> // Android 项目中使用 OkHttp 作为 Koog 的 HTTP 传输
> val agent = AIAgent(
>     promptExecutor = SingleLLMPromptExecutor(
>         AnthropicLLMClient(
>             apiKey = apiKey,
>             httpClient = KoogHttpClient.from(okHttpClient) // 注入 OkHttp
>         )
>     ),
>     llmModel = AnthropicModels.Sonnet_4
> )
> ```

### Ollama 统一抽象层路由

> [!note] What
> Ollama 本地模型的 HTTP 通信也统一到 `KoogHttpClient.Factory` 抽象层，不再走独立路径。

> [!question] Why
> 之前 Ollama 和远程 LLM Provider 走不同的 HTTP 通道，配置不一致、调试困难。统一后，切换本地/远程模型只需改配置，无需改代码。

> [!tip] How
> 开发阶段用 Ollama 本地模型调试，生产环境切远程 API——整个过程对 Agent 代码**完全透明**。

### MCP SDK 升级至 0.11.1

> [!note] What
> MCP 客户端 SDK 升级至 0.11.1，Streamable HTTP 成为首选传输协议，取代此前的 SSE + POST 双通道模式。

> [!question] Why
> 旧版 MCP 传输需要维护 SSE 长连接 + 独立 POST 端点，部署复杂度高（需反向代理支持 SSE）。Streamable HTTP 将双向通信统一到单个 HTTP 端点，大幅简化部署拓扑。

> [!tip] How
> - MCP Server 部署从「需要支持 SSE 的特殊 Nginx 配置」简化为「普通 HTTP 服务」
> - 与 Koog 1.0 的 HTTP 解耦协同——MCP 传输也受益于可插拔 HTTP 客户端

## 0.1.2 Agent 核心：Graph DSL 定型 + Stable/Beta 分流

### Graph DSL 节点命名定型

> [!note] What
> Graph DSL 中的节点命名规范正式确立，形成两套命名体系：
> - **String-input 节点**：保留原名 `nodeLLMRequest`、`nodeLLMRequestOnlyCallingTools`、`nodeLLMRequestWithoutTools` 等
> - **`Message.User`-input 节点**：统一使用 `nodeLLMSendMessage*` 前缀（如 `nodeLLMSendMessageOnlyCallingTools`）
> - `nodeExecuteTools` 直接返回 `ReceivedToolResults`（非 raw JSON）
> - 新增 `nodeLLMModerateText` 支持纯 String 输入的内容审核

> [!question] Why
> 1.0 之前，节点命名混乱——同样是「发送消息给 LLM」，String 输入和 Message 输入用的是同一个函数名，靠重载区分，IDE 提示不清晰。命名分离后，**意图一目了然**：
> - `nodeLLMRequest` = 我有一个 String，发给 LLM
> - `nodeLLMSendMessage` = 我有一个构造好的 `Message.User`，发给 LLM

> [!tip] How
> - 升级时需要做一次节点名称迁移，IDE 的 `Find and Replace` 可以批量处理
> - `nodeExecuteTools` 返回 `ReceivedToolResults` 意味着不再需要手动解析 tool call 的 JSON——**类型安全直接到位**
> - `nodeLLMModerateText` 是内容安全的第一公民，生产环境应默认接入

### Stable / Beta 模块分流

> [!note] What
> 所有模块被分为 **Stable** 和 **Beta** 两个流。生产代码可 `@OptIn` 锁定 Stable API，Beta 模块的变化不再影响编译。同时，**所有 `@Deprecated` API 已在 1.0 中被彻底移除**，涵盖：
> - event handlers、pipeline
> - agent / strategy / DSL
> - tools、persistence、executors
> - MCP、models
> - Spring autoconfig、RAG utilities

> [!question] Why
> 这是框架从「快速迭代」走向「语义化版本」的标志性动作：
> - Stable API 的 breaking change 只在大版本号变更时发生
> - Beta API 的变更不会阻断 CI/CD
> - 旧版代码中所有 `@Deprecated` 调用**必须在升级前修复**，没有过渡期

> [!tip] How
> - 升级到 1.0 的**第一步**：全局搜索 `@Deprecated` 相关的编译 warning，逐个迁移
> - 在 `build.gradle.kts` 中配置 `-Xopt-in=kotlin.RequiresOptIn`，明确声明只使用 Stable API
> - Beta 模块（如实验性的 planner 新功能）可以在独立模块中尝试，不影响主工程

### Java 互操作重设计

> [!note] What
> 统一 `xxxBlocking` 模式，移除所有显式 `ExecutorService` 参数，改用 Agent 配置的 `dispatcher` 替代线程池管理。

> [!question] Why
> 之前 Java 调用方需要为每个 blocking 方法传入 `ExecutorService`，代码冗余且容易泄漏线程池。统一后：
> - `agent.runBlocking(input)` 直接使用 Agent 内部的协程 dispatcher
> - Java 侧代码量减少约 40%
> - 线程池生命周期与 Agent 绑定，不会泄漏

> [!tip] How
> - Java 项目升级：移除所有 `executorService` 参数，直接调用 `xxxBlocking` 方法
> - 如果需要自定义线程池，在 Agent 构建时通过 `dispatcher` 参数配置
> - 对「Kotlin Agent + Java Spring Boot」混合架构尤其友好

## 0.1.3 可观测性：OpenTelemetry KMP 多平台

### OpenTelemetry 覆盖 KMP 全平台

> [!note] What
> OpenTelemetry 集成从 JVM-only 扩展到 KMP 全平台（JVM、JS、iOS Native、Android、Linux Native，除 WasmJS）。Langfuse / Weave / DataDog 的 trace exporter 均支持多平台。内置三大关键指标：
> - `gen_ai.client.token.usage`：token 消耗量
> - `gen_ai.client.operation.duration`：操作延迟
> - `gen_ai.client.tool.count`：工具调用次数

> [!question] Why
> 之前 Agent 可观测性仅限 JVM 服务端。iOS/Android 客户端的 Agent 行为是一个黑箱——不知道它调用了几次 LLM、消耗了多少 token、哪个 tool 最耗时。多平台支持让**端到端的全链路 trace** 成为可能。

> [!tip] How
> - **成本管控**：`gen_ai.client.token.usage` 指标可以直接接入 Grafana 仪表盘，实时监控每个 Agent 的 token 消耗
> - **性能优化**：`gen_ai.client.operation.duration` 可以定位慢 LLM 调用和慢 tool 执行
> - **质量监控**：`gen_ai.client.tool.count` 过高意味着 Agent 可能陷入了 tool call 循环
> - 兼容 Prometheus/Grafana，企业级监控零额外成本

## 0.1.4 LLM 交互优化：Prompt Caching + 内容审核

### Anthropic Prompt Caching

> [!note] What
> 端到端的 Anthropic Prompt Caching 支持：自动请求缓存 + 显式消息断点（breakpoint）。缓存命中的 token 不重复计费，缓存 token 纳入 `usage` 指标便于监控。

> [!question] Why
> 长 system prompt（>1000 tokens）的 Agent 在每次对话时都要重新发送完整 prompt，造成大量重复 token 消耗。以一个 4000-token system prompt 为例：
> - 无缓存：每次调用消耗 4000 input tokens
> - 有缓存：首次 4000 + 缓存写入费，后续每次仅 ~100 缓存读取 token
> - **成本降幅可达 90%**（取决于 system prompt 占比）

> [!tip] How
> - 在 Graph DSL 中使用 `nodeAppendPrompt` 设置 system prompt 时，Koog 会自动在合适位置插入缓存断点
> - `usage` 指标中的 `cache_read_input_tokens` 和 `cache_creation_input_tokens` 字段可用于精确核算缓存收益
> - **建议**：对所有使用 Anthropic Claude 的 Agent 开启此功能，尤其是 system prompt 超过 2000 tokens 的场景

### `nodeLLMModerateText` 内容审核节点

> [!note] What
> 新增 `nodeLLMModerateText` 节点，接受纯 String 输入，调用 LLM Provider 的 moderation API 进行内容审核，支持插入到 Graph DSL 的任意位置。

> [!question] Why
> 之前内容审核需要开发者自行封装 API 调用。内置节点让**内容安全成为工作流的标准化环节**，而非事后补丁。

> [!tip] How
> - 生产环境 Agent 建议在 `nodeStart` 和 `nodeLLMRequest` 之间插入 `nodeLLMModerateText`
> - 对面向 C 端用户的 Agent，这是**合规必备**而非可选项

## 0.1.5 工具生态：ToolCallMetadata + Planner 独立化

### `ToolCallMetadata` 侧通道

> [!note] What
> 工具调用新增 `ToolCallMetadata` 侧通道，携带 trace ID、correlation ID、feature flags 等元数据，与工具的实际参数分离传递。

> [!question] Why
> 之前工具只能通过 `Args` 获取业务参数，跨工具的关联追踪（如「这次搜索是为哪个审批流服务的」）需要开发者自行通过 `AIAgentStorage` 传递。Metadata 侧通道让**可观测性数据与业务数据解耦**。

> [!tip] How
> - 在自定义工具的 `execute()` 方法中，可以通过 `metadata` 获取当前 trace ID，输出结构化日志
> - Feature flags 可用于工具的灰度发布——同一个 tool 根据 flag 走不同逻辑

### Planners 独立模块 + `RetrieveFactsFromHistory` 提取

> [!note] What
> - Planner Agent 从核心模块移至独立的 `agents:agents-planners` 模块
> - `RetrieveFactsFromHistory` 从 `AgentMemory` 提取为独立的 `HistoryCompressionStrategy`
> - Planner agent 支持 checkpoint/restore

> [!question] Why
> Planner 是重型组件（依赖 graph traversal + LLM 多轮推理），并非所有 Agent 都需要。独立模块后：
> - 不使用 Planner 的项目减少约 15% 的依赖体积
> - `HistoryCompressionStrategy` 的独立化让「从历史中提取关键事实」成为可组合的通用能力

> [!tip] How
> - 简单 Agent（如客服机器人）不需要引入 `agents-planners`
> - 复杂多阶段 Agent（如自动化运维）应使用 Planner + Checkpoint 组合

### `AIAgentStorage` Checkpoint 持久化

> [!note] What
> `AIAgentStorage`（节点间键值传递机制）支持 checkpoint 持久化，并暴露 `runFromCheckpoint` API，允许 Agent 从任意历史快照恢复执行。Amazon Bedrock AgentCore 作为 `LongTermMemory` 后端，为跨会话记忆提供了云原生方案。

> [!question] Why
> 之前 Agent 状态只存在于内存中，进程重启即丢失。长周期任务（如多轮调研、审批流）必须从头重跑。Checkpoint 机制让 Agent 具备了**断点续传**能力。

> [!tip] How
> - 长周期 Agent（>5 分钟）应默认开启 checkpoint
> - 配合 Planner agent 的 checkpoint/restore，可以实现「人类在环」的审批模式——Agent 执行到关键节点暂停，等人类审批后恢复

---

# 1. Koog 入门
## 1.1 使用前提
> [!note] 配置必要的依赖项
> Koog 需要 JDK 17+，Kotlin 2.2+，并建议使用 Gradle 8+ 或 Maven 3.8+。下面示例中的版本号应以官方文档或项目版本目录为准。
>
> 1. Gradle（Kotlin DSL）
> 	- 将依赖项添加到`build.gradle.kts`文件中：
> 	```kotlin
> 	val koogVersion = "1.0.0"
>
> 	dependencies{
> 		implementation("ai.koog:koog-agents:$koogVersion")
> 	}
> 	```
> 	- 确保`mavenCentral()`在版本库列表中：
> 	```kotlin
> 	repositories{
> 		mavenCentral()
> 	}
> 	```
> 2. Gradle（Groovy DSL）
> 	- 将依赖项添加到`build.gradle`文件中：
> 	```groovy
> 	def koogVersion = '1.0.0'
>
> 	dependencies{
> 		implementation "ai.koog:koog-agents:$koogVersion"
> 	}
> 	```
> 	- 确保`mavenCentral()`在版本库列表中：
> 	```groovy
> 	repositories{
> 		mavenCentral()
> 	}
> 	```
> 3. Maven
> 	- 将依赖性添加至`pom.xml`文件中：
> 	```xml
> 	<dependency>
> 		<groupId>ai.koog</groupId>
> 		<artifactId>koog-agents-jvm</artifactId>
> 		<version>${koog.version}</version>
> 	</dependency>
> 	```
> 	- 确保`mavenCentral()`在版本库列表中：
> 	```xml
> 	<repositories>
> 		<repository>
> 			<id>mavenCentral</id>
> 			<url>https://repo1.maven.org/maven2</url>
> 		</repository>
> 	</repositories>
> 	```
> 
> **注意**：上述依赖项中的版本需要根据实际使用自行更换，正式项目建议放到`libs.versions.toml`或Maven properties中统一管理

> [!note] 设置API key
> 这里以[DeepSeek](https://platform.deepseek.com/api_keys)为例：
> ```linux
> # Linux/MacOS
> export DEEPSEEK_API_KEY=your-api-key
> ```
> 
> ```shell
> // Windows
> setx DEEPSEEK_API_KEY "your-api-key"
> ```

>[!example] 创建简单代理
```kotlin
package com.example.koog  
  
import ai.koog.agents.core.agent.AIAgent  
import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient  
import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels  
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor  
import kotlinx.coroutines.runBlocking  
  
// 基本代理（DeepSeek）  
fun main() = runBlocking {  
    // Get an API key from the DEEPSEEK_API_KEY environment variable  
    val apiKey = System.getenv("DEEPSEEK_API_KEY")  
        ?: error("The API key is not set.")  
  
    // Create an LLM client  
    val deepSeekClient = DeepSeekLLMClient(apiKey)  
  
    // Create an agent  
    val agent = AIAgent(  
        // Create a prompt executor using the LLM client  
        promptExecutor = SingleLLMPromptExecutor(deepSeekClient),  
        // Provide a model  
        llmModel = DeepSeekModels.DeepSeekChat  
    )  
  
    fun getInput(): String {  
        print("> ")  
        return readln()  
    }  
    // Run the agent  
    val result = agent.run(getInput())  
    println(result)  
}
```
尝试运行：
```text
22:21:14: 正在执行 ':com.example.koog.DemoKt.main()'…

> Task :checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :processResources UP-TO-DATE
> Task :compileKotlin
> Task :compileJava NO-SOURCE
> Task :classes UP-TO-DATE

> Task :com.example.koog.DemoKt.main()
> 你有关注过最近的金价么
2026-02-13 22:21:48.304 [main] INFO  a.k.a.c.agent.entity.AIAgentSubgraph - Executing subgraph 'single_run' [single_run, single_run, e0b4f336-aa62-43b3-a1a3-f21816172eae]
2026-02-13 22:21:48.314 [main] INFO  a.k.a.c.agent.entity.AIAgentSubgraph - No enforced execution point, starting from __start__ [single_run, single_run, e0b4f336-aa62-43b3-a1a3-f21816172eae]
是的，我有关注到近期金价的动态。以下是近期金价走势的一些关键点，供你参考：

---

### **1. 近期金价走势特点**
   - **历史高位震荡**：2024年以来，国际金价（以伦敦金现为例）多次突破历史高点，一度触及 **2450美元/盎司** 以上（2024年5月），随后出现回调，但整体仍处于高位震荡。
   - **中国市场表现强劲**：国内黄金价格（上海黄金交易所Au99.99）受汇率、供需等因素影响，一度突破 **570元/克**，近期在550-560元/克区间波动，较国际金价溢价明显。

---

### **2. 影响金价的主要因素**
   - **地缘政治风险**：俄乌冲突、中东局势紧张等事件推升避险需求。
   - **全球央行购金**：2022-2024年多国央行（如中国、波兰、新加坡等）持续增持黄金储备，支撑长期需求。
   - **美联储政策预期**：市场对降息节奏的猜测导致美元波动，间接影响金价（例如降息预期升温时，金价通常走强）。
   - **人民币汇率**：人民币兑美元汇率波动会影响国内金价，近期人民币走弱加剧了国内金价溢价。

---

### **3. 当前市场关注点**
   - **美联储动向**：市场正在等待更明确的降息信号，任何经济数据（如通胀、就业）都可能引发金价短期波动。
   - **中国需求变化**：国内黄金消费（首饰、投资金条）是否持续旺盛，以及央行购金节奏。
   - **技术面调整**：金价在快速上涨后可能出现技术性回调，但长期看涨情绪仍占主导。

---

### **4. 普通投资者需注意**
   - **高波动性风险**：金价短期波动加大，追高需谨慎，尤其注意国内金价溢价可能收窄。
   - **投资渠道选择**：实物黄金（金条、首饰）、黄金ETF、银行积存金等各有优劣，需根据流动性、成本、保值需求选择。
   - **长期逻辑**：黄金作为抗通胀和避险资产，在资产配置中可适当配置（通常建议占投资组合的5%-10%），但不宜过度投机。

---

如果需要更具体的分析（如技术面、未来预测），可以进一步补充信息，我会尽力提供参考！ 📈

BUILD SUCCESSFUL in 52s
3 actionable tasks: 2 executed, 1 up-to-date
Consider enabling configuration cache to speed up this build: https://docs.gradle.org/9.3.1/userguide/configuration_cache_enabling.html
22:22:06: 执行完成 ':com.example.koog.DemoKt.main()'。
```

## 1.2 代理类型
### 基本代理
> [!note] AIAgent类
> 从上述的例子中，我们发现，**AIAgent**类是构建 Agent 的核心组件。
> 
> 基本代理处理单个输入并提供响应。它在一个工具调用周期内完成其任务并提供响应。此代理可以返回消息或工具结果。如果向代理提供了工具注册表，则返回工具结果。

> [!example] 基本代理示例
```kotlin
package com.example.koog  
  
import ai.koog.agents.core.agent.AIAgent  
import ai.koog.agents.core.tools.ToolRegistry  
import ai.koog.agents.ext.tool.SayToUser  
import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient  
import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels  
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor  
import kotlinx.coroutines.runBlocking  
  
val agent = AIAgent(  
    // prompExecutor 和 llmModel为创建代理的必要参数  
    promptExecutor = SingleLLMPromptExecutor(DeepSeekLLMClient(System.getenv("DEEPSEEK_API_KEY"))),  
    llmModel = DeepSeekModels.DeepSeekChat,  
  
    // 系统提示用于定义代理行为。要提供提示，请使用 systemPrompt 参数：  
    systemPrompt = "你是一个幽默大师，请你为我提到的关键词提供灵感",  
  
    // 使用 temperature 参数提供 LLM 输出生成的温度。值越高，LLM 输出的随机性越高。  
    temperature = 0.7,  
  
    // 代理使用工具来完成特定任务。您可以根据需要使用内置工具或实现自己的自定义工具。  
    // 要配置工具，请使用 toolRegistry 参数，该参数定义了代理可用的工具：  
    toolRegistry = ToolRegistry{  
        tool(SayToUser) // SayToUser 是内置工具  
    },  
  
    //使用 maxIterations 参数提供代理在被迫停止之前可以执行的最大步数：  
    maxIterations = 30  
)  
  
fun getInput(): String {  
    print("请输入：")  
    return readln()  
}  
fun main() = runBlocking {  
    val result = agent.run(getInput())  
    println(result)  
}
```

### 函数式代理
> [!note] 概述
> 函数式代理是轻量级的 AI 代理，它们无需构建复杂的策略图即可运行。 相反，代理逻辑被实现为一个 lambda 函数，该函数处理用户输入，与 LLM 交互， 可选地调用工具，并生成最终输出。它能够执行单次 LLM 调用，按序处理多个 LLM 调用，或根据用户输入以及 LLM 和工具输出进行循环。

> [!example] 创建函数式代理
> 可以通过扩展代理逻辑以处理多个顺序 LLM 调用
```kotlin
package com.example.koog  
  
import ai.koog.agents.core.agent.AIAgent  
import ai.koog.agents.core.agent.functionalStrategy  
import ai.koog.agents.core.dsl.extension.asAssistantMessage  
import ai.koog.agents.core.dsl.extension.requestLLM  
import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient  
import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels  
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor  
import kotlinx.coroutines.runBlocking  
  
// 创建 AIAgent 实例并提供系统提示、提示执行器和 LLMval mathAgent = AIAgent<String, String>(  
    systemPrompt = "你是一个数学计算助手，请你逐步计算用户的数学问题，并返回结果。",  
    promptExecutor = SingleLLMPromptExecutor(DeepSeekLLMClient(System.getenv("DEEPSEEK_API_KEY"))),  
    llmModel = DeepSeekModels.DeepSeekChat,  
    strategy = functionalStrategy { input -> // 定义代理逻辑  
        // 第一次 LLM 调用，根据用户输入生成初始草稿  
        val draft = requestLLM("Draft: $input").asAssistantMessage().content  
        // 第二次 LLM 调用，通过使用草稿内容再次提示 LLM 来改进草稿  
        val improved = requestLLM("Improve and clarify: $draft").asAssistantMessage().content  
        // 最终的 LLM 调用，以格式化改进的文本并返回最终格式化的结果  
        requestLLM("Format the result as bold: $improved").asAssistantMessage().content  
    }  
)  
  
// 使用用户输入运行代理并打印结果  
fun getQuestion() :  String {  
    println("请输入数学问题：")  
    return readln()  
}  
fun main() = runBlocking {  
    val result = agent.run(getQuestion())  
    println(result)  
}
```

### 复杂工作流代理
> [!note] 概述
> 除了基本代理，`AIAgent` 类还允许您通过定义自定义策略、工具、配置以及自定义输入/输出类型来构建处理复杂工作流的代理。

## 1.3 工具

> [!note] 工具工作流
> 代理使用工具来执行特定任务或访问外部系统。
> ## **Koog提供了以下用于处理工具的工作流**
> 1. 创建自定义工具或使用内置工具
> 2. 将工具添加至工具注册表
> 3. 将工具注册表传给代理
> 4. 将工具和代理一起使用
> ### *可用的工具类型*
> - 内置工具，提供代理和用户对话管理功能
> - 基于注解的自定义工具，允许将函数公开为 LLM 的工具
> - 基于类的自定义工具，允许用户控制工具形参、元数据、执行逻辑以及如何注册与调用它
> ### *工具注册表*
> 在使用工具之前，必须将其添加到工具注册表中。工具注册表管理代理可用的所有工具
> 
> 工具注册表的主要特性：
> - 组织工具
> - 支持合并多个工具注册表
> - 提供按照名称或类型检索工具的方法
> 
> 以下是创建工具注册表、合并工具注册表的示例
> ```kotlin
> // 创建工具注册表
> val firstToolRegistry = ToolRegistry{
> 	tool(FirstSampleTool)
> }
> // 创建工具注册表
> val secondToolRegistry = ToolRegistry{
> 	tool(SecondSampleTool)
> }
> // 将上述两个注册表合并
> val newToolRegistry = firstToolRegistry + secondToolRegistry
> ```
> ### *将工具传递给代理*
> 要使代理能够使用工具，必须将工具传给代理
> ```kotlin
> // 代理初始化
>val agent = AIAgent(
>    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
>    systemPrompt = "You are a helpful assistant with strong mathematical skills.",
>    llmModel = OpenAIModels.Chat.GPT4o,
>    // 将工具注册表传递给代理
>    toolRegistry = toolRegistry
>)
> ```
> ### *调用工具*
> 在代理代码中，有几种方式可以调用工具。推荐的方法是使用代理上下文中提供的方法，而非直接调用工具，这能够保证在代理环境中正确调用工具。**需要确保在工具中实现了适当的错误处理机制，防止代理失败**
> 工具在由`AIAgentLLMWriteSession`表示的特定上下文中被调用，它提供了几种调用工具的方法，便于用户：
> - 使用给定实参调用工具
> - 按其名称和给定实参调用工具
> - 按提供的工具类和实参调用工具
> - 使用指定实参调用指定类型的工具
> - 调用返回原始字符串结果的工具
> 
> #### 并行工具调用
> 可以使用 `toParallelToolCallsRaw` 扩展并行调用工具
> 
> #### 从节点调用工具
> 当使用节点构建代理工作流时，可以使用特殊节点来调用工具。
> - `nodeExecuteTool`：调用单个工具并返回结果
> - `nodeExecuteSingleTool`：使用提供的实参调用特定的工具
> - `nodeExecuteMultipleTools`：执行多个工具调用并返回结果
> - `nodeLLMSendToolResult`：向 LLM 发送工具结果并返回响应
> - `nodeLLMSendMultipleToolResults`：向 LLM 发送多个工具结果
> 详情参考：[API Reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)
> ### *将代理用作工具*
> 该框架提供了将任意 AI 代理转换为工具的能力，该工具可供其他代理使用。这项强大的特性使您能够创建层次化代理架构，其中专门的代理可以作为工具被更高层级的编排代理调用
> #### 将代理转换为工具
> 要将代理转换为工具，需要使用`asTool()`扩展函数
> ```kotlin
> // 创建一个专门的代理服务，负责创建财务分析代理。
>val analysisAgentService = AIAgentService(
>    promptExecutor = simpleOpenAIExecutor(apiKey),
>    llmModel = OpenAIModels.Chat.GPT4o,
>    systemPrompt = "You are a financial analysis specialist.",
>    toolRegistry = analysisToolRegistry
>)
>
>// 创建一个在调用时运行财务分析代理的工具。
>val analysisAgentTool = analysisAgentService.createAgentTool(
>    agentName = "analyzeTransactions",
>    agentDescription = "Performs financial transaction analysis",
>    inputDescription = "Transaction analysis request",
>)
> ```
> #### 在其他代理中使用代理工具
> 当代理转换为工具，用户可以将代理工具添加到另一个代理的工具注册表中
> ```kotlin
> // 创建一个协调代理，它可以使用专门的代理作为工具
>val coordinatorAgent = AIAgent(
>    promptExecutor = simpleOpenAIExecutor(apiKey),
>    llmModel = OpenAIModels.Chat.GPT4o,
>    systemPrompt = "You coordinate different specialized services.",
>    toolRegistry = ToolRegistry {
>        tool(analysisAgentTool)
>        // 按需添加其他工具
>    }
>)
> ```
> #### 代理工具执行
> 使用代理工具时：
> 1. 实参根据输入描述符进行反序列化
> 2. 包装的代理使用反序列号的输入执行
> 3. 代理的输出被序列号并作为工具结果返回
> 
> #### 代理作为工具的优势
> - 模块化：将复杂的工作流分解为专门的代理
> - 可重用性：在多个协调代理中重用相同的专门代理
> - 关注点分离：每个代理可以专注于其特定的领域

### 内置工具
> [!note] 概述
> Koog 提供的内置工具，用于处理代理与用户交互的常见场景
> 
> ## **注册内置工具**
> 与任何其他工具一样，内置工具必须添加到工具注册表才能供代理使用

|        工具         |          名称          |                       描述                       |
| :---------------: | :------------------: | :--------------------------------------------: |
|     SayToUser     |  `__say_to_user__`   | 允许代理向用户发送消息。它会将代理消息打印到控制台，并带有 `Agent says:` 前缀 |
|      AskUser      |    `__ask_user__`    |        允许代理向用户请求输入。它会将代理消息打印到控制台并等待用户响应        |
|     ExitTool      |      `__exit__`      |                 允许代理结束对话并终止会话                  |
|   ReadFileTool    |   `__read_file__`    |   读取文本文件，支持可选的行范围选择。返回带有元数据和基于 0 的行索引的格式化内容    |
|   EditFileTool    |   `__edit_file__`    |       对文件进行单次、有针对性的文本替换；也可以创建新文件或完全替换其内容       |
| ListDirectoryTool | `__list_directory__` |      列出目录内容，以分层树状结构显示，支持可选的深度控制和 glob 过滤       |
|   WriteFileTool   |   `__write_file__`   |             将文本内容写入文件（如有需要，可创建父目录）             |
> [!example] 示例
```kotlin
// 创建一个包含所有内置工具的工具注册表
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// 在创建代理时传入注册表
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)
```

### 基于注解的自定义工具
> [!note] 概述
> 基于注解的工具提供了一种声明式的方式，用于将函数作为工具暴露给大语言模型（LLM）。通过使用注解，你可以将任何函数转换为 LLM 可以理解和使用的工具。
> 
> 当你需要将现有功能性暴露给 LLM，而无需手动实现工具描述时，这种方法非常有用。
> ## **关键注解**
> - `@Tool`：标记应作为工具暴露给 LLM 的函数
> - `@LLMDescription`：提供有关工具及其组件的描述性信息
> 
> ### `@Tool`注解
> #### 定义
> `@Tool` 注解用于标记应作为工具暴露给 LLM 的函数。 带有 `@Tool` 注解的函数通过反射从实现了 `ToolSet` 接口的对象中收集
> ```kotlin
> @Target(AnnotationTarget.FUNCTION)
>public annotation class Tool(val customName: String = "")
> ```
> #### 形参
> `customName`：非必须，指定工具的名称，如果未指定，则使用函数名称
> #### 用法
> 如果要将函数标记为 Tool，需要在**实现ToolSet**接口的类中将`@Tool`注解用于该函数
> ```kotlin
> class MyToolSet : ToolSet{
> 	@Tool
> 	fun myTool(): String{
> 		// 工具实现
> 		return result
> 	}
> 	@Tool
> 	fun anotherTool(): String{
> 		// 工具实现
> 		return result
> 	}
> }
> ```
> 
> ### `@LLMDescription`注解
> #### 定义
> `@LLMDescription` 注解向 LLM 提供有关代码元素（类、函数、形参等）的描述性信息。 这有助于 LLM 理解这些元素的用途和用法
> ```kotlin
> @Target(
>    AnnotationTarget.PROPERTY,
>    AnnotationTarget.CLASS,
>    AnnotationTarget.PROPERTY,
>    AnnotationTarget.TYPE,
>    AnnotationTarget.VALUE_PARAMETER,
>    AnnotationTarget.FUNCTION
>)
>public annotation class LLMDescription(val description: String)
> ```
> #### 形参
> `description`：必须提供的参数，描述被注解元素的字符串
> #### 用法
> 可以将`@LLMDescription` 注解用于不同层次中
> - 函数级别
> ```kotlin
>@Tool
>@LLMDescription("Performs a specific operation and returns the result")
>fun myTool(): String {
>    // Function implementation
>    return "Result"
>}
> ```
> - 形参级别
> ```kotlin
>@Tool
>@LLMDescription("Processes input data")
>fun processTool(
>    @LLMDescription("The input data to process")
>    input: String,
>
>    @LLMDescription("Optional configuration parameters")
>    config: String = ""
): String {
>    // Function implementation
>    return "Processed: $input with config: $config"
>}
> ```
> ## **使用步骤**
> ### 1. 实现`ToolSet`接口
> 创建一个实现 `ToolSet` 接口的类。 此接口将你的类标记为工具的容器
> ```kotlin
> class MyFristToolSet : ToolSet{
> 	// 工具
> }
> ```
> ### 2. 添加工具函数
> 向你的类添加函数，并用 `@Tool` 注解它们以将它们作为工具暴露
> ```kotlin
> class MyFristToolSet : ToolSet{
> 	@Tool
> 	fun getWeather(location: String): String{
> 		// 实际应用时，应调用相应的API
> 		return result
> 	}
> }
> ```
> ### 3. 添加描述
> 添加 `@LLMDescription` 注解以向 LLM 提供上下文
> ```kotlin
> @LLMDescription("用于获取天气信息的工具集")
> class MyFristToolSet : ToolSet{
> 	@Tool
> 	@LLMDescription("获取当前指定地点的天气信息")
> 	fun getWeather(
> 		@LLMDescription("国家和地区")
> 		location: String
> 	): String{
> 		// 实际应用时，应调用相应的API
> 		return result
> 	}
> }
> ```
> ### 4. 将工具和代理一起使用
> ```kotlin
> fun main(){
> 	runBlocking{
> 		// 创建工具集
> 		val weatherTools = MyFristToolSet()
> 		
> 		// 创建使用上述工具集的agent
> 		val agent = AIAgent(
> 			// 根据实际使用的模型进行修改
> 			promptExecutor = singleOpenAIExecutor(apikey),
> 			systemPrompt = "根据提供的国家和地区提供对应的天气信息",
> 			llmModel = OpenAIModels.Chat.GPT4,
> 			toolRegistry = ToolRegistry{
> 				tools(weatherTools)
> 			}
> 		)
> 		agent.run("北京的天气怎么样")
> 	}
> }
> ```

> [!example] 使用示例：诊断工具
```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription  
import ai.koog.agents.core.tools.annotations.Tool  
import ai.koog.agents.core.tools.reflect.ToolSet  
  
@LLMDescription("用于对设备执行诊断和故障排除的工具")  
class DiagnosticToolSet : ToolSet {  
    @Tool  
    @LLMDescription("对设备运行诊断以检查其状态并识别任何问题")  
    fun runDiagnostic(  
        @LLMDescription("要诊断的设备ID")  
        deviceId: String,  
  
        @LLMDescription("诊断的附加信息（可选）")  
        additionalInfo: String = ""  
    ): String {  
        // 具体实现  
        return "设备 $deviceId 的诊断结果"  
    }  
  
    @Tool  
    @LLMDescription("分析错误代码以确定其含义和可能的解决方案")  
    fun analyzeError(  
        @LLMDescription("要分析的错误代码（例如，'E1001'）")  
        errorCode: String  
    ): String {  
        // 具体实现  
        return "错误代码 $errorCode 的分析"  
    }  
}
```

> [!success] 最佳实践与常见问题排查
> ## **最佳实践**
> - 提供清晰的描述：编写清晰、简洁的描述，解释工具、形参和返回值的用途和行为
> - 描述所有形参：向所有形参添加 `@LLMDescription` 以帮助 LLM 理解每个形参的用途
> - 使用一致的命名：对工具和形参使用一致的命名约定，使其更直观
> - 分组相关工具：在同一 `ToolSet` 实现中分组相关工具，并提供类级别描述
> - 返回信息丰富的结果：确保工具返回值提供关于操作结果的清晰信息
> - 优雅地处理错误：在你的工具中包含错误处理，并返回信息丰富的错误消息
> - 文档默认值：当形参有默认值时，请在描述中记录这一点
> - 保持工具专注：每个工具都应执行一个特定的、定义明确的任务，而不是试图做太多事情
> 
> ## **常见问题排查**
> ### *工具未被识别*
> 如果代理未识别到工具，请排查以下问题：
> - 类是否实现了`ToolSet`接口
> - 所有工具函数都带有`@Tool`注解
> - 工具函数都有适当的返回类型（简单起见，建议使用String）
> - 工具正确注册到 agent 中
> ### *工具描述不清晰*
> 如果 LLM 未正确使用你的工具或误解了它们的用途，请尝试以下操作：
> - 改进 `@LLMDescription` 注解，使其更具体和清晰
> - 如果合适，请在描述中添加示例
> - 在描述中指定形参约束（如"必须是正数"）
> - 在整个描述中保持术语的一致性
> ### *形参类型问题*
> 如果 LLM 提供了不正确的形参类型，请尝试以下操作：
> - 如果可能，使用简单的形参类型（`String`、`Boolean`、`Int`）
> - 在形参描述中清晰描述预期格式
> - 对于复杂类型，考虑使用带有特定格式的 `String` 形参，并在你的工具中解析它们
> - 在形参描述中包含有效输入的示例
> ### *性能问题*
> 如果你的工具导致性能问题，请尝试以下操作：
> - 保证工具实现轻量级
> - 对于资源密集型操作，考虑实现异步处理
> - 在适当的时候缓存结果
> - 记录工具使用情况以识别瓶颈


### 基于类的工具
> [!note] 概述
> 基于类的工具是 Koog 提供的一种高度灵活且可定制的工具实现方式，它允许开发者完全控制工具的参数、元数据、执行逻辑以及注册和调用方式。这种级别的控制非常适合构建能够扩展基本用例的复杂工具，从而实现与代理会话和工作流的无缝集成。通过实现 `ToolSet` 接口并使用 `@Tool` 和 `@LLMDescription` 注解，开发者可以将函数声明为 LLM 可以调用的工具，并为这些工具提供清晰的描述信息，以帮助 LLM 更好地理解和使用它们。基于类的工具不仅支持自定义功能，还允许将工具组织成逻辑相关的集合，并通过工具注册表进行统一管理，从而实现模块化、可重用性和关注点分离，提升整体开发效率和系统的可维护性。该 API 是多平台的，用户可以在不同平台使用相同的工具
> 
> ## **工具实现**
> Koog 框架提供以下工具的实现方法：
> - 对于所有工具，使用基类`Tool`。当用户***需要返回非文本结果或需要完全控制工具行为***时，应使用此基类
> - 使用`SimpleTool`类，该类扩展了基类`Tool`并简化了返回文本结果工具的构建。当工具***仅需要返回文本***时，应使用此方法
> 
> ### `Tool`类
> `Tool<Args,Result>`抽象类是 Koog 中创建工具的基类，它允许您创建接受特定实参类型 (`Args`) 并返回各种类型 (`Result`) 结果的工具，每个工具都包含下列组件：
> - `Args`：定义工具所需实参的**可序列化数据类**
> - `Result`：工具返回的可序列化结果类型。如果希望以自定义格式呈现工具结果，需要继承`ToolResult.TextSerializable`类并实现`textForLLM(): String`方法
> - `argsSerializer`：重写变量，定义工具结果的反序列化方式。如果要继承`ToolResult.TextSerializable`类，需要考虑使用`ToolResultUtils.toTextSerializer()`
> - `descriptor`：重写变量，指定工具所需元数据：
> 	- `name`
> 	- `description`
> 	- `requiredParameters`（默认为空）
> 	- `optionalParameters`（默认为空）
> - `execute`：实现工具逻辑的函数，它接受`Args`类型的实参并返回`Result`类型的结果
> Tip：确保工具具有清晰的描述和定义良好的参数名称，以便 LLM 能够正确地理解并使用它们
> 使用示例：
> ```kotlin
> // 自定义一个简单的计算器工具，用于添加两个数字
> object CalculatorTool : Tool<Calculator.Args,Int>(){
> 	// 计算器工具的实参
> 	@Serializable
> 	data class Args(
> 		@property:LLMDescription("要添加的第一个数字")
> 		val digit1: Int,
> 		@property:LLMDescription("要添加的第二个数字")
> 		val digit2: Int
> 	){
> 		init{
> 			require(digit1 in 0..9){"digit1 必须是0～9之间的数字"}
> 			require(digit2 in 0..9){"digit2 必须是0～9之间的数字"}
> 		}
> 	}
> 	
> 	// Args类的序列化器
> 	override val argsSerializer = Args.serializer()
> 	override val resultSerializer = Int.serializer()
> 	
> 	// 工具名称（对LLM可见），默认将从类名派生
> 	override val name = "计算器"
> 	
> 	// 工具描述（对LLM可见），必填
> 	override val description = "用于相加两个数字的简易计算器"
> 	
> 	// 添加两个数字的函数
> 	override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
> }
> // 在实现工具后，需要将工具添加至工具注册表中
> ```
> ### `SimpleTool`类
> `SimpleTool<Args>`抽象类扩展了`Tool<Args,ToolResult.Text>`，并简化了返回文本结果的工具的创建，每个工具都包含以下组件：
> - `Args`：定义自定义工具所需实参的**可序列化数据类**
> - `argsSerializer`：重写变量，定义工具实参的序列化方式
> - `discriptor`：重写变量，指定工具元数据：
> 	- `name`
> 	- `discriptor`
> 	- `requiredParameters`（默认为空）
> 	- `optionalParameters`（默认为空）
> - `doExecutor`：重写函数，描述工具执行的主要操作。它接受 `Args` 类型的实参并返回一个 `String`
> 使用示例：
> ```kotlin
> // 创建一个将字符串表达式转换为双精度值的工具
> object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(){
> 	// 定义工具实参
> 	@Serializable
> 	data class Args(
> 		@property:LLMDescription("将表达式转换为双精度")
> 		val expression: String,
> 		@property:LLMDescription("关于如何处理这个表达式的备注")
> 		val comment: String
> 	)
> 	// Args的序列化器
> 	override val argsSerializer = Args.serializer(
> 	)
> 	// 工具描述，对LLM可见
> 	override discription = "将字符串表达式转换为双精度值"
> 	
> 	// 使用提供的实参执行工具的函数
> 	override suspend fun doExecute(args: Args): String{
> 		return "结果：${castToDouble(args.expression)}," + "备注：{$args.comment}"
> 	}
> 	// 将字符串表达式转换为双精度值的函数
> 	private fun castToDouble(expression: String): Double{
> 		return expression.toDoubleOrNull() ?: 0.0
> 	}
> }
> // 在实现工具后，需要将工具添加至工具注册表中
> ```
> ### 以自定义格式将结果发送给LLM
> 如果对发送给 LLM 的 JSON 结果不满意（例如，在某些情况下，如果工具输出以 Markdown 格式结构化，LLM 可以更好地工作），您必须遵循以下步骤：
> 1. 实现 `ToolResult.TextSerializable` 接口，并重写`textForLLM()` 方法
> 2. 重写 `resultSerializer`，使用 `ToolResultUtils.toTextSerializer<T>()`
> 
> 使用示例：
> ```kotlin
> // 一个编辑文件的工具
> object EditFile : Tool<EditFile.Args,EditFile.Result>(){
> 	// 定义工具实参
> 	@Serializable
> 	public data class Args(
> 		val path: String,
> 		val original: String,
> 		val replacement: String 
> 	)
> 	// 结果数据类
> 	@Serializable
> 	public data class Result(
> 		private val patchApplyResult: PatchApplyResult
> 	){
> 		@Serializable
> 		public sealed interface PatchApplyResult{
> 			@Serializable
> 			data class Success(val updatedContent: String): PatchApplyResult
> 			
> 			@Serializable
> 			data class Failure(public val reason: String): PatchApplyResult
> 		}
> 		// 工具完成后，LLM将看到的文本输出（Markdown）
> 		fun textForLLM(): String = markdown{
> 			if(PatchApplyResult is PatchApplyResult.Success){
> 				line{
> 					bold("Successfully").text("edited file(patch applied)")
> 				}
> 			}else{
> 				line{
> 					text("File was")
> 						.bold("not")
> 						.text("modified(patch application failed):${(patchApplyResult as PatchApplyResult.Failure).reason}")
> 				}
> 			}
> 		}
> 		override fun toString(): String = textForLLM()
> 	}
> 	// Args 和 Result类的序列化器
> 	override val argsSerializer = Args.serializer()
> 	override val resultSerializer = Result.serializer()
> 	
> 	// 工具描述，对 LLM 可见
> 	override val description = "编辑用户提供的文件"
> 	
> 	// 使用提供的实参执行工具的函数
> 	override suspend fun execute(args: Args): Result{
> 		return TODO("具体实现的内容")
> 	}
> }
> ```


### 工具总结
> [!summary] 根据业务逻辑的复杂度，选择合适方式创建工具

|    工具类型    | 复杂度 |   使用场景   |     特点      |
| :--------: | :-: | :------: | :---------: |
|    内置工具    |  低  |   简单交互   |  快速使用，无需开发  |
| 基于注解的自定义工具 |  中  |  简单功能暴露  | 简化工具暴露，提供描述 |
| 基于类的自定义工具  |  高  | 复杂逻辑和定制化 | 高度灵活，支持复杂功能 |

## 1.4 Agent 事件
> [!note] 概述
> Agent 事件是作为 Agent 工作流一部分发生的操作或交互。它们包括：
> - Agent 生命周期事件
> - 策略事件
> - 节点执行事件
> - LLM 调用事件
> - LLM 流式事件
> - 工具执行事件
> 
> **注意**：特性事件定义在`agents-core`模块中，位于包`ai.koog.agents.core.feature.model.events`下。`agents-features-trace`和`agents-feature-event-handler`等特性会消费这些事件，以处理和转发在 Agent 执行期间创建的消息

### 预定义事件类型
> [!tip] Koog 提供了可用于自定义消息处理器的预定义事件类型。这些预定义事件可以根据它们相关的实体分为几个类别：
> - Agent 事件
> - 策略事件
> - 节点事件
> - LLM 调用事件
> - LLM 流式事件
> - 工具执行事件

#### Agent事件
##### `AgentStartingEvent`
> [!note] 概述
> 表示 Agent 事件的开始，包含以下字段：

|   名称    |  数据类型  | 是否必需 | 默认值 |        描述        |
| :-----: | :----: | :--: | :-: | :--------------: |
| agentId | String |  是   |     |  AI Agent唯一标识符   |
|  runId  | String |  是   |     | AI Agent运行的唯一标识符 |

##### `AgentCompledEvent`
> [!note] 概述
> 表示 Agent 事件的结束，包含以下字段：

|   名称    |  数据类型  | 是否必需 | 默认值 |           描述           |
| :-----: | :----: | :--: | :-: | :--------------------: |
| agentId | String |  是   |     |     AI Agent唯一标识符      |
|  runId  | String |  是   |     |    AI Agent运行的唯一标识符    |
| result  | String |  是   |     | Agent运行结果，如果没有，可以为null |
##### `AgentExecutionFailedEvent`
> [!note] 概述
> 表示 Agent 运行期间发生错误，包含以下字段：

|   名称    |     数据类型     | 是否必需 | 默认值 |         描述         |
| :-----: | :----------: | :--: | :-: | :----------------: |
| agentId |    String    |  是   |     |   AI Agent唯一标识符    |
|  runId  |    String    |  是   |     |  AI Agent运行的唯一标识符  |
|  error  | AIAgentError |  是   |     | AI Agent运行时发生的特定错误 |
##### `AgentClosingEvent`
> [!note] 概述
> 表示 Agent 的关闭或终止，包含以下字段：

|   名称    |  数据类型  | 是否必需 | 默认值 |        描述        |
| :-----: | :----: | :--: | :-: | :--------------: |
| agentId | String |  是   |     |  AI Agent唯一标识符   |

> [!tip] `AIAgentError`类提供了关于在Agent运行期间发生错误的更多详情

|     名称     |  数据类型  | 是否必需 | 默认值  |       描述        |
| :--------: | :----: | :--: | :--: | :-------------: |
|  message   | String |  是   |      |  提供关于特定错误的详细信息  |
| stackTrace | String |  是   |      | 直到最后执行代码的堆栈记录集合 |
|   cause    | String |  否   | null |   如果可用，表示致错原因   |
#### 策略事件
##### `GraphStrategyStartingEvent`
> [!note] 概述
> 表示基于图的策略运行的开始，包含以下字段：

|      名称      |        数据类型        | 是否必需 | 默认值 |     描述      |
| :----------: | :----------------: | :--: | :-: | :---------: |
|    runId     |       String       |  是   |     |  策略运行唯一标识符  |
| strategyName |       String       |  是   |     |    策略名称     |
|    graph     | StrategyEventGraph |  是   |     | 表示策略工作流的图结构 |
##### `FunctionalStrategyStartingEvent`
> [!note] 概述
> 表示函数式策略运行的开始，包含以下字段：

|      名称      |  数据类型  | 是否必需 | 默认值 |    描述     |
| :----------: | :----: | :--: | :-: | :-------: |
|    runId     | String |  是   |     | 策略运行唯一标识符 |
| strategyName | String |  是   |     |   策略名称    |
##### `StrategyCompletedEvent`
> [!note] 概述
> 表示策略运行的结束，包含以下字段：

|      名称      |  数据类型  | 是否必需 | 默认值 |         描述         |
| :----------: | :----: | :--: | :-: | :----------------: |
|    runId     | String |  是   |     |     策略运行唯一标识符      |
| strategyName | String |  是   |     |        策略名称        |
|    result    | String |  否   |     | 运行的结果，如果没有，可以为null |

#### 节点事件
##### `NodeExecutionStartingEvent`
> [!note] 概述
> 表示节点运行的开始，包含以下字段：

|    名称    |    数据类型     | 是否必需 | 默认值  |     描述     |
| :------: | :---------: | :--: | :--: | :--------: |
|  runId   |   String    |  是   |      | 策略运行的唯一标识符 |
| nodeName |   String    |  是   |      | 运行开始时节点名称  |
|  input   | JsonElement |  否   | null |   节点的输入值   |
##### `NodeExecutionCompletedEvent`
> [!note] 概述
> 表示节点运行的结束，包含以下字段：

|    名称    |    数据类型     | 是否必需 | 默认值  |     描述     |
| :------: | :---------: | :--: | :--: | :--------: |
|  runId   |   String    |  是   |      | 策略运行的唯一标识符 |
| nodeName |   String    |  是   |      | 运行开始时节点名称  |
|  input   | JsonElement |  否   | null |   节点的输入值   |
|  output  | JsonElement |  否   | null |  节点产生的输出值  |
##### `NodeExecutionFailedEvent`
> [!note] 概述
> 表示，包含以下字段：

|    名称    |     数据类型     | 是否必需 | 默认值  |       描述       |
| :------: | :----------: | :--: | :--: | :------------: |
|  runId   |    String    |  是   |      |   策略运行的唯一标识符   |
| nodeName |    String    |  是   |      |   运行开始时节点名称    |
|  input   | JsonElement  |  否   | null |     节点的输入值     |
|  error   | AIAgentError |  是   |      | 在节点运行期间发生的特定错误 |

#### LLM 调用事件
##### `LLMCallStartingEvent`
> [!note] 概述
> 表示LLM调用的开始，包含以下字段：

|   名称   |      数据类型      | 是否必需 | 默认值 |                描述                |
| :----: | :------------: | :--: | :-: | :------------------------------: |
| runId  |     String     |  是   |     |            LLM运行唯一标识符            |
| callId |     String     |  是   |     |       LLM调用的唯一标识符，用于关联相关事件       |
| prompt |     Prompt     |  是   |     |           发送给模型的Prompt           |
| model  |     String     |  是   |     | 模型标识符，格式为`llm_provider:model_id` |
| tools  | `List<String>` |  是   |     |           模型可以调用的工具列表            |
> [!tip] `Prompt`类
> `Prompt`类表示一个Prompt 的数据结构，由消息 list、唯一标识符和用于语言模型设置的可选形参组成。包括以下字段

|    名称    |      数据类型       | 是否必需 |      默认值      |       描述       |
| :------: | :-------------: | :--: | :-----------: | :------------: |
| messages | `List<Message>` |  是   |               | 构成Prompt的消息列表  |
|    id    |     String      |  是   |               |  Prompt的唯一标识   |
|  params  |    LLMParams    |  否   | `LLMParams()` | 控制LLM生成内容方式的设置 |
##### `LLMCallCompletedEvent`
> [!note] 概述
> 表示LLM调用的结束，包含以下字段：

|         名称         |           数据类型           | 是否必需 | 默认值  |                描述                |
| :----------------: | :----------------------: | :--: | :--: | :------------------------------: |
|       runId        |          String          |  是   |      |            LLM运行唯一标识符            |
|       callId       |          String          |  是   |      |       LLM调用的唯一标识符，用于关联相关事件       |
|       prompt       |          Prompt          |  是   |      |           发送给模型的Prompt           |
|       model        |          String          |  是   |      | 模型标识符，格式为`llm_provider:model_id` |
|     responses      | `List<Message.Response>` |  是   |      |           模型返回的一个或多个响应           |
| moderationResponse |     ModerationResult     |  否   | null |           如果可用，表示审核响应            |

#### LLM 流式事件
##### `LLMStreamingStartingEvent`
> [!note] 概述
> 表示 LLM 流式调用的开始，包含以下字段：


|   名称   |      数据类型      | 是否必需 | 默认值 |                描述                |
| :----: | :------------: | :--: | :-: | :------------------------------: |
| runId  |     String     |  是   |     |            LLM运行唯一标识符            |
| callId |     String     |  是   |     |       LLM调用的唯一标识符，用于关联相关事件       |
| prompt |     Prompt     |  是   |     |           发送给模型的Prompt           |
| model  |     String     |  是   |     | 模型标识符，格式为`llm_provider:model_id` |
| tools  | `List<String>` |  是   |     |           模型可以调用的工具列表            |

##### `LLMStreamingFrameReceivedEvent`
> [!note] 概述
> 表示从 LLM 接收到的流式帧，包含以下字段：

|   名称   |    数据类型     | 是否必需 | 默认值 |          描述          |
| :----: | :---------: | :--: | :-: | :------------------: |
| runId  |   String    |  是   |     |      LLM运行唯一标识符      |
| callId |   String    |  是   |     | LLM调用的唯一标识符，用于关联相关事件 |
| frame  | StreamFrame |  是   |     |       从流中接收到的帧       |

##### `LLMStreamingFailedEvent`
> [!note] 概述
> 表示流式调用期间发生错误，包含以下字段：

|   名称   |     数据类型     | 是否必需 | 默认值 |          描述          |
| :----: | :----------: | :--: | :-: | :------------------: |
| runId  |    String    |  是   |     |      LLM运行唯一标识符      |
| callId |    String    |  是   |     | LLM调用的唯一标识符，用于关联相关事件 |
| error  | AIAgentError |  是   |     |    在流式传输期间发生的特定错误    |
##### `LLMStreamingCompletedEvent`
> [!note] 概述
> 表示 LLM 流式调用的结束，包含以下字段：

|   名称   |      数据类型      | 是否必需 | 默认值 |                描述                |
| :----: | :------------: | :--: | :-: | :------------------------------: |
| runId  |     String     |  是   |     |            LLM运行唯一标识符            |
| callId |     String     |  是   |     |       LLM调用的唯一标识符，用于关联相关事件       |
| prompt |     Prompt     |  是   |     |           发送给模型的Prompt           |
| model  |     String     |  是   |     | 模型标识符，格式为`llm_provider:model_id` |
| tools  | `List<String>` |  是   |     |           模型可以调用的工具列表            |
#### 工具执行事件
##### `ToolExecutionStartingEvent`
> [!note] 概述
> 表示模型调用工具的事件，包含以下字段：

|     名称     |    数据类型    | 是否必需 | 默认值  |       描述        |
| :--------: | :--------: | :--: | :--: | :-------------: |
|   runId    |   String   |  是   |      | 策略/Agent运行的唯一标识 |
| toolCallId |   String   |  否   | null | 如果可用，表示工具调用的标识符 |
|  toolName  |   String   |  是   |      |      工具的名称      |
|  toolArgs  | JsonObject |  是   |      |    提供给工具的实参     |

##### `ToolValidationFailedEvent`
> [!note] 概述
> 表示工具在调用期间发生验证错误，包含以下字段：

|     名称     |    数据类型    | 是否必需 | 默认值  |       描述        |
| :--------: | :--------: | :--: | :--: | :-------------: |
|   runId    |   String   |  是   |      | 策略/Agent运行的唯一标识 |
| toolCallId |   String   |  否   | null | 如果可用，表示工具调用的标识符 |
|  toolName  |   String   |  是   |      |      工具的名称      |
|  toolArgs  | JsonObject |  是   |      |    提供给工具的实参     |
|   error    |   String   |  是   |      |     验证错误消息      |
##### `ToolExecutionFailedEvent`
> [!note] 概述
> 表示执行工具失败，包含以下字段：

|     名称     |     数据类型     | 是否必需 | 默认值  |       描述        |
| :--------: | :----------: | :--: | :--: | :-------------: |
|   runId    |    String    |  是   |      | 策略/Agent运行的唯一标识 |
| toolCallId |    String    |  否   | null | 如果可用，表示工具调用的标识符 |
|  toolName  |    String    |  是   |      |      工具的名称      |
|  toolArgs  |  JsonObject  |  是   |      |    提供给工具的实参     |
|   error    | AIAgentError |  是   |      | 尝试调用工具时发生的特定错误  |
##### `ToolExecutionCompletedEvent`
> [!note] 概述
> 表示成功调用工具并返回结果，包含以下字段：

|     名称     |    数据类型    | 是否必需 | 默认值  |       描述        |
| :--------: | :--------: | :--: | :--: | :-------------: |
|   runId    |   String   |  是   |      | 策略/Agent运行的唯一标识 |
| toolCallId |   String   |  否   | null | 如果可用，表示工具调用的标识符 |
|  toolName  |   String   |  是   |      |      工具的名称      |
|  toolArgs  | JsonObject |  是   |      |    提供给工具的实参     |
|   result   |   String   |  是   |      |   工具调用的结果（可空）   |
### 常见问题和故障排查

#### 如何仅跟踪 Agent 执行的特定部分？
> [!success] 使用`messageFilter`属性过滤事件
```kotlin
install(Tracing) {
    val fileWriter = TraceFeatureMessageFileWriter(
        outputPath, 
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )
    addMessageProcessor(fileWriter)
    
    // 仅跟踪 LLM 调用
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```

#### 是否可以使用多个消息处理器？
> [!success] 可以添加多个消息处理器跟踪不同的目标
```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, syncOpener))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```

#### 如何创建自定义消息处理器？
> [!success] 实现 `FeatureMessageProcessor` 接口
```kotlin
class CustomTraceProcessor : FeatureMessageProcessor() {

    // 处理器当前的开放状态
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()
    
    override suspend fun processMessage(message: FeatureMessage) {
        // 自定义处理逻辑
        when (message) {
            is NodeExecutionStartingEvent -> {
                // 处理节点启动事件
            }

            is LLMCallCompletedEvent -> {
                // 处理 LLM 调用结束事件 
            }
            // 处理其他事件类型 
        }
    }

    override suspend fun close() {
        // 关闭已建立的连接
    }
}

// 使用你的自定义处理器
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```


## 1.5 策略
### 预定义节点和组件
> [!important] 节点
> 节点是 Koog 框架中 agent 工作流的基本构建块。每个节点代表工作流中的特定操作或转换，它们通过边（edge）连接起来以定义执行流，通常，它们让你将复杂逻辑封装到可重用组件中，这些组件可以轻松集成到 不同的 agent 工作流中。

#### 实用程序节点
> [!note] `nodeDoNothing`
> 一个简单的直通节点，它不执行任何操作并将输入作为输出返回
> 
> 此节点用于以下目的：
> - 在图中创建`placeholder`节点
> - 创建连接点而不修改数据
> 
> 使用示例：
> ```kotlin
> val passthrough by nodeDoNothing<String>("passthrough")
>
>edge(nodeStart forwardTo passthrough)
>edge(passthrough forwardTo nodeFinish)
> ```
#### LLM 节点
##### `nodeAppendPrompt`
> [!note] 概述
> 一个使用所提供的 prompt 构建器向 LLM prompt 添加消息的节点。 这对于在进行实际 LLM 请求之前修改对话上下文很有用
> 
> 此节点可用于以下目的：
> - 向 prompt 添加系统指令
> - 将用户信息插入到对话中
> - 为后续 LLM 请求准备上下文
```kotlin
// 示例
val firstNode by node<Input, Output> {
    // Transform input to output
}

val secondNode by node<Output, Output> {
    // Transform output to output
}

// 节点将从上一个节点获取 Output 类型的值作为输入，并将其路径传递到下一个节点
val setupContext by nodeAppendPrompt<Output>("setupContext") {
    system("You are a helpful assistant specialized in Kotlin programming.")
    user("I need help with Kotlin coroutines.")
}

edge(firstNode forwardTo setupContext)
edge(setupContext forwardTo secondNode)
```

> [!important] 1.0 节点命名规范
> Koog 1.0 对 LLM 节点命名进行了正式定型，形成两套体系：
> - **String-input 节点**（接受纯 String 输入）：保留原名，如 `nodeLLMRequest`、`nodeLLMRequestOnlyCallingTools`、`nodeLLMRequestWithoutTools`、`nodeLLMRequestMultiple` 等
> - **`Message.User`-input 节点**（接受构造好的消息对象）：统一使用 `nodeLLMSendMessage*` 前缀
>
> 此外：
> - `nodeExecuteTools` 直接返回 `ReceivedToolResults`（非 raw JSON），类型安全到位
> - 新增 `nodeLLMModerateText` 支持纯 String 输入的内容审核
>
> 升级时需做一次节点名称迁移，IDE 的 `Find and Replace` 可批量处理。

##### `nodeLLMSendMessageOnlyCallingTools`
> [!note] 概述
> 一个将用户消息附加到 LLM prompt 并获取 LLM 只能调用 tool 的响应的节点
##### `nodeLLMSendMessageForceOneTool`
> [!note] 概述
> 一个将用户消息附加到 LLM prompt 并**强制 LLM 使用特定 tool 的节点**
##### `nodeLLMRequest`
> [!note] 概述
> 一个将用户消息附加到 LLM prompt 并获取带可选 tool 使用的响应的节点。节点配置决定了在处理消息期间是否允许 tool 调用
> 
> 此节点用于以下目的：
> - 为当前 prompt 生成 LLM 响应，控制 LLM 是否允许生成 tool 调用。
```kotlin
// example
val requestLLM by nodeLLMRequest("requestLLM", allowToolCalls = true)
edge(getUserQuestion forwardTo requestLLM)
```

##### `nodeLLMRequestStructed`
> [!note] 概述
> 一个将用户消息附加到 LLM prompt 并从 LLM 请求**带纠错能力**的结构化数据的节点
##### `nodeLLMRequestStreaming`
> [!note] 概述
> 一个将用户消息附加到 LLM prompt 并**流式传输 LLM 响应**，带或不带流数据转换的节点
##### `nodeLLMRequestMultiple`
> [!note] 概述
> 一个将用户消息附加到 LLM prompt 并**获取多个启用 tool 调用的 LLM 响应**
> 
> 此节点用于以下目的：
> - 处理需要多次 tool 调用的复杂查询
> - 生成多个 tool 调用
> - 实现一个需要多个并行操作的工作流
```kotlin
// example
val requestLLMMultipleTools by nodeLLMRequestMultiple()
edge(getComplexUserQuestion forwardTo requestLLMMultipleTools)
```
##### `nodeLLMCompressHistory`
> [!note] 概述
> 一个将当前 LLM prompt（消息 history）压缩为摘要，用简洁摘要（TL;DR）替换消息的节点
> 
> 关于`history`的详细内容，请见下文
> 
> 该节点用于以下目的：
> - 管理长对话，减少 token 的使用
> - 总结对话历史以保持上下文
> - 在长时间的 agent 中实现内存管理
```kotlin
// example
val compressHistory by nodeLLMCompressHistory<String>(
    "compressHistory",
    strategy = HistoryCompressionStrategy.FromLastNMessages(10),
    preserveMemory = true
)
edge(generateHugeHistory forwardTo compressHistory)
```
#### Tool 节点
##### `nodeExecuteTool`
> [!note] 概述
> 一个**执行单个 tool 调用并返回其结果**的节点，用于处理 LLM 发出的 tool 调用
> 
> 此节点用于以下目的：
> - 执行 LLM 请求的 tool
> - 响应 LLM 决策，处理特定操作
> - 将外部功能集成到 agent 工作流中
```kotlin
// example
val requestLLM by nodeLLMRequest()
val executeTool by nodeExecuteTool()
edge(requestLLM forwardTo executeTool onToolCall { true })
```

##### `nodeLLMSendToolResult`
> [!note] 概述
> 一个**将 tool 结果添加到 prompt 并请求 LLM 响应**的节点
> 
> 此节点用于以下目的：
> - 处理 tool 执行的结果
> - 根据 tool 输出生成响应
> - 在 tool 执行后继续对话
```kotlin
// example
val executeTool by nodeExecuteTool()
val sendToolResultToLLM by nodeLLMSendToolResult()
edge(executeTool forwardTo sendToolResultToLLM)
```

#####  `nodeExecuteMultipleTools`
> [!note] 概述
> 一个执行多个 tool 调用的节点。这些调用可以选择并行执行
> 
> 此节点用于以下目的：
> - 并行执行多个 tool
> - 处理需要多个 tool 执行的复杂工作流
> - 通过批量处理 tool 调用来优化性能
```kotlin
// example
val requestLLMMultipleTools by nodeLLMRequestMultiple()
val executeMultipleTools by nodeExecuteMultipleTools()
edge(requestLLMMultipleTools forwardTo executeMultipleTools onMultipleToolCalls { true })
```

##### `nodeLLMSendMultipleToolResults`
> [!note] 概述
> 一个将多个 tool 结果添加到 prompt 并获取多个 LLM 响应的节点
> 
> 此节点用于以下目的：
> - 处理多个 tool 执行的结果
> - 生成多个 tool 调用
> - 实现带多个并行操作的复杂工作流
```kotlin
// example
val executeMultipleTools by nodeExecuteMultipleTools()
val sendMultipleToolResultsToLLM by nodeLLMSendMultipleToolResults()
edge(executeMultipleTools forwardTo sendMultipleToolResultsToLLM)
```

#### 自定义节点
> [!note] 概述
> 自定义节点允许用户通过创建执行特定操作的可复用组件来扩展代理工作流的功能。
> 
##### 节点架构概述
> [!note] 节点
> 节点是代理工作流的基本构建块，每个节点代表工作流中的特定操作或转换。您可以使用边连接节点，边定义了节点之间的执行流。
> 
> 每个节点都有一个 `execute` 方法，它接受一个输入并生成一个输出，该输出随后传递给工作流中的下一个节点。

##### 自定义节点实现
> [!note] 概述
> 自定义节点的实现范围从对输入数据执行基本逻辑并返回输出的简单实现，到接受形参并在运行之间维护状态的更复杂节点实现。
###### 基本节点实现
> [!note] 在图中实现自定义节点并定义自己的自定义逻辑的最简单方法是使用以下模式
> ```kotlin
> val myNode by node<Input, Output>("node_name") { input ->
>     // 处理
>     returnValue
>}
>```
>表示一个自定义节点 `myNode`，它具有预定义的 `Input` 和 `Output` 类型，以及可选的名称字符串形参（`node_name`）

> [!example] 一个接受字符串输入并返回其长度的简单节点
> ```kotlin
> val myNode by node<String,Int>("node-name"){ input ->
> 	// 返回字符串的长度
> 	input.length
> }
> ```

> [!tip] 创建自定义节点的另一种方法是在 `AIAgentSubgraphBuilderBase` 上定义一个调用 `node` 函数的扩展函数
> ```kotlin
> fun AIAgentSubgraphBuilderBase<*, *>.myCustomNode(
>    name: String? = null
>): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
>    // 自定义逻辑
>    input // 将输入作为输出返回（直通）
>}
>
>val myCustomNode by myCustomNode("node_name")
> ```
> 这会创建一个直通节点，它执行一些自定义逻辑，但将输入作为输出返回，不进行修改


###### 带有额外实参的节点
> [!note] 概述
> 创建接受实参以自定义其行为的节点
> ```kotlin
> fun AIAgentSubgraphBuilderBase<*,*>.myNodeWithArguments(
> 	name: String? = null,
> 	arg1: String,
> 	arg2: Int
> ): AIAgentNodeDelegate<Input,Output> = node(name){ input ->
> 	// 在自定义逻辑中使用arg1和arg2
> 	input // 将输入作为结果返回
> }
> val myCustomNode by myNodeWithArguments(
> 	"node-name",
> 	arg1 = "value1",
> 	arg2 = 42
> )
> ```

###### 参数化节点
> [!note] 概述
> 定义具有输入和输出形参的节点
> ```kotlin
> inline fun <reified T> AIAgentSubgraphBuilderBase<*,*>.myParameterizedNode(
> 	name: String? = null
> ): AIAgentNodeDelegate<T, T> = node(name){ input ->
> 	// 执行一些额外的操作
> 	// 将输入作为输出返回
> 	input // 返回值类型必须与泛型参数一致！
> }
> 
> val strategy = strategy<String,String>("strategy-name"){
> 	val myCustomNode by myParameterizedNode<String>("node-name")
> }
> ```

###### 有状态的节点
> [!note] 概述
> 节点需要在运行之间维护状态，可以使用闭包变量
> ```kotlin
> fun AIAgentSubgraphBuilderBase<*, *>.myStatefulNode(
> 	name: String? =null
> ): AIAgentNodeDelegate<Input,Output>{
> 	var counter = 0
> 	return node(name){ input -> 
> 		counter++
> 		println("节点已执行 $counter 次")
> 		input
> 	}
> }
> ```

##### 节点输入与输出类型
> [!tip] 节点可以具有不同的输入和输出类型，它们被指定为泛型形参
> 输入和输出类型决定了节点如何连接到工作流中的其他节点。只有当源节点的输出类型与目标节点的输入类型兼容时，节点才能连接。
> ```kotlin
> val stringToIntNode by node<String,Int>("node-name"){ input: String ->
> 	input.toInt()
> }
> ```

##### 最佳实践与常见模式
###### 最佳实践
> [!success] 实现自定义节点时，请遵循以下最佳实践：
> 1. **保持节点专注**：每个节点应执行单一、定义明确的操作。
> 2. **使用描述性名称**：节点名称应清楚地表明其目的。
> 3. **文档化形参**：为所有形参提供清晰的文档。
> 4. **优雅地处理错误**：实现适当的错误处理以防止工作流失败。
> 5. **使节点可复用**：设计节点以在不同工作流中复用。
> 6. **使用类型形参**：在适当时候使用泛型类型形参，使节点更灵活。
> 7. **提供默认值**：如果可能，为形参提供合理的默认值。

###### 常见模式
> [!summary] 下面将罗列一些实现自定义节点的常见模式
> ## **直通节点**
> - 执行操作但将输入作为输出返回的节点
> ```kotlin
> val loggingNode by node<String,String>("node-name"){ input ->
> 	println("正在处理输入“)
> 	input
> }
> ```
> ## **转换节点**
> - 将输入转换为不同输出的节点
> ```kotlin
> val upperCaseNode by node<String,String>("node-name"){ input ->
> 	// 将输入的内容转换为大写后返回
> 	input.uppercase()
> }
> ```
> ## **LLM 交互节点**
> - 与 LLM 交互的节点
> ```kotlin
> val summarizeTextNode by node<String,String>("node-name"){ input ->
> 	llm.writeSession{
> 		appendPrompt{
> 			user("请你总结下列文本：$input")
> 		}
> 		val response = requestLLMWithoutTools()
> 		response.content
> 	}
> }
> ```
> ## **工具运行节点**
> ```kotlin
> val nodeExecuteCustomTool by node<String,String>("node-name"){ input -> 
> 	val toolCall = Message.Tool.Call(
> 		id = UUID.randomUUID().toString(),
> 		tool = toolName,
> 		metaInfo = ResponseMetaInfo.create(Clock.System),
> 		// 将输入作为工具实参
> 		content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42))
> 	)
> 	val result = environment.executeTool(toolCall)
> 	result.content
> }
> ```



#### 节点输出转换
> [!note] 概述
> 框架提供了 `transform` 扩展函数，它允许你创建节点的转换版本，这些转换版本对其输出应用转换。当你需要将节点的输出转换为不同的类型或格式，同时保留原始节点的功能性时，这很有用。
> `transform`函数创建一个新的 `AIAgentNodeDelegate`，它包装了原始节点并对其输出应用转换函数
```kotlin
// example
inline fun <reified T> AIAgentNodeDelegate<Input, Output>.transform(
    noinline transformation: suspend (Output) -> T
): AIAgentNodeDelegate<Input, T>
```
##### 自定义节点转换
> [!note] 概述
> 将自定义节点的输出转换为不同的数据类型
```kotlin
val textNode by nodeDoNothing<String>("textNode").transform<Int> { text ->
    text.split(" ").filter { it.isNotBlank() }.size
}

edge(nodeStart forwardTo textNode)
edge(textNode forwardTo nodeFinish)
```
##### 内建节点转换
> [!note] 概述
> 转换内建节点（例如 `nodeLLMRequest`）的输出
```kotlin
val lengthNode by nodeLLMRequest("llmRequest").transform<Int> { assistantMessage ->
    assistantMessage.content.length
}

edge(nodeStart forwardTo lengthNode)
edge(lengthNode forwardTo nodeFinish)
```

#### 预定义子图
> [!note] 概述
> 框架提供了预定义子图，它们封装了常用模式和工作流。这些子图通过自动处理基础节点和 edge 的创建来简化复杂 agent 策略的开发
> 
> 通过使用预定义子图，可以实现各种流行的流水线：
> 1. 准备数据
> 2. 运行任务
> 3. 验证任务结果，如果结果不正确，携带反馈信息返回步骤2进行调整

##### `subgraphWithTasks`
> [!note] 概述
> 一个使用所提供 tool 执行特定任务并返回结构化结果的子图。它支持多响应 LLM 交互（助手可能会生成多个与 tool 调用交错的响应），并允许你控制 tool 调用如何执行
> 
> 此子图可用于以下目的：
> - 创建在更大工作流中处理特定事件的特殊组件
> - 封装具有清晰输入和输出接口的复杂逻辑
> - 配置任务特有的 tool、模型和 prompt
> - 通过自动压缩管理对话历史
> - 开发结构化 agent 工作流和任务执行流水线
> - 从 LLM 任务执行生成结构化结果，包括带多个助手响应和 tool 调用的流
> 
> API 允许使用可选参数微调执行：
> - `runMode`：控制任务期间 tool 调用如何执行（默认为顺序）。当底层模型/执行器支持时，使用此参数可在不同 tool 执行策略之间切换。
> - `assistantResponseRepeatMax`：限制在认定任务无法完成之前允许的助手响应数量（如果未提供，则默认为安全的内部限制）。
> 
> 可以以文本形式向子图提供任务，在需要时配置 LLM 并提供必要的 tool，子图将处理并解决该任务。
```kotlin
// example
val processQuery by subgraphWithTask<String, String>(
    tools = listOf(searchTool, calculatorTool, weatherTool),
    llmModel = OpenAIModels.Chat.GPT4o,
    runMode = ToolCalls.SEQUENTIAL,
    assistantResponseRepeatMax = 3,
) { userQuery ->
    """
    您是一个乐于助人的助手，可以回答各种主题的问题。请帮助处理以下查询:
    $userQuery
    """
}
```

##### `subgraphWithVerification`
> [!note] 概述
> 是`subgraphWithTask` 的一个特殊版本，它验证任务是否正确执行并提供遇到的任何问题的详细信息。此子图对于需要验证或质量检测的工作流很有用。
> 
> 此子图可用于以下目的：
> - 认证任务执行的正确性
> - 在工作流中实施质量控制流程
> - 创建自验证组件
> - 生成带成功/失败状态和详细反馈的结构化验证结果
> 
> 该子图确保 LLM 在工作流结束时调用验证 tool，以检测任务是否成功完成。它保证此验证作为最后一步执行，并返回一个 `CriticResult`，该结果指示任务是否成功完成并提供详细反馈。
```kotlin
// example
val verifyCode by subgraphWithVerification<String>(
    tools = listOf(runTestsTool, analyzeTool, readFileTool),
    llmModel = AnthropicModels.Sonnet_3_7,
    runMode = ToolCalls.SEQUENTIAL,
    assistantResponseRepeatMax = 3,
) { codeToVerify ->
    """
    You are a code reviewer. Please verify that the following code meets all requirements:
    1. It compiles without errors
    2. All tests pass
    3. It follows the project's coding standards

    Code to verify:
    $codeToVerify
    """
}
```

#### 自定义子图
##### 创建和配置子图
> [!note] 基本子图创建
> ## *自定义子图通常使用以下方式创建*
> - 带有指定工具选择策略的子图
> ```kotlin
> strategy <StrategyInput,StrategyOutput>("strategy-name"){
> 	val subgraphIdentifier by subgraph<Input,Output>(
> 		name = "subgraph-name",
> 		toolSelectStrategy = ToolSelectionStrategy.ALL
> 	){
> 		// 定义子图的节点和边
> 	}
> }
> ```
> - 带有指定工具列表的子图（从已定义的工具注册表中选择的工具子集）
> ```kotlin
> strategy <StrategyInput,StrategyOutput>("strategy-name"){
> 	val subgraphIdentifier by subgraph<Input,Output>(
> 		name = "subgraph-name",
> 		tools = listOf(firstTool,secondTool)
> 	){
> 		// 定义子图的节点和边
> 	}
> }
> ```
> 

> [!note] 在子图中配置工具
> 工具可以通过多种方式配置用于子图：
> - 直接在子图定义中
> ```kotlin
> val mySubgraph by subgraph<String,String>(
> 	tools = listOf(AskUser)
> ){
> 	// 定义子图的节点和边
> }
> ```
> - 从工具注册表
> ```kotlin
> val mySubgraph by subgraph<String,String>(
> 	tools = listOf(toolRegistry.getTool("AskUser"))
> ){
> 	// 定义子图的节点和边
> }
> ```
> - 在执行的期间动态添加
> ```kotlin
> // 创建一组工具
> this.llm.writeSession{
> 	tools = tools.filter{ it.name in listOf("firstToolName","secondToolName")}
> }
> ```


##### 高级子图技术
> [!tip] 多部分策略
> 复杂工作流可以分解为多个子图，每个子图处理过程中的特定部分：
> 
```kotlin
strategy("complex-workflow") {
   val inputProcessing by subgraph<String, A>(
   ) {
      // 处理初始输入
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 基于处理后的输入执行推理
   }

   val toolRun by subgraph<B, C>(
      // 工具注册表中可选的工具子集
      tools = listOf(firstTool, secondTool)
   ) {
      // 根据推理运行工具
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // 根据工具结果生成响应
   }

   nodeStart then inputProcessing 
   then reasoning 
   then toolRun 
   then responseGeneration 
   then nodeFinish

}
```
##### 最佳实践与故障排除
> [!success] 最佳实践
> 使用子图时，请遵循以下最佳实践：
> 1. **将复杂工作流分解为子图**：每个子图应具有清晰、集中的职责。
> 2. **仅传递必要的上下文**：仅传递后续子图正确运行所需的信息。
> 3. **记录子图依赖项**：清晰地记录每个子图期望从前一个子图获得什么，以及它向后续子图提供什么。
> 4. **独立测试子图**：确保每个子图在集成到策略之前，都能在各种输入下正确运行。
> 5. **考虑令牌用量**：注意令牌用量，尤其是在子图之间传递大量历史记录时。

> [!question] 故障排除
> ## **工具不可用**
> 如果工具在子图中不可用，需要检查工具是否在工具注册表中正确注册
> 
> ## **子图未按照定义和预期顺序执行**
> 如果子图未按定义的顺序执行：
> - 检测策略定义以确保子图按正确顺序排列。
> - 验证每个子图都正确地将其输出传递给下一个子图。
> - 确保你的子图与其余子图连接，并且可以从开始（和结束）可达。谨慎使用条件边，以确保它们涵盖所有可能的继续条件，从而避免在子图或节点中被阻塞。


> [!example] 示例
> 以下示例展示了如何在真实世界场景中使用子图创建代理策略。 该代码示例包含 `researchSubgraph`、`planSubgraph` 和 `executeSubgraph` 三个已定义的子图，其中每个子图在助手流中都具有定义明确且不同的目的
```kotlin
// 定义代理策略
val strategy = strategy<String, String>("assistant") {
    // 包含工具调用的子图

    val researchSubgraph by subgraph<String, String>(
        "research_subgraph",
        tools = listOf(WebSearchTool())
    ) {
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeCallLLM)
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    val planSubgraph by subgraph(
        "plan_subgraph",
        tools = listOf()
    ) {
        val nodeUpdatePrompt by node<String, Unit> { research ->
            llm.writeSession {
                rewritePrompt {
                    prompt("research_prompt") {
                        system(
                            "你得到一个问题以及关于如何解决它的一些研究。" +
                                    "请逐步制定解决给定任务的计划。"
                        )
                        user("研究：$research")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    val executeSubgraph by subgraph<String, String>(
        "execute_subgraph",
        tools = listOf(DoAction(), DoAnotherAction()),
    ) {
        val nodeUpdatePrompt by node<String, Unit> { plan ->
            llm.writeSession {
                rewritePrompt {
                    prompt("execute_prompt") {
                        system(
                            "你得到一个任务和详细的执行计划。" +
                                    "通过调用相关工具来执行。"
                        )
                        user("执行：$plan")
                        user("计划：$plan")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    nodeStart then researchSubgraph 
    then planSubgraph 
    then executeSubgraph 
    then nodeFinish
}
```

#### 预定义策略与常见的策略模式
> [!note] 概述
> 框架提供了预定义的策略，它们组合了各种节点。 节点使用 edge 连接起来以定义操作流，并带指定何时遵循每个 edge 的条件。
> 如果需要，你可以将这些策略集成到你的 agent 工作流中。
##### 单次运行策略
> [!note] 概述
> 单次运行策略专为非交互式用例而设计，其中 agent 一次处理输入并返回结果。
> 当你需要运行不需要复杂逻辑的直接流程时，你可以使用此策略。
```kotlin
// example
public fun singleRunStrategy(): AIAgentGraphStrategy<String, String> = strategy("single_run") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```

##### 基于 tool 的策略
> [!note] 概述
> 基于 tool 的策略专为严重依赖 tool 执行特定操作的工作流而设计。 它通常根据 LLM 决策执行 tool 并处理结果。
```kotlin
fun toolBasedStrategy(name: String, toolRegistry: ToolRegistry): AIAgentGraphStrategy<String, String> {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        // 定义 agent 的流
        edge(nodeStart forwardTo nodeSendInput)

        // 如果 LLM 响应消息，则结束
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // 如果 LLM 调用 tool，则执行它
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // 将 tool 结果发送回 LLM
        edge(nodeExecuteTool forwardTo nodeSendToolResult)

        // 如果 LLM 调用另一个 tool，则执行它
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // 如果 LLM 响应消息，则结束
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```

##### 流式数据策略
> [!note] 概述
> 流式数据策略专为处理来自 LLM 的流式数据而设计。它通常请求流式数据，处理它，并可能使用处理过的数据调用 tool。
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
    // 描述包含输出流解析的节点
    val getMdOutput by node<String, List<Book>> { booksDescription ->
        val books = mutableListOf<Book>()
        val mdDefinition = markdownBookDefinition()

        llm.writeSession { 
            appendPrompt { user(booksDescription) }
            // 以定义 `mdDefinition` 的形式启动响应流
            val markdownStream = requestLLMStreaming(mdDefinition)
            // 使用响应流的结果调用解析器，并对结果执行操作
            parseMarkdownStreamToBooks(markdownStream).collect { book ->
                books.add(book)
                println("Parsed Book: ${book.title} by ${book.author}")
            }
        }

        books
    }
    // 描述 agent 的图，确保节点可访问
    edge(nodeStart forwardTo getMdOutput)
    edge(getMdOutput forwardTo nodeFinish)
}
```

### 预定义策略
> [!note] 概述
> 为简化代理实现，Koog 提供了预定义的代理策略，以应对常见的代理用例。 以下是可用的预定义策略：
> - **Chat 代理策略**
> - **ReAct 策略**

#### Chat 代理策略
> [!note] 概述
> Chat 代理策略旨在执行聊天交互过程。 它协调不同阶段、节点和工具之间的交互，以处理用户输入、执行工具并以类似聊天的方式提供响应。

> [!summary] Chat 代理策略提供了以下代理模式
> 1. 接收用户输入
> 2. 使用 LLM 处理输入
> 3. 调用工具或直接处理响应
> 4. 处理工具结果并继续对话
> 5. 如果 LLM 尝试使用纯文本而非工具进行响应，则提供反馈

> [!tip] 设置与依赖项
> Koog 中 Chat 代理策略的实现是通过 `chatAgentStrategy` 函数完成的。为了在代理代码中使该函数可用，请添加以下依赖项导入：
> ```kotlin
> ai.koog.agents.ext.agent.chatAgentStrategy
> ```
> 如果要在 agent 中使用该策略，需要添加策略的参数：
> ```kotlin
> val chatAgent = AIAgent(
> 	promptExecutor = promptExecutor,
> 	toolRegistry = toolRegistry,
> 	llmModel = model,
> 	// 将策略设置为 Chat 代理策略
> 	strategy = chatAgentStrategy()
> )
> ```

> [!question] 何时使用 Chat 代理策略？
> Chat 代理策略适用于：
> - 构建需要使用工具的会话代理
> - 创建可以根据用户请求执行操作的助手
> - 实现需要访问外部系统或数据的聊天机器人
> - 希望强制使用工具而非纯文本响应的场景

> [!example] 下面是一个 AI 代理的代码示例，它实现了预定义的 Chat 代理策略 (`chatAgentStrategy`) 以及代理可能使用的工具
```kotlin
// example
val chatAgent = AIAgent(
    promptExecutor = promptExecutor,
    llmModel = model,
    // Use chatAgentStrategy as the agent strategy
    strategy = chatAgentStrategy(),
    // Add tools the agent can use
    toolRegistry = ToolRegistry {
        tool(searchTool)
        tool(weatherTool)
    }
)

suspend fun main() { 
    // Run the agent with a user query
    val result = chatAgent.run("What's the weather like today and should I bring an umbrella?")
}
```

#### ReAct 策略
> [!note] 概述
> ReAct（推理与行动）策略是一种 AI 代理策略，它在推理和执行阶段之间交替进行，以动态处理任务并从大型语言模型（LLM）请求输出

> [!tip] ReAct 策略实现了以下代理模式
> 1. 推理当前状态并规划下一步
> 2. 根据推理采取行动
> 3. 观察这些行动的结果
> 4. 重复上述循环直至结束
> ```mermaid
> graph LR
> A[开始] --> B[调用LLM进行推理]
> B --> C[调用LLM执行动作]
> C -->|已完成？是| D[结束]
> C -->|已完成？否| E[执行工具]
> E --> B
> ```

> [!important] 设置与依赖项
> Koog 中 ReAct 策略的实现是通过 `reActStrategy` 函数完成的。为了在代理代码中使该函数可用，请添加以下依赖项导入：
> ```kotlin
> ai.koog.agents.ext.agent.reActStrategy
> ```
> `reAceStrategy`函数接收以下参数：
> - reasoningInterval（Int）：指定推理步骤间隔，必须大于0，默认值为1
> - name（String）：策略名称，默认为 re_act
> 要使用该策略，需要设置策略参数：
> ```kotlin
> val chatAgent = AIAgent(
> 	promptExecutor = promptExecutor,
> 	toolRegistry = toolRegistry,
> 	llmModel = model,
> 	// 将策略设置为 Chat 代理策略
> 	strategy = reActStrategy(
> 		// 设置可选参数值
> 		reasoningInterval = 1,
> 		name = "react_agent"
> 	)
> ```

> [!example] 示例
> 下面是一个 AI 代理的代码示例，它实现了预定义的 ReAct 策略 (`reActStrategy`) 以及代理可能使用的工具：
```kotlin
// example
val bankingAgent = AIAgent(
    promptExecutor = promptExecutor,
    llmModel = model,
    // Use reActStrategy as the agent strategy
    strategy = reActStrategy(
        reasoningInterval = 1,
        name = "banking_agent"
    ),
    // Add tools the agent can use
    toolRegistry = ToolRegistry {
        tool(getTransactions)
        tool(calculateSum)
    }
)

suspend fun main() { 
    // Run the agent with a user query
    val result = bankingAgent.run("How much did I spend last month?")
}
```

### 自定义策略图
#### 策略图基本内容
> [!note] 策略图
> ## **概述**
> 策略图是 Koog framework 中代理工作流的核心支柱。它们定义了代理如何处理输入、与工具交互以及生成输出。策略图由通过边连接的节点组成，执行流由条件决定。
> 
> 创建策略图能让用户根据特定需求定制代理的行为，无论是构建一个简单的聊天机器人、一个复杂的数据处理流水线，还是介于两者之间的任何事物。
> ## **策略图架构**
> 从高层视角看，策略图由以下组件组成：
> - Strategy：图的顶层容器，使用`strategy`函数创建，并使用泛型参数指定输入和输出类型
> - 子图：图中可以拥有自己的工具集和上下文部分
> - 节点：工作流中单个操作或转换
> - 边：定义转换条件和转换节点间连接
> ## **策略图组件**
> ### *节点*：节点是策略图的构建块。每个节点代表一个特定操作。Koog 框架提供了预定义节点，用户也可以使用`node`函数创建自定义节点
> ### *边*：边连接节点并定义策略图中的操作流。边通过 `edge` 函数和 `forwardTo` 中缀函数创建：
> ```kotlin
> edge(sourceNode forwardTo targetNode)
> ```
> ### *条件*：条件决定了何时跟随策略图中的特定边
> 下列罗列一些比较常见的条件：
> - `onCondition`：接受一个返回布尔值的 lambda 表达式的通用条件
> - `onToolCall`：当 LLM 调用工具时匹配的条件
> - `onAssistantMessage`：当 LLM 响应消息时匹配的条件
> - `onMultipleToolCalls`：当 LLM 调用多个工具时匹配的条件
> - `onToolNotCalled`：当 LLM 未调用工具时匹配的条件
> 用户可以在将输出传递给目标节点之前，使用 `transformed` 函数对其进行转换：
> ```kotlin
> edge(
> 	sourceNode forwardTo targetNode
> 		onCondition{input -> input.length > 10}
> 		transformed{input -> input.uppercase()}
> )
> 
> ```
> ### *子图*：
> 子图是策略图的一部分，它们使用自己的一套工具和上下文进行操作。策略图可以包含多个子图。每个子图通过 `subgraph` 函数定义：
> ```kotlin
> val strategy = strategy<Input,Output>("strategy-name"){
> 	val firstSubgraph by subgraph<FirstInput,FirstOutput>("first"){
> 		// 定义子图的边和节点
> 	}
> 	val secondSubgraph by subgraph<SecondInput,SecondOutput>("second"){
> 		// 定义子图的边和节点
> 	}
> }
> ```
> 
> 子图可以使用工具注册表中的任何工具。但是，你可以从该注册表中指定一个工具子集，并将其作为实参传递给 `subgraph` 函数，以供子图使用：
> ```kotlin
> val strategy = strategy<Input,Output>("strategy-name"){
> 	val firstSubgraph by subgraph<FirstInput,FirstOutput>(
> 		name = "first",
> 		tools = listOf(someTool)
> 	){
> 		// 定义该子图的节点和边
> 	}
> 	// 定义其他子图
> }
> ```


> [!important] 基本策略图创建
> 基本策略图运行方式如下：
> 1. 将输入发送给 LLM
> 2. 如果 LLM 响应消息，则结束该过程
> 3. 如果 LLM 调用工具，则运行对应的工具
> 4. 将工具结果返回给 LLM
> 5. 如果 LLM 响应消息，则结束该过程
> 6. 如果 LLM 调用另一个工具，则运行对应的工具，然后从第4步重复
> ```mermaid
> graph TD
> A[将输入发送给LLM] --> B{LLM是否响应消息？}
> B -->|是| C[结束流程]
> B -->|否| D[LLM调用一个工具]
> D --> E[运行该工具]
> E --> F[将结果返回给LLM]
> F --> G{LLM是否响应了结果？}
> G -->|是| H[结束流程]
> G -->|否| I[LLM调用另一个工具]
> I --> E
> ```
> 以下是基本策略图的示例：
> ```kotlin
> val myStrategy = strategy<String,String>("my-strategy"){
> 	val nodeCallLLM by nodeLLMRequest()
> 	val executeToolCall by nodeExecuteTool()
> 	val sendToolResult by nodeLLMSendToolResult()
> 	
> 	// 边1: 从起始节点流向 LLM 调用节点（工作流入口）
> 	edge(nodeStart forwardTo nodeCallLLM)
> 	
> 	// 边2: LLM 调用后，如果返回的是助手消息（非工具调用），则直接结束
> 	edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage{true})
> 	
> 	// 边3: LLM 调用后，如果返回的是工具调用请求，则流向工具执行节点
> 	edge(nodeCallLLM forwardTo executeToolCall onToolCall{true})
> 	
> 	// 边4: 工具执行完成后，流向发送工具结果节点
> 	edge(executeToolCall forwardTo sendToolResult)
> 	
> 	// 边5: 发送工具结果回LLM后，如果LLM返回助手消息，则结束工作流
> 	edge(sendToolResult forwardTo nodeFinish onAssistantMessage{true})
> 	
> 	// 边6: 发送工具结果回LLM后，如果LLM再次返回工具调用请求，则循环执行工具
> 	edge(sendToolResult forwardTo executeToolCall onToolCall{true})
> }
> ```

> [!tip] 策略图可视化
> 在 JVM 上，可以为策略图生成 Mermaid 状态图。
> 对于上述事例的策略图，可以运行如下代码：
> ```kotlin
> val mermaidDiagram: String = myStrategy.asMermaidDiagram()
> println(mermaidDiagram)
> ```

#### 高级策略技术
##### 历史记录压缩
###### 历史压缩概览
> [!note] 概述
> AI 代理会维护一个消息历史，其中包括用户消息、助手响应、工具调用和工具响应。当代理遵循其策略时，此历史会随着每次交互而增长。
> 对于长期对话，历史可能会变得庞大并消耗大量 token。历史压缩通过**将完整的消息列表总结为一条或多条仅包含对代理后续操作而言必需的重要信息的消息**，从而帮助减少这种情况。
> 
> 历史压缩解决了代理系统中的关键挑战：
> - **优化上下文使用**：聚焦且更小的上下文可以提升 LLM 性能，并防止因超出 token 限制而导致的失败。
> - **提升性能**：压缩历史可以减少 LLM 处理的消息数量，从而实现更快的响应。
> - **提升准确性**：聚焦于相关信息有助于 LLM 保持专注并完成任务而不受干扰。
> - **降低成本**：减少不相关消息可以降低 token 使用量，从而降低 API 调用的总成本。

> [!question] 何时压缩历史？
> 历史压缩的步骤在代理工作流的特定步骤执行：
> - 在代理策略的逻辑步骤（子图）之间
> - 上下文变得过长时

###### 历史压缩实现
> [!important] 在策略图中实现历史压缩
> 要在策略图中压缩历史，你需要使用 `nodeLLMCompressHistory` 节点。根据你决定在哪一步执行压缩，有以下场景可用：
> - 当历史过长时压缩历史，你可以定义一个辅助函数并将 `nodeLLMCompressHistory` 节点添加到你的策略图，采用以下逻辑：
> ```kotlin
> private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession{ prompt.message.size > 100 }
> val strategy = strategy<String,String>("execute-with-history-compression"){
> 	val callLLM by nodeLLMRequest()
> 	val executeTool by nodeExecuteTool()
> 	val sendToolResult by nodeLLMSendToolResult()
> 	
> 	// 压缩 LLM 历史，并保留当前的 ReceivedToolResult 用于下一个节点
> 	val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()
> 	
> 	// 边1: 从起始节点流向 LLM 调用节点（工作流入口）
> 	edge(nodeStart forwardTo callLLM) 
> 	
> 	// 边2: LLM 调用后，如果返回助手消息（最终响应），则结束工作流
> 	edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
> 	
> 	// 边3: LLM 调用后，如果返回工具调用请求，则流向工具执行节点
> 	edge(callLLM forwardTo executeTool onToolCall { true }) 
> 	// 边4: 工具执行完成后，如果历史记录过长（>100条），则先压缩历史
> 	edge(
> 		executeTool forwardTo compressHistory 
> 		onCondition { 
> 			historyIsTooLong() 
> 		}
> 	) 
> 	// 边5: 历史压缩完成后，流向发送工具结果节点
> 	edge(compressHistory forwardTo sendToolResult) 
> 	
> 	// 边6: 工具执行完成后，如果历史记录正常（≤100条），则直接发送工具结果 与边4互斥
> 	edge(
> 		executeTool forwardTo sendToolResult 
> 		onCondition {
> 			!historyIsTooLong() 
> 		}
> 	) 
> 	
> 	// 边7: 发送工具结果回LLM后，如果LLM再次返回工具调用请求，则循环执行工具
> 	edge(sendToolResult forwardTo executeTool onToolCall { true })
> 	
> 	// 边8: 发送工具结果回LLM后，如果LLM返回助手消息，则结束工作流
> 	edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
>}
> ```
> 在此示例中，策略会在每次工具调用后检测历史是否过长。历史会在将工具结果发送回 LLM 之前被压缩。这可以防止上下文在长期对话中不断增长。
> 
> - 要在子图之间压缩历史，可以按照如下方案实现：
> ```kotlin
> val strategy = strategy<String,String>("execute-with-history-compression"){
> 	val collectInformation by subgraph<String,String>{
> 		// 获取信息的步骤
> 	}
> 	val compressHistory by nodeLLMCompressHistory<String>()
> 	val makeTheDecision by subgraph<String>{
> 		// 根据当前压缩的历史记录和收集的信息做出决策的某些步骤
> 	}
> 	nodeStart then collectInformation 
> 	then compressHistory 
> 	then makeTheDecision
> }
> ```
> 在此示例中，历史会在信息收集阶段完成后，进入决策阶段之前被压缩。

> [!important] 在自定义节点中实现历史压缩
> 如果你正在实现自定义节点，你可以使用 `replaceHistoryWithTLDR()` 函数压缩历史，如下所示：
> ```kotlin
> llm.writeSession{
> 	replaceHistoryWithTLDR()
> }
> ```
> 这种方法为你提供了更大的灵活性，可以根据你的具体要求在自定义节点逻辑中的任何位置实现压缩。


##### 并行工具执行
> [!note] 概述
> 对于需要并行执行多个工具的工作流，你可以使用 `nodeExecuteMultipleTools` 节点：
> ```kotlin
> val executeMultipleTools by nodeExecuteMultipleTools()
> val processMultipleResults by nodeLLMSendMultipleResults()
> 
> edge(someNode forwardTo exexuteMultipleTools)
> edge(exexuteMultipleTools forwardTo processMultipleResults)
> ```
> 也可以使用`toParallelToolCallsRaw` 扩展函数处理流式数据：
> ```kotlin
> parseMarkdownStreamToBooks(markdownStream)
> 	.toParallelToolCallsRaw(BookTool::class)
> 	.collect()
> ```


##### 并行节点执行
> [!note] 概述
> 并行节点执行允许您并发运行多个 AI 智能体节点，从而提高性能并支持复杂的流程。此特性在以下场景中尤其有用：
> - 同时**通过不同的模型或方法处理相同的输入**
> - 并行执行多个独立操作
> - 实现竞争性求值模式，即**生成多个解决方案后进行比较**

> [!summary] 关键组成部分
> ## 方法
> - `parallel()`: 并行执行多个节点并收集其结果。
> ## 数据结构
> - `ParallelResult`: 表示并行节点执行的已完成结果。
> - `NodeExecutionResult`: 包含节点执行的输出和上下文。

> [!important] 基本用法
> ## *并行运行节点*
> 要启动节点的并行执行，请使用以下格式的 `parallel` 方法：
> ```kotlin
> val nodeName by parallel<Input,Output>(
> 	firstNode,secondNode,thirdNode //如有需要可以添加更多节点
> ){
> 	// 合并策略示例
> 	selectByMax{ it.length }
> }
> ```
> ## *合并策略*
> 在并行执行节点后，您需要指定如何合并结果。Koog 提供以下合并策略：
> - `selectBy()`: 基于谓词函数选择结果
> - `selectByMax()`: 基于比较函数选择具有最大值的结果
> - `selectByIndex()`: 基于选择函数返回的索引选择结果
> - `fold()`: 使用操作函数将结果折叠为单个值。

> [!success] 最佳实践
> 1. **考量资源限制**：在并行执行节点时，请注意资源使用情况，尤其是在同时进行多个 LLM API 调用时。
> 2. **上下文管理**：每次并行执行都会创建一个派生上下文。合并结果时，请选择要保留哪个上下文或如何组合来自不同执行的上下文。
> 3. **根据您的用例进行优化**：
> 	- 对于竞争性求值（如笑话示例），使用 `selectByIndex` 选择最佳结果
> 	- 对于查找最大值，使用 `selectByMax`
> 	- 对于基于条件进行过滤，使用 `selectBy`
> 	- 对于聚合，使用 `fold` 将所有结果组合成一个复合输出

> [!attention] 性能考量
> - 并行执行可以显著提高吞吐量，但会带来一些开销：
> 	- 每个并行节点都会创建一个新的协程
> 	- 上下文派生和合并会增加一些计算成本
> 	- 存在大量并行执行时可能会出现资源争用
> 
> - 为了获得最佳性能，请并行化符合以下条件的操作：
> 	- 彼此独立
> 	- 具有显著的执行时间
> 	- 不共享可变状态


##### 条件分支
> [!note] 概述
> 对于需要根据特定条件采取不同路径的复杂工作流，你可以使用条件分支：
> ```kotlin
> val branchA by node<String,String>{ input ->
> 	// 分支A的具体逻辑
> 	"branchA: $input"
> }
> val branchB by node<String,String>{ input ->
> 	// 分支B的具体逻辑
> 	"branchB: $input"
> }
> edge(
> 	(someNode forwardTo branchA) 
> 		onCondition{ input -> input.contains("A")}
> )
edge(
> 	(someNode forwardTo branchB) 
> 		onCondition{ input -> input.contains("B")}
> )> 
> ```

#### 最佳实践与故障排除
##### 最佳实践
> [!success] 最佳实践方案
> 创建自定义策略图时，请遵循以下最佳实践：
> - 保持简单。从一个简单的图开始，根据需要增加复杂性。
> - 给你的节点和边起描述性名称，使图更易于理解。
> - 处理所有可能的路径和边缘情况。
> - 用各种输入测试你的图，确保其行为符合预期。
> - 记录你的图的目的和行为，以备将来参考。
> - 使用预定义策略或常见模式作为起点。
> - 对于长期运行的对话，使用历史记录压缩以减少 token 使用量。
> - 使用子图来组织你的图并管理工具访问。

> [!example] 示例：语气分析策略
> 语气分析策略是基于工具的策略的一个很好的示例，它包括历史记录压缩：
> ```kotlin
> fun toneStrategy(name: String, toolRegistry: ToolRegistry): AIAgentGraphStrategy<String, String>{
> 	return strategy(name){
> 		val nodeSendInput by nodeLLMRequest()
> 		val nodeExecuteTool by nodeExecuteTool()
> 		val nodeSendToolResult by nodeLLMSendToolResult()
> 		val nodeCompressHistory by nodeLLMCompressHistory()
> 		
> 		// 1. 从起点开始，将输入发送给LLM
> 		edge(nodeStart forwardTo nodeSendInput)
> 		
> 		// 2. 如果LLM返回了普通消息（非工具调用），则结束
> 		edge(
> 			（nodeSendInput forwardTo nodeFinish)
> 				onAssistantMessage{ true }
> 		)
> 		
> 		// 3. 如果LLM返回调用工具请求，则调用相应的工具
> 		edge(
> 			(nodeSendInput forwardTo nodeExecuteTool)
> 				onToolCall{ true }
> 		)
> 		
> 		// 4. 如果对话历史过长，则压缩历史
> 		edge(
> 			(nodeExecuteTool forwardTo nodeCompressHistory)
> 				onCondition{ _ -> llm.readSession{prompt.messages.size > 100}}
> 		)
> 		edge(nodeCompressHistory forwardTo nodeSendToolResult)
> 		
> 		// 5. 如果历史记录在合理范围内，直接将工具的结果返回给LLM
> 		edge(
> 			(nodeExecuteTool forwardTo nodeSendToolResult)
> 				onCondition{ _ -> llm.readSession{prompt.messages.size <= 100}}
> 		)
> 		
> 		// 6. 如果LLM返回另外一个工具的调用请求，则调用对应的工具
> 		edge(
> 			(nodeSendToolResult forwardTo nodeExecuteTool)
> 				onToolCall{ true }
> 		)
> 		
> 		// 7. 如果LLM返回最终回复，则结束整个流程
> 		edge(
> 			(nodeSendToolResult forwardTo nodeFinish)
> 				onAssistantMessage{ true }
> 		)
> 	}
> }
> ```
##### 故障排除
> [!question] 图无法到达结束节点
> 如果图未到达结束节点，请检查以下内容：
> - 从开始节点到结束节点的所有路径最终都通向结束节点。
> - 你的条件不过于严格，以致阻止边被跟随。
> - 图中没有没有退出条件的循环。

> [!question] 工具调用未运行
> 如果工具调用未运行，请检查以下内容：
> - 工具是否在工具注册表中正确注册。
> - 从 LLM 节点到工具执行节点的边是否具有正确的条件 (`onToolCall { true }`)。

> [!question] 历史记录过大
> 如果你的历史记录过大并消耗过多 token，请考虑以下几点：
> - 添加一个历史记录压缩节点。
> - 使用条件检测历史记录的大小，并在它过大时压缩它。
> - 使用更积极的压缩策略（例如，`FromLastNMessages` 并使用更小的 N 值）。

> [!question] 图行为异常
> 如果你的图采取了意料之外的分支，请检查以下内容：
> - 你的条件定义正确。
> - 条件的求值顺序符合预期（边的检测顺序与它们的定义顺序一致）。
> - 你没有意外覆盖更通用的条件。

> [!question] 性能问题
> 如果你的图有性能问题，请考虑以下几点：
> - 通过删除不必要的节点和边来简化图。
> - 对独立操作使用并行工具执行。
> - 压缩历史记录。
> - 使用更高效的节点和操作。
### 节点间数据传输
> [!note] 概述
> Koog 提供了一种使用 `AIAgentStorage` 存储和传递数据的方式。`AIAgentStorage` 是一个键值存储系统，旨在以类型安全的方式在不同节点甚至子图之间传递数据。
> 
> 存储可通过代理节点中可用的 `storage` 属性（`storage: AIAgentStorage`）访问，从而实现 AI 代理系统不同组件之间数据的无缝共享。

#### 键值结构
> [!note] 键值数据存储结构依赖于 `AIAgentStorageKey` 数据类
> 该存储使用类型化键系统，以确保在存储和检索数据时的类型安全：
> - `AIAgentStorageKey<T>`：一个数据类，表示用于识别和访问数据的存储键。`AIAgentStorageKey` 类主要特性如下：
> 	- 泛型类型参数 `T` 指定与此键关联的数据类型，确保类型安全。
> 	- 每个键都有一个 `name` 属性，它是一个唯一标识存储键的字符串标识符。

#### 使用示例
> [!example] 以下提供了一个**创建存储键**以及**使用它来存储和检索数据**的实际示例
> ## 定义表示数据的类
> ```kotlin
> class UserData(
> 	val name: String,
> 	val age: Int
> )
> ```
> 
> ## 创建存储键
> ```kotlin
> val userDataKey = createStorageKey<UserData>("user-data")
> ```
> `createStorageKey` 函数接受一个唯一标识该键的字符串形参。
> 
> ## 存储数据
> 要在节点中使用创建的存储键保存数据，请使用 `storage.set(key: AIAgentStorageKey<T>, value: T)` 方法：
> ```kotlin
> val nodeSaveData by node<Unit, Unit>{
> 	storage.set(userDateKey, UserData("Joe", 31))
> }
> ```
> ## 检索数据
> 要在节点中检索数据，请使用 `storage.get` 方法：
> ```kotlin
> val nodeRetrieveData by node<String,Unit>{ message ->
> 	storage.get(userDataKey)?.let{ userFromStorage ->
> 		println("Hello dear $userFromStorage, here's a message for you: $message)
> 	}
> }
> ```

> [!tip] 附加信息
> - `AIAgentStorage` 是线程安全的，它使用 `Mutex` 来确保并发访问得到正确处理。
> - 该存储旨在与任何扩展 `Any` 的类型配合使用。
> - 检索值时，类型转换会自动处理，确保整个应用程序的类型安全。
> - 对于值的非空访问，请使用 `getValue` 方法，如果键不存在，该方法将抛出异常。
> - 您可以使用 `clear` 方法完全清空存储，该方法会移除所有存储的键值对。

---
# 2. Koog 后端框架集成
## 2.0 依赖项添加
> [!note] Gradle依赖添加
> 添加 Koog 的依赖
> ```kotlin
> dependencies {
>    implementation("ai.koog:koog-ktor:$koogVersion")
>}
> ```
## 2.1 Ktor 集成
> [!note] 配置
> 使用 Ktor 集成 Koog 的配置有两种方式：
> - 配置文件编写：
> ```HOCON
> # application.conf（Ktor配置）
> koog { 
> 	openai { 
> 		apikey = ${OPENAI_API_KEY} 
> 		baseUrl = "https://api.openai.com" 
> 	} 
> 	anthropic { 
> 		apikey = ${ANTHROPIC_API_KEY} 
> 		baseUrl = "https://api.anthropic.com" 
> 	} 
> 	google { 
> 		apikey = ${GOOGLE_API_KEY} 
> 		baseUrl = "https://generativelanguage.googleapis.com" 
> 	} 
> 	openrouter { 
> 		apikey = ${OPENROUTER_API_KEY} 
> 		baseUrl = "https://openrouter.ai" 
> 	} 
> 	deepseek { 
> 		apikey = ${DEEPSEEK_API_KEY} 
> 		baseUrl = "https://api.deepseek.com" 
> 	} 
> 	ollama { 
> 		enable = true 
> 		baseUrl = "http://localhost:11434"
> 	} 
> }
> ```
> ```yaml
> # application.yaml (Ktor 配置)
>koog:
>  openai:
>    apikey: ${OPENAI_API_KEY}
>    baseUrl: https://api.openai.com
>  anthropic:
>    apikey: ${ANTHROPIC_API_KEY}
>    baseUrl: https://api.anthropic.com
>  google:
>    apikey: ${GOOGLE_API_KEY}
>    baseUrl: https://generativelanguage.googleapis.com
>  openrouter:
>    apikey: ${OPENROUTER_API_KEY}
>    baseUrl: https://openrouter.ai
>  deepseek:
>    apikey: ${DEEPSEEK_API_KEY}
>    baseUrl: https://api.deepseek.com
>  # 当任何 koog.ollama.* 键存在时，Ollama 都会启用
 > ollama:
>    enable: true
>    baseUrl: http://localhost:11434
> ```
> - 直接在路由中编写：
> ```kotlin
> // Routing.kt或Framework.kt中
> fun Application.configureRouting(){
> 	install(Koog){
> 		llm{
> 			deepSeek(apiKey = System.getenv("DEEPSEEK_API_KEY") 
> 			?: error("未在环境中找到DeepSeek的API Key！"))
> 			// 其它llm配置
> 		}
> 	}
> }
> ```

> [!important] 1.0 HTTP 传输层解耦（Ktor 集成的重大变化）
> Koog 1.0 引入了 `KoogHttpClient.Factory` 可插拔机制，HTTP 客户端不再硬编码为 Ktor HttpClient。这对 Ktor 集成有以下影响：
>
> - **Ktor 仍然是默认实现**：当 classpath 中存在 Ktor 依赖时，Koog 会自动发现并使用 Ktor HttpClient 作为默认传输层，**现有 Ktor 项目的代码无需任何修改**
> - **可替换为其他 HTTP 客户端**：如果项目需要，可以显式注入 Java HttpClient / OkHttp / Spring RestClient 替代 Ktor
> - **Ollama 也通过同一抽象层路由**：本地模型和远程模型使用统一的 HTTP 通道，切换只需改配置
>
> ```kotlin
> // 1.0 中，可以显式指定 HTTP 客户端（可选，Ktor 项目不需要）
> install(Koog) {
>     llm {
>         anthropic(
>             apiKey = System.getenv("ANTHROPIC_API_KEY"),
>             httpClient = KoogHttpClient.from(myCustomHttpClient) // 可选：注入自定义客户端
>         )
>     }
> }
> ```

## 2.2 Spring 集成


---
# 3. 深度剖析
> [!tip] 关联内容
> 由于这部分篇幅会过长，且不是针对于常规开发流程编写。如果想要详细了解 Koog 的底层与 API 原理，请移步[[Koog 源代码分析]]

## 3.1 Koog Graph DSL vs LangGraph vs CrewAI

> [!compare] Kotlin Agent 框架的差异化定位

| 维度 | **Koog Graph DSL** | **LangGraph (Python)** | **CrewAI (Python)** |
|:---:|:---:|:---:|:---:|
| **语言** | Kotlin/JVM + KMP | Python | Python |
| **编排模型** | 类型安全的有向状态图 | 有向状态图（类似） | 角色扮演 + 任务委派 |
| **类型系统** | 编译期泛型约束 `node<String, Int>` | 运行时 dict 传递 | 运行时字符串 |
| **多平台** | JVM/JS/iOS/Android/Native | Python-only | Python-only |
| **持久化** | 内置 checkpoint/restore + `AIAgentStorage` | 需要外部 state backend | 无原生支持 |
| **可观测性** | OpenTelemetry KMP 全平台 | LangSmith（绑定） | 第三方集成 |
| **工具生态** | MCP 0.11.1 + ToolRegistry | MCP + LangChain tools | 自定义工具 |

> [!summary] 核心差异
> - **LangGraph** 的优势在于 Python 生态的 LLM 库丰富度，但类型安全弱、仅限 Python
> - **CrewAI** 适合快速原型，但对复杂状态管理力不从心
> - **Koog Graph DSL** 的独特价值在于：**编译期类型安全 + KMP 多平台 + JVM 企业级集成**。同一个 Agent 逻辑可以编译到服务端（JVM）、移动端（Android/iOS）、甚至浏览器（JS），且在编译期就能捕获节点间的数据类型不匹配
>
> **选型建议**：
> - 纯 Python 团队 + 快速迭代 → LangGraph
> - Kotlin/JVM 团队 + 多平台部署 + 企业级需求 → **Koog Graph DSL**
> - 快速 POC + 不关心类型安全 → CrewAI

## 3.2 Prompt Caching 成本量化

> [!note] 以 Anthropic Claude Sonnet 4 为例
> 构建不同复杂度 Agent 的月度成本对比：

| 场景 | System Prompt | 每次调用 Input Tokens | 日调用次数 | 月成本（无缓存） | 月成本（有缓存） | 节省 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 简单客服 | 800 tokens | 1,200 | 1,000 | $10.80 | $9.72 | 10% |
| 代码审查 | 4,000 tokens | 6,000 | 500 | $27.00 | $10.80 | **60%** |
| 企业知识库 | 12,000 tokens | 15,000 | 200 | $27.00 | $8.10 | **70%** |

*计算假设：Input $3/M tokens, Cached Read $0.30/M tokens, Cache Write $3.75/M tokens*

> [!tip] 关键结论
> - **System prompt 越长，缓存收益越大**——这恰好是 Agent 场景的典型特征（系统指令 + 工具描述 + Few-shot examples 通常 >3000 tokens）
> - **调用频次越高，摊薄的 cache write 成本越低**——首次调用多付约 12.5% 的 cache write 费用，第 2 次调用即开始回本
> - 在 Grafana 中创建 `cache_hit_ratio` 面板，目标值 >80%。低于此值说明 system prompt 频繁变更导致缓存失效
