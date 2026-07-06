---
title: 'MyBatis'
date: 2026-03-11
tags:
  - 开发学习
  - 开发学习/后端开发/框架
---

> [!tip] 先导内容
> [[MySQL知识点梳理|MySQL]]

> [!question] 什么是MyBatis？为什么要使用MyBatis？
> MyBatis 是一款优秀的**数据持久层框架**，目的是**简化JDBC开发**
> ```mermaid
> graph LR
> A[Controller] --> B[Service]
> B --> C[Repository/Dao]
> C --> D[数据库]
> ```
  

# 1. MyBatis的基本使用

## 1.1 数据持久化与ORM
> [!note] 概述
> 在现代应用开发中，数据持久化是一个关键的概念。它涉及将数据保存在持久存储（如数据库中），以确保在程序关闭或崩溃后，数据仍然会被保留。直接与数据库交互操作复杂而且有可能出错，尤其在面向对象过程中，ORM（对象关系映射，**O**bject-**R**elational **M**apping）显得尤为重要。
> ORM桥接了买东西的编程与关系型数据库存储数据方式之间的鸿沟，它允许开发者以操作对象的形式与数据库交互，简化了数据库操作过程。
> MyBatis是一种半自动的 ORM 框架，它允许开发者直接编写 SQL，同时提供了结果映射到对象的能力。与完全自动的 ORM 工具相比，MyBatis提供了过呢更多的灵活性和控制力，其核心特性如下
> - **灵活的SQL查询**：允许按照开发者的风格编写SQL，充分利用数据库的功能
> - **强大的映射功能**：支持多种复杂映射关系
> - **双向配置**：提供注解和XML两种配置方式
> - **动态 SQL**：支持根据运行时条件改变的SQL查询
> - **内置连接池和事务管理**：简化连接和事务管理，也支持集成第三方工具
## 1.2 SpringBoot集成MyBatis
> [!tip] 使用步骤
> 通过导入 `mybatis-spring-boot-starter`,通过这个 Starter，开发者可以轻松地将MyBatis集成到SpringBoot应用中，并利用SpringBoot的自动配置特性快速启动、构建、运行
### 加入依赖
> [!tip] 使用说明
> 在 pom.xml 文件中添加MyBatis和Spring JDBC的依赖
```xml
<dependency>  
    <groupId>org.mybatis.spring.boot</groupId>  
    <artifactId>mybatis-spring-boot-starter</artifactId>  
    <version>3.0.5</version>  
</dependency>  
<dependency>  
    <groupId>org.mybatis.spring.boot</groupId>  
    <artifactId>mybatis-spring-boot-starter-test</artifactId>  
    <version>3.0.5</version>  
    <scope>test</scope>  
</dependency>
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-data-jdbc</artifactId>  
</dependency>
```

### 配置数据源
> [!tip] 使用说明
> 在配置文件中添加数据库的相关内容
```yml
spring:
  datasource:  
    url: jdbc:mysql://localhost:3306/user_test?useSSL=false&serverTimezone=UTC&characterEncoding=utf8  
    username: root 
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```
> [!note] 上述参数的说明如下
> - `url`：定义数据库服务器地址和端口，以及要操作的数据库名。此处的 URL 包含了数据库地址（localhost:3306）、数据库名称（user_test）以及一些连接参数，如禁用 SSL（useSSL=false)、设置服务器时区（serverTimezone=UTC）和字符集（characterEncoding=utf8）
> - `username`：指定连接的数据库所使用的用户名
> - `password`：指定连接的对应用户名使用的密码
> - `dirver-class-name`：指定使用 MySQL JDBC 驱动类名
### 开始操作
1. 创建数据表

|       字段名       | 字段含义 |     数据类型     |
| :-------------: | :--: | :----------: |
|       id        | 用户编号 |     INT      |
|    username     | 用户名  | VARCHAR(255) |
|      email      | 电子邮件 | VARCHAR(255) |
| registered_date | 注册日期 |     DATE     |

|    字段名     | 字段含义 |     数据类型      |
| :--------: | :--: | :-----------: |
|     id     | 订单编号 |      INT      |
|  user_id   | 用户编号 |      INT      |
| order_date | 订单日期 |     DATE      |
|   amount   | 订单金额 | DECIMAL(10,2) |

