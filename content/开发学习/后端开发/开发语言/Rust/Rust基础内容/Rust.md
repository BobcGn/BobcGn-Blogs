# Rust 从入门到精通：写给跨平台架构开发者的全景指南

> [!note] 目标读者
> 本文面向具备扎实 Kotlin/KMP 和移动端开发经验的架构开发者。我们跳过琐碎的环境搭建，直击 Rust 的核心设计理念与工程哲学，目标是为你建立对 Rust 的**系统性认知地图**，使其成为你技术栈中——特别是高性能底层逻辑与跨平台 C-FFI 侧——的关键拼图。

---

## 一、核心范式与心智模型的重塑

### 1.1 为什么 Kotlin 开发者需要重新"学习"内存

作为 Kotlin/JVM 开发者，我们习惯了这样的心智模型：

```kotlin
// Kotlin: GC 是你的隐形管家
class DataProcessor {
    fun process(): List<String> {
        val results = mutableListOf<String>()  // 堆上分配，GC 跟踪
        repeat(1000) {
            results.add(transform(it.toString()))
        }
        return results  // 离开作用域后，GC 会在某个不确定的时刻回收它
    }
}
```

这段代码的**心智负担极低**——你不需要关心谁拥有 `results`，不需要关心它的生命周期，不需要担心悬垂引用。GC（垃圾回收器）为你屏蔽了这一切。

但这也带来了三个架构层面的代价：

| 维度 | GC 的隐性成本 | 影响场景 |
|------|--------------|---------|
| **延迟抖动** | STW (Stop-The-World) 暂停不可预测 | 实时音频处理、端侧推理 |
| **内存开销** | GC 需要额外元数据 + 通常 2-5x 内存膨胀 | 内存受限的移动端/嵌入式 |
| **确定性** | 无法保证资源何时释放 | 文件锁、数据库连接池、FFI 句柄 |

Rust 的回答是：**把 GC 的职责交给编译器，在编译期完成所有内存安全检查，运行时零开销。** 这不是优化，而是一种根本不同的计算哲学。

---

### 1.2 所有权 (Ownership)：每个值有且仅有一个"主人"

> [!important] 核心规则
> Rust 中每一个值都有且仅有**一个**所有者 (Owner)。当所有者离开作用域时，该值被自动销毁（调用 `drop`）。

```rust
fn main() {
    let s1 = String::from("hello"); // s1 是 "hello" 的所有者
    let s2 = s1;                     // 所有权**转移** (Move) 给 s2
    // println!("{}", s1);           // ❌ 编译错误！s1 已经失效
    println!("{}", s2);              // ✅ s2 是新的所有者
}   // s2 离开作用域，"hello" 被自动释放
```

**对比 Kotlin 的心智模型：**

```kotlin
// Kotlin: 赋值 = 引用复制，两个变量指向同一对象
val s1 = "hello"
val s2 = s1           // s1 和 s2 同时有效，共享同一对象
println(s1)           // ✅ 完全没问题
println(s2)           // ✅ 也没问题
// GC 跟踪引用计数，在两者都不可达时回收
```

这里的关键差异在于**语义层面**：
- Kotlin 的 `val s2 = s1` 是**浅拷贝引用**——两个名字指向同一份堆数据
- Rust 的 `let s2 = s1` 是**所有权转移**——从此刻起，`s1` 在概念上不再存在

> [!tip] 为什么这样设计？
> 这意味着 Rust **在编译期就知道**：
> 1. 每块内存在哪里被释放（所有者离开作用域处）
> 2. 任何时刻有且仅有一个人负责释放（唯一所有者）
> 3. 因此永远不会出现 Double-Free 或 Use-After-Free

#### 所有权转移的实际场景

```rust
fn take_ownership(s: String) {  // s 进入函数时获取所有权
    println!("got: {}", s);
}   // s 在此被释放

fn main() {
    let name = String::from("Rust");
    take_ownership(name);         // name 的所有权转移给函数参数
    // println!("{}", name);      // ❌ name 已失效
}
```

这在 Kotlin 中是不可想象的——你不会因为把一个变量传给函数就"失去"它。但在系统编程中，这种**显式的所有权语义**恰恰是保证安全的基石。

#### 当你确实需要复制时：`Clone`

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();          // 显式深拷贝，两个独立实例
    println!("s1 = {}, s2 = {}", s1, s2); // ✅ 都有效
}
```

> [!note] 设计哲学
> Rust 把"复制"从**默认行为**变成了**显式选择**。这迫使开发者思考：我真的需要拷贝这份数据吗？这个设计决策在高频路径上是巨大的性能优势。

---

### 1.3 借用 (B Borrowing)：不转移所有权的访问

如果所有函数调用都需要转移所有权，代码会变得极其笨拙。Rust 引入了**借用**机制——你可以"借"一个值来用，而不需要拿走它。

```rust
fn calculate_length(s: &String) -> usize {  // &String = 不可变借用
    s.len()
}   // s 只是借用，离开作用域不会释放原始数据

