### baseToString.js
---
##### 用途
改写原生的`toString`方法,主要是为了解决数字`-0`无法被正常转换为字符串`-0`而是`0`的问题。

##### 引用
本模块引用了`isSymbol.js`

##### 源码
```
import isSymbol from '../isSymbol.js'

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0

/** Used to convert symbols to primitives and strings. */
const symbolToString = Symbol.prototype.toString

/**
 * The base implementation of `toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  if (Array.isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return `${value.map(baseToString)}`
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : ''
  }
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

export default baseToString
```

##### 知识点
二进制直接量——0b[0-1]

八进制直接量——0[0-7] （不被ES规范建议的）

十六进制直接量——0x[0-f]