创建数据表
```MySQL
create table users(  
    id int primary key auto_increment,  
    username varchar(255) not null,  
    email varchar(255) unique not null,  
    registered_at date not null  
);  
  
create table orders(  
    id int primary key auto_increment,  
    user_id int,  
    order_date date not null,  
    amount decimal(10,2) not null,  
    foreign key (user_id) references users(id)  
)
```

测试数据
```MySQL
-- 插入用户数据  
insert into users(username, email, registered_at) values('user1', '<EMAIL>', '2023-04-01');  
insert into users(username, email, registered_at) values('user2', '<EMAIL>', '2023-04-02');  
  
-- 插入订单数据  
insert into orders(user_id, order_date, amount) values(1, '2023-04-03', 100.00);  
insert into orders(user_id, order_date, amount) values(1, '2023-04-04', 50.00);  
insert into orders(user_id, order_date, amount) values(2, '2023-04-05', 75.00);
```

2. 定义实体类
```java
public class User {  
    private int id;  
    private String username;  
    private String email;  
    private Date registeredDate;  
    // getter & setter
}
```

3. 创建MyBatis映射
> [!note] 映射概述
> MyBatis 映射是其核心功能之一，主要负责描述如何将SQL查询结果转换为Java对象，以及如何从 Java 对象转换到 SQL 查询参数。映射定义了数据库与 Java 对象之间的数据转换规则，其主要组成部分如下
> - **SQL 语句**：要执行的数据库操作
> - **输入映射**：描述如何从 Java 对象提取值，并作为 SQL 语句的参数
> - **输出映射**：描述如何从 SQL 查询结果中提取值，并填充到 Java 对象的属性中

> [!tip] Mapper
> Mapper 是MyBatis的关键概念，它是映射的Java表现形式，提供了类型安全的方式来使用映射。
```java
@Mapper  
@Repository  
public interface UserRepository {  
    @Select("SELECT * FROM users WHERE username = #{id}")  
    public User getUserByUserId(int id);  
}
```

4. 使用 Mapper
```java
@RestController  
public class UserController {  
    @Autowired  
    private UserRepository userRepository;  
  
    // 根据id查找用户  
    @GetMapping("/users/{id}")  
    public User getUserByUsername(@PathVariable("id") int id) {  
        return userRepository.getUserByUserId(id);  
    }  
}
```


## 1.3 注解方式操作数据库
### 简单操作
> [!note] 概述
> 在MyBatis中，注解方式提供了一种更简洁的方法来执行数据库的增删改查操作，避免了配置XML
> MyBatis提供了一系列注解用于处理基本的数据库操作
> - `@Select`：执行查询操作
> - `@Insert`：执行插入操作
> - `@Update`：执行更新（修改）操作
> - `@Delete`：执行删除操作

> [!tip] 参数传递
> 使用MyBatis注解进行 SQL 操作时，有几种常用的参数传递方法可以使参数动态化。下面是一些常用的方法及其概述
> - 当方法参数是基本数据类型或者其包装类，使用`#{参数名}`的形式。如果只有一个参数，可以直接使用`#{value}`
> ```java
> @Select("select * from users where id = #{id}")
> User getUserById(int id);
> ```
> - 对象作为参数：当传递一个对象或 Java Bean 作为参数时，使用`#{对象属性名}`形式引用对象属性
> ```java
> @Insert("insert into users(username,email) values (#{username},#{email})")
> int insertUser(User user)
> ```
> - 多参数传递：当方法有多个参数时，可以使用`@Param`给每个参数命名，然后在 SQL 语句中使用这些名称
> ```java
> @Select("select * from users where username = #{name} and email = #{email}")
> User getUserByNameAndEmail(@Param("name")String username,
> @Param("email") String email)
> ```
> - 通过 Map 传递：使用 Map 传递多个参数，在 SQL 中直接使用 Map 的键
> ```java
> @Select("select * from users where username = #{name} and email = #{email}")
> User getUserByMap(Map<String,Object> map)
> ```