fn main() {
    let name = String::from("Rust");
    let len = calculate_length(&name);  // 传入借用引用
    println!("'{}' 的长度是 {}", name, len); // ✅ name 仍然有效
}
```

**与 Kotlin 对比：**

```kotlin
// Kotlin 中参数传递天然是"借用"语义
fun calculateLength(s: String): Int {  // s 是引用的浅拷贝
    return s.length
}
val name = "Rust"
val len = calculateLength(name)  // name 当然还有效
println("'$name' 的长度是 $len")
```

Kotlin 开发者会觉得这理所当然——但在 Rust 中，这是一条**编译器强制执行的严格规则**：

> [!danger] 借用规则（编译期强制）
> 1. 在任意给定时刻，你**要么**拥有：
>    - 任意数量的**不可变引用** (`&T`)
>    - **或者**有且仅有一个**可变引用** (`&mut T`)
> 2. 引用必须始终有效（不能有悬垂引用）

```rust
fn main() {
    let mut data = vec![1, 2, 3];

    let r1 = &data;       // ✅ 不可变借用
    let r2 = &data;       // ✅ 多个不可变借用共存
    println!("{:?} {:?}", r1, r2);

    let r3 = &mut data;   // ✅ r1, r2 已经不再使用，可变借用合法
    r3.push(4);
    println!("{:?}", r3);
}
```

**对比 Kotlin 的并发陷阱：**

```kotlin
// Kotlin: 编译器不会阻止你这么做
val list = mutableListOf(1, 2, 3)
val iterator = list.iterator()
list.add(4)              // ⚠️ 运行时可能抛 ConcurrentModificationException
iterator.forEach { print(it) }
```

```rust
// Rust: 编译期直接拒绝
fn main() {
    let mut data = vec![1, 2, 3];
    let iter = data.iter();   // 不可变借用
    data.push(4);              // ❌ 编译错误！不能在不可变借用存在时修改
    for x in iter {
        print!("{}", x);
    }
}
```

Rust 把 Kotlin 中的**运行时异常**变成了**编译期错误**——这是从"出了问题才知道"到"不可能出问题"的质变。

---

### 1.4 生命周期 (Lifetimes)：编译器的时间推理

生命周期是 Rust 最令 Kotlin 开发者困惑、也最具威力的概念。它的本质是：**编译器需要知道每个引用的有效作用域**。

```rust
// ❌ 编译错误：编译器无法推断返回值的生命周期
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}

// ✅ 显式生命周期标注
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

**这段代码告诉编译器什么？**

`'a` 是一个**生命周期参数**，它说的是：返回值的引用，其有效期不会超过 `x` 和 `y` 中**较短**的那个。这确保返回值永远指向有效数据。

**Kotlin 中为什么不需要这个？**

```kotlin
fun longest(x: String, y: String): String {  // 返回的是新对象，不是引用
    return if (x.length > y.length) x else y
}
```

Kotlin 的 `String` 是引用类型，由 GC 保证不悬垂。函数返回的引用指向堆上的对象，GC 会跟踪它的可达性。但 Rust 没有 GC，所以编译器必须在编译期**推理出引用的时间边界**。

> [!summary] 三驾马车的协作关系
>
> | 机制 | 解决的问题 | 类比 |
> |------|-----------|------|
> | **所有权** | 谁负责释放？ | 每份资产有且仅有一个法定所有人 |
> | **借用** | 如何临时访问？ | 借用期间不能销毁资产，且读写互斥 |
> | **生命周期** | 借用的有效期？ | 借用合同不能超过资产存续期 |
>
> 三者共同构成了一个**编译期内存安全证明系统**——如果代码编译通过，内存安全就有了数学保证。

---

### 1.5 零成本抽象：编译期"消灭"运行时开销

Rust 的核心承诺之一是**零成本抽象 (Zero-Cost Abstractions)**：你使用的高级抽象在编译后与手写的底层代码产生**完全相同**的机器码。

```rust
// 高级抽象写法
let sum: i64 = (1..=1000000)
    .filter(|x| x % 2 == 0)
    .map(|x| x * x)
    .sum();

// 与手写循环产生的汇编几乎完全一致
let mut sum: i64 = 0;
for x in 1..=1000000 {
    if x % 2 == 0 {
        sum += x * x;
    }
}
```

**对比 Kotlin/JVM：**

```kotlin
// Kotlin: 高级写法，但有 Lambda 分配 + 虚调用开销
val sum = (1..1_000_000L)
    .filter { it % 2 == 0L }
    .map { it * it }
    .sum()
// 编译后：创建多个 Iterator、Lambda 对象、Intermediate List
// 运行时有堆分配和 GC 压力
```

| 维度 | Kotlin/JVM | Rust |
|------|-----------|------|
| Lambda | 堆上分配匿名类实例 | 编译为内联函数指针，零分配 |
| 集合迭代器 | 接口 + 虚调用 | 编译期单态化，直接内联 |
| 泛型 | 类型擦除 + 装箱 | 单态化 (Monomorphization)，每种类型生成专用代码 |
| 运行时 | JVM + GC | 直接生成原生机器码 |

> [!tip] 对架构决策的影响
> 这意味着在 Rust 中，你可以**放心大胆地使用高级抽象**而不用担心性能。Iterator chain、泛型、Trait 对象——它们不会让你的热路径变慢。这从根本上改变了"抽象 vs 性能"的传统权衡。

---

## 二、架构视角的 Rust 设计哲学

### 2.1 Trait 系统 vs Kotlin Interface/Sealed Class

#### Trait 基础：比 Interface 更强大的契约

```kotlin
// Kotlin Interface
interface Renderer {
    fun render(content: String): String
    fun supports(format: String): Boolean = true  // 默认实现
}
```

```rust
// Rust Trait —— 与 Interface 概念相似但更强大
trait Renderer {
    fn render(&self, content: &str) -> String;
    fn supports(&self, format: &str) -> bool { true }  // 默认实现
}
```

表面看起来类似，但 Trait 系统在架构层面提供了**显著更强的组合能力**：

#### (1) Trait Bound：编译期的架构约束

```rust
// 定义架构层次的约束
trait Serializable: Send + Sync + 'static {
    fn serialize(&self) -> Vec<u8>;
}

// 任何实现 Serializable 的类型，自动保证：
// - Send: 可以安全地跨线程转移
// - Sync: 可以安全地跨线程共享引用
// - 'static: 没有借用的生命周期约束
```

```kotlin
// Kotlin 中需要分别声明接口，且无法在类型系统层面强制组合
interface Serializable
interface Sendable    // Kotlin 没有原生的 Send/Sync 语义
interface Shareable
class MyData : Serializable, Sendable, Shareable  // 手动组合，无法自动推导
```

