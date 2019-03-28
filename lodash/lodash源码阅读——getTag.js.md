### getTag.js
---
##### 用途
返回表示数据类型的字符串

##### 引用
本模块没有引用

##### 源码
```
const toString = Object.prototype.toString

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)  
}

export default getTag
```

##### 知识点

添加`if (value == null) {return value === undefined ? '[object Undefined]' : '[object Null]'}`这一步判断的原因是为了兼容`JavaScript 1.8.5`之前的代码，他们是不支持`null`和`undefined`返回`[object Undefined]`和`[object Null]`的。