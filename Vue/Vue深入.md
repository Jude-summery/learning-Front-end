## 组件注册
### 组件名
---
建议组件名使用小写字母并必须包含一个连字符。

### 全局注册
---
```js
Vue.component('component-a', { /* ... */ })
new Vue({ el: '#app' })
```
这意味着在这个根实例中的任何地方，该组件都是可用的。

### 局部注册
---
```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }

new Vue({
    el: '#app',
    components: {
        'component-a': ComponentA,
        'component-b': ComponentB
    }
})
```
这种方式下，在 ComponentB 中是无法使用  ComponentA 的，需要像下面这样：
```js
var ComponentA = { /* ... */ }
var ComponentB = {
    components: {
        'component-a': ComponentA
    },
    // ...
}
```
在模块系统中：
注意组件的名称，虽然在这里是以驼峰的形式，但是使用时还是使用连字符。
```js
// ComponentB.vue
import ComponentA from './ComponentA'

export defalut {
    components: {
        ComponentA
    }
}
```

## Prop
### 单向数据流
---
通 React 一样，Prop 是单向的数据流，不建议在子组件里修改 Prop。参考以下两种情况：
1. 这个 prop 用来传递一个初始值；接下来这个子组件希望将其用作一个本地的数据来使用：
```js
props: ['initialCounter'],
data: function () {
    return {
        counter: this.initialCounter
    }
}
```
2. 这个 prop 以一种原始的值传入且需要进行转换:
```js
props: ['size'],
computed: {
    normalizedSize: function () {
        return this.size.trim().toLowerCase()
    }
}
```
> 注意：对象和数组类型是按地址引用的

### 类型校验
---
类似 TypeScript，详情略。
```
Vue.component('my-component', {  
    props: {    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
        propA: Number,    // 多个可能的类型
        propB: [String, Number],    // 必填的字符串
      }
})
```

### 非 Prop 的 Attribute
---
如果在子组件内部没有通过 prop 属性接收 attribute，那么它就只会被添加到子组件的根元素上，并且在子组件内无法当作变量使用：
```html
<div id="app">
    <component-a my-prop='1'></component-a>
</div>
```
```js
    Vue.component('component-a', {
        data: function () {
            return ({
                name: 'componentA'
            })
        },
        template: `
            <div>{{ myProp }}</div>
        `
    })
```
上面这种写法的话，`my-prop` 这个 attribute 就只会变成 `<div my-prop='1'></div>`。应该加上 `props: ['myProp']`。同时，如果子组件的根元素上有同名的 attribute 那么传入的会覆盖原有的，
但是如果是 `style` 和 `class` 则会合并。注意 JS 中使用的时驼峰，HTML 中使用的是连字符。
如果想要禁用这种继承模式，可以使用：
```js
Vue.component('my-component', {  inheritAttrs: false,  // ...})
```
同时可以配和 `$attrs` property 使用，这个 property 包含了传递给组件的 attribute 键值对。
```js
Vue.component('base-input', {  inheritAttrs: false,  props: ['label', 'value'],  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"

    </label>
  `})
