---
title: 'Kotlin + Vert.x构建高性能高可用的微服务'
date: 2026-04-28
tags:
  - 开发学习
  - 开发学习/后端开发/工具
---

> [!tip] 相关内容
> [[Kotlin知识点快速梳理|Kotlin]]、[[Spring]]
# 0. 背景
> [!question] 为什么使用Vert.x？
> 当代开发，开发者会频繁使用 Spring 全家桶（SpringBoot、SpringCloud等）进行服务的开发。但是，不得不考量的一个问题：
> - 部署痛点：假如我写了一个 Spring 微服务，我准备部署到服务器或Docker，打个jar包要花好几个G的存储去进行部署，对于个人开发者没有那么完备的资源，部署过程很容易导致服务器卡死，进而导致部署失败
> - 运行痛点：当项目规模和功能逐渐扩大，在启动时也会十分耗时
> 
> 那我们就要思考：是否有其它的解决方案来进行高性能、高效率、高可用、可扩展性强的微服务的构建与部署？
> 当然有！使用**Kotlin + Vert.x**能够满足我们的需求。为什么呢？
> - 为什么选择Kotlin -- Kotlin的诸多新特性能够完全弥补Java的不足：
> 	- **空安全**：从编译层面彻底根除空指针的影响
> 	- **扩展函数与扩展属性**：能够在已有的代码上进行扩展，减少编码量
> 	- **函数式编程**：能够使用更灵活的策略进行服务的调用
> 	- **协程**：使用同步的方式编写异步流程，以协作式挂起减少线程阻塞
> - 为什么选择Vert.x -- Vert.x：一个基于JVM的高性能、事件驱动、可伸缩、非阻塞的**工具包**，用于构建响应式、可扩展的微服务应用。它特别适合高并发低延迟的场景
> 	- **高性能 & 非阻塞IO**：Vert.x 底层基于 Netty，采用Reactor模式实现事件驱动；通过单线程的事件循环处理大量的并发请求，避免了传统多线程模型中频繁创建与销毁线程带来的开销。结果就是：同一台机器上可以轻松支持数万的并发连接，提高了CPU的利用率
> 	- **极致轻量 & 快速启动**：对比SpringBoot
> 		- SpringBoot：其默认打包为 jar，包含了大量的依赖，动辄几十MB到上百MB；而且启动时间很长，尤其是在容器化部署中，冷启动慢影响用户体验
> 		- Vert.x：其核心模块极小，仅需几MB，且支持快速启动与热部署
> 	- **支持多种语言 & 多语言统一API**：Vert.x不局限于Java，还支持Kotlin/ JS/ Groovy/ Ruby/Python等。为什么要选择Kotlin与之组合呢？
> 		- Kotlin的协程天然适配Vert.x的异步模型，使用 `suspend` 函数写异步代码如同同步代码，无需手动回调，极大提升开发体验
> 	- **微服务架构友好： 模块化设计 & 轻松集成**：
> 		- Vert.x 支持 Verticle（垂直组件）：每个Verticle是一个独立的逻辑单元，可独立部署、伸缩，类似于微服务中的各个服务，非常适合拆分复杂业务
> 		- 可以通过 Vert.x EventBus实现跨Verticle通信，甚至跨进程、跨机器通信
> 	- **生态丰富 & 易于与现代技术栈结合**：
> 		- 支持 RESTful API、WebSocket、gRPC、MQ（如 Kafka/RabbitMQ）、Redis、MongoDB 等常见中间件
> 		- 有成熟的 Web 框架（如 Vert.x Web）、安全模块（JWT、OAuth）、监控（Prometheus）、日志（SLF4J）等
> 		- 可以轻松接入 Kubernetes、Docker、Service Mesh（如 Istio）
> 	- **适合云原生 & Serverless 场景**：
> 		- 因为其轻量、快速启动、低资源消耗的特点，Vert.x 是理想的 **Serverless / FaaS** 平台候选者
> 		- 在 AWS Lambda、Google Cloud Functions、阿里云函数计算等环境中表现优异


