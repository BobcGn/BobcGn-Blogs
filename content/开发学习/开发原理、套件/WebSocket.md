---
title: 'WebSocket'
date: 2026-04-28
tags:
  - 开发学习
  - 开发学习/开发原理、套件
---

# 0. Web 开发那点事
> [!note] WebSocket的起源
> # *WebSocket之前的那点“痛”*
> 对于经常接触 web 开发的朋友们来说，web开发的最基本原理应该已经很熟悉了：`HTTP请求 -> 服务器响应`。但是对于这些场景：
> - 实时聊天
> - 直播弹幕
> - 实时股票行情
> - 在线游戏
> 如果对这些**高频同步场景**仍然使用 HTTP 请求，想象一下，我需要每隔一秒甚至更高频地发送请求，那么这时服务器就会“原地去世”。
> # *传统的解决方案*
> 在 WebSocket 出现之前，开发者们也尝试过诸多方案来进行“曲线救国”：
> ## 轮询
> 最简单粗暴的方式，每一秒向服务器发送一次请求。但是伴随而来的是：
> - 请求数量爆炸
> - 给服务器带来巨大压力
> - 很多请求并没有得到更新
> 
> 属于是为了找到一粒沙（更新的数据），扬了整个撒哈拉（所有的数据），得不偿失且浪费资源
> ## 长轮询
> 优化版的轮询，流程是：
> 1. 客户端向服务器发出请求
> 2. 如果没有更新数据，那么先不返回消息
> 3. 等到有数据更新后再返回
> 但是这种方式虽然减少了无效请求次数，但是实际上还是没有改变**HTTP请求不断建立与关闭**的本质，仍然不优雅
> 
> 于是，为了上述的问题，WebSocket诞生了！


---
# 1. WebSocket 原理
> [!question] WebSocket是什么？
> WebSocket 是一种**在客户端和服务器之间建立“长连接”的通信协议**，它最大的特点是：**连接建立后，双方可以随时相互发送数据**。
> 形象地理解：
>- **HTTP**：像**每次出行都打一辆新的出租车**。
>	- 告诉司机目的地（发送请求）。
>	- 到达后，下车，付钱，**司机离开（连接关闭）**。
>	- 下次出门，再叫一辆新车，重复所有步骤（握手、建立连接）。
>- **WebSocket**：像**包下一辆车并让司机整天待命**。
>	- 第一次沟通好价格和路线（握手）。
>	- 然后司机就一直在你门口等着。
>	- 你随时可以上车去任何地方（发送数据），司机也随时可以告诉你路况变化（服务器推送）。
>	- **一次付费（连接开销），全天候服务**
>
>这就是所谓的**全双工通信（Full Duplex）**，也就是：客户端和服务端都可以收发，二者都是主动方。

> [!note] WebSocket工作原理
> WebSocket 的建立过程其实很有意思，它一开始是 HTTP 请求，然后再`Upgrade`为WebSocket，这个过程叫做**协议升级**
> # 第一步：客户端发起请求
> 浏览器会发出一个请求：
> ```http
> GET /chat HTTP/1.1 
> Host: server.example.com 
> Upgrade: websocket  
> Connection: Upgrade 
> Sec-WebSocket-Key: abc123 
> Sec-WebSocket-Version: 13
> ```
> 关键字段为`Upgrade: websocket`，表示要“升级”为WebSocket
> # 第二步：服务端同意升级
> 服务器返回：
> ```http
> HTTP/1.1 101 Switching Protocols
> Upgrade: websocket
> Connection: Upgrade
> ```
> 当看到 *101* 状态码时，说明 WebSocket 连接建立成功，之后的所有通信都会走**WebSocket数据帧（Frame）**