#### (2) Trait 对象 vs 泛型：两种多态策略

```rust
// 策略一：静态分发（泛型 + Trait Bound）—— 零成本
fn process<T: Renderer>(renderer: &T, data: &str) -> String {
    renderer.render(data)
}
// 编译时为每个具体类型生成专用代码，类似 C++ 模板

// 策略二：动态分发（Trait Object）—— 运行时虚表
fn process_dynamic(renderer: &dyn Renderer, data: &str) -> String {
    renderer.render(data)
}
// 类似 Kotlin 的接口虚调用，通过 vtable 间接寻址
```

**架构决策指导：**

| 场景 | 推荐策略 | 原因 |
|------|---------|------|
| 性能关键路径 | 泛型 (静态分发) | 零间接调用开销，可内联 |
| 异构集合 | Trait Object (动态分发) | 需要运行时多态 |
| 插件系统 | Trait Object | 类型在编译期未知 |
| 库的公开 API | 泛型 + `impl Trait` | 最大灵活性 + 零成本 |

#### (3) Sealed Class 的 Rust 对等物：Enum + Trait

```kotlin
// Kotlin Sealed Class —— 有限的类型集合
sealed class NetworkResult {
    data class Success(val data: String) : NetworkResult()
    data class Error(val code: Int, val message: String) : NetworkResult()
    object Loading : NetworkResult()
}

fun handle(result: NetworkResult) = when (result) {
    is NetworkResult.Success -> showData(result.data)
    is NetworkResult.Error -> showError(result.message)
    is NetworkResult.Loading -> showSpinner()
    // 编译器强制覆盖所有分支
}
```

```rust
// Rust Enum —— 比 Sealed Class 更强大（带数据的枚举）
enum NetworkResult {
    Success(String),
    Error { code: i32, message: String },
    Loading,
}

fn handle(result: &NetworkResult) {
    match result {
        NetworkResult::Success(data) => show_data(data),
        NetworkResult::Error { code, message } => show_error(message),
        NetworkResult::Loading => show_spinner(),
        // 编译器强制覆盖所有变体 —— 与 Sealed Class 的 when 相同
    }
}
```

> [!compare] 关键区别
> Kotlin 的 Sealed Class 中，每个子类是**独立的类**，有自己的继承层级和实例。Rust 的 Enum 变体是**同一类型的不同值**，内存布局更紧凑（Tagged Union），且模式匹配直接解构数据——无需 `is` 类型检查 + 强制转型。

---

### 2.2 枚举 (Enum) 与模式匹配：Rust 最被低估的架构武器

Rust 的 Enum 不是 C/Java 那种简单的枚举常量，而是一个**代数数据类型 (Algebraic Data Type, ADT)**——每个变体可以携带不同类型和数量的数据。

```rust
// 构建一个灵活的 AST 节点系统
enum Expr {
    Num(f64),
    Add(Box<Expr>, Box<Expr>),     // Box = 堆分配的智能指针
    Mul(Box<Expr>, Box<Expr>),
    Var(String),
    Let { name: String, value: Box<Expr>, body: Box<Expr> },
}

fn eval(expr: &Expr, env: &HashMap<String, f64>) -> f64 {
    match expr {
        Expr::Num(n) => *n,
        Expr::Add(a, b) => eval(a, env) + eval(b, env),
        Expr::Mul(a, b) => eval(a, env) * eval(b, env),
        Expr::Var(name) => env[name],
        Expr::Let { name, value, body } => {
            let mut new_env = env.clone();
            new_env.insert(name.clone(), eval(value, env));
            eval(body, &new_env)
        }
    }
}
```

**对比 Kotlin 实现：**

```kotlin
sealed interface Expr {
    data class Num(val value: Double) : Expr
    data class Add(val left: Expr, val right: Expr) : Expr
    data class Mul(val left: Expr, val right: Expr) : Expr
    data class Var(val name: String) : Expr
    data class Let(val name: String, val value: Expr, val body: Expr) : Expr
}

fun eval(expr: Expr, env: Map<String, Double>): Double = when (expr) {
    is Expr.Num -> expr.value
    is Expr.Add -> eval(expr.left, env) + eval(expr.right, env)
    is Expr.Mul -> eval(expr.left, env) * eval(expr.right, env)
    is Expr.Var -> env[expr.name]!!
    is Expr.Let -> {
        val newEnv = env + (expr.name to eval(expr.value, env))
        eval(expr.body, newEnv)
    }
}
```

Kotlin 的 Sealed Interface 在表达力上已经很接近了，但 Rust 的 `match` 有几个架构优势：

```rust
// 1. 嵌套解构 —— 一层表达式拆解复杂结构
match point {
    Point { x: 0, y: 0 } => println!("原点"),
    Point { x, y: 0 } => println!("在 x 轴上: {}", x),
    Point { x: 0, y } => println!("在 y 轴上: {}", y),
    Point { x, y } => println!("({}, {})", x, y),
}

// 2. 守卫条件 —— match + if 组合
match value {
    x if x > 100 => println!("大值: {}", x),
    x if x > 0 => println!("正数: {}", x),
    0 => println!("零"),
    x => println!("负数: {}", x),
}

// 3. @ 绑定 —— 匹配的同时绑定值
match age {
    n @ 0..=17 => println!("未成年: {}", n),
    n @ 18..=65 => println!("成年人: {}", n),
    n => println!("长者: {}", n),
}
```

---

### 2.3 错误处理哲学：`Result<T, E>` 与 `Option<T>`

这是 Rust 与 Kotlin 在**工程可靠性**上差异最大的领域。

#### `Option<T>` 对比 Kotlin 的 Nullable

