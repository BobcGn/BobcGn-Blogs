---
title: "JavaWeb"
date: 2025-01-01
tags: []
---

# 0. 认识JavaWeb
> [!note]
> 先导内容: [[Java知识点总结|Java]]
> 
> 在系统性地掌握了 ​**JavaSE**​（标准版）的核心语法、面向对象思想及基础API，并理解了 ​**JavaEE**​（企业版）的多层架构、组件模型与分布式概念后，我们站在了一个新的起点。此时，我们脑海中应自然而然地浮现出一个根本性问题：​**如何利用我们已经掌握的Java技术，去构建一个能够通过浏览器访问、与用户交互、并处理复杂业务逻辑的动态应用程序？​**​ 换言之，如何让我们的Java代码不再仅仅运行于本地命令行或桌面程序，而是能够在互联网的浪潮中提供服务？这个问题的答案，正是我们接下来要深入探索的领域——**JavaWeb**。
> 
> JavaWeb技术提供了一整套完整的解决方案来回答上述问题。它的核心思想是**基于HTTP协议，接收来自客户端（通常是浏览器）的请求，由服务器端的Java程序处理业务逻辑，生成动态内容，并最终返回给客户端渲染展示**。这个过程涉及几个关键层面的思考与解决：​**如何接收和解析HTTP请求？如何保持用户的状态（如登录信息）？如何与数据库进行高效、安全的交互？如何将处理结果组织成HTML页面？​**​ 这些在JavaSE和JavaEE中未曾深入触及的、属于Web领域的特定问题，都将在JavaWeb技术栈中找到答案。例如，Servlet作为请求的“调度中心”，JSP/Servlet用于动态页面渲染，Cookie/Session用于状态管理，JDBC用于数据库连接，它们共同构成了JavaWeb应用的骨架。
> 


# 1. 前端基础
> [!note] 相关内容
> [[HTML-CSS]], [[JavaScript学习|JavaScript]], [[Vue]]


# 2. Ajax
> [!note] 概述
> Ajax（Asynchronous JavaScript And XML）​是一种在不刷新整个页面的情况下，与服务器交换数据并**局部更新页面**的技术。它的出现让Web应用从"点击-等待-刷新"的模式，升级到了更流畅的"实时交互"体验。虽然名字里带XML，但现代开发中绝大多数情况使用**JSON**作为数据交换格式。

## 2.1. 核心原理: XMLHttpRequest
Ajax的核心是浏览器内置的**XMLHttpRequest**对象，它充当了JavaScript与服务器之间的"信使"。

> [!note] 工作流程
> 1. 浏览器创建 `XMLHttpRequest` 对象
> 2. 通过 `open()` 指定请求方式（GET/POST）和URL
> 3. 通过 `send()` 发送请求
> 4. 监听 `onreadystatechange` 事件，在 `readyState==4` 且 `status==200` 时接收响应数据
> 5. 用JavaScript操作DOM，将数据渲染到页面

> [!example] 示例: 原生Ajax发送GET请求
```java
// 1. 创建XMLHttpRequest对象
var xhr = new XMLHttpRequest();
// 2. 配置请求
xhr.open("GET", "/servlet/queryUser?name=zhangsan", true);
// 3. 发送请求
xhr.send();
// 4. 监听响应
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        // 5. 处理响应数据
        var data = JSON.parse(xhr.responseText);
        document.getElementById("result").innerHTML = data.name;
    }
};
```

## 2.2. Axios
原生Ajax写法较为繁琐，现代开发中常用**Axios**库来简化请求。

> [!example] 示例: Axios发送POST请求
```javascript
axios.post("/servlet/login", {
    username: "admin",
    password: "123456"
}).then(function(response) {
    if (response.data.success) {
        window.location.href = "/index.html";
    } else {
        alert("登录失败");
    }
}).catch(function(error) {
    console.log("请求出错:", error);
});
```

## 2.3. Ajax与JavaWeb Servlet配合
在JavaWeb中，Ajax请求也由**Servlet**接收和处理，唯一区别是Servlet返回的不是HTML页面，而是**JSON字符串**。

> [!example] 示例: Servlet处理Ajax请求并返回JSON
```Java
@WebServlet("/servlet/queryUser")
public class QueryUserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String name = req.getParameter("name");
        PrintWriter out = resp.getWriter();
        out.write("{\"name\":\"" + name + "\", \"age\":20}");
    }
}
```