> [!summary] WebSocket的优势
> # **真正的实时通信**
> 服务器可以主动推送数据，比如聊天信息一旦发出，那么服务器会将这条消息推送给所有接收该信息的用户，无需轮询
> # **减少网络开销**
> HTTP 请求头通常占几百字节，而 WebSocket 的数据帧通常只需要较小的帧头开销，差距很明显
> # **长连接**
> 对于配置过 OpenClaw 这类的 Agent 并尝试对接某应用的机器人的用户来说，*长连接*这个词不算陌生。如果仔细观察，不同的 agent 在配置时，有时会看到选项标注为“长连接”，有时则直接写“WebSocket”。需要注意的是，这两者并不等同：**“长连接”是一种连接保持策略，而 WebSocket 是一种基于长连接的通信协议**。
> 上述操作本质上是通过一个 mcp 服务的 WebSocket 来建立Agent与目标平台的长连接，达到互相通信的目的，如：用户通过给飞书机器人发送消息，机器人通过长连接从OpenClaw得到答案，之后OpenClaw 再将答案返回给飞书，最后在飞书机器人的聊天看板中得到答案。这个过程同时也再次印证了 WebSocket 双向通信的优势
> 
> WebSocket 协议通过**建立持久化的全双工 TCP 连接**，实现了长连接的通信模式：
> - *一次握手*，长期通信：在连接建立后，只要不主动关闭连接或者出现网络异常，连接就会一直保持
> - *状态保持*：服务端和客户端可以在此连接上维持会话状态，非常适合需要持续交互/高频同步的场景
> 
> # **双向通信**
> - 客户端可以发`send()`
> - 服务端可以发`push()`
> 
> 双方完全对等

> [!warning] WebSocket的注意点
> WebSocket 虽然好用，但是不是万金油！仍然需要注意处理下列内容：
> # **连接管理**
> 假如一个聊天系统，有10w用户在线，那么服务器就需要同时维护10w条连接。
> 对于高并发，通常需要考虑：
> - Netty
> - 负载均衡
> - 分布式架构
> # **心跳机制（Heartbeat）**
> WebSocket 可能会断开连接，那么这时就需要**心跳包** 来保持连接：
> ```text
> 客户端每 30s 发送一次 ping
> 服务器返回 pong
> ```
> # **断线重连**
> 网络波动很常见，因此客户端通常会*断开连接 -> 自动重连*。
> 生产环境必备！

---
# 2. WebSocket 使用
## 2.1 Ktor集成
> [!note] 配置依赖
> `io.ktor:ktor-server-websockets`
> 1. 需要在`build.gradle.kts`中添加 WebSocket 的插件：
> ```kotlin
> dependencies{
> 	implementation("io.ktor:ktor-server-websockets")
> }
> ```
> 2. 在`Sockets.kt`中编写 WebSocket 的相关配置
> ```kotlin
> // Sockets.kt 示例
> package com.example  
> import io.ktor.server.application.*  
> import io.ktor.server.routing.*  
> import io.ktor.server.websocket.*  
> import io.ktor.websocket.*  
> import kotlin.time.Duration.Companion.seconds  
>  
>fun Application.configureSockets() {  
>    install(WebSockets) {  
> 	   // 心跳包：间隔15s发送一次ping
>        pingPeriod = 15.seconds  
>        // 如果在 15 秒内没有收到客户端的 Pong 响应（对 Ping 的回应），则认为连接已断开，自动关闭会话
>        timeout = 15.seconds  
>        // 允许单个 WebSocket 帧的最大字节数
>        maxFrameSize = Long.MAX_VALUE  
>        // 是否要求客户端对发送的数据进行掩码（masking）
>        masking = false  
>    }  
>    // WebSocket路由
>    routing {  
>        webSocket("/ws") { 
> 	       // websocketSession  
>            for (frame in incoming) {  
> 	           // incoming是一个挂起的channel，表示从客户端收到的所有WebSocket帧。
> 	           // for循环会持续监听传入的信息，直至连接关闭。每收到一帧，循环体就会执行一次
>                if (frame is Frame.Text) {  
> 	               // 仅处理Text类型的WebSocket帧
> 	               // 从Frame.Text中读取内容
>                    val text = frame.readText()  
>                    //向客户端发送帧
>                    outgoing.send(Frame.Text("YOU SAID: $text"))  
>                    // 如果收到了“bye”（不区分大小写），服务端主动关闭连接
>                    if (text.equals("bye", ignoreCase = true)) {  
>                        close(CloseReason(CloseReason.Codes.NORMAL, "Client said BYE"))  
>                    }  
>                }  
>            }  
>        }  
>    }
>}
> ```

