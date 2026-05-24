# HTML-CSS学习



## 一.HTML(超文本标记语言: **H**yper**T**ext **M**arkup **L**anguage)

> [!warning] 提示
> HTML不是一种编程语言，而是一种**标记**语言(由标签构成的语言)

### 1. 完整的html结构如下

```html
<!-- 告诉浏览器编码规范 -->
<!DOCTYPE html>		
<!-- 总标签,所有的代码在总标签下 -->
<html>
    <!-- 网页头部 -->
<head>
    <!-- 定义字符集为UTF-8 -->
    <!-- meta为描述性标签,用来描述网站信息 -->
	<meta charset="utf-8">		-->自闭合标签
    <meta name = "keywords" content = "document">
	<title>菜鸟教程(runoob.com)</title>
</head>
    <!-- 网页主体 -->
<body>
 
	<h1>我的第一个标题</h1>
 
	<p>我的第一个段落。</p>
 
</body>
</html>

```


### 2. 网页基本标签
> [!note] 所有的标签如下表

| 标签             | 功能                                        | 标签           | 功能                                      |
| :------------- | :---------------------------------------- | ------------ | --------------------------------------- |
| `<!-- -->`     | 注释                                        | `<kbd>`      | 定义键盘文本                                  |
| `<!DOCTYPE>`   | 定义文档类型                                    | `<keygen>`   | 规定用于表单的密钥对生成器字段                         |
| `<a>`          | 定义超文本连接                                   | `<label>`    | 定义 input 元素的标注                          |
| `<abbr>`       | 定义缩写                                      | `<legend>`   | 定义 fieldset 元素的标题                       |
| `<acronym>`    | 定义只取首字母的缩写                                | `<li>`       | 定义列表的项目                                 |
| `<address>`    | 定义文档作者或拥有者的联系信息                           | `<link>`     | 定义文档与外部资源的关系                            |
| `<applet>`     | 定义嵌入的applet                               | `<map>`      | 定义图像映射                                  |
| `<area>`       | 定义图像映射内部的区域                               | `<mark>`     | 定义带有记号的文本。请在需要突出显示文本时使用`<m>`标签          |
| `<article>`    | 定义一个文章区域                                  | `<menu>`     | 定义菜单列表                                  |
| `<aside>`      | 定义页面侧边栏的内容                                | `<meta>`     | 定义关于 HTML 文档的元信息                        |
| `<audio>`      | 定义音频内容                                    | `<meter>`    | 定义度量衡。仅用于已知最大和最小值的度量                    |
| `<b>`          | 定义文本粗体                                    | `<nav>`      | 定义导航链接的部分                               |
| `<base>`       | 定义页面中所有链接的默认地址                            | `<noframes>` | 定义针对不支持框架的用户的替代内容                       |
| `<basefont>`   | 定义页面中文本的默认样式                              | `<noscript>` | 定义针对不支持客户端脚本的用户的替代内容                    |
| `<bdi>`        | 允许设置一段文本,使其脱离其父元素的文本方向设置                  | `<object>`   | 定义内嵌对象                                  |
| `<bdo>`        | 定义文字方向                                    | `<ol>`       | 定义有序列表                                  |
| `<big>`        | 定义大号文本                                    | `<optgroup>` | 定义选择列表中相关选项的组合                          |
| `<blockquote>` | 定义长的引用                                    | `<option>`   | 定义选择列表中的选项                              |
| `<body>`       | 定义文档主体                                    | `<output>`   | 定义不同类型的输出，比如脚本的输出                       |
| `<br>`         | 定义换行                                      | `<p>`        | 定义段落                                    |
| `<button>`     | 定义一个点击按钮                                  | `<param>`    | 定义对象的参数                                 |
| `<canvas>`     | 定义图形                                      | `<pre>`      | 定义预格式文本                                 |
| `<caption>`    | 定义表格标题                                    | `<progress>` | 定义运行中的进度（进程）                            |
| `<center>`     | 定义居中文本                                    | `<q>`        | 定义短的引用                                  |
| `<cite>`       | 定义引用                                      | `<rp>`       | 在 ruby 注释中使用，以定义不支持 ruby 元素的浏览器所显示的内容   |
| `<code>`       | 定义计算机代码文本                                 | `<rt>`       | 定义字符（中文注音或字符）的解释或发音                     |
| `<col>`        | 定义表格中一个或多个列的属性值                           | `<ruby>`     | 标签定义 ruby 注释（中文注音或字符）                   |
| `<colgroup>`   | 定义表格中供格式化的列组                              | `<s>`        | 不赞成使用。定义加删除线的文本                         |
| `<command>`    | 定义命令按钮，比如单选按钮、复选框或按钮                      | `<samp>`     | 定义计算机代码样本                               |
| `<datalist>`   | 定义选项列表。请与 input 元素配合使用该元素，来定义 input 可能的值。 | `<script>`   | 定义客户端脚本                                 |
| `<dd>`         | 定义定义列表中项目的描述                              | `<section>`  | 定义文档中的节（section、区段）。比如章节、页眉、页脚或文档中的其他部分 |
| `<del>`        | 定义被删除文本                                   | `<select>`   | 定义选择列表（下拉列表）                            |
| `<details>`    | 用于描述文档或文档某个部分的细节                          | `<small>`    | 定义小号文本                                  |
| `<dfn>`        | 定义定义项目                                    | `<source>`   | 定义媒介资源                                  |
| `<dialog>`     | 定义对话框，比如提示框                               | `<span>`     | 定义文档中的节                                 |
| `<dir>`        | HTML5不支持，不赞成使用。定义目录列表。                    | `<strike>`   | 定义加删除线文本                                |
| `<div>`        | 定义文档中的节                                   | `<strong>`   | 定义强调文本                                  |
| `<dl>`         | 定义列表详情                                    | `<style>`    | 定义文档的样式信息                               |
| `<dt>`         | 定义列表中的项目                                  | `<sub>`      | 定义下标文本                                  |
| `<em>`         | 定义强调文本                                    | `<summary>`  |                                         |
| `<embed>`      | 定义嵌入的内容，比如插件                              | `<sup>`      | 定义上标文本                                  |
| `<fieldset>`   | 定义围绕表单中元素的边框                              | `<table>`    | 定义表格                                    |
| `<figcaption>` | 定义`<figure>` 元素的标题                        | `<tbody>`    | 定义表格中的主体内容                              |
| `<figure>`     | 规定独立的流内容（图像、图表、照片、代码等等）                   | `<td>`       | 定义表格中的单元                                |
| `<font>`       | HTML5不支持，不赞成使用。定义文字的字体、尺寸和颜色              | `<textarea>` | 定义多行的文本输入控件                             |
| `<footer>`     | 定义 section 或 document 的页脚                 | `<tfoot>`    | 定义表格中的表注内容（脚注）                          |
| `<form>`       | 定义了HTML文档的表单                              | `<th>`       | 定义表格中的表头单元格                             |
| `<frame>`      | 定义框架集的窗口或框架                               | `<thead>`    | 定义表格中的表头内容                              |
| `<frameset>`   | 定义框架集                                     | `<time>`     | 定义日期或时间，或者两者                            |
| `<h1> to <h6>` | 定义 HTML 标题                                | `<title>`    | 定义文档的标题                                 |
| `<head>`       | 定义关于文档的信息                                 | `<tr>`       | 定义表格中的行                                 |
| `<header>`     | 定义了文档的头部区域                                | `<tracl>`    | 为诸如 video 元素之类的媒介规定外部文本轨道               |
| `<hr>`         | 定义水平线                                     | `<tt>`       | 定义打字机文本                                 |
| `<html>`       | 定义 HTML 文档                                | `<u>`        | 不赞成使用。定义下划线文本                           |
| `<i>`          | 定义斜体字                                     | `<ul>`       | 定义无序列表                                  |
| `<iframe>`     | 定义内联框架                                    | `<var>`      | 定义文本的变量部分                               |
| `<img>`        | 定义图像                                      | `<video>`    | 定义视频，比如电影片段或其他视频流                       |
| `<input>`      | 定义输入控件                                    | `<wbr>`      | 规定在文本中的何处适合添加换行符                        |
| `<ins>`        | 定义被插入文本                                   |              |                                         |




