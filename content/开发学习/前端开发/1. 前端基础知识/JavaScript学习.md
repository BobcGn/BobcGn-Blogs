---
title: 'JavaScript学习'
date: 2026-03-11
tags:
  - 开发学习
  - 开发学习/前端开发/基础
---

## 0.JavaScript是脚本语言
> [!note] 概述
> JavaScript  是互联网上最流行的脚本语言，这门语言可用于 HTML 和 web，更可广泛用于服务器、PC、笔记本电脑、平板电脑和智能手机等设备
> - JavaScript 是一种轻量级的编程语言。
> - JavaScript 是可插入 HTML 页面的编程代码。
> - JavaScript 插入 HTML 页面后，可由所有的现代浏览器执行。
> - JavaScript 很容易学习。

## 1.JavaScript快速入门

### 1.1.引入JavaScript
#### 1.1.1.script标签内编写-->在head/body写均可
```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>Title</title>  
  
    <script>        
	    alert("hello world!");  
    </script>  
</head>  
<body>  
</body>  
</html>

```
#### 1.1.2.外部引入-->通过script标签引入.js文件(和css文件做区别,css使用link进行导入)

```JavaScript
alert("hello world")
```

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>Title</title>  
    <script src="../js/first.js"></script>  
</head>  
<body>  
</body>  
</html>
```

### 1.2.基本语法
绝大多数语法与Java类似,以下列出与Java不同的语句标识符

| 语句       | 描述     |
| -------- | ------ |
| function | 定义一个函数 |
| var      | 定义一个变量 |

#### 1.2.1.变量
区别于Java,JavaScript中的变量统一以var来定义
```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>Title</title>  
    <script>        //1.定义变量  
        var num = 1;  
        var a = 2;  
        var b = 3;  
        alert(num)  
        //2.条件语句  (可嵌套)
        if (b > a){  
            alert("b大于a")  
        }  
    </script>  
</head>  
<body>  
  
</body>  
</html>

```

#### 1.2.2.数据类型
JavaScript中的数据类型如下

|  类型  |   关键字表示   |             tips             |
| :--: | :-------: | :--------------------------: |
|  数值  |  Number   | js不区分小数 NAN(特殊:not a number) |
| 动态类型 |    var    |                              |
|  布尔  |  Boolean  |          true/false          |
| 字符串  |  String   |          通过单/双引号引起来          |
|  数组  |   Array   |       保证代码的可读性,建议使用[]        |
|  对象  |  Object   |  键值对通常写法为 **name : value**   |
|  空   |   null    |                              |
| 未定义  | undefined |                              |
##### 1.2.2.1.字符串
- 正常字符串用单/双引号包裹
- 注意转义字符 \
```
\ '
\n
\t
\u4e2d   \u####  Unicode字符
\x4l  ASCII字符
```
- 多行字符串编写 
```JavaScript
var msg = `hello  
world  
my  
name  
is  
Joe`
```
- 模板字符串
```JavaScript
let name = "Joe";  
let age = 18;  
let msg = `你好,${name}`
```
- 字符串长度
```JavaScript
str.length
```
- 字符串可变性-->不可变
- 大小写转换
```JavaScript
student.toUpperCase()
student.toLowerCase()

```
- 获取索引
```JavaScript
student.IndexOf('t')
```
- 截取字符串
```JavaScript
student.substring(1)   //从第一个字符串截取到最后一个
student.substring(1,3) //从第一个字符串截取到第二个
```

##### 1.2.2.2.数组-->Array(可以包含任意类型的数据)
```JavaScript
var arr = [1,2,3,4,5,6]
```
- 获取长度
```JavaScript
arr.length
```
- 获取元素索引
```JavaScript
arr.indexOf(2)
1
```
- 截取数组元素-->包头不包尾,返回一个新数组
```JavaScript
arr.slice(1,5)
```
- push/pop
```JavaScript
arr.push('a','b') //'a'和'b'被压入到尾部
arr.pop()  //'b'被弹出
```
- unshift/shift
```JavaScript
arr.unshift('c','d')   //在头部插入c和d两个字符
arr.unshift('c')       //弹出c
```
- 排序
```JavaScript
arr.sort()
```
- 反转数组
```JavaScript
arr.reverse()
```
- 拼接-->返回新数组,不修改原数组
```JavaScript
["C","B","A"]
arr.concat([1,2,3])
```
- 连接符join
```JavaScript
["C","B","A"]
arr.join('-')
"C-B-A"
```

##### 1.2.2.3.对象
- 创建对象-->用大括号括起来,键值对用冒号连接
```JavaScript
var 对象名 = {
	对象属性名1 : 属性值1,
	对象属性名2 : 属性值2,
	对象属性名3 : 属性值3,
	对象属性名4 : 属性值4
}
```

```JavaScript
var person = {
	name : "Joe",
	age : 18,
	score : 90
}

