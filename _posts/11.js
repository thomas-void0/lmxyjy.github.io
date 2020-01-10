var name = "听风是风";
var obj = {
    name: "行星飞行",
    sayName: function () {
        return function () {
            console.log(name);
        };
    }
};

obj.sayName()(); // ？