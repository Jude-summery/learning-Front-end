/**
 *  ReactDOM.render()在执行的时候做了两件事
 * 1. 生成fiberRootNode，即整个应用的根节点（应该并不是一个fiber节点），用来挂载Fiber树
 * 2. 生成rootFiber，即Fiber树的根节点, 这是整个应用的第一个fiber节点
 * 3. fiberRootNode.current === rootFiber
 * 
 * TODO: 这两个东西应该都是react内部的东西，和真实的dom无关
 */