```

- 对象赋值
```JavaScript
person.name = "Jack"
"Jack"
```
- 用不存在的对象属性不会报错-->undefined
```JavaScript
person.haha
"undefined"
```
- 动态删减
```JavaScript
delete person.name
true
person
```
- 动态添加-->直接为新属性赋值
```JavaScript
person.haha = "haha"
```
- 判断属性值是否在对象中
```JavaScript
'age' in person
"true"
//继承
'toString' in person
"true"
```
判断一个属性是否是这个对象自身拥有的hasOwnProperty()
```JavaScript
person.hasOwnProperty('toString')
"false"
person.hasOwnProperty('age')
"true"
```

#### 1.2.3.运算符
##### 1.2.3.1.算术运算符-->同Java

##### 1.2.3.2.赋值运算符-->同Java

##### 1.2.3.3.比较运算符

|   名称   |  符号  |               tips               |
| :----: | :--: | :------------------------------: |
|   等于   |  ==  |    值相同但是类型不同,仍然返回true(不建议使用)     |
|  绝对等于  | ===  | 值和类型都相同,才会返回true.==NaN与所有数值不相等== |
|  不等于   |  !=  |              同Java               |
| 严格不等于  | !==  |     值和类型有一个不相等，或两个都不相等返回true     |
| 大于(等于) | >/>= |              同Java               |
| 小于(等于) | </<= |              同Java               |

#### 1.2.4.流程控制-->分支/循环-->同Java
```JavaScript
//分支结构
var age = 3;  
if (age>3){  
    alert("haha");  
}  
else {  
    alert("kk")  
}
```

```JavaScript
//循环结构
var age = 3;
while  (age<10){  
    alert("haha");  
    age++;  
}
//forEach方法
var arr = [1,2,3,4,5,6,7,8,9];
arr.forEach(function (item) {  
    console.log(item);  
})
//for...in 循环
for(var num in arr){  
    console.log(arr[num]);
}
```


#### 1.2.5.Map(集合)和Set(无需不重复的集合)
##### 1.2.5.1.Map
```JavaScript
// var names = ["tom","joe","haha"]  
// var scores = [100 ,98 ,99]  
  //-->
var map = new Map([["tom",100],["joe",98],["haha",99]]);
//通过key 获得value
var name = map.get('tom');
console.log(name)
//添加/修改
map.set('admin',97)
//删除
map.delete("tom")
```

##### 1.2.5.2.Set
```JavaScript
//Set会去重
var set = new Set([3,1,1,1,1]);
"[3,1]" 
//添加元素
set.add(5);
"[3,1,5]"
//删除元素
set.delete(3);
"[1,5]"
//是否包含某个元素
console.log(set.has(5))
"true"
```
##### 1.2.5.3.iterator迭代器-->执行遍历操作
```JavaScript
//通过for...of实现 ,for...in返回值是索引!
//遍历数组
var arr = [3,4,5]  
for(var x of arr){  
    console.log(x)  
}
//遍历Map
var map = new map(['a',1],['b',2],['c',4]);  
for(let x in map){  
    console.log(x);  
}
//遍历Set
var set = new Set([1,2,3,4]);  
for(let x of set){  
    console.log(x);  
}
```


### 1.3.函数与面向对象

方法: 对象(属性,方法)

#### 1.3.1.函数的定义与变量作用域
##### 1.3.1.1.定义一个函数-->关键字:function
```JavaScript
//定义方法1:
//定义一个绝对值函数
function abs(x){
	//手动抛出异常  
	if(typeof x !== 'number'){  
	    throw new Error('参数必须为数字');  
	}
	if(x>=0){
		return x;
	}
	else{
		return -x;
	}
}
```


```JavaScript
//定义方法2:
var abs = function(x){
	if(x>=0){
		return x;
	}
	else{
		return -x;
	}
}
```

调用函数
参数问题:JavaScript可以传任意个参数,也可以不传递参数
```JavaScript
//调用函数
abs(10) //10
abs(-10) //10
abs(10,20,30) //10

