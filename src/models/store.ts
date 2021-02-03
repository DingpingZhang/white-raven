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
  Message,
  Ok,
  PersonInfo,
  StrangerInfo,
} from 'api';
import { CommonErr } from 'api/http-api';
import { atom, atomFamily, selector, selectorFamily } from 'recoil';

export async function fallbackHttpApi<TOk, TErr = CommonErr>(
  api: () => Promise<Ok<TOk> | Err<TErr>>,
  fallbackValue: TOk
): Promise<TOk> {
  const response = await api();
  if (response.code === 200) {
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

export type FriendSessionItem = {
  type: 'friend';
  contact: FriendInfo;
  unreadCount: number;
};

export type StrangerSessionItem = {
  type: 'stranger';
  contact: StrangerInfo;
  unreadCount: number;
};

export type GroupSessionItem = {
  type: 'group';
  contact: GroupInfo;
  unreadCount: number;
};

export type SessionItem = FriendSessionItem | StrangerSessionItem | GroupSessionItem;

export const sessionListState = atom<SessionItem[]>({
  key: 'sessionListState',
  default: [],
});

export const selectedSessionState = atom<SessionItem | null>({
  key: 'selectedSessionState',
  default: selector({
    key: 'selectedSessionState/default',
    get: async ({ get }) => {
      const list = get(sessionListState);
      return list.length > 0 ? list[0] : null;
    },
  }),
});

export const lastSessionMessageState = selectorFamily<Message | null, SessionKey>({
  key: 'lastSessionMessageState',
  get: (key) => ({ get }) => {
    const messages = get(messageListState(key));
    return messages.length > 0 ? messages[messages.length - 1] : null;
  },
});

export const messageListState = atomFamily<Message[], SessionKey>({
  key: 'messageListState',
  default: ({ type, contactId }) =>
    makeMutList(
      fallbackHttpApi(() => {
        switch (type) {
          case 'friend':
            return getFriendMessages(contactId);
          case 'stranger':
            return getStrangerMessages(contactId);
          case 'group':
            return getGroupMessages(contactId);
        }
      }, [])
    ),
});

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
