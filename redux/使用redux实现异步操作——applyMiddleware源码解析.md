#### 一句话总结
---
`redux`提供了`applyMiddleware`来组合串联`middlewares`，处理的结果便是`dispatch = mid1(mid2(mid3(store.dispatch)))`

#### 理解applyMiddleware
---
>图片中展示的是applyMiddleware和中间件logger的源码。
![image](https://pic1.zhimg.com/8fe84a1600b6b2d98dc69dc08f016e00_b.png)

可以看到，能够单独使用一个`applyMiddleware`来生成一个store，写法如下：
```
//对照图片可以发现这里参数1的传递使用了ES6语法 —— Rest参数赋值
let newStore = applyMiddleware(mid1, mid2, mid3, ...)(createStore)(reducer, null);
```
而通常我们是把他作为createStore的第二个参数来使用的，此时只需要传入一个参数，即`(mid1, mid2, mid3, ...)`,其余参数由createStore提供。

>参考：createStore源码片段
```
export default function createStore(reducer, preloadedState, enhancer) {
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        //如果只传了两个参数，并且第二个参数为函数，第二个参数会被当作enhancer
        enhancer = preloadedState
        preloadedState = undefined
    }
  
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            //校验enhancer是否为函数，如果不是函数则抛出异常
            throw new Error('Expected the enhancer to be a function.')
        }
        //如果enhancer存在且为函数，那么则返回如下调用，如果enhancer为applyMiddleware，那么调用则
        //是applyMiddleware(createStore)(reducer, preloadedState)。
        return enhancer(createStore)(reducer, preloadedState)
    }
    ...
```
以上两种方法任意一种执行完毕之后都会使`applyMiddleware`获得三个参数，对照源码：

>第一个是 `middlewares` 数组 `[mid1, mid2, mid3, ...]`
>
>第二个 `next` 是 `Redux` 原生的 `createStore`
>
>最后一个是 `reducer`

##### 接受到参数后`applyMiddleware`按照以下步骤开始执行

*Step1：向每个中间件传递`getState`和`dispatch`*

对比图中可以看到，`applyMiddleware`利用`createStore`和`reducer`创建了一个`store`，然后`store`的`getState`方法和`dispatch`方法又分别被直接和间接的赋值给`middlewareAPI`变量，`middlewareAPI`就是对比图中红色箭头所指向的函数的入参`store`。

经过了上面这一步操作，`applyMiddleware`便将`getState`和`dispatch`包装在`middlewareAPI`中传入了每一个中间件的参1。

同时由于闭包的存在，每一个中间件引用的都是同一个`middlewareAPI`。

>`middlewareAPI`中的dispatch之所以要写作一个匿名函数，是为了建立引用，使得每个中间件对dispatch的改造都能够被共享。

*Step2：串联所有中间件*

`dispatch = compose(...chain)(store.dispatch);`

`compose`函数的实现方法在此省略。

`compose`的执行结束后我们得到的`dispatch`实际上是这样的：

`dispatch = f1(f2(f3(store.dispatch))))`

`f1`,`f2`,`f3`即是处理后传入`chain`的中间件函数。它们按照传入的顺序，从右到左依次执行，左边的函数收到参数即是右边执行的结果（即处理后的`dispatch`函数），而最右边的函数接受store.dispatch作为参数。此参数就是各个中间件中的`next`。

*Step3：将处理好的`dispatch`放入`store`，等待调用*

经过上面的一些列操作后，当我们在外层环境中调用`store.dispatch（action）`时便是使用的经过中间件加工后的`dispatch`而不是原生的`dispatch`了。
>参考链接：
>
>[redux middleware 详解](https://zhuanlan.zhihu.com/p/20597452?utm_source=tuicool&utm_medium=referral)
>
>[Redux createStore源码学习](https://segmentfault.com/a/1190000009479302)