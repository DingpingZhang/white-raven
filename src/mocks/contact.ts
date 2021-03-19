import { FriendInfo, GroupInfo, GroupMemberInfo, StrangerInfo } from 'api';

export function getMockFriends(count: number) {
  return FRIEND_LIST.map(item => ({
    ...item,
    avatar: require(`./avatar/${Math.floor(Math.random() * 10)}.jpg`).default,
  }));
}

export function getMockStrangers(count: number) {
  return STRANGER_LIST.map(item => ({
    ...item,
    avatar: require(`./avatar/${Math.floor(Math.random() * 10)}.jpg`).default,
  }));
}

export function getMockGroups(count: number) {
  return GROUP_LIST.map(item => ({
    ...item,
    avatar: require(`./avatar/${Math.floor(Math.random() * 10)}.jpg`).default,
  }));
}

export function getMockGroupMembers(count: number) {
  return GROUP_MEMBER_LIST.map(item => ({
    ...item,
    avatar: require(`./avatar/${Math.floor(Math.random() * 10)}.jpg`).default,
  }));
}

export const FRIEND_LIST: ReadonlyArray<FriendInfo> = [
  {
    id: 'P0',
    name: '卧龙岗扯淡的人',
    avatar: '',
    remark: '张三',
    category: '',
  },
  {
    id: 'P1',
    name: '顶级手法',
    avatar: '',
    remark: '李狗蛋',
  },
  {
    id: 'P2',
    name: 'Hello World!',
    avatar: '',
  },
];

export const STRANGER_LIST: ReadonlyArray<StrangerInfo> = [
  {
    id: 'P3',
    name: '低级手法',
    avatar: '',
    fromGroupId: '864651561',
  },
  {
    id: 'P4',
    name: '来骗！来偷袭！',
    avatar: '',
    fromGroupId: '864651561',
  },
  {
    id: 'P5',
    name: '恭喜 OG',
    avatar: '',
    fromGroupId: '864651561',
  },
];

export const GROUP_LIST: ReadonlyArray<GroupInfo> = [
  {
    id: 'G0',
    name: '刀塔2代练',
    avatar: '',
    ownerId: '123123412',
    memberCount: 200,
    memberCapacity: 2000,
  },
  {
    id: 'G1',
    name: 'Rust编程从入门到放弃',
    avatar: '',
    ownerId: '123123412',
    memberCount: 200,
    memberCapacity: 500,
    description:
      'Rust是一门系统编程语言，专注于安全，尤其是并发安全，支持函数式和命令式以及泛型等编程范式的多范式语言。',
  },
  {
    id: 'G2',
    name: '开车群',
    avatar: '',
    ownerId: '123123412',
    memberCount: 200,
    memberCapacity: 200,
  },
];

export const GROUP_MEMBER_LIST: ReadonlyArray<GroupMemberInfo> = [
  {
    id: 'P6',
    name: '狗管理',
    avatar: '',
    groupId: '1231231412',
    joinTime: 1611762780292,
    role: 'member',
  },
  {
    id: 'P7',
    name: '广告哥',
    avatar: '',
    groupId: '1231231412',
    joinTime: 1611762180292,
    role: 'member',
  },
  {
    id: 'P8',
    name: '都是我小号',
    avatar: '',
    groupId: '1231414455',
    joinTime: 1611762740292,
    role: 'admin',
  },
];