```
注意：`inheritAttrs` 不影响 `style` 和 `class`。

## 自定义事件
### 事件名
---
因为 HTML 对大小写是不敏感的，所有的大写都会变成小写。而监听的事件名要完全匹配，所以事件名不能使用驼峰式而应该始终**使用短横线**。

### 自定义组件的 `v-model`
---
默认的 `v-model` 会利用 `value` 属性和 `input` 事件，可以像这样自定义：
```js
Vue.component('base-checkbox', {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: Boolean
    },
    template: `
        <input
            type="checkbox"
            v-bind:checked="checked"
            v-on:change="$emit('change', $event.target.checked)"

    `
})
```
```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```
注意：仍然需要在组件的 `props` 选项里声明 `checked` 这个 prop。

### 绑定原生事件
---
```html
<base-input v-on:focus.native="onFocus"></base-input>
```
但是当这个组件的根元素不支持该事件时，会静默失败，可以通过 `$listeners` 来实现，它包含了作用在这个组件上的所有监听器，配合 `v-on="$listeners"` 可以将所有的事件监听指向组件的特定子元素：
```js
Vue.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    computed: {
        inputListeners: function () {
            var vm = this;
            return Object.assian({},
                this.$listeners,
                {
                    input: function (event) {
                        vm.$emit('input', event.target.value)
                    }
                }
            )
        }
    },
    template: `
        <label>
            {{ label }}
            <input
                v-bind="$attrs"
                v-bind:value = "value"
                v-on="inputListeners"

        </label>
    `
})
```

`.sync` 修饰符
```js
// 子组件中
this.$emit('update:title', newTitle);
```
```html
<!-- 父组件中 -->
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document
```
这种模式并不是强制要求的，就算事件不像 `update:title` 这样命名依然是有效的，但是使用这种方式可以采用下面这种缩写：
```html
<text-document v-bind:title.sync="doc.title"></text-document>
```
注意：这里用的是 `v-bind`，相当于在父组件里就不用再写一个 `v-on` 来监听这个事件了。

注意：大小写，JS 中要使用驼峰才能对应上 HTML 里的短横线。

## 插槽
使用插槽 `<slot>` 可以将组件的子元素传递到组件内部：
```html
<!-- 父组件中 -->
<navigation-link url="/profile">
    Your Profile
</navigation-link>
<!-- navigation-link 组件中 -->
<a
    v-bind:href="url"
    class="nav-link"

    <slot>默认值</slot>
</ a>
```
插入的内容可以是字符串，HTML，其他组件。

### 编译作用域
---
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

### 具名插槽
---
```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
父组件中：
```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p >
  <p>And another one.</p >

  <template v-slot:footer>
    <p>Here's some contact info</p >
  </template>
</base-layout>
```
上面没有被包在 `<template>` 里的将会被视为默认插槽，也可以写作：
```html
  <template v-slot:default>
    <p>A paragraph for the main content.</p >
    <p>And another one.</p >
  </template>
```
`v-slot` 只能添加在 `<template >` 上，除了下面的情况：
### 作用域插槽
---
子组件中：
```html
<span>
    <slot v-bind:user="user">
        {{ user.lastName }}
    </slot>
</span>
```
父组件中：
```html
<current-user>
    <template v-slot:default="slotProps">
        {{ slotProps.user.firstName }}    
    </template>
</current-user>
```
通过这种方式，可以在父组件内访问到子组件的变量，而当父组件中只有默认插槽时，可以简写：
```html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```
`v-slot` 还支持解构赋值：
```html
<current-user v-slot="{ user }">
```
和动态插槽名：
```html
<current-user v-slot:[dynamicSlotName]>
```
### 具名插槽缩写
---
`v-slot` 可缩写为 `#default`，`v-slot:header` 可缩写为 `#header`。

TODO：其他示例章节和废弃了的语法章节未读。

## 动态组件 & 异步组件

### 动态组件上使用 `keep-alive`
---
```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
    <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```
