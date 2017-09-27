#### setState是异步执行的
---
在相同的周期中尝试多次修改`state`的属性，其结果可能等价于`Object.assign()`,也就是后面的对`state`中同一属性的修改会覆盖前面修改。

#### 解决方案
---
1. 使用一个返回状态的对象的函数作为第一个参数，函数提供两个参数——之前的状态和属性
```
setState(prevState,props) => { 
    return { updateState }
    }
```

2. 使用setState的第二个可选参数，可传入一个回调函数，在组件状态更新完成之后调用。但是推荐使用componentDidUpdata来代替这种方法。

以上两种解决方案都可以实现同步的读取更新后的state的功能。