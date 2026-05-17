---
title: "Go知识点快速梳理"
date: 2025-01-01
tags: []
---

# 0.Go语言概述

## 0.1 Go语言简介

Go语言（又称Golang）是由Google开发的一种**静态类型、编译型**编程语言。它旨在简化软件开发，提高开发效率，同时保持高性能。

### Go语言的工作原理

1. **编译过程**：
   - 源代码 → 词法分析 → 语法分析 → 抽象语法树 → 中间代码 → 机器码
   - 编译速度极快，远超C++和Java
   - 生成的可执行文件包含所有依赖，部署简单

2. **运行时环境**：
   - 无需虚拟机（如JVM），直接在操作系统上运行
   - 内置垃圾回收机制（GC）
   - 支持并发编程（goroutine和channel）

### Go语言的核心优势

| 优势 | 说明 | 实际应用 |
|------|------|----------|
| **简洁性** | 语法简单，关键字少（仅25个） | 易于学习和维护 |
| **并发支持** | 内置goroutine和channel | 高并发服务器开发 |
| **编译速度快** | 编译速度远超C++和Java | 快速迭代开发 |
| **静态链接** | 生成的可执行文件包含所有依赖 | 部署简单，无需安装运行时 |
| **垃圾回收** | 自动内存管理，避免内存泄漏 | 长期运行的服务 |
| **强大标准库** | 覆盖网络、文件、加密等常用功能 | 减少第三方依赖 |
| **工具链完善** | go fmt、go test等工具提高开发效率 | 代码质量和测试保障 |

### Go语言与其他语言的主要区别

| 特性 | C/C++ | Java | Go |
|------|-------|------|-----|
| **编译方式** | 编译为机器码 | 编译为字节码 | 编译为机器码 |
| **内存管理** | 手动管理 | 垃圾回收 | 垃圾回收 |
| **并发模型** | 线程/进程 | 线程/协程 | Goroutine |
| **错误处理** | 异常机制 | 异常机制 | 错误返回值 |
| **泛型支持** | 模板/宏 | 泛型(JDK5+) | 泛型(1.18+) |
| **面向对象** | 类/继承 | 类/继承/接口 | 结构体/接口 |
| **指针支持** | 支持指针 | 无指针(引用) | 支持指针 |

> [!note] 学习建议
> 1. 理解Go的并发模型（Goroutine和Channel）
> 2. 掌握错误处理机制（错误返回值而非异常）
> 3. 熟悉Go的接口和组合模式（而非继承）
> 4. 学习Go的工具链（go fmt、go test等）
> 5. 了解Go的内存模型和垃圾回收机制

---

# 1.基本内容

## 1.1 Go关键字

Go语言有一套简洁的关键字集合：

### 声明相关
- `var` - 变量声明
- `const` - 常量声明
- `func` - 函数声明
- `type` - 类型声明
- `struct` - 结构体声明
- `interface` - 接口声明
- `package` - 包声明
- `import` - 导入包

### 控制流
- `if` - 条件判断
- `else` - 否则分支
- `for` - 循环
- `switch` - 多分支选择
- `case` - switch分支
- `default` - 默认分支
- `break` - 跳出循环
- `continue` - 继续下一次循环
- `return` - 返回
- `goto` - 跳转

### 并发相关
- `go` - 启动goroutine
- `chan` - 声明通道
- `select` - 通道选择

### 其他
- `defer` - 延迟执行
- `map` - 声明映射
- `range` - 迭代
- `make` - 创建引用类型
- `new` - 创建值类型
- `nil` - 空值
- `true` - 真值
- `false` - 假值

> [!tip] 关键字记忆技巧
> Go的关键字数量少（仅25个），比Java（50+）和C++（90+）少很多，这使得Go语言更加简洁易学。

## 1.2 变量

Go语言中的变量分为**值类型**和**引用类型**。

### 声明方式

#### 1. 使用var关键字

```go
// 方式1: 指定类型
var age int = 25

// 方式2: 类型推断（推荐）
var name string = "张三"
var height = 175.5  // 自动推断为float64

// 方式3: 批量声明
var (
    city string = "北京"
    score float64 = 95.5
    isStudent bool = true
)
```

#### 2. 短变量声明（:=）

```go
// 短变量声明，自动推断类型
age := 25
name := "李四"
height := 180.0

// 多个变量同时声明
x, y := 10, 20
```

> [!note] 注意事项
> - 短变量声明只能用于函数内部
> - 左侧必须至少有一个新变量
> - 重复声明会编译错误

### 变量作用域

```go
package main

import "fmt"

var globalVar = "全局变量"  // 包级别变量

func main() {
    localVar := "局部变量"  // 函数级别变量
    
    if condition := true; condition {  // if语句块级别变量
        blockVar := "块级变量"
        fmt.Println(blockVar)
    }
    
    fmt.Println(globalVar)  // 可以访问
    fmt.Println(localVar)   // 可以访问
    // fmt.Println(blockVar) // 编译错误：未定义
}
```

## 1.3 基本类型

### 整数类型

| 类型 | 字节 | 取值范围 | 说明 |
|------|------|----------|------|
| `int8` | 1 | -128 ~ 127 | 有符号8位整数 |
| `int16` | 2 | -32768 ~ 32767 | 有符号16位整数 |
| `int32` | 4 | -2^31 ~ 2^31-1 | 有符号32位整数 |
| `int64` | 8 | -2^63 ~ 2^63-1 | 有符号64位整数 |
| `uint8` | 1 | 0 ~ 255 | 无符号8位整数 |
| `uint16` | 2 | 0 ~ 65535 | 无符号16位整数 |
| `uint32` | 4 | 0 ~ 2^32-1 | 无符号32位整数 |
| `uint64` | 8 | 0 ~ 2^64-1 | 无符号64位整数 |
| `int` | 4或8 | 平台相关 | 通常与平台字长相同 |
| `uint` | 4或8 | 平台相关 | 通常与平台字长相同 |

### 浮点数类型

| 类型 | 字节 | 精度 | 说明 |
|------|------|------|------|
| `float32` | 4 | 约6-7位小数 | 单精度浮点数 |
| `float64` | 8 | 约15-16位小数 | 双精度浮点数（推荐） |

### 字符串类型

```go
// 字符串声明
str1 := "Hello, World!"
str2 := `多行字符串
可以换行
保持格式`

// 字符串操作
length := len(str1)  // 获取长度
sub := str1[0:5]     // 切片操作
concat := str1 + str2 // 字符串连接

// 常用函数
import "strings"
result := strings.Contains(str1, "World")  // 是否包含
result := strings.HasPrefix(str1, "Hello")  // 是否前缀
result := strings.HasSuffix(str1, "World!") // 是否后缀
```

### 布尔类型

```go
var isTrue bool = true
var isFalse bool = false

// 逻辑运算
result := isTrue && isFalse  // 与
result := isTrue || isFalse  // 或
result := !isTrue            // 非
```

## 1.4 类型转换

