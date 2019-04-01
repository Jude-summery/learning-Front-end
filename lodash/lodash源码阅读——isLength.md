### isLength.js
---
##### 用途
检测一个值是否符合数组`length`属性的要求。

##### 引用
本模块没有引用

##### 源码
```
/** Used as references for various `Number` constants. */
const MAX_SAFE_INTEGER = 9007199254740991

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * isLength(3)
 * // => true
 *
 * isLength(Number.MIN_VALUE)
 * // => false
 *
 * isLength(Infinity)
 * // => false
 *
 * isLength('3')
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}

export default isLength
```

##### 知识点
1. 有三种数据类型具有`length`属性。

- `Array`——数组的`length`属性代表了数组的长度。
- `Function`——函数的`length`属性代表了形参的个数。
- `String`——字符串的`length`属性代表了字符串的长度。

2. `length`属性要求是自然数（`0`和正整数）。

3. 定义`MAX_SAFE_INTEGER`的作用是为了保证低位数字的精度，这个数值是JS能够保证精度的上边界值-1。