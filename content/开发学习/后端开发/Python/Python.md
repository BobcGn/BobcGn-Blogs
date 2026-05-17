---
title: "Python"
date: 2025-01-01
tags: []
---

# 0 Python简介
> [!note] Python
> Python是一种**高级、解释型**的编程语言，以简洁明了的语法和强大的功能而闻名。相比于Java，Python代码更简洁，开发效率更高；相比于C/C++，Python更容易上手，适合快速原型开发。

> [!tip] 核心特性
> - **简单易学**​：语法清晰简洁，接近自然语言
> - ​**解释型语言**​：无需编译，直接运行
> - ​**跨平台性**​：支持Windows、Linux、macOS等主流操作系统
> - ​**丰富的库**​：拥有庞大的标准库和第三方库
> - ​**面向对象**​：完全支持面向对象编程
> - ​**动态类型**​：变量无需声明类型，运行时确定
> - ​**开源免费**​：完全免费使用和修改

> [!tip] 技术体系
> - ​**Python标准库**​：内置的强大功能模块
> - ​**数据科学**​：NumPy、Pandas、Matplotlib
> - ​**Web开发**​：Django、Flask、FastAPI
> - ​**人工智能**​：TensorFlow、PyTorch、Scikit-learn
> - ​**自动化运维**​：Ansible、Fabric
> - ​**网络爬虫**​：Scrapy、BeautifulSoup

---
# 1 基本语法
## 1.1 Python的所有关键字

|   关键字    |               功能               |  关键字   |          功能          |
| :------: | :----------------------------: | :----: | :------------------: |
|   and    |              逻辑与               | global |      声明变量为全局变量       |
|    as    |          导入模块时指定模块别名           |   if   |         条件判断         |
|  assert  | 检查某个条件是否为真，否则会引发AssertionError | import |        导入模块或包        |
|  async   |         定义异步函数，标记函数为协程         |   in   |  检查某个元素是否存在于指定的序列中   |
|  await   |       用于在异步函数中等待一个协程的结果        |   is   |    比较两个对象是否是同一个对象    |
|  break   |             跳出当前循环             | lambda |        创建匿名函数        |
|  class   |              定义类               |  not   |         逻辑非          |
| continue |        跳过当前循环，直接进入下一次循环        |   or   |         逻辑或          |
|   def    |              定义函数              |  pass  |      占位符，表示空操作       |
|   del    |         删除变量或数据结构中的元素          | raise  |        用于引发异常        |
|   elif   |     用于if中添加多个条件判断（else if）     | return |        从函数返回值        |
|   else   |        分支结构中定义不满足条件时的语句        |  try   |        开始异常捕获        |
|  except  |          捕获异常（catch）           | while  |     循环，条件为真时持续循环     |
| finally  |        无论是否发生异常都会执行的代码块        |  with  |     简化资源管理如文件操作      |
|   for    |           用于循环，遍历序列            | yield  | 定义生成器函数，返回一个值并暂停函数执行 |
|   from   |         从指定的模块中导入特定的部分         |        |                      |

> [!note] 软关键字
> `match`、`case`、`_` 和 `type` 是软关键字：它们只在特定语法位置具有关键字含义，平时仍可作为变量名使用。`match/case/_` 常用于结构化模式匹配，`type` 常用于类型别名语法。

## 1.2 输出
> [!note] 概述
> 在Python中，输出没有Java那么复杂，仅需要使用**print**关键字即可输出内容
> ```Python
> print("Hello World")
> print(123456)
> print(1.23456)
> print(True)
> print(None)
> ```

## 1.3 输入
> [!note] 说明
> Python使用`input()`函数获取用户输入，比Java的Scanner更简单
>```python
> a = int(input('请输入数字：'))
> print(f"a的值为{a}")
>```

## 1.4 分支结构
> [!note] if-elif-else分支结构
> Python 通过缩进来区分代码块，而不是大括号
> ```python
> a = int(input('请输入数字：'))
> if a > 0:
>    print('数字{}是正数'.format(a))
>elif a == 0:
>    print('数字{}是零'.format(a))
>else:
>    print('数字{}是负数'.format(a))
> ```

