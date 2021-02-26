import {
  Err,
  FriendInfo,
  getFriendInfos,
  getGroupInfos,
  getGroupMembers,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  Ok,
  PersonInfo,
  SessionInfo,
} from 'api';
import { CommonErr } from 'api/http-api';
import { atom, atomFamily } from 'recoil';
import AvatarDefaultIcon from 'images/avatar-default.png';

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

export const DEFAULT_USER_INFO: PersonInfo = { id: '', name: '', avatar: AvatarDefaultIcon };

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