```kotlin
// Kotlin: nullable 类型
fun findUser(id: Int): User? {
    return if (id > 0) User(id) else null
}

val user = findUser(1)
println(user?.name)           // 安全调用
println(user?.name ?: "匿名")  // Elvis 操作符
println(user!!.name)          // 强制解包 —— ⚠️ 运行时 NPE 风险
```

```rust
// Rust: Option<T> —— 类型系统的一部分，没有 null
fn find_user(id: i32) -> Option<User> {
    if id > 0 { Some(User::new(id)) } else { None }
}

let user = find_user(1);
println!("{}", user.map(|u| u.name).unwrap_or("匿名".to_string())); // 安全解包
// println!("{}", user.name);  // ❌ 编译错误！Option<User> 没有 name 字段
// user.unwrap()               // ⚠️ 与 Kotlin 的 !! 等价，应尽量避免
```

#### `Result<T, E>` 对比 Kotlin 的 Exception

这是更深层的架构差异。Kotlin 继承了 JVM 的异常体系：

```kotlin
// Kotlin: 异常可以被忽略，编译器不会强制你处理
fun parseConfig(path: String): Config {
    val content = File(path).readText()   // 可能抛 IOException —— 但不强制 catch
    return Json.decodeFromString(content) // 可能抛 SerializationException
}

// 完全合法的代码 —— 异常可以"穿透"整个调用栈
fun dangerous() {
    val config = parseConfig("config.json") // 如果失败，异常向上传播
    // 如果调用者也不处理，再向上……直到 crash
}
```

```rust
// Rust: 错误是返回值的一部分，类型系统强制你面对它
fn parse_config(path: &str) -> Result<Config, Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string(path)?;  // ? = 出错则提前返回 Err
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
}

// 你必须在某个层级处理错误
fn main() {
    match parse_config("config.json") {
        Ok(config) => println!("配置加载成功: {:?}", config),
        Err(e) => eprintln!("配置加载失败: {}", e),
    }
}
```

> [!important] `?` 操作符：Rust 的错误传播语法糖
> `?` 是 Rust 中最重要的语法糖之一。它等价于：
> ```rust
> let content = match std::fs::read_to_string(path) {
>     Ok(c) => c,
>     Err(e) => return Err(e.into()),  // 自动类型转换
> };
> ```
> 它让错误传播代码像异常一样简洁，但在类型系统层面是**完全显式**的。

#### 构建分层的错误体系

```rust
// 使用 thiserror 库定义领域错误
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("配置文件未找到: {path}")]
    ConfigNotFound { path: String },

    #[error("配置解析失败: {0}")]
    ParseError(#[from] serde_json::Error),

    #[error("数据库连接失败: {0}")]
    DatabaseError(#[from] sqlx::Error),

    #[error("网络请求超时")]
    NetworkTimeout,
}

// 控制器层统一处理
fn handle_request(req: Request) -> Response {
    match process_request(req) {
        Ok(resp) => resp,
        Err(AppError::ConfigNotFound { .. }) => Response::not_found(),
        Err(AppError::ParseError(_)) => Response::bad_request(),
        Err(AppError::DatabaseError(_)) => Response::server_error(),
        Err(AppError::NetworkTimeout) => Response::gateway_timeout(),
    }
}
```

```kotlin
// Kotlin 等价物 —— 更冗长，且无法在编译期强制覆盖
sealed class AppError : Exception() {
    data class ConfigNotFound(val path: String) : AppError()
    data class ParseError(override val cause: Throwable) : AppError()
    data class DatabaseError(override val cause: Throwable) : AppError()
    object NetworkTimeout : AppError()
}

fun handleRequest(req: Request): Response = try {
    processRequest(req)
} catch (e: AppError.ConfigNotFound) { Response.notFound()
} catch (e: AppError.ParseError) { Response.badRequest()
} catch (e: AppError.DatabaseError) { Response.serverError()
} catch (e: AppError.NetworkTimeout) { Response.gatewayTimeout()
}
// 问题: catch 按声明顺序匹配，且编译器不强制覆盖所有子类
```

> [!summary] 错误处理的工程价值
>
> | 特性 | Kotlin Exception | Rust Result |
> |------|-----------------|-------------|
> | 编译器强制处理 | ❌ Checked 除外 | ✅ 所有错误 |
> | 错误可见性 | 依赖文档/KDoc | 类型签名直接暴露 |
> | 传播语法 | `throw`/`try-catch` | `?` 操作符 |
> | 组合性 | 弱（异常不可组合） | 强（`map`/`and_then`/`unwrap_or`） |
> | 性能 | 栈展开开销 | 零开销（与 `Option` 同构） |

---

### 2.4 Rust 宏：元编程的利器

Rust 宏在编译期执行，将代码**转换为代码**。它分为两大类：

#### 声明式宏 (`macro_rules!`) —— 模式替换

```rust
// 创建一个 HashMap 的惯用宏
let scores = hashmap! {
    "Alice" => 95,
    "Bob" => 87,
    "Charlie" => 92,
};

// 定义：模式匹配 + 代码生成
macro_rules! hashmap {
    ($($key:expr => $value:expr),* $(,)?) => {{
        let mut map = std::collections::HashMap::new();
        $(map.insert($key, $value);)*
        map
    }};
}
```

#### 过程宏 (Procedural Macros) —— 代码生成

```rust
// 使用 serde 的 derive 宏 —— 零样板代码实现序列化
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub name: String,
    pub port: u16,
    pub database: DatabaseConfig,
    #[serde(default = "default_timeout")]
    pub timeout_ms: u64,
}

// 编译时自动生成 Serialize/Deserialize 的完整实现
// 等价于手写几百行样板代码
```

**对比 Kotlin 的方案：**

```kotlin
// Kotlin: 注解处理器 (KSP) 或编译器插件
@Serializable
data class Config(
    val name: String,
    val port: Int,
    val database: DatabaseConfig,
    @SerialName("timeout_ms")
    val timeoutMs: Long = 30_000,
)
```