Go语言要求显式类型转换，不能隐式转换。

```go
// 数值类型转换
var a int = 10
var b float64 = float64(a)  // int转float64

var c float64 = 3.14
var d int = int(c)          // float64转int（截断小数）

// 字符串转换
import "strconv"

// 数值转字符串
str := strconv.Itoa(123)           // int转string
str := strconv.FormatFloat(3.14, 'f', 2, 64)  // float转string

// 字符串转数值
num, err := strconv.Atoi("123")    // string转int
f, err := strconv.ParseFloat("3.14", 64)  // string转float
```

## 1.5 指针

Go语言支持指针，但比C/C++更安全。

### 指针声明和使用

```go
package main

import "fmt"

func main() {
    var num int = 10
    var ptr *int = &num  // 声明指针，指向num的地址
    
    fmt.Println("num的值:", num)        // 输出: 10
    fmt.Println("num的地址:", &num)     // 输出: 内存地址
    fmt.Println("ptr的值:", ptr)        // 输出: 同&num
    fmt.Println("ptr指向的值:", *ptr)    // 输出: 10
    
    // 通过指针修改值
    *ptr = 20
    fmt.Println("修改后num的值:", num)   // 输出: 20
}
```

### 指针作为函数参数

```go
// 值传递（不修改原值）
func incrementByValue(x int) {
    x++
}

// 引用传递（修改原值）
func incrementByPointer(x *int) {
    *x++
}

func main() {
    num := 10
    incrementByValue(num)
    fmt.Println(num)  // 输出: 10（未改变）
    
    incrementByPointer(&num)
    fmt.Println(num)  // 输出: 11（已改变）
}
```

> [!note] 指针使用建议
> - Go的指针比C/C++更安全，不能进行指针运算
> - 使用`new()`函数创建指针：`ptr := new(int)`
> - 避免过度使用指针，优先考虑值传递

## 1.6 零值

Go语言中，变量声明后会自动初始化为零值。

| 类型 | 零值 |
|------|------|
| 数值类型 | 0 |
| 布尔类型 | false |
| 字符串 | ""（空字符串） |
| 指针 | nil |
| 切片 | nil |
| 映射 | nil |
| 通道 | nil |
| 接口 | nil |
| 函数 | nil |

```go
package main

import "fmt"

func main() {
    var num int           // 零值: 0
    var str string        // 零值: ""
    var flag bool         // 零值: false
    var ptr *int          // 零值: nil
    var slice []int       // 零值: nil
    var m map[string]int  // 零值: nil
    
    fmt.Printf("num: %v\n", num)      // num: 0
    fmt.Printf("str: %q\n", str)      // str: ""
    fmt.Printf("flag: %v\n", flag)    // flag: false
    fmt.Printf("ptr: %v\n", ptr)      // ptr: <nil>
    fmt.Printf("slice: %v\n", slice)  // slice: []
    fmt.Printf("m: %v\n", m)          // m: map[]
}
```

## 1.7 字符串

### 字符串基础

```go
// 字符串声明
s1 := "Hello"
s2 := `多行字符串
可以换行
保持格式`

// 字符串长度
length := len(s1)  // 5

// 字符串切片
sub := s1[0:2]  // "He"
sub := s1[:3]   // "Hel"
sub := s1[2:]   // "llo"

// 字符串连接
s3 := s1 + " " + "World"  // "Hello World"
```

### 字符串常用函数

```go
import "strings"

s := "Hello, World!"

// 查找
strings.Contains(s, "World")    // true: 是否包含
strings.HasPrefix(s, "Hello")   // true: 是否前缀
strings.HasSuffix(s, "World!")  // true: 是否后缀
strings.Index(s, "World")       // 7: 子串位置
strings.LastIndex(s, "o")       // 8: 最后出现位置

// 替换
strings.Replace(s, "Hello", "Hi", 1)  // "Hi, World!" (替换1次)
strings.ReplaceAll(s, "o", "0")       // "Hell0, W0rld!" (替换所有)

// 分割和连接
parts := strings.Split(s, ", ")  // ["Hello", "World!"]
joined := strings.Join(parts, " - ")  // "Hello - World!"

// 大小写转换
strings.ToUpper(s)  // "HELLO, WORLD!"
strings.ToLower(s)  // "hello, world!"

// 去除空格
trimmed := strings.TrimSpace("  hello  ")  // "hello"
```

## 1.8 切片（Slice）

切片是Go语言中动态数组的实现，比数组更灵活。

### 切片声明

```go
// 方式1: 使用make
slice1 := make([]int, 5)        // 长度5，容量5
slice2 := make([]int, 5, 10)    // 长度5，容量10

// 方式2: 字面量
slice3 := []int{1, 2, 3, 4, 5}

// 方式3: 从数组切片
arr := [5]int{1, 2, 3, 4, 5}
slice4 := arr[1:4]  // [2, 3, 4]

// 方式4: 从另一个切片切片
slice5 := slice3[1:3]  // [2, 3]
```

### 切片操作

```go
slice := []int{1, 2, 3, 4, 5}

// 追加元素
slice = append(slice, 6)  // [1, 2, 3, 4, 5, 6]
slice = append(slice, 7, 8, 9)  // 追加多个

// 复制切片
newSlice := make([]int, len(slice))
copy(newSlice, slice)

// 遍历切片
for index, value := range slice {
    fmt.Printf("索引: %d, 值: %d\n", index, value)
}
```

### 切片底层原理

切片包含三个部分：
1. **指针**：指向底层数组的起始位置
2. **长度**：切片中元素的个数
3. **容量**：从起始位置到底层数组末尾的元素个数

```go
slice := make([]int, 5, 10)
// 长度: 5, 容量: 10

// 切片扩容
slice = append(slice, 6, 7, 8, 9, 10)
// 长度: 10, 容量: 10

slice = append(slice, 11)
// 长度: 11, 容量: 20 (自动扩容)
```

## 1.9 映射（Map）

映射是键值对的集合，类似于其他语言的字典或哈希表。

### 映射声明

```go
// 方式1: 使用make
m1 := make(map[string]int)
m1["age"] = 25

// 方式2: 字面量
m2 := map[string]int{
    "age":    25,
    "height": 175,
    "weight": 70,
}

// 方式3: 空映射
var m3 map[string]int
```

### 映射操作

```go
m := map[string]int{
    "age":    25,
    "height": 175,
}

// 访问元素
age := m["age"]  // 25

// 检查键是否存在
age, exists := m["weight"]
if exists {
    fmt.Println("weight存在:", age)
} else {
    fmt.Println("weight不存在")
}

// 添加/修改元素
m["score"] = 95  // 添加
m["age"] = 26    // 修改

// 删除元素
delete(m, "height")

// 遍历映射（顺序随机）
for key, value := range m {
    fmt.Printf("%s: %d\n", key, value)
}

// 获取长度
length := len(m)
```

