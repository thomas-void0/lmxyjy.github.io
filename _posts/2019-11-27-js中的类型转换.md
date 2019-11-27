**javaScript中的类型转换**

**一、原始值中的类型转换:**

**js类型转换表格:**

|原值|字符串|数字|布尔值|对象|
:-: | :-: | :-: | :-: | :-:
|undefined|"undefined"|NaN|false|throws TypeError|
|null|"null"|0|false|throws TypeError|
|true|"true"|1||new Boolean(true)|
|false|"false"|0||new Boolean(false)|
|""(空字符串)||0|false|new String("")|
|"1.2"(非空,数字)||1.2|true|new String("1.2")|
|"one"(非空,非数字)||NaN|true|new String("one")|
|0|"0"||false|new Number(0)|
|-0|"0"||false|new Number(-0)|
|NaN|"NaN"||false|new Number(NaN)|
|Infinity|"Infinity"||true|new Number(Infinity)|
|-Infinity|"-Infinity"||true|new Number(-Infinity)|
|1(无穷大,非零)|"1"||true|new Number(1)|
|{}(任意对象)|特殊|特殊|true||
|\[](任意数组)|""|0|true||
|\[9](1个数字元素)|"9"|9|true||
|\["a"](其他数组)|使用join()方法|NaN|true||
|function(){}(任意函数)|特殊|NaN|true||

`特殊`:参考下列对象转换为原始值的方式:

**原始值到对象的转换:** 

原始值通过调用`String`,`Number`,`Boolean`构造函数,分别转换为它们各自的包装对象。

`null`和`undefined`属于例外:当他们用在期望是一个对象 的地方都会造成一个类型错误,而不会进行正常的转换。

举例:对象都有`toString`方法,包括包装对象,但是`null`和`undefined`没有。

````js
/*其他基本类型调用toString*/
let str = "我是字符串";
let num = 123;
let bool = true;
console.log(str.toString());
console.log(num.toString());
console.log(bool.toString());
/*
我是字符串
123       
true
*/

/*null调用toString*/
let n = null;
console.log(n.toString());
/*
TypeError: Cannot read property 'toString' of null
*/

/*undefined调用toString*/
let nu = undefined;
console.log(nu.toString());
/*
TypeError: Cannot read property 'toString' of undefined
*/
````
需要注意的是:`if语句`通常会试图将操作数转换为布尔值,但是`==`运算符却从不试图将其操作数转换为布尔值。

示例代码:

````js
/*if 语句试图将操作数转换为布尔值*/
if(undefined){

}else{
    /*会执行这里的代码*/
}
/*undefined会被转换为false*/

/*比较undefined和false*/
console.log(undefined == false) 
/*false*/
/*结果为false,说明"=="运算符并没有将undefied转换为布尔值false*/
````
**显示的类型转换:** 

最简单的方式就是使用`Boolean()`,`Number()`,`String()`,`Object()`。如果不通过`new`运算符调用这些函数时,它们会作为类型转换函数,并且按照上表所述的规则进行类型转换。

````js
let num = Number("3");
console.log(num)
/*3*/

let str = String(false)
console.log(str)
/*"false"*/

let bool = Boolean([])
console.log(bool)
/*true*/

let obj = Object(3)
console.log(obj)
/*Number {3}*/
````
**部分运算符的隐式类型转换:**

`+ 运算符`: 

1. 如果运算符的一个操作数是字符串,那么它会把另外一个操作数转换为字符串。
2. 如果是作为一元运算符使用,那么运算符会将其操作数转换为数字。

`! 运算符`:

运算符会将其操作数转换为布尔值,并且取反。

````js
x + "" //等同于 String(x)
+x //等同于 Number(x) 或者 x - 0
!x //等同于 Boolean(x)
````

**二、对象转换为原始值:**

原始值：`布尔值`，`字符串`，`数字`。

**对象到布尔值的转换:** 

所有的对象（包括数组和函数）都转换为true，对于包装对象来说也是这样。`new Boolean(false)`是一个对象而不是原始值，所以它会被转换成true。