> [!tip] 总结
> Ajax的核心价值在于**异步交互**与**局部刷新**，它让前后端通过JSON数据"对话"，前端负责渲染，后端专注业务逻辑。在JavaWeb中，Servlet接收Ajax请求后返回JSON即可完成交互。

---

# 3. Maven
> [!note] 概述
> Maven是Java生态中最主流的**项目构建与依赖管理工具**。它解决了传统Java项目中的两大痛点：**jar包手动管理混乱**（依赖地狱）和**项目结构不统一**。通过一个核心配置文件`pom.xml`，Maven可以自动下载依赖、编译代码、运行测试、打包部署。

## 3.1. Maven核心概念

> [!note] 坐标（Coordinate）
> Maven用三个字段唯一定位一个jar包，称为**坐标**：`groupId`（组织名）、`artifactId`（项目名）、`version`（版本号）。
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

> [!note] 仓库（Repository）
> Maven有三类仓库：**本地仓库**（本机缓存）、**私服**（公司内部）、**中央仓库**（Maven官方）。依赖查找顺序为：本地仓库 -> 私服 -> 中央仓库。

> [!note] 生命周期（Lifecycle）
> Maven定义了三套生命周期，最常用的是**default**生命周期，包含以下核心阶段：
> | 阶段 | 作用 |
> | :--: | :-- |
> | `compile` | 编译源代码 |
> | `test` | 运行单元测试 |
> | `package` | 打包（jar/war） |
> | `install` | 安装到本地仓库 |
> | `clean` | 清理target目录 |

## 3.2. pom.xml 核心结构

> [!example] 示例: 一个标准JavaWeb项目的pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 项目坐标 -->
    <groupId>com.example</groupId>
    <artifactId>my-webapp</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
        <!-- Servlet依赖 -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <!-- MySQL驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Tomcat插件，用于运行和调试 -->
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <port>8080</port>
                    <path>/</path>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## 3.3. Maven标准目录结构

```
项目根目录/
├── src/
│   ├── main/
│   │   ├── java/          ← Java源代码
│   │   ├── resources/     ← 配置文件
│   │   └── webapp/        ← Web资源(HTML/CSS/JS/WEB-INF)
│   └── test/
│       ├── java/          ← 测试代码
│       └── resources/     ← 测试配置
├── target/                ← 编译输出(自动生成)
└── pom.xml                ← Maven核心配置
```

## 3.4. 常用命令

| 命令 | 作用 |
| :-- | :-- |
| `mvn clean` | 清理target目录 |
| `mvn compile` | 编译源代码 |
| `mvn test` | 运行测试 |
| `mvn package` | 打包为war/jar |
| `mvn install` | 安装到本地仓库 |
| `mvn tomcat7:run` | 使用Tomcat插件运行项目 |

> [!tip] 总结
> Maven的核心价值在于**约定优于配置**——只要你按标准目录结构组织代码，Maven就能自动完成编译、测试、打包。掌握坐标、依赖、生命周期这三个概念，配合几个常用命令，就能高效管理JavaWeb项目。

---

# 4. Web核心原理
> [!note] 概述
> Web核心原理是JavaWeb中最关键的部分。它解释了**从浏览器输入URL到看到页面，背后发生了什么**。核心角色是**Servlet**——运行在服务器端的Java程序，负责接收请求、调用业务逻辑、返回响应。围绕Servlet，还有HTTP协议、Cookie/Session状态管理、Filter过滤器、Listener监听器等机制，共同构成完整的Web应用骨架。

## 4.1. HTTP协议
HTTP（HyperText Transfer Protocol）是浏览器与服务器之间的**通信规则**，基于"请求-响应"模型，每次交互都由客户端发起。

### 4.1.1. 请求格式

> [!note] HTTP请求结构
> 一个HTTP请求由四部分组成：**请求行**、**请求头**、**空行**、**请求体**（GET请求没有请求体）。
```
POST /servlet/login HTTP/1.1              ← 请求行: 方法 URL 协议版本
Host: www.example.com                      ← 请求头: 键值对
Content-Type: application/x-www-form-urlencoded
Content-Length: 29
                                           ← 空行(分隔符)
username=admin&password=123456             ← 请求体(POST参数)
```

### 4.1.2. 响应格式