> [!note] 映射注意事项
> - 映射的键必须是可比较类型（不能是切片、映射、函数）
> - 映射的值可以是任意类型
> - 映射是引用类型，赋值会共享底层哈希表
> - 映射的零值是nil，不能直接使用，需要先初始化

## 1.10 函数定义

### 基本函数

```go
// 无参数无返回值
func greet() {
    fmt.Println("Hello!")
}

// 有参数
func add(a, b int) int {
    return a + b
}

// 调用函数
greet()
result := add(3, 5)  // 8
```

### 多返回值

```go
// 返回多个值
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("除数不能为零")
    }
    return a / b, nil
}

// 调用
result, err := divide(10, 2)
if err != nil {
    fmt.Println("错误:", err)
} else {
    fmt.Println("结果:", result)
}
```

### 命名返回值

```go
func calculate(a, b int) (sum, product int) {
    sum = a + b
    product = a * b
    return  // 直接返回，无需指定值
}
```

### 可变参数

```go
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

// 调用
result := sum(1, 2, 3)        // 6
result := sum(1, 2, 3, 4, 5)  // 15
```

### 匿名函数

```go
// 定义匿名函数
add := func(a, b int) int {
    return a + b
}

// 调用
result := add(3, 5)  // 8

// 立即执行
result := func(a, b int) int {
    return a + b
}(3, 5)  // 8
```

### 闭包

```go
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

// 使用
c := counter()
fmt.Println(c())  // 1
fmt.Println(c())  // 2
fmt.Println(c())  // 3
```

## 1.11 控制流

### if语句

```go
// 基本if
age := 20
if age >= 18 {
    fmt.Println("成年人")
}

// if-else
if age >= 18 {
    fmt.Println("成年人")
} else {
    fmt.Println("未成年人")
}

// if-else if-else
score := 85
if score >= 90 {
    fmt.Println("优秀")
} else if score >= 80 {
    fmt.Println("良好")
} else if score >= 60 {
    fmt.Println("及格")
} else {
    fmt.Println("不及格")
}

// if带初始化语句
if num := 10; num > 5 {
    fmt.Println("num大于5")
}
```

### switch语句

```go
// 基本switch
day := "Monday"
switch day {
case "Monday":
    fmt.Println("星期一")
case "Tuesday":
    fmt.Println("星期二")
default:
    fmt.Println("其他")
}

// 多case
num := 3
switch num {
case 1, 2, 3:
    fmt.Println("1, 2, 或 3")
case 4, 5, 6:
    fmt.Println("4, 5, 或 6")
default:
    fmt.Println("其他")
}

// 无表达式switch（相当于if-else if）
score := 85
switch {
case score >= 90:
    fmt.Println("优秀")
case score >= 80:
    fmt.Println("良好")
case score >= 60:
    fmt.Println("及格")
default:
    fmt.Println("不及格")
}

// fallthrough（穿透）
num := 1
switch num {
case 1:
    fmt.Println("case 1")
    fallthrough  // 继续执行下一个case
case 2:
    fmt.Println("case 2")
}
// 输出: case 1, case 2
```

### for循环

```go
// 1. 标准for循环
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// 2. while风格（省略初始化和后置）
i := 0
for i < 5 {
    fmt.Println(i)
    i++
}

// 3. 无限循环
for {
    fmt.Println("无限循环")
    break  // 需要手动退出
}

// 4. range遍历
slice := []int{1, 2, 3, 4, 5}
for index, value := range slice {
    fmt.Printf("索引: %d, 值: %d\n", index, value)
}

// 只需要值
for _, value := range slice {
    fmt.Println(value)
}

// 只需要索引
for index := range slice {
    fmt.Println(index)
}

// 遍历映射
m := map[string]int{"a": 1, "b": 2}
for key, value := range m {
    fmt.Printf("%s: %d\n", key, value)
}

// 遍历字符串
for index, rune := range "Hello" {
    fmt.Printf("索引: %d, 字符: %c\n", index, rune)
}
```

### defer语句

defer用于延迟执行函数，通常用于资源清理。

```go
package main

import "fmt"

func main() {
    defer fmt.Println("最后执行")
    defer fmt.Println("倒数第二")
    fmt.Println("首先执行")
    // 输出: 首先执行, 倒数第二, 最后执行
}

// 实际应用：文件操作
func readFile(filename string) {
    file, err := os.Open(filename)
    if err != nil {
        return
    }
    defer file.Close()  // 确保文件被关闭
    
    // 读取文件内容
    // ...
}
```

> [!note] defer特点
> - defer语句会在函数返回前执行
> - 多个defer按后进先出（LIFO）顺序执行
> - defer的参数在定义时立即求值，但执行延迟

---

# 2.进阶内容--面向对象和函数式编程

## 2.1 结构体和方法

### 结构体定义

```go
// 定义结构体
type Person struct {
    Name   string
    Age    int
    Height float64
    Weight float64
}

// 创建结构体实例
// 方式1: 字面量
p1 := Person{
    Name:   "张三",
    Age:    25,
    Height: 175.5,
    Weight: 70.0,
}

// 方式2: new关键字
p2 := new(Person)
p2.Name = "李四"
p2.Age = 30

// 方式3: 声明后赋值
var p3 Person
p3.Name = "王五"
p3.Age = 28
```

### 方法定义

```go
// 为结构体定义方法
func (p Person) SayHello() {
    fmt.Printf("你好，我是%s，今年%d岁\n", p.Name, p.Age)
}

// 指针接收者（可以修改结构体）
func (p *Person) Birthday() {
    p.Age++
}

// 使用
p := Person{Name: "张三", Age: 25}
p.SayHello()      // 你好，我是张三，今年25岁
p.Birthday()      // 年龄加1
p.SayHello()      // 你好，我是张三，今年26岁
```

### 结构体嵌套

```go
type Address struct {
    City    string
    Country string
}

type Employee struct {
    Person
    EmployeeID string
    Address    // 匿名嵌套
}

// 使用
emp := Employee{
    Person: Person{
        Name: "张三",
        Age:  30,
    },
    EmployeeID: "EMP001",
    Address: Address{
        City:    "北京",
        Country: "中国",
    },
}

fmt.Println(emp.Name)        // 访问嵌套字段
fmt.Println(emp.City)        // 访问匿名嵌套字段
emp.SayHello()               // 调用嵌套方法
```

## 2.2 接口

### 接口定义

```go
// 定义接口
type Speaker interface {
    Speak() string
}

// 实现接口（无需显式声明）
type Person struct {
    Name string
}

func (p Person) Speak() string {
    return fmt.Sprintf("我是%s", p.Name)
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return fmt.Sprintf("%s: 汪汪!", d.Name)
}

// 使用接口
func introduce(s Speaker) {
    fmt.Println(s.Speak())
}

func main() {
    p := Person{Name: "张三"}
    d := Dog{Name: "旺财"}
    
    introduce(p)  // 我是张三
    introduce(d)  // 旺财: 汪汪!
}
```

### 空接口