```
###### arguments
arguments是一个JS免费赠送的关键字,代表传递进来的所有参数,形式为一个数组.但是,arguments包含所有参数,有时候想使用多余的参数进行附加操作,需要排除已有的参数
```JavaScript
function abs(x){  
    console.log("x=>"+ x);  
    for(var i =0 ; i < arguments.length; i++){  
        console.log(arguments[i]);  
    }  
    if(x>=0){  
        return x;  
    }else{  
        return -x;  
    }  
}
```

###### rest
ES6引入的新特性,获取除了已经定义的参数之外的所有参数,以数组的形式输出
```JavaScript
//rest参数只能写在最后面,用...标识
function aaa(a,b,...rest){  
    console.log("a=>"+b);  
    console.log("b=>"+b);  
    console.log(rest);  
    if(arguments.length > 2){  
        for(var i = 2 ; i<=arguments.length; i++){  
            console.log(arguments[i]);  
        }  
    }  
}
```

##### 1.3.1.2.变量作用域
- JavaScript的变量生命周期在声明时初始化,局部变量在函数执行完毕后销毁,全局变量在页面关闭后销毁
- 假设在函数体内声明,则在函数体外不可使用
- 如果两个函数使用相同的变量名,==只要在函数内部,就不冲突==
- JavaScript中只有一个全局作用域,任何变量(函数也可以视为变量),假设没有在函数的作用范围内找到,就会向外查找,如果在全局作用域内也没找到,就会报错(RefrenceError--引用异常)
```JavaScript
function h(){  
    var x = 1;  
    x++;  
}  
// x+=2 -->报错:变量未定义
function g(){  
    var x = 1;  
    x++;  
}
```

- 内部函数可以访问外部函数成员,反之不行
```JavaScript
//内部函数可以访问外部函数成员,反之不行
function f(){  
    var x = 1;;  
    function f1(){  
        var y = x+1;  
    }  
    var z = y-1; //  变量未定义  
}
```

- 假设在JavaScript中函数查找变量从自身函数开始,==由内向外查找==. 假设内部函数的变量和外部函数的变量重名,==内部变量的优先级最高==(内部函数会屏蔽外部函数的变量)
```JavaScript
//内外部变量重名,  函数内部变量优先级高
function fun1(){  
    var x = "A";  
    function fun2(){  
        var x = 114514;  
        console.log(x); //-->  114514  
    }  
    console.log(x);     //-->  A  
}
```


**在函数中定义变量尽量放到函数代码块的最前面,便于维护!**

- 全局函数
```JavaScript
var a = 1;  //默认全局变量都会绑定在window对象下
function f(){  
    console.log(a);  
}  
f();  
console.log(a)
```

- 用关键字==const==定义常量(ES6之前用大写字母定义常量, ES6之后使用const关键字定义)
```javascript
const PI = 3.1415926
```
- 全局变量
```JavaScript
//唯一全局变量
var Hu = {};
//定义全局变量
Hu.name = "hyy";
Hu.add = function(a,b){
	return a+b;
}
```
局部作用域-->let关键字(ES6添加)
```JavaScript
function aaa(){
	for(var i = 0 ; i<100 ; i++){
		console.log(i);
	}
	console.log(i+1); //问题:i出了作用域还能作用
}