> [!note] match-case分支结构
> 相当于Java中的 switch-case 结构，但是更强大
> ```python
> grade = int(input('请输入分数：'))
>match grade:
>    case 90:
>        print('优秀')
>    case 80:
>        print('良好')
>    case 70:
>        print('及格')
>    case 60:
>        print('不及格')
>    case 50|40|30|20|10:
>        print('差')
>    case _:
>        print('输入错误')
> ```


## 1.5 循环结构
> [!note] 说明
> 在Python中，循环结构分为**while**循环和**for**循环
> 1. while循环
> ```python
> i = 1
> while i < 5:
> 	print(i)
> ```
> 2. for循环
> 	- `for i in range(n)`：最简单的for循环，表示范围`[0,n)`
> 	```python
> 	for i in range (5):
> 		print(i)
> 	```
> 	- `for i in range(m,n)`：指定范围的for循环，表示范围`[m,n)`
> 	```python
> 	for i in range(1,6):
> 		print(i)
> 	```
> 	- `for i in range(m,n,p)`：指定范围和步长的for循环，其中范围为`[m,n)`，步长为p
> 	```python
> 	for i in range(1,10,2):
> 		print(i)
> 	```

## 1.6 列表、元组、集合和字典
### 列表

> [!note] 说明
> 列表是Python中的一种数据结构，它是一个**可变的有序集合**，可以存储多个元素。列表的元素可以是任何数据类型，包括数字、字符串、列表等。列表的定义和操作与Java的数组有相似之处，但更加灵活。
#### 列表的定义
```python
# 列表的定义
list1 = [1, 2, 3]
list2 = ["a", "b", "c"]
list3 = [1, "a", True, 3.14]
```
#### 列表的常用操作
- **添加元素**：使用`append()`方法
```python
list1.append(4)
```
- **删除元素**：使用`remove()`方法
```python
list1.remove(1)
```
- **修改元素**：使用索引直接修改
```python
list1[0] = 10
```
- **查询元素**：使用索引获取元素
```python
print(list1[0])
```
- **遍历列表**：使用`for`循环
```python
for item in list1:
    print(item)
```
- **列表的长度**：使用`len()`函数
```python
print(len(list1))
```
- **列表的排序**：使用`sort()`方法
```python
list1.sort()
```
- **列表的反转**：使用`reverse()`方法
```python
list1.reverse()
```
- **列表的切片**：使用`[start:end]`获取列表的一部分
```python
print(list1[0:2])
```

### 元组

> [!note] 说明
> 元组是Python中的一种数据结构，它是一个**不可变的有序集合**，可以存储多个元素。元组的元素可以是任何数据类型，包括数字、字符串、元组等。元组的定义和操作与列表相似，但更加安全。

#### 元组的定义
```python
# 元组的定义
tuple1 = (1, 2, 3)
tuple2 = ("a", "b", "c")
tuple3 = (1, "a", True, 3.14)
```

#### 元组的常用操作
- **添加元素**：元组是不可变的，不能直接添加元素，但可以通过`+`操作符实现
```python
tuple1 = tuple1 + (4,)
```
- **删除元素**：元组是不可变的，不能直接删除元素，但可以通过`del`语句删除整个元组
```python
del tuple1
```
- **修改元素**：元组是不可变的，不能直接修改元素，但可以通过`+`操作符实现
```python
tuple1 = tuple1[:1] + (10,)
```
- **查询元素**：使用索引获取元素
```python
print(tuple1[0])
```
- **遍历元组**：使用`for`循环
```python
for item in tuple1:
    print(item)
```
- **元组的长度**：使用`len()`函数
```python
print(len(tuple1))
```
- **元组的排序**：元组是不可变的，不能直接排序，但可以通过`sorted()`函数实现
```python
print(sorted(tuple1))
```
- **元组的切片**：使用`[start:end]`获取元组的一部分
```python
print(tuple1[0:2])
```

### 集合

> [!note] 说明
> 集合是一个**无序、不重复**的数据容器，适合去重、成员判断和集合运算。集合底层通常基于哈希表，成员判断平均时间复杂度接近 `O(1)`。

#### 集合的定义
```python
nums = {1, 2, 3}
empty_set = set()       # 注意：{} 表示空字典，不是空集合
unique = set([1, 1, 2]) # {1, 2}
```

