---
title: "String"
date: 2025-01-01
tags: []
---

# 1. 引言
> [!note] 
> String在Java中具有举足轻重的地位, 是Java中最常用也是最重要的类之一
> 
> String在Java中用来表示不可变的字符序列,位于`java.lang`包中, 因此在任何Java程序中都可以使用


---
# 2. String的定义和实现

## 2.1 类声明和修饰符分析
> [!note] 让我们先来看String类的声明
> ```Java
> public final class String
> 	implements java.io.Serializable, Comparable<String>, CharSequence,
> 	Constable, ConstantDesc
> ```
> 可以发现String是公开且不可被继承的, 它同时实现了多个接口

## 2.2 实现的接口详解
> [!note] String实现了三个重要接口
> 1. Serializable接口
> 	- 这是一个标记接口, 没有任何方法
> 	- 实现该接口说明**String对象可以被序列化**, 序列化*在网络传输和持久化存储中*很重要
> 2. Comparable`<String>`接口
> 	- 实现该接口要重写`compareTo`方法
> 	- 使String对象可以**按照字典顺序进行比较**
> 	- 支持字符串的自然排序
> 3. CharSequence接口
> 	- 字符序列的通用接口
> 	- 定义了字符序列的基本操作，如`length()`、`charAt()`、`subSequence()`等
> 	- **StringBuilder**和**StringBuffer**也实现了这个接口，保证了操作的一致性


## 2.3 final关键字的作用
> [!note] String类使用final关键字修饰有以下作用
> 1. 安全性
> 	- 防止恶意代码继承String类并修改其行为
> 	- 保证String对象的不可变性
> 2. 不可变性
> 	- 保证String对象一旦创建就不能被修改
> 	- 这是String设计的核心原则
> 3. 字符串常量池的实现
> 	- JVM可以安全地重用String对象
> 	- 节省内存空间


## 2.4 核心字段解析
> [!note] 在Java9之后, String类有以下核心字段
> ```Java
> @Stable  
> private final byte[] value;
> private final byte coder;
> private int hash; // Default to 0
> private boolean hashIsZero; // Default to false;
> ```
> 1. value字段
> 	- 字段说明
> 		- `byte[]`：使用字节数组存储字符数据，相比之前的`char[]`数组更节省内存
> 		- final：表示这个字段一旦初始化就不能被修改，是String**不可变性的关键**
> 		- @Stable：这是一个JDK内部注解，表示该字段在对象创建后不会改变，可以被JVM优化
> 	- 实现原理
> 		- 在Java 9中，String从使用char[]改为使用byte[]存储，这是为了提高内存效率
> 		- 对于ASCII字符（0-127），每个字符只占用一个字节
> 		- 对于Unicode字符，仍然需要两个字节存储
> 		- 这种设计使得字符串在存储Latin-1字符时更加高效
> 2. coder字段
> 	- 字段说明
> 		- byte：用于标识value数组中字节的编码方式
> 		- final：同样被final修饰，保证编码方式不会改变
> 	- 实现原理
> 		- 当字符串只包含Latin-1字符时，使用LATIN1编码，每个字符占用1个字节
> 		- 当字符串包含非Latin-1字符（如中文、特殊符号）时，使用UTF-16编码，每个字符占用2个字节
> 		- 这种设计实现了自动编码选择，既节省内存又支持完整Unicode字符集
> 3. hash字段
> 	- 字段说明
> 		- int：存储字符串的哈希码
> 		- 默认值为0：初始时哈希码为0，第一次调用hashCode()方法时计算并缓存
> 	- 实现原理
> 		- 哈希码是基于字符串内容计算的，**相同的字符串总是产生相同的哈希码**
> 		- 使用hash字段缓存哈希码，**避免重复计算，提高性能**
> 		- 这对于HashMap等集合类的性能至关重要
> 4. hashIsZero字段
> 	- 字段说明
> 		- boolean：用于标记哈希码是否为0
> 		- 默认值为false：初始状态
> 	- 实现原理
> 		- 由于哈希码可能为0，需要额外的字段来区分"未计算"和"计算结果为0"
> 		- 避免了将hash字段初始化为特殊值（如-1）带来的复杂性
> 		- 提高了代码的清晰度和可维护性
> 
> 这些字段共同构成了String类的核心:
> 1. value+coder: 决定字符串的实际存储方式
> 	- 如果coder=0(LATIN1)，则value中的每个字节直接代表一个字符
> 	- 如果coder=1(UTF16)，则value中的每两个字节代表一个字符
> 2. hash+hashIsZero: 实现哈希码的智能缓存
> 	- 当hashIsZero=true且hash=0时，表示哈希码已计算且结果为0
> 	- 当hashIsZero=false时，表示哈希码尚未计算或计算结果不为0

---

# 3. String类的构造方法
## 3.1 无参构造
```Java
public String() {  
    this.value = "".value;  
    this.coder = "".coder;  
}
```
> [!note] 实现原理
> 1. 初始化空字符串：
> 	- 创建一个表示空字符序列的String对象
> 	- 使用常量字符串""的内部字段进行初始化
> 2. value字段初始化：
> 	- this.value = "".value;
> 	- 将当前对象的value字段指向空字符串常量的value数组
> 	- 这是字符串常量池机制的一部分，相同的空字符串共享同一个对象
> 3. coder字段初始化：
> 	- this.coder = "".coder;
> 	- 设置编码方式为LATIN1（因为空字符串不包含特殊字符）
> 	- 确保编码方式正确
> 4. 内存效率：
> 	- 通过引用常量字符串的字段，避免了重复创建空数组
> 	- 节省内存空间
> 5. 不可变性保证：
> 	- 所有字段都是final的，确保对象创建后不能被修改
> 	- 符合String类的不可变性设计原则
## 3.2 字符串参数构造(最常用)
```Java
@IntrinsicCandidate  
public String(@NotNull String original) {  
    this.value = original.value;  
    this.coder = original.coder;  
    this.hash = original.hash;  
    this.hashIsZero = original.hashIsZero;  
}
```
> [!note] 实现原理
> 1. 对象复制
> 	- 创建一个和原字符串内容完全相同的String对象
> 	- 由于String不可变, 这个过程实际上是一个浅拷贝
> 2. 字段共享
> 	- `this.value = original.value`
> 	- 直接引用原字符串的value数组, 实现内存共享
> 	- 字符串常量池机制的基础
> 3. 编码方式继承
> 	- `this.coder = original.coder;`
> 	- 继承原字符串的编码方式
> 4. 哈希码缓存
> 	- `this.hash = original.hash;`
> 	- `this.hashIsZero = original.hashIsZero;`
> 	- 复制哈希码和零值标记, 避免重复计算
> 5. 性能优化
> 	- **通过直接引用字段**避免字符复制操作
> 	- 提高创建新字符串对象的效率
> 6. 不可变性保证
> 	- 所有字段都是final, 保证字符串被创建后**不可修改**, 符合String不可变性设计原则
> 

## 3.3 字符数组构造(较常用)
```Java
// 法1
public String(char[] value) {  
    this(value, 0, value.length, null);  
}
// 法2
public String(char[] value, int offset, int count) {  
    this(value, offset, count, rangeCheck(value, offset, count));  
}  
// 内部辅助方法, 检查偏移量和长度是否在合法范围内
private static Void rangeCheck(char[] value, int offset, int count) {  
    checkBoundsOffCount(offset, count, value.length);  
    return null;  
}
```
> [!note] 详解
> 1. 法1实现原理
> 	- 使用整个字符数组创建字符串
> 	- 将字符数组的全部内容复制到新的String对象中
> 	- 调用重载的构造函数, 指定起始偏移量为0, 长度为字符数组的长度
> 	- 实现了字符数组到字符串的完整转换
> 2. 法2实现原理
> 	- 使用字符数组的子数组创建字符串, 通过offset和count指定起点和长度
> 	- 调用辅助方法检验参数的合法性
> 	- 只复制指定范围内的字符
## 3.4 字节数组构造
```Java
// 法1 已弃用
@Deprecated(since="1.1")  
public String(byte[] ascii, int hibyte, int offset, int count) {  
    checkBoundsOffCount(offset, count, ascii.length);  
    if (count == 0) {  
        this.value = "".value;  
        this.coder = "".coder;  
        return;  
    }    if (COMPACT_STRINGS && (byte)hibyte == 0) {  
        this.value = Arrays.copyOfRange(ascii, offset, offset + count);  
        this.coder = LATIN1;  
    } else {  
        hibyte <<= 8;  
        byte[] val = StringUTF16.newBytesFor(count);  
        for (int i = 0; i < count; i++) {  
            StringUTF16.putChar(val, i, hibyte | (ascii[offset++] & 0xff));  
        }        this.value = val;  
        this.coder = UTF16;  
    }
}

// 法2
@Deprecated(since="1.1")  
public String(byte[] ascii, int hibyte) {  
    this(ascii, hibyte, 0, ascii.length);  
}

// 法3
public String(byte[] bytes, int offset, int length, String charsetName)  
        throws UnsupportedEncodingException {  
    this(lookupCharset(charsetName), bytes, checkBoundsOffCount(offset, length, bytes.length), length);  
}

// 法4
public String(byte[] bytes, int offset, int length, Charset charset) {  
    this(Objects.requireNonNull(charset), bytes, checkBoundsOffCount(offset, length, bytes.length), length);  
}
```
> [!note] 实现原理
> 提示: 法1和法2均已弃用
> 1. 法3: 
> 	- 实现原理: 
> 		- 使用指定字符集解码字符数组
> 		- `lookupCharset()`方法查找字符集编码, `checkBoundsOffsetCount()` 进行边界检查
> 		- 如果字符集不支持则抛出 UnsupportedEncodingException
> 2. 法4: 
> 	- 实现原理
> 		- 使用指定的字符集对象解码字节数组
> 		- `Objects.requireNonNull()` 确保 charset 不为 null, `checkBoundsOffsetCount()` 进行边界检查
> 
## 3.5 其他构造方法
```Java
public String(int[] codePoints, int offset, int count) {  
    checkBoundsOffCount(offset, count, codePoints.length);  
    if (count == 0) {  
        this.value = "".value;  
        this.coder = "".coder;  
        return;  
    }    if (COMPACT_STRINGS) {  
        byte[] val = StringUTF16.compress(codePoints, offset, count);  
        this.coder = StringUTF16.coderFromArrayLen(val, count);  
        this.value = val;  
        return;  
    }    this.coder = UTF16;  
    this.value = StringUTF16.toBytes(codePoints, offset, count);  
}
```
> [!note] 实现原理
> 1. 参数验证
> 	- 使用 checkBoundsOffsetCount() 方法验证偏移量和长度的有效性, 确保不会发生数组越界异常
> 2. 空值处理
> 	- 如果count为0, 直接返回空字符串对象, 避免不必要的内存分配
> 3. 内存压缩优化
> 	- 在 COMPACT_STRINGS 条件下，使用 StringUTF16.compress() 方法进行内存压缩
> 	- 根据字符内容自动选择编码方式
> 4. Unicode码点转换
> 	- 使用 StringUTF16.toBytes() 方法将Unicode码点数组转换为字节数组
> 	- 将转换后的字节数组赋值给value
> 	- 设置coder为UTF-16
> 5. 异常的抛出
> 	- IllegalArgumentException
> 		- 触发条件: 在codePoints数组中发现无效的Unicode码点
> 		- 原因: Unicode 码点必须在有效范围内（0x0000 到 0x10FFFF），超出范围或保留的码点被视为无效
> 		- 作用: 保证字符串内容的合法性, 防止创建包含非法字符的字符串
> 	- IndexOutOfBoundsException
> 		- 触发条件: 
> 			- offset为负数
> 			- count为负数
> 			- offset大于`codePoints.length - count`
> 		- 原因: 参数超出数组边界, 无法安全访问指定范围内的内容
> 		- 作用: 防止数组越界, 保证内存安全