#### 标题标签-->h1 -> h6

```html
<h1>这是一个标题</h1>
<h2>这是一个标题</h2>
<h3>这是一个标题</h3>
```

#### 段落标签-->paragraph

```html
<p>这是一个段落。</p>
<p>这是另外一个段落。</p>
```

#### 换行标签-->自闭合

```html
<br/>
```

#### 水平线标签-->分隔网页内容

```html
<hr/>
```

#### 字体样式标签

```html
<h1>
    <strong>粗体标签</strong>
    <em>斜体标签</em>
</h1>
```

#### 特殊符号-->&开头 , 分号结尾

```html
<h1>
    <!-- 空格:&ndsp,每一个代表一个空格 -->
    &ndsp;
    <!-- 大于小于分别为: &gt; 和 &lt; -->
    &gt;
    &lt;
    <!-- 版权符号: &copy; -->
    &copy;
</h1>
```

#### 图像标签
> [!note] 格式
>  - src:图像地址 
>  - alt: 图像的替代文字 
>  - title: 鼠标悬停提示文字 
>  - width: 图像宽度 
>  - height: 图像高度

```html
<img src="path" alt="text1" title="text2" width="x" height="y">
```

#### 链接标签-->超链接
> [!note] 概述
> 超链接:
> - href-->必填,表示要跳转到哪个页面
> - target-->表示窗口在哪里打开
> 	- blank --> 在新标签打开
> 	- self --> 在自己的网页中打开
```html
<a href="path"  target="目标窗口位置">链接文本或图像</a>

<!-- 锚链接:需要一个锚标记,然后跳转到该标记 -->
<a href = "#top">回到顶部</a>
<!-- 表示跳转到tmp网页的down的位置 -->
<a href = "tmp.html#down">跳转</a>

<!-- 功能性链接:
	邮件链接:mailto:
-->
<a href = "mailto:xxx@qq.com">点击发送</a>
```