#### 集合的常用操作
```python
tags = {"python", "backend"}
tags.add("data")              # 添加单个元素
tags.update(["web", "api"])   # 批量添加元素
tags.discard("unknown")       # 不存在也不会报错
tags.remove("web")            # 不存在会抛出 KeyError

print("python" in tags)       # 成员判断
```

#### 集合运算
```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)  # 并集：{1, 2, 3, 4, 5}
print(a & b)  # 交集：{3}
print(a - b)  # 差集：{1, 2}
print(a ^ b)  # 对称差集：{1, 2, 4, 5}
```

### 字典

> [!note] 说明
> 字典是Python中的一种数据结构，它是一个**键值对集合**，可以存储多个键值对。现代 Python 的字典会保留插入顺序，定义和操作与Java的Map有相似之处，但更加简洁。

#### 字典的定义

```python
# 字典的定义
dict1 = {"name": "Alice", "age": 23}
dict2 = {"a": 1, "b": 2, "c": 3}
dict3 = {"id": 1, "name": "Bob", "age": 25}
```

#### 字典的常用操作
- **添加键值对**：使用`update()`方法
```python
dict1.update({"gender": "female"})
```
- **删除键值对**：使用`pop()`方法
```python
dict1.pop("age")
```
- **修改键值对**：使用索引直接修改
```python
dict1["name"] = "Eve"
```
- **查询键值对**：使用索引获取值
```python
print(dict1["name"])
```
- **遍历字典**：使用`for`循环
```python
for key, value in dict1.items():
    print(key, value)
```
- **字典的长度**：使用`len()`函数
```python
print(len(dict1))
```
- **字典的排序**：使用`sorted()`函数
```python
print(sorted(dict1.items()))
```
- **字典的键**：使用`keys()`方法
```python
print(dict1.keys())
```
- **字典的值**：使用`values()`方法
```python
print(dict1.values())
```

### 推导式

> [!tip] 使用场景
> 推导式适合把“遍历 + 条件过滤 + 转换”写成清晰的一行。如果逻辑过长，应改回普通 `for` 循环，避免可读性下降。

```python
nums = [1, 2, 3, 4, 5]

squares = [x * x for x in nums]              # 列表推导式
even_squares = [x * x for x in nums if x % 2 == 0]

unique_lengths = {len(word) for word in ["go", "java", "python"]}  # 集合推导式
index_map = {value: index for index, value in enumerate(nums)}      # 字典推导式

gen = (x * x for x in nums)                  # 生成器表达式，惰性计算
```

## 1.7 函数
> [!note] 说明
> 函数是Python中的一种基本结构，它是一段可以重复调用的代码块。函数可以接受参数，并可以返回值。函数的定义和调用与Java的`main`方法有相似之处，但更加灵活。

### 函数的定义
```python
# 函数的定义
def my_function(a, b):
    return a + b
```

### 函数的调用
```python
# 函数的调用
result = my_function(1, 2)
print(result)
```

### 函数的参数

- **位置参数**：按顺序传递参数
```python
def my_function(a, b):
    return a + b

result = my_function(1, 2)
```

- **关键字参数**：按关键字传递参数
```python
def my_function(a, b):
    return a + b

result = my_function(a=1, b=2)
```

- **默认参数**：定义默认值
```python
def my_function(a, b=2):
    return a + b

result = my_function(1)
```

- **可变参数**：使用`*args`和`**kwargs`传递任意数量的参数
```python
def my_function(*args):
    return sum(args)

result = my_function(1, 2, 3)
```

### 函数的返回值
```python
# 函数的返回值
def my_function(a, b):
    return a + b

result = my_function(1, 2)
print(result)
```

### 函数的嵌套调用

```python
# 函数的嵌套调用
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

def calculate(a, b):
    return multiply(add(a, b), add(a, b))

result = calculate(1, 2)
print(result)
```

### 函数的参数传递

- **值传递**：传递的是参数的值
```python
def my_function(a):
    a = 10

a = 5
my_function(a)
print(a)
```

- **引用传递**：传递的是参数的引用
```python
def my_function(a):
    a.append(10)

a = [1, 2, 3]
my_function(a)
print(a)
```