> [!note] HTTP响应结构
> HTTP响应也由四部分组成：**状态行**、**响应头**、**空行**、**响应体**。
```
HTTP/1.1 200 OK                            ← 状态行: 协议版本 状态码 描述
Content-Type: text/html;charset=UTF-8       ← 响应头
Set-Cookie: JSESSIONID=ABC123
                                           ← 空行
<html><body>登录成功</body></html>           ← 响应体(页面内容)
```

> [!note] 常见状态码
> | 状态码 | 含义 | 典型场景 |
> | :--: | :-- | :-- |
> | 200 | 成功 | 请求正常处理 |
> | 302 | 重定向 | 登录后跳转到首页 |
> | 404 | 未找到 | URL不存在 |
> | 405 | 方法不允许 | GET访问了只支持POST的接口 |
> | 500 | 服务器内部错误 | 后端代码抛异常 |

### 4.1.3. GET 与 POST 的区别

> [!note] 说明
> | 对比维度 | GET | POST |
> | :-- | :-- | :-- |
> | 参数位置 | URL后面（查询字符串） | 请求体中 |
> | 安全性 | 参数暴露在URL中 | 相对安全（不显示在URL） |
> | 数据量 | 有限（URL长度限制约2KB） | 理论上无限制 |
> | 缓存 | 可被浏览器缓存 | 不会被缓存 |
> | 用途 | 查询数据 | 提交数据（表单、登录等） |

## 4.2. Servlet 核心
Servlet是JavaWeb的**核心调度器**，运行在Servlet容器（如Tomcat）中。每个Servlet负责处理特定的URL请求。

### 4.2.1. Servlet生命周期

> [!note] 说明
> Servlet的生命周期由容器管理，分为三个阶段：**初始化 → 服务 → 销毁**。
> 1. `init()`：Servlet被**首次访问**时调用一次，用于初始化资源
> 2. `service()`：每次请求到来时调用，根据请求方法分发到`doGet()`或`doPost()`
> 3. `destroy()`：容器关闭或Servlet被卸载时调用一次，用于释放资源
> 
> **关键点**：Servlet是**单例多线程**的——容器中每种Servlet只有一个实例，但多个请求由不同线程调用同一个实例的`service()`方法。

> [!example] 示例: 一个完整的Servlet
```Java
@WebServlet("/servlet/hello")
public class HelloServlet extends HttpServlet {

    // 初始化: Servlet首次被访问时执行
    public void init() throws ServletException {
        System.out.println("HelloServlet 初始化完成");
    }

    // 处理GET请求
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 设置响应内容类型和编码
        resp.setContentType("text/html;charset=UTF-8");
        // 获取请求参数
        String name = req.getParameter("name");
        // 向浏览器输出响应
        PrintWriter out = resp.getWriter();
        out.write("<h1>你好, " + (name != null ? name : "世界") + "!</h1>");
    }

    // 处理POST请求
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // POST请求通常转交给doGet统一处理(或反之)
        doGet(req, resp);
    }

    // 销毁: 容器关闭时执行
    public void destroy() {
        System.out.println("HelloServlet 被销毁");
    }
}
```

### 4.2.2. HttpServletRequest 与 HttpServletResponse

> [!note] 说明
> 这两个对象是Servlet与HTTP交互的"双手"：
> - **HttpServletRequest**：代表**请求**，用于获取客户端传来的所有信息
> - **HttpServletResponse**：代表**响应**，用于向客户端发送数据

> [!note] HttpServletRequest 常用方法
```Java
// 获取请求参数
String name = request.getParameter("name");        // 单个值
String[] hobbies = request.getParameterValues("hobby"); // 多值(复选框)

// 获取请求头信息
String userAgent = request.getHeader("User-Agent");
String cookie = request.getHeader("Cookie");

// 获取请求方式
String method = request.getMethod();  // "GET" 或 "POST"

// 设置请求编码(解决POST乱码)
request.setCharacterEncoding("UTF-8");

// 域对象: 在一次请求范围内共享数据
request.setAttribute("user", userObj);   // 存
Object user = request.getAttribute("user"); // 取

// 获取Session对象
HttpSession session = request.getSession();
```

> [!note] HttpServletResponse 常用方法
```Java
// 设置响应头
response.setContentType("text/html;charset=UTF-8");
response.setHeader("Cache-Control", "no-cache");

// 获取输出流
PrintWriter out = response.getWriter();  // 字符流(用于文本)
// ServletOutputStream out = response.getOutputStream(); // 字节流(用于文件下载)

// 重定向
response.sendRedirect("/index.html");
```