#### 列表标签
> [!tip] 列表分三类:
> - 无需列表
> - 有序列表
> - 定义列表
```html
<!-- 有序列表(orderList) -->
<ol>
    <!-- 子列表(List) -->
    <li> java </li>
</ol>

<!-- 无序列表(unorderList) -->
<ul>
    <!-- 子列表(List) -->
    <li> java </li>
</ul>

<!-- 自定义列表(defineList) -->
<dl>
    <!-- 列表名称 -->
    <dt>学科</dt>
    <!-- 列表选项 -->
    <dd>C</dd>
    <dd>Java</dd>
    <dd>Python</dd>
    <dd>C++</dd>
    <!-- 列表名称 -->
    <dt>城市</dt>
    <!-- 列表选项 -->
    <dd>北京</dd>
    <dd>上海</dd>
</dl>
```

#### 表格标签

> [!note] 基本结构 
> - 单元格
> - 行,列
> - 跨行,跨列
```html
<!-- 
表格 ->table
行 ->tr
列 ->td
跨行(纵向合并单元格) ->rowspan=""
跨列(横向合并单元格) ->colspan=""
-->
<table>
    <tr>
        <td colspan="3">1-1</td>
    </tr>
    <tr>
        <td>2-1</td>
        <td>2-2</td>
        <td>2-3</td>
    </tr>
</table>
```



#### 视频和音频
> [!note] 内容
> - src ->资源路径
> - controls ->控制器
> - autoplay ->自动播放
```html
<!-- 视频 -->
<vedio src="path" controls autoplay>"path"</vedio>
<!-- 音频 -->
<audio src="path" controls>"path"</audio>
```


### 3.页面结构分析

> [!note] 概述
> header -->标题头部区域内容
> footer -->标记脚部区域内容
> section -->Web页面的一块独立区域
> article -->独立的文章内容
> aside -->相关内容或应用(多用于侧边栏)
> nav -->导航类辅助内容
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>页面结构分析</title>
    </head>
    <body>
        <header> 
            <h2> 网页头部 </h2>
        </header>
        <section> 
            <h2> 网页主体 </h2> 
        </section>
        
        <footer> 
            <h2> 网页脚部 </h2>
        </footer>
    </body>
</html>
```

### 4. iframe内联框架-->在一个网页中嵌套另一个网页
>[!note] 相关内容
>- frameborder 属性用于定义iframe表示是否显示边框,设置属性值为 "0" 移除iframe的边框
>- iframe 可以显示一个目标链接的页面,目标链接的属性必须使用 iframe 的属性
```html
<!-- iframe内联框架 -->
<iframe src"path" frameborder="0" width="x" height="y">
    
</iframe>

<iframe src="demo_iframe.htm" name="iframe_a"></iframe>
<p>
<a href="https://www.runoob.com" target="iframe_a" rel="noopener">RUNOOB.COM</a>
</p>
```


### 5. 表单语法
> [!example] 收集用户信息
```html
    <input type="password" id="password" name="password" required>

    <br>

    <!-- 单选按钮（Radio Buttons）name的属性需要一样 -->
    <label>性别:</label>
    <input type="radio" id="male" name="gender" value="male" checked>
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>

    <br>

    <!-- 复选框（Checkboxes） -->
    <input type="checkbox" name="vehicle[]" value="Bike">我喜欢自行车<br>
	<input type="checkbox" name="vehicle[]" value="Car">我喜欢小汽车

    <br>

    <!-- 按钮 
	input type="button" ->普通按钮
	input type="image"  ->图像按钮
	input type="submit" ->提交按钮
	input type="reset"  ->重置按钮
	-->
    <input type="button" name="btn1" value="点击">
    
    <br>
    <!-- 下拉列表(select) -->
    <label for="country">国家:</label>
    <select id="country" name="country">
        <!-- 选项(option) , selected设置默认值 -->        <option value="cn" selected>CN</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
    </select>

    <br>
    
    <!-- 文本域 -->
    <textarea name="textarea" cols="x" rows="y">文本内容</textarea>

    <!-- 文件域 -->
    <input type="file" name="files">
    <input type="button" value="上传" name="upload">
    
    <!-- 邮件验证 -->
    <input type="email" name="email">
    
    <!-- url验证 -->
    <input type="url" name="url">
    
    <!-- 数字 -->
    <input type="number" name="number" max="100" min="1" step="1">
    
    <!-- 滑块 -->
    <input type="range" name="sound" min="0" max="100" step="2">
    
    <!-- 搜索框 -->
    <input type="search" name="search">
    
    <!-- 提交按钮 -->
    <input type="submit" value="提交">
