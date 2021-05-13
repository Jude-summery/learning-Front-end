// commitRootImpl方法

// before mutation之前

do {
    // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  // root指 fiberRootNode
  // root.finishedWork指当前应用的rootFiber
  const finishedWork = root.finishedWork;

  // 凡是变量名带lane的都是优先级相关
  const lanes = root.finishedLanes;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // 重置Scheduler绑定的回调函数
  root.callbackNode = null;
  root.callbackId = NoLanes;

  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // 重置优先级相关变量
  markRootFinished(root, remainingLanes);

  // 清除已完成的discrete updates，例如：用户鼠标点击触发的更新。
  if (rootsWithPendingDiscreteUpdates !== null) {
    if (
      !hasDiscreteLanes(remainingLanes) &&
      rootsWithPendingDiscreteUpdates.has(root)
    ) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }

  // 重置全局变量
  if (root === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
  }

  // 将effectList赋值给firstEffect
  // 由于每个fiber的effectList只包含他的子孙节点
  // 所以根节点如果有effectTag则不会被包含进来
  // 所以这里将有effectTag的根节点插入到effectList尾部
  // 这样才能保证有effect的fiber都在effectList中
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    // 根节点有effect的情况
    if (finishedWork.lastEffect !== null) {
        //如果已经存在lastEffect，则把根节点放在effect链的最后
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
        // 如果没有lastEffect,则把根节点放在effect链的最前
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有effectTag
    firstEffect = finishedWork.firstEffect;
  }


  // layout阶段之后
  /**
   * 主要
   */

  const rootDidHavePassiveEffects = rootDoseHavePassiveEffects;

  // useEffect相关
  if(rootDoseHavePassiveEffects){
    rootDoseHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {}

  // 性能优化相关
  if(remainingLanes !== NoLanes) {
    if(enableSchedulerTracing){

    }
  } else {

  }

  if(enableSchedulerTracing){
    if(!rootDidHavePassiveEffects){

    }
  }

  // 检查无限循环的同步任务
  if(ramainingLanes === SyncLane){

  }

  // 在离开commitRoot函数前调用， 触发一次新的调度，确保任何附加的任务被调度
  ensureRootIsScheduled(root, now());

  // ...处理未捕获错误及老版本遗留的边界问题

  // 执行同步任务，这样同步任务不需要等到下次事件循环在执行
  // 比如componentDidxxx中执行setState，useLayoutEffect中创建的更新会在这里被同步执行
  flushSyncCallbackQueue();

  return null;

  // before mutation 阶段
  // 重点在下面这个函数
  function commitBeforeMutationEffects(finishedWork){
    while (nextEffect !== null) {
      const current = nextEffect.alternate;

      if(!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null){
        // focus blur相关
      }

      const effectTag = nextEffect.effectTag

      // 调用getSnapshotBeforeUpdate
      if((effectTag & Snapshot) !== NoEffect) {
        commitBeforeMutationEffectsOnFiber(current, nextEffect);
      }

      // 调用useEffect
      if((effectTag & Passive) !== NoEffect) {
        if(!rootDoseHavePassiveEffects) {
          rootDoseHavePassiveEffects = true;
          // 由Schedule模块提供，用于以某个优先级异步调度一个回调函数
          scheduleCallback(NormalSchedulerPriority, () => {
            // 触发useEffect
            flushPassiveEffects();
            return null;
          });
        }
      }
      nextEffect = nextEffect.nextEffect
    }
  }

  // mutation 阶段

  nextEffect = firstEffect;
  do{
    try{
      commitMutationEffects(root, renderPriorityLevel);
    } catch(error) {
      invariant(nextEffect !== null, 'Should be working on an effect.');
      captureCommitPhaseError(nextEffect, error);
      nextEffect = nextEffect.nextEffect;
    }
  } while (nextEffect !== null)

  // mutation阶段核心
  function commitMutationEffects(){
    root: FiberRoot, 
    renderPriorityLevel
  } {
    // 遍历effectList
    while(nextEffect !== null) {
      const effectTag = nextEffect.effectTag;

      // 根据ContentReset effectTag重置文字节点
      if(effectTag & ContentReset){
        commitResetTextContent(nextEffect);
      }

      // 更新ref
      if(effectTag & Ref){
        const current = nextEffect.alternate;
        if(current !== null){
          commitDetachRef(current);
        }
      }

      // 根据effectTag分别处理
      const primaryEffectTag = effectTag & (Placement | Update | Deletion | Hydrating)

      switch (primaryEffectTag) {
        // 插入DOM
        case Placement: {
          commitPlacement(nextEffect);
          nextEffect.effectTag &= ~Placement; // 记录执行后的状态
          break;
        }
        // 插入DOM并更新DOM
        case PlacementAndUpdate: {
          commitPlacement(nextEffect);

          nextEffect.effectTag &= ~Placement;

          // 更新DOM
          const current = nextEffect.alternate;
          commitWork(current, nextEffect);
          break;
        }

        // SSR相关操作 ...略

        case Update: {
          // 更新DOM
          const current = nextEffect.alternate;
          commitWork(current, nextEffect);
          break;
        }

        case Deletion: {
          // 删除DOM
          commitDeletion(root, nextEffect, renderPriortyLevel);
          break;
        }
      }

      nextEffect = nextEffect.nextEffect;
    }
  }

  function commitPlacement(nextEffect){
    // 获取父级DOM节点。其中finishedWork为传入的Fiber节点
    const parentFiber = getHostParentFiber(finishedWork);
    // 父级DOM节点
    const parentStateNode = parentFiber.stateNode;

    // 获取Fiber节点的DOM兄弟节点
    const before = getHostSibling(finishedWork);

    // 根据兄弟节点是否存在决定调用 parentNode.insertBefore 或 parentNode.appendChild执行DOM插入操作
    if(isContainer){
      insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
    } else {
      insertOrAppendPlacementNode(finishedWork, before, parent)
    }
  }

  function commitUpdate() {
    // 根据Fiber.Tag分别处理

    // tag为FunctionComponent的情况
    // 该方法会遍历effectList 执行所有useLayoutEffect hook的销毁函数
    commitHookEffectListUnmonut()

    // tag为HostComponent的情况
    for(let i = 0; i < updatePayload.length; i += 2){
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      // 处理 style
      if(propKey === STYLE){
        setValueForStyles(domElement, propValue);
      } else if (propKey === DANGEROUSLY_SET_INNER_HTML){
        setInnerHtml(domElement, propValue);
      } else if (propKey === CHILDREN) {
        setTextContent(domElement, propValue)
      } else {
        // 处理剩余props
        setValueForProperty(domElement, propKey, propValuem, isCustomComponentTag);
      }
    }
  }

  function commitDeletion() {
    /**
     * 递归调用ClassComponent的componentWillUnmount，从页面移除DOM
     * 解绑ref
     * 调度useEffect的销毁函数
     */
  }


  // layout 阶段
  /**
   * 这个阶段是在DOM已经渲染完成后执行的，在这个阶段触发的生命周期和hook可以直接访问已改变的DOM
   */

   root.current = finishedWork;
   nextEffect = firstEffect;
   do{
     try{
       commitLayoutEffects(root, lanes);
     } catch(error) {
       invariant(nextEffect !== null, "Should be working on an effect.");
       captureCommitPhaseError(nextEffect, error);
       nextEffect = nextEffect.nextEffect;
     }
   } while (nextEffect !== null);

   nextEffect = null;

  function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes){
    while(nextEffect !== null){
      const effectTag = nextEffect.effectTag;

      // 调用生命周期钩子和hook
      if(effectTag & (Update | Callback)){
        const current = nextEffect.alternate;
        commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
      }

      // 赋值ref
      if(effectTag & Ref) {
        commitAttachRef(nextEffect);
      }

      nextEffect = nextEffect.nextEffect
    }
  }

  function commitLayoutEffectOnFiber {
    // 根据fiber.tag对不同类型节点分别处理
    // 对于ClassComponent， 会通过current === null 区分是mount还是update，调用componentDidMount 或componentDidUpdate
    // 触发状态更新的this.setState如果赋值了第二个参数回调函数，也会在此时调用。

    // 对于FunctionCompnent及相关类型
    switch (finishedWork.tag) {
      // 以下都是FunctionComponent及相关类型
      case FunctionComponent:
        case ForwardRef:
          case SimpleMemoComponent:
            case Block: {
              // 执行useLayoutEffect的回调函数
              commmitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
              // 调度useEffect的销毁函数与回调函数
              schedulePassiveEffects(finishedWork);
              return;
            }
    }
  }