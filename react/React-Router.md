### 不使用`react-router`时，可用的方法
---
- `window.location(.hash)`
- `window.addEventListener('hashchange',callback)`

### 基础用法
---
- 将`<a>`替换成`<Link to='/'>...</Link>`

- 使用`<IndexRoute component={} />`来设置默认页面，而且该组件会参与到类似`onEnter`这类路由机制中来。

- 在多层嵌套的路由里，使用绝对路径，可以忽略 URL 的嵌套关系，简化 URL 。

- 重定向：`<Redirect from='' to=''>`
 
- 进入和离开的 HOOK ：`onEnter`和`onLeave`。在类似需要权限验证，路由跳转前将一些数据持久化保存起来的情况时，非常有用。会嵌套的触发。

- 路由匹配原理
    
    - 嵌套关系：当给定的 URL 被调用时，整个集合中（命中的部分）都会被渲染。
    - 路径语法（特殊符号）：
    
        - `：paramName` - 匹配一段位于`/`，`?`或`#`之后的 URL ，命中的部分将被当作一个参数。
        - `()` - 内部为可选匹配。
        - `*` - 匹配任意字符直到命中下一个字符或整个 URL 的末尾。
    - 优先级：按照定义的顺序，自上而下的匹配。

- `History`：从`react-router`中导入其中一个，显式指定在`<Router>`组件中。

    - `browserHistory`：官方推荐使用，需对服务器进行配置，使用真实的 URL 地址。
    - `hashHistory`：简单易用，使用 `#` 实现路由。
    - `createMemoryHistory`：主要用于服务器渲染。它创建一个内存中的`history`对象，不与浏览器 URL 互动。

- `<IndexLink to='/'>`:避免根页面的`<Link>`一直处在激活的状态。

### 进阶用法
---
- 动态路由
    - `react-router` 里的路径匹配以及组件加载都是异步完成的，不仅允许你延迟加载组件，并且可以延迟加载路由配置。在首次加载包中你只需要有一个路径定义，路由会自动解析剩下的路径。
    - `Router`可以定义`getChildRoutes`,`getIndexRoute`,`getComponents`几个函数，他们都是异步执行的。而且只会加载该 URL 对应页面所需的路径配置和组件。

- 跳转前确认
    
    -  `react-router`提供一个生命周期函数`routerWillLeave`，可以拦截正在离开`route`的用户。
    -  返回值可以有以下两种：
        
        - `return false` 取消此次跳转
        - `return` 返回提示信息，在离开 `route` 前提示用户进行确认。

    - 需要通过`mixins`来引入。
    - 也可以在嵌套层级比较深的组件中使用`routerWillLeave`钩子，需要从`react-router` 中引入 `{ Lifecycle, RouteContext }`在`route`组件内`mixins:[ RouterContext ]`,在子组件内`mixins:[ Lifecycle ]`
    
- 在组件外部使用导航：利用`history`对象的`push`等方法。

>参考链接：
>
>[React Router 使用教程 -阮一峰](http://www.ruanyifeng.com/blog/2016/05/react_router.html?utm_source=tool.lu)
>
>[React Router 中文文档](http://react-guide.github.io/react-router-cn/index.html)
>
>[react-router 按需加载](https://segmentfault.com/a/1190000007141049)