</form>

表单的应用

只读-->不可修改


<p>
    姓名:<input type="text" name="username" value="admin" readonly>
</p>


禁用-->禁用选项"男"


<p>
    <input type="radio" id="male" name="gender" value="male" checked disabled>
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>
</p>

        <!-- 选项(option) , selected设置默认值 -->
        <option value="cn" selected>CN</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
    </select>

    <br>
    
    <!-- 文本域 -->
    <textarea name="textarea" cols="x" rows="y">文本内容</textarea>

    <!-- 文件域 -->
    <input type="file" name="files">
    <input type="button" value="上传" name="upload">
    
    <!-- 邮件验证 -->
    <input type="email" name="email">
    
    <!-- url验证 -->
    <input type="url" name="url">
    
    <!-- 数字 -->
    <input type="number" name="number" max="100" min="1" step="1">
    
    <!-- 滑块 -->
    <input type="range" name="sound" min="0" max="100" step="2">
    
    <!-- 搜索框 -->
    <input type="search" name="search">
    
    <!-- 提交按钮 -->
    <input type="submit" value="提交">
</form>
```

#### 表单的应用

##### 只读
> [!note] 概述
> 只读使用关键字*readonly*, 设置之后这部分内容无法被修改
```html
<p>
    姓名:<input type="text" name="username" value="admin" readonly>
</p>
```

##### 禁用
> [!note] 概述
> 禁用选项使用*checked disabled*, 会将对应的选项禁用
```html
<p>
    <input type="radio" id="male" name="gender" value="male" checked disabled>
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>
</p>
```

##### 隐藏
> [!note] 概述
> 使用关键字*hidden*, 隐藏相应的内容,但是该部分内容的属性仍然存在
```html
<p>
    <label for="password">密码:</label>
    <input type="password" id="password" name="password" required hidden>
</p>
```

##### 增强鼠标可用性
```html
<p>
    <lable for"mark">点击</lable>
    <input type="text" id="mark">
</p>
```



#### 表单验证
> [!note] 目的
> 保证数据安全,减轻服务器压力
##### placeholder
> [!note] 
> 提示性消息
```html
<p>
    名字:<input type="text" name="username" placeholder="请输入用户名">
</p>
```

##### required
> [!note] 概述
> 进行非空判断
```html
<input type="password" id="pwd" name="password" required>
```

##### pattern
> [!note] 概述
> 使用正则表达式进行字符串匹配
```html
<p>
    <input type="text" name="diyemail" pattern="^(0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$"
</p>
```



------
## 二.CSS (层叠样式表 -->**C**ascading **S**tyle **S**heets)

> [!note] 概述
*用来为结构化文档（如 HTML 文档或 XML 应用）添加样式（字体、间距和颜色等）的计算机语言*



### 1.CSS的基本语法

```css
/* 注释 */
/* 选择器->声明(用分号结尾) */
p{
    color: red;
}
```

```html
<head>
    <title>Title</title>
    <style>
        h1{
        color:red;
        }
        
        <link rel="stylesheet" href="css/style.css">
    </style>
</head>

<body>
    <h1>
        标题
    </h1>
</body>
```


> [!warning] 注意
> **一般来说使用独立于HTML的CSS文件**


### 2.CSS的导入方式

#### 2.1行内样式-->在标签元素中编写style属性,直接赋属性

```html
<!-- 快捷,但是 -->
<body>
    <h1 style="color: red;"> 标题 </h1>
</body>
```

#### 2.2 style标签 (内部样式表)

```html
<head>
    <style>
        /*在style里用的是CSS*/
        h1{
            color: red;
        }
    </style>
</head>
```

#### 2.3外部样式-->链接式,导入式 (link使用较多)

```css
h1{
    color : yellow;
}
```

```html
<!-- link是html标签,只能放入html的源代码中使用 -->
<head>
    <link rel="stylesheet" href="css/style.css">
</head>
```

```html
<!-- 可看做css样式,作用是引入css样式功能,import在使用时需要<style type="url">标签,也可以直接@import css文件路径地址 -->
<head>
    <style>
        @import url("url");
    </style>
</head>
```

> [!note] 优先级
> 行内样式 > 内部样式 > 外部样式

### 3. 选择器

> [!note] 作用
> 选择页面上的某一个或者某一类元素

#### 3.1 基本选择器

##### 标签选择器 
> [!note] 概述
> 只会选中同名的所有标签
```html
    <head>
        <style>
            h1{
                /*颜色表示法1:英文直接表示*/
                color: red;
                border-radius: 24px
            }
            p{
                /*颜色表示法2:rgb表示法,三个十进制数字(0~255)依次表示rgb的数值*/
                color: rgb(125,0,203);
                font-size: 72px;
            }
        </style>
    </head>
    <body>
        <h1>text1</h1>
        <h1>text2</h1>
        <p>text3</p>
    </body>