### 4.2.3. Servlet的两种配置方式

> [!note] 说明
> **方式一: 注解配置**（Servlet 3.0+，推荐）。直接在类上使用`@WebServlet`注解。
```Java
@WebServlet("/servlet/demo")                // 精确匹配
@WebServlet("*.do")                         // 后缀匹配
@WebServlet(urlPatterns = {"/a", "/b"})    // 多个URL映射
```

> [!note] 说明
> **方式二: web.xml配置**（传统方式）。在`WEB-INF/web.xml`中声明。
```xml
<servlet>
    <servlet-name>DemoServlet</servlet-name>
    <servlet-class>com.example.DemoServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>DemoServlet</servlet-name>
    <url-pattern>/servlet/demo</url-pattern>
</servlet-mapping>
```

## 4.3. 请求转发与重定向
在Servlet处理请求后，经常需要跳转到另一个资源（另一个Servlet或JSP页面），有**转发**和**重定向**两种方式。

> [!note] 转发（Forward）
> **服务器内部行为**，客户端无感知。URL不变，请求对象在跳转前后是同一个。
```Java
request.getRequestDispatcher("/success.jsp").forward(request, response);
```
> - URL不变（仍然显示原始请求地址）
> - 只能跳转到**当前项目内部**资源
> - 前后共享同一个request对象（可以传递数据）
> - 浏览器发出**一次请求**

> [!note] 重定向（Redirect）
> **浏览器行为**，服务器告诉浏览器"你去访问另一个地址"。URL会变成新地址。
```Java
response.sendRedirect("/success.jsp");
```
> - URL变为新地址
> - 可以跳转到**任意URL**（项目内或外部）
> - 前后是**两个不同的request**对象（不能共享request数据）
> - 浏览器发出**两次请求**（302 + 新请求）

> [!tip] 选择建议
> | 场景 | 推荐方式 |
> | :-- | :-- |
> | 需要携带数据到下一个页面 | 转发(Forward) |
> | 避免表单重复提交(PRG模式) | 重定向(Redirect) |
> | 跳转到外部网站 | 重定向(Redirect) |
> | 访问WEB-INF下的受保护资源 | 转发(Forward) |

## 4.4. Cookie 与 Session
HTTP协议本身是**无状态**的，服务器无法区分两个请求是否来自同一用户。Cookie和Session就是为了**保持状态**而生的两种机制。

> [!note] 说明
> **Cookie**：存储在**浏览器端**的小数据片段（大小限制约4KB）。每次请求会自动携带到服务器。常用于记住登录状态、用户偏好等。
> 
> **Session**：存储在**服务器端**的用户会话数据。每个用户有一个唯一的SessionID，通过Cookie传递给浏览器。服务器根据SessionID找到对应用户的数据。

### 4.4.1. Cookie的使用

> [!example] 示例: 服务端创建Cookie
```Java
// 创建Cookie
Cookie cookie = new Cookie("username", "zhangsan");
cookie.setMaxAge(60 * 60 * 24);  // 有效期: 24小时(秒)
cookie.setPath("/");              // Cookie作用的路径
response.addCookie(cookie);       // 写入浏览器
```

> [!example] 示例: 服务端读取Cookie
```Java
Cookie[] cookies = request.getCookies();
if (cookies != null) {
    for (Cookie cookie : cookies) {
        if ("username".equals(cookie.getName())) {
            String value = cookie.getValue();
            System.out.println("用户名: " + value);
        }
    }
}
```

### 4.4.2. Session的使用

> [!note] 说明
> Session的实现原理：浏览器首次访问时，服务器创建Session并生成唯一的**JSESSIONID**，通过Cookie写入浏览器。后续请求携带该Cookie，服务器即可找到对应Session。

> [!example] 示例: Session存取数据
```Java
// 获取Session(没有则创建)
HttpSession session = request.getSession();

// 存入数据
session.setAttribute("user", userObj);

// 取出数据
User user = (User) session.getAttribute("user");

// 设置过期时间(秒)
session.setMaxInactiveInterval(30 * 60);  // 30分钟

// 手动销毁Session(用于退出登录)
session.invalidate();
```

> [!tip] Cookie vs Session 对比
> | 对比维度 | Cookie | Session |
> | :-- | :-- | :-- |
> | 存储位置 | 浏览器端 | 服务器端 |
> | 安全性 | 较低(可被篡改/窃取) | 较高(数据在服务器) |
> | 容量限制 | 约4KB | 无限制(受内存影响) |
> | 性能影响 | 不占服务器资源 | 大量用户时消耗服务器内存 |
> | 典型用途 | 记住用户名、购物车 | 登录用户信息、权限数据 |

