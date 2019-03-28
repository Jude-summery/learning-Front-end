### isSymbol
---

##### 用途
判断传入值是否为Symbol类型

##### 引用
本模块引用了`getTag.js`

##### 源码
```
import getTag from './.internal/getTag.js'

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * isSymbol(Symbol.iterator)
 * // => true
 *
 * isSymbol('abc')
 * // => false
 */
function isSymbol(value) {
  const type = typeof value
  return type == 'symbol' || (type == 'object' && value != null && getTag(value) == '[object Symbol]')
}

export default isSymbol
```

##### 知识点

*Symbol*

`Symbol`类型是在ES2015中加入的新基本数据类型。

其唯一合理的用法是用变量存储 symbol的值，然后使用存储的值创建对象属性。

如下：
```
var  myPrivateMethod  = Symbol();
this[myPrivateMethod] = function() {...};
```

以这种方式创建的属性是匿名的，并且不可枚举。只能通过`Object.getOwnPropertySymbols()`遍历到。