> [!note] 更准确的理解
> Python 参数传递可以理解为“对象引用按值传递”。函数拿到的是对象引用的副本：给参数重新赋值不会影响外部变量；但如果对象本身可变，函数内部修改对象内容会被外部看到。

---
# 2 面向对象编程
> [!note] 概述
> Python 是“一切皆对象”的语言。数字、字符串、函数、类本身都是对象。与 [[Java知识点总结|Java]] 不同，Python 更强调鸭子类型和组合：只要对象提供了需要的方法，就可以被当作对应能力使用。

## 2.1 类与对象

```python
class User:
    # 类属性：所有实例共享，适合保存默认配置或常量
    role = "member"

    def __init__(self, name: str, age: int) -> None:
        # 实例属性：每个对象单独持有
        self.name = name
        self.age = age

    def introduce(self) -> str:
        # self 代表当前实例，类似 Java 中的 this
        return f"{self.name} is {self.age} years old"


u = User("Alice", 20)
print(u.name)
print(u.introduce())
```

> [!note] `self`
> `self` 不是关键字，但约定必须写成 `self`。调用 `u.introduce()` 时，解释器会自动把 `u` 作为第一个参数传给方法。

## 2.2 实例属性、类属性和私有约定

```python
class Counter:
    total = 0                # 类属性

    def __init__(self) -> None:
        self.count = 0       # 实例属性
        self._cache = {}     # 单下划线：约定为内部使用
        self.__secret = 42   # 双下划线：触发名称改写，降低被外部误用的概率

    def inc(self) -> None:
        self.count += 1
        Counter.total += 1   # 修改类属性时建议用类名，语义更清晰
```

> [!warning] 类属性陷阱
> 可变类属性会被所有实例共享，容易造成意外污染。列表、字典这类可变对象通常应放在 `__init__` 中作为实例属性。

```python
class Bad:
    items = []          # 所有实例共享同一个列表，通常是错误设计

class Good:
    def __init__(self) -> None:
        self.items = [] # 每个实例拥有独立列表
```

## 2.3 继承、多态和 MRO

```python
class Animal:
    def speak(self) -> str:
        return "..."


class Dog(Animal):
    def speak(self) -> str:
        return "wang"


class Cat(Animal):
    def speak(self) -> str:
        return "miao"


def make_sound(animal: Animal) -> None:
    # 多态：调用者只关心对象是否有 speak 方法
    print(animal.speak())


make_sound(Dog())
make_sound(Cat())
```

```python
class Base:
    def save(self) -> None:
        print("base save")


class AuditMixin:
    def save(self) -> None:
        print("audit before")
        super().save()       # super 会按 MRO 查找下一个实现
        print("audit after")


class Service(AuditMixin, Base):
    pass


print(Service.__mro__)       # 查看方法解析顺序
Service().save()
```

> [!tip] 继承建议
> 继承适合表达“是一个”的关系；横切能力优先用组合或 mixin。多继承时一定要理解 MRO，否则 `super()` 调用顺序会难以维护。

## 2.4 常用魔术方法

```python
class Money:
    def __init__(self, amount: int) -> None:
        self.amount = amount

    def __repr__(self) -> str:
        # 面向开发者，目标是清晰展示对象状态
        return f"Money(amount={self.amount})"

    def __str__(self) -> str:
        # 面向用户，目标是友好展示
        return f"{self.amount} 元"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Money):
            return NotImplemented
        return self.amount == other.amount

    def __add__(self, other: "Money") -> "Money":
        # 返回新对象，不修改原对象
        return Money(self.amount + other.amount)


print(Money(10) + Money(20))
```

| 方法 | 作用 |
| --- | --- |
| `__init__` | 初始化对象 |
| `__repr__` | 开发调试展示 |
| `__str__` | 用户友好展示 |
| `__len__` | 支持 `len(obj)` |
| `__iter__` | 支持迭代 |
| `__enter__` / `__exit__` | 支持 `with` 上下文管理 |
| `__eq__` / `__lt__` | 支持比较 |

## 2.5 `@property`

