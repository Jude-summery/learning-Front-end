### isFlattenable.js
---
##### 用途
检测一个值是否能够被展开。

##### 引用
本模块引用了`isArguments.js`。

##### 源码
```
import isArguments from '../isArguments.js'

/** Built-in value reference. */
const spreadableSymbol = Symbol.isConcatSpreadable

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return Array.isArray(value) || isArguments(value) ||
    !!(value && value[spreadableSymbol])
}

export default isFlattenable
```

##### 知识点
1. 数组和`arguments`是默认可以展开的，而`类数组`默认是无法展开的。
2. `Symbol.isConcatSpreadable`，对象的`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象使用`Array.prototype.concat()`时，是否可以展开（这个属性为`false`时，该对象仍可以被解构运算符`...`展开）。