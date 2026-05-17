> [!tip] 相关内容
> [[Kotlin知识点快速梳理|Kotlin]]、[[Kotlin Multiplatform|KMP]]

# 0. 简介
> [!note] Ktor
> Ktor 是 JetBrains 推出的 Kotlin 网络应用框架。它既可以用于构建服务端应用，也可以作为多平台 HTTP 客户端使用。Ktor 的核心特点是轻量、插件化、协程友好。
> 
> ## *核心定位*
> - **Kotlin优先**：充分利用协程、挂起函数、扩展函数和DSL，让异步网络代码保持清晰
> - **异步非阻塞**：服务端可以选择Netty、CIO、Jetty等engine；客户端也可以按平台选择不同engine
> - **插件化设计**：路由、认证、CORS、内容协商、序列化、会话等能力通过插件组合
> - **多平台客户端**：Ktor Client可在JVM、Android、iOS、JS、Native等平台使用
> 
> ## *应用场景*
> - 微服务API开发
> - 前后端分离的RESTful接口
> - WebSocket实时通信
> - KMP项目中的统一HTTP客户端
> - 轻量级网关或内部服务

> [!note] 对比分析：Ktor VS SpringBoot VS Vert.x

|  维度   |            Ktor             |       SpringBoot       |         Vert.x         |
| :---: | :-------------------------: | :--------------------: | :-------------------: |
|  语言   |        Kotlin优先         |      Java/Kotlin       |   Java/Kotlin等   |
| 学习路线  |             中等              |           中等偏高           |         中等偏高          |
|  性能   |             高              |           良好到高           |          高           |
| 内存占用  |             较低              |           较高           |          较低           |
| 启动速度  |             较快             |           取决于模块和配置           |          较快           |
| 异步支持  |           协程+挂起函数           |    MVC / WebFlux / 协程集成     |  事件循环+Future/Promise/协程扩展  |
| 生态成熟度 |        JetBrains官方支持        |          企业生态最成熟           |          响应式生态较强           |
| 微服务支持 |      轻量灵活，需要自行组合治理能力       | Spring Cloud体系最完整 | 可用，需要手动组合服务发现、配置和监控 |
| 全平台潜力 |            Server为JVM，Client支持KMP            |          主要JVM          |         主要JVM          |
| 使用场景  |     API、轻量服务、KMP客户端、WebSocket     | 企业级应用、中大型项目、已有Spring体系 |   高性能网关、实时通信、IoT后端    |

---
# 1. Ktor入门
> [!tip] 说明
> ## 参考文档
> [Ktor官方文档](https://ktor.io/docs/welcome.html)
> ## 使用的IDE
> Intellij IDEA

## 1.1 第一个Ktor项目
> [!summary] 创建步骤
> - 在 IDEA 中点击创建项目
> - 选择 Ktor
> - 命名、路径选择
> - 构建方式选择：Gradle Kotlin
> - 配置文件类型选择：HOCON或YAML
> - 按需勾选Routing、Content Negotiation、Serialization等插件
> - 创建项目并等待Gradle同步

一个最小服务端示例：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello Ktor")
            }
        }
    }.start(wait = true)
}
```

## 1.2 处理请求与生成响应
Ktor通过`ApplicationCall`表示一次请求-响应过程。

```kotlin
routing {
    get("/hello/{name}") {
        val name = call.parameters["name"] ?: "Ktor"
        call.respondText("Hello, $name")
    }
}
```

常用对象：
- `call.request`：读取请求信息
- `call.parameters`：读取路径参数
- `call.request.queryParameters`：读取查询参数
- `call.respond`：返回对象或状态
- `call.respondText`：返回纯文本

## 1.3 创建RESTful API
```kotlin
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class UserDto(val id: Long, val name: String)

routing {
    route("/users") {
        get {
            call.respond(listOf(UserDto(1, "Tom")))
        }

        post {
            val user = call.receive<UserDto>()
            call.respond(HttpStatusCode.Created, user)
        }
    }
}
```

> [!warning] 注意
> `call.receive<T>()`需要安装内容协商与序列化插件，否则无法自动解析JSON。

## 1.4 内容协商与序列化
```kotlin
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }
}
```

## 1.5 创建静态网站
```kotlin
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

routing {
    staticResources("/static", "static")
}
```

目录示例：
```text
src/main/resources/static/index.html
```

## 1.6 创建WebSocket程序
```kotlin
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlin.time.Duration.Companion.seconds

