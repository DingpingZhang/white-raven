# Naming Rules

## 1. CSS class 命名规则

> `Block[__element] [...[categoryPrefix-]modifier]`
>
> - `[]`: Optional.
> - `...`: Multiple.

参考 [BEM](http://getbem.com/naming/) 命名法，做出以下规定：

1. `Block`：即 React 中的 Component，与 React Component 命名建议一致，采用 **大驼峰命名法**。例：`CirleButton`、`ChatTabContent`。
2. `element`：组成 Component 的子元素，通常是 HTML Element，采用 **小驼峰命名法**。注意以下两点：
   1. `element` 不可以单独存在，必须依附于 `Block`，且用双下划线 `__` 与 `Block` 隔开。例：`CircleButton__icon`、`ChatTabContent__chatArea`。
   2. Component 中的 “element” 虽然在结构上有层级关系，但在命名上没有体现层级关系的语法，可以通过名字来体现。
      1. **错误**例子：`GroupChatView__member__title`、`GroupChatView__chat__title`；
      2. 正确例子：`GroupChatView__memberTitle`、`GroupChatView__chatTitle`。
3. `modifier`：修饰符，表示元素的状态或类型，如：`selected`、`highlight`，采用 **小驼峰命名法**。可以独立存在，不限个数。由于其不与元素主题名连接，为了清晰表达其所属类别，可以加上类别前缀，也采用 **小驼峰命名法**，类别前缀与修饰符名之间用单个短线分隔开，如：`msgType-text`、`msgType-at`、`text-tipSecondary`、`text-ellipsis`。不采用原 BEM 建议的双短线 `--` 隔开法。理由是：
   1. 不好看；
   2. 修饰符可能有多个，如果用 `--` 与元素主体名连接在一起，那不还得考虑排序问题？而单独的 class name 是具有无序性的。比如：`BasicMessage__msgSegment--msgType-at--selected` 和 `BasicMessage__msgSegment--selected--msgType-at`，是两个不同的 class name，但说它们的含义不一样，这好吗？这不好。
   3. 有些修饰符是比较通用的，应当提取出来复用，比如：`text-ellipsis`，可以单独提取出来随意组合，岂不美哉？

综上，在 class list 中，**有且仅有一个**以大写字母开头的名称主体，若该名词主体不含 `__` 则必为一个独立的 React Component；而以小写字母开头的 class name 必为 `modifier`。
