---
title: 'Java和Kotlin混合构建SpringBoot项目'
date: 2026-04-28
tags:
  - 开发学习
  - 开发学习/后端开发/框架
---

> [!summary] 先导内容
> [[Java知识点总结|Java]]，[[Kotlin知识点快速梳理|Kotlin]]，[[Spring]]

> [!note] 概述
> Kotlin（以下简称kt）是一门成熟的静态类型语言，兼具面向对象、函数式编程的特性，并提供**空安全**、**扩展**、**高阶函数**、**协程**等能力。这使得 kt 在编写项目时更加简洁。
> kt 常被用于 Android，但它同样适合 Spring Boot 后端开发。Spring 官方提供 Kotlin 支持，配合`kotlin-spring`、`kotlin-jpa`、`kotlin-reflect`等依赖，可以减少 Kotlin 默认 final、无参构造、反射等特性与 Spring/JPA 的摩擦。
> 因此，在这篇文章中，我们来讨论如何使用 kt （某些部分会和Java混合编程）来进行SpringBoot项目的构建，提高我们的编码体验。
# 1. 混合项目构建基础
## 1.1 创建项目与kt相关依赖导入
> [!summary] Gradle Kotlin DSL 示例
> Spring Boot + Kotlin 项目通常需要 Kotlin JVM 插件、Spring 插件、`kotlin-reflect`。如果使用JPA，还需要`kotlin-jpa`插件。

