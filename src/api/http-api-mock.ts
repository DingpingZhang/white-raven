import axios from 'axios';
import { Session } from 'inspector';
import { getMessages } from '../mocks/message';
import {
  Err,
  FriendInfo,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  MessageBody,
  MessageResponse,
  Ok,
  PersonInfo,
  StrangerInfo,
} from './basic-types';

type CommonErr = 'connection-timeout';

const client = axios.create({
  baseURL: 'http://localhost:9000/api/v1',
  timeout: 100_000,
});

async function get<TOk, TErr = CommonErr>(url: string) {
  const res = await client.get<Ok<TOk> | Err<TErr | CommonErr>>(url);
  return res.data;
}

async function post<TOk, TErr = CommonErr>(url: string, data?: any) {
  const res = await client.post<Ok<TOk> | Err<TErr | CommonErr>>(url, data);
  return res.data;
}

export function getMockResult<T>(result: T): Ok<T> | Err<CommonErr> {
  return {
    code: 200,
    content: result,
  };
}

// ********************************************************
// 0. Uncategorized Api
// ********************************************************

export async function getUserInfo() {
  return get<PersonInfo>('user/self');
}

export async function getSessions() {
  return get<ReadonlyArray<Session>>('session/items');
}

// ********************************************************
// 1. Person Api
// ********************************************************

export async function getFriendInfo(id: IdType) {
  return get<FriendInfo>(`friend/${id}`);
}

export async function getFriendInfos() {
  return get<ReadonlyArray<FriendInfo>>('friend/items');
}

export async function getFriendMessage(id: IdType, messageId: IdType) {
  return getMockResult(getMessages(1)[0]);
}

export async function getFriendMessages(id: IdType, startId?: IdType) {
  return getMockResult(getMessages(20));
}

export async function getStrangerInfo(id: IdType) {
  return get<StrangerInfo>(`stranger/${id}`);
}

export async function getStrangerMessage(id: IdType, messageId: IdType) {
  return getMockResult(getMessages(1)[0]);
}

export async function getStrangerMessages(id: IdType, startId?: IdType) {
  return getMockResult(getMessages(20));
}

export async function sendMessageToFriend(id: IdType, message: MessageBody) {
  return post<MessageResponse>(`friend/${id}/message`, message);
}

export async function sendMessageToStranger(id: IdType, message: MessageBody) {
  return post<MessageResponse>(`stranger/${id}/message`, message);
}

// ********************************************************
// 2. Group Api
// ********************************************************

export async function getGroupInfo(id: IdType) {
  return get<GroupInfo>(`group/${id}`);
}

export async function getGroupInfos() {
  return get<ReadonlyArray<GroupInfo>>('group/items');
}

export async function getGroupMember(id: IdType, memberId: IdType) {
  return get<GroupMemberInfo>(`group/${id}/member/${memberId}`);
}

export async function getGroupMembers(id: IdType) {
  return get<ReadonlyArray<GroupMemberInfo>>(`group/${id}/member/items`);
}

export async function getGroupMessage(id: IdType, messageId: IdType) {
  return getMockResult(getMessages(1)[0]);
}

export async function getGroupMessages(id: IdType, startId?: IdType) {
  return getMockResult(getMessages(20));
}

export async function sendMessageToGroup(id: IdType, message: MessageBody) {
  return post<MessageResponse>(`group/${id}/message`, message);
}