## 2.2 SpringBoot集成
> [!note] SpringBoot 中的两种写法
> SpringBoot 集成 WebSocket 通常有两条路线：
> - **原生 WebSocketHandler**：适合简单推送、设备连接、内部长连接
> - **STOMP over WebSocket**：适合聊天、订阅、广播、用户队列等消息模型
>
> 原生 WebSocket 更像“拿到一条连接自己管理”；STOMP 更像“在 WebSocket 上跑消息协议”。

> [!important] Spring WebSocket + STOMP 架构
> ```mermaid
> flowchart TD
>     A[浏览器/移动端] -->|WebSocket 握手| B[Spring WebSocket Endpoint]
>     B --> C[STOMP 帧解析]
>     C --> D{消息目标 destination}
>     D -->|/app/**| E[@MessageMapping Controller]
>     D -->|/topic/**| F[Simple Broker 广播]
>     D -->|/queue/**| G[用户队列]
>     E --> H[SimpMessagingTemplate]
>     H --> F
>     H --> G
>     F --> I[所有订阅者]
>     G --> J[指定用户/会话]
> ```

> [!example] 依赖配置
```kotlin
// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-websocket")
}
```

> [!example] STOMP 配置
```java
// WebSocketConfig.java
package com.example.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                // 生产环境应替换为明确域名
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 客户端订阅 /topic/** 可接收广播消息
        registry.enableSimpleBroker("/topic", "/queue");
        // 客户端发送到 /app/** 的消息会进入 @MessageMapping
        registry.setApplicationDestinationPrefixes("/app");
        // /user/** 用于给指定用户推送消息
        registry.setUserDestinationPrefix("/user");
    }
}
```

> [!example] 消息 DTO 与 Controller
```java
// ChatMessage.java
package com.example.websocket;

public record ChatMessage(
        String roomId,
        String sender,
        String content,
        Long timestamp
) {}
```

```java
// ChatController.java
package com.example.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message) {
        // 将消息广播给同一个房间的所有订阅者
        messagingTemplate.convertAndSend(
                "/topic/rooms/" + message.roomId(),
                message
        );
    }
}
```

> [!example] 客户端订阅思路
```javascript
// 浏览器端示例，实际项目通常使用 @stomp/stompjs
const socket = new WebSocket("ws://localhost:8080/ws");

socket.onopen = () => {
  // 原生 WebSocket 只负责连接，STOMP 客户端会在此基础上发送 CONNECT/SUBSCRIBE/SEND 帧
  console.log("connected");
};
```

## 2.3 集群部署与消息广播
> [!warning] 单机 WebSocket 的问题
> WebSocket 连接是有状态的：客户端 A 连接在服务 1，客户端 B 连接在服务 2。
> 如果服务 1 只在本机内存里广播消息，那么服务 2 上的客户端就收不到。

> [!important] 集群广播架构
> ```mermaid
> flowchart TD
>     C1[客户端 A] --> LB[负载均衡]
>     C2[客户端 B] --> LB
>     LB --> S1[服务实例 1]
>     LB --> S2[服务实例 2]
>
>     S1 --> R[(Redis Pub/Sub<br/>或 RabbitMQ)]
>     S2 --> R
>     R --> S1
>     R --> S2
>
>     S1 --> C1
>     S2 --> C2
> ```

> [!summary] 生产环境要处理的问题
> - **鉴权**：握手时校验 Token，避免未登录用户建立连接
> - **心跳**：及时发现断开的连接
> - **重连**：客户端指数退避重连，避免同时打爆服务端
> - **限流**：限制单用户发送频率
> - **背压**：客户端消费慢时不能无限堆积消息
> - **集群广播**：使用 Redis Pub/Sub、RabbitMQ、Kafka 或外部 STOMP Broker
> - **连接迁移**：滚动发布时要让客户端自动重连到新实例

# 3. 总结
> [!summary] WebSocket 的本质
> WebSocket 解决的是“服务端如何主动把数据推给客户端”的问题。
> 单机实现并不复杂，真正的难点在于连接管理、鉴权、心跳、重连、集群广播和背压。
>
> 选型建议：
> - 简单实时推送：Ktor WebSocket / Spring WebSocketHandler
> - 聊天和订阅模型：Spring STOMP 或 Ktor 自定义协议
> - 大规模连接：Netty、网关层连接服务、外部消息系统配合广播
