import { FriendInfo, GroupInfo, GroupMemberInfo, StrangerInfo } from 'api';
import { uuidv4 } from 'helpers';
import { getMockItems } from './common';

export function getMockFriends(count: number) {
  return getMockItems(FRIEND_LIST, count, (item) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export function getMockStrangers(count: number) {
  return getMockItems(STRANGER_LIST, count, (item) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export function getMockGroups(count: number) {
  return getMockItems(GROUP_LIST, count, (item) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export function getMockGroupMembers(count: number) {
  return getMockItems(GROUP_MEMBER_LIST, count, (item) => ({
    ...item,
    id: `${uuidv4()}`,
  }));
}

export const FRIEND_LIST: ReadonlyArray<FriendInfo> = [
  {
    id: '4561151515',
    name: '卧龙岗扯淡的人',
    avatar: 'http://image.example.com/987654321',
    remark: '张三',
    category: '',
  },
  {
    id: '456154512',
    name: '顶级手法',
    avatar: 'http://image.example.com/123456789',
    remark: '李狗蛋',
  },
  {
    id: '8654561561',
    name: 'Fuck Man',
    avatar: 'http://image.example.com/123456789',
  },
];

export const STRANGER_LIST: ReadonlyArray<StrangerInfo> = [
  {
    id: '8654561561',
    name: 'Fuck Man',
    avatar: 'http://image.example.com/395700145',
    fromGroupId: '864651561',
  },
  {
    id: '4561151515',
    name: '卧龙岗扯淡的人',
    avatar: 'http://image.example.com/48615854',
    fromGroupId: '864651561',
  },
  {
    id: '456154512',
    name: '顶级手法',
    avatar: 'http://image.example.com/123456789',
    fromGroupId: '864651561',
  },
];

export const GROUP_LIST: ReadonlyArray<GroupInfo> = [
  {
    id: '8654561561',
    name: '刀塔2代练',
    avatar: 'http://image.example.com/48615854',
    ownerId: '123123412',
    memberCount: 200,
    memberCapacity: 2000,
  },
  {
    id: '8654561561',
    name: 'Rust编程从入门到放弃',
    avatar: 'http://image.example.com/456154552',
    ownerId: '123123412',
    memberCount: 200,
    memberCapacity: 500,
    description:
      '的身份缓解缓解夫人维护，返回未婚夫i我会热防护五欸。嘿嘿人法规二位好i共和五日工会；额给红日u额外忽然贵和五日u给会额，外然后贵哦二万户日。',
  },
  {
    id: '8654561561',
    name: '开车群',
    avatar: 'http://image.example.com/2344415111',
    ownerId: '123123412',
    memberCount: 200,
    memberCapacity: 200,
  },
];

export const GROUP_MEMBER_LIST: ReadonlyArray<GroupMemberInfo> = [
  {
    id: '8654561561',
    name: '狗管理',
    avatar: 'http://image.example.com/395700145',
    groupId: '1231231412',
    joinTime: 1611762780292,
    role: 'member',
  },
  {
    id: '431543543',
    name: '广告哥',
    avatar: 'http://image.example.com/324123234',
    groupId: '1231231412',
    joinTime: 1611762180292,
    role: 'member',
  },
  {
    id: '211432512',
    name: '都是我小号',
    avatar: 'http://image.example.com/56233451',
    groupId: '1231414455',
    joinTime: 1611762740292,
    role: 'admin',
  },
];
