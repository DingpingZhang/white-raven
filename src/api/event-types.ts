import { Message, IdType } from './basic-types';

// Base Types:

type GroupUnaryEventBase = {
  type: string;
  groupId: IdType;
  memberId: IdType;
  timestamp: number;
};

type GroupDualEventBase = GroupUnaryEventBase & {
  operatorId: IdType;
};

// **********************************************
// Messages
// **********************************************

// 1. Message Add (Push)

export type FriendMessageEvent = Message & {
  type: 'friend/message';
};

export type StrangerMessageEvent = Message & {
  type: 'stranger/message';
  fromGroupId: IdType;
};

export type GroupMessageEvent = Message & {
  type: 'group/message';
  groupId: IdType;
};

export type GroupAnonymousMessageEvent = Message & {
  type: 'group/message/anonymous';
  groupId: IdType;
  nickname: string;
  flag: string;
};

// 2. Message Remove (Recall)

export type FriendMessageRemoveEvent = {
  type: 'friend/message/remove';
  senderId: IdType;
  messageId: IdType;
  timestamp: number;
};

export type GroupMessageRemoveEvent = GroupDualEventBase & {
  type: 'group/message/remove';
  messageId: IdType;
};

export type MessageEvent =
  | FriendMessageEvent
  | StrangerMessageEvent
  | GroupMessageEvent
  | GroupAnonymousMessageEvent
  | FriendMessageRemoveEvent
  | GroupMemberRemoveEvent;

// **********************************************
// Group
// **********************************************

export type GroupMemberRemoveEvent = GroupDualEventBase & {
  type: 'group/member/remove';
  subType: 'leave' | 'kick' | 'kick-me';
};

export type GroupMemberAddEvent = GroupDualEventBase & {
  type: 'group/member/add';
  subType: 'approve' | 'invite';
};

export type GroupMemberBanEvent = GroupDualEventBase & {
  type: 'group/member/ban';
  timeSpan: number; // Time unit: second.
};

export type GroupMemberUnbanEvent = GroupDualEventBase & {
  type: 'group/member/unban';
};

export type GroupAdminChangeEvent = GroupUnaryEventBase & {
  type: 'group/member/admin/add' | 'group/member/admin/remove';
};

export type GroupMemberEvent =
  | GroupMemberRemoveEvent
  | GroupMemberAddEvent
  | GroupMemberBanEvent
  | GroupMemberUnbanEvent
  | GroupAdminChangeEvent;

// **********************************************
// Exports
// **********************************************

export type NotificationEvent = MessageEvent | GroupMemberEvent;
