// hook 的更新
// TODO 为什么要这么设计hook呢，为什么不直接储存状态到fiber节点中呢

function App() {
    const [num, updateNum] = useState(0);

    return <p onClick={() => {
        updateNum(num => num + 1);
        updateNum(num => num + 1);
        updateNum(num => num + 1);
    }}>{num}</p>
}

const update = {
    // 更新执行的函数
    action,
    // 与同一个Hook的其他更新形成链表
    next: null
}

// 调用updateNum实际调用的是dispatchAction.bind(null, hook.queue)
function dispatchAction(queue, action){
    // 创建update
    const update = {
        action,
        next: null
    }

    /**
     * 环状单向链表操作
     * 这样操作之后queue.pending始终指向最新的update，同事queue.pending.next指向第一个update
     * 同时这样也能保证形成的环状链表中循环的顺序是按update产生的顺序来的
     */
    if(queue.pending === null){
        update.next = update;
    } else {
        update.next = queue.pending.next;
        queue.pending.next = update;
    }
    queue.pending = update;

    // 模拟React开始调度更新
    schedule();
}

 // FunctionComponent组件的状态存在节点对应的fiber对象中
 const fiber = {
     // 保存该FunctionComponent对应的Hooks链表
     memoizedState: null,
     // 指向App函数
     stateNode: App
 };

 // Hook数据结构，保存在fiber.memoizedState中

 hook = {
     // 保存update的queue
     queue: {
         pending: null
     },
     // 保存hook对应的state
     memoizedState: initalState,
     // 与下一个Hook连接形成单向无环链表
     next: null
 }

 // 首次render时是mount
 isMount = true;

 function schedule() {
     // 更新前将workInProgressHook重置为fiber保存的第一个Hook
     workInProgressHook = fiber.memoizedState;
     // 触发组件render
     fiber.stateNode();
     // 组件首次render为mount，以后再触发的更新为update
     isMount = false;
 }

 // 计算state 组件render时会调用useState

function useState(initialState) {
    // 当前useState使用的hook会被赋值给该变量
    let hook;
    if(isMount){
        // ...mount时需要生成hook对象
        hook = {
            queue: {
                pending: null
            },
            memoizedState: initialState,
            next: null
        }

        // 将hook插入fiber.memoizedState链表末尾
        if(!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        // 移动workInProgressHook指针
        workInProgressHook = hook;
    } else {
        // ...update时从workInProgressHook中取出该useState对应的hook
        hook = workInProgressHook; // workInProgressHook = fiber.memoizedState
        // 移动指针，为下一个hook取值做准备
        workInProgressHook = workInProgressHook.next;
    }

    let baseState = hook.memoizedState;
    // update时的情况
    if(hook.queue.pending){
        // ...根据queue.pending中保存的update更新state
        // 获取update环状单向链表中的第一个update
        let firstUpdate = hook.queue.pending.next;

        do {
            // 执行update action
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;

            // 最后一个update执行完后跳出循环，即下一个将要操作的节点是第一个节点的时候跳出循环
        } while (firstUpdate !== hook.queue.pending.next)

        // 清空queue.pending
        hook.queue.pending = null;
    }

    // 将update action执行完成后的state作为memoizedState
    hook.memoizedState = baseState;

    return [baseState, dispatchAction.bind(null, hook.queue)]
}


/**
 * 与React的区别:
 * 1. 没有isMount变量，而是调用不同的dispatcher
 * 2. React会优化执行过程，可能会跳过某些更新，也会区分优先级
 * 3. 有batchUpdates，对于连续触发的同一个update，会计算好最终状态，只触发一次更新
 */