import axios, { AxiosRequestConfig } from 'axios';
import {
  FacePackage,
  FriendInfo,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  ImageMessageSegment,
  Message,
  PersonInfo,
  SessionInfo,
  StrangerInfo,
} from './basic-types';
import {
  Ok,
  Err,
  MessageBody,
  MessageResponse,
  LoginResponse,
  UploadFileResponse,
} from './http-types';
import { DEFAULT_LOCAL_VALUE, getValueFromLocalStorage, LOCAL_STORAGE_KEY } from './local-storage';

export type CommonErr = 'connection-timeout';

const client = axios.create({
  baseURL: `${getValueFromLocalStorage(
    LOCAL_STORAGE_KEY.HTTP_HOST,
    DEFAULT_LOCAL_VALUE.HTTP_HOST
  )}/api/v1`,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function get<TOk, TErr = CommonErr>(url: string) {
  const res = await client.get<Ok<TOk> | Err<TErr | CommonErr>>(url, getRequestConfig());
  return res.data;
}

async function post<TOk, TErr = CommonErr>(url: string, data?: any) {
  const res = await client.post<any, Ok<TOk> | Err<TErr | CommonErr>>(
    url,
    data,
    getRequestConfig()
  );
  return res;
}

function getRequestConfig(): AxiosRequestConfig | undefined {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.JWT_TOKEN);

  if (token) {
    const config: AxiosRequestConfig = {
      headers: { Authorization: token },
    };

    return config;
  }

  return undefined;
}

// ********************************************************
// Uncategorized Api
// ********************************************************

export async function getUserInfo() {
  return get<PersonInfo>('user');
}

export async function getSessions() {
  return get<ReadonlyArray<SessionInfo>>('sessions');
}

export function getFileUrl(id: string) {
  return `${getValueFromLocalStorage(
    LOCAL_STORAGE_KEY.HTTP_HOST,
    DEFAULT_LOCAL_VALUE.HTTP_HOST
  )}/api/v1/files/${id}`;
}

export async function uploadFile(file: File) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.JWT_TOKEN);
  const res = await client.post<File, Ok<UploadFileResponse> | Err<CommonErr>>('files', file, {
    headers: {
      Authorization: token || '',
      'Content-Type': file.type,
    },
  });
  return res;
}

export function getFacePackages() {
  return get<ReadonlyArray<FacePackage>>('faces');
}

export function getFacePackageById(id: IdType) {
  return get<ReadonlyArray<ImageMessageSegment>>(`faces/${id}`);
}

// ********************************************************
// Person Api
// ********************************************************

export async function getFriendInfo(id: IdType) {
  return get<FriendInfo>(`friends/${id}`);
}

export async function getFriendInfos() {
  return get<ReadonlyArray<FriendInfo>>('friends');
}

export async function getFriendMessage(id: IdType, messageId: IdType) {
  return get<Message>(`friends/${id}/messages/${messageId}`);
}

export async function getFriendMessages(id: IdType, startId?: IdType) {
  return get<ReadonlyArray<Message>>(
    `friends/${id}/messages${startId ? `?startId=${startId}` : ''}`
  );
}

export async function getStrangerInfo(id: IdType) {
  return get<StrangerInfo>(`strangers/${id}`);
}

export async function getStrangerMessage(id: IdType, messageId: IdType) {
  return get<Message>(`strangers/${id}/messages/${messageId}`);
}

export async function getStrangerMessages(id: IdType, startId?: IdType) {
  return get<ReadonlyArray<Message>>(
    `strangers/${id}/messages${startId ? `?startId=${startId}` : ''}`
  );
}

export async function sendMessageToFriend(id: IdType, message: MessageBody) {
  return post<MessageResponse>(`friends/${id}/messages`, message);
}

export async function sendMessageToStranger(id: IdType, message: MessageBody) {
  return post<MessageResponse>(`strangers/${id}/messages`, message);
}

// ********************************************************
// Group Api
// ********************************************************

export async function getGroupInfo(id: IdType) {
  return get<GroupInfo>(`groups/${id}`);
}

export async function getGroupInfos() {
  return get<ReadonlyArray<GroupInfo>>('groups');
}

export async function getGroupMember(id: IdType, memberId: IdType) {
  return get<GroupMemberInfo>(`groups/${id}/members/${memberId}`);
}

export async function getGroupMembers(id: IdType) {
  return get<ReadonlyArray<GroupMemberInfo>>(`groups/${id}/members`);
}

export async function getGroupMessage(id: IdType, messageId: IdType) {
  return get<Message>(`groups/${id}/messages/${messageId}`);
}

export async function getGroupMessages(id: IdType, startId?: IdType) {
  return get<ReadonlyArray<Message>>(
    `groups/${id}/messages${startId ? `?startId=${startId}` : ''}`
  );
}

export async function sendMessageToGroup(id: IdType, message: MessageBody) {
  return post<MessageResponse>(`groups/${id}/messages`, message);
}

// ***************************************************
// Authentication Api
// ***************************************************

/**
 * Login api.
 * @param account The acount.
 * @param password The password encrypted by MD5, rather than clear text.
 */
export async function login(account: string, password: string) {
  return post<LoginResponse>(`login`, { account, password });
}
