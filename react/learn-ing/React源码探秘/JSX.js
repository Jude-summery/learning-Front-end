// JSX在babel编译的时候会被转为由React.createElement(type, config, children1, children2...)
// 所有JSX在运行时返回的结果都是ReactElement

function createElement(
  /**
   * 这个type，babel会根据写的JSX的格式来判断，
   * 如果JSX是大写开头如<App />那么他就会把App这个构造函数（不论是class还是function本质都是构造函数）放入，
   * 如果是小写开头，那么不管他到底是不是HTML中规定的tag名，都会被以字符串的形式直接放入，如<app />
   */
  type,
  config,
  children
){
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if(config != null){
    // 将config处理后赋值给props
  }

  const childrenLength = arguments.length - 2;
  // 处理children
  /**
   * 1. 子节点不是JSX，则直接返回原本的值
   * 2. 子节点是JSX，则返回ReactElement
   * 3. 如果有多个子节点，则返回一个内部按上面两个步骤处理过的数组
   */
  // 会被赋值给props.children
  // ... 省略

  // 处理defaultProps
  // ... 省略

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  )
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个React Element, 不管是React的tag还是HTML原生tag，经过JSX包装的类型都是Symbol(react.element)
    $$typeof: Symbol(react.element),

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner
  };

  return element;
}

// 总结：React Element是JSX执行React.createElement后返回的结果
// React Component是构造函数

// JSX和Fiber的区别
/**
 * JSX只包含了一些这个节点静态的信息，没有保存状态和其他的内容
 * 而这些内容都保存在fiber中
 * 
 * 所以，在组件mount时，Reconciler根据JSX描述的组件内容生成组件对应的fiber节点
 * 在update时，reconciler将JSX与Fiber节点保存的数据对比，生成组件对应的Fiber节点，
 * 并根据对比结果为Fiber节点打上标记
 */