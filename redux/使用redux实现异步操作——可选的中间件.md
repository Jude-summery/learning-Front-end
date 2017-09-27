#### 中间件
---
1. 中间件并不只是为了实现异步操作。
2. 中间件所做的操作是改造`store.dispatch`，使其可以接受各种各样的`action`,以满足业务需求。
3. 社区内有各种各样的中间件。

#### 中间件的使用
---
1. 通过`npm`安装所需的中间件。
2. 通过`import`导入中间件。
3. `import { creatStore, applyMiddleware } from 'redux'`。
4. 创建`store`：`let store = creatStore(reducer, applyMiddleware(middleware))`。
5. 此时中间件就已经激活完毕，即现在的`store.dispatch`就已经是改造完毕之后的了。

#### 可以实现异步操作的三种中间件
---
>这三种中间件并不单纯只能用来实现异步操作，只是可以利用他们来实现异步操作。
##### redux-thunk（模板代码较多，封装程度不高，较灵活）
&nbsp;`redux-thunk`源码分析

&nbsp;在这里贴出`redux-thunk`源码
 ```
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
 ```
&nbsp;其**核心代码**如下：
```
//参数分析：dispatch和getState是通过applyMiddlewear传入的，是未经改造过的原生方法。
//参数分析：next也是通过applyMiddlewear传入的，当此中间件是最后一个执行的中间件时，
//参数分析：其值等于原生的dispatch，否则即是其右侧的中间件处理函数。
//参数分析：注意：中间件的执行顺序是从右到左的。
//参数分析：action是通过组件调用store.dispatch时传入的。
({ dispatch, getState }) => next => action => {

    //当action是一个函数时，传入原生dispatch、setState和可选的参数执行。
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    
    //若不是函数则传入下一个中间件，如果下一个中间件不存在，则调用原生dispatch。
    return next(action);
  };
```
&nbsp;可以看到，对于不同的中间件，需要匹配不同的`action`.

&nbsp;一个典型的匹配`redux-thunk`的`action creator`
```
//action creator
const getDataAction = function(id) {

    //参数分析：这里的dispatch和getState便是由redux-thunk传入的
    return function(dispatch, getState) {
        dispatch({
            type: GET_DATA, 
            payload: id
        })
        api.getData(id) //注：本文所有示例的api.getData都返回promise对象
            .then(response => {
                dispatch({
                    type: GET_DATA_SUCCESS,
                    payload: response
                })
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_FAILED,
                    payload: error
                })
            }) 
    }
}
```
##### redux-promise（模板代码较redux-thunk少，不能实现乐观更新）
1. `redux-promise`源码分析
```
//isFSA用来检查action对象是flux标准对象
import { isFSA } from 'flux-standard-action';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    return isPromise(action.payload)
      ? action.payload.then(
      
        /*直接在中间件内发出了dispatch，相对于开发者来说是不透明的*/
          result => dispatch({ ...action, payload: result }),
          error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          }
        )
      : next(action);
  };
}
```
2. `redux-promise`的使用方法

`redux-promise`相较于`redux-thunk`减少了许多的模板代码，但是却对action和reducer的格式有了一定的要求。

- `action`必须包含一个`payload`属性，其值为一个promise对象。
- 在`reducer`的`switch`之下还要再新增一层的判断。

同时，由于直接将`dispatch`写入了中间件中，导致无法实现*乐观更新*。
>乐观更新：多数异步请求要等到请求成功才渲染数据，但乐观更新不等待请求成功，而是在发送请求的同时立即渲染数据。最常见的例子就是微信等聊天工具，发送消息时消息立即进入了对话窗，如果发送失败的话，再在消息旁边作补充提示。

实际应用场景：
```
//action types
const GET_DATA = 'GET_DATA';

//action creator
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: api.getData(id) //payload为promise对象
    }
}

//reducer
function reducer(oldState, action) {
    switch(action.type) {
    case GET_DATA: 
        if (!action.error) {
            return successState
        } else {
               return errorState
        }
    }
}
```

```
//FIXME
3. 改良版redux-promise-middleware
```
##### redux-saga （实现的逻辑与上面两个完全不同，功能较强大的异步管理中间件，需要一定时间学习才能掌握）
- `redux-saga` 通过创建 `Sagas` 将所有的异步操作逻辑收集在一个地方集中处理
- 这意味着应用的逻辑会存在两个地方
    - `Reducers` 负责处理 `action` 的 `state` 更新。
    - `Sagas` 负责协调那些复杂或异步的操作。
- `Sagas` 是通过 `Generator` 函数来创建的。但是使用它就像使用`async/await`函数，将异步操作像同步操作一般书写。
- `Sagas yield` 普通对象的方式让你能容易地测试 `Generator` 里所有的业务逻辑，可以通过简单地迭代 `yield` 过的对象进行简单的单元测试。


















>参考链接：
>
>[Redux异步方案选型](https://segmentfault.com/a/1190000007248878#articleHeader4)
>
>[redux-saga中文文档](http://leonshi.com/redux-saga-in-chinese/index.html)
>
>[redux-thunk ——Github](https://github.com/gaearon/redux-thunk)
>
>[redux-promise ——Github](https://github.com/acdlite/redux-promise)
>
>[redux-saga ——Github](https://github.com/redux-saga/redux-saga)