**对象到字符串和对象到数字的转换:** 

通过调用待转换对象的一个方法来完成。

需要注意的点是：js对象有两个不同的方法来执行转换`valueOf` 和 `toString`

>这里的转换规则只适用于本地对象，宿主对象（例如：由web浏览器定义的对象）则是根据各自的算法就可以转换成字符串和对象

**1，toString:** 

它的作用是返回一个反映这个对象的字符串。但是默认的toString方法并不会直接返回一个理想的值：
比如下列的这个例子：
````js
/*显示调用该对象的默认toString方法*/
({x:1,y:2}).toString() //=>"[object object]"
````
**许多的类都定义了特定版本的toString方法:**

`数组类(Array):`
toString方法是将每个数组元素都转换为一个字符串，并且在元素之间添加逗号并且合并成字符串。
````js
[1,2,3].toString() //=>"1,2,3"
````
`函数类(Function class):`
toString方法返回这个函数的实现定义的表示方式。通常来说就是将用户定义的函数转换为js源代码字符串的形式。

````js
let fStr = (function f(x){
    let a = "源代码";
}).toString()
console.log(fStr);
/*
function f(x){       
    let a = "源代码";
}
*/
````
`日期类(Date class):`
toString方法返回一个可读的（可以通过js的方法过滤并再做封装）日期和时间字符串。

````js
let a = new Date(2019,11,22).toString()
console.log(a);
/*Sun Dec 22 2019 00:00:00 GMT+0800 (GMT+08:00)*/
````
`RegExp类(RegExp class):`
toString将RegExp对象转换为表示正则表达式直接量的字符串。

````js
let r = /\d+/g.toString()
console.log(r)
/*/\d+/g*/
````
**2，valueOf:** 这个方法并没有详细的定义。
如果存在任意原始值，它就默认将对象转换为表示它的原始值。所以默认的`valueOf`方法会简单的返回对象本身,而不是返回一个原始值。

`数组`、`函数`、`正则表达式`都简单的继承了这个默认的方法，调用这些类型的实例的`valueOf`方法只是简单返回对象本身。

````js
/*数组类的默认valueOf*/
let arr = [1,2,3].valueOf()
console.log("返回值：",arr);
console.log("类型:",arr instanceof Array);
/*
返回值： (3) [1, 2, 3]
类型: true
*/
````
````js
/*函数类的默认valueOf*/
let fStr = (function f(x){
    let a = "源代码";
}).valueOf()
console.log("返回值：",fStr);
console.log("类型:", fStr instanceof Function);
/*
返回值： ƒ f(x){
    let a = "源代码";
}
类型: true
*/
````
````js
/*正则表达式类的默认valueOf*/
let r = (/\d+/g).valueOf();
console.log("返回值：",r);
console.log("类型:", r instanceof RegExp);
/*
返回值： /\d+/g
类型: true
*/
````
````js
/*对象类的默认valueOf*/
let obj = ({x:2,y:2}).valueOf()
console.log("返回值：",obj);
console.log("类型:", obj instanceof Object);
/*
返回值： {x: 2, y: 2}
类型: true
*/
````

`日期类`定义的`valueOf`方法会返回它的一个内部表示：1970年1月1日以来的毫秒数。也就是会返回时间戳:

````js
let d = new Date(2019,11,22)
console.log(d.valueOf());
/*
返回值： 1576944000000
类型: number
*/
````
**js中对象到字符串的转换经过了如下的步骤：**

js中对象到字符串的转换会首先尝试调用`toString`方法

1. >如果对象本身具有`toString`方法，则调用这个方法。如果返回了一个原始值,js就会将这个值转换为字符串(如果本身不是字符串的话)。然后返回这个这个字符串的结果。

2. >如果对象本身中没有`toString`方法，或者这个方法并不返回一个原始值。并且对象中具有`valueOf`方法的话。那么js就会调用`valueof`方法去做类型转换。如果返回值是原始值,js将这个值转换为字符串（如果本身不是字符串的话）。并且返回这个字符串的结果。