---

# 4. String类的核心方法(重要)

## 4.1 长度相关方法
> [!note] length() 方法
> ```Java
> public int length(){
> 	return value.length >> coder();
> }
> ```
> 该方法使用位运算根据coder值计算实际长度
> - LATIN1编码时, 每个字节代表一个字符
> - UTF16编码时, 每两个字节代表一个字符
> 
> 最后返回该字符串的长度


> [!note] 判空
> 1. isEmpty()方法
> ```Java
> public boolean isEmpty(){
> 	return value.length == 0;
> }
> ```
> - 实现方式: 通过直接检查字符串的长度来判断**字符串是否为空**
> 
> 2. isBlank()方法
> ```Java
> public boolean isBlank() {  
    >return indexOfNonWhitespace() == length();  
}
> ```
> - 实现方式: 通过`indexOfNonWhitespace()`方法判断字符串是否为空白
> 
> 二者的区别:
> - 功能:
> 	- `isEmpty()`: 判断字符串长度是否为0
> 	- `isBlank()`: 判断字符串是否为空白(包含空格,制表符等空白字符)
> - 比较逻辑:
> 	- `isEmpty()`: 只检查长度不考虑内容
> 	- `isBlank()`: 检查每个字符是否为空
> - 返回值:
> 	- `isEmpty()`: 仅当字符串长度为0时返回true
> 	- `isBlank()`: 当字符串只包含空白字符或为空时返回true
> - 使用场景
> 	- `isEmpty()`: 检查字符串是否为空
> 	- `isBlank()`: 检查字符串是否空白,用于输入验证
> 二者在功能上有明显区别, 后者会更严格的检查字符串的内容

## 4.2 字符串访问相关方法
> [!note] charAt(int index) 方法
> ```java
> public char charAt(int index) {  
>    if (isLatin1()) {  
>        return StringLatin1.charAt(value, index);  
>    } else {  
>        return StringUTF16.charAt(value, index);  
>    }
>}
> ```
> - 实现原理: 根据不同的编码方式进行不同的处理
> - 形参: index --> 相应值的索引
> - 返回值: 此字符串指定索引处的char值
> - 抛出异常: 当索引越界时, 抛出 IndexOutOfBoundsException, 保证安全性


## 4.3 字符串比较

> [!note] equals(Object object) 方法
> ```Java
> public boolean equals(Object anObject) {  
>    if (this == anObject) {  
>        return true;  
>    }    return (anObject instanceof String aString)  
>            && (!COMPACT_STRINGS || this.coder == aString.coder)  
>            && StringLatin1.equals(value, aString.value);  
>}
> ```
> - 实现原理: 
> 	- 首先检验引用是否相同, 如果两个对象是同一个引用(地址相同), 返回true; 
> 	- 类型检查, 检查对象是否为String类型
> 	- 编码方式匹配, 确保编码方式相同时才进行比较
> 	- 字符数组的比较, 该方法会处理不同编码方式下的字符比较
> - 形参: 传入另一个对象
> - 返回值: 如果上述条件都满足则返回true, 反之返回false

> [!note] equalsIgnoreCase() 方法
> ```Java
>public boolean equalsIgnoreCase(String anotherString) {  
>    return (this == anotherString) ? true  
>            : (anotherString != null)  
>            && (anotherString.length() == length())  
>            && regionMatches(true, 0, anotherString, 0, length());  
>}
> ```
> - 实现原理: 
> 	- 检查引用是否相等
> 	- 非空检查
> 	- 比较长度 --> 如果长度不同直接返回false, 是一个重要的"快速失败"机制
> 	- 核心区域比较 --> regionMatches方法中的五个参数详解
> 		1. ignoreCase = true --> 指定本次比较忽略大小写
> 		2. toffset = 0 --> 从当前字符串的起始位置开始比较
> 		3.  other = anotherString --> 指定比较对象
> 		4. ooffset = 0 --> 从另一个字符串的起始索引开始比较
> 		5. len = length() -> 比较长度是当前字符串的长度
> - 形参: 传入要比较的字符串
> - 返回值: 如果忽略大小写后, 两个字符串对象的内容完全相同, 返回true, 反之返回false

> [!note] compareTo(String anotherString) 方法
> ```Java
> public int compareTo(String anotherString) {  
>    byte[] v1 = value;  
>    byte[] v2 = anotherString.value;  
>    byte coder = coder();  
>    if (coder == anotherString.coder()) {  
>        return coder == LATIN1 ? StringLatin1.compareTo(v1, v2)  
>                               : StringUTF16.compareTo(v1, v2);  
>     }
>   return coder == LATIN1 ? StringLatin1.compareToUTF16(v1, v2)  
>                           : StringUTF16.compareToLatin1(v1, v2);  
> }
> ```
> - 实现原理: 按照字典顺序比较字符串
> - 形参: 另一个比较的字符串
> - 返回值: 按照字典顺序该String对象位于参数字符串之前则比较结果是一个负整数,位于参数字符串之后则比较结果是一个正整数,如果相等则返回0

## 4.4 字符串查找
> [!note] indexOf(String str) 方法
> ```Java
> public int indexOf(String str) {  
>    byte coder = coder();  
>    if (coder == str.coder()) {  
>        return isLatin1() ? StringLatin1.indexOf(value, str.value)  
>                          : StringUTF16.indexOf(value, str.value);  
>    }    if (coder == LATIN1) {  // str.coder == UTF16  
>        return -1;  
>    }    return StringUTF16.indexOfLatin1(value, str.value);  
>}
> ```
> - 实现原理: 根据不同的编码方式实现不同的查找方法. 在Latin1编码下, 每个字节代表一个字符; 而在UTF16编码下, 每两个字节代表一个字符, 使用`value.length >> 1`来获取实际字符数
> - 形参: 传入一个字符
> - 返回值: 如果找到, 返回第一个子字符串的索引位置, 如果没有则返回-1

> [!note] lastIndexOf()方法
> 核心方法
> ```Java
> // 字符串和AbstractStringBuilder共享的用于搜索的代码。源字符数组是被搜索的字符数组，目标字符串是待搜索的字符串。
> static int lastIndexOf(byte[] src, 
> 						byte srcCoder, 
> 						int srcCount,  
> 						String tgtStr, 
> 						int fromIndex) {  
>    byte[] tgt = tgtStr.value;  
>    byte tgtCoder = tgtStr.coder();  
>    int tgtCount = tgtStr.length();  
>        
>    int rightIndex = srcCount - tgtCount;  
>    if (fromIndex > rightIndex) {  
>        fromIndex = rightIndex;  
>    }    if (fromIndex < 0) {  
>        return -1;  
>    }    
>    /* Empty string always matches. */  
>    if (tgtCount == 0) {  
>        return fromIndex;  
>    }    if (srcCoder == tgtCoder) {  
>        return srcCoder == LATIN1  
>            ? StringLatin1.lastIndexOf(src, srcCount, tgt, tgtCount, fromIndex)  
>            : StringUTF16.lastIndexOf(src, srcCount, tgt, tgtCount, fromIndex);  
>    }    if (srcCoder == LATIN1) {    // && tgtCoder == UTF16  
>        return -1;  
>    }    // srcCoder == UTF16 && tgtCoder == LATIN1  
>    >return StringUTF16.lastIndexOfLatin1(src, srcCount, tgt, tgtCount, fromIndex);  
>}
> ```
> 具体实现
> ```Java
> // 返回此字符串中指定子字符串最后一次出现的位置索引，搜索从指定索引开始向后进行。
> public int lastIndexOf(String str, int fromIndex) {  
>    return lastIndexOf(value, coder(), length(), str, fromIndex);  
>}
>// 调用上述方法实现从后向前查找的方法
>public int lastIndexOf(String str) {  
>    return lastIndexOf(str, length());  
>}
> ```

> [!note] startsWith(String prefix)和endsWith(String suffix)方法
> 二者共用一个方法:
> ```Java
> >public boolean startsWith(String prefix, int toffset) {  
>    // Note: toffset might be near -1>>>1.  
>    if (toffset < 0 || toffset > length() - prefix.length()) {  
>        return false;  
>    }    byte[] ta = value;  
>    byte[] pa = prefix.value;  
>    int po = 0;  
>    int pc = pa.length;  
>    byte coder = coder();  
>    if (coder == prefix.coder()) {  
>        if (coder == UTF16) {  
>            toffset <<= UTF16;  
>        }        
>        return ArraysSupport.mismatch(ta, toffset,  
>                pa, 0, pc) < 0;  
>    } else {  
>        if (coder == LATIN1) {  // && pcoder == UTF16  
>            return false;  
>        }        // coder == UTF16 && pcoder == LATIN1)  
>        while (po < pc) {  
>            if (StringUTF16.getChar(ta, toffset++) != (pa[po++] & 0xff)) {  
>                return false;  
>           }
>       }
>   }    
>   return true;  
>}
> ```
> - 实现原理:
> 	1. 验证参数: 检查偏移量是否有效, 防止数组越界
> 	2. 获取字符数组
> 	3. 编码方式匹配, 并对不同的编码方式做处理
> 	4. 返回结果, 如果所有字符都匹配则返回true, 反之返回false
> 
> 1. startsWith(String prefix)
> ```java
> public boolean startsWith(String prefix){
> 	return startsWith(prefix,0)
> }
> ```
> - 实现:指定起始偏移量为0, 检查字符串是否以指定字符开头
> - 形参: 传入一个字符
> - 返回值: 如果匹配则返回true
> 2. endsWith(String prefix)
> ```java
> public boolean endsWith(String suffix){
> 	return startsWith(suffix,length()-suffix.length())
> }
> ```
> - 实现: 指定起始偏移量为`length() - suffix.length()`,即字符串从尾向头推移的起始位置,检查字符串是否以指定字符结尾
> - 形参: 传入一个字符
> - 返回值: 如果匹配则返回true
> 

> [!note] contains(CharSequence s) 方法
> ```java
> public boolean contains(CharSequence s) {  
>    return indexOf(s.toString()) >= 0;  
>}
> ```
> - 实现原理: 将字符序列转换为字符串后调用`indexOf()`方法查找
> - 形参: 指定字符序列
> - 返回值: 如果包含该字符序列返回true, 反之返回false

## 4.5 字符串截取
> [!note] `subString(int beginIndex,int endIndex)` 方法
> ```java
> public String substring(int beginIndex, int endIndex) {  
>    int length = length();  
>    checkBoundsBeginEnd(beginIndex, endIndex, length);  
>    if (beginIndex == 0 && endIndex == length) {  
>        return this;  
>    }    
>    int subLen = endIndex - beginIndex;  
>    return isLatin1() 
>    ? 
>    StringLatin1.newString(value, beginIndex, subLen)
>    : 
>    StringUTF16.newString(value, beginIndex, subLen);
>}
> ```
> - 实现原理: 
> 	- 先获取字符串长度
> 	- 进行边界检查
> 	- 如果目标是整个字符串,直接返回该字符串
> 	- 计算子串的长度
> 	- 根据编码方式选择不同的创建方法
> 	- 创建并返回一个*新的字符串对象*
> - 形参: 起始索引和结束索引(**左闭右开**区间)
> - 返回值: 返回一个字符串对象