```go
// 空接口可以接收任何类型
var i interface{}

i = 42           // int
i = "hello"      // string
i = true         // bool
i = []int{1, 2}  // slice

// 类型断言
value, ok := i.(int)
if ok {
    fmt.Println("是int类型:", value)
}

// 类型switch
switch v := i.(type) {
case int:
    fmt.Println("int:", v)
case string:
    fmt.Println("string:", v)
default:
    fmt.Println("其他类型")
}
```

## 2.3 错误处理

Go语言使用错误返回值而非异常机制。

### 基本错误处理

```go
import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("除数不能为零")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("错误:", err)
        return
    }
    fmt.Println("结果:", result)
}
```

### 自定义错误

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("字段 %s: %s", e.Field, e.Message)
}

func validateAge(age int) error {
    if age < 0 {
        return &ValidationError{Field: "age", Message: "年龄不能为负数"}
    }
    if age > 150 {
        return &ValidationError{Field: "age", Message: "年龄不能超过150"}
    }
    return nil
}
```

### panic和recover

```go
func riskyOperation() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("从panic中恢复:", r)
        }
    }()
    
    panic("发生严重错误")
}

func main() {
    riskyOperation()
    fmt.Println("程序继续执行")
}
```

## 2.4 并发编程

### Goroutine

```go
func sayHello() {
    fmt.Println("Hello from goroutine!")
}

func main() {
    go sayHello()  // 启动goroutine
    time.Sleep(1 * time.Second)  // 等待goroutine执行
}
```

### Channel

```go
// 创建channel
ch := make(chan int)

// 发送数据
go func() {
    ch <- 42  // 发送数据
}()

// 接收数据
value := <-ch  // 接收数据
fmt.Println(value)  // 42
```

### 带缓冲的Channel

```go
ch := make(chan int, 3)  // 缓冲大小为3

ch <- 1
ch <- 2
ch <- 3
// ch <- 4  // 会阻塞，直到有数据被接收

fmt.Println(<-ch)  // 1
fmt.Println(<-ch)  // 2
```

### select语句

```go
ch1 := make(chan int)
ch2 := make(chan string)

go func() {
    ch1 <- 42
}()

go func() {
    ch2 <- "hello"
}()

select {
case v := <-ch1:
    fmt.Println("从ch1接收:", v)
case v := <-ch2:
    fmt.Println("从ch2接收:", v)
case <-time.After(1 * time.Second):
    fmt.Println("超时")
}
```

## 2.5 泛型（Go 1.18+）

### 泛型函数

```go
// Ordered 用类型集合约束可排序类型。
// comparable 只能保证 == 和 !=，不能保证支持 > 或 <。
type Ordered interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
        ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |
        ~float32 | ~float64 | ~string
}

// 泛型函数：T 必须是 Ordered 中列出的底层类型之一
func Max[T Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 使用
maxInt := Max(3, 5)      // 5
maxFloat := Max(3.14, 2.71)  // 3.14
```

### 泛型结构体

```go
type Stack[T any] struct {
    elements []T
}

func (s *Stack[T]) Push(value T) {
    s.elements = append(s.elements, value)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.elements) == 0 {
        var zero T
        return zero, false
    }
    value := s.elements[len(s.elements)-1]
    s.elements = s.elements[:len(s.elements)-1]
    return value, true
}

// 使用
intStack := Stack[int]{}
intStack.Push(1)
intStack.Push(2)
value, _ := intStack.Pop()  // 2
```

---

# 3.标准库常用功能

## 3.1 fmt包（格式化输出）

```go
import "fmt"

// Print系列
fmt.Print("Hello")      // 输出不换行
fmt.Println("Hello")    // 输出并换行
fmt.Printf("Name: %s, Age: %d", "张三", 25)  // 格式化输出

// 格式化动词
// %v  默认格式
// %d  十进制整数
// %f  浮点数
// %s  字符串
// %t  布尔值
// %p  指针地址
// %x  十六进制
```

## 3.2 strings包（字符串操作）

```go
import "strings"

s := "Hello, World!"

// 查找
strings.Contains(s, "World")    // true
strings.HasPrefix(s, "Hello")   // true
strings.HasSuffix(s, "World!")  // true
strings.Index(s, "World")       // 7

// 替换
strings.Replace(s, "Hello", "Hi", 1)  // "Hi, World!"

// 分割和连接
parts := strings.Split(s, ", ")  // ["Hello", "World!"]
joined := strings.Join(parts, " - ")  // "Hello - World!"

// 大小写转换
strings.ToUpper(s)  // "HELLO, WORLD!"
strings.ToLower(s)  // "hello, world!"

// 去除空格
strings.TrimSpace("  hello  ")  // "hello"
```

## 3.3 strconv包（字符串转换）

```go
import "strconv"

// 数值转字符串
str := strconv.Itoa(123)  // "123"
str := strconv.FormatFloat(3.14, 'f', 2, 64)  // "3.14"

// 字符串转数值
num, err := strconv.Atoi("123")  // 123, nil
f, err := strconv.ParseFloat("3.14", 64)  // 3.14, nil
b, err := strconv.ParseBool("true")  // true, nil
```

## 3.4 time包（时间处理）

```go
import "time"

// 获取当前时间
now := time.Now()
fmt.Println(now)  // 2024-01-01 12:00:00 +0800 CST

// 格式化时间
formatted := now.Format("2006-01-02 15:04:05")
fmt.Println(formatted)  // 2024-01-01 12:00:00

// 解析时间
t, err := time.Parse("2006-01-02", "2024-01-01")

// 时间计算
tomorrow := now.Add(24 * time.Hour)
nextWeek := now.AddDate(0, 0, 7)

// 定时器
ticker := time.NewTicker(1 * time.Second)
for range ticker.C {
    fmt.Println("每秒执行一次")
}
```

## 3.5 os包（操作系统交互）

```go
import "os"

// 读取环境变量
home := os.Getenv("HOME")

// 设置环境变量
os.Setenv("MY_VAR", "value")

// 文件操作
file, err := os.Open("file.txt")
if err != nil {
    // 处理错误
}
defer file.Close()

// 创建文件
newFile, err := os.Create("newfile.txt")
defer newFile.Close()

// 读取目录
files, err := os.ReadDir(".")
for _, file := range files {
    fmt.Println(file.Name())
}
```

## 3.6 io包（输入输出）

```go
import "io"
import "os"

// 读取文件
data, err := os.ReadFile("file.txt")
if err != nil {
    // 处理错误
}
fmt.Println(string(data))

// 写入文件
err := os.WriteFile("output.txt", []byte("Hello"), 0644)

// 复制文件
src, _ := os.Open("source.txt")
dst, _ := os.Create("destination.txt")
io.Copy(dst, src)
```

---

# 4.附录

## 4.1 常用命令

```bash
# 初始化模块
go mod init github.com/username/project

# 下载依赖
go mod tidy

# 运行程序
go run main.go

# 编译程序
go build -o myapp main.go