## 4.5. JSP（Java Server Pages）
> [!note] 概述
> JSP是一种**在HTML中嵌入Java代码**的技术，本质上是Servlet的一种"简写形式"。JSP文件在首次访问时会被Tomcat编译成Servlet然后执行。它解决了在Servlet中用`out.write()`拼接大段HTML的痛点。

### 4.5.1. JSP三大指令

> [!note] page指令 — 页面配置
```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List, com.example.User" %>
<%@ page isELIgnored="false" %>
```

> [!note] include指令 — 静态包含（合并后再编译）
```jsp
<%@ include file="/common/header.jsp" %>
```

> [!note] taglib指令 — 引入标签库
```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```

### 4.5.2. JSP九大内置对象

> [!note] 说明
> JSP中可以直接使用以下9个对象，无需声明：

| 对象名 | 类型 | 说明 |
| :-- | :-- | :-- |
| `request` | HttpServletRequest | 请求对象 |
| `response` | HttpServletResponse | 响应对象 |
| `session` | HttpSession | 会话对象 |
| `application` | ServletContext | 全局上下文（整个应用共享） |
| `out` | JspWriter | 输出流 |
| `page` | Object | 当前页面的this引用 |
| `pageContext` | PageContext | 页面上下文（可获取其他8个对象） |
| `config` | ServletConfig | Servlet配置对象 |
| `exception` | Throwable | 异常对象（仅错误页面可用） |

### 4.5.3. EL表达式 与 JSTL
> [!warning] 重要
> JSP中应**避免直接写Java代码**（Scriptlet），改用**EL表达式**和**JSTL标签库**来保持页面整洁，实现视图与逻辑分离。

> [!note] EL表达式（Expression Language）
> 用于替代`<%= %>`，简化取值操作：
```jsp
<!-- 传统写法 -->
<%=((User)request.getAttribute("user")).getName()%>

<!-- EL表达式写法 -->
${user.name}
```

> [!note] JSTL常用标签
```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- 条件判断 -->
<c:if test="${user.vip}">
    <span>VIP会员</span>
</c:if>

<!-- 多条件 -->
<c:choose>
    <c:when test="${score >= 90}">优秀</c:when>
    <c:when test="${score >= 60}">及格</c:when>
    <c:otherwise>不及格</c:otherwise>
</c:choose>

<!-- 循环遍历 -->
<c:forEach items="${userList}" var="user">
    <tr><td>${user.name}</td><td>${user.age}</td></tr>
</c:forEach>
```

## 4.6. Filter（过滤器）
> [!note] 概述
> Filter是拦截**请求和响应**的组件。它在请求到达Servlet**之前**和响应返回客户端**之前**执行，形成一条"过滤链"。典型用途：**字符编码设置**、**登录验证**、**权限检查**、**敏感词过滤**。

> [!example] 示例: 编码过滤器
```Java
@WebFilter("/*")  // 拦截所有请求
public class EncodingFilter implements Filter {

    public void init(FilterConfig config) throws ServletException {
        System.out.println("EncodingFilter 初始化");
    }

    public void doFilter(ServletRequest req, ServletResponse resp, 
            FilterChain chain) throws IOException, ServletException {
        // 预处理: 设置请求和响应的编码
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=UTF-8");
        // 放行: 让请求继续走下一个Filter或Servlet
        chain.doFilter(req, resp);
    }

    public void destroy() {
        System.out.println("EncodingFilter 销毁");
    }
}
```

> [!example] 示例: 登录验证过滤器
```Java
@WebFilter("/admin/*")  // 只拦截管理后台
public class LoginFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse resp, 
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        // 获取Session中的登录信息
        Object user = request.getSession().getAttribute("user");
        if (user != null) {
            chain.doFilter(req, resp);  // 已登录, 放行
        } else {
            response.sendRedirect("/login.html");  // 未登录, 跳转登录页
        }
    }
}
```

> [!tip] Filter执行顺序
> 多个Filter按照**类名字母序**依次执行。请求方向是 `Filter1 → Filter2 → Servlet`，响应方向是 `Servlet → Filter2 → Filter1`。