> [!note] subString(int beginIndex) 方法
> ```Java
> public String substring(int beginIndex) {  
>    return substring(beginIndex, length());  
>}
> ```
> 实现原理: 调用之前的`subString(int beginIndex,int endIndex)`方法, 将第二个参数设置为字符串长度进行截取
> 形参: 起始索引
> 返回值: 返回一个字符串对象

> [!note] subSequence(int beginIndex, int endIndex) 方法
> ```Java
> public CharSequence subSequence(int beginIndex, int endIndex) {  
>    return this.substring(beginIndex, endIndex);  
>}
> ```
> - 实现原理: 调用`substring(int beginIndex, int endIndex)`方法截取指定范围内(左闭右开区间)的字符串
> - 形参: 起始索引和结束索引
> - 返回CharSequence接口类型(字符序列)
## 4.6 字符串拼接
> [!note] concat(String str)方法
> ```java 
> public String concat(String str) {  
>    if (str.isEmpty()) {  
>        return this;  
>    }    return StringConcatHelper.simpleConcat(this, str);  
>}
> ```
> - 实现原理: 
> 	- 如果当前字符串为空,则返回当前对象
> 	- 调用 `StringConcatHelper.simpleConcat()` 方法进行实际拼接
> 		- 在`StringConcatHelper.simpleConcat()` 方法中, 会创建新的字节数组储存结果, 然后分别复制当前字符串和目标字符串的内容进行拼接, 然后返回新的字符串对象
> - 形参: 要拼接的字符串
> - 返回值: 拼接后的**新的字符串对象**

> [!note] join方法
> 底层函数:
> ```Java
> @ForceInline  
>static String join(String prefix, String suffix, String delimiter, String[] elements, int size) {  
>    int icoder = prefix.coder() | suffix.coder();  
>    long len = (long) prefix.length() + suffix.length();  
>    if (size > 1) { // when there are more than one element, size - 1 delimiters will be emitted  
>        len += (long) (size - 1) * delimiter.length();  
>        icoder |= delimiter.coder();  
>    }    
>    // assert len > 0L; 
>    // max: (long) Integer.MAX_VALUE << 32  
>    // following loop will add max: (long) Integer.MAX_VALUE * Integer.MAX_VALUE to len    
>    // so len can overflow at most once    
>    for (int i = 0; i < size; i++) {  
>        var el = elements[i];  
>        len += el.length();  
>        icoder |= el.coder();  
>    }    byte coder = (byte) icoder;  
>    // long len overflow check, char -> byte length, int len overflow check  
>    if (len < 0L || (len <<= coder) != (int) len) {  
>        throw new OutOfMemoryError("Requested string length exceeds VM limit");  
>    }    byte[] value = StringConcatHelper.newArray(len);  
>  
>    int off = 0;  
>    prefix.getBytes(value, off, coder); off += prefix.length();  
>    if (size > 0) {  
>        var el = elements[0];  
>        el.getBytes(value, off, coder); off += el.length();  
>        for (int i = 1; i < size; i++) {  
>            delimiter.getBytes(value, off, coder); off += delimiter.length();  
>            el = elements[i];  
>            el.getBytes(value, off, coder); off += el.length();  
>        }
>    }    
>    suffix.getBytes(value, off, coder);  
>    // assert off + suffix.length() == value.length >> coder;  
>  
>    return new String(value, coder);  
>}
> ```
> - 实现原理
> 	- 长度计算: 计算出前后缀,分隔符和所有元素的总长度, 使用long防止整数溢出
> 	- 确定编码方式
> 	- 内存分配: 使用 `StringConcatHelper.newArray()` 分配足够空间, 预先计算长度, 避免多次扩容
> 	- 数组赋值: 依次将前缀,元素,分隔符,后缀复制到目标数组, 使用`getBytes()`方法直接复制字节数组, 避免字符转换开销.
> 	- 结果返回: 创建新的String对象, 返回拼接后的字符串
> 
> 具体实现
> ```Java
> public static String join(CharSequence delimiter, CharSequence... elements) {  
>    var delim = delimiter.toString();  
>    var elems = new String[elements.length];  
>    for (int i = 0; i < elements.length; i++) {  
>        elems[i] = String.valueOf(elements[i]);  
>    }    return join("", "", delim, elems, elems.length);  
>}
> ```
> - 实现过程: 将字符序列类型的分隔符转换为String对象, 将可变参数elements转换为String数组, 然后调用上述底层方法, 依次传入前缀后缀,分隔符, 元素数组和大小, 返回拼接后的字符串



## 4.7 字符串替换
> [!note] replace(CharSequence tatget , CharSequence replacement)方法
> ```Java
> public String replace(CharSequence target, CharSequence replacement) {  
>    String trgtStr = target.toString();  
>    String replStr = replacement.toString();  
>    int thisLen = length();  
>    int trgtLen = trgtStr.length();  
>    int replLen = replStr.length();  
>
>    if (trgtLen > 0) {  
>        if (trgtLen == 1 && replLen == 1) {  
>            return replace(trgtStr.charAt(0), replStr.charAt(0));  
>        }  
>        boolean thisIsLatin1 = this.isLatin1();  
>        boolean trgtIsLatin1 = trgtStr.isLatin1();  
>        boolean replIsLatin1 = replStr.isLatin1();  
>        String ret = (thisIsLatin1 && trgtIsLatin1 && replIsLatin1)  
>                ? StringLatin1.replace(value, thisLen,  
>                                       trgtStr.value, trgtLen,  
>                                       replStr.value, replLen)  
>                : StringUTF16.replace(value, thisLen, thisIsLatin1,  
>                                      trgtStr.value, trgtLen, trgtIsLatin1,  
>                                      replStr.value, replLen, replIsLatin1);  
>        if (ret != null) {  
>            return ret;  
>        }        
>        return this;  
>
>    } else { // trgtLen == 0  
>        int resultLen;  
>        try {  
>            resultLen = Math.addExact(thisLen, Math.multiplyExact(  
>                    Math.addExact(thisLen, 1), replLen));  
>        } catch (ArithmeticException ignored) {  
>            throw new OutOfMemoryError("Required length exceeds implementation limit");  
>        }  
>        StringBuilder sb = new StringBuilder(resultLen);  
>        sb.append(replStr);  
>        for (int i = 0; i < thisLen; ++i) {  
>            sb.append(charAt(i)).append(replStr);  
>        }        return sb.toString();  
>    }
>}
> ```
> - 实现原理
> 	- 先进行参数转换和长度计算, 统一参数类型, 预计算长度用于后续优化
> 	- 正常替换逻辑 --> trgLen>0: 
> 		- 当替换的目标是单个字符且替换的内容也是单个字符, 直接调用`replace(char oldChar,char newChar)`方法
> 		- 检测编码方式, 根据不同的编码方式选择不同的方法.
> 		- 处理结果
> 	- 边界条件处理 --> trgLen=0
> 		- 使用`Math.addExact/multiplyExact`在溢出时抛出异常
> 	- 进行字符串的构建
> 		- 预分配正确大小的StringBuilder, 先添加原字符串, 再遍历每个元字符, 后面都跟一个replacement, 最后构建结果字符串
> - 形参: 模板字符串和要替换的字符串
> - 返回: 返回替换了指定字符/字符串的新字符串
> - 注意: 替换从字符串的开头进行到结尾，例如，将字符串“aaa”中的“aa”替换为“b”将导致“ba”而不是“ab”。

## 4.8 字符串分割
> [!note] 核心方法和两种常用实现
> - 核心方法
> ```java
> private String[] split(char ch, int limit, boolean withDelimiters) {  
>    int matchCount = 0;  
>    int off = 0;  
>    int next;  
>    boolean limited = limit > 0;  
>    ArrayList<String> list = new ArrayList<>();  
>    String del = withDelimiters ? String.valueOf(ch) : null;  
>    while ((next = indexOf(ch, off)) != -1) {  
>        if (!limited || matchCount < limit - 1) {  
>            list.add(substring(off, next));  
>            if (withDelimiters) {  
>                list.add(del);  
>            }            
>            off = next + 1;  
>            ++matchCount;  
>        } else {    // last one  
>            int last = length();  
>            list.add(substring(off, last));  
>            off = last;  
>            ++matchCount;  
>            break;  
>        }    
>   }
>    // If no match was found, return this  
>    if (off == 0)  
>        return new String[] {this};  
>  
>    // Add remaining segment  
>    if (!limited || matchCount < limit)  
>        list.add(substring(off, length()));  
>  
>    // Construct result  
>    int resultSize = list.size();  
>    if (limit == 0) {  
>        while (resultSize > 0 && list.get(resultSize - 1).isEmpty()) {  
>            resultSize--;  
>        }
>    }    
>    String[] result = new String[resultSize];  
>    return list.subList(0, resultSize).toArray(result);  
>}
> ```
> - 实现原理:
> 	- 主循环 --> 通过indexOf()查找分隔符,直至找不到为止
> 	- 片段添加 --> 将分隔符前的子串添加到列表，根据 withDelimiters 参数决定是否添加分隔符
> 	- 限制处理 --> 根据 limit 参数控制分割次数，避免无限分割
> 	- 剩余部分 --> 添加最后一个子串
> 	- 结果构造 --> 将列表转换为数组并返回
> - 传参: 
> 	- ch: 分隔符字符，用于查找分割位置
> 	- limit: 分割次数限制，0表示不限制，正数表示最大分割次数
> 	- withDelimiters: 是否包含分隔符，true时在结果中包含分隔符
> - 返回值: 
> 	- 返回一个 `String[]` 数组，包含分割后的所有子串
> 	- 如果原字符串中没有找到分隔符，返回包含原字符串的单元素数组
> 	- 根据 limit 和 withDelimiters 参数的不同，返回结果可能有所不同
> 
> - 具体实现
> 1. split(String regex)
> ```java
> public String[] split(String regex) {  
>    return split(regex, 0, false);  
>}
> ```
> - 实现原理: 调用重载方法, 使limit=0
> - 传参: 正则表达式
> - 返回: 返回所有分割后的子串
> 2. split(String regex, int limit)
> ```java
> public String[] splitWithDelimiters(String regex, int limit) {  
>    return split(regex, limit, true);  
>}
> ```
> - 实现原理: 调用重载方法, 使withDelimiters=false
> - 传参: 传入正则表达式和limit
> - 返回: 返回分割后的子串
> 


## 4.9 其他操作字符串的方法
> [!note] 大小写转换
> 1. toLowerCase()
> 底层代码
> ```java
>public String toLowerCase(Locale locale) {  
>    return isLatin1() ? StringLatin1.toLowerCase(this, value, locale)  
>                      : StringUTF16.toLowerCase(this, value, locale);  
>}
> ```
> 具体实现
> ```Java
> public String toLowerCase() {  
>    return toLowerCase(Locale.getDefault());  
>}
> ```
> 
> 2. toUpperCase()
> 底层代码
> ```java
> public String toUpperCase(Locale locale) {  
>    return isLatin1() ? StringLatin1.toUpperCase(this, value, locale)  
>                      : StringUTF16.toUpperCase(this, value, locale);  
>}
> ```
> 具体实现
> ```Java
> public String tuUpperCase(){
> 	return toUpperCase(Locale.getDefault());
> }
> ```
> 
> - 实现原理: 二者实现原理几乎完全相同, 先判断编码方式, 然后按照不同的编码方式选择不同的方案进行转换




> [!note] 去除空格
> ```Java
> public String trim() {  
>    String ret = isLatin1() ? StringLatin1.trim(value)  
>                            : StringUTF16.trim(value);  
>    return ret == null ? this : ret;  
>}
> ```
> - 实现原理: 根据不同的编码方式进行不同的处理, 最后返回去除空格后的字符串