---
# 1. 单体架构的尝试
## 1.1 创建第一个Vert.x应用
> [!note] 操作步骤
> 1. 通过访问[Vert.x Starter - Create new Eclipse Vert.x applications](https://start.vertx.io/)进行项目的构建设置，然后下载压缩包（本篇文章中使用的是Vert.x 5）
> 2. 在IDEA中创建新的空项目，将压缩包解压到对应的项目目录中，进入ide点击加载Gradle，等待构建完毕即可

> [!tip] 注意
> 在构建完毕后，我们会发现有一个类叫做`MainVerticle.kt`。如果不使用Vert.x Launcher，也可以自己创建Kotlin入口文件`Main.kt`：
> ```kotlin
> package com.example.starter  
>  
>import io.vertx.core.Vertx  
>import io.vertx.kotlin.coroutines.await
>  
>suspend fun main(){  
>  val vertx = Vertx.vertx()  
>  vertx.deployVerticle(MainVerticle()).await()
>}
> ```
> 然后通过这个主函数进行启动，即可成功启动项目

## 1.2 实现基础的HTTP服务
### 项目结构
> [!note] 概述
> 在开始编写之前，我们需要明确我们的项目结构，如下
```
vertx-demo/
├── src/
│   └── main/
│       ├── kotlin/com/example/demo/
│       │   ├── Main.kt                     ← 主入口（main() 函数）
│       │   ├── ApplicationVerticle.kt      ← 核心 Verticle（≈ Spring Boot 启动类）
│       │   │
│       │   ├── handler/                    ← 请求处理器（≈ Controller）
│       │   │   ├── UserHandler.kt
│       │   │   └── HealthHandler.kt
│       │   │
│       │   ├── service/                    ← 业务服务（≈ Service）
│       │   │   └── UserService.kt
│       │   │
│       │   ├── repository/                 ← 数据访问层（≈ Repository）
│       │   │   └── UserRepository.kt
│       │   │
│       │   ├── dto/                        ← 数据传输对象
│       │   │   └── UserDto.kt
│       │   │
│       │   ├── model/                      ← 实体类
│       │   │   └── User.kt
│       │   │
│       │   └── config/                     ← 配置加载与解析
│       │   │   └── AppConfig.kt
│       │   │
│       │   └── util/                       ← 工具类（可选）
│       │   │   └── JsonUtil.kt
│       │
│       └── resources/
│           ├── openapi.yaml                ← OpenAPI 规范（替代 Swagger 注解）
│           ├── application.conf            ← 应用配置（≈ application.yml）
│           └── logback.xml                 ← 日志配置（可选）
│
├── build.gradle.kts                        ← 构建脚本
├── settings.gradle.kts
├── .gitignore
└── README.md
```
> [!important] 注意
> Vertx的目录结构无需采用与SpringBoot一样的结构，因为**Vert.x 本质是“工具箱”，不是“框架”**。它不强制你使用某种分层方式，而是鼓励你根据需求灵活组织

### 入门第一步--HelloWorld
> [!summary] 操作过程
> 1. 首先在handler目录下创建类 Hello.kt，然后编写代码
> ```kotlin
> import io.vertx.ext.web.RoutingContext  
>  
>class Hello {  
>	// 构造包含消息的Map对象并以JSON格式返回
>    fun helloWorld(ctx: RoutingContext){  
>        ctx.json(  
>            mapOf("message" to "Hello World!")  
>        )  
>    }  
>}
> ```
> 2. 在启动类中注册对应的路由
> ```kotlin
> suspend fun main(){  
>    // 创建Vert.x实例  
>    val vertx = Vertx.vertx()  
>    // 部署主Verticle  
>    vertx.deployVerticle(MainVerticle())  
>  
>    // 创建路由器实例 - Vert.x Web组件  
>    val router = Router.router(vertx)  
>    // 创建Hello处理器实例  
>    val helloHandler: Hello = Hello()  
>    // 配置"/hello"路径的GET请求处理器  
>    router.get("/hello").handler { ctx ->  
>        helloHandler.helloWorld(ctx)  
>    }  
>  
>    // 启动 HTTP 服务器  
>    vertx.createHttpServer()  
>        .requestHandler(router)  
>        // listen()方法返回Future对象，这是Vert.x 5的新特性  
>        .listen(8890)  
>        // onSuccess()是Vert.x 5中用于处理成功结果的新方法  
>        .onSuccess { server ->  
>            println("Server started on port 8890")  
>        }  
>        // onFailure()是Vert.x 5中用于处理失败结果的新方法  
>        .onFailure { err ->  
>            println("Failed to start server: ${err.message}")  
>        }  
>}
> ```
> 启动主类，然后测试对应的api，输出内容如下
> ```json
>{  
>  "message": "Hello World!"  
>}
> ```

## 1.3 引入数据库操作
> [!summary] 操作步骤
> - 依赖导入
> 在 `build.gradle.kts` 中添加数据库的依赖
> ```kotlin
> dependencies{
> 	// 其它依赖
> 	implementation("io.vertx:vertx-mysql-client:${vertxVersion}")
> }
> ```
> - 数据库连接配置
> 在 config 目录下创建 `DatabaseConfig.kt`类，里面添加数据库的连接配置
> ```kotlin
>import io.vertx.core.Vertx  
>import io.vertx.mysqlclient.MySQLConnectOptions  
>import io.vertx.sqlclient.Pool  
>import io.vertx.sqlclient.PoolOptions  
>  
>class DatabaseConfig {  
>    companion object{  
>        fun createConnectOptions(): MySQLConnectOptions{  
>            return MySQLConnectOptions()  
>                .setPort(3306)  
>                .setHost("localhost")  
>                .setDatabase("vertx")  
>                .setUser("your_user")
>                .setPassword("your_password")
>        }  
>  
>        fun createPoolOptions(): PoolOptions{  
>            return PoolOptions()  
>                .setMaxSize(5)  
>        }  
>  
>        /**  
>         * 创建并返回MySQL数据库连接池  
>         * @param vertx Vertx实例  
>         * @return MySQLPool 数据库连接池  
>         */  
>        fun createMySQLPool(vertx: Vertx): Pool {  
>            val connectOptions = createConnectOptions()  
>            val poolOptions = createPoolOptions()  
>            return Pool.pool(vertx, connectOptions, poolOptions)  
>        }  
>    }  
>}
> ```

### 数据库交互
> [!note] 概述
> 在SpringBoot的开发过程中，我们经常使用 MyBatis 进行和数据库的交互。到了Vert.x中，我们就不由得思考，在Vert.x中是否也存在如此的操作？
> 
> **答案是否定的！！**
> 因为 MyBatis 基于 JDBC，同步阻塞调用会阻塞 Event Loop线程，不适合直接放在Vert.x事件循环中执行
> 
> 那么最佳的解决方案是什么？
> 我们知道，Vert.x是一个开发工具包而非框架，它提供了**原生响应式数据库客户端**，其核心思想是：**非阻塞 & 回调/协程 & 手动映射**

> [!summary] 操作过程
> 以MySQL为例，我们使用 vertx-mysql-client
> ## *核心步骤*
> - 使用 MySQLPool 执行SQL
> ```kotlin
> mysqlPool.preparedQuery("SELECT id, name, email FROM users WHERE id = ?")
>     .execute(Tuple.of(id))
> .onSuccess { rows -> // 处理结果 } 
> .onFailure { err -> // 处理错误 }
> ```
> - 手动将 Row 映射为实体对象
> ```kotlin
> data class User(val id: Long, val name: String, val email: String) 
> fun Row.toUser(): User { 
> 	return User( 
> 		id = getLong("id"), 
> 		name = getString("name"), 
> 		email = getString("email") 
> 	) 
> }
> ```
> - 在Handler 或 Service 中组合逻辑
> ```kotlin
> class UserHandler(private val userRepo: UserRepository) { 
> 	fun getById(ctx: RoutingContext) { 
> 		val id = ctx.pathParam("id").toLong() 
> 		userRepo.findById(id) 
> 			.onSuccess { user -> 
> 				if (user != null) ctx.json(user) 
> 				else ctx.response().setStatusCode(404).end() 
> 			} 
> 			.onFailure { ctx.fail(500, it) } 
> 	}
>  }
> ```

> [!important] 最佳实践
> 在 repository 层中创建（以UserRepository为例）
> ```kotlin
> // src/main/kotlin/com/example/starter/repository/UserRepository.kt 
> package com.example.starter.repository 
> import com.example.starter.model.User 
> import io.vertx.core.Future
> import io.vertx.mysqlclient.MySQLClient
> import io.vertx.mysqlclient.MySQLPool 
> import io.vertx.sqlclient.Row
> import io.vertx.sqlclient.Tuple 
> 
> class UserRepository(private val mysqlPool: MySQLPool) { 
> 	fun findById(id: Long): Future<User?> { 
> 		return mysqlPool 
> 			.preparedQuery("SELECT id, name, email FROM users WHERE id = ?")
> 			.execute(Tuple.of(id))
> 			.map { rows -> 
> 				rows.firstOrNull()?.let { row -> 
> 					User( 
> 						id = row.getLong("id"), 
> 						name = row.getString("name"), 
> 						email = row.getString("email") 
> 						) 
> 				} 
> 			} 
> 	} 
> 	fun save(user: User): Future<User> { 
> 		return mysqlPool 
> 			.preparedQuery( 
> 				"INSERT INTO users (name, email) VALUES (?, ?)"
> 			) 
> 			.execute(Tuple.of(user.name, user.email))
> 			.map { result -> 
> 				val generatedId = result.property(MySQLClient.LAST_INSERTED_ID) as Long
> 				user.copy(id = generatedId)
> 			} 
> 	} 
> 	
> 	fun findAll(): Future<List<User>> { 
> 		return mysqlPool 
> 			.query("SELECT id, name, email FROM users") 
> 			.execute() 
> 			.map { rows -> 
> 				rows.map { it.toUser() } 
> 		} 
> 	} 
> } 
> 
> // 扩展函数：Row → User 
> fun Row.toUser(): User = User( 
> 	id = getLong("id"), 
> 	name = getString("name"), 
> 	email = getString("email") 
> )
> ```


## 1.4 引入配置管理
> [!question] 为什么要使用配置文件？
> - 硬编码：http端口写在代码中，修改困难
> - 不安全：数据库密码存在配置类中，有风险
> - 不灵活：无法快速切换环境

> [!summary] 操作步骤
> - 在main目录下的 resources 目录下创建 `application.conf`配置文件
> - 编写配置文件的内容
> ```HOCON
> # 应用基础配置
>app {
>  name = "vertx-starter"
>  version = "1.0.0"
>  debug = false
>}
>
># 数据库配置
>database {
>  # 数据库主机地址
>  host = "localhost"
>  # 数据库端口号
>  port = 3306
>  # 数据库名称
>  name = "vertx"
>  # 数据库用户名
>  username = "your_user"
>  # 数据库密码
>  password = "your_password"
>  
>  # 连接池配置
>  pool {
>    # 最大连接数
>    max-size = 5
>  }
>}
>
># HTTP服务器配置
>server {
>  # 服务器监听端口
>  port = 8890
>}
>
># 日志配置
>logging {
>  level = "INFO"
>  # 可以定义不同的包或类的日志级别
>  # com.example.starter = "DEBUG"
>}
>
># 其他可选配置项示例
># 邮件服务器配置
># mail {
>#   host = "smtp.example.com"
>#   port = 587
>#   username = "user@example.com"
>#   password = "password"
># }
>
># 缓存配置
># cache {
>#   expire-time = "1 hour"
>#   max-size = 1000
># }
>
> ```
> - 在启动类中导入配置文件
> ```kotlin
>import io.vertx.config.ConfigRetriever
>import io.vertx.config.ConfigRetrieverOptions
>import io.vertx.config.ConfigStoreOptions
>import io.vertx.core.json.JsonObject
>import io.vertx.kotlin.coroutines.await
>
>// 加载 HOCON 配置文件。需要添加 vertx-config 和 vertx-config-hocon 依赖
>val store = ConfigStoreOptions()
>    .setType("file")
>    .setFormat("hocon")
>    .setConfig(JsonObject().put("path", "application.conf"))
>
>val retriever = ConfigRetriever.create(
>    vertx,
>    ConfigRetrieverOptions().addStore(store)
>)
>
>val appConfig = retriever.getConfig().await()
>  
>// 读取数据库配置  
>val dbConfig = appConfig.getJsonObject("database")  
>val connectOptions = MySQLConnectOptions()  
>    .setPort(dbConfig.getInteger("port"))  
>    .setHost(dbConfig.getString("host"))  
>    .setDatabase(dbConfig.getString("name"))  
>    .setUser(dbConfig.getString("username"))  
>    .setPassword(dbConfig.getString("password"))  
>  
>val poolOptions = PoolOptions()  
>    .setMaxSize(dbConfig.getJsonObject("pool").getInteger("max-size"))  
>  
>// 创建数据库连接池  
>val client = Pool.pool(vertx, connectOptions, poolOptions)  
>  
>// 从配置文件中读取服务器端口  
>val serverPort = appConfig.getJsonObject("server").getInteger("port")
> ```

## 1.5 日志与监控初探
> [!question] 为什么要使用日志？
> 

|  场景  |        没有日志        |                        有日志                         |
| :--: | :----------------: | :------------------------------------------------: |
| 排查错误 | “服务挂了，但是不知道哪里出了问题” | “`UserHandler.handle()` 抛出 `NullPointerException`” |
| 性能分析 |    “感觉慢，但是无法定位”    |        “`/users` 平均响应时间 200ms，99% 分位 500ms”        |
| 安全审计 |  “无法追踪谁在何时访问了什么”   |       “IP 192.168.1.100 在 10:00 访问了 /admin”        |
> [!summary] 操作步骤
> - 添加日志依赖
> ```kotlin
> // 在 build.gradle.kts 中添加日志依赖
> implementation("org.slf4j:slf4j-api:$slf4j_version")
> implementation("ch.qos.logback:logback-classic:$logback_version")
> ```
> - 配置 Logback.xml
> 在 resources目录下创建 logback.xml 文件
> ```xml
> <configuration>  
>    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">  
>        <encoder>  
>            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>  
>        </encoder>  
>    </appender>  
>  
>    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">  
>        <file>logs/app.log</file>  
>        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">  
>            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.%i.log</fileNamePattern>  
>            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">  
>                <maxFileSize>10MB</maxFileSize>  
>            </timeBasedFileNamingAndTriggeringPolicy>  
>            <maxHistory>30</maxHistory>  
>        </rollingPolicy>  
>        <encoder>            
> 	       <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>  
>        </encoder>  
>    </appender>  
>  
>    <root level="INFO">  
>        <appender-ref ref="STDOUT"/>  
>        <appender-ref ref="FILE"/>  
>    </root>  
>  
>    <!-- 设置特定包的日志级别 -->  
>    <logger name="com.example.starter" level="DEBUG"/>  
></configuration>
> ```
> - 在代码中使用Logger
> **完整的启动类如下**
> ```kotlin
>import io.vertx.config.ConfigRetriever  
>import io.vertx.config.ConfigStoreOptions  
>import io.vertx.core.Vertx  
>import io.vertx.core.json.JsonObject  
>import io.vertx.ext.web.Router  
>import io.vertx.mysqlclient.MySQLConnectOptions  
>import io.vertx.sqlclient.Pool  
>import io.vertx.sqlclient.PoolOptions  
>import org.slf4j.LoggerFactory  
>  
>suspend fun main(){  
>  // 创建日志  
>  val logger = LoggerFactory.getLogger("Main")  
>  // 创建vertx实例  
>  val vertx = Vertx.vertx()  
>  logger.info("vertx实例创建成功")  
>  
>  try {  
>    // 加载配置文件  
>    val store = ConfigStoreOptions()  
>      .setType("file")  
>      .setFormat("hocon")  
>      .setConfig(JsonObject().put("path", "application.conf"))  
>  
>    val retriever = ConfigRetriever.create(vertx,  
>      io.vertx.config.ConfigRetrieverOptions().addStore(store))  
>  
>    val appConfig = retriever.getConfig().await()  
>  
>    val databaseConfig = appConfig.getJsonObject("database")  
>    val connectOptions = MySQLConnectOptions()  
>      .setPort(databaseConfig.getInteger("port"))  
>      .setHost(databaseConfig.getString("host"))  
>      .setDatabase(databaseConfig.getString("name"))  
>      .setUser(databaseConfig.getString("username"))  
>      .setPassword(databaseConfig.getString("password"))  
>  
>    val poolOptions = PoolOptions()  
>      .setMaxSize(databaseConfig.getJsonObject("pool").getInteger("max-size"))  
>    // 创建数据库连接池  
>    val client = Pool.pool(vertx, connectOptions, poolOptions)  
>  
>    // 读取服务端口  
>    val serverPort = appConfig.getJsonObject("server").getInteger("port")  
>  
>    // 启动服务  
>    val router = Router.router(vertx)  
>    vertx.createHttpServer()  
>      .requestHandler(router)  
>      .listen(serverPort)  
>      .onSuccess { server ->  
>        logger.info("服务启动成功，端口：${server.actualPort()}")  
>        println("成功启动服务，端口：${server.actualPort()}")  
>      }  
>      .onFailure { err ->  
>        logger.error("服务启动失败" + err.message)  
>        println("服务启动失败！"+ err.message)  
>      }  
>  
>  
>  }catch (e: Exception){  
>    logger.error("加载配置文件失败" + e.message)  
>    throw e  
>  }  
>}
> ```

## 1.6 单体架构实践：简单的电商购物平台
### 开发过程（以User为例，其它模块同理）
#### 创建项目
> [!note] 操作过程
> ## *使用环境*
> - JDK 17
> - Intellij IDEA
> - Kotlin 2.2
> - Vertx 5.0.5
> - MySQL 8.0.39
> ## *创建过程*
> - 在IDEA中创建新的空项目，命名为Vertx_EShopping
> - 通过官方网站进行项目的构建和压缩包的下载
> - 将压缩包的内容解压到项目目录下
> - 进行初始配置
> ## *初始配置*
> - 在 build.gradle.kts 中添加相关依赖
> ```kotlin
>import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar  
>import org.gradle.api.tasks.testing.logging.TestLogEvent.*  
>import org.jetbrains.kotlin.gradle.dsl.JvmTarget  
>import org.jetbrains.kotlin.gradle.dsl.KotlinVersion  
>  
>plugins {  
>  kotlin ("jvm") version "2.2.20"  
>  application  
>  id("com.gradleup.shadow") version "9.2.2"  
>}  
>  
>group = "com.example"  
>version = "1.0.0-SNAPSHOT"  
>  
>repositories {  
>  mavenCentral()  
>}  
>  
>val vertxVersion = "5.0.5"  
>val junitJupiterVersion = "5.9.1"  
>val coroutinesVersion = "1.10.2"
>  
>// 直接使用我们的main函数作为入口，不需要Vertx launcher  
>val mainClassName = "com.example.vertx_eshopping.Vertx_EShopping_MainKt"  
>  
>application {  
>  mainClass.set(mainClassName)  
>}  
>  
>dependencies {  
>  implementation(platform("io.vertx:vertx-stack-depchain:$vertxVersion"))  
>  implementation("io.vertx:vertx-launcher-application")  
>  implementation("io.vertx:vertx-lang-kotlin")  
>  implementation("io.vertx:vertx-lang-kotlin-coroutines")
>  // 数据库  
>  implementation("io.vertx:vertx-mysql-client:${vertxVersion}")  
>  implementation("io.vertx:vertx-web")  
>  // openapi  
>  implementation("io.vertx:vertx-openapi")  
>  implementation("io.vertx:vertx-web-validation")  
>  implementation("io.vertx:vertx-json-schema")  
>  // 日志  
>  implementation("io.vertx:vertx-web-client")  
>  implementation("org.slf4j:slf4j-api:2.0.9")  
>  implementation("ch.qos.logback:logback-classic:1.4.11")  
>  // 对hocon的支持  
>  implementation("io.vertx:vertx-config")  
>  implementation("io.vertx:vertx-config-hocon")  
>  testImplementation("io.vertx:vertx-junit5")  
>  testImplementation("org.junit.jupiter:junit-jupiter:$junitJupiterVersion")  
>  testRuntimeOnly("org.junit.platform:junit-platform-launcher")  
>  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")
>}  
>  
>kotlin {  
>  compilerOptions {  
>    jvmTarget = JvmTarget.fromTarget("17")  
>    languageVersion = KotlinVersion.fromVersion("2.2")
>    apiVersion = KotlinVersion.fromVersion("2.2")
>  }  
>}  
>  
>tasks.withType<ShadowJar> {  
>  archiveClassifier.set("fat")  
>  mergeServiceFiles()  
>}  
>  
>tasks.withType<Test> {  
>  useJUnitPlatform()  
>  testLogging {  
>    events = setOf(PASSED, SKIPPED, FAILED)  
>  }  
>}  
>  
>tasks.withType<JavaExec> {  
>  // 不需要传递参数，因为我们直接运行main函数  
>  args = emptyList()  
>}
> ```
> - 添加配置文件，配置相关内容（在此之前先在插件市场下载HOCON插件，便于支持.conf的配置文件）
> 应用配置文件
> ```hocon
> # 数据库配置  
>database {  
>  # 数据库主机地址  
>  host = "localhost"  
>  # 数据库端口号  
>  port = 3306  
>  # 数据库名称  
>  name = "Your Database Name"  
>  # 数据库用户名  
>  username = "Your User"  
>  # 数据库密码  
>  password = "Your Password"  
>  
>  # 连接池配置  
>  pool {  
>    # 最大连接数  
>    max-size = 5  
>  }  
>}  
># HTTP服务器配置  
>server {  
>  # 服务器监听端口  
>  port = 8090  
>}  
># 日志配置  
>logging {  
>  level = "INFO"  
>  # 可以定义不同的包或类的日志级别  
>  # com.example.starter = "DEBUG"  
>}
> ```
> 日志配置文件
> ```xml
> <configuration>  
>  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">  
>    <encoder>  
>      <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>  
>    </encoder>  
>  </appender>  
>  
>  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">  
>    <file>logs/app.log</file>  
>    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">  
>      <fileNamePattern>logs/app.%d{yyyy-MM-dd}.%i.log</fileNamePattern>  
>      <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">  
>        <maxFileSize>10MB</maxFileSize>  
>      </timeBasedFileNamingAndTriggeringPolicy>  
>      <maxHistory>30</maxHistory>  
>    </rollingPolicy>  
>    <encoder>      
>    <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>  
>    </encoder>  
>  </appender>  
>  
>  <root level="INFO">  
>    <appender-ref ref="STDOUT"/>  
>    <appender-ref ref="FILE"/>  
>  </root>  
>  
>  <!-- 设置特定包的日志级别 -->  
>  <logger name="com.example.starter" level="DEBUG"/>  
></configuration>
> ```
> - 修改启动类
> ```kotlin
>suspend fun main(){  
>  // 创建日志  
>  val logger = LoggerFactory.getLogger("Main")  
>  // 创建vertx实例  
>  val vertx = Vertx.vertx()  
>  logger.info("vertx实例创建成功")  
>  
>  try {  
>    // 加载配置文件  
>    val store = ConfigStoreOptions()  
>      .setType("file")  
>      .setFormat("hocon")  
>      .setConfig(JsonObject().put("path", "application.conf"))  
>  
>    val retriever = ConfigRetriever.create(vertx,  
>      io.vertx.config.ConfigRetrieverOptions().addStore(store))  
>  
>    val appConfig = retriever.getConfig().await()  
>  
>    val databaseConfig = appConfig.getJsonObject("database")  
>    val connectOptions = MySQLConnectOptions()  
>      .setPort(databaseConfig.getInteger("port"))  
>      .setHost(databaseConfig.getString("host"))  
>      .setDatabase(databaseConfig.getString("name"))  
>      .setUser(databaseConfig.getString("username"))  
>      .setPassword(databaseConfig.getString("password"))  
>  
>    val poolOptions = PoolOptions()  
>      .setMaxSize(databaseConfig.getJsonObject("pool").getInteger("max-size"))  
>    // 创建数据库连接池  
>    val client = Pool.pool(vertx, connectOptions, poolOptions)  
>  
>    // 读取服务端口  
>    val serverPort = appConfig.getJsonObject("server").getInteger("port")  
>  
>    // 初始化仓库、服务和控制器  (后续完善)
>    
>  
>    // 启动服务  
>    val router = Router.router(vertx)  
>  
>    // 注册路由  (后续完善)
>    
>  
>    vertx.createHttpServer()  
>      .requestHandler(router)  
>      .listen(serverPort)  
>      .onSuccess { server ->  
>        logger.info("服务启动成功，端口：${server.actualPort()}")  
>      }  
>      .onFailure { err ->  
>        logger.error("服务启动失败" + err.message)  
>      }  
>  
>  
>  }catch (e: Exception){  
>    logger.error("加载配置文件失败" + e.message)  
>    throw e  
>  }  
>}
> ```


#### Entity层
> [!example] 使用数据类进行用户实体的创建
> ```kotlin
>data class User(  
>  /** 用户ID，自增主键 */  val id: Int? = null,  
>  /** 用户名，唯一标识符 */  val username: String? = null,  
>  /** 密码，加密存储 */  val password: String? = null,  
>  /** 邮箱，唯一 */  val email: String? = null,  
>  /** 手机号，唯一 */  val phone: String? = null,  
>  /** 昵称 */  val nickname: String? = null,  
>  /** 头像URL */  
>  val avatar: String? = null,  
>  /** 状态：1-启用，0-禁用，默认1 */  
>  val status: Int? = 1,  
>  /** 创建时间 */  val createdAt: LocalDateTime? = null,  
>  /** 更新时间 */  val updatedAt: LocalDateTime? = null  
>)
> ```

#### DTO层
> [!attention] 为了更好的进行响应的处理，在开始编写DTO前，先编写统一响应类R
> 统一响应类使用密封类+数据类的方式进行编写：
> ```kotlin
>sealed class R {  
>  abstract val code: Int  
>  abstract val message: String  
>  abstract val data: Any?  
>  abstract val success: Boolean  
>  
>  data class Success(  
>    override val code: Int,  
>    override val message: String,  
>    override val data: Any? = null,  
>    override val success: Boolean = true  
>  ) : R()  
>  
>  data class Error(  
>    override val code: Int,  
>    override val message: String,  
>    override val data: Any? = null,  
>    override val success: Boolean = false  
>  ) : R()  
>  
>  data class Empty(  
>    override val code: Int = 0,  
>    override val message: String = "",  
>    override val data: Any? = null,  
>    override val success: Boolean = false  
>  ) : R()  
>  // 后续按需扩充
>}
> ```

> [!example] 编写 UserDto
> DTO依旧采取密封类+数据类的形式进行编写，能够使之更加条理
> ```kotlin
>sealed class UserDto {  
>  data class CreateUserDto(  
>    val username: String,  
>    val password: String,  
>    val email: String,  
>    val phone: String,  
>    val nickname: String,  
>    val avatar: String  
>  ) : UserDto()  
>  
>  data class UpdateUserDto(  
>    val username: String,  
>    val password: String,  
>    val email: String,  
>    val phone: String,  
>    val nickname: String,  
>    val avatar: String  
>  ) : UserDto()  
>  // 后续按需扩充数据类即可
>}
> ```

#### Repository层

#### Service层

#### Handler层

#### Controller层

#### 修改启动类


--- 
# 2. 微服务架构的实践
## 2.1 微服务概述

## 2.2 使用 Vert.x EventBus 实现服务间通信

## 2.3 拆分多个 Verticle 实现独立服务

## 2.4 RESTful API设计与统一网关

## 2.5 数据库与缓存分离

## 2.6服务发现与健康检查

## 2.7 部署

## 2.8 监控与可观测性

## 2.9 微服务实践：电视购物平台的重构