```kotlin
plugins {
    kotlin("jvm") version "$kotlin_version"
    kotlin("plugin.spring") version "$kotlin_version"
    kotlin("plugin.jpa") version "$kotlin_version"
    id("org.springframework.boot") version "$spring_boot_version"
    id("io.spring.dependency-management") version "$dependency_management_version"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

> [!tip] 说明
> - `kotlin("plugin.spring")`会自动打开被Spring注解标记的类，避免Kotlin默认`final`与Spring代理冲突
> - `kotlin("plugin.jpa")`会为JPA实体生成无参构造
> - `jackson-module-kotlin`让Jackson更好地处理Kotlin主构造函数、默认参数和空安全

# 2. 语言基础的对比
## 2.1 集合类的使用
> [!note] 概述
> kt 的集合与Java中的集合最大的不同就是：kt 中的集合分为**可变集合** 和 **只读集合**，以*Mutable*开头命名的集合都是可变集合，可变集合包含了可以修改集合的函数`add`、`remove`、`clear`等。
> 这种设计的智慧在于：
> - **控制权限**：可以通过声明集合的类型来明确地表达意图
> ```kotlin
> fun processItems(items: List<String>){
> 	items.get(0) // 可以读取内容
> 	items.add("x") // 编译失败！因为是只读的List
> }
> 
> class Repository{
> 	private val _internalList = mutableListOf<String>() // 可变List，但是是私有的
> 	val publicItems: List<String> get() = _internalList.toList() // 只读，公开
> 	fun addItem(item: String){
> 		_internalList.add(item) // 类内可以修改
> 	}
> }
> ```
> - **减少副作用**：在Java中，如果将一个`ArrayList`传递给一个方法，你确定不了这个方法是否会修改你的列表。而在 kt 中，如果函数声明接收`List`，调用方至少知道这个函数不能通过该引用调用修改方法。需要注意，只读集合不等于深不可变，也不天然保证线程安全。

> [!summary] 在 kt 项目中使用集合的最佳实践
> - **优先使用只读集合**：这是最重要的原则。将变量声明为只读接口（`List`, `Set`, `Map`）是默认选择。
>``` kotlin
>// ✅ 推荐: 默认使用只读接口
>val users: List<User> = fetchUsers()
>val config: Map<String, Any> = loadConfig()
>
>// ❌ 避免: 不要随意使用可变接口，除非你真的需要修改
>val mutableUsers: MutableList<User> = fetchUsers().toMutableList() // 需要充分理由！
>```
> - **明智地选择具体实现**：虽然通常使用工厂函数`listOf`等，但kotlin 也允许指定具体实现，这在需要性能保证时很有用
>```kotlin
>// 如果需要特定的数据结构特性
>val linkedList = LinkedList<String>() // 频繁的插入/删除
>val sortedSet = sortedSetOf("c", "a", "b") // 自动排序的Set (TreeSet)
>val cache = LinkedHashMap<String, Data>().apply { ... } // 保持插入顺序的Map
>```
> - **使用 buildList,buildMap 等构造器**：当需要复杂逻辑来初始化一个**只读集合**时，使用构建器来避免中间集合的创建。
> ```kotlin
>// ❌ 不够优雅：创建了中间的可变集合
>val result = mutableListOf<Int>()
>for (i in 1..10) {
>    if (i % 2 == 0) {
>        result.add(i * i)
>    }
>}
>val finalList = result.toList()
>
>// ✅ GOOD: 使用构建器，更清晰高效
>val finalList = buildList {
>    for (i in 1..10) {
>        if (i % 2 == 0) {
>            add(i * i)
>        }
>    }
>}
>// finalList 的类型是 List<Int>
>```
>- **使用序列（Sequence）处理大型集合或复杂链**：对于`map`，`filter`等操作，Kotlin集合会立即（eagerly）创建中间集合。如果数据量很大或操作链很长，应使用`Sequence`（类似于Java的`Stream`）。
>```kotlin
>val largeList = (1..1_000_000).toList()
>
>// 急切求值：会创建多个中间列表
>val resultEager = largeList
>    .map { it * 2 }       // 创建100万个元素的列表1
>    .filter { it % 3 == 0 } // 创建约33万个元素的列表2
>    .take(10)             // 取前10个
>
>// 惰性求值：逐个元素处理，无中间集合，性能更高
>val resultLazy = largeList.asSequence()
>    .map { it * 2 }       // 对第一个元素执行
>    .filter { it % 3 == 0 } // 对第一个元素执行
>    .take(10)             // 取满10个就停止
>    .toList()             // 终端操作，最终结果才是集合
>```

## 2.2 字段的设计
> [!note] 概述
> 与Java不同，在Kotlin中，基本数据类型和包装类被统一了。如 Int, Double等。这些看起来像是每一个字段都是一个对象，然而并非如此。
> 在 kt 的编译过程中，编译器一般会将这些类型视为基本数据类型而非包装类。只有在必要的时候，编译器才会将其编译为包装类。那么什么是“必要的时候”？
> - **可空类型**：众所周知，基本数据类型不能为null，而包装类（对象）可以为空。当你声明一个变量属性为`Int?`时，就说明这是一个可以为空的 int 类型，它的值可能为null，这时编译器就会使用 Integer
> - **泛型参数**：当将 Int 放入到`List<Int>`中时，由于Java的泛型擦除机制，JVM层面需要的是对象，因此编译器会使用 Integer

> [!summary] 在数据类中设计字段时，如何设置最合理？
> - **不可变性原则优先**：不可变性原则是数据类设计的黄金法则，即将变量设置为 val 而非 var
> 
> ```kotlin
> // ❌ 反例（可变数据类）
> data class User(
> 	// 使用var很不安全，这会破坏数据的一致性！
> 	var name: String,
> 	var age: Int
> )
> 
> // ✅ 正例（不可变数据类）
> data class User(
> 	val name: String,
> 	val age: Int
> )
> ```
> -  **字段选择**：谨慎使用可空类型，使用`?`明确表达可选性
> 	- 可空字段使用场景：
> 		- 字段确实可能不存在或未设置
> 		- 有合理的默认值时使用默认参数
> ```kotlin
> data class Product(
> 	val id: Long,        // 明确非空
> 	val price: Double,   // 必须有价格
> 	val inStock: Boolean // 明确的布尔状态
> )
> data class UserProfile(
> 	val name: String,
> 	val age: Int? = null, // 年龄可能为空
> 	val avatarUrl: String? = null // 头像可选
> )
> ```
> - **集合类型的选择**：避免可变集合
> ```kotlin
> // ❌ 反例
> data class Order(
> 	// 外部可能直接修改内部状态
> 	val items: MutableList<OrderItem>
> )
> 
> // ✅ 正例
> data class Order(
> 	// 外部只能读取不能修改
> 	val items: List<OrderItem>
> ){
> 	// 如果需要修改，要提供明确的方法
> 	fun addItem(item: OrderItem): Order = copy(items = items + item)
> }
> ```



# 3. kt新特性的使用
## 3.1 数据类
> [!note] 数据类回顾
> ## **核心特性**：数据类会自动生成一些内容：
> - `equals`：比较对象
> - `hashCode`：返回哈希码
> - `toString`：返回对象的字符串表示
> - `componentN`：支持解构
> - `copy`函数，实现内容复制
> ```kotlin
> data class User(
> 	val name: String,
> 	val age: Int
> )
> ```
> ## **陷阱与限制**
> - 继承限制：数据类本身不能声明为`open`、`sealed`、`abstract`或`inner`；它可以实现接口，也可以继承普通类，但主构造函数中用于生成数据类函数的参数必须全部使用`val/var`
> ```kotlin
> open class Entity(val id: Long)
> // ✅ 可以继承普通类
> data class User(val name: String,val age: Int) : Entity(1L)
> // 也可以实现接口
> data class User(val name: String,val age: Int) : Serializable
>```
>- 不能为抽象：抽象数据类无意义
> ```kotlin
> // 反例：抽象数据类
> abstract data class Response(val success: Boolean)
> 
> // 正确实现：使用密封类处理不同响应类型
> sealed class ApiResponse<out T>{
> 	data class Success<T>(val data: T) : ApiResponse<T>()
> 	data class Error(val message: String) : ApiResponse<Nothing>()
> }
> ```
> 
> - 数组和集合字段的陷阱
> ```kotlin
> // 数组的equals基于引用比较
> data class Product(val tags: Array<String>)
> val p1 = Product(arrayOf("a","b"))
> val p2 = Product(arrayOf("a","b"))
> println(p1 == p2) // false！
> 
> // 解决方案1：使用List
> data class Product(val tags: List<String>)
> // 解决方案2：如果必须使用数组，则需要自定义equals/logic
> data class Product(private val tags: Array<String>){
> 	// 自定义equals逻辑
> 	override fun equals(other: Any?): Boolean{
> 		// 自定义数组内容比较
> 	}
> 	// 提供只读视图
> 	fun getTags(): List<String> = tags.toList()
> }
> ```
> - 可变字段破坏数据一致性：字段设置为 val 防止外部修改
> 
> - 深度拷贝问题
> ```kotlin
> data class Company(val name: String,val employees: MutableList<Employee>)
> data class Employee(val name: String)
> 
> val company = Company("Tech",mutableListOf(Employee("Alice")))
> val company1 = company.copy() // 浅拷贝！！
> 
> company.employees.add(Employee("Bob"))
> println(company.employees.size)  // 2
> println(company1.employees.size) // 2 因为共享了同一个List引用！！
> ```

> [!summary] 数据类的最佳实践：仅代表值而不代表身份或行为
> ## **最佳实践**
> - 坚持不可变原则：所有主构造函数参数都应该为*val*
> - 合理使用默认参数和命名参数
> - 防御性拷贝
> - 与密封类结合处理复杂状态
> - 为数据类定义领域逻辑
> - 利用解构声明
> - 为复杂数据类提供转换函数
> 
> ## **注意事项**
> 数据类不是万能的，在这些场景下不能使用
> - 需要复杂继承层次
> - 需要身份标识而非值标识
> - 存在大量业务逻辑

## 3.2 构造函数
> [!note] 回顾
> 在kt中常见的构造方式包括：默认构造函数、主构造函数和次构造函数
> 1. **默认构造函数**：当没有声明任何构造函数时，会默认生成无参构造，相当于显式声明`constructor()`。但是一旦声明了任意构造函数，默认构造将不会被提供，必须显式声明！
> 2. **主构造函数**：在类头中声明属性，在`init`块中初始化。当无注解和权限修饰符时，可以省略 *constructor*关键字
> 3. **次构造函数**：在类体内声明。如果类存在主构造函数，次构造函数必须直接通过`this()`或间接通过其它次构造函数委托给主构造函数
> ```kotlin
> class User(val username: String,private val age: Int){
> 	private var email: String? = ""
> 	
> 	// 次构造函数1
> 	constructor (username: String): this(username,18){
> 		println("使用次构造函数1")
> 	}
> 	// 次构造函数2
> 	constructor(username: String,email: String): this(username){
> 		this.email = email
> 		println("设置邮箱为" + email)
> 	}
> 	// init块
> 	init{
> 		require(age>0)
> 		println("用户初始化完成")
> 	}
> }
> ```

> [!summary] Spring项目中的最佳实践
> ## **最佳实践**
> ### 依赖注入场景
> - 使用主构造函数注入。只有一个构造函数时通常可以省略`@Autowired`
> ```kotlin
> @Service
> class UserService(
> 	private val userRepository: UserRepository,
> 	private val emailService: EmailService,
> 	@Value("\${app.max-login-attempts:5}") private val maxLoginAttempts = 5
> ){
> 	//业务逻辑
> }
> ```
> 
> - 字段注入+无参构造可以使用，但不推荐作为默认方案。它会降低可测试性，也更容易隐藏必需依赖
> ```kotlin
> @Service
> class UserService{
> 	@Autowired
> 	private lateinit var userRepository: UserRepository
> 	
> 	@Autowired
> 	private lateinit var emailService: EmailService
> 	
> 	@Value("\${app.max-login-attempts:5}")
> 	private var maxLoginAttempts: Int = 5
> 	
> 	//无参构造
> 	constructor(){
> 		println("UserService实例被创建")
> 	}
> }
> ```
> - 配置类的实现
> ```kotlin
> @Configuration
> class DatabaseConfig{
> 	// 使用带默认值的主构造函数，便于测试和配置覆盖
> 	@Bean
> 	fun dataSource(
> 		@Value("\${db.url}") url: String,
> 		@Value("\${db.username}") username: String,
> 		@Value("\${db.password}") password: String,
> 		@Value("\${db.pool.size:10}") poolSize: Int = 10
> 	): DataSource{
> 		return HikariDataSource().apply{
> 			jdbcUrl = url
> 			this.username = username
> 			this.password = password
> 			maximumPoolSize = poolSize
> 		}
> 	}
> }
> 
> // 配置属性类 -- 使用主构造函数+默认值
> @ConfigurationProperties(prefix = "app.security")
> data class SecurityProperties(
> 	val jwtSecret: String = "default-secret",
> 	val tokenExpiration: Long = 86400000
> )
> ```
> - 实体类与DTO类的实现
> ```kotlin
> // JPA实体 -- 需要无参构造
> @Entity
> class User(
> 	@Id
> 	@GeneratedValue(strategy = GenerationType.IDENTITY)
> 	val id: Long? = null,
> 	
> 	@Column(nullable = false,unique = true)
> 	val username: String,
> 	
> 	@Column(nullable = false)
> 	val email: String,
> 	
> 	@CreationTimestamp
> 	val createAt: LocalDateTime? = null
> ){
> 	// 无参构造
> 	constructor(): this(null,"","",null)
> 	// 业务构造函数
> 	constructor(username: String,email: String): this(null,username,email,null)
> }
> 
> // DTO数据传输对象 -- 使用数据类的主构造函数
> data class UserDto(
> 	val id: Long?,
> 	val username: String,
> 	val email: String,
> 	val createAt: String? = null
> )
> ```
> 
> ## **注意事项**
> - 避免多个构造函数的歧义
> ```kotlin
> // 正确实现：只保留一个@Autowired构造函数
> @Service
> class CorrectService @Autowired constructor(
> 	private val userRepository: UserRepository,
> 	private val emailService: EmailService? = null // 使用可选参数
> )
> ```
> - 注意初始化顺序问题
> ```kotlin
> @Component
> class LifecycleExample(
> 	private val dependency: SomeDependency
> ){
> 	// init块 -- 在主构造函数后执行
> 	init{
> 		println("1.执行初始化")
> 		// 此时主构造函数依赖已经可用
> 	}
> 	// @PostConstruct方法，在所有依赖注入完成后执行
> 	@PostConstruct
> 	fun postConstruct(){
> 		println("1.@PostConstruct执行")
> 		dependency.initialize()
> 	}
> 	// 次构造函数中的逻辑最后执行
> 	constructor(): this(DefaultDependency()){
> 		println("3.次构造逻辑执行")
> 	}
> }
> ```


## 3.3 扩展函数/属性
> [!note] 扩展回顾



## 3.4 属性相关内容

### 延迟初始化

### 委托属性

### 惰性加载属性

### 可观察属性

## 3.5 高阶函数的使用
### 常规使用
> [!note] 高阶函数回顾
> 在 kotlin 的学习过程中，我们了解了函数式编程的基础就是**高阶函数的支持**，简而言之，就是可以*将一个函数作为另一个函数的参数或返回值*使用。

> [!example] 高阶函数举例
> 
```kotlin
//定义长方形面积  
//函数类型:(Double, Double) -> Double  
fun rectangleArea(length: Double, width: Double): Double{  
    return length * width  
}  
  
