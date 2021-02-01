import {
  FriendMessageEvent,
  FriendMessageRemoveEvent,
  GroupAdminChangeEvent,
  GroupAnonymousMessageEvent,
  GroupMemberAddEvent,
  GroupMemberBanEvent,
  GroupMemberRemoveEvent,
  GroupMemberUnbanEvent,
  GroupMessageEvent,
  GroupMessageRemoveEvent,
  StrangerMessageEvent,
} from './event-types';
import { WebSocketClient } from './websocket-client';

const client = new WebSocketClient('ws://localhost:9500/api/v1');

export default function subscribeEvents() {
  client
    .add<FriendMessageEvent>('friend/message', (e) => {})
    .add<StrangerMessageEvent>('stranger/message', (e) => {})
    .add<GroupMessageEvent>('group/message', (e) => {})
    .add<GroupAnonymousMessageEvent>('group/message/anonymous', (e) => {})
    .add<FriendMessageRemoveEvent>('friend/message/remove', (e) => {})
    .add<GroupMessageRemoveEvent>('group/message/remove', (e) => {})
    .add<GroupMemberRemoveEvent>('group/member/remove', (e) => {})
    .add<GroupMemberAddEvent>('group/member/add', (e) => {})
    .add<GroupMemberBanEvent>('group/member/ban', (e) => {})
    .add<GroupMemberUnbanEvent>('group/member/unban', (e) => {})
    .add<GroupAdminChangeEvent>('group/member/admin/add', (e) => {})
    .add<GroupAdminChangeEvent>('group/member/admin/remove', (e) => {});
}
