## 应用的开始

通过 `new Vue()` 创建出**应用实例**：
```html
<div id="app">
    {{ message }}
</div>
```
```javascript
const app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
```

## Vue 实例

实例上可以访问到 `data` 等属性
```
var data = { a: 1 }
var vm = new Vue({
    el：'#example',
    data: data
})

vm.$data === data // true
vm.$data.a == vm.a == data.a // 1
vm.$el === document.getElementById('example') // true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
    // 这个回调将在 `vm.a` 改变后调用
})
```

## 生命周期钩子

**生命周期钩子的 `this` 上下文指向调用它的当前活动实例**

### 创建阶段
- beforeCreate：实例刚被创建，还没初始化 `data` 和 `methods`
- created：实例已创建完成， `data` 和 `methods` 已创建
- beforeMount：已完成模板的编译，但未渲染到界面中
- mount： 模板已完成渲染
### 运行阶段
- beforeUpdate：`data` 中的数据已完成更新，但界面数据还是旧的
- diff 阶段
- updated：页面重新渲染完毕，页面数据与 `data` 中一致
### 销毁阶段
- 执行 `app.unmount()` 之后
- beforeDestroy：已进入销毁阶段，但实例还未被销毁
- destroyed：实例已完全被销毁

## 模板语法

### 插值
---
#### 文本
```html
<span>Message: {{ msg }}</span>
<!-- 使用 v-once 指令，可以执行一次性地插值 -->
<span v-once>Message: {{ msg }}</span>
```
#### 原始 HTML
使用 `v-html` 输出原始 HTML：
```javascript
const renderHtmlApp = {
    el: '#example1',
    data: {
        rawHtml: '<span style="color: red">This should be red.</span>'
    }
}
const vm = new Vue(renderHtmlApp)
```
```html
<div id="example1" class="demo">
    <p>Using mustaches: {{ rawHtml }}</p >
    <p>Using v-html directive: <span v-html="rawHtml"></span></p >
</div>
```

#### Attribute
双括号语法不能用于 HTML attribute，使用 `v-bind` 指令：
```html
<div v-bind:id="dynamicId"></div>
```
如果绑定的值是 `null` 或 `undefined`，则该 attribute 将不会被包含在渲染的元素上。

#### 使用 JavaScript 表达式
只能使用表达式，语句和 `if` 都不会生效
```html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
```

### 指令
---
指令是带有 `v-` 前缀的特殊 attribute。它的预期值是**单个JavaScript表达式**。

#### 参数
这些指令能够接受一个参数，在指令名称之后以冒号表示：
```html
<a v-bind:href="url">...</ a>
<a v-on:click="doSomething">...</ a>

<!-- 缩写为 -->
<a :href="url">...</ a>
<a @click="doSomething">...</ a>
<!-- 不带参数的指令 -->
<a v-if="seen">...</ a>
```

#### 动态参数
```html
<a v-bind:[attributeName]="url">...</ a>
<a v-on:[eventName]="doSomething">...</ a>
```
#### 修饰符
以半角句号 `.` 指明的特殊后缀，用于指出一个指令以特殊方式绑定：
```html
<!-- 这边表示对于触发的事件调用 event.preventDefault() -->
<form v-on:submit.prevent="onSubmit">...</form>
```

### 注意事项
#### 对动态参数值的约定
动态参数预期会求出一个字符串，但可以为 `null`，它可以用于显式的接触绑定。

#### 对动态参数表达式的约定
空格和引号在 HTML attribute 名里是无效的：
```html
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </ a>
```
直接在 HTML 文件中撰写模板时，还需要避免使用大写字符来命名键名：
```html
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
--><a v-bind:[someAttr]="value"> ... </ a>
```
#### JavaScript 表达式
模板表达式都在沙盒中，只能访问一个受限的全局变量，如 `Math` 和 `Date`。更不应该试图访问自定义的全局变量。