> [!note] 去掉所有前导和尾随空格
> ```Java
> public String strip() {  
>    String ret = isLatin1() ? StringLatin1.strip(value)  
>                            : StringUTF16.strip(value);  
>    return ret == null ? this : ret;  
>}
> ```
> - 实现原理: 通过不同的编码方式调用相应的方法, 最后返回去除首尾空格的字符串, 如果该String对象为空, 或字符串中所有的代码点都是空格, 则返回空串

> [!note] 去掉前导或尾随空格
> 1. 去掉前导空格
> ```Java
> public String stripLeading() {  
>    String ret = isLatin1() ? StringLatin1.stripLeading(value)  
>                            : StringUTF16.stripLeading(value);  
>    return ret == null ? this : ret;  
>}
> ```
> 
> 2. 去掉末尾空格
> ```Java
> public String stripTrailing() {  
>    String ret = isLatin1() ? StringLatin1.stripTrailing(value)  
>                            : StringUTF16.stripTrailing(value);  
>    return ret == null ? this : ret;  
>}
> ```
> 二者实现方式同上述去掉前导和尾随空格的方法

> [!note] 格式化字符串
> ```Java
> public static String format(String format, Object... args) {  
>    return new Formatter().format(format, args).toString();  
>}
> ```
> - 实现原理: 创建Fommater对象调用format()方法进行实际格式化, 将格式化后的结果转换为字符串
> - 传参: 
> 	- format: 格式化模板字符串
> 	- args: 要插入的参数数组
> - 返回: 返回格式化后的字符串

> [!note] 将当前对象的内容转换为字符串
> ```Java
> public String toString(){
> 	return this;
> }
> ```

> [!note] 获取字符串的值
> ```Java
> public static String valueOf(Object obj) {  
>    return (obj == null) ? "null" : obj.toString();  
>}
> ```
> - 实现原理: 判断对象是否为空, 如果为空返回空值, 如果非空,则将对象转换为字符串并返回
> - 传参: 任意对象
> - 返回: 将对象转换为字符串后的值
> 
> 此外, 该方法还有基本数据类型的重载,用于将不同的数据内容转换为字符串并返回

> [!note] 重复输出字符串
> repeatCopyRest方法
> ```Java
> static void repeatCopyRest(byte[] buffer, int offset, int limit, int copied) >{  
>    // Initial copy is in the buffer.  
>    for (; copied < limit - copied; copied <<= 1) {  
>        // Power of two duplicate.  
>        System.arraycopy(buffer, offset, buffer, offset + copied, copied);  
>    }    // Duplicate remainder.  
>    System.arraycopy(buffer, offset, buffer, offset + copied, limit - copied);
>}
> ```
> repeat方法调用上述方法:
> ```Java
> public String repeat(int count) {  
    >if (count < 0) {  
>        throw new IllegalArgumentException("count is negative: " + count);  
>    }    if (count == 1) {  
>        return this;  
>    }    final int len = value.length;  
>    if (len == 0 || count == 0) {  
>        return "";  
>    }    if (Integer.MAX_VALUE / count < len) {  
>        throw new OutOfMemoryError("Required length exceeds implementation limit");  
>    }    if (len == 1) {  
>        final byte[] single = new byte[count];  
>        Arrays.fill(single, value[0]);  
>        return new String(single, coder);  
>    }    final int limit = len * count;  
>    final byte[] multiple = new byte[limit];  
>    System.arraycopy(value, 0, multiple, 0, len);  
>    repeatCopyRest(multiple, 0, limit, len);  
>    return new String(multiple, coder);  
>}
> ```
> - 实现原理: 
> 	- 先进行参数验证, 检查count是否为负数, 如果为负数则抛出`IllegalArgumentException`异常; 如果count为1, 直接返回当前字符串对象; 如果count为0, 返回空字符串
> 	- 检查内存溢出: 防止创建过大的字符串
> 	- 单字符优化: 如果字符串只有一个字符, 则用`Arrays.fill()`方法填充
> 	- 多字符处理: 
> 		- 预分配足够空间的字节数组
> 		- 使用`System.arraycopy()`复制数据
> 		- 调用`repeatCopyRest()`完成剩余复制
> 	- 创建**新的字符串对象**并返回

> [!note] 复制字符串的值
> copyValueOf 方法用于从字符数组创建字符串，是 valueOf 方法的别名, 有两种重载方式
> 1.  `copyValueOf(char[] data, int offset, int count)`
> ```Java
> public static String copyValueOf(char[] data, int offset, int count) {  
>    return new String(data, offset, count);  
>}
> ```
> - 传参: 
> 	- data: 字符数组
> 	- offset: 子数组起始偏移量
> 	- count: 子数组的长度
> - 功能: 从字符数组指定范围创建字符串
> - 如果参数无效则抛出`IndexOutOfBoundsException`
> 
> 2.  `copyValueOf(char[] data)`
> ```Java
> public static String copyValueOf(char[] data) {  
>    return new String(data);  
>}
> ```
> - 传参: 
> 	- data: 字符数组
> - 功能: 从整个字符数组创建字符串
> - 不修改原数组的内容(复制一个新的字符串对象)
> 




---

# 5. String类的内存管理

## 5.1 字符串常量池
> [!note] 概述
> - String 类使用字符串常量池来存储字符串字面量和通过 intern() 方法添加的字符串
> - 常量池位于方法区（Method Area），由JVM管理
### 工作原理
```Java
// 示例代码
String s1 = "hello";
String s2 = "hello";
String s3 = new String("hello");
```
> [!tip] 说明
> - s1 和 s2 指向常量池中的同一个对象(字符串内容相同, 哈希码相同)
> - s3 创建了新的对象，但其内容在常量池中存在
### `intern()`方法
```Java
// 位于String源代码中

/**
* 返回字符串对象的规范表示形式。
 一个初始为空的字符串池由String类私有维护。
 当调用intern方法时，如果池中已存在与当前String对象通过equals(Object)方法判定相等的字符串，则返回池中的字符串；否则，将该String对象加入池中，并返回指向该String对象的引用。
 由此可知，对于任意两个字符串s和t，当且仅当s.equals(t)为真时，s.intern() == t.intern()才为真。
 
 @return 一个与本字符串内容相同的字符串，但保证来自唯一字符串池
*/
public native String intern();
```

> [!tip] 实现原理
> - 将字符串对象添加到常量池
> - 如果常量池中已存在相同内容的字符串，返回该字符串的引用
> - 否则将当前字符串添加到常量池并返回引用

## 5.2 内存分配和回收
### 对象创建
> [!note] 具体实现
> - 每次调用 new String() 都会创建新的对象
> - *使用字符串字面量时*，首先检查常量池，存在则复用，不存在则创建并加入常量池
### 内存占用
> [!note] 具体实现
> - String 对象包含字符数组、哈希码等字段
> - 不可变性导致频繁操作会产生大量临时对象
### 垃圾回收
> [!note] 具体实现
> - 临时字符串对象在不再被引用后会被垃圾回收
> - 常量池中的字符串不会被自动清理，除非显式调用 System.gc()

## 5.3 内存优化策略
### 字符串拼接优化
> [!note] 具体实现
> - 避免使用 + 进行字符串拼接
> - 使用 StringBuilder 或 StringBuffer 进行频繁拼接
### 字符串常量池的利用
> [!note] 具体实现
> - 优先使用字符串字面量
> - 合理使用 intern() 方法减少重复字符串
### 内存监控
> [!note] 具体实现
> - 使用 jmap 等工具监控堆内存使用情况
> - 分析字符串对象的数量和大小

## 5.4 实际应用案例
### Web应用中的字符串处理
> [!example] 使用场景
> - URL参数解析
> - HTTP请求头处理
> - JSON数据解析

### 数据库操作
> [!example] 使用场景
> - SQL语句构建
> - 查询条件拼接
> - 结果集处理
### 日志记录
> [!example] 使用场景
> - 日志信息格式化
> - 异常信息记录
> - 性能监控数据收集

---

# 6. String类的性能优化
## 6.1 字符串拼接性能分析
### `+`操作符对性能的影响
> [!note] 概述
> - 使用 + 进行字符串拼接会**产生大量临时对象**
> - 每次拼接都会创建新的 String 对象
> - 频繁操作会导致内存分配和垃圾回收开销
```Java
// 性能较差的写法
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "hello";
}
```

### StringBuilder优化
> [!note] 概述
> - 使用 StringBuilder 可以避免频繁创建临时对象
> - 所有操作都在同一个可变对象上进行
> - 减少内存分配和垃圾回收开销
```Java
// 性能优化的写法
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("hello");
}
String result = sb.toString();
```

## 6.2 构造函数和初始化优化
### 初始容量设置
> [!note] 具体设置
>- 合理设置 StringBuilder 的初始容量可以避免频繁扩容
>- 默认容量为16，如果知道大致长度，建议设置合适的初始值
>```Java
>// 设置合理初始容量
>StringBuilder sb = new StringBuilder(1000);
>```
### 字符数组构造
> [!note] 具体实现
> - 使用字符数组构造 String 对象可以提高性能
> - 避免了字符数组到字符串的转换开销
> ```Java
> char[] chars = {'h', 'e', 'l', 'l', 'o'};
> String str = String.valueOf(chars);
> ```

## 6.3 哈希码计算优化
### 哈希码缓存机制
> [!note] 概述
> 在第二章我们分析过String的核心字段, 其中就有*哈希码*和*标记哈希码是否为0的布尔值*
> 通过缓存哈希码避免重复计算

### 哈希码计算算法
> [!note] 具体实现
> - 使用 hashCode() 方法计算哈希码
> - 算法基于字符串内容，相同的字符串总是产生相同的哈希码
```Java
/**
* 返回此字符串的哈希码。String对象的哈希码计算方式为
  s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
  使用int算术，其中s[i]是字符串的第i个字符，n是字符串的长度，^表示求幂。（空字符串的哈希值为零。）
  
  @return 这个对象的哈希码
*/
public int hashCode() {  
    /*
    hash 或 hashIsZero 字段存在良性的数据竞争，因此必须确保：此方法中的计算结果在任何可能读取这些字段的情况下，都能始终保持正确。为了在没有显式内存屏障或类似并发原语的情况下保证正确性，必要的限制是：对于给定的 String 实例，我们只能写入这两个字段中的一个，并且计算是幂等的、且派生自不可变状态。
    */ 
    int h = hash;
    if (h == 0 && !hashIsZero) {  
        h = isLatin1() ? StringLatin1.hashCode(value)  
                       : StringUTF16.hashCode(value);  
        if (h == 0) {  
            hashIsZero = true;  
        } else {  
            hash = h;  
        }    }    return h;  
}
```

## 6.4 字符串比较优化
### `equals()`方法优化
> [!tip] 实现步骤
> - equals() 方法首先检查引用是否相同
> - 再检查类型和长度，最后比较字符数组内容(避免冗余计算)
> 
> 提示: 该方法的代码位于**5.3**

### `compareTo()`方法优化
> [!tip] 实现原理
> - 先确定编码方式,然后根据编码方式进行如下操作
> - `compareTo()`方法按字典顺序比较两个字符串
> - 比较字符逐个进行，如果前缀相同，较短的字符串排在前面
> 
> 提示: 该方法的源代码位于**5.3**


## 6.5 字符串分割优化
### `split()`方法优化
> [!tip] 实现步骤
> - split() 方法使用正则表达式进行分割
> - 支持复杂的分割需求
> 
> 提示: 该方法的源代码位于**5.8**

### 自定义分割
> [!tip] 实现步骤
> - 在需要高性能分割时，可以实现自定义分割逻辑
> - 避免正则表达式的解析开销


---