Kotlin 的 `@Serializable` 背后是 KSP（Kotlin Symbol Processing）在编译期生成代码，概念上与 Rust 的 derive 宏类似。但 Rust 宏有几个独特优势：

```rust
// 构建 DSL 的例子：SQLx 编译期查询校验
let users = sqlx::query_as!(
    User,
    "SELECT id, name, email FROM users WHERE active = $1",
    true
)
// 编译期：
// 1. 连接数据库校验 SQL 语法
// 2. 检查返回列是否匹配 User 结构体
// 3. 如果不匹配，编译错误！
```

这种**编译期与外部系统交互**的能力，在 Kotlin 生态中没有对等物。

---

## 三、跨平台生态与端侧 AI 的工程结合点

### 3.1 FFI 与跨平台桥接：Rust 作为底层核心

在 KMP (Kotlin Multiplatform) 生态中，Rust 的定位是**通过 C-FFI 提供高性能核心逻辑**，被 Kotlin/Native 或 Android NDK 调用。

#### 基础：Rust 导出 C ABI

```rust
// src/lib.rs
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

/// 对外暴露的 C 兼容函数
#[no_mangle]
pub extern "C" fn process_text(input: *const c_char) -> *mut c_char {
    // 1. 从 C 字符串转换为 Rust 字符串
    let c_str = unsafe { CStr::from_ptr(input) };
    let text = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null_mut(),
    };

    // 2. 执行 Rust 侧的复杂处理逻辑
    let result = perform_heavy_computation(text);

    // 3. 将结果转回 C 字符串
    match CString::new(result) {
        Ok(c_string) => c_string.into_raw(),  // 转移所有权给调用方
        Err(_) => std::ptr::null_mut(),
    }
}

/// 调用方负责释放 Rust 分配的内存
#[no_mangle]
pub extern "C" fn free_string(ptr: *mut c_char) {
    if !ptr.is_null() {
        unsafe { let _ = CString::from_raw(ptr); }  // 重新接管所有权 → 自动 drop
    }
}
```

#### 构建 Android 共享库

```toml
# Cargo.toml
[lib]
name = "core_engine"
crate-type = ["cdylib", "staticlib"]  # cdylib = .so, staticlib = .a

[profile.release]
lto = true          # 链接时优化
opt-level = "z"     # 优化体积
strip = true        # 去除调试符号
```

```bash
# 交叉编译到 Android 目标
rustup target add aarch64-linux-android armv7-linux-androideabi

cargo build --release --target aarch64-linux-android
# 产物: target/aarch64-linux-android/release/libcore_engine.so
```

#### Kotlin/Native 侧调用

```kotlin
// Kotlin/Native (Android NDK 或 KMP)
// 声明 C 函数映射
@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")

import kotlinx.cinterop.*

// cinterop 定义（.def 文件）
// --- core_engine.def ---
// headerIndex = core_engine.h
// linkerOpts = -L. -lcore_engine

// 使用
fun processTextNative(input: String): String {
    return memScoped {
        val cInput = input.cstr.ptr
        val resultPtr = core_engine.process_text(cInput)
        try {
            resultPtr?.toKString() ?: throw IllegalStateException("处理失败")
        } finally {
            core_engine.free_string(resultPtr)  // 必须释放 Rust 分配的内存
        }
    }
}
```

#### 使用 UniFFI 简化 FFI 开发

Mozilla 开发的 **UniFFI** 可以从 Rust 接口定义自动生成多语言绑定：

```rust
// src/lib.udl (UniFFI 定义文件)
namespace core_engine {
    u64 tokenize(sequence<u8> text);
    record TokenResult {
        sequence<string> tokens;
        u64 elapsed_us;
    };
};

// Rust 实现
pub fn tokenize(text: Vec<u8>) -> TokenResult {
    let start = std::time::Instant::now();
    let tokens = do_tokenize(&text);
    TokenResult {
        tokens,
        elapsed_us: start.elapsed().as_micros() as u64,
    }
}
```

```bash
# 自动生成 Kotlin/Android + iOS Swift 绑定
uniffi-bindgen generate src/lib.udl --language kotlin
uniffi-bindgen generate src/lib.udl --language swift
```

> [!tip] UniFFI 的架构价值
> 它让你只需要维护一份 Rust 接口定义，就能自动生成类型安全的 Kotlin 和 Swift 绑定代码。在 KMP 项目中，这意味着：
> - **一处定义，三端使用** (Android/iOS/Desktop)
> - 类型安全，不会出现 C-FFI 的指针类型错误
> - 自动处理内存所有权的跨语言转移

#### 跨平台架构总览

```
┌──────────────────────────────────────────────────────┐
│                    应用层 (KMP)                        │
│   Android App  │  iOS App  │  Desktop App             │
├────────────────┼───────────┼──────────────────────────┤
│          共享 Kotlin 业务逻辑 (KMP)                    │
│              expect/actual 模式                        │
├──────────────────────────────────────────────────────┤
│           C-FFI 绑定层 (UniFFI / JNI)                 │
├──────────────────────────────────────────────────────┤
│              Rust 核心引擎 (cdylib)                    │
│   ┌──────────┐  ┌──────────┐  ┌─────────────────┐    │
│   │ 文本处理  │  │ 数据加密  │  │ 本地模型推理     │    │
│   └──────────┘  └──────────┘  └─────────────────┘    │
├──────────────────────────────────────────────────────┤
│                  操作系统 / 硬件                        │
└──────────────────────────────────────────────────────┘
```

---

### 3.2 端侧高性能场景：Rust × AI 推理

在开发端侧离线私人助手或 AI 引擎时，Rust 的优势是多维度的：

#### 为什么是 Rust 而不是 Kotlin/Native？