//解决方案-->将var换成let
function aaa(){
	for(let i = 0 ; i<100 ; i++){
		console.log(i);
	}
	console.log(i+1); //问题:i出了作用域还能作用
}
```
#### 1.3.2.方法
- 方法就是把函数定义在对象的里面, 对象只有两个东西: 属性和方法
- 调用方法时需要带括号-->hu.age() -->19
```JavaScript
var hu = {  
    name : "hyy",  
    birth : 2006,  
    //方法  
    age : function (){  
        var now = new Date().getFullYear();  
        return now-this.birth;  //this无法指向,默认指向调用它的对象
    }  
}
```
- 在JavaScript中,可以控制this的指向(apply)
```JavaScript
function getAge(){  
    var now = new Date().getFullYear();  
    return now-this.birth;  
}  
var hu = {  
    name : "hyy",  
    birth : 2006,  
    age : getAge()  
    
}  
var xiaoming = {  
    name : "小明",  
    birth : 2006,  
    age : getAge()  
    
}  
//this指向了hu这个对象
getAge.apply(hu,[]);
```
#### 1.3.3.闭包(难点)

#### 1.3.4.箭头函数

#### 1.3.5.创建对象
在JavaScript中, 一切皆为对象,任何js支持的类型都可以用JSON表示
格式:
- 对象都用{}
- 数组都用[]
- 所有的键值对表示都是 key : value
```JavaScript
var user = {  
    name: "hyy",  
    age: 18,  
    sex: "男"  
};
```

#### 1.3.6.原型链继承
原型（Prototype）是JavaScript中==每个对象都具有的属性==，它包含对象的共享属性和方法。当我们创建一个新对象时，这个对象会从原型继承属性和方法。原型链（Prototype Chain）是由对象组成的链式结构，它用于查找对象的属性和方法。当我们访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript引擎会沿着原型链向上查找，直到找到匹配的属性或方法


```JavaScript
var student = {  
    name: '张三',  
    age: 18,  
    sex: '男',  
    run : function (){  
        console.log(this.name+"在运动");  
    }  
};  
  
var xiaoming = {  
    name: '小明'  
};  
  
xiaoming.__proto__ = student;
```

#### 1.3.7.class继承(ES6引入)-->与Java中的操作类似

```JavaScript
function Person(name,age){  
    this.name = name;  
    this.age = age;  
}  
  
//给person新添加方法-->prototype找到原型  
Person.prototype.hello = function(){  
    console.log("hello"+this.name);  
}  
  
//ES6 之后  
class Student{  
	//构造器-->constructor
    constructor(name,age) {  
        this.name = name;  
        this.age = age;  
    }  
	hello(){  
	    console.log("hello"+this.name);  
	}
}
var xiaoming = new Student("xiaoming",18);

class PrimaryStudent extends Student{  
    constructor(name,age,grade){  
        super(name,age);  
        this.grade = grade;  
    }  
    myGrade(){  
        console.log("这是我的年级"+this.grade);  
    }  
}
```


---
# 2.JavaScript进阶

### 2.1.常用对象
#### 2.1.1.Date
定义
```JavaScript
var now = new Date();  
now.getFullYear();      //年份  
now.getMonth();         //月份  
now.getDate();          //日期  
now.getDay();           //星期几  
now.getHours();         //时  
now.getMinutes();       //分  
now.getSeconds();       //秒  
now.getMilliseconds();  //毫秒  
now.getTime();          //时间戳-->距1970年1月1日 00:00:00 GMT+0800 (中国标准时间)的毫秒数
console.log(new Date())
```

转换
```JavaScript
now.toLocaleString()
now.toGMTString()
```
#### 2.1.2.JSON-->轻量级的数据交换格式
- JSON: **J**ava**S**cript **O**bject **N**otation(JavaScript 对象表示法)
- JSON 是存储和交换文本信息的语法，类似 XML。
- JSON 比 XML 更小、更快，更易解析。
- JSON 易于人阅读和编写。

```JavaScript
var user = {  
    name: "hyy",  
    age: 18,  
    sex: "男"  
};  
//对象转json字符串  
var json_user = JSON.stringify(user)    //stringify()转换为字符串  
//json字符串转对象,参数为json字符串  
var user_json = JSON.parse(json_user)   //parse()解析json转换为对象
```


### 2.2.操作DOM对象-->文档对象模型(重点)
##### 核心-->整个浏览器网页就是一个DOM树形结构
要操作一个DOM结点,首先需要获取到这个结点
#### 2.2.0.获取DOM结点(原生代码,后续使用jQuery)
```html
<body>  
<div id="father">  
    <h1>标题1</h1>  
    <p id="p1">p1</p>  
    <p class="p2">p2</p>  