> [!tip] 结果映射
> 尽管很多简单的映射能够自动完成，但是有的时候会遇到更加复杂的映射需求，或者希望更加明确地定义映射规则，此时可以使用`@Results`和`@Result`注解来**实现精确映射**
> 考虑以下Java类，某些字段和数据库字段不匹配
> ```java
> public class User{
> 	private int id;
> 	private String username;
> 	private String emailAddress;
> 	private Date registrationDate;
> 	// getter & setter
> }
> ```
> 为了映射不匹配的字段，可以在接口中使用`@Results`和`@Result`注解
> ```java
> @Mapper
> @Repository
> public interface UserRepository{
> 	@Select("select * from users where id = #{id}")
> 	@Results(
> 		@Result(property = "id",column = "id")
> 		@Result(property = "username",column = "username")
> 		@Result(property = "emailAddress",column = "email")
> 		@Result(property = "registrationDate",column = "registered_date")
> 	)
> 	User getUserById(int id);
> }
> ```
> 在上述代码中，虽然 id 和 username 字段与实体类的名称匹配，但是仍然提供了映射。这是因为当使用`@Results`映射部分字段时，**MyBatis 要求为所有字段提供映射**，否则未映射的字段不会被填充。

### 多表查询
> [!note] 概述
> 在MyBatis中处理多表查询时，`@Results`和`@Result`注解不仅用于简单字段与属性的映射，也可以处理更复杂的情况，如连接查询或嵌套结果。在对象关系映射中，一对多是常见的情形，如一个用户可以有多个订单，而每个订单对应一个用户。

> [!example] 一对多
> 在MyBatis中处理一对多关系的一种常见方法是进行两次查询。首先查询主要实体，然后为每个实体查询相关联的子实体。`@Many`注解在MyBatis中用于处理这种关系
- 订单类
```java
public class Order {  
    private int id;  
    private int userId;  
    private Date orderDate;  
    private BigDecimal amount;  
    // getter & setter
}
```
- 完善User类
```java
public class User {  
    private int id;  
    private String username;  
    private String email;  
    private Date registeredDate;  
    private List<Order> orders;  
    // getter & setter
}
```
- 在接口中实现
```java
@Mapper  
@Repository  
public interface UserRepository {  
    @Select("SELECT * FROM users WHERE id = #{id}")  
    public User getUserByUserId(int id);  
  
    // 查询用户及其所有订单  
    @Select("select * from users where id = #{userId}")  
    @Results({  
            @Result(property = "id", column = "id"),  
            @Result(property = "username", column = "username"),  
            @Result(property = "email", column = "email"),  
            @Result(property = "registeredDate", column = "registered_date"),  
            @Result(property = "orders", javaType = Select.List.class, column = "id", many = @Many(select = "getOrderByUserId"))  
    })    
    User getUserWithOrders(int userId);  
    
    // 根据用户id获取所有订单  
    @Select("select * from orders where user_id = #{userId}")  
    List<Order> getOrderByUserId(int userId);  
}
```

> [!example] 一对一
> 在一对一关系中，可以使用`@One`注解来处理
- 完善Order类
```java
public class Order {  
    private int id;  
    private int userId;  
    private Date orderDate;  
    private BigDecimal amount;  
    private User user;  
    // getter & setter
}
```
- 创建OrderRepository接口
```java
@Mapper  
@Repository  
public interface OrderRepository {  
    @Select("SELECT * FROM orders WHERE id = #{orderId}")  
    @Results({  
            @Result(property = "id", column = "id"),  
            @Result(property = "orderDate",column = "order_date"),  
            @Result(property = "amount",column = "amount"),  
            @Result(property = "user",column = "user_id", one = @One (select = "com.example.filmreview_java.repository.UserRepository.getUserByUserId"))  
    })    
    Order getOrderById(int orderId);  
}
```


## 1.4 XML方式操作数据库
> [!tip] 配置
> 首先需要在properties文件中编写一行配置：
> ```properties
> mybatis.mapper-locations = classpath:repository/*.xml
> ```
> 这个配置的作用如下：
> - **指定映射文件位置**：上述配置指示MyBatis 从 resources/repository 目录中加载左右的xml映射文件
> - **项目资源文件约定**：在SpringBoot项目中，通常的约定是将资源文件放在 src/main/resources目录下
> - **类路径包含**：当项目启动时，SpringBoot会从 src/main/resources/目录加载资源文件，包括MyBatis的XML映射文件。这些文件随后会被包含在构建输出的 target/classes/repository/目录中，成为类路径的一部分，这也是为什么配置路径以 classpath 开头的原因

