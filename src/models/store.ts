import {
  Err,
  FriendInfo,
  getFriendInfos,
  getFriendMessages,
  getGroupInfos,
  getGroupMembers,
  getGroupMessages,
  getStrangerMessages,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  Ok,
  PersonInfo,
  SessionInfo,
} from 'api';
import { CommonErr } from 'api/http-api';
import { atom, atomFamily } from 'recoil';
import MessageList from './message-list';

export async function fallbackHttpApi<TOk, TErr = CommonErr>(
  api: () => Promise<Ok<TOk> | Err<TErr>>,
  fallbackValue: TOk
): Promise<TOk> {
  const response = await api();
  if (response.code === 200 && response.content) {
    return response.content;
  }

  return fallbackValue;
}

export async function makeMutList<T>(immutList: Promise<ReadonlyArray<T>>): Promise<T[]> {
  const result = await immutList;
  return [...result];
}

export const DEFAULT_USER_INFO: PersonInfo = { id: '', name: '', avatar: '' };

export const userInfoState = atom<PersonInfo>({
  key: 'userInfoState',
  default: DEFAULT_USER_INFO,
});

export type SessionKey = {
  type: 'friend' | 'stranger' | 'group';
  contactId: IdType;
};

export const sessionListState = atom<SessionInfo[]>({
  key: 'sessionListState',
  default: [],
});

export const selectedSessionIndexState = atom({
  key: 'selectedSessionIndexState',
  default: 0,
});

export const messageListState = atomFamily<MessageList, SessionKey>({
  key: 'messageListState',
  default: ({ type, contactId }) => {
    const getPrevMessages = getGetMessages(type);
    const result = new MessageList(async (stardId, _, previous) =>
      previous ? await fallbackHttpApi(() => getPrevMessages(contactId, stardId), []) : []
    );
    console.log(result);
    return result;
  },
});

function getGetMessages(type: 'friend' | 'stranger' | 'group') {
  switch (type) {
    case 'friend':
      return getFriendMessages;
    case 'stranger':
      return getStrangerMessages;
    case 'group':
      return getGroupMessages;
  }
}

export const contactListState = atom<Array<FriendInfo | GroupInfo>>({
  key: 'contactListState',
  default: (async () => {
    const friends = await fallbackHttpApi(getFriendInfos, []);
    const groups = await fallbackHttpApi(getGroupInfos, []);

    return [...friends, ...groups];
  })(),
});

export const groupMemberListState = atomFamily<GroupMemberInfo[], IdType>({
  key: 'groupMemberListState',
  default: async (groupId) => makeMutList(fallbackHttpApi(() => getGroupMembers(groupId), [])),
});
