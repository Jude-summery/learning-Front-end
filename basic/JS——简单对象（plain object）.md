### 简单对象（plain object）
---

简单对象指的就是由`var obj = {}`或`var obj = new Object`创建的对象，其原型链上只有Object。

可以通过以下的方法进行判定：

```
function isPlainObject(obj) {
    if(typeof obj !== 'object' || obj === null) return false

    let proto = obj
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return Object.getPrototypeOf(obj) === proto
}
```
