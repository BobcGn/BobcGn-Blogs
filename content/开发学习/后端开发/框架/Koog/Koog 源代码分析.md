> [!tip] 相关内容
> [[Koog]]
> 建议大致了解了使用 Koog 进行 AI Agent 开发的流程以及相关内容后，再阅读本篇文章
# 0. 概述
> [!question] 为什么要对 Koog 进行源代码分析？
> 虽然根据官方的入门指南能够稍微掌握一些基本的内容和使用方法，但是如果想要自己用得得心应手，就应该点开 API 和源代码去查看其中的内容，加深其中的理解

> [!summary] 分析计划
> Koog 是 JetBrains 开源的 AI 框架，能够与流行的后端框架，如 Ktor、Spring等进行集成，开发AI Agent工作流。
> 不要因为这是一个 AI 框架就以为这部分内容学起来有多么困难。Koog 的 AI Agent 工作流如果看得透彻，就会明白，它的本质是一个精心设计的、基于**策略图（核心）** 的有限状态机。这个状态机由可复用的**子图与节点**构成，通过**事件**驱动，在**代理**的统一调度下，智能地调用各种**工具**与外部世界交互。我们将围绕这五部分内容，根据实际开发的顺序，逐个剖析每部分的关键设计点和源码实现。
> - 策略图（核心）
> - 子图与节点
> - 工具
> - 事件
> - agent（代理）
> 我们将围绕这部分内容，根据实际开发的顺序，逐个剖析每部分内容的关键点

---
# 1. 入口与配置

> [!question] 思考
> 回忆一下我们第一个代理是如何实现的？
> ```kotlin
> fun main() = runBlocking{
> 	// 首先，我们先从环境中拿出了API Key并进行了对应的操作
> 	val apikey = System.getenv("DEEPSEEK_API_KEY") ?: error("未找到apikey")
> 	val deepSeekClient = DeepSeekLLMClient(apiKey)
> 	
> 	// 关键点！使用 AIAgent类实例化我们的模型
> 	val agent = AIAgent(
> 		promptExecutor = SingleLLMPromptExecutor(deepSeekClient),
> 		llmModel = DeepSeekModels.DeepSeekChat,
> 		strategy = reActStrategy(
> 			reasoningInterval = 5,
> 			name = "react"
> 		)
> 	)
> 	
> 	// 之后就可以运行模型了
> }
> ```
> **关键点**：通过实现`AIAgent`接口实例化 LLM。那么接下来，我们开始分析`AIAgent`

## `AIAgent`接口
> [!note] 源代码
> 从接口声明可以看出，这是一个泛型接口，需要用户在创建时提供`Input`和`Output`两个参数，这两个参数表示**AI Agent 接收的输入类型以及输出类型**
```kotlin
// 省略包名和import
public interface AIAgent<Input, Output> : Closeable{
	// ...
}
```

### 关键字段
```kotlin
// AI Agent的唯一标识
public val id: String
// AI Agent的配置
public val agentConfig: AIAgentConfigBase
```