# 7. String相关工具类
> [!note] 概述
> String 对象被设计为**不可变（Immutable）​**​ 的（由 `final`修饰的 `char[]`支撑），这带来了**线程安全**、**缓存哈希值**、**安全性**等优点。然而，在进行大量字符串修改操作（如拼接、替换）时，每次修改都会产生新的 String 对象，对**内存开销**和**性能**极其不友好。
> 
>  因此, Java提供了两类**可变的字符串**
> 1. StringBuilder
> 2. StringBuffer

## 7.1 StringBuilder
> [!note] 简介(由原文翻译而来)
> 一个可变的字符序列。该类提供了一个与 `StringBuffer` 兼容的 API，但不保证同步（即线程安全）。这个类被设计用在**单个线程**使用字符串缓冲区的地方（通常情况都是如此），作为 `StringBuffer` 的直接替代品。在可能的情况下，**推荐优先使用此类而不是 `StringBuffer`**，因为在大多数实现中它会**更快**。
>
>`StringBuilder` 的主要操作是 `append`（追加）和 `insert`（插入）方法，它们被重载以接受任何类型的数据。每个方法都会将给定数据有效地转换为字符串，然后将该字符串的字符追加或插入到字符串构建器中。`append` 方法总是将这些字符添加到构建器的**末尾**；而 `insert` 方法则将这些字符添加到一个**指定位置**。
>
>例如，如果 `z` 引用一个当前内容为 "start" 的 string builder 对象，那么调用 `z.append("le")` 会使字符串构建器包含 "startle"，而 `z.insert(4, "le")` 则会将其内容更改为 "starlet"。
>
>通常，如果 `sb` 引用一个 `StringBuilder` 的实例，那么 `sb.append(x)` 的效果与 `sb.insert(sb.length(), x)` 相同。
>
>每个字符串构建器都有一个**容量**。只要字符串构建器中包含的字符序列的**长度不超过其容量**，就无需分配新的内部缓冲区。如果内部缓冲区溢出，它会**自动扩容**。
>
>`StringBuilder` 的实例**不适合由多个线程使用**。如果需要这种同步，则建议使用 `StringBuffer`。
>
>除非另有说明，**将 `null` 参数传递给此类的构造函数或方法将导致抛出 `NullPointerException`**。

> [!tip] API说明
> `StringBuilder`实现了`Comparable`接口，但未重写`equals`方法。因此，`StringBuilder`的自然排序与`equals`方法不一致。若将`StringBuilder`对象用作`SortedMap`的键或`SortedSet`的元素，需格外谨慎。更多信息请参阅`Comparable`、`SortedMap`或`SortedSet`。


> [!example] 源代码
```Java
public final class StringBuilder  
    extends AbstractStringBuilder  
    implements Appendable, java.io.Serializable, Comparable<StringBuilder>, CharSequence  
{  
	// 使用serialVersionUID以实现互操作性
    static final long serialVersionUID = 4383685877147921099L;  
  
	/**
	* 无参构造
	  创建一个初始容量为16的StringBuilder对象
	  调用父类 AbstractStringBuilder 的构造函数
	  适用于大多数场景，无需指定初始容量
	*/
	@IntrinsicCandidate
    public StringBuilder() {  
        super(16);  
    }  
    
    /**
    * 创建一个初始容量由capacity参数指定、且不包含任何字符的字符串构建器。
      
      @param capacity初始容量
      @throws 如果容量为负数,抛出NegativeArraySizeException
      适用于已知字符串长度的场景,避免频繁扩容
    */
    @IntrinsicCandidate
    public StringBuilder(int capacity) {  
        super(capacity);  
    }  
    
    /**
    * 构造一个初始化为指定字符串内容的字符串生成器。
      字符串生成器的初始容量为16加上字符串参数的长度
      适用于已有字符串需要修改的场景
      
      @param str 缓冲区的初始内容
    */
    @IntrinsicCandidate
    public StringBuilder(String str) {  
        super(str);  
    }  
    
    /**
    * 构造一个字符串生成器，其中包含与指定CharSequence相同的字符。
      字符串生成器的初始容量为16加上CharSequence参数的长度
      
      @param seq 要复制的字符序列
    */
    public StringBuilder(CharSequence seq) {  
        super(seq);  
    }  
    
    /**
    * 按字典顺序比较两个StringBuilder实例。
      此方法遵循CharSequence.compare（This，other）方法中定义的词典比较规则
      
      @param another 另一个StringBuilder对象
      @return 如果此StringBuilder包含与参数StringBuilder相同的字符序列，则值为0；
      如果此StringBuilder在字典上小于StringBuilder参数，则为负整数；
      或者，如果此StringBuilder在字典上大于StringBuilder参数，则为正整数。
    */
    @Override  
    public int compareTo(StringBuilder another) {  
        return super.compareTo(another);  
    }  
    
    /**
    * 将对象转换为字符串后追加
      使用 String.valueOf() 方法处理 null 对象
    */
    @Override  
    public StringBuilder append(Object obj) {  
        return append(String.valueOf(obj));  
    }  
    
    /**
    * 调用父类 AbstractStringBuilder 的 append 方法
      支持 null 字符串，自动转换为 "null"
      返回当前对象引用，支持链式调用
    */
    @Override  
    @IntrinsicCandidate    
    public StringBuilder append(String str) {  
        super.append(str);  
        return this;  
    }  
    
    /**
    * 将 StringBuffer 对象的内容追加到当前对象
      调用父类的 append 方法
      支持 null 对象，自动转换为 "null"
    */
    public StringBuilder append(StringBuffer sb) {  
        super.append(sb);  
        return this;  
    }  
    
    /**
    * 追加任意字符序列
      支持 String、StringBuilder、StringBuffer 等实现 CharSequence 接口的对象
      调用父类的 append 方法
    */
    @Override  
    public StringBuilder append(CharSequence s) {  
        super.append(s);  
        return this;  
    }  
     
    /**
    * 追加字符序列的指定子串
      @param start 起始索引
      @param end 结束索引
      @throws IndexOutOfBoundsException 数组越界异常
    */
    @Override  
    public StringBuilder append(CharSequence s, int start, int end) {  
        super.append(s, start, end);  
        return this;  
    }  
    
    /**
    * 追加整个字符数组
      将字符数组内容复制到当前对象
    */
    @Override  
    public StringBuilder append(char[] str) {  
        super.append(str);  
        return this;  
    }  
       
    /**
    * 追加字符数组的指定子数组
      @param offset 起始偏移量
      @param len 要追加的长度
      @throws IndexOutOfBoundsException 数组索引越界异常
    */
    @Override  
    public StringBuilder append(char[] str, int offset, int len) {  
        super.append(str, offset, len);  
        return this;  
    }  
    
    /**
    * 追加布尔值
      将 true 或 false 字符串追加到当前对象
    */
    @Override  
    public StringBuilder append(boolean b) {  
        super.append(b);  
        return this;  
    }  
    
    /**
    * 追加单个字符
      将字符追加到当前对象末尾
    */
    @Override  
    @IntrinsicCandidate    public StringBuilder append(char c) {  
        super.append(c);  
        return this;  
    }  
    
    /**
    * 追加整数
      将整数转换为字符串后追加到当前对象
    */
    @Override  
    @IntrinsicCandidate    public StringBuilder append(int i) {  
        super.append(i);  
        return this;  
    }  
    
    /**
    * 追加长整数
      将长整数转换为字符串后追加到当前对象
    */
    @Override  
    public StringBuilder append(long lng) {  
        super.append(lng);  
        return this;  
    }  
    
    /**
    * 追加浮点数
      将浮点数转换为字符串后追加到当前对象
    */
    @Override  
    public StringBuilder append(float f) {  
        super.append(f);  
        return this;  
    }  
    
    /**
    * 追加双精度浮点数
      将双精度浮点数转换为字符串后追加到当前对象
    */
    @Override  
    public StringBuilder append(double d) {  
        super.append(d);  
        return this;  
    }  
        
        
    /**
    * 将指定的 Unicode 码点追加到当前 StringBuilder 对象
    */
    @Override  
    public StringBuilder appendCodePoint(int codePoint) {  
        super.appendCodePoint(codePoint);  
        return this;  
    }  
       
    /**
    * 删除指定范围内的字符
      @param start 起始索引(包含)
      @param end 结束索引(不包含)
      @throws StringIndexOutOfBoundsException
    */   
    @Override  
    public StringBuilder delete(int start, int end) {  
        super.delete(start, end);  
        return this;  
    }  
    
    /**
    * 删除指定位置的单个字符
      @param index 要删除的字符索引
      @throws StringIndexOutOfBoundsException
    */    
    @Override  
    public StringBuilder deleteCharAt(int index) {  
        super.deleteCharAt(index);  
        return this;  
    }  
    
    /**
    * 替换指定范围内的字符
      @param start 起始索引（包含）
      @param end 结束索引（不包含）
      @param str 要插入的字符串
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder replace(int start, int end, String str) {  
        super.replace(start, end, str);  
        return this;  
    }  
    
    /**
    * 在指定位置插入字符数组的子数组
      @param index 插入位置
      @param str 字符数组
      @param offset 子数组起始偏移量
      @param len 子数组长度
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int index, char[] str, int offset,  
                                int len)  
    {        super.insert(index, str, offset, len);  
        return this;  
    }  
    
    /**
    * 在指定位置插入对象, 支持 null 对象，自动转换为 "null"
      对象会先转换为字符串再插入
      @param offset 插入位置
      @param obj 任意对象
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, Object obj) {  
            super.insert(offset, obj);  
            return this;  
    }  
    
    /**
    * @param offset 插入位置
      @param str 要插入的字符串
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, String str) {  
        super.insert(offset, str);  
        return this;  
    }  
    
    /**
    * 在指定位置插入整个字符数组
      @param offset 插入位置
      @param str 要插入的字符数组
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, char[] str) {  
        super.insert(offset, str);  
        return this;  
    }  
    
    /**
    * 在指定位置插入字符序列
      @param dstOffset 插入位置
      @param s 要插入的字符序列
      @throws IndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int dstOffset, CharSequence s) {  
            super.insert(dstOffset, s);  
            return this;  
    }  
    
    /**
    * 在指定位置插入字符序列的子串
      @param dstOffset 插入位置
      @param s 字符序列
      @param start 起始索引(包含)
      @param end 结束索引(不包含)
      @throws IndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int dstOffset, CharSequence s,  
                                int start, int end)  
    {        
	    super.insert(dstOffset, s, start, end);  
	    return this;  
    }  
    
    /**
    * 在指定位置插入布尔值
      @param offset 插入位置
      @param b 要插入的布尔值
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, boolean b) {  
        super.insert(offset, b);  
        return this;  
    }  
    
    /**
    * 在指定位置插入单个字符
      @param offset 插入位置
      @param c 要插入的字符
      @throws IndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, char c) {  
        super.insert(offset, c);  
        return this;  
    }  
    
    /**
    * 在指定位置插入整数
      @param offset 插入位置
      @param i 要插入的整数
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, int i) {  
        super.insert(offset, i);  
        return this;  
    }  
    
    /**
    * 在指定位置插入长整数
      @param offset 插入位置
      @param l 要插入的长整数
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, long l) {  
        super.insert(offset, l);  
        return this;  
    }  
    
    /**
    * 在指定位置插入浮点数
      @param offset 插入位置
      @param f 要插入的浮点数
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, float f) {  
        super.insert(offset, f);  
        return this;  
    }  
    
    /**
    * 在指定位置插入双精度浮点数
      @param offset 插入位置
      @param d 要插入的双精度浮点数
      @throws StringIndexOutOfBoundsException
    */
    @Override  
    public StringBuilder insert(int offset, double d) {  
        super.insert(offset, d);  
        return this;  
    }  
    
    /**
    * 查找指定字符串第一次出现的位置, 返回索引值，如果未找到返回 -1
    */
    @Override  
    public int indexOf(String str) {  
        return super.indexOf(str);  
    }  
    
    /**
    * 从指定位置开始查找字符串第一次出现的位置,返回索引值，如果未找到返回 -1
      @param fromIndex 起始搜索位置
    */
    @Override  
    public int indexOf(String str, int fromIndex) {  
        return super.indexOf(str, fromIndex);  
    }  
    
    /**
    *  查找指定字符串最后一次出现的位置,返回索引值，如果未找到返回 -1
    */
    @Override  
    public int lastIndexOf(String str) {  
        return super.lastIndexOf(str);  
    }  
    
    /**
    * 从指定位置开始反向查找字符串最后一次出现的位置,返回索引值，如果未找到返回 -1
      @param fromIndex 起始搜索位置
    */
    @Override  
    public int lastIndexOf(String str, int fromIndex) {  
        return super.lastIndexOf(str, fromIndex);  
    }  
    
    /**
    * 反转字符串
      实际实现位于父类中，使用双指针技术进行字符交换
      @return 将原字符串反转后返回
    */
    @Override  
    public StringBuilder reverse() {  
        super.reverse();  
        return this;  
    }  
    
    /**
    * 重复指定的 Unicode 码点指定次数
      @param codePoint 要重复的 Unicode 码点
      @param count 重复次数
      @throws IllegalArgumentException
    */
    @Override  
    public StringBuilder repeat(int codePoint, int count) {  
        super.repeat(codePoint, count);  
        return this;  
    }  
    
    /**
    * 重复指定的字符序列指定次数
      @param cs 要重复的字符序列
      @param count 重复次数
      @throws IllegalArgumentException
    */
    @Override  
    public StringBuilder repeat(CharSequence cs, int count) {  
        super.repeat(cs, count);  
        return this;  
    }  
    
    /**
    * 将StringBuilder对象转换为String 对象
      实现原理: 如果长度为0，直接返回空字符串,否则创建一个新的 String 对象
      使用当前 StringBuilder 对象作为参数
      不共享字符数组，确保安全性
    */
    @Override  
    @IntrinsicCandidate    public String toString() {  
        if (length() == 0) {  
            return "";  
        }        // Create a copy, don't share the array  
        return new String(this, null);  
    }  
    
    /**
    * 序列化方法: 将 StringBuilder 对象的状态保存到流中
      @param s 写入数据的ObjectOutputStream
      @throws IOException
    */
    @Serial  
    private void writeObject(ObjectOutputStream s) throws IOException {  
        s.defaultWriteObject();  
        s.writeInt(count);  
        char[] val = new char[capacity()];  
        if (isLatin1()) {  
            StringLatin1.getChars(value, 0, count, val, 0);  
        } else {  
            StringUTF16.getChars(value, 0, count, val, 0);  
        }        s.writeObject(val);  
    }  
    
    /**
    * 反序列化方法: 从流中恢复 StringBuilder 对象的状态
      @param s 从中读取数据的ObjectInputStream
      @throws ClassNotFoundException
      @throws IOException
    */
    @Serial  
    private void readObject(ObjectInputStream s)  
            throws IOException, ClassNotFoundException {  
        s.defaultReadObject();  
        int c = s.readInt();  
        char[] val = (char[]) s.readObject();  
        if (c < 0 || c > val.length) {  
            throw new StreamCorruptedException("count value invalid");  
        }        initBytes(val, 0, val.length);  
        count = c;  
    }
}
```

