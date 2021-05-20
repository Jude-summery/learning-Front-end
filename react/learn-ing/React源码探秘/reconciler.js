// performSyncWorkOnRoot 会调用这里
function workLoopSync(){
    while(workInProgress !== null){
        performUnitOfWork(workInProgress);
    }
}

// performConcurrentWorkOnRoot 调用这里
function workLoopConcurrent(){
    while(workInProgress !== null && !shouldYield()){
        performUnitOfWork(workInProgress);
    }
}
/**
 * workInProgress === 当前需要处理的fiber节点
 * performUnitOfWork 创建下一个fiber节点并赋值给workInProgress并将生产的fiber节点连成树
 */

// performUnitOfWork 伪代码
// TODO: performUnitOfWork 具体实现

function performUnitOfWork(workInProgress){

    // 传入当前节点，创建子节点（workInProgress.child）
    beginWork(workInProgress)

    if(workInProgress.child !== null){
        performUnitOfWork(workInProgress.child)
    }

    completeWork(workInProgress)

    if(workInProgress.sibling !== null){
        performUnitOfWork(workInProgress.sibling)
    }
}

function beginWork(
    current: Fiber | null, // 即workInProgress.alternate
    workInProgress: Fiber,
    renderLanes: Lanes,
): Fiber | null {

    // update操作，满足条件即可复用节点
    /**
     * 满足两个条件即可尝试复用，具体可不可以复用还需要到reconcileChildren函数中进一步判断
     * 1. oldProps === currentProps，oldType === currentType 即节点属性和节点的类型不能变
     * 2. !includesSomeLane(renderLanes, updateLanes) 即不存在优先级更高的更新
     */
    if(current !== null){
        const oldProps = current.memoizedProps;
        const newProps = workInProgress.pendingProps;

        if(
            oldProps !== newProps ||
            hasLegacyContextChanged() ||
            (__DEV__ ? workInProgress.type !== current.type : false)
        ) {
            didReceiveUpdate = true
        } else if (!includesSomeLane(renderLanes, updateLanes)){
            didReceiveUpdate = false;
            switch(workInProgress.tag){

            }
            return bailoutOnAlreadyFinishedWork(
                current,
                workInProgress,
                renderLanes,
            );
        } else {
            // 节点信息相同，但存在优先级更高的任务
            didReceiveUpdate = false;
        }
    } else {
        // mount操作，状态置为不接受update
        didReceiveUpdate = false;
    }

    // mount操作，根据tag，创建不同的子Fiber节点
    switch(workInProgress.tag){
        case FunctionComponent: // 函数组件
        // ..省略，会调用到renderWithHooks方法
        case ClassComponent: // 类组件
        // ..省略
        case HostComponent: // 宿主组件，浏览器中即为DOM
        // ..省略
        // 还有多种其他类型，常见的为以上三种，他们最终会进入 reconcileChildren 方法
    }
}


// 生成新的子节点，作为本次beginWork的返回值，并传参给下一次的performUnitOfWork
// mountChildFiber 和 reconcileChildFiber流程相同，区别在于reconcileChildFiber会给Fiber打上effectTag
function reconcileChildren(
    current: Fiber | null,
    workInProgress: Fiber,
    nextChildren: any,
    renderLanes: Lanes
) {
    if(current === null){
        // mount
        workInProgress.child = mountChildFibers(
            workInProgress,
            null,
            nextChildren,
            renderLanes
        )
    } else {
        // update
        workInProgress.child = reconcileChildFibers(
            workInProgress,
            current.child,
            nextChildren,
            renderLanes
        )
    }
}

/**
 * complateWork()
 * 生成DOM（TODO：应该是VDOM），并拼接成DOM tree
 */

function complateWork(
    current: Fiber | null,
    workInProgress: Fiber,
    renderLanes: Lanes,
): Fiber | null {
    const newProps = workInProgress.pendingProps;

    switch (workInProgress.tag) {
        case MemoComponent:
            return null;
        case ClassComponent: {
            // ...省略
            return null;
        }
        case HostRoot: {
            // ...省略
            updateHostContainer(workInProgress);
            return null;
        }
        case HostComponent: {
            //  生成DOM
            popHostContext(workInProgress); //TODO
            const rootContainerInstance = getRootHostContainer();
            const type = workInProgress.type; // 节点类型

            if(current !== null && workInProgress.stateNode != null){
                // update的情况
                /**
                 * 因为已经存在对应DOM节点，所以不需要生成DOM节点
                 * 主要处理props的变化：
                 * 1. 事件回调函数的注册
                 * 2. style prop
                 * 3. DANGEROUSLY_SET_INNER_HTML prop
                 * 4.children prop
                 * 
                 * 在updateHostComponent内部被处理完的props会被
                 * 以[key1, value1, key2, value2...]的形式
                 * 赋值给workInProgress.updateQueue
                 * 最终在commit阶段被渲染到页面上
                 */
                updateHostComponent(
                    current,
                    workInProgress,
                    type,
                    newProps,
                    rootContainerInstance,
                )
            } else {
                // mount的情况
                /**
                 * 1. 为Fiber生成对应DOM
                 * 2. 将已生成的子孙DOM插入刚生成的DOM节点中
                 * 3. 处理props
                 */

                const instance = createInstance(
                    type,
                    newProps,
                    rootContainerInstance,
                    currentHostContext,
                    workInProgress,
                )

                // 将子孙DOM插入
                appendAllChildren(instance, workInProgress, false, false)
                workInProgress.stateNode = instance;
                
                // 处理props
                if(
                    // 初始化DOM对象的事件监听和内部属性
                    finalizeInitialChildren(
                        instance,
                        type,
                        newProps,
                        rootContainerInstance,
                        currentHostContext
                    )
                ) {
                    markUpdate(workInProgress)
                }

            return null;
        }
    }
}

function reconcileChildFibers(
    returnFiber: Fiber, // 父fiber
    currentFirstChild: Fiber | null, // 当前节点对应的已生成的current fiber
    newChild: any,
): Fiber | null {
    const isObject = typeof newChild === 'object' && newChild !== null;

    if(isObject) {
        // object 类型， 可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
        // TODO: newChild可能是个JSX对象
        switch(newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
                //调用reconcileSingleElement处理
            // ...其他case
        }
    }

    if(typeof newChild === 'string' || typeof newChild === 'number') {
        // 调用 reconcileSingleTextNode处理
    }

    if(isArray(newChild)) {
        // 调用reconChildrenArray处理
    }

    //...一些其他情况的处理

    // 以上都没命中，删除节点
    return deleteRemainingChildren(returnFiber, currentFirstChild)
}

function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement
)

function appendAllChildren(
    parent: Instance,
    workInProgress: Fiber,
    needsVisibilityToggle: boolean,
    isHidden: boolean,
){
    let node = workInProgress.child;
    while (node !== null) {
        if(node.tag === HostComponent || node.tag === HostTesx) {
            appendInitialChild(parent, node.stateNode);
        } else if (node.tag === HostPortal){
            // ...略
        } else if (node.child !== null) {
            // 如果存在子节点则遍历子节点
            node.child.return = node;
            node = node.child;
            continue;
        }
        
        // 直到当前节点等于循环开始的节点时退出
        if (node === workInProgress) {
            return
        }

        // 当没有兄弟节点时，返回父节点
        while (node.sibling === null) {
            if(node.return === null || node.return === workInProgress) {
                return;
            }
            node = node.return;
        }

        // 有兄弟节点循环兄弟节点
        node.sibling.return = node.return;
        node = node.sibling;
    }
}