### 伴生对象（关键）
> [!note] 概述
> 该接口的伴生对象包含一个密封接口，其继承者描述的是**Agent 在生命周期中的状态**，包括：
> - 尚未启动
> - 正在运行
> - 已成功完成其任务并获得结果
> - 因异常而失败
> 
> 在密封接口的内容结束后，是包含不同参数的`invoke`方法，这便于用户按照自己的需求创建Agent。
```kotlin
public companion object{
	// 密封接口声明
	public sealed interface State<Output>{
		// 拷贝函数 -- State<Output> 的一个新实例，它是当前对象的副本
		public fun copy(): State<Output>
		
		// 1. 未启动状态类
		public class NotStarted<Output> : State<Output>{
			// 重写拷贝函数
			override fun copy(): State<Output> = NotStarted()
		}
		
		// 2. 启动状态类
		public class Starting<Output> : State<Output>{
			// 重写拷贝函数
			override fun copy(): State<Output> = Starting()
		}
		
		// 3. 正在运行状态类
		public class Running<Output>(  
			// rootContext属性使代理能够在指定的上下文中执行操作并管理其执行生命周期。
		    @property:InternalAgentsApi public val rootContext: AIAgentContext  
		) : State<Output> {  
		    @OptIn(InternalAgentsApi::class)  
		    // 重写拷贝方法
		    override fun copy(): State<Output> = Running(rootContext)  
		}
		
		// 4. 运行结束并输出结果的状态类
		public class Finished<Output>(  
		    public val result: Output  
		) : State<Output> {  
			// 重写拷贝方法
		    override fun copy(): State<Output> = Finished(result)  
		}
		
		// 6. 运行失败状态类
		public class Failed<Output>(  
		    public val exception: Throwable  
		) : State<Output> {  
			// 重写拷贝方法
		    override fun copy(): State<Output> = Failed(exception)  
		}
	}
	
	// invoke方法
	/*
		1. 根据提供的配置、输入/输出类型和执行策略创建一个 AI 代理实例。
	* @param Input AI Agent 将要处理的输入类型
	* @param Output AI Agent 生成的结果类型
	* @param promptExecutor 负责处理提示并与语言模型交互的执行者。
	* @param agentConfig AI Agent的配置, 包含提示、模型及其他参数。
	* @param toolRegistry 可供AI Agent使用工具的工具注册表。 默认为空
	* @param strategy 执行 AI 代理图形逻辑的策略，包括工作流程和决策制定。
	* @param id Agent的唯一标识. 如果设置为 null，将生成随机 UUID。  
	* @param clock 用于与时间相关操作的时钟。默认为系统时钟。
	* @param installFeatures 用于在代理的功能上下文中安装附加功能的 lambda 表达式。默认为空实现。 
	* @return 一个按指定参数配置并能够执行其逻辑的AIAgent实例。
	*/
	@OptIn(ExperimentalUuidApi::class)  
	public inline operator fun <reified Input, reified Output> invoke(  
	    promptExecutor: PromptExecutor,  
	    agentConfig: AIAgentConfig,  
	    strategy: AIAgentGraphStrategy<Input, Output>,  
	    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,  
	    id: String? = null,  
	    clock: Clock = Clock.System,  
	    noinline installFeatures: FeatureContext.() -> Unit = {},  
	): AIAgent<Input, Output> {  
	    return GraphAIAgent(  
	        inputType = typeOf<Input>(),  
	        outputType = typeOf<Output>(),  
	        promptExecutor = promptExecutor,  
	        agentConfig = agentConfig,  
	        toolRegistry = toolRegistry,  
	        strategy = strategy,  
	        id = id,  
	        clock = clock,  
	        installFeatures = installFeatures  
	    )  
	}
	
	/*
		2. 操作符函数，用于创建和调用具有给定参数的Agent
	* @param promptExecutor 负责处理提示并与语言模型交互的执行者
	* @param Agent需要处理的提示
	* @param agentConfig AI Agent的配置, 包含提示、模型及其他参数。
	* @param strategy 执行 AI 代理图形逻辑的策略，包括工作流程和决策制定。
	* @param id Agent的唯一标识. 如果设置为 null，将生成随机 UUID。
	* @param installFeatures 用于在代理的功能上下文中安装附加功能的 lambda 表达式。默认为空实现。 
	* @return 使用策略图配置的AIAgent实例。
	*/
	@OptIn(ExperimentalUuidApi::class)  
	public operator fun invoke(  
	    promptExecutor: PromptExecutor,  
	    agentConfig: AIAgentConfig,  
	    strategy: AIAgentGraphStrategy<String, String> = singleRunStrategy(),  
	    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,  
	    id: String? = null,  
	    installFeatures: FeatureContext.() -> Unit = {},  
	): AIAgent<String, String> = GraphAIAgent(  
	    inputType = typeOf<String>(),  
	    outputType = typeOf<String>(),  
	    promptExecutor = promptExecutor,  
	    agentConfig = agentConfig,  
	    toolRegistry = toolRegistry,  
	    strategy = strategy,  
	    id = id,  
	    clock = Clock.System,  
	    installFeatures = installFeatures  
	)
	
	/*
		3. 使用提供的配置和执行策略创建函数式代理。
	* @param Input AI Agent 将要处理的输入类型
	* @param Output AI Agent 生成的结果类型
	* @param promptExecutor 负责处理提示并与语言模型交互的执行者。
	* @param agentConfig AI Agent的配置, 包含提示、模型及其他参数。
	* @param toolRegistry 可供AI Agent使用工具的工具注册表。 默认为空
	* @param strategy 执行 AI 代理图形逻辑的策略，包括工作流程和决策制定。
	* @param id Agent的唯一标识. 如果设置为 null，将生成随机 UUID。
	* @return 用所提供的参数和执行策略配置的函数式代理
	*/
	@OptIn(ExperimentalUuidApi::class)  
	public operator fun <Input, Output> invoke(  
	    promptExecutor: PromptExecutor,  
	    agentConfig: AIAgentConfig,  
	    strategy: AIAgentFunctionalStrategy<Input, Output>,  
	    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,  
	    id: String? = null,  
	    clock: Clock = Clock.System,  
	    installFeatures: FunctionalAIAgent.FeatureContext.() -> Unit = {},  
	): FunctionalAIAgent<Input, Output> {  
	    return FunctionalAIAgent(  
	        id = id,  
	        promptExecutor = promptExecutor,  
	        agentConfig = agentConfig,  
	        toolRegistry = toolRegistry,  
	        strategy = strategy,  
	        clock = clock,  
	        installFeatures = installFeatures  
	    )  
	}
	
	/*
		4. 构建具有指定配置和参数的AI Agent
	* @param promptExecutor 负责处理提示并与语言模型交互的执行者。
	* @param llmModel 要用于Agent的特定LLM
	* @param toolRegistry 可供AI Agent使用工具的工具注册表。 默认为空
	* @param strategy 执行 AI 代理图形逻辑的策略，包括工作流程和决策制定。
	* @param id Agent的唯一标识. 如果设置为 null，将生成随机 UUID。  
	* @param systemPrompt The system-level prompt used as context for the agent, defaulting to an empty string.  
	* @param temperature 模型响应的随机性或创造性，有效值通常在0.0到1.0之间。默认为1.0。
	* @param numberOfChoices 要生成的响应选项的数量，默认为1。
	* @param maxIterations 允许代理执行的最大迭代次数，默认为50。
	* @param installFeatures 用于在代理的功能上下文中安装附加功能的 lambda 表达式。默认为空实现。 
	* @return 用所提供的参数配置的AIAgent
	*/
	@OptIn(ExperimentalUuidApi::class)  
	public operator fun invoke(  
	    promptExecutor: PromptExecutor,  
	    llmModel: LLModel,  
	    strategy: AIAgentGraphStrategy<String, String> = singleRunStrategy(),  
	    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,  
	    id: String? = null,  
	    systemPrompt: String = "",  
	    temperature: Double = 1.0,  
	    numberOfChoices: Int = 1,  
	    maxIterations: Int = 50,  
	    installFeatures: FeatureContext.() -> Unit = {}  
	): AIAgent<String, String> = AIAgent(  
	    id = id,  
	    promptExecutor = promptExecutor,  
	    strategy = strategy,  
	    agentConfig = AIAgentConfig(  
	        prompt = prompt(  
	            id = "chat",  
	            params = LLMParams(  
	                temperature = temperature,  
	                numberOfChoices = numberOfChoices  
	            )  
	        ) {  
	            system(systemPrompt)  
	        },  
	        model = llmModel,  
	        maxAgentIterations = maxIterations,  
	    ),  
	    toolRegistry = toolRegistry,  
	    installFeatures = installFeatures  
	)
	
	
	/*
		5. 使用提供的参数创建和配置AI Agent
	* @param Input AI Agent 将要处理的输入类型
	* @param Output AI Agent 生成的结果类型
	* @param promptExecutor 负责处理提示并与语言模型交互的执行者。
	* @param llmModel 要用于Agent的特定LLM
	* @param toolRegistry 可供AI Agent使用工具的工具注册表。 默认为空
	* @param strategy 执行 AI 代理图形逻辑的策略，包括工作流程和决策制定。
	* @param id Agent的唯一标识. 如果设置为 null，将生成随机 UUID。  
	* @param clock 用于与时间相关操作的时钟。默认为系统时钟。
	* @param systemPrompt 表示代理的系统级提示符的字符串。默认为空字符串
	* @param temperature 模型响应的随机性或创造性，有效值通常在0.0到1.0之间。默认为1.0。
	* @param numberOfChoices 要生成的响应选项的数量，默认为1。
	* @param maxIterations 允许代理执行的最大迭代次数，默认为50。
	* @param installFeatures 用于在代理的功能上下文中安装附加功能的 lambda 表达式。默认为空实现。 
	* @return 一个已配置的AIAgent实例，它可以使用指定的策略和模型处理输入并生成输出
	*/
	@OptIn(ExperimentalUuidApi::class)  
	public inline operator fun <reified Input, reified Output> invoke(  
	    promptExecutor: PromptExecutor,  
	    llmModel: LLModel,  
	    strategy: AIAgentGraphStrategy<Input, Output>,  
	    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,  
	    id: String? = null,  
	    clock: Clock = Clock.System,  
	    systemPrompt: String = "",  
	    temperature: Double = 1.0,  
	    numberOfChoices: Int = 1,  
	    maxIterations: Int = 50,  
	    noinline installFeatures: FeatureContext.() -> Unit = {},  
	): AIAgent<Input, Output> {  
	    return AIAgent(  
	        id = id,  
	        promptExecutor = promptExecutor,  
	        strategy = strategy,  
	        agentConfig = AIAgentConfig(  
	            prompt = prompt(  
	                id = "chat",  
	                params = LLMParams(  
	                    temperature = temperature,  
	                    numberOfChoices = numberOfChoices  
	                )  
	            ) {  
	                system(systemPrompt)  
	            },  
	            model = llmModel,  
	            maxAgentIterations = maxIterations,  
	        ),  
	        toolRegistry = toolRegistry,  
	        installFeatures = installFeatures  
	    )  
	}
	
	
	/*
		6. 使用指定的参数创建函数式代理，以便在工具注册表、配置的语言模型和相关特性的帮助下执行策略。
	* @param promptExecutor 负责处理提示并与语言模型交互的执行者。
	* @param llmModel 要用于Agent的特定LLM
	* @param func Agent的操作策略，它决定如何处理提供的输入
	* @param toolRegistry 可供AI Agent使用工具的工具注册表。 默认为空
	* @param id Agent的唯一标识. 如果设置为 null，将生成随机 UUID。
	* @param systemPrompt 表示代理的系统级提示符的字符串。默认为空字符串
	* @param temperature 模型响应的随机性或创造性，有效值通常在0.0到1.0之间。默认为1.0。
	* @param numberOfChoices 要生成的响应选项的数量，默认为1。
	* @param maxIterations 允许代理执行的最大迭代次数，默认为50。
	* @param installFeatures 用于在代理的功能上下文中安装附加功能的 lambda 表达式。默认为空实现。 
	* @return 使用提供的参数配置并准备执行指定策略的AI代理实例
	*/
	public operator fun <Input, Output> invoke(  
            promptExecutor: PromptExecutor,  
            llmModel: LLModel,  
            toolRegistry: ToolRegistry = ToolRegistry.EMPTY,  
            strategy: AIAgentFunctionalStrategy<Input, Output>,  
            id: String? = null,  
            systemPrompt: String = "",  
            temperature: Double = 1.0,  
            numberOfChoices: Int = 1,  
            maxIterations: Int = 50,  
            installFeatures: FunctionalAIAgent.FeatureContext.() -> Unit = {},  
        ): AIAgent<Input, Output> = FunctionalAIAgent(  
            promptExecutor = promptExecutor,  
            agentConfig = AIAgentConfig(  
                prompt = prompt(  
                    id = "chat",  
                    params = LLMParams(  
                        temperature = temperature,  
                        numberOfChoices = numberOfChoices  
                    )  
                ) {  
                    system(systemPrompt)  
                },  
                model = llmModel,  
                maxAgentIterations = maxIterations,  
            ),  
            installFeatures = installFeatures,  
            toolRegistry = toolRegistry,  
            strategy = strategy  
        )  
    }  
}
```
> [!summary] 伴生对象总结与使用策略
> ## 实现`State<Output>`接口
> 与`State`有关的内容，用于判断或跟踪 Agent 的状态
> ## `invoke`函数使用策略
> 从 Koog 基础篇，我们知道调用 AI Agent 一共能够创建三种代理，分别是**基本代理、函数式代理以及复杂工作流代理**。并且了解到`AIAgent` 的构建本质上是对 **执行策略 (Strategy)**、**模型配置 (Config)** 和 **工具能力 (ToolRegistry)** 的组合。上述列出的六个 `invoke` 重载方法，其实就是这三者不同排列组合的“语法糖”。接下来我们总结根据上述6种`invoke`方法创建 Agent 的策略
> 
> ### 基本代理
> **核心思路**：**“单次交互，自动循环”**。  
> 这是最经典的 ReAct 或 Chat 模式。Agent 接收输入 -> 调用 LLM -> (可选) 调用工具   -> 返回结果。如果 LLM 决定调用工具，框架会自动处理“执行工具 -> 将结果发回 LLM -> 再次生成回复”的循环，直到 LLM 给出最终文本回复。
> - #### 参数策略：
> - `strategy`：必须使用策略图，如果没有显式指定，默认使用`singleRunRegistry`（见方法 2，4），这是一个预定义策略图，包含 `LLM 请求` -> `判断是否工具调用` -> `执行工具` -> `发送结果` 的标准闭环
> - `agentConfig` VS `llmModel` + `systemPrompt`
> 	- 方法 1 & 3：需要手动构建完整的 `AIAgentConfig` 对象。适合你需要精细控制 Prompt 模板、模型参数（temperature 等）以及最大迭代次数 (`maxAgentIterations`) 的场景
> 	- 方法 4 & 5：提供了“快捷通道”。直接传入 `llmModel`, `systemPrompt`, `temperature` 等扁平参数，框架会在内部帮你组装成 `AIAgentConfig`。**这是日常开发中最常用的方式**，代码更简洁。
> - `toolRegistry`：工具注册表，它是基本代理的灵魂。如果不传，它就是个纯聊天机器人；传入了 `ToolRegistry`，它就具备了“手和脚”，可以执行搜索、计算、文件读写等工具包含的操作。
> - 
> ### 函数式代理
> **核心思路**：**“代码即流程，完全掌控”**。  
> 不同于基本代理依赖预定义的图结构，函数式代理的逻辑完全由你编写的 Lambda 表达式 (`functionalStrategy`) 定义。你可以决定调用几次 LLM，每次调用之间做什么数据处理，是否并行调用等。
> #### 参数策略
> - `strategy`：必须使用 `AIAgentFunctionalStrategy<Input, Output>` (见方法 3, 6)。 这是通过`functionalStrategy{ input -> ... }`DSL构建的
> - `installFeatures`：注意方法 3 和 6 中，这里的类型是 `FunctionalAIAgent.FeatureContext.() -> Unit`。这意味着你可以在这个作用域内访问函数式代理特有的上下文（如 `requestLLM` 等扩展函数），这是与图策略代理的重要区别
> - 输入输出类型：函数式代理非常适合处理非 String 的类型转换。例如，输入是 `List<Product>`，经过三次 LLM 处理，输出是 `SummaryReport` 对象
> 
> ### 复杂工作流代理
> **核心思路**：**“编排大于推理，多阶段协作”**。  
> 当业务逻辑无法用简单的“问 - 答 - 工具”循环，也无法用线性的函数脚本描述时（例如：需要先调研，再制定计划，再执行，最后验证），就需要自定义图策略。
> #### 参数策略
> - `strategy`：需要自定义`AIAgentGraphStrategy`（Agent策略图）
> 	- 使用`strategy("name") { ... }`DSL创建
> 	- 内部包含多个子图和节点
> - `toolStrategy`的局部性：在复杂工作流中，不同的子图使用不同的工具子集，可以在定义 `subgraph` 时通过 `tools = listOf(...)` 参数限制该阶段可用的工具，实现关注点分离
> - `installFeatures`：用于安装全局的追踪、重试或历史压缩。因为链路越长，出错概率越大，对客观测性的要求也更高