## 7.2 StringBuffer
> [!note] 简介
> 一个**线程安全**的、可变的字符序列。字符串缓冲区类似于 `String`，但可以修改。在任何时间点，它都包含某个特定的字符序列，但该序列的长度和内容可以通过某些方法调用进行更改。
>
>字符串缓冲区可**安全地用于多线程**。方法在必要时进行了**同步**，因此对任何特定实例的所有操作都表现为以某种串行顺序发生，该顺序与每个相关线程的方法调用顺序一致。
>
>`StringBuffer` 的主要操作是 `append`（追加）和 `insert`（插入）方法，它们被重载以接受任何类型的数据。每个方法都会将给定数据有效地转换为字符串，然后将该字符串的字符追加或插入到字符串缓冲区中。`append` 方法总是将这些字符添加到缓冲区的**末尾**；而 `insert` 方法则将这些字符添加到一个**指定位置**。
>
>例如，如果 `z` 引用一个当前内容为 "start" 的 string buffer 对象，那么调用 `z.append("le")` 会使字符串缓冲区包含 "startle"，而 `z.insert(4, "le")` 则会将其内容更改为 "starlet"。
>
>通常，如果 `sb` 引用一个 `StringBuffer` 的实例，那么 `sb.append(x)` 的效果与 `sb.insert(sb.length(), x)` 相同。
>
>当涉及源序列的操作（例如从源序列追加或插入）发生时，**此类仅同步正在执行操作的字符串缓冲区，而不同步源序列**。请注意，虽然 `StringBuffer` 被设计为可安全地并发用于多线程，但如果构造函数或 `append` 或 `insert` 操作接收到的源序列是跨线程共享的，则调用代码必须确保在操作期间，该操作对源序列有一致且不变的视图。这可以通过调用方在操作调用期间持有锁、使用不可变的源序列或不跨线程共享源序列来满足。
>
>每个字符串缓冲区都有一个**容量**。只要字符串缓冲区中包含的字符序列的**长度不超过其容量**，就无需分配新的内部缓冲区数组。如果内部缓冲区溢出，它会**自动扩容**。
>
>除非另有说明，**将 `null` 参数传递给此类的构造函数或方法将导致抛出 `NullPointerException`**。
>
>从 JDK 5 开始，此类已经增加了一个为**单线程**使用而设计的等效类 `StringBuilder`。**通常应优先使用 `StringBuilder` 类**，因为它支持所有相同的操作，但由于不执行同步，因此**速度更快**。

> [!tip] API说明
> StringBuffer实现了Comparable，但*不重写equals*。因此，StringBuffer的自然顺序与equals不一致。如果StringBuffer对象用作SortedMap中的键或SortedSet中的元素，则应小心