| 维度 | Kotlin/Native | Rust |
|------|--------------|------|
| **内存控制** | 有 GC（虽比 JVM 轻量） | 完全手动控制，零 GC 抖动 |
| **SIMD/向量化** | 有限支持 | 原生 SIMD intrinsics + auto-vectorization |
| **内存布局** | 对象头 + 引用指针 | `#[repr(C)]` 精确控制每个字节 |
| **无栈协程** | 有（Kotlin Coroutine） | 有（async/await）+ 零分配 Future |
| **推理框架绑定** | 通过 JNI 间接调用 | 直接绑定 C/C++ (llama.cpp, ONNX, candle) |
| **二进制体积** | ~10MB+ (运行时) | ~1-5MB (无运行时) |

#### Rust 直接绑定推理引擎

```rust
// 使用 candle (Hugging Face 的 Rust ML 框架) 运行本地模型
use candle_core::{Device, Tensor};
use candle_transformers::models::llama::{Llama, Config as LlamaConfig};

pub struct LocalLlm {
    model: Llama,
    tokenizer: Tokenizer,
    device: Device,
}

impl LocalLlm {
    pub fn new(model_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let device = Device::Cpu; // 或 Device::Cuda(0) 如果有 GPU
        let config = LlamaConfig::from_file(format!("{}/config.json", model_path))?;
        let weights = load_safetensors(model_path)?;
        let model = Llama::load(&weights, &config)?;
        let tokenizer = Tokenizer::from_file(format!("{}/tokenizer.json", model_path))?;

        Ok(Self { model, tokenizer, device })
    }

    pub fn generate(&mut self, prompt: &str, max_tokens: usize) -> Result<String, Error> {
        let tokens = self.tokenizer.encode(prompt, false)?;
        let input = Tensor::new(tokens.get_ids(), &self.device)?;

        let mut output = String::new();
        let mut current = input;

        for _ in 0..max_tokens {
            let logits = self.model.forward(&current, 0)?;
            let next_token = sample_top_p(&logits, 0.9)?;
            if next_token == EOS_TOKEN { break; }

            output.push_str(&self.tokenizer.decode(&[next_token], false)?);
            current = Tensor::new(&[next_token], &self.device)?;
        }

        Ok(output)
    }
}
```

#### 通过 FFI 暴露给 Kotlin

```rust
// 对外暴露简化的 C 接口
#[no_mangle]
pub extern "C" fn llm_create(model_path: *const c_char) -> *mut LocalLlm {
    let path = unsafe { CStr::from_ptr(model_path) }.to_str().unwrap();
    match LocalLlm::new(path) {
        Ok(llm) => Box::into_raw(Box::new(llm)),
        Err(_) => std::ptr::null_mut(),
    }
}

#[no_mangle]
pub extern "C" fn llm_generate(
    llm: *mut LocalLlm,
    prompt: *const c_char,
    max_tokens: u32,
) -> *mut c_char {
    let llm = unsafe { &mut *llm };
    let prompt = unsafe { CStr::from_ptr(prompt) }.to_str().unwrap();

    match llm.generate(prompt, max_tokens as usize) {
        Ok(result) => CString::new(result).unwrap().into_raw(),
        Err(_) => std::ptr::null_mut(),
    }
}

#[no_mangle]
pub extern "C" fn llm_destroy(llm: *mut LocalLlm) {
    if !llm.is_null() {
        unsafe { let _ = Box::from_raw(llm); }  // 重新接管 → 自动 drop
    }
}
```

```kotlin
// Kotlin 侧使用
class LocalLlmWrapper(modelPath: String) : AutoCloseable {
    private val handle: Long = NativeLib.llm_create(modelPath)
    init { require(handle != 0L) { "模型加载失败" } }

    fun generate(prompt: String, maxTokens: Int = 256): String {
        return memScoped {
            val result = NativeLib.llm_generate(handle, prompt.cstr.ptr, maxTokens.toUInt())
            try { result?.toKString() ?: "生成失败" }
            finally { NativeLib.free_string(result) }
        }
    }

    override fun close() { NativeLib.llm_destroy(handle) }
}
```

#### Rust 的并发模型对 AI 推理的加持

```rust
// 生产者-消费者模式：一个线程推理，一个线程流式输出
use tokio::sync::mpsc;

async fn stream_inference(
    llm: Arc<Mutex<LocalLlm>>,
    prompt: String,
) -> mpsc::Receiver<String> {
    let (tx, rx) = mpsc::channel(32);

    tokio::spawn(async move {
        let mut llm = llm.lock().await;
        // 逐 token 流式生成
        for token in llm.generate_stream(&prompt) {
            if tx.send(token).await.is_err() {
                break;  // 接收端已关闭
            }
        }
    });

    rx  // 调用方可以逐 token 消费
}
```

> [!note] 为什么不用 Kotlin Coroutines 做推理？
> 你当然可以用 Kotlin Coroutines 管理推理的异步流程。但**核心计算循环**（矩阵乘法、注意力计算、采样）在 Rust 中可以：
> 1. 精确控制内存布局，最大化 CPU cache 命中率
> 2. 使用 SIMD 指令集加速向量运算
> 3. 避免 GC 在高内存压力下触发的延迟抖动
> 4. 直接使用 llama.cpp / whisper.cpp 等 C/C++ 推理库的原生绑定
>
> **最佳实践：Kotlin 管流程编排，Rust 管计算热路径。**

---

## 四、进阶路线图与"借用检查器"避坑指南

### 4.1 学习路线：从"让编译器闭嘴"到"写出 Idiomatic Rust"