```python
class Rectangle:
    def __init__(self, width: float, height: float) -> None:
        self.width = width
        self.height = height

    @property
    def area(self) -> float:
        # 像访问属性一样访问计算结果：rect.area
        return self.width * self.height


rect = Rectangle(3, 4)
print(rect.area)
```

## 2.6 `dataclass`

```python
from dataclasses import dataclass, field


@dataclass(slots=True)
class Product:
    id: int
    name: str
    price: float = 0.0
    tags: list[str] = field(default_factory=list)
    # default_factory 用于可变默认值，避免所有实例共享同一个列表


p = Product(1, "book", 39.9)
print(p)
```

> [!tip] 使用建议
> `dataclass` 适合 DTO、配置对象、简单领域对象。需要复杂不变量时，可以在 `__post_init__` 中校验。

---
# 3 核心技术
## 3.1 Python的异常处理

> [!note] 核心思想
> 异常用于表达“当前流程无法继续”。业务可预期失败优先返回明确结果；真正异常才抛出异常。

```python
try:
    number = int(input("请输入数字："))
    result = 10 / number
except ValueError as exc:
    print(f"输入不是合法整数：{exc}")
except ZeroDivisionError:
    print("除数不能为 0")
else:
    # try 中没有异常时执行
    print(f"结果：{result}")
finally:
    # 无论是否异常都会执行，常用于释放资源
    print("计算结束")
```

### 自定义异常

```python
class BizError(Exception):
    """业务异常基类，便于上层统一捕获。"""


class BalanceNotEnough(BizError):
    pass


def withdraw(balance: int, amount: int) -> int:
    if amount > balance:
        raise BalanceNotEnough("余额不足")
    return balance - amount
```

### 异常链和异常组

```python
def parse_age(raw: str) -> int:
    try:
        return int(raw)
    except ValueError as exc:
        # from exc 保留原始异常上下文，排查问题更容易
        raise ValueError(f"年龄格式错误：{raw}") from exc


try:
    raise ExceptionGroup("批量任务失败", [ValueError("bad value"), RuntimeError("bad state")])
except* ValueError as group:
    # except* 用于处理异常组中的特定类型异常
    print(group.exceptions)
```

> [!warning] `finally` 注意点
> 不建议在 `finally` 中写 `return`、`break`、`continue`，这会覆盖或吞掉 `try/except` 中的异常和返回值。

## 3.2 文件操作

### 文本文件

```python
from pathlib import Path

path = Path("notes.txt")

path.write_text("hello\n", encoding="utf-8")

content = path.read_text(encoding="utf-8")
print(content)
```

### 使用 `with` 管理资源

```python
with open("notes.txt", "r", encoding="utf-8") as file:
    # 离开 with 块时会自动关闭文件，即使中途发生异常也能释放资源
    for line in file:
        print(line.rstrip())
```

### 二进制文件和目录

```python
from pathlib import Path

image = Path("avatar.png")
data = image.read_bytes()
image.with_name("avatar.copy.png").write_bytes(data)

root = Path(".")
for file in root.glob("**/*.md"):
    # **/*.md 表示递归查找所有 Markdown 文件
    print(file)
```

> [!tip] 路径处理建议
> 新代码优先使用 `pathlib.Path`，比 `os.path` 更面向对象，也更容易组合路径。

## 3.3 模块与包

### 导入方式

```python
import math
from pathlib import Path
from collections import Counter as C

print(math.sqrt(16))
print(Path.cwd())
print(C("banana"))
```

### 包结构

```text
my_app/
  pyproject.toml
  src/
    my_app/
      __init__.py
      main.py
      service.py
  tests/
    test_service.py
```

```python
# service.py
def add(a: int, b: int) -> int:
    return a + b


# main.py
from my_app.service import add

print(add(1, 2))
```

> [!note] `__name__ == "__main__"`
> 一个文件既可以被导入，也可以直接运行。下面的写法能避免导入模块时自动执行脚本逻辑。

```python
def main() -> None:
    print("run app")


if __name__ == "__main__":
    main()
```

