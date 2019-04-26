### Array.prototype.reduce()
---

1. 语法：`array.reduce(function(total, currentValue, currentIndex, arr), initialValue)`

2. 作用：返回数组内的每一个值经过某种操作后的累计值。

3. 参数：
    1. 必需。函数
    ——函数的参数
        ——`totol`：必需。初始值，或计算结束后的返回值。
        ——`currentValue`：必需。当前元素。
        ——`currentIndex`：可选。当前元素的索引。
        ——`arr`：可选。当前元素所属的数组对象。

    2. 可选。传递给函数的初始值（`initialValue`）