```


##### 类选择器
> [!note] 概述
> 可以多个标签归类,是同一个class可以复用
```html
    <head>
        <style>
            .myname{
                /*颜色表示法3:十六进制表示法,一共六位数字,
                每两个十六进制数字依次对应rgb值的其中之一*/
                color: [[3748ff]];
            }
            .myemail{
                /*颜色表示法4:rgba表示法,在rgb表示的基础上,增加了透明度的参数*/
                color: rgba(255,0,125,0.5)
            }
        </style>
    </head>
    <body>
        <h1 class="myname">text1</h1>
        <h1 class="myemail">text2</h1>
    </body>
```

##### id选择器

>[!note] 概述
>不可复用,id必须保证全局唯一
```html
    <head>
        <style>
            [[name]]{
                color: pink;
            }
        </style>
    </head>
    <body>
        <h1 id="name">text1</h1>
        <h1 id="phone">text2</h1>
    </body>
```

> [!attention] 优先级
> id选择器 > 类选择器 > 标签选择器


####  3.2 高级选择器
#####  3.2.1.层次选择器-->根据层次选择

###### 后代选择器-->在某个元素的后面的所有

```html
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            body p{
                background: pink;
            }
        </style>
    </head>
    <body>
    
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
    <ul>
        <li>
            <p>p4</p>
        </li>
        <li>
            <p>p5</p>
        </li>
        <li>
            p6
        </li>
    </ul>
    </body>
```


###### 子选择器-->一代

```html
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            /*子选择器*/
            body > p{
                background: grey;
            }
        </style>
    </head>
    <body>
    
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
    <ul>
        <li>
            <p>p4</p>
        </li>
        <li>
            <p>p5</p>
        </li>
        <li>
            p6
        </li>
    </ul>
    </body>
```


###### 相邻兄弟选择器-->同级元素,对下不对上,只选中一个

```html
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            /*相邻兄弟选择器*/
            .active + p{
                background: blue;
            }
        </style>
    </head>
    <body>
    
    <p class="active">p0</p>
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
    <ul>
        <li>
            <p>p4</p>
        </li>
        <li>
            <p>p5</p>
        </li>
        <li>
            p6
        </li>
    </ul>
    </body>
    ```


###### 通用选择器-->选中同级向下的所有元素

```html
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            /*通用选择器*/
            .active~p{
                background: red;
            }
        </style>
    </head>
    <body>
    
    <p class="active">p0</p>
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
    <ul>
        <li>
            <p>p4</p>
        </li>
        <li>
            <p>p5</p>
        </li>
        <li>
            p6
        </li>
    </ul>
    </body>
```

##### 3.2.2.结构伪类选择器-->与结构相关,定位元素

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        /*ul的第一个子元素*/
        ul li:first-child{
            background: deepskyblue;
        }
        /*ul的最后一个子元素*/
        ul li:last-child{
            background: [[3fb878]];
        }
        /*选中p1  :定位到父级元素,选择当前的第一个元素(必须同名)-->按顺序选 */
        p:nth-child(1){
            background: red;
        }
        /* 选中父级第二个类型为p的元素-->按类型选 */
        p:nth-of-type(2){
            background: yellow;
        }
    </style>
</head>
<body>


<p>p1</p>
<p>p2</p>
<p>p3</p>
<ul>
    <li>li1</li>
    <li>li2</li>
    <li>li3</li>
</ul>
</body>
</html>
```

##### 3.2.3.属性选择器(常用)-->id+class

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .demo a{
            float: left;
            display: block;
            height: 50px;
            width: 50px;
            border-radius: 10px;
            background: blue;
            text-align: center;
            color: grey;
            text-decoration: none;
            margin-right: 5px;
            font: bold  20px/50px Arial;
        }

        /*存在id属性的元素*/
        .demo a[id]{
            background: red;
        }
        /*选中id=first的元素*/
        .demo a[id=first]{
            background: green;
        }
        /*class中含有links的元素*/
        .demo a[class*="links"]{
            background: [[ffc0f2]];
        }
        /*选中href中以http开头的元素*/
        .demo a[href^="http"]{
            background: cyan;
        }
        /*选中以html结尾的元素*/
        .demo a[href$=".html"]{
            background: mediumblue;
        }
    </style>
</head>
<body>
<p class="demo">
    <a href="https://www.baidu.com"  id="first">1</a>
    <a href=""  id="second">2</a>
    <a href="层次选择器.html" class id="third">3</a>
    <a href="img/123.png" class="links item fourth">4</a>
    <a href="img/123.jpg"  id="fifth">5</a>
    <a href="/a.pdf" class="links item sixth">6</a>
    <a href="and.doc"  id="seventh">7</a>
    <a href="abcd.ppt"  id="eighth" >8</a>