|  代理类型   |       对应方法        |                                                      核心特征                                                      |                                      使用场景                                       |
| :-----: | :---------------: | :------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
|  基本代理   |       2、4、5       | 使用 `singleRunStrategy()` (默认或显式)。  <br>参数支持“快捷模式”(直接传 model/prompt) 或 “配置模式”(传 agentConfig)。  <br>自动处理 Tool 循环 |   **90% 的日常场景**。  <br>客服机器人、简单的任务助手、带工具调用的问答系统。  <br>如果你只需要“输入->处理->输出”，选这个。    |
|  函数式代理  |        3、6        |    使用 `functionalStrategy`。  <br>逻辑由 Lambda 代码块控制。  <br>支持多次顺序/并行 LLM 调用。  <br>无自动 Tool 循环，需手动 `requestLLM`    | **多步推理/特定流程**。  <br>需要 LLM 多次反思、润色、翻译的场景；  <br>或者需要将 LLM 作为数据处理管道中的一个环节（如 ETL）。 |
| 复杂工作流代理 | 1、5<br>（配合自定义策略图） |             使用自定义 `strategy { ... }`。  <br>包含多个子图 (Subgraph) 和复杂边 (Edge) 条件。  <br>支持局部工具注册表和历史压缩策略             |    **企业级复杂业务**。  <br>涉及多阶段审批、长周期任务、需要严格状态控制的场景。  <br>例如：自动化运维流程、复杂的数据分析报表生成。    |


