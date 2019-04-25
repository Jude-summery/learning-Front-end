### 可枚举属性
---

1. 由`enumerable`属性来决定。

2. 主要影响以下三种方法的结果：

    ——`for...in`返回实例和原型的所有可枚举属性。

    ——`Object.keys(obj)`返回实例本身可枚举属性。

    ——`JSON.stringify(obj)`返回实例自身可枚举属性，并转换成JSON对象。