## Data Property 和方法
[直接看文档吧](https://v3.cn.vuejs.org/guide/data-methods.html#data-property)

## 计算属性和侦听器
### 计算属性（`computed`）
表达式会使模板变得臃肿，所以对于任何包含响应式数据的复杂逻辑，都应该使用**计算属性**。
```html
<div id="computed-basics">
    <p>Has published books:</p >
    <span>{{ publishdBooksMessage }}</span>
</div>
```
```javascript
var vm = new Vue({
    el: '#computed-basics'
    data: {
           author: {
               name: 'John Doe',
               books: [
                    'Vue 2 - Advanced Guide',
                    'Vue 3 - Basic Guide',
                    'Vue 4 - The Mystery'
               ]
           }
    },
    computed: {
        // 计算属性的 getter
        publishedBooksMessage: function () {
            // `this` 指向 vm 实例
            return this.author.books.length > 0 ? 'Yes' : 'No'
        }
    }
})
```
### 计算属性缓存 vs 方法
使用方法可以将上面的例子改写成这样：
```html
<p>{{ calculateBooksMessage() }}</p >
```
```javascript
// 在组件中
methods: {
  calculateBooksMessage: function () {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```
`computed` 属性会进行优化，当绑定的属性没有变化时，将使用缓存直接返回，而 `method` 会始终执行。
### 计算属性的 Setter
计算属性默认只有 getter，不过在需要时也可以提供一个 setter：
```js
// ...
computed: {
    fullName: {
        // getter
        get: function () {
            return this.firstName + '  ' + this.lastName
        },
        // setter
        set: function (newValue) {
            const names = newValue.split(' ')
            this.firstName = names[0]
            this.lastName = names[names.length - 1]
        }
    }
}
// ...
```

### 侦听器
---
通常使用侦听器来执行异步操作。
```html
<div id="watch-example">
    <p>
        Ask a yes/no question:
        <input v-model="question" />
    </p >
    <p>{{ answer }}</p >
</div>
```
```html
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script>
    const watchExampleVM = new Vue({
        el: '#watch-example',
        data: {
            question: '',
            answer: 'Questions usually contain a question mark. ;-)'
        },
        watch: {
            // 每当 question 发生变化时，该函数将会执行
            question: function (newQuestion, oldQuestion) {
                if (newQuestion.indexOf('?') > -1) {
                    this.getAnswer()
                }
            }
        },
        methods: {
            getAnswer: function () {
                this.answer = 'Thinking...'
                axios
                    .get('https://yesno.wtf/api')
                    .then(response => {
                        this.answer = response.data.answer
                    })
                    .catch(error => {
                        this.answer = 'Error! Could not reach the API. ' + error
                    })
            }
        }
    })
</script>
```

## Class 与 Style 绑定
`v-bind` 对 `class` 和 `style` 属性进行了专门的增强，使其可以接受对象或数组。

### 绑定 HTML Class
---
#### 对象语法
```html
<div v-bind:class="{ active: isActive }"></div>
```
或关联 `data` 属性和 `computed` 属性。
#### 数组语法
```html
<div v-bind:class="[activeClass, errorClass]"></div>
<div v-bind:class="[{active: isActive}, errorClass]"></div>
```
```js
data: {
    activeClass: 'active',
    errorClass: 'text-danger',
    isActive: true
}
```
### 绑定内联样式
---
#### 对象语法
```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
```js
data: {
    activeColor: 'red',
    fontSize: 30
}
```
或者直接绑定一个样式对象或返回对象的计算属性。
#### 数组语法
可同时应用多个样式对象：
```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

## 条件渲染
### `v-if`
---
```html
<div v-if="type === 'A'"> A </div>
<div v-else-if="type === 'B'"> B </div>
<div v-else> C </div>
<!-- 使用 template 元素进行分组渲染，结果中将不包含 template 元素 -->
<template v-if="ok">
    <h1> Title </h1>
    <p> Paragraph 1 </p >
    <p> Paragraph 2 </p >
</template>
```
可以通过设置 `key` 值来管理重复渲染。

### `v-show`
---
与 `v-if` 用法大体一致，但是不会移除 DOM，也不支持 `v-else` 和 `<template>`。适合用于频繁的切换。

## 列表渲染
### `v-for`
---
```html
<ul id="example-1">
    <li v-for="item in items" :key="item.message">
        {{ item.message }}
    </li>
</ul>
```
或
``` html
<ul id="example-1">
    <li v-for="(item, index) in items" :key="item.message">
        {{ item.message }}
    </li>
</ul>
```
或
``` html
<ul id="example-1">
    <li v-for="item of items" :key="item.message">
        {{ item.message }}
    </li>
</ul>
```
```js
const example1 = new Vue({
    el: '#example-1',
    data: {
        items: [
            { message: 'Foo' },
            { message: 'Bar' }
        ]
    }
})
```
也可以用它来遍历对象
```html
<div v-for="(value, name, index) in object"></div>
```
建议在使用 `v-for` 时为列表每一项设定一个 `key`。

### 在组件上使用 `v-for`
---
组件有自己的作用域，因此任何数据不会被自动传递到组件里：
```html
<my-component
    v-for="(item, index) in items"
    v-bind:item="item"
    v-bind:index="index"
    v-bind:key="item.id"
></my-component>
```

## 事件处理
### 监听事件
---
```html
<div id="example-2">
    <button v-on:click="greet">Greet</button>
</div>
```
```js
var example2 = new Vue({
    el: '#example-2',
    data:{
        name: 'Vue.js'
    },
    methods: {
        greet: function(event){
            // ...
        }
    }
})
example2.greet()
```
或
```html
<button v-on:click="warn('param', $event)"> submit </div>
```
```js
methods: {
    warn: function (message, event) {
        // ...
    }
}
```

### 事件修饰符
---
- `.stop`: stopPropagation，阻止事件冒泡
- `.prevent`: preventDefault，取消默认事件
- `.capture`: 在该元素上执行事件捕获
- `.self`: 当 event.target 是当前元素自身时触发回调
- `.once`: 该事件只执行一次，只适用于原生 DOM
- `.passive`: 不要阻止默认行为，通常用在移动端滚动上

### 按键修饰符
---
监听按下了键盘上哪个按键

### 系统修饰符
---
实现仅在按下相应按键时才触发鼠标或键盘事件的监听器，如：ctrl 键

### 鼠标按钮修饰符
---
监听按下鼠标哪个按钮

## 表单输入绑定
### 基础用法
---
- 使用 `v-model` 进行表单数据的双向绑定。
- `v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` 属性，而始终使用 Vue 实例的数组作为来源。

### 修饰符
---
#### `.lazy`
```html
<!-- 在 change 时而非在 input 时更新 -->
<input v-model.lazy="msg" />
```

#### `.number`
将用户输入通过 `parseFloat()` 解析为数值类型
```html
<input v-model.number="age" />
```

#### `.trim`
过滤首位空白字符

## 组件基础
### 基本示例
---
```js
Vue.component('button-counter', {
    data: function() {
        return {
            count: 0
        }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```
根组件是特殊的组件，他们接受的选项相同，除了 `el` 这样的根实例特有选项。

### 组件的复用
---
组件每次复用都会创建一个新的实例。
#### `data` 必须是一个函数
与根组件不用，考虑到组件会被复用，所以必须通过函数返回对象的独立的拷贝。否则组件之间会共用同一个 `data` ，导致数据异常。

### 通过 Prop 向子组件传递数据
---
#### 方法一：设置 prop 列表
这样的设置意思就是告诉组件，title 属性是我自定义的属性
```js
Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
})
```
```html
<blog-post title="My journey with Vue"></blog-post>
```

#### 方法二：使用 `v-bind` 来动态传递 prop
```js
new Vue({
    el: '#blog-post-demo',
    data: {
        posts: [
            { id: 1, title: 'My journey with Vue' },
            { id: 2, title: 'Blogging with Vue' }
        ]
    }
})
```
```html
<blog-post
    v-for="post in posts"
    v-bind:key="post.id"
    v-bind:title="post.title"
    v-bind:post="post"
></blog-post>
```

### 监听子组件事件
---
父组件中：
```html
<blog-post
    v-on:enlarge-text="onEnlargeText"
</blog-post>
<!-- 或 -->
<blog-post
    v-on:enlarge-text="postFontSize += $event"
</blog-post>
```
```js
data: function() {
    return {
        postFontSize: 10
    }
},
methods: {
    onEnlargeText: function (param) {
        this.postFontSize += param
    }
}
```
子组件中：
```html
<button v-on:click="$emit('enlarge-text', 0.1)"> Enlarge text </button>
```

### 在组件上使用 `v-model`
---
```html
<input v-model="searchText">
```
等价于：
```html
<input
    v-bind:value="searchText"
    v-on:input="searchText = $event.target.value"

```
用在组件上时，相当于：
```html
<custom-input v-model="searchText"></custom-input>
<!-- 等价于： -->
<custom-input
    v-bind:value="searchText"
    v-on:input="searchText = $event"
</custom-input>
```

### 通过插槽分发内容
---
```html
<alert-box>
    Something bad happened.
</alert-box>
```
此时使用 Vue 自定义的 `<slot>` 元素可以将字符串 "Something bad happened" 插入到指定位置。
```js
Vue.component('alert-box', {
    template: `
        <div class="demo-alert-box">
            <slot></slot>
        </div>
    `
})
```
### 动态组件
---
```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```
`currentTabComponent` 可以是：
- 已注册组件的名字
- 一个组件的选项对象，形为 `{ template: '<div>Home component</div>' }`

### 解析 DOM 模板时的注意事项
---
有些 HTML 元素， 如：
```html
<table>
  <blog-post-row></blog-post-row>
</table>
```
由于 `<table>` 元素限制内部出现的元素，上面的写法是无效的，所以需要改为：
```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```
