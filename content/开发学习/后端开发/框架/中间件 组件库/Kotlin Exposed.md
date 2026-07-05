---
title: "Kotlin Exposed"
date: 2026-04-28
tags:
  - 开发学习
  - 开发学习/后端开发/框架
---

> [!tip] 相关内容
> [[Kotlin知识点快速梳理|Kotlin]]、[[MySQL知识点梳理|MySQL]]

# 0. 概述

> [!note] Exposed
> Exposed 是 JetBrains 推出的 Kotlin SQL 框架。它提供类型安全的 SQL DSL，也提供 DAO API。项目可以根据控制力、抽象程度和团队习惯选择不同用法。

Exposed的主要能力：

- 使用Kotlin DSL构造SQL
- 使用DAO方式映射数据库表和实体
- 支持事务管理
- 支持JDBC与R2DBC访问模型
- 支持多种常见关系型数据库

> [!warning] 注意
> Exposed不是MyBatis的Kotlin语法糖。它更强调以Kotlin类型系统构造查询；复杂SQL、索引设计和事务边界仍然需要开发者理解数据库本身。
>
> Exposed 1.x之后包名带有`org.jetbrains.exposed.v1`命名空间。旧版本教程中常见的`org.jetbrains.exposed.sql.*`需要按当前版本迁移。

---

# 1. Exposed使用

## 1.1 依赖导入

JDBC方式常见依赖如下：

```kotlin
dependencies {
    implementation("org.jetbrains.exposed:exposed-core:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-dao:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-java-time:$exposed_version")
    implementation("com.mysql:mysql-connector-j:$mysql_version")
}
```

R2DBC方式需要选择对应模块和驱动：

```kotlin
dependencies {
    implementation("org.jetbrains.exposed:exposed-core:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-r2dbc:$exposed_version")
}
```

## 1.2 表结构声明

```kotlin
import org.jetbrains.exposed.v1.core.Table

object Users : Table("users") {
    val id = long("id").autoIncrement()
    val username = varchar("username", 64)
    val email = varchar("email", 128)

    override val primaryKey = PrimaryKey(id)
}
```

> [!tip] 说明
> `object`表示表结构在应用中是单例。字段使用Kotlin属性声明后，后续查询可以直接引用这些属性，避免大量字符串字段名。

## 1.3 连接数据库

```kotlin
import org.jetbrains.exposed.v1.jdbc.Database

Database.connect(
    url = "jdbc:mysql://localhost:3306/demo",
    driver = "com.mysql.cj.jdbc.Driver",
    user = "root",
    password = "password"
)
```

> [!warning] 注意
> 示例中的账号密码只用于说明。真实项目应通过配置文件、环境变量或密钥管理系统注入。

## 1.4 事务

Exposed DSL和DAO操作通常运行在事务中：

```kotlin
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

transaction {
    // DSL或DAO操作
}
```

> [!summary] 事务原则
>
> - 事务范围要短
> - 不要在事务中执行耗时网络调用
> - 服务端异步框架中不要在事件循环线程执行阻塞式JDBC事务
> - R2DBC场景使用对应的`suspendTransaction`

---

# 2. DSL API

## 2.1 新增数据

```kotlin
transaction {
    Users.insert {
        it[username] = "tom"
        it[email] = "tom@example.com"
    }
}
```

## 2.2 查询数据

```kotlin
transaction {
    Users
        .select(Users.id, Users.username, Users.email)
        .where { Users.username eq "tom" }
        .forEach { row ->
            println(row[Users.email])
        }
}
```

## 2.3 修改数据

```kotlin
transaction {
    Users.update({ Users.username eq "tom" }) {
        it[email] = "tom.new@example.com"
    }
}
```

## 2.4 删除数据

```kotlin
transaction {
    Users.deleteWhere { username eq "tom" }
}
```

---

# 3. DAO API

> [!note] 概述
> DAO API 更接近传统ORM写法，适合围绕实体对象进行增删改查。它抽象程度更高，但对复杂查询的控制力弱于DSL。

```kotlin
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import org.jetbrains.exposed.v1.dao.LongEntity
import org.jetbrains.exposed.v1.dao.LongEntityClass

object UserTable : LongIdTable("users") {
    val username = varchar("username", 64)
    val email = varchar("email", 128)
}

class UserEntity(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<UserEntity>(UserTable)

    var username by UserTable.username
    var email by UserTable.email
}
```

```kotlin
transaction {
    val user = UserEntity.new {
        username = "tom"
        email = "tom@example.com"
    }

    println(user.id.value)
}
```

---

# 4. 使用建议

> [!summary] 选型建议
>
> - 查询复杂、需要贴近SQL：优先DSL API
> - 简单实体增删改查：可以使用DAO API
> - 使用Ktor/Vert.x等非阻塞框架：谨慎使用JDBC版Exposed，必要时放到专门线程池或选择R2DBC
> - 与Spring事务集成：明确事务边界，不要在多个事务体系之间混用而不加控制

> [!warning] 常见误区
>
> - 把Exposed当作“自动优化SQL”的工具
> - 在事件循环线程中执行JDBC事务
> - 在事务内做HTTP调用或长时间计算
> - 忽略数据库迁移工具，直接依赖代码自动建表
