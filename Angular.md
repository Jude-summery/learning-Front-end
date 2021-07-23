### 目录
---
1. [组件](#component)
2. [组件交互](#componentCommunication)
3. [组件生命周期](#lifeCircle)
4. [模块](#module)
5. [元数据](#metadata)
6. [变化监测](#changeDetector)
7. [模板](#template)
8. [指令](#directive)
---

<h3 id="component">组件</h3>

---
#### 概述
> 是Angular应用的最小单元，用来包装特定功能
#### 创建组件的步骤
1. 从`@angular/core`中引入`@Component`装饰器
2. 建立一个普通类，并用`@Component`修饰它
3. 在`@Component`中，设置[元数据](#metadata)`selector`和`template`
```
@Component({
    selector: "my-component",
    template: `
        <div>
            <p>my component</p>
        </div>
    `
})
export class MyComponent{}
```
#### 宿主元素与组件之间的交互
> 组件对应的`DOM`元素叫做宿主元素
1. 展示数据： `<p>{{data}}</p>`
2. 双向数据绑定：`({ngModel}) = "data"`
3. 监听宿主元素事件以及调用组件方法：`(evntName) => "func()"` 

### <h3 id="componentCommunication">组件交互 TODO: 同级组件之间如何交互</h3>

---
#### 父组件向子组件传递
1. `@Input([别名])`
```
import { Input } from '@angular/core';
// ...
export class ListItemComponent{
    @Input() contact:any = {};
}
```
2. 元数据 `inputs`
```
@Component({
    // ...
    inputs: ['contact']
})

export class ListItemComponent{
    contact: any = {};
}

```
3. 拦截输入属性

- `setter`
```
@Component({
    selector: 'list-item',
    template: `
        <div>
            // 这里的 contactObj 可以直接用 _contact 吗
            <label class="contact-name">{{contactObj.name}}</label>
            <span class="contact-tel">{{contactObj.telNum}}</span>
        </div>
    `
})
export class ListItemComponent implements OnInit {
    _contact: object = {};
    @Input()
    set contactObj(contact: object) {
        this._contact.name = ( contact.name && contact.name.trim()) || 'no name set';
        this._contact.telNum = contact.telNum || '000-000';
    }
    get contactObj() { return this._contact; }
}
```
- `ngOnChanges`
```
// changes里是通过@Input指定的那些属性
ngOnChanges(changes: {[propKey: string]: SimpleChanges}){
    for(let propName in changes){
        let changedProp = changes[propName],
        form = JSON.stringify(changedProp.previousValue),
        to = JSON.stringify(changedProp.currentValue);
    }
}
```
#### 子组件向父组件传递数据
1. 事件传递
```
// 父组件
import { Component } from '@angular/core';

@Component({
    selector: 'collection',
    template: `
        <contact-collect [contact]="detail" (onCollect)="collectTheContact($event)"></contact-collect>
    `
})
export class CollectionComponent implements OnInit {
    detail: any = {};
    collectTheContact() {
        this.detail.collection == 0 ? this.detail.collection = 1 : this.detail.collection = 0;
    }
}

// 子组件
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'contact-collect',
    template: `
        <i [ngClass]="{collected: contact.collection}" (click)="collectTheContact()">收藏</i>
    `
})

export class ContactCollectComponent{
    @Input() contact:any = {};
    @Output() onCollect = new EventEmitter<boolean>();
    collectTheContact(){
        this.onCollect.emit();
    }
}
```
2. 父组件通过**局部变量**获取子组件引用

    父组件中通过在子组件的标签上绑定一个局部变量 `collect` 以 `#` 号标识，以此来获取子组件的实例并直接获取它的方法和属性。
```
// ...
<contact-collect (click)="collect.collectTheContact()" #collect></contact-collect>
```
3. 父组件使用 `@ViewChild` 获取子组件的引用
```
// ...
export class CollectionComponent {
    // 通过这样的方式子组件就被引用到了父组件的contactCollect属性中。
    @ViewChild(ContactCollectComponent) contactCollect: ContactCollectComponent;
}
```
#### 组件内容嵌入
> 通常用来创建可复用的组件。
```
// 根组件
import { Component } from '@angular/core';

@Componet({
    selector: 'app',
    template: `
        <example-content>
            <header>Header content</header>
        </example-content>
    `
})

// 子组件
// ...
@Component({
    selector: 'example-content',
    template: `
        <div>
            <h4>ng-content 示例</h4>
            <div style="background-color: gray; padding: 5px; margin: 2px">
                <ng-content select="header"></ng-content>
            </div>
        </div>
    `
})
```
在以上代码中，根组件中的`<header></header>`将取代`<ng-content select="header"></ng-content>`嵌入到模板当中。`select`属性是一个`CSS`选择器，可以同时定义多个`ng-content`。

### <h3 id="lifeCircle">组件生命周期</h3>

---
> 生命周期钩子函数为 ”ng + 接口名“

以下是常用的生命周期钩子方法，`Angular`会按以下的顺序依次调用钩子方法：

- [ngOnChanges](#ngOnChanges)
- [ngOnInit](#ngOnInit)
- [ngDoCheck](#ngDoCheck)
- [ngAfterContentInit](#ngAfterContentInit)
- [ngAfterContentChecked](#ngAfterContentChecked)
- [ngAfterViewInit](#ngAfterViewInit)
- [ngAfterViewChecked](#ngAfterViewChecked)
- [ngOnDestroy](#ngOnDestroy)

<h4 id="ngOnChanges">ngOnChanges</h4>

- 触发时机：在`ngOnInit`之前或当数据绑定的输入属性（`@Input`）的值发生变化时会触发。
- 参数：接受一个`SimpleChanges`对象，包含当前值和变化前的值。

<h4 id="ngOnInit">ngOnInit</h4>

- 触发时机：在**第一次**`ngOnChanges`之后触发，只执行一次。
- 使用场景：组件构造后不久就要进行复杂初始化时；需要在输入属性设置完成之后才构建组件。

<h4 id="ngDoCheck">ngDoCheck（慎用）</h4>

- 触发时机：每一个变化监测周期内，不管数据是否改变都会触发。
- 使用场景：处理简单的逻辑，更细粒度的控制。

<h4 id="ngAfterContentInit">ngAfterContentInit</h4>

- 触发时机：使用`<ng-content>`将外部内容嵌入到组件视图后且在第一次`ngDoCheck`后调用，只执行一次。

<h4 id="ngAfterContentChecked">ngAfterContentChecked</h4>

- 触发时机：使用`<ng-content>`将外部内容嵌入到组件视图后，或者每次变化监测的时候调用。

<h4 id="ngAfterViewInit">ngAfterViewInit</h4>

- 触发时机：在创建了组件的视图及其子视图之后被调用，只执行一次。

<h4 id="ngAfterViewChecked">ngAfterViewChecked</h4>

- 触发时机：在创建了组件的视图及其子视图之后被调用，或者每次变化监测的时候调用。

<h4 id="ngOnDestroy">ngOnDestroy</h4>

- 触发时机：在销毁指令/组件之前调用。

### <h3 id="module">模块</h3>

---
> 使用`@NgModule`来创建模块。
>
> 只能有一个根模块（`Root Module`），其他模块叫做特性模块（`Feature Module`）。
```
// 创建根模块
// app.module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactItemComponent } from './contactItem.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [ContactItemComponent],
    bootstrap: [ContactItemComponent]
})
export class AppModule{}

// 启动根模块
// app.ts
import { platformBrowserDynamic } from '@angular/platform-browswe-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

<h3 id="changeDetector">变化监测</h3>

---
#### TODO `NgZone`和 6.7 扩展阅读

#### 变化监测类
```
class ChangeDetectorRef {
    // ...
    markForCheck(): void
    detach(): void
    detectChanges(): void
    reattach(): void
}
```
- `markForCheck()`：把根组件到该组件之间的这条路径标记起来，下次变化监测时必须检查这条路径。
- `detech()`：从变化监测树中分离变化监测器，该组件不再受监控，直到手动执行`reattach()`方法。
- `reattach()`：见上。
- `detectChanges()`：手动触发执行该组件到各个子组件的一次变化监测（`detech()` 掉的组件依旧会执行）。

<h3 id="metadata">元数据</h3>

---
#### 常用元数据
1. `select`：指定自定义组件标签名称
2. `template`：指点组件`HTML`模板
3. `imports`：
4. `declarations`：指定要用到的视图类
5. `bootstrap`：指定根模块
6. `inputs: string[]`：指定组件输入的属性
7. `outputs: string[]`：指定组件输出的属性
8. `providers`：引入服务
9. `changeDetection`：指定变化监测策略（`ChangeDetectionStrategy.OnPush` - 只监测输入属性，对于引用类型只监测引用地址；`ChangeDetectionStrategy.Default` - 检查所有数据，引用类型会被深度遍历）

<h3 id="template">模板</h3>

---
#### 单向数据绑定
1. 插值
> `{{模板表达式}}`

模板表达式避免使用会产生副作用和复杂逻辑的操作。

2. 属性绑定 
> `[属性]="模板表达式"`

- 绑定`DOM`的属性，如`title`，`id`，需注意这里不是`HTML`的特性，不要混淆。
- 绑定`Angular指令`，如`ngStyle`。
- 绑定自定义组件的输入属性，用作父子通讯。
- 不使用中括号代表右侧为普通字符串。
- 绑定`HTML`特性时使用`[attr.colspan]="模板表达式"`的形式。
- `CSS`类绑定，`class="类名"`或`[class]="模板表达式"`，这种形式后面的会完全覆盖前面的；`[class.class-name]="模板表达式"`，这种形式会在模板表达式返回`true`时添加该类名，反之移除。
- `Style`样式绑定，形如`[style.style-property]`，如`[style.font-size.px]="isLarge ? 18 : 13"`

3. 事件绑定
> `(目标事件)="模板语句"`

- `$event`事件对象：可以是`DOM`元素事件，也可以是自定义事件。
```
//...
(input) = "currentUser.firstName=$event.target.value"
```
- 自定义事件
```
// item.component.ts
import { Component, Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'list-item',
    template: `
        <a (click)="goDetail(contact.id)"><!--...--></a>
    `
})
export class ListItemComponent {
    @Input() contact:any={};
    // 自定义一个事件，然后通过输出属性抛到上层
    @Output() routerNavigate = new EventEmitter<number>();

    goDetail(num: number) {
        this.routerNavigate.emit(num);
    }
}

// 父组件
<ul class="list">
    <li *ngFor="let contact of contacts">
        // 触发了routerNavigate事件，父组件执行对应的回调函数
        <list-item [contact]="contact" (routerNavigate)="routerNavigate($event)"></list-item>
    </li>
</ul>
```
#### 双向数据绑定
> `[(ngModel)]="变量"`
```
// 展开形式
<input
    [ngModel]="变量"
    (ngModelChange)="handler($event)"
></input>
```
<h4 id="builtInDirective">内置指令</h4>

> 指令分为 `[属性型指令]` 和 `*结构型指令`
- `ngClass`
> 管理多个类名
```
<div [ngClass]="classObj">

// ...
classObj = {
    className1: this.className1,
    className2: this.className2,
    ...
}
```
- `ngStyle`
> 管理多个样式
```
<div [ngStyle]="styleObj">

// ...
styleObj = {
    'color': 'red',
    'font-size': '16px',
    ...
}
```
- `ngIf`
> 控制节点是否存在 `<h3 *ngIf="..."></h3>`
- `ngSwitch`
```
<span [ngSwitch]="contactName">
    <span *ngSwitchCase="'TimCook'">Tim Cook</span>
    <span *ngSwitchCase="'BillGates'">Bill Gates</span>
    <span *ngSwitchDefault>Nobody</span>
</span>
```
- `ngFor`
> 遍历渲染
```
// let i=index 为可选项
<div *ngFor="let contact of contacts; let i=index">{{ i + 1 }} - {{ contact.id }}</div>
```
- `ngForTrackBy`
> 遍历渲染时，指定一个属性，标识列表项避免重复渲染
```
trackByContacts(index: number, contact: Contact){
    // 指定id为标识
    return contact.id
}
<div *ngFor="let contact of contacts; trackBy: trackByContacts">{{contact.id}}</div>
```
<h4 id="form">表单</h4>

1. `ngForm`指令
> 是表单的控制中心，负责处理表单内的页面逻辑。
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FormComponent } from './form.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule // 导入FormsModule模块
    ],
    declarations: [
        AppComponent,
        FormComponent
    ],
    boostrap: [AppComponent]
})
export class AppModule{}

```
2. `ngModel`指令
> 表单数据绑定的核心所在，在表单控件中使用`ngModel`属性绑定，必须给该控件添加`name`属性。
```
<input type="text" name="contactName" [(ngModel)]="curContact.name" />
```

3. `ngModelGroup`指令
> 对表单控件进行分组
```
<form #concatForm="ngForm">
    <fieldset ngModelGroup="nameGroup" #nameGroup="ngModelGroup"><!--...--></fieldset>
    <fieldset ngModelGroup="addressGroup" #addressGroup="ngModelGroup"><!--...--></fieldset>
</form>
```
此时`concatForm.value`的值为`{nameGroup:{...}, addressGroup:{...}}`，同时可以通过`nameGroup.vaild`单独校验该组的有效性。

4. 表单指令局部变量
- `ngForm`：表单局部变量
```
<form #contactForm="ngForm"></form>
```
`contactForm`为`ngForm`指令实例对象的引用，可在模板中读取`ngForm`实例对象的属性值。`contactForm.valid`：表单有效性状态；`contactForm.value`：表单控件键值对的对象。
- `ngModel`：控件局部变量
```
<input type="text" name="contactName" [(ngModel)]="curContact.name" #contactName="ngModel" />
<p>{{contactName.valid}}</p>
```
- 表单状态
以上两个局部变量都有五个表单状态属性

|  状态   | true/false  |
|  ----  | ----  |
| `valid`  | 表单值是否有效 |
| `pristine`  | 表单值是否**未**改变 |
| `dirty`  | 表单值是否**已**改变 |
| `touched`  | 表单是否**已**被访问过 |
| `untouched`  | 表单是否**未**被访问过 |

5. `ngSubmit`事件
> 响应表单里类型为`submit`的按键操作。
```
<form #contactForm="ngForm" (ngSubmit)="doSubmit(contactForm.value)"></form>
```

6. 可自定义表单样式

7. 表单内置校验
- `required`：是否为空
- `minlength`：最小长度
- `maxlength`：最大长度
- `pattern`：匹配规则

#### 管道
> 对模板内的数据进行转换。
1. 内置管道

| 管道 | 使用格式 | 功能 |
| --- | ---- | ---- |
| `DatePipe` | `expression \| data: format` | 格式化时间 |
| `JsonPipe` | `expression \| json` | 对象转字符串 |
| `UpperCasePipe` | `expression \| uppercase` | 转大写字母 |
| `LowerCasePipe` | `expression \| lowercase` | 转小写字母 |
| `DecimaPipe` | `expression \| number[: 整数最小位数.小数最小位数-小数最大位数]` | 数字格式化 |
| `CurrencyPipe` | `expression \| currency: 'CNY': true: '4.2-2'` | 货币格式化 |
| `PercentPipe` | `expression \| percent[: '4.2-2']` | 百分比 |
| `SlicePipe` | `expression \| slice: start[: end]` | 剪裁数组或字符串 |

2. 自定义管道
```
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'sexReform'})
export class SexReform implements PipeTransform {
    // 自定义管道类必须实现这个方法
    transform(val: string): string {
        switch(val) {
            case 'male': return '男';
            case 'female': return '女';
            default: return '未知性别';
        }
    }
}

// 使用
@NgModule({
    // 需在元数据中引入，之后就能像内置管道一样使用了
    declarations: [SexReform]
})
```
<h3 id="directive">指令</h3>

---
> 使用方式类似`HTML`元素属性。
#### 指令分类
1. 属性指令
> 通常用来改变元素的外观和行为。
2. 结构指令
> 通常用来改变`DOM`树的结构。
3. 组件
> 构造视图。
```
// 组件
@Component({
    selector: 'hello-world',
    template: '<div>Hello world</div>'
})
class HelloWorldComponent {
    // ...
}

// 指令
@Directive({
    selector: 'myHelloWorld'
})
class HelloWordDirective {
    // ...
}
```
#### 内置指令
1. [通用指令](#builtInDirective)
2. [表单指令](#form)
3. [路由指令](#)
#### 自定义指令
基本用法：
```
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[myBeautifulBackground]'
})
export class BeautifulBackgroundDirective {
    // 指定一个输入属性来接收外部值，实现可配置
    @Input('myBeautifulBackground') // 为这个输入属性设置别名
    backgroundColor: string;
    constructor(el: ElementRef) {
        el.nativeElement.style.backgroundColor = backgroundColor;
    }
}

// 使用时需要在@NgModule的declarations引入自定义指令

// 使用
<div [myBeautifulBackground]="color"></div>
```
响应操作：
```
import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[myBeautifulBackground]'
})
export class BeautifulBackgroundDirective {
    private _defaultColor = 'yellow';
    private el: HTMLElement;

    @Input('myBeautifulBackground') backgroundColor: string;

    constructor(el: ElementRef){
        // TODO：这里不用this会怎么样
        this.el = el.nativElement;
        this.setStyle(this._defaultColor);
    }

    // @HostListener装饰器指向使用属性指令的DOM元素
    @HostListener('click') onClick(){
        this.setStyle(this.backgroundColor || this._defaultColor);
    }

    private setStyle(color: string){
        this.el.style.backgroundColor = color;
    }
}

// 使用时，点击下面的元素，其颜色就会从黄色变为红色
<div [myBeautifulBackground]="'red'"></div>
```
