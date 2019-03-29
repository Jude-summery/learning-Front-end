### slice.js
---
##### 用途
将参数转换为Number类型，主要是为了解决Symbol类型在原生JS中转换为数值类型时报TypeError错误。

##### 引用
本模块没有引用

##### 源码
```
/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position. A negative index will be treated as an offset from the end.
 * @param {number} [end=array.length] The end position. A negative index will be treated as an offset from the end.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var array = [1, 2, 3, 4]
 *
 * _.slice(array, 2)
 * // => [3, 4]
 */
function slice(array, start, end) {
  let length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  start = start == null ? 0 : start
  end = end === undefined ? length : end

  if (start < 0) {
    start = -start > length ? 0 : (length + start)
  }
  end = end > length ? length : end
  if (end < 0) {
    end += length
  }
  length = start > end ? 0 : ((end - start) >>> 0)
  start >>>= 0

  let index = -1
  const result = new Array(length)
  while (++index < length) {
    result[index] = array[index + start]
  }
  return result
}

export default slice
```

##### 知识点
1. 有三种数据类型具有`length`属性。

- `Array`——数组的`length`属性代表了数组的长度。
- `Function`——函数的`length`属性代表了形参的个数。
- `String`——字符串的`length`属性代表了字符串的长度。

2. `>>>` 位运算符，无符号右移，用作参数防护。