### 简单操作
> [!summary] CURD 标签
> 在 MyBatis 的 XML 映射方式中，专门提供了一系列标签来执行 CURD 操作：
> - `<select>`：用于查询操作
> - `<insert>`：用于插入操作
> - `<update>`：用于更新数据
> - `<delete>`：用于删除操作
> 
> 在 XML 映射中，resultType 和 parameterType 是两个特有的属性，用于指定查询结果的Java类型和传递给 SQL 语句的参数类型，它们在注解方式中没有直接对应
> - **resultType**：指定查询结果应映射到的Java类型，可以是基本数据类型，JavaBean，集合或其它任何Java类型
> - **parameterType**：定义传递给 SQL 语句的参数的Java类型，告诉 MyBatis 参数的预期类型，从而使其能够正确处理和映射这些参数。

> [!note] 编写接口
> 与注解方式不同，需要为每个接口创建一个XML 文件来定义 SQL 语句和结果映射
> 首先在 resources/mapper/目录下创建一个名为 UserMapper.xml 文件，并在其中定义 SQL 和映射规则
```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE mapper  
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.filmreview_java.repository.UserRepository">  
    <select id="getUserByUserId" resultType="com.example.filmreview_java.entity.User">  
        SELECT * FROM users WHERE id = #{id}  
    </select>  
    <resultMap id="UserWithOrdersMap" type="com.example.filmreview_java.entity.User">  
        <id property="id" column="id"/>  
        <result property="username" column="username"/>  
        <result property="email" column="email"/>  
        <result property="registeredDate" column="registered_date"/>  
        <collection property="orders" ofType="com.example.filmreview_java.entity.Order" select="getOrderByUserId" column="id"/>  
    </resultMap>  
    <select id="getUserWithOrders" resultMap="UserWithOrdersMap">  
        SELECT * FROM users WHERE id = #{userId}  
    </select>  
  
    <select id="getOrderByUserId" resultType="com.example.filmreview_java.entity.Order">  
        SELECT * FROM orders WHERE user_id = #{userId}  
    </select>  
</mapper>
```
> [!danger] 特别注意！！
> - 简单映射用 select，复杂映射使用 resultMap
> - 在编写 resultType 字段时，**必须使用完整的类路径**，否则程序会出错！

> [!note] 启动类
> 使用`@MapperScan`注解来启动MyBatis Mapper接口的自动扫描
> ```java
>@SpringBootApplication  
>@MapperScan("com.example.filmreview_java.repository")  
>public class FilmReviewJavaApplication {
>    public static void main(String[] args) {  
>        SpringApplication.run(FilmReviewJavaApplication.class, args);  
>    }
>}
> ```


### 多表查询
> [!summary] 操作说明
> 在 MyBatis 的 XML 配置中，对于多表查询
> - 使用`<association>`标签来处理一对一的关系
> - 使用`<collection>`标签来处理一对多的关系

> [!example] 一对多
```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE mapper  
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.filmreview_java.repository.UserRepository">  
    <resultMap id="UserWithOrdersMap" type="com.example.filmreview_java.entity.User">  
        <id property="id" column="id"/>  
        <result property="username" column="username"/>  
        <result property="email" column="email"/>  
        <result property="registeredDate" column="registered_date"/>  
        <collection property="orders" ofType="com.example.filmreview_java.entity.Order" select="getOrderByUserId" column="id"/>  
    </resultMap>  
    <select id="getUserWithOrders" resultMap="UserWithOrdersMap">  
        SELECT * FROM users WHERE id = #{userId}  
    </select>  
</mapper>
```