# 运行测试
go test ./...

# 格式化代码
go fmt ./...

# 查看依赖
go list -m all

# 查看帮助
go help
go help <command>
```

## 4.2 推荐资源

- **官方文档**：https://go.dev/doc/
- **Go语言中文网**：https://studygolang.com/
- **Go标准库文档**：https://pkg.go.dev/std
- **Effective Go**：https://go.dev/doc/effective_go
- **Go语言教程**：https://tour.golang.org/

## 4.3 开发工具

- **IDE**：GoLand、VS Code（安装Go插件）
- **代码格式化**：go fmt
- **代码检查**：go vet、golint
- **测试工具**：go test、go bench

## 4.4 最佳实践

1. **代码风格**：使用go fmt统一代码格式
2. **错误处理**：始终检查错误返回值
3. **并发安全**：使用channel或sync包保护共享数据
4. **性能优化**：避免不必要的内存分配，使用性能分析工具
5. **测试驱动**：编写单元测试，使用go test工具

---

> [!note] 学习建议
> 1. 从基础语法开始，逐步深入
> 2. 多写代码，多实践
> 3. 阅读优秀开源项目代码
> 4. 参与社区讨论和贡献
> 5. 持续学习新特性和最佳实践

---

# 5.更多示例代码

## 5.1 完整的Web服务器示例

```go
package main

import (
    "fmt"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", helloHandler)
    fmt.Println("服务器启动在: http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

## 5.2 文件读写示例

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // 写入文件
    content := []byte("Hello, Go!")
    err := os.WriteFile("test.txt", content, 0644)
    if err != nil {
        fmt.Println("写入文件失败:", err)
        return
    }
    
    // 读取文件
    data, err := os.ReadFile("test.txt")
    if err != nil {
        fmt.Println("读取文件失败:", err)
        return
    }
    
    fmt.Println("文件内容:", string(data))
}
```

## 5.3 并发下载示例

```go
package main

import (
    "fmt"
    "net/http"
    "sync"
)

func downloadURL(url string, wg *sync.WaitGroup) {
    defer wg.Done()
    
    resp, err := http.Get(url)
    if err != nil {
        fmt.Printf("下载 %s 失败: %v\n", url, err)
        return
    }
    defer resp.Body.Close()
    
    fmt.Printf("下载 %s 成功，状态码: %d\n", url, resp.StatusCode)
}

func main() {
    urls := []string{
        "https://www.google.com",
        "https://www.github.com",
        "https://www.stackoverflow.com",
    }
    
    var wg sync.WaitGroup
    
    for _, url := range urls {
        wg.Add(1)
        go downloadURL(url, &wg)
    }
    
    wg.Wait()
    fmt.Println("所有下载完成")
}
```

## 5.4 数据库操作示例

```go
package main

import (
    "database/sql"
    "fmt"
    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    ID   int
    Name string
    Age  int
}

func main() {
    // 连接数据库
    db, err := sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/dbname")
    if err != nil {
        fmt.Println("数据库连接失败:", err)
        return
    }
    defer db.Close()
    
    // 查询数据
    rows, err := db.Query("SELECT id, name, age FROM users")
    if err != nil {
        fmt.Println("查询失败:", err)
        return
    }
    defer rows.Close()
    
    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Age); err != nil {
            fmt.Println("扫描数据失败:", err)
            continue
        }
        users = append(users, user)
    }
    
    // 输出结果
    for _, user := range users {
        fmt.Printf("ID: %d, 姓名: %s, 年龄: %d\n", user.ID, user.Name, user.Age)
    }
}
```

## 5.5 JSON处理示例

```go
package main

import (
    "encoding/json"
    "fmt"
)

type Person struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
    City string `json:"city,omitempty"`
}

func main() {
    // 结构体转JSON
    p := Person{Name: "张三", Age: 25, City: "北京"}
    jsonData, err := json.Marshal(p)
    if err != nil {
        fmt.Println("JSON编码失败:", err)
        return
    }
    fmt.Println("JSON:", string(jsonData))
    
    // JSON转结构体
    var p2 Person
    err = json.Unmarshal(jsonData, &p2)
    if err != nil {
        fmt.Println("JSON解码失败:", err)
        return
    }
    fmt.Printf("解码结果: %+v\n", p2)
}
```

---

# 6.常见问题和解决方案

## 6.1 编译错误

### 问题1: 未使用的变量
```go
// 错误
func main() {
    x := 10  // 编译错误：x declared but not used
}

// 正确
func main() {
    x := 10
    fmt.Println(x)
}
```

### 问题2: 类型不匹配
```go
// 错误
var x int = 3.14  // 编译错误：cannot use 3.14 (untyped float constant) as int

// 正确
var x int = int(3.14)
```

## 6.2 运行时错误

### 问题1: 空指针引用
```go
// 错误
var ptr *int
fmt.Println(*ptr)  // 运行时错误：panic: runtime error: invalid memory address or nil pointer dereference

// 正确
var ptr *int
if ptr != nil {
    fmt.Println(*ptr)
}
```

### 问题2: 数组越界
```go
// 错误
arr := [3]int{1, 2, 3}
fmt.Println(arr[3])  // 运行时错误：panic: runtime error: index out of range

// 正确
arr := [3]int{1, 2, 3}
if len(arr) > 3 {
    fmt.Println(arr[3])
}
```

## 6.3 性能问题

### 问题1: 字符串拼接
```go
// 低效方式
result := ""
for i := 0; i < 10000; i++ {
    result += "a"  // 每次都会创建新字符串
}

// 高效方式
var builder strings.Builder
for i := 0; i < 10000; i++ {
    builder.WriteString("a")
}
result := builder.String()
```

### 问题2: 频繁创建切片
```go
// 低效方式
var data [][]int
for i := 0; i < 1000; i++ {
    data = append(data, make([]int, 1000))  // 频繁扩容
}

