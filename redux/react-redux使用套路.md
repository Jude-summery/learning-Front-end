1. 三个文件夹
```
-src
  -components     //Dump组件
  -containers     //Smart组件
  -reducers       //允许进行的操作
```
2. 先写 `reducer.js`

    **2.1 定义 `action types`**
    
    使用常量为想进行的操作命名，如：
    
    `const ADD_COMMENT:'ADD_COMMENT'`
    
    **2.2 编写 `reducer`**
    
    根据需要进行的操作来写 `reducer`并定义其行为，如：
    ```
    export default function(state, action) {
        if(!state) {
            state = { comments:[] }
        } //初始化state
        
        switch(action.type) {
            case ADD_COMMENT:
                return {
                    comments:[...state.comments, action.comment]
                }
            default: return state
        }
    }
    ```
    **2.3 写`action creators`或`action`**
    
    如：`{ type:ADD_COMMENT, comment}`
    
    将其写作一个函数 `(action creators)`,方便记忆：
    ```
    export const addComment = (comment) => {
        return { type:ADD_COMMENT, comment }
    }
    ```
    
3. 分析需要复用的组件，将其写成`Dump`组件（与外界只通过props取得联系）

    >所以实际上，使用`redux`的`react`运用了`MVC`模式
```
    graph TB
    State-->Model
    Dump-->View
    Smart-->Controller
```

**4. 在顶级组件内部`(Index.js)`引入`Provider`，生成`store`**
```
//使用 createStore(reducer) 获取 store 传入 Provider
import { createStore } from 'redux';
...
const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <Index />
    </Provider>,
    document.getElementById('root')
)
```

**5. 在负责呈现的子组件内`(MyComponent.js)`使用`connect`将其和`state`连接起来**
>注意：在这里没有将组件分为`Dump`组件和`Smart`组件`
```
import { connect } from 'react-redux';
...
class MyComponent extends Component {
    //定义组件的结构
}

//定义你想要从 store 中获取并传入本组件 props 的属性
const mapStateToProps = (state) => {
    return {
        propThatUWant: state.propThatUWhat
    }
}

//使用 connect 进行连接
MyComponent = connect(mapStateToProps)(MyComponent)

export default MyComponent;
```
**6. 在负责改变状态的子组件内`(ChangerComponent.js)`**
```
import { connect } from 'react-redux';
...
//定义事件监听函数，如果 action 存在则直接调用它
handleChange() {
    if(this.props.onSomeEvent) {
        this.props.onSomeEvent()
    }
}

class ChangerComponent extends Component {
    //定义组件的结构
    ...
    //绑定事件
    <button onClick={this.handleChange.bind(this)}>Click Me</button>
}

//定义你想要从 store 中获取并修改的属性
const mapStateToProps = (state) => {
    return {
        propThatUWannaChange: state.propThatUWhannaChange
    }
}

//为想要更改的状态设置监听事件并将监听事件传入子组件的props
const mapDistpatchToProps = (dispatch) => {
    return{
        onSomeEvent: (param) => {
            dispatch(//action or action creator)
        }
    }
}

//使用 connect 进行连接
ChangerComponent = connect(mapStateToProps, mapDispatchToProps)(ChangerComponent)

export default ChangerComponent;
```

>注意：在`mapStateToProps`和`mapDispatchToProps`函数中的参数`state`和`dispatch`是由库提供的，不用手动传入。