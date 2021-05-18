// render阶段开始于performSyncWorkOnRoot或performConcurrentWorkOnRoot

// performSyncWorkOnRoot 会调用这里
function workLoopSync(){
    while(workInProgress !== null){
        // "unit of" - 单元，函数名意为：处理一个任务单元
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

    // 通过current是否为null来判断是mount还是update

    // update操作，满足条件即可复用节点

    // IMPORTANT：
    /**
     * 满足两个条件即可尝试复用，具体可不可以复用还需要到reconcileChildren函数中进一步判断 TODO?
     * 1. oldProps === currentProps，oldType === currentType 即节点属性和节点的类型不能变
     * 2. !includesSomeLane(renderLanes, updateLanes) 即不存在优先级更高的更新
     */
    if(current !== null){

        // 注意：不要将这里的fiber的props和ReactElement的porps搞混了，这里的props就是节点的静态属性，里面没有children，children存在child属性里
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

            // 复用节点，返回child，返回的child再进入beginWork
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

    // 不能复用，根据tag，创建不同的子Fiber节点
    switch(workInProgress.tag){
        case FunctionComponent: // 函数组件
        // ..省略，会调用到renderWithHooks方法
        case ClassComponent: // 类组件
        // ..省略，会调用到instance.render()方法
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
    /**
     * 在上一步中根据tag调用不同方法生成,调用workInProgress.type对应的方法，生成ReactElement。
     * CC-instance.render(),FC-renderWithHooks()，
     * 根据这个结果去生成workInProgress.child = {
     *  type: nextChildren.type,
     *  pendingProps: nextChildren.props
     * }
     * 
     * !!!!!!!!!!!总结：每个Fiber.child都是根据调用Fiber.type生成的值产生的
     */
    nextChildren: any, // 可以是ReactElement或者string，number 
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
 * 生成DOM，放入fiber.stateNode中
 * 
 * 感觉这里应该只是生成了HostComponent类型节点的stateNode而已，
 * 打上effectTag（如：Placement）
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
            //  生成DOM，是与平台相关的DOM，里面会调用到react-dom包里的东西
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
    newChild: any, // ReactElememt 也就是JSX编译后返回的结果
): Fiber | null {
    const isObject = typeof newChild === 'object' && newChild !== null;

    if(isObject) {
        // object 类型， 可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE？TODO
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


// 更新之后只有一个element走这里，所以更新之前可能会有多个element的
function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement
): Fiber {
    const key = element.key;
    let child = currentFirstChild;

    // 首先判断是否存在对应的DOM节点
    while(child !== null){
        // 上一次更新存在DOM节点，接下来判断是否可以复用

        // 首先比较key是否相同
        if(child.key === key){

            // key相同，比较type
            switch(child.tag){
                // ...省略case

                default: {
                    if(child.elementType === element.type) {
                        // type相同则表示可以复用
                        // 返回复用的fiber
                        return existing;
                    }

                    // type不同则调出switch
                    break;
                }
            }

            // 代码执行到这里表示：key相同但是type不同
            // 将该 #原#fiber及其兄弟fiber标记为删除，因为更新之后只有一个节点，而且已经根据key匹配上了但是不可复用，那么后面的原兄弟fiber连key都不同，肯定是要删除的
            deleteRemainingChildren(returnFiber, child);
            break;
        } else {
            // key不同，将该fiber标记为删除
            deleteChild(returnFiber, child);
        }
        child = child.sibling;
    }

    // 创建新Fiber，并返回...
    if (element.type === REACT_FRAGMENT_TYPE) {
        // 略
        const created = createFiberFromFragment(
            element.props.children,
            returnFiber.mode,
            lanes,
            element.key,
        );
        created.return = returnFiber;
        return created;
    } else {
        const created = createFiberFromElement(element, returnFiber.mode, lanes);
        created.ref = coerceRef(returnFiber, currentFirstChild, element);
        created.return = returnFiber;
        return created;
    }
}


function createFiberFromElement(
    element: ReactElement,
    mode: TypeOfMode,
    lanes: Lanes,
): Fiber {
    let owner = null;
    if(__DEV__) {
        owner = element._owner;
    }
    const type = element.type;
    const key = element.key;
    const pendingProps = element.props; // 这里面有children
    const fiber = createFiberFromTypeAndProps(
        type,
        key,
        pendingProps,
        owner,
        mode,
        lanes,
    );
    if(__DEV__) {
        fiber._debugSource = element._source;
        fiber._debugOwner = element._owner;
    }

    return fiber;
}

function createFiberFromTypeAndProps(
    type: any,
    key: null | string,
    pendingProps: any,
    owner: null | Fiber,
    mode: TypeOfMode,
    lanes: Lanes,
): Fiber {
    // ...省略

    const fiber = createFiber(fiberTag, pendingProps, key, mode);
    fiber.elementType = type;
    fiber.type = resolvedType;
    fiber.lanes = lanes;

    return fiber;
}