install(WebSockets) {
    pingPeriod = 15.seconds
}

routing {
    webSocket("/ws") {
        send("connected")
        for (frame in incoming) {
            if (frame is Frame.Text) {
                send("echo: ${frame.readText()}")
            }
        }
    }
}
```

## 1.7 集成数据库
Ktor本身不限定数据库方案。常见组合：
- Exposed：Kotlin DSL/DAO
- jOOQ：类型安全SQL生成
- Hibernate/JPA：传统ORM
- R2DBC或Vert.x SQL Client：非阻塞数据库访问

> [!tip] 实践建议
> 如果使用JDBC类库，要避免在事件循环线程中执行长时间阻塞操作。可以使用专门的调度器、连接池和清晰的事务边界。

## 1.8 Koin 依赖注入
Ktor不强制使用DI框架，可以选择Koin、Kodein、Spring或手写依赖组装。

```kotlin
val appModule = module {
    single { UserService() }
}

fun Application.configureDI() {
    install(Koin) {
        modules(appModule)
    }
}
```

---
# 2. Ktor进阶
## 2.1 开发应用程序基础架构
推荐把Ktor应用拆成配置函数：

```kotlin
fun Application.module() {
    configureSerialization()
    configureRouting()
    configureMonitoring()
}
```

这样可以让启动、路由、插件、监控、异常处理分离，便于测试。

## 2.2 创建与配置服务器
Ktor服务端通常有两类启动方式：
- `embeddedServer`：代码中创建并启动服务器
- EngineMain：通过配置文件和`application.conf`启动

`application.conf`示例：
```hocon
ktor {
  deployment {
    port = 8080
  }
  application {
    modules = [ com.example.ApplicationKt.module ]
  }
}
```

## 2.3 路由
路由可以分组，避免路径重复：

```kotlin
routing {
    route("/api") {
        route("/users") {
            get { /* ... */ }
            post { /* ... */ }
        }
    }
}
```

## 2.4 处理请求进阶
常见内容：
- Header读取
- Cookie读取
- Multipart上传
- 参数校验
- 请求体大小限制

> [!summary] 实践原则
> Controller/Route层只做协议转换和参数校验，复杂业务逻辑放到Service层。

## 2.5 处理响应进阶
常见响应：
- JSON对象
- 文件下载
- 状态码
- 重定向
- 流式响应

```kotlin
call.respond(HttpStatusCode.NotFound, mapOf("message" to "not found"))
```

## 2.6 内容服务
静态资源、缓存头、压缩、CORS等都可以通过插件组合。

常见插件：
- `CORS`
- `Compression`
- `CachingHeaders`
- `ConditionalHeaders`

## 2.7 模板引擎集成
Ktor可以集成FreeMarker、Thymeleaf等模板引擎，但如果是前后端分离项目，通常只提供JSON API。

## 2.8 认证与授权
Ktor认证通过`Authentication`插件完成，常见方式：
- Basic
- Form
- JWT
- OAuth
- Session

```kotlin
install(Authentication) {
    bearer("auth-bearer") {
        authenticate { tokenCredential ->
            if (tokenCredential.token == "dev-token") UserIdPrincipal("dev") else null
        }
    }
}
```

## 2.9 会话管理
Session适合保存少量登录态信息，不适合存放大量业务数据。

## 2.10 HTTP 协议增强功能
常见插件：
- `CallLogging`
- `StatusPages`
- `DefaultHeaders`
- `ForwardedHeaders`

`StatusPages`常用于统一异常响应：

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respond(HttpStatusCode.InternalServerError, cause.message ?: "error")
    }
}
```

## 2.11 WebSocket深入
需要关注：
- 心跳
- 连接生命周期
- 背压
- 鉴权
- 消息格式
- 断线重连策略

## 2.12 Socket通信
Ktor主要面向HTTP/WebSocket。如果需要更底层的TCP/UDP通信，可以考虑Ktor Network或Vert.x等工具。

## 2.13 监控与可观测性
服务端项目应至少具备：
- 访问日志
- 错误日志
- 指标采集
- 健康检查
- Trace ID

> [!summary] Ktor最佳实践
> - 插件按职责拆分到独立配置函数
> - 路由层保持薄，只处理协议与参数
> - 统一异常处理和响应格式
> - 使用协程时避免阻塞事件循环线程
> - 生产环境显式配置日志、超时、CORS、安全头和健康检查