</p>
</body>
</html>
```



### 4.美化网页元素-->传递有效信息,凸显主题,增加美观性

##### 4.1.span标签
>[!tip] 用法
>重点突出的字用span套起来
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
      [[title1]]{
          font-size: 50px;
      }
  </style>
</head>
<body>

<span id="title1">北京</span>欢迎你
</body>
</html>
```

##### 4.2.字体样式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
      /*字体样式*/
    body{
      font-family: 微软雅黑,serif;
    }
    /*大小*/
    h1{
      font-size: 50px;
    }
    /*粗细*/
    .p1{
        font-weight: bold;
    }
    /*颜色*/
    .p2{
        color: [[0033ff]];
    }
  </style>
</head>
<body>
<h1>
    字体系列
</h1>
<p class="p2">
    CSS 属性选择器用于根据元素的属性或属性值来选择 HTML 元素。
    属性选择器可以帮助你在不需要为元素添加类或 ID 的情况下对其进行样式化。
</p>
<p class="p1">
    font-family 属性设置文本的字体系列。
    font-family 属性应该设置几个字体名称作为一种"后备"机制，如果浏览器不支持第一种字体，他将尝试下一种字体。
</p>
</body>
</html>
```

##### 4.3文本样式

###### 4.3.1.颜色
> [!note] 四种表示方法
> - 英文直接表示 
> - 十六进制(#) 
> - rgb 
> - rgba

###### 4.3.2.段落设置
> [!note] 用法
> - 缩进(text-indent-2em)
> - 下划线(text-decoration)
> - 行高(line-height)
> - 对齐方式(text-align=center)
##### 4.4.文本阴影与超链接伪类

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <style>
        /*默认颜色*/
        a{
            text-decoration: none;
            color: black;
        }
        /*鼠标悬停颜色(常用)*/
        a:hover{
            color: blue;
            font-size: 30px;
        }
        /*鼠标单击但不释放*/
        a:active{
            color: pink;
            font-size: 50px;
        }
        /*鼠标单击并释放*/
        a:visited{
            color: red;
        }
        /*文本阴影-->阴影颜色,水平偏移,竖直偏移,阴影半径*/
        [[price]]{
            text-shadow: cyan 10px 5px  2px;
        }
    </style>
</head>
<body>

<a href="">
  <img src="/img/1.png" alt="开发">
</a>
<p>
    <a href="">
        java开发手册
    </a>
</p>
<p>
    <a href="">
        作者:xxx
    </a>
</p>
<p id="price">
    $99
</p>
</body>
</html>
```

##### 4.5列表
```css
  .title{
     font-size: 24px;
     font-weight: bold;
     text-indent: 1em;
     line-height: 35px;
     background: red;
 }
 ul{
     background: grey;
 }
 ul li{
     line-height: 30px;
     list-style: none; /*去掉圆点*/
 }
a{
    text-decoration: none;
    font-size: 20px;
    color: #000;
}
 a:hover{
     text-decoration: none;
     font-size: 36px;
 }

 [[nav]]{
     width: 450px;
 }
```

在html中导入css设置

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="/css/style.css" rel="stylesheet" type="text/css"/>
</head>
<body>

<div id="nav">
    <h2 class="title">
        商品分类
    </h2>
    <ul>
        <li><a href="#">手机</a></li>
        <li><a href="#">相机</a></li>
        <li><a href="#">电脑</a></li>
        <li><a href="#">平板</a></li>
        <li><a href="#">显示器</a></li>
    </ul>
</div>

</body>
</html>
```



##### 4.6.背景-->颜色/图片

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        div {
            width: 487px;
            height: 487px;
            border: 3px solid red;
            /*图片默认全部平铺*/
            background-image: url("src/img/tx.jpg");
        }

        /*水平平铺*/
        .div1 {
            background-repeat: repeat-x;
        }

        /*竖直平铺*/
        .div2 {
            background-repeat: repeat-y;
        }

        /*不平铺*/
        .div3 {
            background-repeat: no-repeat;
        }
    </style>
</head>
<body>

<div class="div1"></div>
<div class="div2"></div>
<div class="div3"></div>

</body>
</html>
```





### 5.盒子模型
> [!note] 概述
> 所有HTML元素可以看作盒子，在CSS中，"box model"这一术语是用来设计和布局时使用。
> CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：边距，边框，填充，和实际内容。
> 盒模型允许我们在其它元素和周围元素边框之间的空间放置元素
> 
> 盒子模型(Box Model)：
> -   **Margin(外边距)** - 清除边框外的区域，外边距是透明的。
> 	- 四个参数(上,右,下, 左)
> 	- 三个参数(上, 左右, 下)
> 	- 两个参数(上下, 左右)
> 	- 一个参数(四个边统一)
> -   **Border(边框)** - 围绕在内边距和内容外的边框。
> -   **Padding(内边距)** - 清除内容周围的区域，内边距是透明的。
> -   **Content(内容)** - 盒子的内容，显示文本和图像。