## 4.7. Listener（监听器）
> [!note] 概述
> Listener用于监听Web应用中的**事件**，当特定事件发生时自动触发回调。常用监听器有三类：**ServletContext监听**、**Session监听**、**Request监听**。

> [!example] 示例: 统计在线人数
```Java
@WebListener
public class OnlineCountListener implements HttpSessionListener {

    private int onlineCount = 0;

    // Session创建时触发（用户上线）
    public void sessionCreated(HttpSessionEvent se) {
        onlineCount++;
        se.getSession().getServletContext()
            .setAttribute("onlineCount", onlineCount);
    }

    // Session销毁时触发（用户下线/超时/主动退出）
    public void sessionDestroyed(HttpSessionEvent se) {
        onlineCount--;
        se.getSession().getServletContext()
            .setAttribute("onlineCount", onlineCount);
    }
}
```

> [!tip] 总结
> Web核心原理是JavaWeb的"灵魂"所在。掌握HTTP协议、Servlet的生命周期、Cookie/Session的状态管理、Filter的拦截机制，就掌握了构建Web应用的核心能力。JSP在实际开发中逐渐被前后端分离架构取代，但理解其原理有助于阅读和维护老项目。

---

# 5. 数据库集成
> [!note] 相关内容
> [[MySQL知识点梳理|MySQL]]
> 
> JavaWeb通过**JDBC**（Java Database Connectivity）与数据库交互。JDBC是Java提供的标准API，定义了连接数据库、执行SQL、处理结果的统一接口，各数据库厂商提供对应的驱动实现。

## 5.1. JDBC核心步骤

> [!note] 说明
> 使用JDBC操作数据库的标准流程：**加载驱动 → 获取连接 → 执行SQL → 处理结果 → 释放资源**。

> [!example] 示例: JDBC查询数据库
```Java
import java.sql.*;

public class JdbcDemo {
    public static void main(String[] args) {
        // JDBC四大配置参数
        String url = "jdbc:mysql://localhost:3306/db_name?useSSL=false&serverTimezone=Asia/Shanghai";
        String username = "root";
        String password = "123456";
        
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            // 1. 加载驱动(MySQL 8.0+会自动注册, 此行可省略)
            Class.forName("com.mysql.cj.jdbc.Driver");
            // 2. 获取数据库连接
            conn = DriverManager.getConnection(url, username, password);
            // 3. 准备SQL(使用PreparedStatement防止SQL注入)
            String sql = "SELECT id, name, age FROM users WHERE age > ?";
            ps = conn.prepareStatement(sql);
            ps.setInt(1, 18);  // 设置?占位符的值
            // 4. 执行查询
            rs = ps.executeQuery();
            // 5. 处理结果集
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                int age = rs.getInt("age");
                System.out.println(id + " - " + name + " - " + age);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 6. 释放资源(按创建顺序的逆序)
            try { if (rs != null) rs.close(); } catch (SQLException e) { }
            try { if (ps != null) ps.close(); } catch (SQLException e) { }
            try { if (conn != null) conn.close(); } catch (SQLException e) { }
        }
    }
}
```

## 5.2. PreparedStatement vs Statement

> [!warning] 重要
> **永远使用PreparedStatement，避免使用Statement**，原因有二：
> 1. **防SQL注入**：PreparedStatement对参数进行预编译和转义，黑客无法通过恶意输入修改SQL逻辑
> 2. **性能更优**：SQL模板预编译后可重复使用，批量操作时效率更高

> [!example] SQL注入演示
```Java
// 危险写法(Statement): 用户输入 " ' OR '1'='1 " 会绕过密码验证
String sql = "SELECT * FROM users WHERE name='" + name + "' AND pwd='" + pwd + "'";

// 安全写法(PreparedStatement): 参数自动转义,杜绝注入
String sql = "SELECT * FROM users WHERE name=? AND pwd=?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, name);
ps.setString(2, pwd);
```

## 5.3. 数据库连接池
> [!note] 概述
> 每次请求都创建和销毁数据库连接开销巨大。**连接池**预先创建一批连接放入"池"中，需要时取出，用完归还，大幅提升性能。常用实现：**Druid**（阿里）、**HikariCP**（Spring Boot默认）。

> [!tip] 总结
> JDBC是JavaWeb与数据库交互的基础。掌握PreparedStatement杜绝SQL注入、使用连接池优化性能，是实际开发中的基本要求。后续学习MyBatis、JPA等ORM框架时，它们底层仍基于JDBC。
