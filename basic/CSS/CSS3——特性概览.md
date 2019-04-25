### CSS3 边框
---

属性 | 说明
---|---
[border-image](https://www.w3cschool.cn/cssref/css3-pr-border-image.html) | 设置所有边框图像的速记属性。
[border-radius](https://www.w3cschool.cn/cssref/css3-pr-border-radius.html) | 一个用于设置所有四个边框- *-半径属性的速记属性。
[box-shadow](https://www.w3cschool.cn/cssref/css3-pr-box-shadow.html) | 附加一个或多个下拉框的阴影。

### CSS3 背景
---

属性 | 说明
---|---
[background-image](https://www.w3cschool.cn/css3/6donbflh.html) | CSS3中可以添加 *多张* 背景图片，从右到左层叠显示。
[background-size](https://www.w3cschool.cn/cssref/css3-pr-background-size.html) | 指定背景图像的大小。CSS3以前，背景图像大小由图像的实际大小决定。
[background-origin](https://www.w3cschool.cn/cssref/css3-pr-background-origin.html) | 指定了背景图像的位置区域。
[background-clip](https://www.w3cschool.cn/cssref/css3-pr-background-clip.html) | 指定背景图像开始绘制的位置。

### CSS3 渐变
---

属性 | 说明
---|---
[linear-gradient](https://www.w3cschool.cn/css3/oj26bfli.html) | 线性渐变
radial-gradient | 径向渐变

### CSS3 字体
---
CSS3 可通过`@font-face{ 描述符：值;}`指定字体
描述符 | 值 | 描述
---|---|---
font-family | name | 必需。规定字体的名称
src | URL | 必需。定义字体文件的 URL

### CSS3 2D转换
---
属性 | 描述
---|---
[transform](https://www.w3cschool.cn/cssref/css3-pr-transform.html) | 适用于2D或3D转换的元素
[transform-origin](https://www.w3cschool.cn/cssref/css3-pr-transform-origin.html) | 允许更改转化元素的位置`(transform-origin: x-axis y-axis z-axis;)`

方法（值） | 描述
---|---
translate（） | 根据左(X轴)和顶部(Y轴)位置给定的参数，从当前元素位置移动。
rotate（） | 在一个给定度数顺时针旋转的元素。负值是允许的，这样是元素逆时针旋转。`(transform: rotate(30deg);)`
scale（）| 该元素增加或减少的大小.`scale（2,4）`转变宽度为原来的大小的2倍，和其原始大小4倍的高度。此外还有`scaleY`和`scaleX`。
skew（）| `skew(30deg,20deg)` 元素在X轴和Y轴上倾斜20度30度。

### CSS3 3D转换
---

方法（值） | 描述
---|---
rotateX（） | 指定绕图片X轴旋转的角度。`rotateX(120deg)`
rotateY（） | 指定绕图片Y轴旋转的角度。

### CSS3 过渡
---

属性 | 描述
---|---
transition | `transition：要改变的属性 过渡时间（s）,（可指定多个属性）;`<br /> 再在该元素的某个动作（如`：hover`上指定过渡的结束状态）。

### CSS3 动画
---

CSS3 通过`@keyframes 动画名称{ 属性 {css属性:值;} }`来指定一个动画。属性还可以为0到100的百分数。

属性 | 描述
---|---
from | 指定动画开始时的状态 `from {background: red;}`
to | 指定动画结束时的状态。

通过将动画绑定到一个元素上实现动画效果。

属性 | 描述
---|---
[animation](https://www.w3cschool.cn/cssref/css3-pr-animation.html) | 	所有动画属性的简写属性，动画名称和时间为必选。
animation-delay | 规定动画何时开始。默认是 0。
animation-iteration-count | 规定动画被播放的次数。默认是 1，无限为infinite。
animation-direction | 规定动画的播放方向。默认是 "normal"。reverse为反向播放。alternate为轮播。

### CSS3 Flex Box
---
- 弹性盒子由弹性容器`(Flex container)`和弹性子元素`(Flex item)`组成。

- 弹性*容器* 通过设置`display`属性的值为`flex`或 `inline-flex`将其定义为弹性容器。

- 弹性容器内包含了一个或多个弹性子元素。

>注意： 弹性容器外及弹性子元素内是正常渲染的。弹性盒子只定义了弹性子元素如何在弹性容器内布局。
弹性子元素通常在弹性盒子内一行显示。默认情况每个容器只有一行。

#### 弹性容器的属性

属性 | 说明 |值
---|---|---
flex-direction | 指定弹性子元素在父容器中的位置。| `row`：默认<br />`row-reverse`：反转横向排列<br />`column`：纵向排列<br />`column-reverse`：反转纵向排列
justify-content | 指定子元素在容器内的对其方式。| `flex-start`：靠左紧挨着填充<br />`flex-end`：靠右紧挨着填充<br />`center`：居中紧挨着填充<br />`space-between`：两端紧挨，空白均分<br />`space-around`：子元素均分，两端各留1/2白。
flex-wrap | 设置弹性盒子子元素的换行方式。 | `nowrap`：默认，单行，可能会溢出<br />`wrap`：多行，溢出部分放入新行<br />`wrap-reverse`：反转`wrap`排列<br />
align-content | 类似`align-items`，但他不是设置弹性子元素的对齐，而是设置各个行的对齐。 | 值同`align-items`

#### 弹性子元素的属性

属性 | 值
---|---
`order` | 整数，用值来排列顺序，数值小的在前面。
`margin` | 设置`margin`值为`auto`值，自动获取弹性容器中剩余的空间。所以设置`margin：auto`即可实现完美居中。
`align-self` | 设置弹性元素自身在纵轴方向上的对齐方式。`flex-start`,`start-end`,`center`,`baseline`,`stretch`,`auto`
`flex` | 指定弹性子元素如何分配空间，通常配置第一个参数，整数，即可配置同一行的子元素分配空间的比率。










