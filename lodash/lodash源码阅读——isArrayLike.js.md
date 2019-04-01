### isArrayLike.js
---
##### 用途
检测一个值是否是类数组元素。

##### 引用
本模块引用了`isLength.js`。

##### 源码
```
import isLength from './isLength.js'

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike(document.body.children)
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike(Function)
 * // => false
 */
function isArrayLike(value) {
  return value != null && typeof value != 'function' && isLength(value.length)
}

export default isArrayLike
```

##### 知识点
1. 类数组元素
- 元素有`length`属性，且类型不为`function`
- 元素的`length`属性是个自然数且小于等于JS整数的边界值（2的53次方-1）