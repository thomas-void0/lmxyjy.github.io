**这一篇的主要内容是探究一下箭头函数中this的情况，以及call、apply、bind的区别和作用**

**首先：解决上一篇中的作业题**

````js
    var length = 10

    function fn() {
        console.log(this.length);
    }
    var obj = {
        length: 5,
        method: function (fn) {
            fn()
            arguments[0]()
        }
    }
    obj.method(fn, 1)   
````

这道最终输出的答案是：`10`和`2`。

**过程分析：**

**第一步：** 调用`fn()`的时候，结合我们上一篇this指向的学习可以知道这里的this是指向的window。所以打印出来的是10;
   
第一步相信都看得出来。重点是第二步，第二步我们需要一个知识点。**当对象通过`.`或者`[]`进行调用方法的时候。这个时候方法中的this就是指向那个调用它对象。** 这点和我们上一篇的分析是一致的。**谁最后调用这个函数，那么this就指向谁。**

**举个例子：**

````js
function fn(){
    console.log(this.length)
}
var arr = [fn,1,2,3,4];
arr[0]();
//5
````
通过这个例子不难看出，因为fn方法是我通过数组arr的索引值进行调用的。所以fn中打印的this是指向的数组arr。打印出的也是数组的长度。这个时候我们再来看例子的第2步不难知道结果：

**第二步:** 当`arguments[0]()`调用时，也是同我们"**举个例子**"中的数组调用方法的情况一样。所以这个时候的this实际指向的就是
arguments这个数组。相应的获取的长度也就是数组的长度。

所以最终的打印是 10 、2。

**这里不知道arguments是什么朋友可以先去了解一下。**

**箭头函数中的this：**

1. 箭头函数也是匿名函数。
2. 箭头函数中的this是在创建箭头函数时就已经确定的，并不是绑定调用的时候确定的。
3. 箭头函数中的this指向的是它外层的第一个非箭头函数的this。

通过代码来理解这3句话：

首先箭头函数是一个匿名函数，这个就不用多介绍了。

**我们来看第二句话：**

**箭头函数中的this是在创建箭头函数时就已经确定的，并不是绑定调用的时候确定的。**

````js
var name = "window";
var a = {
    name:"obj",
    func:()=>{
        console.log(this.name)
    }
}
a.func();
var newFunc = a.func;
newFunc()
//window
//window
````
通过打印结果，我们不难发现。箭头函数中的this并不会随着我们调用对象的改变而改变。

我们再来看新知识点 **当对象通过`.`或者`[]`进行调用方法的时候。这个时候方法中的this就是指向那个调用它对象。** 中的情况：

````js
var length = 10;
var fn = ()=>{
    console.log(this.length);
}

var arr = [fn,1,2,3]

arr[0]()

//10
````
可以发现，依然不受影响。 **流水的调用方式，铁打的this指向。**

所以我们说，箭头函数中的this指向是在箭头函数中创建的时候就确定了。而不是在调用过程中去绑定。

**我们来看第三句话：**

**箭头函数中的this指向的是它外层的第一个非箭头函数的this。**

````js
var name = "window";
var a = {
    name:"obj",
    func:function(){
        console.log("func===",this.name);
        (()=>{
            console.log("()=>",this.name)
        })()
    }
}
a.func();
// func=== obj
// ()=> obj
````
通过示例代码来看看这句话 **箭头函数中的this指向的是它外层的第一个非箭头函数中的this** 。

我们再看之前的两个例子:

````js
var name = "window";
var a = {
    name:"obj",
    func:()=>{
        console.log(this.name)
    }
}
a.func();
var newFunc = a.func;
newFunc()
//window
//window
````

````js
var length = 10;
var fn = ()=>{
    console.log(this.length);
}

var arr = [fn,1,2,3]

arr[0]()
//10
````
在这两个例子中，箭头函数的外层都是没有function函数的。所以箭头函数就直接指向了window。

我们再写两个例子来验证一下；

