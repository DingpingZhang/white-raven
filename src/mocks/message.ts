import { Message } from 'api';
import { uuidv4 } from 'helpers';
import { getMockItems } from './common';

export function getMockMessages(count: number): ReadonlyArray<Message> {
  return getMockItems(MESSAGE_LIST, count, (item) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export const MESSAGE_LIST: ReadonlyArray<Message> = [
  {
    id: '',
    senderId: '787673395',
    content: [
      {
        type: 'text',
        text: '闭包表现为 trait，这意味着不能直接返回',
      },
      { type: 'face', faceId: '107' },
      { type: 'face', faceId: '18' },
      {
        type: 'text',
        text: '闭包。\n\n对于大部分需要返回 trait 的',
      },
      { type: 'at', targetId: '7474741' },
      { type: 'face', faceId: '178' },
      {
        type: 'text',
        text: '情况，可以使用实现了期望',
      },
      { type: 'face', faceId: '78' },
      {
        type: 'text',
        text:
          '返回的 trait 的具体类型来替代函数的返回值。但是这不能用于闭包，因为他们没有一个可返回的具体类型；例如',
      },
      { type: 'at', targetId: '7474741' },
      {
        type: 'text',
        text: '不允许使用函数指针 fn 作为返回值类型。',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '1844812067',
    content: [
      {
        type: 'text',
        text:
          '不同于闭包，fn 是一个类型而不是一个 trait，所以直接指定 fn 作为参数而不是声明一个带有 Fn 作为 trait bound 的泛型参数。',
      },
      {
        type: 'image',
        url:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACjCAMAAAA3vsLfAAAAnFBMVEX///8yMDEAAACUlJQ0MDH8/PwwLi8xMTFMTEwsKisyMTEwLzA0MjNRUVH7+/sfHx9QUk8lIyTu7u4hISEYGBgoKCje3t719fUjIyM3NzfS0tLl5eUPDw8aFxg8PDwaGhq+vr5GRkZmZma1tbWoqKjDw8N1dXWJiYl8fHzV1dWenp5eXV12dnYWEhRWVlZISEhqamqsrKyPj49JRkjbJT4PAAAOxklEQVR4nO1d22KqOhCFKsEQNA0QwAuCd8Vqtef//+0koFY0IFao4O562GW3YMhyksxMZiaS9Ic//OEPf/glKM9+gT+8NJSDgPV7QdhY7NYxxrtFIwx6/e/bnvR6FYQSkdExeuF85HnYIyaBJxBiYt/zWh/TnnG69w8xjGDZop5JkQzkBPToXyADanpou5gZz37TSiASnVXY9jwCGUV6gqwr8iDx/XVoP/ulqwC78YkZZTmBVOia7ZDPdcq/O1qNSdtyUfMMqYQd/oxUVUWmtQ6cZ7/7MxBJir0AGCJNux6U6dDY/UhDEOuN/q1GXg+MttUcE3CbpzQAQpb2PzdUV2OPPkAaE1AdUH9u/1P6SH+O4UOkxeOaS9y/o5E4C4s+xtkJgHphh4/U1xe6ydBFWhGcxYurOZo9u0e/gP7YgqpaGG2gqQNrHptdLwq+6u3ho5OaAKQbMJv22d0rCYw1Y+cVTxoD2CydVxU3RZoBooM7dNs7QIarZ/evDPABGuJSRC0CQubkJXVfp6QBGkNDqrV8dhdLgNEm5QzPGEhFKh6/ln3fUSRbL0rDTUVTJiPjlRYGRerB3C61H4PJMuy+lA9z5oESB+g3bwi5r7KgshEaPOIhugsqor3XUHyZuobhL8haTBvj7UXkref/xgg90qYiXP/5TelIq8fckXcDwW6/5uspU9v7JZjuNwBHNdffFMlp/dq89g26fnbHH4MijcmvkybrqrussX3KXrzh/T5rXA2x9rWd3th7B0LrHRQ62wk+ja2nuMZqSF+wiGoI6l2AfQqQ+ghbuqxrkPgm6upUk7WElx1pGujWd1lYC8x31Q8cx7CDxdBy4T378efguwiQDEZfgW0YztRXr/d0yEddh2noo+seo9GxN3ZjhH9s4EO/FR6jGRyK1OuWvJpOb7YpGoXu1/cdnWDrQaBfiFxScK7EUecRW954duSE/ZxDQUtArWGQCOtMCwpkQMa9xH2ztQcveYuYOVF2PYzhZreSznf4Jr7oC6LjX+5zAVCkEIu2QwE8m6oj3WrWutxiAJBQwoBNQujVBiHA29XFrmjfFXw/sjoIfrfPRaBPkYyuewO3iR5H13tCNL4UaoAS7GE6XH8svxohQ+NrOV8Pqe9hF7IP4xM/7k5OD57QFcm1huq2mkbzjUAA2AK3ENxuLH2EqE9H43Cyup6RlP5q0hgPXZ8i5C9EVOyoYJu/KeMvwb3VBWOttxGyJuOJ8PYZHH3N+s7xv8r53w5w+kxp6fYkUdjClytQZJpsNa3VqqBIylZswQN/dt3rM5LEKoNy/hfRLRMsGKTNpkzm9VJCAl8sbMgrJZBvhgVtMWnT/TrZWIo0SjM7vVLC+GZYOLexFahWLqRA9O3H0lYKbT2RcHPaVL93++nKoE3TbM2yaEsLmIO7msxufF20Up0b5axtM5H1G8Oqy4aMIo1pOm29Mr79QLSSxnBrElCjSDYzq9J6gYMy2gyF1lUEQOsRS64w5TOdNhKWIW0LN609GZnT4tsrAwpjLZU2NkWXgJHA+j1Ag6MyWiwegZcRBw60TvHSZlCRKX/Eph4q7y7TZYtLUKQmfgZtTbKogw7Sz3Z040bxTS7ddNqaTTisvv9IkSaZW6OwVUIfjC5K38ppyrjyaTJsNIyzpA3opYS1rNIVEB6bKvLxVQwOvqwScA4vkEpYEiRpnyrizSb7rkposVAo0sy7HC9HQdBUVJLKzmU8I6Ja96puYDFd9ypWBsnHNHfULU1jt+MAAHHCPd6X1WxRUNqXU5t+hKq6Ao94UQiJ/t3WxRuUo2MXCcNMvjLA/jcGjfKwGHy3dOHt00HlVZDZhcMQvj0DSXHT5U3Vc+pDtwK0DS5HaeUnt4sVDVWCtuprbkkrh+kclaANtp/NSzYM94K2m9LmtlutNuZ9bb2/vw/5rybGAZNbD3ff2cMD/jB79l1NpQ3QZxOTjR5OeNrQbWmj23Z7ax57HtF2MiFnt2l7f99GtG0zaZNxtbfnJ8mYNk2lN2lrM3BpezvRFhw/7ae0vV3TVm1rvpEcpOj2IKXbbSxtpdLGM8KfSMstLOmFtKEBR0qvLQb6ORqNKLvw2c9RNz9tPntGZY98YnaF+cORZPPmNle0kRK8fAVid2VRc1vHFHd80D7K14hdtE+/D46flkWbtWaCFskXl9LW6ffw2rhioJXe9lM+Rc42HZdB22lYcto+z2gTvIFM509k5SY6XVGqRsm0tXLQBrdPZOUGFKmjihINtLJoEw9SEW1gWOWUZkPsEKeYIbkuwC4DVVWVxhc0VlU+p9NpeLK77XAaTltvV0DsEfYohGo3voof3qmsGbFrGXWrTFvfFL6zquqqmqRtxLTcSL4o1yFO4hhNQUlVYXlN22lYMgWkvT39et9CgtUglja1yrTZKUGUfOhe0HYcWZGVcKJN4E+cC2hjlI8i2tjF9vTB01HqRgyqNm1W2nvLehZtJw2lNNpQlR2VtqWnbVsJaHuPaOPGVRZtu9y0NYape2ZVpy1V2mTQt+3vpXFgWQPrcMEu2YW1sm1bYHGzx+yVlaDt+Ej8ML9Q+V399FRLpFaatrS5jWfLstnFuJacE/yM2adjZTzIMeR3iXOIDrRVeW4Tr6QxbYRJUj+j51aGPOSjrWem06ZXmTYjo+YHDzXKom3gpPsoOjdYe+vyuzJCUUGl9bZO6ooQh5/2R61UbDOkzdmmP8fxGeVAhsIE1pi2SlsJzCZNpe227+ZRj9iSpkpbxdM6WunhRvBW/tPDfsSsxj8e/fBSMU+vMQO6JftXDTM9OLDa/jZpmRHcVnZixczKDFCvMkIzPdzZLDFwhg/xRnqUvTCNtUKYpC9mMi057qcN049EKSPQukCshDUSYqio1HwUm8jptJFq75MabgZt5Y6UMIM2AMpsuQAMM2i7qMpQMJjKmEpbxdU20Y7fN21oUOJaOrPkdNrIV6V3l/lSmk6bSkvM+N/CDNrKySssEL0Mjxt7/ZKiGhVxkYETNtVeEdiagLJq2pU0x7CvYpR1DgP4r8qGfIR1ZsqVF5TT6jRL2HRSbYs0qgiVWcMTyIXrboqiSHb6jMpRcRuB07bKylQDMiy+OpgidVrpLiOOyk9t7KuHmYUTQeGJkWxi+8jIVONt1iF/eXmj0q43lZTC0tUUPkS/MlfRsvLzC0ZqxZkTb/viSvNzOhrp22UxcClFNAqGk+EY59DlTXHOL0bH8lZFZNCqAWvZrsrD1z9XogXwQfAPcNa3hJtvYtSBtrSKd2ffPxmKy9fdh6hc3u2Tedg6WoMC44qUHooRg591g78KUOCMDx/dOkVR55ZJ9VmTotI5Z+4jXYauSyBI5nlopj7t/OwMYOVwzKHRIATJmaoHb8mvuq4bQ5H69HwvBMBxY9rYdfGFQgfMbmj8RBDiWbG/gCTPYSmo8rmkByjJ7AQ/iH7rzNYX5ex1QNyP2Y90EWOyznt0s1vtjIRz2Gc7CjoO4tqmtjMbJudvHcgEw49JPtPnOJ6d1XRNuOjmEDXWAq26YXWGMx8vkKPSH4pj6o4zvtYWAMRue7nv3RpKEWn9WbgbYveOc+3gsh7rQYTed/U+XQZ0xmXFnrD3XyR5i+soqJCa1qC7XWYmRoXjkTXwTcgPOczNGqh4al8CijQ+D2oA+HBW7T6QPi7PjQRNtqyqGtKQ28480dZWeTw+u/me865JtYMYLtFLWjxkGG2+bN9W/OgJ8aSkupmanCKtLDWr3pgIoOL7o1eYJ6UKEpt7E+e2ZIAUteGGfqXwaIV7TwgndSsq3t8kSh3pUD7WhNpfVfOJiW3fjONyunedR6/rgNbuIOsGSbCj00+HH003DaMTYq6YQ3kc142MwBwR8LRurEnOpWWKF5y27lsgPJ4OwIzQ3SP61l1zG2x3amDDJ8BLa53LFLvccK9H4O2l3uZ6d47k0q+2dx25463KqXpWLnY0OYPzYhyKZDBrKrAOu6nfBbDybS5lhbBdAOhm1WumiMAIUpNlXZteTE3H7szI5YZDvkNFs/feE9DhZ+X3lK/BB0dgJaStCYbRH3pvQ6O/9s/HG/T1XH4K+46DFMspw/0bWCbGVFP2oqM5jO5bg5/UNDApBABS4nnrST6npaPlPf5PL6Pi6u9A6SQqDjTjvWU2euP8ZGO/XH9+bueNwJHy+t1ubO98o8ZHlHak1fkR32zqJ4eII0XpjNvfxcHsRZhD/cjjbz+ihKCJ30RgqecFxun46DZzuoM31rPJcM2sxjfrLWcB69TDUhJQkVXbiS3Gl5+wvzeTeDgqijGdMWW0NeB1GPa7vLV0ctJm1aRqfQr4MWE44bY4nM3CRin/0XEmvSOPuT4wH23+4mebO1VCOxHXAmDvkR7log3X5fyXLBijhA8buZMH9i1z0KaTbae4IJPnoT88V0NU1f/4+RZcDtrIf2xVfgHamH7LrNPjespGLEFhpB4kZK6YuQ2p9LPWqsc5mLyhRPYdIfOgf0aUY+fMibpBm6bSlvECE9sBhkoT200AUEzau0YjnIaNr/m26+eMTb1Bm+6OjNqvoWcw2hepf9EJyiQGozRv9t8NK8EcO6/EGo9DM1NjenlxrEJo83jcXLn9+HUsNtdbVoftZbUQaQNeWESwYdUwxUAT7wVoat64+xTadH6eFeUW2suxJkk9laZls+fNKhLTpss6coeX53+/CDqSMU6rC/MYbbIG/I/OS5IWi0I4EGd7PEAb/yLg5hGLrQawt5ivDFcl5nNWKhXQprO1YF2zUI97wazFkFwGHT1Gm0xJ1Q+ReBTROLJ3HkCyrj1OG2cfevP+aw/QE2YjH6GEtzzvORAJ2riajLfVrvBRLKZdjH5CW2LnSoX+6MWXgks44RCfbdrDVr7HzmmDeLTnSUj/FG+Ssx/6kK2q0fIAcs1tivTt8YSb/yav4Iy8E1xEZmtM4trtfs6kv0OyKiDmroisrTqC99n+gh6FEP+Xa3uZnxlLICSe3ohWT+UfFLcjZov1OMwdLGp8jdeLf2nxTMGBrpwOn39xVIoQO8jyu8midVN5QbfaH/7whz88H/8DV/8ZzX5g9hUAAAAASUVORK5CYII=',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '1844812067',
    content: [
      {
        type: 'text',
        text: '函数指针实现了所有三个闭包 trait（Fn、FnMut 和 FnOnce），',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '787673395',
    content: [
      {
        type: 'text',
        text:
          '所以总是可以在调用期望闭包的函数时传递函数指针作为参数。倾向于编写使用泛型和闭包 trait 的函数，这样它就能接受函数或闭包作为参数。',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '622811874',
    content: [
      {
        type: 'text',
        text:
          '一个只期望接受 fn 而不接受闭包的情况的例子是与不存在闭包的外部代码交互时：C 语言的函数可以接受函数作为参数，但 C 语言没有闭包。',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '622811874',
    content: [
      {
        type: 'text',
        text: '闭包表现为 trait，这意味着不能直接返回闭包。对于大部分需要返回 trait 的情况',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '622811874',
    content: [
      {
        type: 'text',
        text: '这段代码尝试直接返回闭包，它并不能编译',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '622811874',
    content: [
      {
        type: 'text',
        text:
          '我们讨论过了如何向函数传递闭包；也可以向函数传递常规函数！这在我们希望传递已经定义的函数而不是重新定义闭包作为参数时很有用..。',
      },
    ],
    timestamp: 1610977530419,
  },
  {
    id: '',
    senderId: '622811874',
    content: [
      {
        type: 'text',
        text: '接下来让我们学习宏！',
      },
    ],
    timestamp: 1610977530419,
  },
];