### 异步组件
---
[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#:~:text=alive%3E%20%E7%9A%84%E7%BB%86%E8%8A%82%E3%80%82-,%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6,-Watch%20a%20free)

#### 处理加载状态
```js
const AsyncComponent = () => ({
    // 需要加载的组件 （应该是一个 `Promise` 对象）
    component: import('./MyComponent.vue'),
    // 异步组件加载时使用的组件
    loading: LoadingComponent,  
    // 加载失败时使用的组件
    error: ErrorComponent,  
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,  
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000
})
```

## 处理边界情况（这里面的情况多数都不是最优选择）

### 访问根实例
---
在每个 `new Vue` 实例的子组件中，都可以通过 `this.$root` 进行访问，因此可以将这个实例当作全局 store 来访问或使用。

### 访问父级组件实例
---
子组件可以通过 `$parent` 属性来访问父组件实例。

### 访问子组件实例或子元素
---
```html
<base-input ref="usernameInput"></base-input>
```
可以通过 `this.$refs.usernameInput` 访问。

### 依赖注入
---
将父组件的数据或方法提供给**后代**组件使用：
```js
// 父组件中
provide: function () {
    return {
        getMap: this.getMap
    }
}

// 任何后代组件中
inject: ['getMap']
```
这种方法可以看作是“大范围有效的 prop”，但是他是非响应式的。

### 程序化的事件侦听器
---
[程序化的事件侦听器](https://cn.vuejs.org/v2/guide/components-edge-cases.html#:~:text=%E6%B3%A8%E5%85%A5%E7%9A%84%E7%9F%A5%E8%AF%86%E3%80%82-,%E7%A8%8B%E5%BA%8F%E5%8C%96%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%BE%A6%E5%90%AC%E5%99%A8,-%E7%8E%B0%E5%9C%A8%EF%BC%8C%E4%BD%A0%E5%B7%B2%E7%BB%8F)

### 控制更新
---
强制更新：`$forceUpdate`
强制不更新：`v-once`

## 进入/离开 & 列表过渡
### 单元素/组件的过渡
---
Vue 提供了 `transition` 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡
- 条件渲染（使用 `v-if`）
- 条件展示（使用 `v-show`）
- 动态组件
- 组件根节点

```html
<div id="demo">
    <button v-on:click="show = !show">
        Toggle
    </button>
    <transition name="fade">
        <p v-if="show">hello</p >
    </transition>
</div>
```
```js
new Vue({
    el: '#demo',
    data: {
        show: true
    }
})
```
```css
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
```

#### 过渡的类名
`v-enter` -> `v-enter-active` -> `v-enter-to`
`v-leave` -> `v-leave-active` -> `v-leave-to`

如果没有给 `<transition>` 指定 `name`，那么 `v-` 是这些类的默认前缀。

#### CSS 过渡
TODO

## 混入
### 基础
---
```js
// 定义一个混入对象
var myMixin = {
    created: function () {
        this.hello()
    },
    methods: {
        hello: function () {
            console.log('hello from mixin!')
        }
    }
}
// 定义一个使用混入对象的组件
var Component = Vue.extend({
    mixins: [myMixin]
})
// TODO：Vue.extend ？
// 或
new Vue({
    mixins: [myMixin]
})

var component = new Comonent() // => "hello from mixin!"
```

### 选项合并
---
- 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
- 钩子函数会合并，并且先调用混入对象的回调再调用自身的。
- 值为对象的选项，例如 `methods`、`components`、`directives` 将被合为一个对象，键名冲突时取组件对象的键值对。

### 全局混入
---
谨慎使用，只应当应用于自定义选项。
```js
// 为自定义的选项  'myOption' 注入一个处理器。
Vue.mixin({
    created: function () {
        var myOption = this.$options.myOption
        if (myOption) {
            console.log(myOption)
        }
    }
})

new Vue({
    myOption: 'hello!'
})
// => "hello!"
```
自定义选项合并时，默认简单覆盖已有值，也可以通过下面这种方式自定义：
```js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {  // 返回合并后的值}
```

## 自定义指令
```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    }
})
// 注册局部指令，组件中
directives: {
    focus: {
        // 指令的定义
        inserted: function (el) {
            el.focus()
        }
    }
}
```
使用：
```html
<input v-focus>
```

### 自定义指令的钩子函数
---
- `bind` ：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted` ：被绑定元素插入父节点时调用（不保证父节点已经被插入到文档中）。
- `update` ：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
- `componentUpdated` ：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- `unbind` ：只调用一次，指令与元素解绑时调用。

### 钩子函数的参数
---
- `el` ：指令所绑定的元素，可以用来直接操作 DOM。
- `binding` ：一个对象，包含以下 property：
    - `name` ：指令名，不包括 `v-` 前缀。
    - `value` ：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
    - `oldValue` ：指令绑定的前一个值，仅在 `update` 和 `componentUpdate` 钩子中可用。
    - `expression` ：字符串形式的指令表达式。例如：`v-my-directive="1 + 1"` 中，表达式为 `1 + 1`。
    - `arg` ：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `foo`。
    - `modifiers` ：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`
- `vnode` ：Vue 编译生成的虚拟节点。
- `lodVnode` ：上一个虚拟节点，仅在 `update` 和 `componentUpdate` 钩子中可用。


> 除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset` 来进行。

### 函数简写
---
下面这种写法会在 `bind` 和 `update` 时触发相同行为：
```js
Vue.directive('color-swatch', function (el, binding) {
    el.style.backgroundColor = binding.value
})
```

### 对象字面量
---
```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```
```js
Vue.directive('demo', function (el, binding) {  
    console.log(binding.value.color) // => "white"
    console.log(binding.value.text)  // => "hello!"
})
```

## [渲染函数 & JSX](https://cn.vuejs.org/v2/guide/render-function.html)

## 过滤器
可以自定义过滤器，可用于一些常见的文本格式化。可以用在两个地方：双花括号插值和 `v-bind` 表达式。
```html
{{ message | capitalize }}
<div v-bind:id="rawId | formatId"></div>
```
可以在组件内局部定义过滤器：
```js
filters: {
    capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    }
}
```
或者在创建 Vue 实例前全局定义过滤器：
```js
Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})
new Vue({
    // ...
})
```
过滤器可以串联，后一个接受前一个的结果，也可以接受参数。
```html
{{ message | filterA('arg1', arg2) }}
```
这里，`filterA` 接手三个参数，第一个为 `message` 的值，第二三分别为 `'arg1'` 和 `arg2`。

## 单文件组件
简单实例：
```html
<!-- my-component.vue -->
<template>
    <p>{{ greeting }} World!</p >