//定义三角形面积  
//函数类型:(Double, Double) -> Double  
fun triangleArea(base: Double, height: Double) = height * base * 0.5  
  
//定义打印hello  
//函数类型:() -> Unit  
fun sayHello(){  
    println("hello")  
}

fun main(){  
	//引用rectangleArea函数
    val getArea:(Double, Double)-> Double = ::rectangleArea  
    val area = getArea(10.0, 20.0)  
    println(area)  
}
```

> [!example] 高阶函数在Spring中的使用
> 使用一个Book的简单Demo来展现高阶函数的使用
> ## ***实体类***
> ```kotlin
>@Entity  
>@Table(name = "books")  
>class Book(
>    @Id  
>    @GeneratedValue(strategy = GenerationType.IDENTITY)  
>    var id: Long? = null,
>  
>    @Column(nullable = false)  
>    var title: String = "",
>  
>    @Column(nullable = false)  
>    var author: String = "",
>  
>    @Column(nullable = false)  
>    var isbn: String = "",
>  
>    @Column(nullable = false)  
>    var publishedYear: Int = 0
>)
> ```
> [!warning] 注意
> JPA实体不要默认使用数据类。数据类生成的`equals/hashCode/toString/copy`更适合值对象，而JPA实体通常有持久化身份、代理和延迟加载问题。JPA实体建议使用普通类，并配合`kotlin-jpa`/`kotlin-spring`插件处理无参构造和open类问题。
> ## ***DTO***
> 使用密封类编写DTO对象，保证类型安全，同时保证了API响应的一致性，以及良好的扩展性（由于密封类的子类个数有限）和更直观的表达能力
> ```kotlin
> sealed class BookDto {  
>    data class Request(  
>        val title: String,  
>        val author: String,  
>        val isbn: String,  
>        val publishedYear: Int  
>    ) : BookDto()  
>  
>    data class Response(  
>        val id: Long?,  
>        val title: String,  
>        val author: String,  
>        val isbn: String,  
>        val publishedYear: Int
>    ) : BookDto()  
>  
>    data class Summary(  
>        val id: Long?,  
>        val title: String,  
>        val author: String  
>    ) : BookDto()  
>  
>    data class Detailed(  
>        val id: Long?,  
>        val title: String,  
>        val author: String,  
>        val isbn: String,  
>        val publishedYear: Int,  
>        val formattedInfo: String  
>    ) : BookDto()  
>}
>
> fun Book.toResponse(): BookDto.Response =
>     BookDto.Response(
>         id = id,
>         title = title,
>         author = author,
>         isbn = isbn,
>         publishedYear = publishedYear
>     )
> ```
> ## ***统一响应类 R***
> ```kotlin
> sealed class R<out T> {  
>    data class Success<T>(val data: T) : R<T>()  
>    data class Error(val message: String, val code: Int = 500) : R<Nothing>()  
>    object Loading : R<Nothing>()  
>    companion object {  
>        fun <T> success(data: T) = Success(data)  
>        fun error(message: String, code: Int = 500) = Error(message, code)  
>        val loading = Loading  
>    }  
>}
> ```
> ## ***数据持久层***
> ```kotlin
>@Repository  
>interface BookRepository : JpaRepository<Book, Long>{  
>    fun findByAuthor(author: String): List<Book>  
>    fun findByTitleContaining(title: String): List<Book>  
>}
> ```
> ## ***服务层***
> ```kotlin
> @Service
> class BookService(
> 	private val bookRepository: BookRepository
> ){
> 	/**  
> 	* 根据自定义比较器对图书进行排序  
> 	*  
> 	* @param sorter 图书比较函数，定义两个图书对象的比较规则  
> 	* @return 返回包装了排序后图书列表的结果对象  
 >	*/  
> 	// 高阶函数用于排序书籍
> 	fun getSortedBooks(sorter: (Book, Book) -> Int): R<List<BookDto.Response>> {
> 		  return try {  
> 		      val books = bookRepository.findAll()  
> 		           .sortedWith(Comparator(sorter))  
> 		           .map { it.toResponse() }  
> 		      R.success(books)  
> 		  }catch (e: Exception) {  
> 		       R.error("Failed to sort books: ${e.message}")  
> 		  } 
> 	  }
> }
> ```
> ## ***控制层***
> ```kotlin
> @RestController
> @RequestMapping("/api/books")
> class BookController(
> 	private val bookService: BookService
> ){
> 	/**  
> 	* 获取最近出版的图书列表（按出版年份倒序排列）  
> 	*  
> 	* @return 返回按出版年份排序的图书列表  
 >	*/ 
 >	@GetMapping("/recent")
 >	fun getRecentBooks(): R<List<BookDto.Response>> {
 >	// 使用高阶函数定义排序逻辑
 >		val sorter = { book1: Book,book2: Book ->  
 >		book2.publishedYear.compareTo(book1.publishedYear) 
 >		} 
 >		return bookService.getSortedBooks(sorter)
 >	}
> }
> ```


### 内联函数的使用
> [!note] 回顾内联函数
> ## **自定义内联函数**
> 如果函数参数不是函数类型，不能接收lambda表达式，那么这种函数一般不声明为内联函数。声明内联函数需要使用关键字 **inline**
> ```kotlin
> inline fun calculatePrint(funN: (Int,Int) -> Int){
> 	println("${funN(10,5)}")
> }
> fun main(){
> 	calculatePrint{a,b -> a + b}
> 	calculatePrint{a,b -> a - b}
> }
> ```
> ## **let函数**
> 如果一个函数参数被声明为非空类型，就不能直接接收可空类型。手动判空过于繁琐时，可以使用**let**函数在非空时执行逻辑
> ```kotlin
> fun square(num: Int): Int = num * num
> fun main(){
> 	val n1: Int? = 10
> 	// 两种等效输出 非空时执行lambda表达式中的代码，如果为空则不执行
> 	n1?.let{n -> println(square(n))}
> 	n1?.let{println(square(it))}
> }
> ```
> ## **with 和 apply 函数**
> - `with`函数：对一个对象执行多个操作，无需重复写对象名
> ```kotlin
> data class Person(var name: String = "",var age: Int = 0,var city: String = "")
> fun main(){
> 	val person = Person()
> 	with(person){
> 		name = "张三"
> 		age = 18
> 		city = "北京"
> 	}
> 	println(person)
> }
> ```
> - `apply`函数：配置对象属性并返回对象本身
> ```kotlin
> fun main(){
> 	val person = Person().apply{
> 		name = "李四"
> 		age = 20
> 		city = "上海"
> 	}
> 	println(person)
> }
> ```
> 区别：
> - with 函数用于对已有对象进行操作，不支持链式调用，返回lambda表达式的最后一行
> - apply 函数用于对象的初始化和配置，支持链式调用，返回对象本身

> [!summary] 内联函数在Spring中的最佳实践
> - 只内联小型高阶函数，避免让字节码膨胀
> - 与事务、AOP、代理相关的代码不要为了“看起来优雅”强行内联
> - 需要`reified`类型参数时再使用内联，例如封装通用反序列化或类型判断
> - 业务服务方法通常不需要`inline`

> [!summary] 高阶函数的最佳实践
> 高阶函数的存在是为了解决同一逻辑的高频复用的问题
> ## **必须遵循的原则**
> 
> 1. 单一职责：每个高阶函数专注于一个横切关注点
> 2. 合理使用内联函数：小型函数使用内联，大型函数避免
> 3. 异常分层：不同层次处理不同的异常
> 4. 命名清晰：使用业务领域语言命名
> 5. 文档完备：为复杂的高阶函数提供使用示例
> 
> ## **需要注意的坑**
> 
> 1. 上下文丢失：尤其是在高协程环境中
> 2. 循环依赖：避免在事务中频繁创建调用
> 3. 过度抽象：没必要为不需要复用或复用性低的逻辑创建高阶函数
> 4. 性能影响：监控高阶函数对性能的实际影响
> 
## 3.6 协程--同步的方式写异步的代码
> [!note] 概述
> Spring 对 Kotlin 协程提供支持，尤其是在 WebFlux、R2DBC 等响应式栈中可以直接使用`suspend`函数。传统 Spring MVC + JDBC/JPA 仍然是阻塞模型，写成`suspend`并不会自动变成非阻塞。

```kotlin
@RestController
class UserController(
    private val userService: UserService
) {
    @GetMapping("/users/{id}")
    suspend fun getUser(@PathVariable id: Long): UserDto {
        return userService.findById(id)
    }
}
```

> [!warning] 注意
> - `suspend`表示函数可以挂起，不代表内部逻辑一定非阻塞
> - JPA、JDBC、文件IO等阻塞操作仍会占用线程
> - 使用响应式数据库访问时，可以结合R2DBC与协程适配
> - 不要在请求处理中使用`runBlocking`


# 4. SpringBoot 项目目录结构的对应实现方案
## 4.1 实体类

### 实体
实体类用于表达持久化对象，常与数据库表对应。

```kotlin
@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var username: String = "",

    @Column(nullable = false)
    var email: String = ""
)
```

> [!tip] 说明
> 使用JPA时建议启用`kotlin-jpa`和`kotlin-spring`插件，由插件生成无参构造并打开Spring/JPA需要代理的类。


### 数据传输对象（DTO）
DTO用于接口入参和响应出参，不直接暴露JPA实体。

```kotlin
data class UserCreateRequest(
    val username: String,
    val email: String
)

data class UserResponse(
    val id: Long,
    val username: String,
    val email: String
)
```


## 4.2 数据持久层
```kotlin
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
}
```


## 4.3 服务类
```kotlin
@Service
class UserService(
    private val userRepository: UserRepository
) {
    fun create(request: UserCreateRequest): UserResponse {
        val user = userRepository.save(
            User(username = request.username, email = request.email)
        )

        return UserResponse(
            id = user.id ?: error("保存用户失败"),
            username = user.username,
            email = user.email
        )
    }
}
```


## 4.4 控制类
```kotlin
@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService
) {
    @PostMapping
    fun create(@RequestBody request: UserCreateRequest): UserResponse {
        return userService.create(request)
    }
}
```

> [!summary] 分层原则
> - Controller负责HTTP协议转换和参数校验
> - Service负责业务逻辑和事务边界
> - Repository负责数据库访问
> - Entity只表达持久化结构，DTO只表达接口数据