```
Phase 1: 让编译器闭嘴（1-2 周）
│
├── 所有权转移 vs 克隆 —— 先用 clone() 绕过借用检查
├── & 和 &mut 的基本规则 —— 先用 {} 限制作用域
├── String vs &str —— 先全用 String，再理解切片
└── 生命周期标注 —— 先照抄编译器建议的标注
│
▼
Phase 2: 理解"为什么"（2-4 周）
│
├── 读《The Rustonomicon》理解 Unsafe 的边界
├── 理解 RAII 模式与 Drop trait
├── 掌握 Iterator trait 与函数式链式调用
├── Trait 对象 vs 泛型的取舍
└── 错误处理的分层设计 (thiserror + anyhow)
│
▼
Phase 3: 写出 Idiomatic Rust（1-3 月）
│
├── 用 enum 建模领域状态机
├── Builder 模式 / Typestate 模式
├── 零拷贝解析 (nom / winnow)
├── 用 Trait 模拟 Type Class
├── 宏的编写 (macro_rules! + proc_macro)
└── 异步运行时 (tokio / async-std)
│
▼
Phase 4: 架构级实践（持续）
│
├── 为 KMP 项目设计 FFI 边界
├── 设计跨语言的内存所有权协议
├── 性能剖析与优化 (criterion / perf / flamegraph)
└── Unsafe 审计与安全抽象的设计
```

---

### 4.2 Kotlin/Java 开发者的常见误区与纠正策略

#### 误区 1：试图构建"对象图"

```rust
// ❌ Kotlin 开发者的本能：构建相互引用的对象图
struct Department {
    employees: Vec<Employee>,
}
struct Employee {
    department: Department,  // ❌ 循环所有权！编译器拒绝
    name: String,
}
```

```rust
// ✅ Rust 思维：用 ID 引用，而不是直接嵌套
struct Store {
    departments: HashMap<DeptId, Department>,
    employees: HashMap<EmpId, Employee>,
}

struct Employee {
    department_id: DeptId,  // ✅ 通过 ID 间接引用
    name: String,
}

// 需要关联查询时，提供方法而非存储引用
impl Store {
    fn employee_department(&self, emp: &EmpId) -> Option<&Department> {
        self.employees.get(emp)
            .and_then(|e| self.departments.get(&e.department_id))
    }
}
```

> [!tip] 核心原则
> 在 Rust 中，**数据所有权应该形成树形（或 DAG）结构，而非图结构**。需要双向关联时，用索引/ID 替代直接引用。这与 ECS (Entity-Component-System) 架构模式不谋而合。

#### 误区 2：到处 `.clone()` 逃避借用检查

```rust
// ❌ "让编译器闭嘴"式的 clone 滥用
fn process(data: Vec<Data>) -> Result<Output> {
    let cloned = data.clone();         // 毫无意义的深拷贝
    let result = transform(cloned);
    let another_clone = result.clone(); // 又一次
    Ok(analyze(another_clone))
}
```

```rust
// ✅ 通过借用 + 生命周期传递数据
fn process(data: &[Data]) -> Result<Output> {
    let intermediate = transform(data)?;  // 借用输入
    Ok(analyze(&intermediate))            // 借用中间结果
}
```

**何时 clone 是合理的：**

```rust
// ✅ 合理使用 clone 的场景
fn spawn_worker(data: Arc<Vec<Data>>) {  // Arc::clone = 引用计数+1，O(1)
    tokio::spawn(async move {
        process(&data).await;
    });
}

fn cache_result(&mut self, key: String, value: Output) {
    // 值被存入 HashMap，需要拥有所有权 → clone 是合理的
    self.cache.insert(key, value.clone());
    self.last_result = Some(value);
}
```

#### 误区 3：用 Trait Object 替代所有多态

```rust
// ❌ Kotlin 开发者的直觉：到处用 dyn Trait (类似 Interface)
trait Shape {
    fn area(&self) -> f64;
}
fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {  // 堆分配 + vtable
    shapes.iter().map(|s| s.area()).sum()
}
```

```rust
// ✅ 优先使用泛型（静态分发）或 Enum
// 方案 A：泛型 —— 当类型集是开放的
fn total_area<T: Shape>(shapes: &[T]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}

// 方案 B：Enum —— 当类型集是封闭的（推荐）
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h) => w * h,
            Shape::Triangle(a, b, c) => {
                let s = (a + b + c) / 2.0;
                (s * (s - a) * (s - b) * (s - c)).sqrt()
            }
        }
    }
}

fn total_area(shapes: &[Shape]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()  // 零堆分配，可内联
}
```

#### 误区 4：忽略 `Send` 和 `Sync` 的约束

```rust
// ❌ Kotlin: 任何对象都可以传给另一个线程
// val data = mutableListOf(1, 2, 3)
// thread { data.add(4) }  // 编译通过，运行时可能崩溃

// Rust: 编译器阻止你发送非线程安全的类型
fn main() {
    let data = Rc::new(vec![1, 2, 3]);  // Rc 不是 Send
    let data_clone = data.clone();       // Rc::clone（引用计数）

    std::thread::spawn(move || {         // ❌ 编译错误！Rc 不是 Send
        println!("{:?}", data_clone);
    });
}
```

```rust
// ✅ 使用线程安全的替代品
fn main() {
    let data = Arc::new(vec![1, 2, 3]);  // Arc = 原子引用计数，是 Send + Sync
    let data_clone = Arc::clone(&data);

    std::thread::spawn(move || {         // ✅ Arc 是 Send
        println!("{:?}", data_clone);
    });
}
```

| 类型 | 用途 | Send | Sync | 等价于 Kotlin |
|------|------|------|------|--------------|
| `Rc<T>` | 单线程引用计数 | ❌ | ❌ | `kotlinx.atomicfu` 前的非线程安全对象 |
| `Arc<T>` | 多线程引用计数 | ✅ | ✅ | 线程安全的共享对象 |
| `Mutex<T>` | 互斥锁保护的值 | ✅ | ✅ | `@Synchronized` |
| `RefCell<T>` | 运行时借用检查 | ✅ | ❌ | 无直接对等（GC 天然允许） |
| `Cell<T>` | Copy 类型的内部可变性 | ✅ | ❌ | 无直接对等 |

