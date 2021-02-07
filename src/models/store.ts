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
  SessionInfo,
  StrangerInfo,
} from 'api';
import { CommonErr } from 'api/http-api';
import { atom, atomFamily, selectorFamily } from 'recoil';

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
