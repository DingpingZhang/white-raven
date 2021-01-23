import { SessionSummary } from '../models/contact';
import { MESSAGE_LIST } from './message-list';

export const CONTACT_LIST: SessionSummary[] = [
  {
    unreadCount: 1,
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    title: 'Fuck the word',
    subtitle: MESSAGE_LIST[MESSAGE_LIST.length - 1].content,
    lastActivityTimestamp: 1611405872525,
  },
  {
    unreadCount: 1,
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=787673395&s=640',
    title: 'Jack Sparrow',
    subtitle: MESSAGE_LIST[1].content,
    lastActivityTimestamp: 1611405812525,
  },
  {
    unreadCount: 0,
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    title: 'Jack Sparrow',
    subtitle: MESSAGE_LIST[2].content,
    lastActivityTimestamp: 1611405872525,
  },
  {
    unreadCount: 1,
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=1844812067&s=640',
    title: '昵称什么的能吃么',
    subtitle: MESSAGE_LIST[0].content,
    lastActivityTimestamp: 1611405872525,
  },
  {
    unreadCount: 0,
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    title: 'Jack Sparrow',
    subtitle: MESSAGE_LIST[3].content,
    lastActivityTimestamp: 1611405872525,
  },
  {
    unreadCount: 0,
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    title: 'Jack Sparrow',
    subtitle: MESSAGE_LIST[4].content,
    lastActivityTimestamp: 1611405872525,
  },
];
