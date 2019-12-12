---
layout: post
title:  "TypeScript基础学习"
date:   2019-12-11
project: true
comments: true
---

**个人学习typescript基础的笔记，包括了常用的语法和注意事项。**

**TS的基本配置:**

1. 全局安装typescript：`npm install -g typescript`

2. 将ts编译成js代码：在命令行中输入tsc xxx.ts

3. 配置vscode的自动编译：
    1. 在项目文件目录下的终端中输入`tsc --init`
    2. 在生成的tsconfig.json中找到// "outDir": "./", 可以设置编译存放目录
    3. 在vscode中点击"终端"，选择"运行任务",选择监听对应目录下的tsconfig.json

**基本语法规则：**

变量声明，变量声明需要指定数据类型：

````ts
const a:number = 123;
const b:string = "abc";
const c:boolean = true;
````
ts中的数据类型和js中的不同,ts中有枚举类型和元组类型:

**枚举类型:**

````ts
/*枚举类型：可以用直观的方式去表示计算机中的状态，让现实生活中的一些事物和计算机中的数字对应起来。比如成功可以定义为success = 1,较常用于对执行执行状态的判断。*/ 

// 枚举类型示例
enum Flag{
    success,
    error = 2,
    wait = 4,
    "start",
}
// 调用枚举类型
let en:Flag = Flag.success;
````

**元组类型：** 可以对数组中的不同元素分别设置类型,属于数组的一种

````ts
const arr:[number,string,boolean] = [234,"str",true];
````

**定义数组:**

````ts
const arr1:any[] = [1,"xxx",true,{key:123}];
const arr2:number[] = [1,2,3];
const arr3:Array<number> = [1,2,3];
````

**定义函数**

````ts
function func(arg1:number):void{
    /*没有返回值*/
}
function func1(arg1:string,arg2:any[]):string{
    /*返回值必须为字符串*/ 
    return "str";
}
function func2(...args:any):any{
    /*可以传入多个任意类型的参数，没有返回值或者返回值可以为任意类型*/
    return args;
}
````

**函数重载:** 同名的函数具有不同的参数。传入不同的参数调用不同的方法

````ts
function getInfo(name:string):string;
function getInfo(name:number):number;
function getInfo(name:any):any{
    if(typeof name == "string"){
        return "str";
    }else if(typeof name == "number"){
        return 123;
    }else{
        return name;
    }
}
````

**never类型:** 表示从来不会出现的值,很少使用。通常用于抛出错误的处理。

````ts
let neve:never;
````

**定义类的写法:** 与es6的写法相同。

````ts
class Person{
    name:string | undefined;
    age:number;
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    eat(arg:string):void{
        console.log(arg + "eat...");
    }
}
````

**es5中的继承和ts中的继承的区别:**

>es5中的继承:
    >对象冒充的方式：无法继承prototype上面的属性和方法
    >prototype的方式：无法在示例化的时候给父类传入参数
    >组合继承的方式：可以实现完全继承
    >tip:es5中如果是构造函数的方法不是挂载在prototype上的，那么继承太多会浪费内存。
    >因为每个子类都分别对该类型的方法进行了复制。

**ts中的继承:** ts的继承主要依靠extends 和 super关键字实现,写法与es6相似

````ts
class TsParent{
    name:string;
    age:number;
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    eat():void{
        /*code*/
    }
}
class TsSon extends TsParent{
    sex:string; 
    constructor(sex:string,name:string,age:number){
        super(name,age); //将父级的属性传入super中,实现初始化父类的构造函数
        this.sex = sex;
    }
    run():void{
        /*code*/
    }
    eat():void{
        /*优先级高于父类*/
    }
}
````

**ts中的修饰符:** 

1. public:公有的，实例化对象亦可以访问
2. protected:受保护的，只有子类和自身可以访问
3. private:私有的，只有自身可以访问

````ts
class Mark{
    public name:string | undefined;
    protected age:number;
    private sex:string = "男";
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    protected eat():void{
        console.log("this method is protected");
    }
}
````

**静态方法:** 不需要示例化对象,使用"类名.属性名 或者是 方法名"即可调用
继承的子类一样可以使用它

````ts
class A {
    static num:number = 11;
    age:number | undefined;
    constructor(age:number){
        this.age = age;
    }
    static eat():void{
        console.log("这是一个static方法",this.num);
    }
}
class B extends A{
    constructor(age:number){
        super(age);
    }
}
const aa = new B(2);
// aa.eat(); 错误的写法
B.eat();//正确的写法，需要用类名.属性  or 方法;
A.eat();
console.log(B.num);
````