> [!example] 源代码
> 
```Java
public final class StringBuffer  
    extends AbstractStringBuilder  
    implements Appendable, Serializable, Comparable<StringBuffer>, CharSequence  
{  
  
    /**
    * toString返回的最后一个值的缓存。每当修改StringBuffer时都会清除。
    */
    private transient String toStringCache;  
  
    /** use serialVersionUID from JDK 1.0.2 for interoperability
	    使用JDK 1.0.2中的serialVersionUID实现互操作性 */  
    @Serial  
    static final long serialVersionUID = 3388685877147921107L;  
  
    /**
    * 无参构造
      构造一个字符串缓冲区，其中没有字符，初始容量为16个字符。
    */
    @IntrinsicCandidate  
    public StringBuffer() {  
        super(16);  
    }  
    
    /**
    * 指定容量构造函数
      构造一个字符串缓冲区，其中没有字符，并且具有指定的初始容量。
      @param capacity 容量
      @throws NegativeArraySizeException 如果容量为负数抛出数组长度为负的异常
    */
    @IntrinsicCandidate  
    public StringBuffer(int capacity) {  
        super(capacity);  
    }  
    
    /**
    * 指定字符串构造函数
      构造一个初始化为指定字符串内容的字符串缓冲区。字符串缓冲区的初始容量为16加上字符串参数的长度。
      @param str 缓冲区的初始内容
    */
   @IntrinsicCandidate  
    public StringBuffer(String str) {  
        super(str);  
    }  
    
    /**
    * 指定字符序列构造函数
      构造一个字符串缓冲区，其中包含与指定CharSequence相同的字符。字符串缓冲区的初始容量为16加上CharSequence参数的长度。
      @param seq 要复制的字符序列
    */
    public StringBuffer(CharSequence seq) {  
        super(seq);  
    }  
    
    /**
    * 按字典顺序比较两个StringBuffer实例。
      此方法遵循CharSequence.compare(this, another)方法中定义的字典顺序比较规则。
      如需更细粒度且考虑区域设置的字符串比较，请参阅java.text.Collator类。
      @param another 另一个StringBuffer对象
      @return 如果此 StringBuffer 包含与参数 StringBuffer 相同的字符序列，则返回值为 0；如果此 StringBuffer 按字典顺序小于参数 StringBuffer，则返回负整数；如果此 StringBuffer 按字典顺序大于参数 StringBuffer，则返回正整数。
      实现: 此方法对当前对象（即this）进行同步，但不对StringBuffer对象进行同步
      说明: 与此StringBuffer进行比较
    */
    @Override  
    public synchronized int compareTo(StringBuffer another) {  
        return super.compareTo(another);  
    } 
    /**
    * 返回当前字符串的长度
    */
    @Override  
    public synchronized int length() {  
        return count;  
    }  
    /**
    * 返回字符数组的容量
      调用父类 AbstractStringBuilder 的 capacity() 方法
    */
    @Override  
    public synchronized int capacity() {  
        return super.capacity();  
    }  
  
	/**
    * 确保字符数组的容量至少为指定值
      调用父类 AbstractStringBuilder 的 ensureCapacity() 方法
    */
    @Override  
    public synchronized void ensureCapacity(int minimumCapacity) {  
        super.ensureCapacity(minimumCapacity);  
    }  
    
    /**
    * 将字符数组的容量调整为实际长度
      调用父类 AbstractStringBuilder 的 trimToSize() 方法
    */    
    @Override  
    public synchronized void trimToSize() {  
        super.trimToSize();  
    }  
    
    /**
    * 设置 StringBuffer 对象的长度
      清除字符串缓存，确保后续 toString() 调用返回最新内容
      @param newLength 新的长度值
      @throws IndexOutOfBoundsException 如果参数为负,抛出数组越界异常
    */
    @Override  
    public synchronized void setLength(int newLength) {  
        toStringCache = null;  
        super.setLength(newLength);  
    }  
    
    /**
    * 返回指定索引位置的字符
      @param index 指定索引位置
      @return 指定索引位置的字符
      @throws IndexOutOfBoundsException 索引超出范围则抛出索引越界异常
    */
    @Override  
    public synchronized char charAt(int index) {  
        return super.charAt(index);  
    }  
    
    /**
    * 返回指定索引位置的 Unicode 码点
      @param index 指定索引位置
      @return 指定索引位置的Unicode码点
      @throws IndexOutOfBoundsException 索引超出范围则抛出索引越界异常
    */
    @Override  
    public synchronized int codePointAt(int index) {  
        return super.codePointAt(index);  
    }  
    
    /**
    * 返回指定索引位置之前字符的 Unicode 码点
      @param index 指定索引位置
      @return 指定索引位置之前字符的Unicode码点
      @throws IndexOutOfBoundsException 索引超出范围则抛出索引越界异常
    */
    @Override  
    public synchronized int codePointBefore(int index) {  
        return super.codePointBefore(index);  
    }  
    
    /**
    * 计算指定范围内 Unicode 码点的数量
      @param beginIndex 起始索引(包含)
      @param endIndex 结束索引(不包含)
      @return 指定范围内的Unicode码点数量
      @throws IndexOutOfBoundsException 索引超出范围则抛出索引越界异常
    */
    @Override  
    public synchronized int codePointCount(int beginIndex, int endIndex) {  
        return super.codePointCount(beginIndex, endIndex);  
    }  
    
    /**
    * 计算从指定索引位置开始，偏移指定数量的 Unicode 码点后的新索引
      @param index 起始索引位置
      @param codePointOffset 要偏移的Unicode码点数量,正数表示向前,负数表示向后
      @return 偏移指定数量的Unicode码点后的新索引
      @throws IndexOutOfBoundsException index超出范围或偏移后超出范围,抛出索引越界异常
    */
    @Override  
    public synchronized int offsetByCodePoints(int index, int codePointOffset) {  
        return super.offsetByCodePoints(index, codePointOffset);  
    }  
    /**
    * 将 StringBuffer 对象中指定范围的字符复制到目标字符数组
      调用父类 AbstractStringBuilder 的 getChars 方法
      @param srcBegin 源字符串起始索引(包含)
      @param srcEnd 源字符串结束索引(不包含)
      @param dst 目标字符数组
      @param dstBegin 目标数组起始索引
      @throws IndexOutOfBoundsException 任何参数无效都会抛出索引越界异常
    */
    @Override  
    public synchronized void getChars(int srcBegin, int srcEnd, char[] dst,  
                                      int dstBegin)  
    {   super.getChars(srcBegin, srcEnd, dst, dstBegin);  }  
    
    /**
    * 设置 StringBuffer 对象中指定索引位置的字符
      @param index 要设置的字符索引位置
      @param ch 要设置的新字符
      @throws IndexOutOfBoundsException 索引越界抛出对应异常
    */    
    @Override  
    public synchronized void setCharAt(int index, char ch) {  
        toStringCache = null;  
        super.setCharAt(index, ch);  
    }  
    
    /**
    * 将对象转换为字符串后追加
      使用 String.valueOf() 处理 null 对象
      清除缓存，确保后续 toString() 返回最新内容
    */
    @Override  
    public synchronized StringBuffer append(Object obj) {  
        toStringCache = null;  
        super.append(String.valueOf(obj));  
        return this;  
    }  
    
    /**
    * 追加字符串,支持 null 字符串，自动转换为 "null"
    */
    @Override  
    @IntrinsicCandidate    public synchronized StringBuffer append(String str) {  
        toStringCache = null;  
        super.append(str);  
        return this;  
    }  
    /**
    * 追加另一个 StringBuffer 对象的内容,支持 null 对象，自动转换为 "null"
    */
    public synchronized StringBuffer append(StringBuffer sb) {  
        toStringCache = null;  
        super.append(sb);  
        return this;  
    }  
    
    /**
    * 追加 AbstractStringBuilder 对象的内容,支持 null 对象，自动转换为 "null"
    */
   @Override  
    synchronized StringBuffer append(AbstractStringBuilder asb) {  
        toStringCache = null;  
        super.append(asb);  
        return this;  
    }  
    /**
    * 追加任意字符序列
      支持 String、StringBuilder、StringBuffer 等实现 CharSequence 接口的对象
    */    
    @Override  
    public synchronized StringBuffer append(CharSequence s) {  
        toStringCache = null;  
        super.append(s);  
        return this;  
    }  
    /**
    * 追加字符序列的指定子串
      @param start 起始索引(包含)
      @param end 结束索引(不包含)
    */    
    @Override  
    public synchronized StringBuffer append(CharSequence s, int start, int end)  
    {        toStringCache = null;  
        super.append(s, start, end);  
        return this;  
    }  
    
    /**
    * 追加整个字符数组,将字符数组内容复制到当前对象
    */
    @Override  
    public synchronized StringBuffer append(char[] str) {  
        toStringCache = null;  
        super.append(str);  
        return this;  
    }  
    /**
    * 追加字符数组的指定子数组
      @param str 目标字符数组
      @param offset 起始偏移量
      @param len 追加的长度
    */    
    @Override  
    public synchronized StringBuffer append(char[] str, int offset, int len) {  
        toStringCache = null;  
        super.append(str, offset, len);  
        return this;  
    }  
    
    /**
    * 追加布尔值,将 true 或 false 字符串追加到当前对象
    */
    @Override  
    public synchronized StringBuffer append(boolean b) {  
        toStringCache = null;  
        super.append(b);  
        return this;  
    }  
    
    /**
    * 追加单个字符,将字符追加到当前对象末尾
    */
    @Override  
    @IntrinsicCandidate    public synchronized StringBuffer append(char c) {  
        toStringCache = null;  
        super.append(c);  
        return this;  
    }  
    
    /**
    * 追加整数,将整数转换为字符串后追加到当前对象
    */
    @Override  
    @IntrinsicCandidate    public synchronized StringBuffer append(int i) {  
        toStringCache = null;  
        super.append(i);  
        return this;  
    }  
    
    /**
    * 追加指定的 Unicode 码点,支持完整的 Unicode 字符集
    */   
    @Override  
    public synchronized StringBuffer appendCodePoint(int codePoint) {  
        toStringCache = null;  
        super.appendCodePoint(codePoint);  
        return this;  
    }  
    
    /**
    * 追加长整数,将长整数转换为字符串后追加到当前对象
    */
    @Override  
    public synchronized StringBuffer append(long lng) {  
        toStringCache = null;  
        super.append(lng);  
        return this;  
    }  
    
    /**
    * 追加浮点数,将浮点数转换为字符串后追加到当前对象
    */
    @Override  
    public synchronized StringBuffer append(float f) {  
        toStringCache = null;  
        super.append(f);  
        return this;  
    }  
    
    /**
    * 追加双精度浮点数,将双精度浮点数转换为字符串后追加到当前对象
    */
    @Override  
    public synchronized StringBuffer append(double d) {  
        toStringCache = null;  
        super.append(d);  
        return this;  
    }  
    
    /**
    * 
    */    
    @Override  
    public synchronized StringBuffer delete(int start, int end) {  
        toStringCache = null;  
        super.delete(start, end);  
        return this;  
    }  
    
    /**
    * 删除 StringBuffer 对象中指定范围内的字符
      @param start 起始索引(包含)
      @param end 结束索引(包含)
      @throws StringIndexOutOfBoundsException 索引超出范围抛出异常
    */    
    @Override  
    public synchronized StringBuffer deleteCharAt(int index) {  
        toStringCache = null;  
        super.deleteCharAt(index);  
        return this;  
    }  
    /**
    * 替换 StringBuffer 对象中指定范围内的字符
      @param start 起始索引(包含)
      @param end 结束索引(不包含)
      @param str 要插入的字符串
      @throws StringIndexOutOfBoundsException
    */    
    @Override  
    public synchronized StringBuffer replace(int start, int end, String str) {  
        toStringCache = null;  
        super.replace(start, end, str);  
        return this;  
    }  
    
    /**
    * 返回从指定索引开始到末尾的子字符串
      @param start 起始索引(包含)
      @throws StringIndexOutOfBoundsException
    */   
    @Override  
    public synchronized String substring(int start) {  
        return substring(start, count);  
    }  
    
    /**
    * 返回指定范围内的字符序列
      @param start 起始索引(包含)
      @param end 结束索引(不包含)
      @throws IndexOutOfBoundsException
    */    
    @Override  
    public synchronized CharSequence subSequence(int start, int end) {  
        return super.substring(start, end);  
    }  
    /**  
     * 返回指定范围内的子字符串
       调用父类 AbstractStringBuilder 的 substring 方法
       @param start 起始索引(包含)
       @param end 结束索引(不包含)
       @throws StringIndexOutOfBoundsException 
     * 
     */    
    @Override  
    public synchronized String substring(int start, int end) {  
        return super.substring(start, end);  
    }  
    
    /**
    * 在指定位置插入字符数组的子数组
      @param index 插入位置
      @param str 字符数组
      @param offset 起始偏移量
      @param len 子数组长度
      @throws StringIndexOutOfBoundsException
    */    
    @Override  
    public synchronized StringBuffer insert(int index, char[] str, int offset,  
                                            int len)  
    {        toStringCache = null;  
        super.insert(index, str, offset, len);  
        return this;  
    }  
    
    /**
    * 在指定位置插入对象
      对象会先转换为字符串再插入,支持 null 对象，自动转换为 "null"
      @throws StringIndexOutOfBoundsException
    */   
    @Override  
    public synchronized StringBuffer insert(int offset, Object obj) {  
        toStringCache = null;  
        super.insert(offset, String.valueOf(obj));  
        return this;  
    }  
    
    /**
    * 在指定位置插入字符串
      @param offset 插入位置
      @param str 要插入的字符串
      @throws StringIndexOutOfBoundsException
    */    
    @Override  
    public synchronized StringBuffer insert(int offset, String str) {  
        toStringCache = null;  
        super.insert(offset, str);  
        return this;  
    }  
    
    /**
    * 在指定位置插入整个字符数组
      @param offset 插入位置
      @param str 要插入的字符数组
      @throws StringIndexOutOfBoundsException
    */    
    @Override  
    public synchronized StringBuffer insert(int offset, char[] str) {  
        toStringCache = null;  
        super.insert(offset, str);  
        return this;  
    }  
    
    /**
    * 在指定位置插入字符序列
      @param dstOffset 插入位置
      @param s 要插入的字符序列
      @throws IndexOutOfBoundsException
    */
    @Override  
    public StringBuffer insert(int dstOffset, CharSequence s) {  
        // Note, synchronization achieved via invocations of other StringBuffer methods  
        // after narrowing of s to specific type        // Ditto for toStringCache clearing        super.insert(dstOffset, s);  
        return this;  
    }  
    
    /**
    * 在指定位置插入字符序列的子串
      @param dstOffset 插入位置
      @param s 字符序列
      @param start 起始索引(包含)
      @param end 结束索引(不包含)
      @throws IndexOutOfBoundsException
    */   
    @Override  
    public synchronized StringBuffer insert(int dstOffset, CharSequence s,  
            int start, int end)  
    {        toStringCache = null;  
        super.insert(dstOffset, s, start, end);  
        return this;  
    }  
    
    /**
     * 在指定位置插入布尔值
       @param offset 插入位置
       @param b 要插入的布尔值
       @throws StringIndexOutOfBoundsException
     */    
    @Override  
    public  StringBuffer insert(int offset, boolean b) {  
        // Note, synchronization achieved via invocation of StringBuffer insert(int, String)  
        // after conversion of b to String by super class method        // Ditto for toStringCache clearing        super.insert(offset, b);  
        return this;  
    }  
    /**
    * 在指定位置插入单个字符
      @param offset 插入位置
      @param c 要插入的字符
      @throws IndexOutOfBoundsException
    */    
    @Override  
    public synchronized StringBuffer insert(int offset, char c) {  
        toStringCache = null;  
        super.insert(offset, c);  
        return this;  
    }  
    
    /**
     * 在指定位置插入整数
       @param offset 插入位置
       @param i 要插入的整数
       @throws StringIndexOutOfBoundsException
     */   
    @Override  
    public StringBuffer insert(int offset, int i) {  
        // Note, synchronization achieved via invocation of StringBuffer insert(int, String)  
        // after conversion of i to String by super class method        // Ditto for toStringCache clearing        super.insert(offset, i);  
        return this;  
    }  
    
    /**  
     * 在指定位置插入长整数
       @param offset 插入位置
       @param l 要插入的长整数
       @throws StringIndexOutOfBoundsException 
     */    
     @Override  
    public StringBuffer insert(int offset, long l) {  
        // Note, synchronization achieved via invocation of StringBuffer insert(int, String)  
        // after conversion of l to String by super class method        // Ditto for toStringCache clearing        super.insert(offset, l);  
        return this;  
    }  
    
    /**  
     * 在指定位置插入浮点数
       @param offset 插入位置
       @param f 要插入的浮点数
       @throws StringIndexOutOfBoundsException 
     */    
     @Override  
    public StringBuffer insert(int offset, float f) {  
        // Note, synchronization achieved via invocation of StringBuffer insert(int, String)  
        // after conversion of f to String by super class method        // Ditto for toStringCache clearing        super.insert(offset, f);  
        return this;  
    }  
    
    /**  
     * 在指定位置插入双精度浮点数
       @param offset 插入位置
       @param d 要插入的双精度浮点数
       @throws StringIndexOutOfBoundsException 
     */    
     @Override  
    public StringBuffer insert(int offset, double d) {  
        // Note, synchronization achieved via invocation of StringBuffer insert(int, String)  
        // after conversion of d to String by super class method        // Ditto for toStringCache clearing        super.insert(offset, d);  
        return this;  
    }  
    
    
    /**  
     * 查找指定字符串第一次出现的位置
       @return 返回索引值，如果未找到返回 -1
     */    
     @Override  
    public int indexOf(String str) {  
        // Note, synchronization achieved via invocations of other StringBuffer methods  
        return super.indexOf(str);  
    }  
    
    
    /**  
     * 从指定位置开始查找字符串第一次出现的位置
       @param fromIndex 起始搜索位置
       @return 返回索引值，如果未找到返回 -1
     */    
     @Override  
    public synchronized int indexOf(String str, int fromIndex) {  
        return super.indexOf(str, fromIndex);  
    }  
    
    
    /**  
     * 查找指定字符串最后一次出现的位置
       @return 返回索引值，如果未找到返回 -1
     */    
     @Override  
    public int lastIndexOf(String str) {  
        // Note, synchronization achieved via invocations of other StringBuffer methods  
        return lastIndexOf(str, count);  
    }  
    
    
    /**  
     * 从指定位置开始反向查找字符串最后一次出现的位置
       @param fromIndex 起始搜索位置
       @return 返回索引值，如果未找到返回 -1
     */    
    @Override  
    public synchronized int lastIndexOf(String str, int fromIndex) {  
        return super.lastIndexOf(str, fromIndex);  
    }  
    
    
    /**  
     * 将 StringBuffer 对象中的字符顺序反转
       清除字符串缓存，确保后续 toString() 调用返回最新内容
       用父类 AbstractStringBuilder 的 reverse 方法执行实际反转操作
       返回当前对象引用，支持链式调用
     */    
    @Override  
    public synchronized StringBuffer reverse() {  
        toStringCache = null;  
        super.reverse();  
        return this;  
    }  
    
    
    /**  
     * 重复指定的 Unicode 码点指定次数
       @param codePoint 要重复的Unicode码点
       @param count 重复次数
       @throws IllegalArgumentException  如果计数为负或码点无效,抛出异常
     */    
    @Override  
    public synchronized StringBuffer repeat(int codePoint, int count) {  
        toStringCache = null;  
        super.repeat(codePoint, count);  
        return this;  
    }  
    
    
    /**  
     * 重复指定的字符序列指定次数
       @param cs 要重复的字符序列
       @param count 重复次数
       @throws IllegalArgumentException 如果计数为负,抛出异常
     */    
    @Override  
    public synchronized StringBuffer repeat(CharSequence cs, int count) {  
        toStringCache = null;  
        super.repeat(cs, count);  
        return this;  
    }  
    
    /**
    * 将 StringBuffer 对象转换为 String 对象
      如果长度为0，直接返回空字符串
      如果缓存为空，创建新的 String 对象并存储到缓存中
      否则返回缓存的 String 对象的副本
    */
    @Override  
    @IntrinsicCandidate    
    public synchronized String toString() {  
        if (length() == 0) {  
            return "";  
        }        if (toStringCache == null) {  
            return toStringCache = new String(this, null);  
        }        return new String(toStringCache);  
    }  
    
    
    /**  
     * StringBuffer 类的静态字段，用于定义序列化时的持久化字段
       @param value 字符数组,存储字符串的内容
       @param count 整数,存储字符串长度
       @param shared 布尔值,表示是否共享
     */    
    @Serial  
    private static final ObjectStreamField[] serialPersistentFields =  
    {  
        new ObjectStreamField("value", char[].class),  
        new ObjectStreamField("count", Integer.TYPE),  
        new ObjectStreamField("shared", Boolean.TYPE),  
    };  
    
    
    /**
     * 将 StringBuffer 对象的状态保存到流中
       步骤: 
       获取 PutField 对象用于写入字段
       创建字符数组存储数据
       根据编码方式复制字符数据
       写入字段值
       写入所有字段
       @param s 写入数据的ObjectOutputStream
       @throws IOException if an I/O error occurs
     */    
    @Serial  
    private synchronized void writeObject(ObjectOutputStream s)  
            throws IOException {  
        ObjectOutputStream.PutField fields = s.putFields();  
        char[] val = new char[capacity()];  
        if (isLatin1()) {  
            StringLatin1.getChars(value, 0, count, val, 0);  
        } else {  
            StringUTF16.getChars(value, 0, count, val, 0);  
        }        fields.put("value", val);  
        fields.put("count", count);  
        fields.put("shared", false);  
        s.writeFields();  
    }  
    
    
    /**  
     * 反序列化方法：从流中恢复 StringBuffer 对象的状态
       步骤: 
       获取 GetField 对象用于读取字段
       读取字符数组和计数值
       验证数据有效性
       初始化内部状态
       @param s 从中读取数据的ObjectInputStream
     * @throws IOException if an I/O error occurs  
     * @throws ClassNotFoundException if a serialized class cannot be loaded  
     */    
     @Serial  
    private void readObject(ObjectInputStream s)  
        throws IOException, ClassNotFoundException {  
        ObjectInputStream.GetField fields = s.readFields();  
  
        char[] val = (char[])fields.get("value", null);  
        int c = fields.get("count", 0);  
        if (c < 0 || c > val.length) {  
            throw new StreamCorruptedException("count value invalid");  
        }        initBytes(val, 0, val.length);  
        count = c;  
        // ignore shared field  
    }  
  
    synchronized void getBytes(byte[] dst, int dstBegin, byte coder) {  
        super.getBytes(dst, dstBegin, coder);  
    }
}
```

