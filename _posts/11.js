var name = "window";
function fn() {
    var name = 'fn';
    func1();
    function func1() {
        func2()
        function func2(){
            console.log(this.name);
        }  
    }
}
// fn()
 // windowsName

 let obj = {
        name : "obj",
        func1:function(){
            this.func2()
        },
        func2:function(){
            func3()
            function func3(){
                console.log(this.name);
            }
        }
 }
obj.func1()