**多态:** ts中父类定义一个方法不去实现，而让继承它的子类们去实现。会出现不同的子类的同一个方法产生的结果不同，这就是多态。（多态是继承的一种体现）

````ts
class Am{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    eat():void{};
}
class Dog extends Am{
    constructor(name:string){
        super(name);
    }
    eat():void{
        console.log(this.name + "吃骨头"); //同一个eat方法
    }
}
class Cat extends Am{
    constructor(name:string){
        super(name);
    }
    eat():void{
        console.log(this.name + "吃鱼");//同一个eat方法
    }
}
````

**抽象类:** 是一种继承的定义类，它是一种继承规则。不能被实例化，关键词：abstract

````ts
abstract class Abs{
    public name:string;
    abstract age:number;
    constructor(name:string){
        this.name = name;
    }
    abstract eat():string;
    run():void{ 
        console.log("other method");
    }
}
class AbsSon extends Abs{
    age:number;//抽象属性需要被实现
    constructor(name:string,age:number){
        super(name);
        this.age = age;
    }
    eat():string{
        return "food";
    }
}
class AbsGrandson extends AbsSon{
    constructor(name:string,age:number){
        super(name,age);
    }
}
````

**接口:** 就是一种对于规范的定义，类似于抽象类，只是提供一个标准，关键词interface

1. 可索引接口:对数组和对象的约束(不常用);
2. 类类型接口:对类的约束，与抽象类相似;
3. 函数类型接口:对函数的约束，复用方便;

**接口应用示例：封装一个ajax命令**

````ts
// 首先定义一个接口:
interface AjaxObj{
    type:string;
    data?:string;
    url:string;
    dataType:string;
}
// 根据接口定义ajax函数:
function ajax(obj:AjaxObj):void{
    const xhr = new XMLHttpRequest();//实例化请求对象
    xhr.open(obj.type,obj.url,true);
    xhr.send(obj.data);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            if(obj.dataType == "json"){
                let data = xhr.responseText;
                data = JSON.parse(data);
                console.log("data:",data);
            }
        }
    }
}
// 发起请求：必须根据接口定义的规则来传入数据
const ajaxobj = {
    type:"get",
    data:"123",
    url:"http://a.itying.com/api/productlist",
    dataType:"json"
}
// 调用函数
ajax(ajaxobj);
/*13.1,可索引接口：*/ 
interface Userall{
    [index:number]:string;
}
const userall1:Userall = ["str1","str2"];
const userall2:Userall = {123:"str"};
````

2. **类类型接口**:

````ts
interface Cls{
    name:string;
    eat():void;
}
class ClsType implements Cls{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    eat():void{
        console.log("hello...");
    }
}
````

**接口的继承:**

接口的继承1:子类继承父类同时实现接口

````ts
interface Cls2{
    age:number;
    eat():void;
}
class ClsParent{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    run():void{};
}
class ClsSon extends ClsParent implements Cls2{
    age:number;
    constructor(age:number,name:string){
        super(name);
        this.age = age;
    }
    eat():void{
        console.log("即实现了继承父类，也实现了接口");
    }
}
````

接口的继承2:接口继承接口,在原本接口规则的基础上增加新的接口规则

````ts
interface ClsA{
    eat():void;
}
interface ClsB extends ClsA{
    work():void;
}
class ClsAB implements ClsB{
    eat():void{};
    work():void{};
}

````

3. **函数类型接口：**

````ts
/*函数类型接口*/ 
interface Func{
    (key:string,value:number):void;
}
const interFunc:Func = function(key:string,value:number):void{
    console.log("对函数规则的定义");
}
````

**泛型：** 泛型的作用：解决类，接口，方法的复用性。以及对不特定数据的支持，同时不放弃类型检查

````ts
function genericity<T>(name:T):T{
    return name;
}
function genericity1<T>(age:number,name:T):T{
    return name;
}
// 调用:
genericity<number>(123);
genericity<string>("str");
````

1. **泛型类:**

示例：定义一个返回最小值的的类

````ts
class Genericity<T>{
    public name:string;
    public list:T[]=[];
    constructor(name:string){
        this.name = name;
    }
    add(value:T):void{
        this.list.push(value);
    }
    main():T{
        let min:T = this.list[0];
        this.list.forEach(ele=>{
            if(ele<min){
                min = ele;
            }
        })
        return min;
    }
}
const gen = new Genericity("start");
gen.add(12);
gen.add(13);
gen.add(22);
gen.add(14);
console.log(gen.main());
````