> [!tip] 计算方法 
> - **最终元素的总宽度计算公式是这样的：总元素的宽度=宽度+左填充+右填充+左边框+右边框+左边距+右边距**
> - **元素的总高度最终计算公式是这样的：总元素的高度=高度+顶部填充+底部填充+上边框+下边框+上边距+下边距**

#### 5.1.边框

##### 5.1.1.普通边框

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
    h1,ul,li,a,body{
      margin: 0;
      padding: 0;
    }
    [[box]]{
      width: 300px;
      border: 1px solid blue;
    }
    form{
      background: [[3fb878]];
    }
    div:nth-of-type(1)>input{
      border: 3px solid black;
    }
    div:nth-of-type(2)>input{
      border: 3px dashed blue;
    }
    div:nth-of-type(3)>input{
      border: 3px dotted [[01fae0]];
    }
    h2{
      font-size: 30px;
      background: [[1df861]];
      line-height: 45px;
      margin: 0;
    }
  </style>
</head>
<body>

<div id="box">
  <h2>会员登录</h2>
  <form action="#">
    <div>
      <span>用户名:</span>
      <input type="text">
    </div>
    <div>
      <span>密码:</span>
      <input type="password">
    </div>
    <div>
      <span>邮箱:</span>
      <input type="email">
    </div>
  </form>
</div>
</body>
</html>
```



##### 5.1.2.圆角边框

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
    div{
      width: 100px;
      height: 100px;
      border: 10px solid red;
        /*圆角矩形:参数为圆角半径
        四个参数依次对应:左上,右上,右下,左下(顺时针)
        两个参数分别对应:左上右下 , 左下右上(对角线)
        一个参数对应:所有
        */
      border-radius: 50px 20px;
    }
  </style>
</head>
<body>
<div></div>
</body>
</html>
```

##### 5.1.3盒子阴影

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
    div{
      width: 100px;
      height: 100px;
      border: 10px solid blue;
        border-radius: 20px 30px 10px 40px;
      box-shadow: [[1df861]]  10px 5px 1px ;
    }
  </style>