</div>  
  
  
<script>  
    //对应CSS中的选择器  
    var h1 = document.getElementsByTagName('h1')  
    var p1 = document.getElementById('p1')  
    var p2 = document.getElementsByClassName('p2')  
    var father = document.getElementById('father')  
    var children = father.children; //获取子元素  
</script>  
</body>
```
#### 2.2.1.更新DOM
```JavaScript
var id1 = document.getElementById(id1);  
id1.innerText =  "hello world";  
id1.style.color = "red";  
id1.style.fontSize = "20px";  
id1.style.backgroundColor = "yellow";  
id1.style.textAlign = "center";  
id1.style.margin = "auto";  
id1.style.width = "100px";  
id1.style.height = "100px";  
id1.style.border = "1px solid red";  
id1.style.display = "block";  
id1.style.position = "absolute";  
id1.style.left = "50%";  
id1.style.top = "50%";  
id1.style.transform = "translate(-50%,-50%)";  
id1.style.transition = "all 1s";
```
#### 2.2.2.插入DOM
获得了某个DOM结点,假设这个结点是空的,通过innerHTML即可增加一个元素,但是如果结点非空, 如果再重复上述操作,就会覆盖掉原来的内容

- 追加
```JavaScript
var JS = document.getElementById('JS'),  
    list = document.getElementById('list');

list.appendChild(JS)
```
- 创建新标签
```JavaScript
// 创建元素  
var newP = document.createElement('p');  
newP.id = 'newP';  
newP.style.color = 'red';  
newP.style.background = 'blue';  
newP.innerText = 'hello world'  
  
//创建一个标签结点  
var myScript = document.createElement('script');  
myScript.setAttribute('type' , 'text/javascript');  
var body = document.getElementsByTagName('body');  
body[0].style.background = 'green';  
list.appendChild(newP);  
list.append(myScript);
```
#### 2.2.3.删除DOM
1. 先获取父结点
2. 通过父结点删除自己
```html
<div id="father">  
    <h1>标题1</h1>  
    <p id="p1">p1</p>  
    <p class="p2">p2</p>  
</div>  
  
  
<script>  
    //对应CSS中的选择器  
    var self = document.getElementById('p1');
    var father = p1.parentElement;
    father.removeChild(p1);
</script>
```
注: 删除是一个动态的过程,删除第一个元素后,第二个元素变成了第一个元素.即child属性是时刻变化的
### 2.3.操作BOM元素-->浏览器对象模型(重点)

#### 2.3.1.window->浏览器窗口
```javascript
window.alert("hello world");  
window.confirm("hello world");  
window.innerHeight;  
window.innerWidth;  
window.outerHeight;  
window.outerWidth;
```

#### 2.3.2.navigator-->封装了浏览器信息(大多数时候不会使用)
```JavaScript
window.navigator.geolocation.getCurrentPosition(function (position) {  
    console.log(position);  
});
```

#### 2.3.3.screen-->控制屏幕大小(单位:px)
```JavaScript
screen.width = 1920;  
screen.height = 1080;
```

#### 2.2.4.location-->代表当前页面的URL信息(重要)
```JavaScript

host: "nuc.alphacoding.cn"

href: "https://nuc.alphacoding.cn/home?1749970612859"
protocol: "https:"

```

#### 2.2.5.Document-->当前页面信息
```JavaScript
document.title
'“学·练·测·考·评”智适应教学平台'

```

```html
<body>  
<dl id="dl">  
    <dt>Java</dt>  
    <dd>JavaSE</dd>  
    <dd>JavaEE</dd>  
