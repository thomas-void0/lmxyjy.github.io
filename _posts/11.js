// var props = {
//     name:"brid"
// }

// class Admin{
//     constructor(name){
//         this.props={
//             name
//         }
//     }
//     fly=()=>{
//         function canFly(){
//             console.log("this===>",this);
//             return this.props.name === "brid";
//         }
//         if(canFly.bind(this)()){
//             console.log("fly");
//         }else{
//             throw new Error("i am not a brid");
//         }
//     }
// }
// const a = new Admin("brid");
// try {
//     a.fly()
// } catch (e) {
//     console.log(e.message); //Cannot read the "props" of undefined
// }

// "use strict"

// function Admin(name){
//     this.props = {name};
// }
// Admin.prototype.fly = function(){
//     function func(){
//         console.log("this===>",this);
//         return this.props.name = "husa";
//     }
//     if(func()){
//         console.log("我是咖咖");
//     }else{
//         console.log("报错了")
//     }
// }
// let a = new Admin("husa");
// a.fly()
// let colors = ["red", "blue", "green"];
// console.log(colors.toString())
// console.log(colors.valueOf())
// console.log(colors)

// var colors = ["red","blue"];
// colors.push("brown");
// colors[3] = "black"; 
// console.log(colors.length);
// var item = colors.pop();
// console.log(item)


function sayName(name){
    console.log(name);
}

function sum(num1,num2){
    return num1 + num2;
}
function sayHi(){
    console.log("hi");
}
console.log(sayName.length);//1
console.log(sum.length);//2
console.log(sayHi.length);//0