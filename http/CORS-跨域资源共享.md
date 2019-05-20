### 浏览器的同源策略
---

*`CORS`允许在下列场景中使用跨域`HTTP`请求*

- 由`XHR`或`Fetch`发起的跨域`HTTP`请求
- `Web`字体（`CSS`中通过`@font-face`使用跨域字体资源）
- `WebGL`贴图
- 使用`drawImage`将`Images/video`画面绘制到`canvas`
- 样式表（使用`CSSOM`）
- `Scripts`（未处理的异常）

*概述*

跨域资源共享标准新增了一组`HTTP`首部字段，允许服务器声明哪些源站有权限访问哪些资源。

*若干访问控制场景*

- 简单请求
    - 不会触发`CORS`预检请求
    - 满足以下条件可视为“简单请求”：
        - `GET`
        - `HEAD`
        - `POST`
            - 仅当`POST`方法的`CONTENT-TYPE`值等于下列之一才算作简单请求：
                - `text/plain`
                - `multipart/form-data`
                - `application/x-www-form-urlencoded`
        - `Fetch`规范定义了对`CORS`安全的首部字段集合，不得人为设置该集合之外的其他首部字段。该集合为：
            - `Accept`
            - `Accept-Language`
            - `Content-Language`
            - `Content-Type`（需要注意额外的限制）
            - `DPR`
            - `Downlink`
            - `Save-Data`
            - `Viewport-Width`
            - `Width`
        - 请求首部字段`Origin`会携带请求资源的域名信息
        - 响应首部字段`Access-Control-Allow-Origin`会指定允许访问该资源的外域
        - 通过`Origin`和`Access-Control-Allow-Origin`便可以完成简单请求的控制
- 预检请求
    - “需预检的请求”要求必须首先使用`OPTIONS`方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求
    - 满足以下任意条件时，应先发送预检请求：
        - 使用了下面任一`HTTP`方法：
            - `PUT`
            - `DELETE`
            - `CONNECT`
            - `OPTIONS`
            - `TRACE`
            - `PATCH`
    - 人为设置了对`CORS`安全的首部字段集合之外的其他首部字段
    - `Content-Type`的值不属于上述之一
    - 浏览器检测到需要先发起预检请求后会发出一个`OPTIONS`，携带以下两个字段：
        - `Access-Control-Request-Method:POST`
        - `Access-Control-Request-Headers:X-PINGOTHER，Content-Type`
    
        服务器通过以上的两个字段决定，该实际请求是否被允许
    - 响应字段：
        - `Access-Control-Allow-Origin: http://foo.example`
        - `Access-Control-Allow-Methods: POST, GET, OPTIONS`
        - `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type`
        - `Access-Control-Max-Age: 86400`  //表示该响应有效时间，在有效期内无须为同一请求再次发起预检请求。
- 附带身份凭证的请求
    ```
    var invocation = new XMLHttpRequest();
        var url = 'http://bar.other/resources/credentialed-content/';
        function callOtherDomain(){
            if(invocation) {
                    invocation.open('GET', url, true);
                    //设置为true，向服务器发送Cookies
    invocation.withCredentials = true;
                    invocation.onreadystatechange = handler;
                    invocation.send(); 
            }
        }
    ```

    响应字段中应携带 `Access-Control-Allow-Credentials: true`

    对于附带身份凭证的请求，服务器不得设置`Access-Control-Allow-Origin`的值为`*`。否者会失败

*请求字段和响应字段*

> [详见网址](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)