````js
var name = "window";
var a = {
    name:"obj",
    func1:function(){
        console.log("func1===",this.name);
        this.func2()
    },
    func2:()=>{
        console.log("func2===",this.name);
        (()=>{
            console.log("()=>",this.name)
        })()
    }
}
a.func1();

// func1=== obj
// func2=== window
// ()=> window
````
在这个例子中，因为箭头函数外层是没有function函数的。所以箭头函数直接指向了window

````js
var name = "window";
var a = {
    name:"obj",
    func1:function(){
        console.log("func1===",this.name);
        setTimeout(()=>{
            console.log("()1=>",this.name)
        },10)
    },
    func2:()=>{
        setTimeout(()=>{
            console.log("()2=>",this.name)
        },10)
    }
}
a.func1();
a.func2();

// func1=== obj
// ()1=> obj
// ()2=> window
````
在这个例子中，我们使用了两个定时器。通过之前的ES5中的this的学习可以知道。在定时器中，匿名函数指向是window。但是箭头函数并不遵循这一规则。可以看到，**箭头函数的this依旧取决于它外层非箭头函数的this** 。

改写一下上面例子中func1中的this指向：

````js
var name = "window";
var a = {
    name:"obj",
    func1:function(){
        console.log("func1===",this.name);
        setTimeout(()=>{
            console.log("()1=>",this.name)
        },10)
    }
}

var newFunc = a.func1;
newFunc()

// func1=== window
// ()1=> window
````
不难发现，箭头函数中的this指向也随着外层function函数this的改变而改变。

所以我们应该知道：**箭头函数中的this取决于外层第一个function函数的this指向**,如果没有外层的function函数，那么箭头函数的this指向是window。

**call、apply、bind的区别和作用**

三者都可以改变this的指向:

````js

/*apply,call,bind的使用*/

var name = "window";
var o = {
    name:"obj",
    fn:function(value1,value2){
        console.log(`传入的值是:${value1}===${value2}`)
        console.log(this.name);
    }
}
var newFn = o.fn;
newFn("hello","直接调用"); 
// 传入的值是:hello===直接调用
//window

newFn.apply(o,["hello","apply"]);
// 传入的值是:hello===apply
//obj

newFn.call(o,"hello","call");
// 传入的值是:hello===call
//obj

newFn.bind(o,"hello","bind")();
// 传入的值是:hello===bind
// obj
````
通过上例代码不难看出三者之间的共同点和区别：

**相同点：**

1. 都可以改变this的指向。
2. 都可以传参。

**不同点：**

1. 其中call相当于apply的语法糖，它们区别在于：在apply中传递参数必须使用数组，而call中一个一个传递即可。
2. **bind不会立即执行，而是返回一个函数** 。

因为bind返回的是一个函数，所以在使用bind传递参数的时候还可以采用以下形式:

````js
···
newFn.bind(o,"hello","bind")();
// 传入的值是:hello===bind
// obj

newFn.bind(o)("hello","bind");
// 传入的值是:hello===bind
// obj

````
**当我们给call、apply、bind传递的第一个参数是null或者undefined时:**

**严格模式下则会报错**

````js
// Uncaught TypeError: Cannot read property 'name' of undefined
````
**在非严格模式下this则会指向window:**

````js
...

newFn.bind(undefined)("hello","bind");
// 传入的值是:hello===bind
// window

newFn.bind(null)("hello","bind");
// 传入的值是:hello===bind
// window

newFn.apply(undefined,["hello","apply"])
// 传入的值是:hello===apply
// window
newFn.apply(null,["hello","apply"])
// 传入的值是:hello===apply
// window

newFn.call(undefined,"hello","call")
// 传入的值是:hello===call
// window
newFn.call(null,"hello","call")
// 传入的值是:hello===call
// window

````

**尾巴：**

**参考文献：** [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

**箭头函数和call、apply、bind的特点和使用就学习到这里了。纯手打文章，如果错误，欢迎指正。**