// 高效方式
data := make([][]int, 1000)
for i := range data {
    data[i] = make([]int, 1000)
}
```

---

# 7.学习路径建议

## 7.1 初级阶段（1-2周）
1. 掌握基本语法和数据类型
2. 理解变量、常量、函数定义
3. 学习控制流语句（if、for、switch）
4. 熟悉切片和映射的使用

## 7.2 中级阶段（2-4周）
1. 深入理解结构体和方法
2. 掌握接口和多态
3. 学习错误处理机制
4. 理解并发编程（goroutine、channel）

## 7.3 高级阶段（1-2个月）
1. 学习泛型编程（Go 1.18+）
2. 掌握标准库的高级用法
3. 理解内存模型和性能优化
4. 学习测试和调试技巧

## 7.4 实战阶段
1. 开发小型项目（如Web服务器、CLI工具）
2. 阅读优秀开源项目代码
3. 参与社区贡献
4. 学习特定领域（如微服务、云原生）

---

# 8.参考资源

## 8.1 官方资源
- [Go官方文档](https://go.dev/doc/)
- [Go语言教程](https://tour.golang.org/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go标准库文档](https://pkg.go.dev/std)

## 8.2 中文资源
- [Go语言中文网](https://studygolang.com/)
- [Go语言教程](https://www.runoob.com/go/go-tutorial.html)
- [Go语言圣经](https://books.studygolang.com/gopl-zh/)

## 8.3 推荐书籍
- 《Go程序设计语言》
- 《Go语言实战》
- 《Go并发编程实战》

## 8.4 开源项目
- [Kubernetes](https://github.com/kubernetes/kubernetes)
- [Docker](https://github.com/moby/moby)
- [Etcd](https://github.com/etcd-io/etcd)
- [Prometheus](https://github.com/prometheus/prometheus)

---

> [!tip] 最后建议
> 1. **多写代码**：理论结合实践，多动手写代码
> 2. **阅读源码**：学习优秀项目的代码风格和设计模式
> 3. **参与社区**：加入Go语言社区，交流学习经验
> 4. **持续学习**：Go语言在不断发展，保持学习新特性
> 5. **享受编程**：Go语言简洁优雅，享受编程的乐趣！

---

# 9.工程化补充

## 9.1 包、模块和目录结构

> [!note] 基本概念
> `package` 是代码组织单元，`module` 是依赖管理和版本边界。一个仓库通常对应一个 module，一个 module 可以包含多个 package。

```text
my-service/
  go.mod
  go.sum
  cmd/
    api/
      main.go          # 程序入口，尽量只做组装和启动
  internal/
    user/
      service.go       # internal 下的包只能被当前 module 内部导入
      repository.go
  pkg/
    logger/
      logger.go        # 确实要暴露给外部项目复用时才放 pkg
  configs/
  migrations/
```

```go
// cmd/api/main.go
package main

import "my-service/internal/user"

func main() {
    service := user.NewService()
    _ = service
}
```

> [!tip] 目录建议
> - `cmd/<app>`：可执行程序入口。
> - `internal`：只给当前 module 使用的业务代码。
> - `pkg`：确认需要被其他 module 复用的公共库。
> - 不要为了“看起来标准”强行分层，先让边界来自真实业务。

## 9.2 `go.mod` 和依赖管理

```bash
# 创建模块
go mod init github.com/user/my-service

# 添加或升级依赖
go get github.com/gin-gonic/gin@latest

# 整理 go.mod 和 go.sum，删除未使用依赖
go mod tidy

# 查看依赖树
go mod graph

# 为什么引入了某个依赖
go mod why -m github.com/some/module

# 下载依赖到本地模块缓存
go mod download
```

```go
module github.com/user/my-service

go 1.26

require (
    github.com/gin-gonic/gin v1.10.0
)
```

> [!warning] 依赖原则
> 依赖越多，升级、审计、冲突和安全风险越高。标准库能清晰解决的问题，优先用标准库。

## 9.3 Workspace

```bash
# 多 module 本地联调
go work init ./service-a ./service-b

# 添加一个本地模块
go work use ./shared

# 同步 workspace 依赖
go work sync
```

> [!note] 使用场景
> `go work` 适合多个本地模块同时开发。它不应该替代正常的版本发布流程，提交前要确认 CI 环境是否需要 `go.work`。

## 9.4 构建标签和交叉编译

```go
//go:build linux

package platform

func Name() string {
    return "linux"
}
```

```bash
# 构建 Linux amd64 可执行文件
GOOS=linux GOARCH=amd64 go build -o app-linux-amd64 ./cmd/api

# 查看支持的平台
go tool dist list
```

---

# 10.并发深入

## 10.1 `sync.WaitGroup`

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    var wg sync.WaitGroup

    for i := 0; i < 3; i++ {
        i := i // 为当前循环创建独立变量，避免闭包误用
        wg.Add(1)
        go func() {
            defer wg.Done() // 确保 goroutine 退出时计数减一
            fmt.Println("worker", i)
        }()
    }

    wg.Wait() // 等待所有 goroutine 完成
}
```

## 10.2 `Mutex` 和 `RWMutex`

```go
type Counter struct {
    mu sync.Mutex
    n  int
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.n++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.n
}
```

```go
type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func (c *Cache) Get(key string) (string, bool) {
    c.mu.RLock()         // 多个读者可以并发读
    defer c.mu.RUnlock()
    v, ok := c.data[key]
    return v, ok
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()          // 写入必须独占
    defer c.mu.Unlock()
    c.data[key] = value
}
```

> [!warning] 锁的注意事项
> - 不要复制包含锁的结构体，传递时用指针。
> - 锁保护的是共享状态，不是代码块本身。
> - 持锁期间不要做慢 IO，避免阻塞其他 goroutine。

## 10.3 `sync.Once`、`sync.Pool` 和 `atomic`

```go
var (
    once sync.Once
    cfg  *Config
)

func GetConfig() *Config {
    once.Do(func() {
        cfg = loadConfig() // 保证只初始化一次
    })
    return cfg
}
```

```go
var count atomic.Int64

func Inc() {
    count.Add(1)          // 原子加法，无需显式加锁
}

func Value() int64 {
    return count.Load()
}
```

```go
var bufferPool = sync.Pool{
    New: func() any {
        return new(bytes.Buffer)
    },
}

func useBuffer() {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer bufferPool.Put(buf)
    buf.Reset()           // 归还前清空，避免脏数据复用
}
```

> [!tip] 使用建议
> `atomic` 适合简单计数和状态位；复杂共享状态优先用 `Mutex`。`sync.Pool` 只适合可临时复用的对象，不能当缓存使用。

## 10.4 `context`

> [!note] 作用
> `context.Context` 用于传递取消信号、超时截止时间和请求级元数据。它应该作为函数第一个参数，命名为 `ctx`。

```go
func QueryUser(ctx context.Context, id int64) (*User, error) {
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.example.com/users", nil)
    if err != nil {
        return nil, err
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err // ctx 超时或取消也会从这里返回
    }
    defer resp.Body.Close()

    // 解析响应
    return &User{ID: id}, nil
}
```

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel() // 释放计时器资源

user, err := QueryUser(ctx, 1)
if err != nil {
    return err
}
_ = user
```

### 取消原因

```go
ctx, cancel := context.WithCancelCause(context.Background())

go func() {
    cancel(errors.New("上游任务失败"))
}()

<-ctx.Done()
fmt.Println(context.Cause(ctx)) // 获取取消原因
```

## 10.5 Worker Pool

```go
type Job struct {
    ID int
}

func worker(ctx context.Context, jobs <-chan Job, results chan<- int) {
    for {
        select {
        case <-ctx.Done():
            return
        case job, ok := <-jobs:
            if !ok {
                return
            }
            results <- job.ID * 2
        }
    }
}

