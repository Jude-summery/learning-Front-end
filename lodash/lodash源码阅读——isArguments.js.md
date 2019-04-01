### isArguments.js
---
##### 用途
检测一个值是否是`类arguments`对象。

##### 引用
本模块引用了`getTag.js`和`isObjectLike.js`。

##### 源码
```
import getTag from './.internal/getTag.js'
import isObjectLike from './isObjectLike.js'

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object, else `false`.
 * @example
 *
 * isArguments(function() { return arguments }())
 * // => true
 *
 * isArguments([1, 2, 3])
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && getTag(value) == '[object Arguments]'
}

export default isArguments
```

##### 知识点
函数的参数对象`arguments`调用`Object.prototype.toString.call(arguments)`返回值为`[object Arguments]`