## 3.4 常用的内置函数

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `len()` | 获取长度 | `len([1, 2])` |
| `type()` | 查看运行时类型 | `type("x")` |
| `isinstance()` | 判断类型 | `isinstance(1, int)` |
| `enumerate()` | 遍历时带索引 | `for i, v in enumerate(items)` |
| `zip()` | 并行组合多个序列 | `zip(names, ages)` |
| `sorted()` | 返回排序后的新列表 | `sorted(nums)` |
| `sum()` | 求和 | `sum(nums)` |
| `any()` / `all()` | 任一/全部为真 | `any(flags)` |
| `map()` | 映射转换 | `map(str, nums)` |
| `filter()` | 过滤元素 | `filter(pred, nums)` |
| `open()` | 打开文件 | `open("a.txt")` |

```python
users = ["Alice", "Bob", "Cindy"]

for index, name in enumerate(users, start=1):
    print(index, name)

pairs = zip(["a", "b"], [1, 2])
print(dict(pairs))  # {"a": 1, "b": 2}

scores = [80, 95, 60]
print(any(score >= 90 for score in scores))  # 是否有人优秀
print(all(score >= 60 for score in scores))  # 是否全部及格
```

## 3.5 正则表达式

```python
import re

text = "邮箱：alice@example.com，电话：13800138000"

email_pattern = re.compile(r"[\w.-]+@[\w.-]+\.\w+")
phone_pattern = re.compile(r"1[3-9]\d{9}")

email = email_pattern.search(text)
if email:
    print(email.group())

phones = phone_pattern.findall(text)
print(phones)
```

### 常见元字符

| 写法 | 含义 |
| --- | --- |
| `.` | 任意字符，默认不匹配换行 |
| `\d` | 数字 |
| `\w` | 字母、数字、下划线 |
| `\s` | 空白字符 |
| `*` | 重复 0 次或多次 |
| `+` | 重复 1 次或多次 |
| `?` | 重复 0 次或 1 次，也可表示非贪婪 |
| `{m,n}` | 重复 m 到 n 次 |
| `^` / `$` | 字符串开始 / 结束 |
| `()` | 分组 |
| `[]` | 字符集合 |

> [!tip] 正则建议
> 复杂正则优先使用 `re.compile()` 并拆成多个具名变量；需要解析 HTML、JSON、XML 时不要用正则硬解析，应使用专门解析器。

---
# 4 高级特性
## 4.1 装饰器

> [!note] 本质
> 装饰器是“接收函数并返回新函数”的函数，常用于日志、鉴权、缓存、计时、事务等横切逻辑。

```python
from functools import wraps
from time import perf_counter


def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = perf_counter()
        try:
            # 原函数真正执行的位置
            return func(*args, **kwargs)
        finally:
            cost = perf_counter() - start
            print(f"{func.__name__} cost {cost:.4f}s")

    return wrapper


@timer
def work(n: int) -> int:
    return sum(range(n))


work(100000)
```

### 带参数的装饰器

```python
def retry(times: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            for _ in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    last_error = exc
            raise last_error

        return wrapper

    return decorator


@retry(times=3)
def unstable() -> str:
    return "ok"
```

## 4.2 上下文管理器

### 类实现

```python
class ManagedFile:
    def __init__(self, path: str) -> None:
        self.path = path
        self.file = None

    def __enter__(self):
        self.file = open(self.path, "r", encoding="utf-8")
        return self.file

    def __exit__(self, exc_type, exc, traceback) -> bool:
        if self.file:
            self.file.close()
        # 返回 False 表示异常继续向外抛出，不吞掉异常
        return False


with ManagedFile("notes.txt") as file:
    print(file.read())
```

### `contextlib` 实现

```python
from contextlib import contextmanager


@contextmanager
def open_utf8(path: str):
    file = open(path, "r", encoding="utf-8")
    try:
        yield file
    finally:
        file.close()


with open_utf8("notes.txt") as file:
    print(file.readline())
```

## 4.3 并发编程

> [!note] 选择原则
> IO 密集任务优先考虑线程或 `asyncio`；CPU 密集任务优先考虑多进程或把核心逻辑交给 C/NumPy 等释放 GIL 的库。

### 线程

```python
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen


def fetch(url: str) -> int:
    with urlopen(url, timeout=5) as response:
        return response.status


urls = ["https://example.com", "https://www.python.org"]

with ThreadPoolExecutor(max_workers=4) as pool:
    for status in pool.map(fetch, urls):
        print(status)
```

### 进程