</dl>  
<script>  
    var dl = document.getElementById("dl"); //获取dl节点  
    var dt = dl.firstElementChild;  
    var dd = dt.nextElementSibling;  
    console.log(dd);  
</script>  
</body>

```
#### 2.2.6.History-->历史浏览记录
```JavaScript
history.back();   //后退
history.forward();//前进
```

#### 2.2.7.操作表单(验证)
- 文本框 -->text
- 下拉框 -->< select >
- 单选框 -->radio
- 复选框 -->checkbox
- 隐藏域 -->hidden
- 密码框 -->password
```html
<body>  
<form action="post">  
    <p>        <span>用户名:</span><input type="text" id="username">  
    </p>    <p>        <span>性别:</span>  
        <input type="radio" value="male" name="sex" id="boy">男  
        <input type="radio" value="female" name="sex" id="girl">女  
    </p>  
</form>  
  
<script>  
    var input_text = document.getElementById("username");  
    var boy_radio = document.getElementById("boy");  
    var girl_radio = document.getElementById("girl");  
  
    //得到输入框的值  
    input_text.value;  
    //修改输入框的值  
    input_text.value = "hello world";  
  
</script>  
</body>
```

提交表单
```HTML
<!DOCTYPE html>  
<html lang="zh-CN">  
<head>  
  <meta charset="UTF-8">  
  <title>简单表单验证</title>  
</head>  
<body>  
<h2>兴趣选择</h2>  
<form id="simpleForm">  
  <!-- 文本输入验证 -->  
  <div>  
    <label for="name">姓名（必填）:</label>  
    <input type="text" id="name" name="name">  
    <span id="nameError" style="color:red;"></span>  
  </div>  
  <!-- 单选按钮验证 -->  
  <div>  
    <p>性别（必选）:</p>  
    <input type="radio" id="male" name="gender" value="male">  
    <label for="male">男</label>  
  
    <input type="radio" id="female" name="gender" value="female">  
    <label for="female">女</label>  
  
    <span id="genderError" style="color:red;"></span>  
  </div>  
  <!-- 复选框验证（至少选2项） -->  
  <div>  
    <p>兴趣爱好（至少选2项）:</p>  
    <input type="checkbox" id="sports" name="interests" value="sports">  
    <label for="sports">运动</label>  
  
    <input type="checkbox" id="music" name="interests" value="music">  
    <label for="music">音乐</label>  
  
    <input type="checkbox" id="reading" name="interests" value="reading">  
    <label for="reading">阅读</label>  
  
    <span id="interestsError" style="color:red;"></span>  
  </div>  
  <button type="submit">提交</button>  
</form>  
  
<script>  
  document.getElementById('simpleForm').addEventListener('submit', function(event) {  
    event.preventDefault();  
  
    // 清除之前的错误信息  
    document.getElementById('nameError').textContent = '';  
    document.getElementById('genderError').textContent = '';  
    document.getElementById('interestsError').textContent = '';  
  
    // 验证姓名（必填）  
    const name = document.getElementById('name').value.trim();  
    if (name === '') {  
      document.getElementById('nameError').textContent = '请输入姓名';  
      return false;  
    }  
  
    // 验证性别（必选）  
    const genderSelected = document.querySelector('input[name="gender"]:checked');  
    if (!genderSelected) {  
      document.getElementById('genderError').textContent = '请选择性别';  
      return false;  
    }  
  
    // 验证兴趣爱好（至少选2项）  
    const checkedInterests = document.querySelectorAll('input[name="interests"]:checked');  
    if (checkedInterests.length < 2) {  
      document.getElementById('interestsError').textContent = '请至少选择2项兴趣爱好';  
      return false;  
    }  
  
    // 所有验证通过  
    alert('表单验证通过！\n姓名: ' + name +  
            '\n性别: ' + genderSelected.value +  
            '\n兴趣: ' + Array.from(checkedInterests).map(c => c.value).join(', '));  
  
  
    this.submit();  
  });  
</script>  
</body>  
</html>
```