func run(ctx context.Context, input []Job) []int {
    jobs := make(chan Job)
    results := make(chan int)

    for i := 0; i < 4; i++ {
        go worker(ctx, jobs, results)
    }

    go func() {
        defer close(jobs)
        for _, job := range input {
            jobs <- job
        }
    }()

    output := make([]int, 0, len(input))
    for range input {
        output = append(output, <-results)
    }
    return output
}
```

> [!warning] goroutine 泄漏
> 只启动 goroutine 不设计退出条件，会导致 goroutine 泄漏。长期运行服务中的 goroutine 必须能被 `context`、关闭 channel 或其他明确条件停止。

## 10.6 `errgroup`

```go
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, urls []string) error {
    g, ctx := errgroup.WithContext(ctx)

    for _, url := range urls {
        url := url
        g.Go(func() error {
            req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
            if err != nil {
                return err
            }
            resp, err := http.DefaultClient.Do(req)
            if err != nil {
                return err
            }
            defer resp.Body.Close()
            return nil
        })
    }

    return g.Wait() // 任一任务失败会取消 ctx，并返回第一个错误
}
```

---

# 11.HTTP、JSON 和数据库

## 11.1 HTTP Server

```go
type Server struct {
    mux *http.ServeMux
}

func NewServer() *Server {
    s := &Server{mux: http.NewServeMux()}
    s.mux.HandleFunc("GET /health", s.health)
    s.mux.HandleFunc("POST /users", s.createUser)
    return s
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusNoContent)
}

func (s *Server) createUser(w http.ResponseWriter, r *http.Request) {
    defer r.Body.Close()

    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid json", http.StatusBadRequest)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    _ = json.NewEncoder(w).Encode(map[string]any{"ok": true})
}
```

## 11.2 中间件

```go
func Logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        slog.Info("request finished",
            "method", r.Method,
            "path", r.URL.Path,
            "cost", time.Since(start),
        )
    })
}
```

## 11.3 优雅关闭

```go
srv := &http.Server{
    Addr:              ":8080",
    Handler:           Logging(NewServer().mux),
    ReadHeaderTimeout: 5 * time.Second,
}

go func() {
    if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
        slog.Error("server failed", "error", err)
    }
}()

stop := make(chan os.Signal, 1)
signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
<-stop

ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

if err := srv.Shutdown(ctx); err != nil {
    slog.Error("shutdown failed", "error", err)
}
```

## 11.4 HTTP Client

```go
client := &http.Client{
    Timeout: 5 * time.Second, // 整个请求的总超时
}

req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.example.com/users", nil)
if err != nil {
    return err
}

resp, err := client.Do(req)
if err != nil {
    return err
}
defer resp.Body.Close()

if resp.StatusCode < 200 || resp.StatusCode >= 300 {
    return fmt.Errorf("bad status: %s", resp.Status)
}
```

> [!warning] HTTP 注意事项
> - 服务端要设置 `ReadHeaderTimeout`，避免慢请求拖垮连接。
> - 客户端要设置 `Timeout`，不要长期使用无超时的默认配置。
> - 响应体必须关闭，否则连接无法复用。

## 11.5 JSON

```go
type User struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email,omitempty"`
}

data, err := json.Marshal(User{ID: 1, Name: "Alice"})
if err != nil {
    return err
}

var user User
dec := json.NewDecoder(bytes.NewReader(data))
dec.DisallowUnknownFields() // 输入字段多出来时直接报错，适合严格 API

if err := dec.Decode(&user); err != nil {
    return err
}
```

## 11.6 `database/sql`

```go
func FindUser(ctx context.Context, db *sql.DB, id int64) (*User, error) {
    const query = `select id, name, email from users where id = ?`

    var user User
    err := db.QueryRowContext(ctx, query, id).Scan(&user.ID, &user.Name, &user.Email)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

```go
func Transfer(ctx context.Context, db *sql.DB, from, to int64, amount int64) error {
    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback() // Commit 成功后 Rollback 会返回错误，可忽略

    if _, err := tx.ExecContext(ctx, "update account set balance = balance - ? where id = ?", amount, from); err != nil {
        return err
    }
    if _, err := tx.ExecContext(ctx, "update account set balance = balance + ? where id = ?", amount, to); err != nil {
        return err
    }

    return tx.Commit()
}
```

---

# 12.测试

## 12.1 表驱动测试

```go
func Add(a, b int) int {
    return a + b
}

func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a    int
        b    int
        want int
    }{
        {name: "positive", a: 1, b: 2, want: 3},
        {name: "negative", a: -1, b: -2, want: -3},
    }

    for _, tt := range tests {
        tt := tt
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Fatalf("Add() = %d, want %d", got, tt.want)
            }
        })
    }
}
```

## 12.2 测试辅助函数

```go
func mustReadFile(t *testing.T, path string) []byte {
    t.Helper() // 失败时把行号定位到调用处，而不是辅助函数内部

    data, err := os.ReadFile(path)
    if err != nil {
        t.Fatalf("read file: %v", err)
    }
    return data
}
```

## 12.3 HTTP 测试

```go
func TestHealth(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/health", nil)
    rec := httptest.NewRecorder()

    NewServer().health(rec, req)

    if rec.Code != http.StatusNoContent {
        t.Fatalf("status = %d", rec.Code)
    }
}
```

## 12.4 Benchmark

```go
func BenchmarkBuilder(b *testing.B) {
    for i := 0; i < b.N; i++ {
        var builder strings.Builder
        for j := 0; j < 100; j++ {
            builder.WriteString("x")
        }
        _ = builder.String()
    }
}
```

```bash
go test -bench=. -benchmem ./...
```

## 12.5 Fuzz

```go
func FuzzParseUserID(f *testing.F) {
    f.Add("123")
    f.Add("abc")

    f.Fuzz(func(t *testing.T, input string) {
        _, _ = strconv.ParseInt(input, 10, 64)
    })
}
```

```bash
go test -fuzz=FuzzParseUserID ./...
```

## 12.6 覆盖率和竞态检查

```bash
# 查看测试覆盖率
go test -cover ./...

# 生成覆盖率文件
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# 检查数据竞争
go test -race ./...
```

---

# 13.错误处理和日志

## 13.1 错误包装

```go
var ErrNotFound = errors.New("not found")

func LoadUser(id int64) (*User, error) {
    user, err := queryUser(id)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, fmt.Errorf("load user %d: %w", id, ErrNotFound)
    }
    if err != nil {
        return nil, fmt.Errorf("load user %d: %w", id, err)
    }
    return user, nil
}
```

```go
user, err := LoadUser(1)
if errors.Is(err, ErrNotFound) {
    return nil
}
if err != nil {
    return err
}
_ = user
```

## 13.2 `errors.As`

```go
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println(pathErr.Path)
}
```

## 13.3 `errors.Join`

```go
func CloseAll(closers ...io.Closer) error {
    var errs []error
    for _, closer := range closers {
        if err := closer.Close(); err != nil {
            errs = append(errs, err)
        }
    }
    return errors.Join(errs...) // 多个错误合并为一个错误
}
```

## 13.4 结构化日志 `log/slog`

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))