### 状态检测函数

```kotlin
/**  
 * 检查AI Agent当前是否处于运行状态
 *
 * @return 如果当前Agent正在运行，返回true，否则为false
 */
public suspend fun AIAgent<*, *>.isRunning(): Boolean = this.getState() is Running  
  
/**  
 * 检查AI Agent当前是否处于结束状态
 * 
 * @return 如果当前Agent已经结束运行，返回true，否则为false
 */
public suspend fun AIAgent<*, *>.isFinished(): Boolean = this.getState() is Finished
```

---

# 2. 策略图
> [!note] 概述
> **策略图（Strategy Graph）**是 Koog 框架中构建复杂 AI 工作流的核心引擎，它将 Agent 的执行逻辑从单一的线性交互升维为可视化的**有向状态机**。通过定义**节点**（如 LLM 推理、工具执行、代码逻辑）与**边**（控制流与数据流转条件），策略图允许开发者以声明式的方式编排多阶段任务、动态分支决策及循环重试机制，不仅实现了业务逻辑与模型调用的深度解耦，更赋予了 Agent 自主规划路径、管理中间状态及处理异常流程的能力，是将简单对话机器人进化为具备复杂问题解决能力的智能体的关键架构基石。
> 
> 在本章节，我们将详细分析策略图的相关的内容。子图与节点的内容，请见下一章节

---

# 3. 子图与节点
> [!note] 概述
> **节点（Node）与子图（Subgraph）**是策略图的“原子”与“模块”，共同支撑起复杂工作流的结构化表达。**节点**作为最小执行单元，承载具体动作——无论是调用 LLM、执行工具还是运行自定义逻辑；而**子图**则是对多个节点的封装与抽象，将局部流程转化为可复用、可嵌套的独立组件。这种分层设计不仅实现了工作流的模块化组装与高内聚管理，更让开发者能以“搭积木”的方式构建宏大的业务场景（如多阶段调研、动态决策闭环），在降低认知负荷的同时，确保复杂逻辑依然清晰可控、易于维护和扩展。
> 
> 在本章节，我们将详细分析节点与子图的详细细节与实现思路



---

# 4. 工具


---

# 5. 事件驱动机制


