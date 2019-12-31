---
layout: post
title:  "项目练习记录：react-hooks中遇到的一些问题"
date:   2019-12-31
project: true
comments: true
---

**最近在练习使用react-hooks + ts + antd制作一个项目，在过程中出现不少的问题，特此记录下来：**

**问题一：函数组件中，初始化的函数方法拿不到最新的状态值**

当时我的业务场景是，我在点击商品下架后，去后台请求我当前页码的数据，实现刷新当前页码商品的状态的效果。但是我发现我在函数中所得到的页码总是初始化的值。没办法实现我想要的效果。我写了一个简单的示例代码还原当时的状态值问题：


````jsx
import React,{useState,useEffect,useRef} from 'react';

const App=()=>{
	/*button click*/
	const btnClick = ()=>{
		console.log("initButton getting state is====>",nowState); //can't get now state ,all is init value
	}
	/*init a button*/ 
	const initTitle = ()=>{
		return (
			<button onClick={btnClick}>click</button>
		)
	}
	const [title, settitle] = useState();

	/*now state*/
	const [nowState, setNowState] = useState(0);
    console.log("now state is====>",nowState);
    
	useEffect(()=>{
		settitle(initTitle());
	},[])

	return (
		<>
			{title}
			<button onClick={()=>setNowState(nowState + 1)}>change now state</button>
		</>
	);
}

export default App;
````

可以发现，当在我们点击按钮改变状态值后，我们初始化的button按钮的点击事件中拿到的总是初始化的值0；很明显这不是我们想要的。出现的原因很简单，经过我的观察后，我发现我们初始化的btnClick方法实际上形成了闭包。

再来对闭包的知识点做一个复习：

这里推荐波神的文章[**超性感的React Hooks（二）再谈闭包**](https://juejin.im/post/5dde6ac26fb9a0715d3cb194)

1. 当我们组件第一次挂载的时候，它保存了初始化的值0。
2. 闭包的特质就是能延长我们的作用域，保存我们的状态值。
3. 因为我们是在useEffect中模拟的生命周期componentDidMount,所以初始化后它并不会再次执行。也就没办法获得最新的状态值。

所以，我们每次访问的时候，方法中的状态值总是初始值。

**解决办法：**

使用hooks中的useRef。

````jsx
import React,{useState,useEffect,useRef} from 'react';

const App=()=>{
	const refBox = useRef(null);
	/*button click*/
	const btnClick = ()=>{
		console.log("initButton getting state is====>",nowState); //can't get now state ,all is init value
		console.log(`ref=======>${refBox.current}`); //get now state
	}
	/*init a button*/ 
	const initTitle = ()=>{
		return (
			<button onClick={btnClick}>click</button>
		)
	}
	const [title, settitle] = useState();

	/*now state*/
	const [nowState, setNowState] = useState(0);
	console.log("now state is====>",nowState);
	refBox.current = nowState;
	useEffect(()=>{
		settitle(initTitle());
	},[])

	return (
		<>
			{title}
			<button onClick={()=>setNowState(nowState + 1)}>change now state</button>
		</>
	);
}

export default App;
````
react官方对其的解释是:

>useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

也就是说：useRef就像是一个盒子，可以在它的.current的属性中保存任何可变的值。附上官方文档的详细说明，在此不做赘述。

[**官方useRef说明**](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref);

当我们使用useRef.current保存状态后，我们就可以拿到最新的状态值了。

**问题二，在函数组件中，给antd的级联选择器初始化options的时候，改变options状态值，但是级联选择器中的数据依旧是初始值。**

该问题暂时没找到解决的方法，mark一下。解决了再来记录。