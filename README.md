# White Raven ![version](https://img.shields.io/badge/White%20Raven-0.1.0-yellow) ![build state](https://img.shields.io/badge/build-passing-brightgreen)

White Raven 是一个由 [React](https://reactjs.org/) 实现的即时通讯（IM）应用，其名取自[《冰与火之歌》](https://awoiaf.westeros.org/index.php/White_raven)。

## 特性

1. 设计了一套通用的 [IM 程序 API](./docs/api-document.md)，用户可以根据该 API 自行提供后端程序，包括适配一些现有的即时通讯平台；
2. 实现了私聊与群聊；
3. 提供了一些可复用的 UI 组件，秉着练手的原则，项目目前的 UI 组件全部自行编写，原则上尽量不引入第三方组件库。目前自定义组件包括：
   1. 虚拟化列表；
   2. 无限滚动 + 虚拟化消息列表；
   3. 懒加载 Switch 导航组件；
   4. 模态 Dialog 组件；

## 截图

![dark-theme](./images/screenshot-dark-theme.png)

![light-theme](./images/screenshot-light-theme.png)

## 运行

```cmd
> yarn start
```

## 贡献

项目目前处于起步阶段，欢迎各位前端大佬参与到开发中来，你可以：

- 通过 [Issue](https://github.com/DingpingZhang/white-raven/issues) 反馈 Bug，提出建议或需求；
- Fork 此项目，并通过 [Pull Requests](https://github.com/DingpingZhang/white-raven/pulls) 共享你的代码。

## 鸣谢

- UI 设计来源：[Dribbble](https://dribbble.com/shots/14723765-Inbox-Light-Dark)
