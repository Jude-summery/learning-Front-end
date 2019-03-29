### baseToNumber.js
---
##### 用途
将参数转换为Number类型，主要是为了解决Symbol类型在原生JS中转换为数值类型时报TypeError错误。

##### 引用
本模块引用了`isSymbol.js`

##### 源码
```
import isSymbol from '../isSymbol.js'

/** Used as references for various `Number` constants. */
const NAN = 0 / 0

/**
 * The base implementation of `toNumber` which doesn't ensure correct
 * conversions of binary, hexadecimal, or octal string values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 */
function baseToNumber(value) {
  if (typeof value == 'number') {
    return value
  }
  if (isSymbol(value)) {
    return NAN
  }
  return +value
}

export default baseToNumber
```

##### 知识点
二进制直接量——0b[0-1]

八进制直接量——0[0-7] （不被ES规范建议的）

十六进制直接量——0x[0-f]