2. **泛型接口:**

````ts
// 泛型函数接口1:
interface Config{
    <T>(value:T,age:T):T;
}
const ConfigFunc1:Config = function<T>(value:T,age:T):T{
    return value;
}
// 泛型函数接口2:
interface Config1<T>{
    (value:T):T;
}
const ConfigFunc2:Config1<string> = function<T>(value:T):T{
    return value;
}
function KaKa<T>(value:T):T{
    return value;
}
const Config3:Config1<string> = KaKa;
````
3. **把类作为参数类的泛型:将一个类作为泛型**

````ts
class User{
    username:string | undefined;
    password:string | undefined;
}
class MysqlDb{
    add(info:User):boolean{//将一个类作为参数
        return true;
    }
}
let userObj = new User();
userObj.username = "hello";
userObj.password = "123456";
let mysqlObj = new MysqlDb();
mysqlObj.add(userObj);
````

**模块化开发：** 模块可以分为1，内模块：称为命名空间，2，外模块：简称模块（外部引入的文件）

**命名空间:** 作用域只能在空间中,使用方法，先用export暴露出来，然后空间名.属性名 或者 方法名

````ts
namespace A{
    export const a:number = 123;
    export class Aa{
        constructor(){}
        eat():void{};
    }
}
console.log(A.a);
const AaObj = new A.Aa();
````

**外部模块:** 在外部模块中通过export(可以写多个暴露) 或者 export default(只能暴露一个)。然后在需要用到的模块中import 或者 require 引入暴露出来的模块

**装饰器:** 就是一个方法，可以对类进行扩展和修改。按照写法分类：
1. 普通装饰器
2. 装饰器工厂
   
普通装饰器没有办法接受传参，装饰器工厂可以接受传参
装饰器是在编译阶段就会执行的，修饰器的本质就是在编译阶段就会执行的函数。

1. 类装饰器：对一个类进行扩展和修改
2. 属性装饰器:可以修饰类的属性,并且可以接受两个参数
3. 方法装饰器：可以修饰类的方法，接受3个参数
4. 方法参数修饰器：参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
    1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
    2. 参数的名字。
    3. 参数在函数参数列表中的索引。

ts中的class与java等强类型语言中不同，只是js构造函数的语法糖

**装饰器执行顺序:**

````ts
// 普通修饰器
function logClass(params:any){
    console.log("=======>",params);//params
}
@logClass
class LogA{
    name:string | undefined;
    constructor(name:string){
        this.name = name;
    }
}
// 修饰器工厂
function K1(params:any){
    //params：是传入进来的那个参数
    return function(target:any){
        //target:是修饰器修饰的类
    }
}
@K1("hello")
class KClass{
    
}
/*装饰器重载构造函数：*/
function K2(params:any){
    return class extends params{
        apiUrl:string = "xxxx";
        eat():void{
            console.log("2222")
        }
    }
}
@K2
class K2Class{
    apiUrl:string;
    constructor(){
        this.apiUrl = "hello1";
    }
    eat():void{
        console.log("1111")
    }

}
````

**属性装饰器:** 可以修饰类的属性,并且可以接受两个参数

````ts
function K3(params:any){
    return function(target:any,attr:any){
        //target:代表类
        //attr:代表属性
        target[attr] = "new string";
    }
}
class K3Class{
    @K3("小行星")
    public arg1:string;
    constructor(){
        this.arg1 = "string";
    }
    eat():void{}
}
````

**方法装饰器:**  传入3个参数，1：类，2：方法的名字，3：方法的属性描述

````ts
function K4(params:any){
    return function(target:any,name:any,desc:any){
        //target:类
        //name:方法名
        //desc:方法描述 ---->desc.value：方法定义

        // 直接覆盖方法的修改方式
        desc.value = function():string{
            return "a"
        }

        // 给类扩展一个方法
        target.run = function():void{}

        // 修改方法的写法
        //1,记录下原本的方法
        const oldFunc = desc.value;
        //2,修改方法
        desc.value = function(...args:any[]):any{
            args = args.map(ele=>{
                return String(ele);
            })
            //3,对象冒充
            oldFunc.apply(this,args);
        }
    }
}
class K4Class{
    public age:number | undefined;
    constructor(){}
    @K4("change")
    getData(...args:any[]):any{
        console.log(args);
    }
}
````