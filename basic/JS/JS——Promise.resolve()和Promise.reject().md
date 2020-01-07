#### Promise.resolve()

1. 向`Promise.resolve(...)`传递一个非Promise、非thenable的立即值，就会得到一个fulfilled状态、返回值为该立即值的Promise对象
2. 若传递一个Promise,则返回同一个Promise
3. 若传递一个非Promise的thenable值，则会试图展开这个值，知道提取出一个具体的非类promise的最终值

```
var p = {
    then: function(cb,errcb){
        cb(42);
        errcb('error');
    }
}

Promise.resolve(p).then(
    function fullfilled(val){
        console.log(val) // 42
    },
    function rejected(err){
        console.log(err) // 不会执行
    }
)
// ----------------------
var p = {
    then: function(cb,errcb){
        errcb('error');
    }
}

Promise.resolve(p).then(
    function fullfilled(val){
        console.log(val) // 不会执行
    },
    function rejected(err){
        console.log(err) // error
    }
)
// ----------------------
var p = {
    then: function(cb,errcb){
        throw new Error('error')
        cb(42);
    }
}

Promise.resolve(p).then(
    function fullfilled(val){
        console.log(val) // 不会执行
    },
    function rejected(err){
        console.log(err) // error
    }
)
// ----------------------
var p = {
    then: function(cb,errcb){
        cb(42);
        throw new Error('error')
    }
}

Promise.resolve(p).then(
    function fullfilled(val){
        console.log(val) // 42
    },
    function rejected(err){
        console.log(err) // 不会执行
    }
)
```
#### Promise.reject()
`Promise.reject(reason)`方法返回一个新的Promise实例，状态为Rejected。Promise.reject方法的参数reason会被传递给实例的回调函数。
```
Promise.reject("Testing static reject").then(function(reason) {
  // 未被调用
}, function(reason) {
  console.log(reason); // "Testing static reject"
});
```


*thenable值的判断*

*1. 假设存在一个值p*

*2. 判断若p为对象或函数*

*3. 判断若p.then为函数*

*则p为thenable值*

这种判断类型的方法叫做鸭子类型