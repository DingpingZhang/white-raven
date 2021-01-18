import { BasicMessageProps } from '../views/messages/basic-message';

export const MESSAGE_LIST: ReadonlyArray<BasicMessageProps> = [
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text:
            '闭包表现为 trait，这意味着不能直接返回闭包。对于大部分需要返回 trait 的情况，可以使用实现了期望返回的 trait 的具体类型来替代函数的返回值。但是这不能用于闭包，因为他们没有一个可返回的具体类型；例如不允许使用函数指针 fn 作为返回值类型。',
        },
      },
    ],
    timestamp: 1610977530419,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text:
            '不同于闭包，fn 是一个类型而不是一个 trait，所以直接指定 fn 作为参数而不是声明一个带有 Fn 作为 trait bound 的泛型参数。',
        },
      },
    ],
    timestamp: 1610977530419,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text: '函数指针实现了所有三个闭包 trait（Fn、FnMut 和 FnOnce），',
        },
      },
    ],
    timestamp: 1610977530419,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text:
            '所以总是可以在调用期望闭包的函数时传递函数指针作为参数。倾向于编写使用泛型和闭包 trait 的函数，这样它就能接受函数或闭包作为参数。',
        },
      },
    ],
    timestamp: 1610977530419,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text:
            '一个只期望接受 fn 而不接受闭包的情况的例子是与不存在闭包的外部代码交互时：C 语言的函数可以接受函数作为参数，但 C 语言没有闭包。',
        },
      },
    ],
    timestamp: 1610977530419,
    highlight: true,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text: '闭包表现为 trait，这意味着不能直接返回闭包。对于大部分需要返回 trait 的情况',
        },
      },
    ],
    timestamp: 1610977530419,
    highlight: true,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text: '这段代码尝试直接返回闭包，它并不能编译',
        },
      },
    ],
    timestamp: 1610977530419,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text:
            '我们讨论过了如何向函数传递闭包；也可以向函数传递常规函数！这在我们希望传递已经定义的函数而不是重新定义闭包作为参数时很有用..。',
        },
      },
    ],
    timestamp: 1610977530419,
    highlight: true,
  },
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    message: [
      {
        type: 'text',
        data: {
          text: '接下来让我们学习宏！',
        },
      },
    ],
    timestamp: 1610977530419,
  },
];