> [!tip] 总结
> StringBuffer线程安全的根本原因是其所有方法均由**sychronized**修饰, 确保同一时间只有一个线程可以执行方法, 防止多线程环境下的数据竞争, 因而保证了其线程安全性
## 7.3 字符串工具类的使用
> [!note] 使用建议
> 
>1. 选择原则
>	- 单线程环境：优先使用 StringBuilder
>	- 多线程环境：使用 StringBuffer
>2. 性能对比
>	- StringBuilder：无同步机制，性能更高
>	- StringBuffer：所有公共方法都加了synchronized关键字，线程安全但性能略低
>3. 内存效率
>	- 两者都使用字符数组存储
>	- 初始容量为16，后续按需扩容
>4. 使用建议
>	- 避免在循环中创建大量 String 对象
>	- 使用 StringBuilder 进行字符串拼接
>	- 合理设置初始容量
>5. 最佳实践
>	- 在需要频繁修改字符串的场景下使用 StringBuilder 或 StringBuffer
>	- 在多线程环境下考虑使用 StringBuffer
>	- 考虑使用 StringBuilder 在单线程环境下以提高性能


---
# 8. String类的最佳实践
## 8.1 字符串操作最佳实践
### 字符串拼接
> [!note] 实现方案
> - 避免使用 `+` 操作符：频繁使用 `+` 进行字符串拼接会产生大量临时对象，影响性能
> - 使用 StringBuilder：对于频繁的字符串拼接操作，优先使用 StringBuilder 或 StringBuffer
> - 合理设置初始容量：根据预期长度设置 StringBuilder 的初始容量，避免频繁扩容
```Java
// 不推荐
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "hello";
}

// 推荐
StringBuilder sb = new StringBuilder(1000);
for (int i = 0; i < 1000; i++) {
    sb.append("hello");
}
String result = sb.toString();
```

### 字符串比较
> [!note] 实现方案
> - 使用 equals() 方法：比较字符串内容时使用 equals() 方法，而不是 == 操作符
> - 考虑大小写敏感性：根据需求选择 equals() 或 equalsIgnoreCase()
> - 避免重复比较：缓存比较结果，避免重复计算
```Java
// 不推荐
if (str1 == str2) { ... }

// 推荐
if (str1.equals(str2)) { ... }
```
### 字符串分割
> [!note] 实现方案
> - 使用 split() 方法：对于简单的分割需求，使用 split() 方法
> - 自定义分割逻辑：对于复杂的分割需求，实现自定义分割逻辑，避免正则表达式的解析开销
```Java
// 使用 split 方法
String[] parts = str.split(",");

// 自定义分割逻辑
public static String[] customSplit(String str, char delimiter) {
    List<String> parts = new ArrayList<>();
    int start = 0;
    int end = str.indexOf(delimiter);
    while (end != -1) {
        parts.add(str.substring(start, end));
        start = end + 1;
        end = str.indexOf(delimiter, start);
    }
    parts.add(str.substring(start));
    return parts.toArray(new String[0]);
}
```

## 8.2 内存管理最佳实践
### 字符串常量池利用

> [!note] 实现方案
> - 优先使用字符串字面量：使用字符串字面量可以利用字符串常量池，减少内存占用
> - 合理使用 intern() 方法：对于需要复用的字符串，使用 intern() 方法添加到常量池
```Java
// 推荐
String str1 = "hello";
String str2 = "hello"; // 复用常量池中的对象

// 使用 intern 方法
String str = new String("hello").intern(); // 添加到常量池
```
### 避免不必要的字符串转换
> [!note] 实现方案
> - 避免频繁的字符串转换：如 String 与 `char[]` 之间的转换
> - 直接使用字符数组：在需要字符数组时，直接使用字符数组，避免中间转换
```Java
// 不推荐
String str = "hello";
char[] chars = str.toCharArray();

// 推荐
char[] chars = {'h', 'e', 'l', 'l', 'o'};
String str = String.valueOf(chars);
```
## 8.3 性能优化最佳实践
### 哈希码计算
> [!note] 实现方案
> - 利用哈希码缓存：String 类缓存哈希码，避免重复计算
> - 避免重复调用 hashCode()：缓存哈希码结果，避免重复计算
```Java
// 不推荐
int hash1 = str.hashCode();
int hash2 = str.hashCode(); // 重复计算

// 推荐
int hash = str.hashCode(); // 缓存结果
```
### 字符串查找
> [!note] 实现方案
> - 使用 indexOf() 和 lastIndexOf()：对于简单的查找需求，使用这些方法
> - 避免重复查找：缓存查找结果，避免重复计算
```Java
// 不推荐
int index1 = str.indexOf("hello");
int index2 = str.indexOf("hello"); // 重复查找

// 推荐
int index = str.indexOf("hello"); // 缓存结果
```
## 8.4 安全性最佳实践
### 空值检查
> [!note] 实现方案
> - 检查空值：在使用字符串前检查是否为 null
> - 使用 Objects.requireNonNull()：确保参数不为 null
```Java
// 不推荐
String str = null;
str.length(); // NullPointerException

// 推荐
String str = null;
if (str != null) {
    str.length();
}
```
### 异常处理
> [!note] 实现方案
> - 处理异常：在可能抛出异常的地方进行异常处理
> - 提供有意义的错误信息：在异常消息中提供足够的上下文信息
> 提示: 在String及其工具类中,最常见的异常是数组**索引越界异常**
```Java
// 不推荐
try {
    str.charAt(-1);
} catch (Exception e) {
    // 忽略异常
}

// 推荐
try {
    str.charAt(-1);
} catch (IndexOutOfBoundsException e) {
    System.err.println("索引超出范围: " + e.getMessage());
}
```
