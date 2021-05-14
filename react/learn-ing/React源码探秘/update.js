// 对于ClassComponent和HostRoot共用同一种Update结构
// Update由createUpdate方法返回
const update: Update<*> = {
    eventTime, // 任务时间，暂不需理解
    lane, // 优先级
    suspenseConfig, // 暂不关注
    tag: UpdateState, // 更新的类型，包括UpdateState | ReplaceState | ForceUpdate | CaptureUpdate
    payload: null, // 更新挂载的数据，不同类型组件挂载的数据不同。对于ClassComponent，payload为this.setState的第一个传参。对于HostRoot，payload为ReactDOM.render的第一个传参。
    callback: null, // 更新的回调函数, 即setState的第二个参数，ReactDOM.render的第三个参数
    next: null // 与其他Update连接形成链表
}

// update对象会组成链表，包含在fiber.updateQueue中
// Q：为什么一个fiber节点会有多个update对象 A：如在同一个事件中调用两次setState，便会产生两个update对象

// fiber.updateQueue
// UpdateQueue由initalizeUpdateQueue方法返回
const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState, // 本次更新前的state
    // 上次更新时，由于优先级不够被跳过的Update组成的链表
    firstBaseUpdate: null, 
    lastBaseUpdate: null,
    shared: {
        // 本次需要提交的更新
        pending: null,
    },
    // 保存update.callback !== null 的 Update
    effects: null
}

// 更新优先级的控制，可以简单的理解为，优先级高的更新，会在优先级低的更新还未完成的时候，中断优先级低的更新
// 然后执行自己的更新流程，更新完成后再回到之前未完成的更新上
// 但是为了保证用户触发变更之间顺序的，所以在优先级低的更新完成后，会再按顺序去执行一遍update链
// 所以高优先级的更新，至少会被执行两遍
// pending被设计成环形也就是出于这个目的， A1优先级更高A1执行完后找到他的next也就是A2执行，同时为了保持顺序再调用A2的next执行A1
// pending: A2 -> A1 (实际上为环形)