#### 误区 5：过早抽象 & 过度工程

```rust
// ❌ 来自 OOP 的过度抽象
trait Repository<T, ID> {
    async fn find_by_id(&self, id: ID) -> Result<Option<T>>;
    async fn save(&self, entity: &T) -> Result<()>;
    async fn delete(&self, id: ID) -> Result<()>;
}

trait Service<T> {
    async fn process(&self, input: T) -> Result<T>;
}

struct UserService<R: Repository<User, UserId>> {
    repo: R,
}
// 在 Rust 中，这种 Java 式的层层接口往往导致：
// 1. 生命周期标注地狱
// 2. 泛型参数爆炸
// 3. 编译时间指数增长
```

```rust
// ✅ Rust 风格：函数 + 组合 + 最小 Trait
// 直接使用具体类型，用函数组合而非接口层叠
async fn find_user(db: &PgPool, id: UserId) -> Result<Option<User>> {
    sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(db)
        .await
        .map_err(Into::into)
}

async fn process_user(db: &PgPool, id: UserId) -> Result<User> {
    let user = find_user(db, id).await?
        .ok_or(AppError::NotFound)?;
    // 直接处理业务逻辑
    Ok(user)
}
```

> [!summary] Rust 的架构美学
> 1. **偏爱具体类型**，而非 Trait 层叠
> 2. **偏爱函数组合**，而非对象层次
> 3. **偏爱 Enum 状态机**，而非继承多态
> 4. **偏爱数据变换**，而非消息传递
> 5. **编译器是你的架构审查员**——如果类型系统表达起来很痛苦，可能说明设计有问题

---

### 4.3 从 Kotlin 到 Rust 的思维映射速查表

| Kotlin 概念 | Rust 对等 | 关键差异 |
|-------------|----------|---------|
| `val` / `var` | `let` / `let mut` | 默认不可变，与 Kotlin 的 `val` 对齐 |
| `null` / `T?` | `Option<T>` | 类型枚举，不是语言级 null |
| `try-catch` | `Result<T, E>` + `?` | 错误是值，不是控制流异常 |
| `interface` | `trait` | 支持默认实现、关联类型、泛型约束 |
| `sealed class` | `enum` | ADT，携带数据的变体 |
| `data class` | `#[derive(Clone, Debug)]` struct | 需显式 derive，但更灵活 |
| `object` (单例) | `static` / `lazy_static!` / `once_cell` | 无语言级单例，用库实现 |
| `companion object` | `impl StructName` (关联函数) | `::new()` vs Kotlin 的 `Companion.create()` |
| `suspend fun` | `async fn` | Future-based，需 `.await` |
| `coroutine scope` | `tokio::spawn` / `async { }` | 手动选择运行时 |
| `lazy { }` | `LazyLock<T>` / `once_cell::sync::Lazy` | 需要显式同步原语 |
| `by lazy` 属性委托 | `LazyLock` | 语法不同但语义一致 |
| `inline fun` | `#[inline]` | 编译器提示，不是强制 |
| `reified` 泛型 | 无直接对等 | 用宏或 `Any` + downcast 替代 |
| 扩展函数 | `impl Trait for Type` | Trait impl 可为已有类型添加方法 |
| `KClass<T>` | `TypeId::of::<T>()` | 反射能力远弱于 Kotlin |
| `kotlinx.serialization` | `serde` | 生态更成熟，derive 宏驱动 |

---

## 五、总结：Rust 在跨平台架构中的战略定位

```
┌─────────────────────────────────────────────────────────────┐
│                    Rust 的最佳应用层                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 性能关键路径                                             │
│     └─ 数据处理管线、编解码、加密解密、模型推理前处理            │
│                                                             │
│  2. 跨平台核心逻辑                                           │
│     └─ 一份 Rust 代码 → Android .so + iOS .a + Desktop      │
│                                                             │
│  3. 系统级交互                                               │
│     └─ 文件系统、网络协议栈、蓝牙/NFC、硬件传感器              │
│                                                             │
│  4. 端侧 AI 引擎                                            │
│     └─ 模型加载、推理执行、Token 采样、上下文管理               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Kotlin/KMP 的最佳应用层                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. UI 层与业务逻辑                                          │
│     └─ Compose UI、应用架构、状态管理                         │
│                                                             │
│  2. 流程编排                                                 │
│     └─ Coroutines、异步协调、错误处理策略                      │
│                                                             │
│  3. 平台集成                                                 │
│     └─ Android SDK、iOS Framework、平台特有功能               │
│                                                             │
│  4. 快速迭代                                                 │
│     └─ 原型开发、配置管理、数据库 ORM 层                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> [!summary] 核心主张
> **Rust 不是 Kotlin 的替代品，而是它的补充层。**
>
> 在跨平台架构中，它们的关系应该是：
> - **Kotlin** 负责"说什么"——业务意图、用户交互、流程编排
> - **Rust** 负责"怎么做"——计算密集、内存敏感、平台底层
> - **C-FFI/UniFFI** 是两者之间的桥梁
>
> 当你开始思考"这段逻辑需要零 GC 停顿"、"这块计算需要精确的内存布局"、"这个库只有 C/C++ 实现"的时候——那就是 Rust 的领地。

---

> [!tip] 推荐下一步
> 1. 实践项目：为你的 KMP 项目构建一个 Rust 核心模块（文本处理/加密/模型推理），通过 UniFFI 桥接
> 2. 阅读顺序：[The Rust Book](https://doc.rust-lang.org/book/) → [Rust by Example](https://doc.rust-lang.org/rust-by-example/) → [The Rustonomicon](https://doc.rust-lang.org/nomicon/)
> 3. 关注生态：`serde`（序列化）、`tokio`（异步运行时）、`candle`（ML 推理）、`uniffi`（FFI 绑定）