</head>
<body>
<div>
</div>
</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
    img{
      margin: 0 auto;
      border-radius: 50%;
      box-shadow: 10px  10px 1000px [[00ff22]];
    }
      /*整体居中需要将图片打包在div中,将div居中即可*/
    [[box]]{
      width: 487px;
      height: 487px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
<div id="box">
  <img src="../../img/tx.jpg" height="487" width="487" alt="#"/>
</div>
  </body>
</html>
```



### 6.浮动

##### 6.1.标准文档流->行内元素可以被包含在块级元素中,反之不行

##### 6.2.display-->调整元素

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <!-- 
		block 块元素
		inline 行内元素
		inline-block 既是块元素也是行内元素
		none 都不是
	-->
    <style>
        div{
            width: 100px;
            height: 100px;
            border: 1px solid [[00ff22]];
            display: inline-block;
        }
        span{
            width: 100px;
            height: 100px;
            border : 1px solid blue;
            /*将行内元素变为块元素*/
            display: block;
        }
    </style>
</head>
<body>
<div>div块元素</div>
<span>span行内元素</span>
</body>
</html>
```

##### 6.3.浮动->float

```css
div{
    margin: 10px;
    padding: 5px;
}
[[picture]]{
    border: 2px solid green;
}
.layer1{
    border: 1px  solid red;
    display: inline-block;
    float: left;
}
.layer2{
    border: 1px  solid blue;
    display: inline-block;
    float: right;
}
```



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link  rel="stylesheet" href="../../css/float.css">
</head>
<body>
<div id="picture">
    <div class="layer1"><img src="../../img/tx.jpg" height="487" width="487" alt=""/></div>
    <div class="layer2"><img src="../../img/1.jpg" height="531" width="422" alt=""/></div>
</div>
</body>
</html>
```

##### 6.4.清除浮动-->clear

元素浮动之后，周围的元素会重新排列，为了避免这种情况，使用 clear 属性。

clear 属性指定元素两侧不能出现浮动元素。

```css
div{
    margin: 10px;
    padding: 5px;
}
[[picture]]{
    border: 2px solid green;
}
.layer1{
    border: 1px  solid red;
    display: inline-block;
    float: left;
    clear: right; /*两侧不允许浮动*/
}
.layer2{
    border: 1px  solid blue;
    display: inline-block;
    float: right;
    clear: left;    /*左侧不允许浮动*/
}
div > p{
    border: 1px solid [[01fae0]];
    font-size: 80px;
    display: inline-block;
    clear: both; /*两侧不允许浮动*/
}
```

##### 6.5.解决父级边框塌陷问题

###### 6.5.1.增加父级元素高度(不推荐)

###### 6.5.2.添加一个新的空的div清除浮动-->简单但是会造成冗余

```css
div{
    margin: 10px;
    padding: 5px;
}
[[picture]]{
    border: 2px solid green;
}
.layer1{
    border: 1px  solid red;
    display: inline-block;
    float: left;
    clear: right; /*右侧不允许浮动*/
}
.layer2{
    border: 1px  solid blue;
    display: inline-block;
    float: right;
    /*clear: left;    !*左侧不允许浮动*!*/
    overflow: auto;
}
.layer3{
    border: 3px  solid [[d300ff]];
    display: inline-block;
    float: left;
    font-size: 72px;
    /*clear: both; !*;两侧不允许浮动*!*/
}
.float{
    clear: both;
    margin: 0;
    padding: 0;
}
```

###### 6.5.3.overflow-->简单,在下拉和不能被切除的场景避免使用

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
    [[content]]{
        width: 500px;
        height: 500px;
        border: 5px solid aqua;
        overflow: scroll;	/*滚动框*/
    }
  </style>
</head>
<body>

<div id="content">
  <img src="../../img/tx.jpg" alt="">
  <p>
    CSS overflow 属性用于控制内容溢出元素框时显示的方式。
    CSS overflow 属性可以控制内容溢出元素框时在对应的元素区间内添加滚动条。
  </p>
</div>
</body>
</html>
```

###### 6.5.4.父类后添加一个伪类-->after(推荐)

```css
[[picture]]:after{
    border: 2px solid green;
    content: "";
    display: block;
    clear: both;
}
```



### 7.定位(Position)

##### 7.1.相对定位(relative)-->相对于原来的位置进行指定偏移

```css
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        [[box]]{
            width: 300px;
            height: 300px;
            padding: 10px;
            border: 3px solid blue;
        }
        a{
            width: 100px;
            height: 100px;
            text-decoration: none;
            line-height: 100px;
            text-align: center;
            color: white;
            background: [[d300ff]];
            display: block;
        }
        a:hover{
            background: deepskyblue;
        }
        .a2,.a4{
            position: relative;
            left: 200px;
            top: -100px;
        }
        .a5{
            background: [[1df861]];
            position: relative;
            left: 100px;
            top: -300px;
        }
    </style>
</head>
<body>
<div id="box">
    <a class="a1" href="#">链接1</a>
    <a class="a2" href="#">链接2</a>
    <a class="a3" href="#">链接3</a>
    <a class="a4" href="#">链接4</a>
    <a class="a5" href="#">链接5</a>
</div>
</body>
</html>
```



##### 7.2.绝对定位-->没有父级元素的情况下,相对于浏览器定位; 假设父级元素存在定位,通常相对于父级元素偏移

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        body{
            padding: 20px;
        }
        div{
            margin: 10px;
            padding: 5px;
            font-size: 36px;
            line-height: 25px;
        }
        [[father]]{
            border: 5px solid red;
            content: "";
            display: block;
            clear: both;
        }
        [[first]]{
            border: 3px solid deepskyblue;
            background-color: [[d300ff]];
            position: absolute;
            top: -10px;
            left: 10px;
        }
        [[second]]{
            border: 3px dashed springgreen;
            background-color: [[2be1c8]];
            position: absolute;
            right: -10px;
            bottom: 10px;
        }
        [[third]]{
            border: 3px solid [[ecbd04]];
            background-color: [[55e371]];

        }
    </style>
</head>
<body>
<div id="father">
    <div id="first">第一个盒子</div>
    <div id="second">第二个盒子</div>
    <div id="third">第三个盒子</div>
</div>
</body>
</html>
```



##### 7.3. 固定定位

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
  <style>
    body{

    }
    div:nth-of-type(1){
      width: 100px;
      height: 100px;
      background: [[d300ff]];
      position: absolute;
      right: 0;
      bottom: 0;
    }
    div:nth-of-type(2){
      width: 50px;
      height: 50px;
      background: [[2be1c8]];
      position: fixed; /*固定定位*/
      right: 0;
      bottom: 0;
    }
  </style>
</head>
<body>
<div>div1</div>
<div>div2</div>
</body>
</html>
```

##### 7.4. z-index及透明度

```css
ul,li{
    padding: 0;
    margin: 0;
    list-style: none;
}
[[content]]{
    width: 500px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-size: 12px;
    line-height: 50px;
    border: 3px solid deepskyblue;
}
/*父级元素相对定位*/
[[content]] ul{
    position: relative;
}
.tipText , .tipBg{
    position: absolute;
    width: 100px;
    height: 35px;
    top: 450px;
}
.tipText{
    color: deepskyblue;
}
.tipBg{
    background: #000;
    opacity: 0.1; /*透明度 两种方法表示等价*/
    filter: alpha(opacity=10);
}
```


