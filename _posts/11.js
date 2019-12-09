// "use strict"

var name = "window";
var o = {
    name:"obj",
    fn:function(value1,value2){
        console.log(`传入的值是:${value1}===${value2}`)
        console.log(this.name);
    }
}
var newFn = o.fn;

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