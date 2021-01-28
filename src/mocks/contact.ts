import { FriendInfo, GroupInfo, GroupMemberInfo, StrangerInfo } from '../api';
import { uuidv4 } from '../helpers';
import { getMockItems } from './common';

export function getFriends(count: number) {
  return getMockItems(FRIEND_LIST, count, (item, index) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export function getStrangers(count: number) {
  return getMockItems(STRANGER_LIST, count, (item, index) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export function getGroups(count: number) {
  return getMockItems(GROUP_LIST, count, (item, index) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export function getGroupMembers(count: number) {
  return getMockItems(GROUP_MEMBER_LIST, count, (item, index) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export const FRIEND_LIST: ReadonlyArray<FriendInfo> = [
  {
    id: '4561151515',
    name: '卧龙岗扯淡的人',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=787673395&s=640',
    remark: '张三',
    category: '',
  },
  {
    id: '456154512',
    name: '顶级手法',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    remark: '李狗蛋',
  },
  {
    id: '8654561561',
    name: 'Fuck Man',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=1844812067&s=640',
  },
];

export const STRANGER_LIST: ReadonlyArray<StrangerInfo> = [
  {
    id: '8654561561',
    name: 'Fuck Man',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=395700145&s=640',
    fromGroupId: '864651561',
  },
  {
    id: '4561151515',
    name: '卧龙岗扯淡的人',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=48615854&s=640',
    fromGroupId: '864651561',
  },
  {
    id: '456154512',
    name: '顶级手法',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640',
    fromGroupId: '864651561',
  },
];

export const GROUP_LIST: ReadonlyArray<GroupInfo> = [
  {
    id: '8654561561',
    name: '刀塔2代练',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=48615854&s=640',
    ownerId: '123123412',
    memberCount: 211,
    memberCapacity: 500,
  },
  {
    id: '8654561561',
    name: 'Rust编程从入门到放弃',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=456154552&s=640',
    ownerId: '123123412',
    memberCount: 1211,
    memberCapacity: 2000,
  },
  {
    id: '8654561561',
    name: '开车群',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=2344415111&s=640',
    ownerId: '123123412',
    memberCount: 11,
    memberCapacity: 200,
  },
];

export const GROUP_MEMBER_LIST: ReadonlyArray<GroupMemberInfo> = [
  {
    id: '8654561561',
    name: '狗管理',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=584564334&s=640',
    groupId: '1231231412',
    joinTime: 1611762780292,
    role: 'member',
  },
  {
    id: '431543543',
    name: '广告哥',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=324123234&s=640',
    groupId: '1231231412',
    joinTime: 1611762180292,
    role: 'member',
  },
  {
    id: '211432512',
    name: '都是我小号',
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=56233451&s=640',
    groupId: '1231414455',
    joinTime: 1611762740292,
    role: 'admin',
  },
];
