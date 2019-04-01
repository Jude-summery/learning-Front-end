### isObjectLike.js
---
##### 用途
检测一个值是否是类对象元素。

##### 引用
本模块没有引用。

##### 源码
```
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * isObjectLike({})
 * // => true
 *
 * isObjectLike([1, 2, 3])
 * // => true
 *
 * isObjectLike(Function)
 * // => false
 *
 * isObjectLike(null)
 * // => false
 */
function isObjectLike(value) {
  return typeof value == 'object' && value !== null
}

export default isObjectLike
```

##### 知识点
1. 类对象元素
- `typeof`返回结果为`object`且不为`null`的元素