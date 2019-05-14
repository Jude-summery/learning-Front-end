### dva实现dispatch回调
---

*1.x*
```
// view层
new Promise((resolve) => {
    dispatch({
       type: 'model/fetch',
       payload: {
          resolve,
          id: userId,
       }
    })
}).then((res) => {
    console.log(res);
})

// model层（effect中）
*fetch({ payload }, { call }) {
  const { resolve } = payload;
  const { data } = yield call(services.fetch, payload);
  if (data.code === 0) {
    // 通过resolve返回数据，返回的数据将在Promise的then函数中获取到
    !!resolve && resolve(data.data);
}
```

*2.x*
```
// 2.x中dispatch函数自带回调
(cd) => dispatch(...).then(() => cd());
```