```python
from concurrent.futures import ProcessPoolExecutor


def cpu_task(n: int) -> int:
    return sum(i * i for i in range(n))


with ProcessPoolExecutor() as pool:
    print(list(pool.map(cpu_task, [10000, 20000, 30000])))
```

### `asyncio`

```python
import asyncio


async def download(name: str, delay: float) -> str:
    await asyncio.sleep(delay)  # 模拟网络 IO，期间事件循环可执行其他任务
    return f"{name} done"


async def main() -> None:
    results = await asyncio.gather(
        download("a", 1),
        download("b", 1),
    )
    print(results)


asyncio.run(main())
```

> [!warning] GIL
> CPython 的 GIL 使同一进程内多个 Python 线程不能同时执行 Python 字节码。线程仍适合网络、文件、数据库等 IO 密集任务，因为等待 IO 时会释放执行权。

## 4.4 迭代器和生成器

```python
def count_down(n: int):
    while n > 0:
        yield n      # yield 返回一个值，并暂停函数状态
        n -= 1


for value in count_down(3):
    print(value)
```

```python
class RangeLike:
    def __init__(self, end: int) -> None:
        self.end = end

    def __iter__(self):
        current = 0
        while current < self.end:
            yield current
            current += 1


print(list(RangeLike(3)))
```

## 4.5 类型注解和泛型

```python
from collections.abc import Iterable
from typing import TypeVar

T = TypeVar("T")


def first(items: Iterable[T]) -> T:
    for item in items:
        return item
    raise ValueError("empty iterable")


def greet(name: str | None) -> str:
    # str | None 表示参数可以是字符串或 None
    if name is None:
        return "hello"
    return f"hello {name}"
```

### 类型别名和协议

```python
from typing import Protocol

type UserId = int


class SupportsClose(Protocol):
    def close(self) -> None:
        ...


def close_quietly(resource: SupportsClose) -> None:
    resource.close()
```

> [!tip] 类型检查
> 类型注解不会默认阻止运行时传错类型，它主要服务于 IDE、静态检查器和团队协作。常见检查工具包括 `mypy`、`pyright`、`ruff`。

## 4.6 标准库常用模块

| 模块 | 用途 |
| --- | --- |
| `pathlib` | 路径和文件操作 |
| `datetime` | 日期时间 |
| `json` | JSON 编码和解码 |
| `csv` | CSV 文件读写 |
| `argparse` | 命令行参数解析 |
| `logging` | 日志 |
| `collections` | 扩展容器 |
| `itertools` | 迭代器工具 |
| `functools` | 高阶函数工具 |
| `subprocess` | 调用外部命令 |

```python
import json
import logging
from collections import Counter, defaultdict
from datetime import datetime


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

payload = {"name": "Alice", "created_at": datetime.now().isoformat()}
text = json.dumps(payload, ensure_ascii=False)
print(text)

counter = Counter("banana")
groups = defaultdict(list)
groups["fruit"].append("apple")

logging.info("counter=%s groups=%s", counter, dict(groups))
```

## 4.7 测试、调试和代码质量

### `pytest` 基本测试

```python
def add(a: int, b: int) -> int:
    return a + b


def test_add() -> None:
    assert add(1, 2) == 3
```

```bash
pytest -q
```

### 常用质量工具

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip

ruff check .
ruff format .
pytest
```

> [!note] 调试方式
> 小问题可以用 `print()` 或 `logging`；复杂问题使用断点调试或 `pdb`。长期项目不要把调试 `print` 留在业务代码中，应改为结构化日志。

## 4.8 虚拟环境和依赖管理

```bash
# 创建虚拟环境
python -m venv .venv

# macOS / Linux 激活
source .venv/bin/activate

# Windows 激活
.venv\Scripts\activate

# 安装依赖
python -m pip install requests

# 导出依赖
python -m pip freeze > requirements.txt
```

### `pyproject.toml`

```toml
[project]
name = "my-app"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "requests>=2.32",
]

[tool.ruff]
line-length = 100
```

> [!tip] 工程建议
> 新项目优先使用 `pyproject.toml` 统一管理项目元数据、依赖和工具配置；脚本型小项目可以继续使用 `requirements.txt`。