> [!example] 一对一
```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE mapper  
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.filmreview_java.repository.UserRepository">  
    <resultMap id="OrderWithUserMap" type="com.example.filmreview_java.entity.Order">   
<id property="id" column="id"/>  
        <result property="orderDate" column="order_date"/>  
        <result property="amount" column="amount"/>  
        <association property="user" javaType="com.example.filmreview_java.entity.User">  
            <id property="id" column="user_id"/>  
            <result property="username" column="username"/>  
            <result property="email" column="email"/>  
            <result property="registeredDate" column="registered_date"/>  
        </association>  
    </resultMap>  
    <select id="findOrderWithUser" resultMap="OrderWithUserMap">  
        SELECT * FROM orders WHERE user_id = #{userId}  
    </select>  
</mapper>
```

> [!summary] 对比注解方式和XML方式操作数据库
> ## ***优劣对比***
> 1. 注解方式
> 	- 优势
> 		- *简洁直观*：直接在接口方法上编写 SQL 语句，便于快速开发简单查询
> 		- *类型安全*：编译时即可发现部分错误
> 		- *集中管理*：SQL 与业务逻辑在同一位置，便于理解
> 	- 劣势
> 		- **复杂 SQL 难以维护**：对于复杂的动态SQL或者嵌套查询，注解方式会显得臃肿
> 		- **可读性差**：当 SQL 语句较长时，注解会变得难以阅读和维护
> 		- **版本控制困难**：SQL 的变更不容易在版本控制系统中清洗体现
> 		- **功能受限**：某些高级特性（缓存，复杂结果映射）不如XML灵活
> 2. XML 方式
> 	- 优势
> 		- *结构清晰*：SQL 语句独立于 Java代码，便于维护和管理
> 		- *支持复杂SQL*：可以轻松处理复杂的动态 SQL 和嵌套查询
> 		- *易于调试*：SQL 语句集中存放，方便测试和优化
> 		- *功能完整*：支持MyBatis的所有特性，包括高级映射，缓存等
> 	- 劣势
> 		- **配置繁琐**：需要额外的xml文件
> 		- **类型不安全**：运行时才能发现SQL语法错误
> 		- **文件数量增加**：随着业务增长，xml文件的内容也会随之增多
> 
> ## ***最佳实践--混合使用两种方法***
> - 简单场景使用注解，复杂场景使用XML
> - 可以通过MyBatis 的一级、二级缓存提高性能


--- 

# 2. MyBatis-Plus的基本使用
> [!note] MyBatis-Plus的背景
> 在前面的章节中，我们讨论了MyBatis在SpringBoot项目中的应用，它为复杂的数据库交互过程提供了强大而灵活的支持，但随着项目的扩展，开发者会编写很多标准的增删改查的SQL语句，此外，一些如分页，主键生成以及逻辑删除等功能往往还需要额外的配置和编写。为了解决这些问题，MyBatis-Plus应运而生。
## 2.1 配置与使用
> [!note] 概述
> MyBatis-Plus 是一个基于 MyBatis 的增强工具，致力于简化 MyBatis 的使用，在 MyBatis 的基础上只做增强不做改变。它继承了 MyBatis 的所有优秀特性，同时为开发者提供了更简洁高效的操作功能。其核心特性如下
> - **自动 CURD 操作**：MyBatis-Plus 集成了通用的 Mapper 和 Service，使得单表查询 CURD 操作变得简洁高效，其条件构造器可以轻松应对多变的查询需求
> - **完全无侵入**：MyBatis-Plus 仅在 MyBatis 的功能上进行增强，对原有的 MyBatis 内容没有任何影响
> - **灵活的主键生成**：支持多种主键生成策略，包括自增，UUID，雪花算法等
> - **分页插件**：原生支持物理分页查询，开发者只需要传递分页参数，无需编写分页 SQL
> - **内置代码生成器**：采用代码或 Maven 插件可以快速生成 Mapper、Model、Service、Controller层代码，支持模板引擎

> [!summary] 配置
> ## 首先需要添加Mybatis-Plus的依赖
> ```xml
><dependency>   
><groupId>com.baomidou</groupId>  
>    <artifactId>mybatis-plus-spring-boot-autoconfigure</artifactId>  
>    <version>3.5.7</version>  
></dependency>
> ```


## 2.2 核心功能


## 2.3 分页插件


## 2.4 代码生成器





