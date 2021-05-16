function App() {
  const [state, dispatch] = useReducer(reducer, {a: 1});
  const [num, updateNum] = useState(0);

  return (
    <div>
      <button onClick={() => dispatch({type: 'a'})}>{state.a}</button>
      <button onClick={() => updateNum(num => num + 1)}>{num}</button>
    </div>
  )
}

// 两个阶段：声明阶段，调用阶段

// 声明阶段
/**
 * FC进入到render阶段的beginWork时，会调用renderWithHooks方法
 * 该方法内部会执行FC对应的函数，即fiber.type
 */

// resolveDispatcher函数主要是用来判断mount状态来返回不同的处理函数（dispatcher）的
function useState(initalState){
  var dispatcher = resolveDispatcher();
  /**
   * 参见hook.js中的useState实现
   * 主要工作是生成hook，将hook绑定到fiber.memoizedState链上，返回状态及dispatchAction函数
   */
  return dispatcher.useState(initalState);
}

function useReducer(reducer, initialArg, init){
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init)
}

// mount时
// dispatcher.useState中会调用到mountState

function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 创建并返回当前的hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始state

  // 创建queue
  const queue = (hook.queue = {
    pending: null,
    // 保存dispatchAction.bind()的值
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建dispatch


  return [hook.memorizedState, dispatch];
}

function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 创建并返回当前的hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始state

  // 创建queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    // 上次render时使用的reducer
    lastRenderedReducer: reducer,
    // 上次render时的state
    lastRenderedState: (initialState: any),
  });

  // ...创建dispatch


  return [hook.memoizedState, dispatch]
}

// 对应redux中的reducer —— 一个计算state的纯函数
function basicStateReducer<S>(state: S, action: BasicStateAction<S>) : S {
  return typeof action === 'function' ? action(state) : action
}

// update时，useReducer和useState调用同一个函数
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initalArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 获取当前hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  queue.lastRenderedReducer = reducer;

  // ...同update与updateQueue类似的更新逻辑, 即取出hook.queue.pending中的所有action执行一遍

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}

// 调用阶段
// 即上个阶段生成的dispatch，前两个参数在生成的时候就已经预先传入了
function dispatchAction(fiber, queue, action) {

  // ...创建update
  var update = {
    eventTime: eventTime,
    lane: lane,
    suspenseConfig: suspenseConfig,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null
  }

  // ...将update加入queue.pending

  var alternate = fiber.alternate;

  // currentlyRenderingFiber$1即workInProgress, workInProgress存在代表当前处于render阶段
  if(fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1) {
    // render阶段触发的更新
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    if(fiber.lanes === NoLanes && (alternate === null || alternate.lanes === Nolanes)) {
      // ...fiber的updateQueue为空，优化路径 //TODO
    }

    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}