3. >如果js无法从`toString`或者`valueOf`获得一个原始值，这个时候就会抛出一个类型错误。

**js中对象到数字的转换经过了如下的步骤：**

js中对象到数字的转换会首先尝试调用`valueOf`方法。

1. >如果对象具有`valueOf`方法，则调用这个方法。返回一个原始值，js将这个原始值转换为数字（如果需要的话）。最后返回这个数字。

2. >如果对象具有`toString`方法，这个方法返回一个字符串，js将这个字符串转换为数字。最后返回。

3. >如果以上两个步骤都没办法返回有效的值。那么js会抛出类型错误。

问题：试着用以上的原理解释：为什么[]转换为数字是0。
>当 [ ] 转换为数字的时候，经过的过程入下：
1，首先调用`valueOf`方法返回 [ ] ,但是实际并不是原始值。
2，所以这个时候会再次调用`toString`方法，返回一个空字符串。
3，这个时候采用的转换的规则就是两个原始值的转换：' '转换为数字0

**算术运算符中特殊的类型转换:**

有特殊运算行为的算术运算符有：`+`，`==`，`!=`，`关系运算符`

`+` 运算符可以进行数学加法和字符串的连接。如果是其中的一个操作数是对象，那么js将使用特殊的方法将对象转换为原始值。而不是使用其他算术运算符的方法执行对象到数字的转换。

`==`运算符同`+`类似。

`+`和`==`应用的对象到原始值的转换中，日期类是比较特殊的。日期类是js语言核心中唯一的预先定义类型，它定义了有意义的向字符串和数字类型的转换。

对于非日期类的对象来说，对象到原始值的转换基本就是对象到数字的转换。(首先会去调用`valueOf`,如果`valueOf`不存在就会去调用`toString`)。

````js
/*普通对象转换为数字*/
let obj = {x:1,y:2};
obj.valueOf = function(){
    console.log("执行valueOf");
}
obj.toString = function(){
    console.log("执行toString");
}
console.log(obj + 11);
/*
执行valueOf
NaN  
*/
````

而日期确是使用对象到字符串的转换模式。(首先调用`toString`)。但是与之前所说的转换规则并不是完全一样的,这里的转换是:通过`valueOf`或者`toString`方法返回的原始值将会被直接使用,而不是会被强制转换为数字或者字符串。

````js
/*改写日期对象的toString方法*/
let a = new Date(2019,11,22)
a.toString=function(){
    console.log("调用toString方法");
}
a.valueOf = function(){
    console.log("执行valueOf");
}
console.log(a + 11);
/*
调用toString方法
NaN
*/
````
`<` 运算符以及其他关系运算符也和`==`一样,会做对象到原始值的转换。但是还是要除去日期对象的特殊情况。除了日期对象外,其他对象都会首先尝试去调用`valueOf`,然后再去调用`toString`。

**重点:** 

`+`,`==`,`!=`和`关系运算符`的转换特点是:
1. 除去日期对象是首先调用`toString`进行原始值转换外。(无论转换是否能够直接使用,它都不会再调用`valueOf`方法。换言之,使用这几个运算符的时候,日期类只会调用一次`toString`方法)。
2. 其他对象都是首先尝试调用`valueOf`进行转换,再调用`toString`方法进行转换。不管原始值是否能够被直接使用,它都不会进一步被转换为数字或者字符串。

**其他算术运算符中类型转换:**

除去几个特殊的算术运算符,其他运算符的转换都是非常明确的。
>对于日期对象来说也是没有特殊情况的。

例如:`-` (减号)运算符把它的两个操作数都转换为**数字**。

示例代码:
````js
/*+ 和 -运算符的类型转换*/
let now = new Date();
console.log(typeof (now + 1));
console.log(typeof (now - 1));
/*
string
number
*/
````
````js
/*==隐式和显式的字符串转换*/
console.log(now == now.toString())
/*
true
*/
````
````js
/*> 将now转化为数字*/
console.log(now > (now - 1))
/*
true
*/
````