</template>

<script>
module.exports = {
    data: function () {
        return {
            greeting: 'Hello'
        }
    }
}
</script>

<style scoped>
 p {
    font-size: 2em;
    text-align: center;
}
</style>
```
或
```html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## 深入响应式原理
Vue 实际上是将 `data` 里的所有 property 遍历转为了 getter/setter，然后在其中进行响应的操作。

> Vue 不能直接检测数组和对象的变化

### 对于对象
---
初始化时不存在于 `data` 对象上的属性无法被追踪：
```js
var vm = new Vue({
    data: {
        a: 1
    }
})

// `vm.a` 是响应式的
vm.b = 2
// `vm.b` 是非响应式的
```
对于已创建的实例，Vue **不允许**动态添加**根级别**的响应式 property。但是可以添加嵌套对象的响应式 property ：
```js
Vue.set(vm.someObject, 'b', 2)
// 或
this.$set(vm.someObject, 'b', 2)
// 一次添加多个
this.someObject = Object.assign({}, this.someObject, { a:1, b:2 })
```

### 对于数组
---
Vue 不能检测以下数组的变动：
1. 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`
```js
var vm = new Vue({  
    data: {    
        items: ['a', 'b', 'c']
    }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```
解决第一类问题：
```js
Vue.set(vm.items, indexOfItem, newValue)
vm.$set(vm.items, indexOfItem, newValue)
vm.items.splice(indexOfItem, 1, newValue)
```
解决第二类问题：
```js
vm.items.splice(newLength)
```

### 异步更新队列
---
DOM 的更新是异步的，如果想基于更新后的 DOM 状态来进行一些操作的话，使用 `Vue.nextTick(callback)`。
```html
<div id="example">{{ message }}</div>
```
```js
var vm = new Vue({
    el: '#example',
    data: {
        message: '123'
    }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
    vm.$el.textContent === 'new message' // true
})
```
在组件内部使用：
```js
Vue.component('example', {
    template: '<span>{{ message }}</span>',
    data: function () {
        return {
            message: '未更新'
        }
    }，
    methods： {
        updateMessage: function () {
            this.message = '已更新'
            console.log(this.$el.textContent) // => '未更新'
            this.$nextTick(function () {
                console.log(this.$el.textContent) // => '已更新'
            })
        }
    }
})
```