logger.Info("user created",
    "user_id", 123,
    "email", "alice@example.com",
)

logger.Error("create user failed",
    "error", err,
)
```

> [!tip] 日志建议
> 日志字段要稳定，便于检索和告警。错误日志保留 `error` 字段，业务标识如 `user_id`、`trace_id` 要显式写出。

---

# 14.现代标准库和语言特性

## 14.1 `slices`、`maps`、`cmp`

```go
nums := []int{3, 1, 2}
slices.Sort(nums)
fmt.Println(nums) // [1 2 3]

names := []string{"go", "java", "python"}
idx := slices.Index(names, "java")
fmt.Println(idx)

scores := map[string]int{"alice": 90}
copyScores := maps.Clone(scores) // 克隆 map，避免共享底层数据

value := cmp.Or("", "default")   // 返回第一个非零值
fmt.Println(value)
```

## 14.2 `embed`

```go
import "embed"

//go:embed templates/*.html
var templates embed.FS

func readTemplate(name string) ([]byte, error) {
    return templates.ReadFile("templates/" + name)
}
```

> [!note] 使用场景
> `embed` 适合把模板、静态文件、SQL 文件打包进二进制，部署时减少外部文件依赖。

## 14.3 迭代器和 range-over-func

```go
import "iter"

func Count(n int) iter.Seq[int] {
    return func(yield func(int) bool) {
        for i := 0; i < n; i++ {
            if !yield(i) {
                return // 调用方提前停止迭代
            }
        }
    }
}

for v := range Count(3) {
    fmt.Println(v)
}
```

> [!tip] 迭代器使用建议
> 迭代器适合封装自定义容器遍历逻辑。普通切片和 map 直接 `range` 更简单，不必为了新特性强行改写。

## 14.4 `new` 初始化表达式

```go
type Person struct {
    Name string
    Age  *int `json:"age,omitempty"`
}

p := Person{
    Name: "Alice",
    Age:  new(20), // Go 1.26 起，new 可以接收表达式并返回其指针
}
```

> [!note] 适用场景
> 该写法适合 JSON、Protobuf 等需要用指针表达“字段是否存在”的场景。老版本 Go 需要先创建局部变量再取地址。

## 14.5 map 遍历顺序

```go
m := map[string]int{"a": 1, "b": 2, "c": 3}

for k, v := range m {
    fmt.Println(k, v) // 遍历顺序不保证稳定
}

keys := slices.Sorted(maps.Keys(m))
for _, k := range keys {
    fmt.Println(k, m[k]) // 需要稳定输出时先排序 key
}
```

---

# 15.性能和内存

## 15.1 逃逸分析

```bash
go build -gcflags="-m" ./...
```

> [!note] 逃逸
> 如果局部变量的生命周期超过函数栈帧，编译器会把它分配到堆上。堆分配会增加 GC 压力，但不要为了减少逃逸牺牲清晰设计，先用 benchmark 和 pprof 证明瓶颈。

## 15.2 pprof

```go
import _ "net/http/pprof"

func main() {
    go func() {
        _ = http.ListenAndServe("localhost:6060", nil)
    }()

    // 业务服务启动逻辑
}
```

```bash
# CPU 采样
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# 堆内存
go tool pprof http://localhost:6060/debug/pprof/heap
```

## 15.3 减少分配

```go
func BuildCSV(rows []string) string {
    var b strings.Builder
    b.Grow(len(rows) * 16) // 预估容量，减少扩容次数

    for _, row := range rows {
        b.WriteString(row)
        b.WriteByte('\n')
    }
    return b.String()
}
```

```go
func FilterEven(nums []int) []int {
    out := make([]int, 0, len(nums)) // 预分配容量
    for _, n := range nums {
        if n%2 == 0 {
            out = append(out, n)
        }
    }
    return out
}
```

## 15.4 GC 和内存建议

> [!tip] 性能建议
> - 优先减少无意义分配，而不是盲目调 GC 参数。
> - 大对象复用要小心脏数据和并发安全。
> - 字符串拼接优先用 `strings.Builder`。
> - 热路径中避免 `fmt.Sprintf`，它灵活但开销较高。
> - 性能结论必须来自 benchmark、pprof 或线上指标。

---

# 16.常见陷阱补充

## 16.1 nil 接口

```go
type MyError struct{}

func (e *MyError) Error() string { return "my error" }

func returnsError() error {
    var err *MyError = nil
    return err // 返回的接口不为 nil：动态类型是 *MyError，动态值是 nil
}

if err := returnsError(); err != nil {
    fmt.Println("unexpected non-nil error")
}
```

> [!warning] 原因
> 接口值由“动态类型 + 动态值”组成。只有两者都为空时，接口才等于 `nil`。

## 16.2 nil slice 和 empty slice

```go
var a []int        // nil slice
b := []int{}      // empty slice

fmt.Println(len(a), len(b)) // 都是 0
fmt.Println(a == nil)       // true
fmt.Println(b == nil)       // false
```

> [!tip] API 建议
> 返回 JSON 时如果希望输出 `[]` 而不是 `null`，要初始化为空切片。

## 16.3 defer 在循环中

```go
for _, name := range files {
    f, err := os.Open(name)
    if err != nil {
        return err
    }
    defer f.Close() // 如果文件很多，会等函数结束才统一关闭
}
```

```go
for _, name := range files {
    if err := func() error {
        f, err := os.Open(name)
        if err != nil {
            return err
        }
        defer f.Close() // 每轮循环结束就关闭
        return handle(f)
    }(); err != nil {
        return err
    }
}
```

## 16.4 时间格式化

```go
now := time.Now()

fmt.Println(now.Format("2006-01-02 15:04:05"))
```

> [!note] 记忆方式
> Go 时间格式化不是 `YYYY-MM-DD`，而是用固定参考时间 `2006-01-02 15:04:05` 表达布局。

## 16.5 JSON `omitempty`

```go
type Payload struct {
    Count int  `json:"count,omitempty"` // Count 为 0 时会被省略
    Age   *int `json:"age,omitempty"`   // nil 时省略，0 值指针不会省略
}
```

> [!tip] 建议
> 如果需要区分“字段不存在”和“字段存在但值为 0”，使用指针类型。

---

# 17.实战检查清单

## 17.1 提交前

- `go fmt ./...`
- `go vet ./...`
- `go test ./...`
- 并发代码执行 `go test -race ./...`
- 新增导出 API 要写注释。
- 错误要带上下文，但不要重复包装同一层语义。
- HTTP 客户端和服务端都要设置超时。
- goroutine 要有退出条件。

## 17.2 代码评审重点

- 共享变量是否有锁、channel 或不可变设计保护。
- `context` 是否正确向下传递。
- 数据库事务是否正确 `Rollback` 和 `Commit`。
- 外部资源是否关闭：文件、响应体、rows。
- map 遍历是否依赖顺序。
- 错误是否可用 `errors.Is/As` 判断。
- 测试是否覆盖正常路径、错误路径和边界条件。
