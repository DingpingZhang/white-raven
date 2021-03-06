import {
  FriendInfo,
  getFriendInfos,
  getGroupInfos,
  getGroupMembers,
  getSessions,
  getUserInfo,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  PersonInfo,
  SessionInfo,
} from 'api';
import { ReactNode } from 'react';
import MessageList from './message-list';
import AvatarDefaultIcon from 'images/avatar-default.png';
import { useConstant } from 'hooks';
import { LanguageCode } from 'i18n';
import { RxState, RxStateCluster } from 'hooks/rx-state';
import { ThemeType, fallbackHttpApi, GlobalContext, GlobalContextType } from './store';

const defaultUserInfo: PersonInfo = { id: '', name: '', avatar: AvatarDefaultIcon };

export default function GlobalContextRoot({ children }: { children: ReactNode }) {
  const store = useConstant<GlobalContextType>(() => ({
    theme: new RxState<ThemeType>('theme-dark'),
    culture: new RxState<LanguageCode>('zh-CN'),
    userInfo: new RxState<PersonInfo>(defaultUserInfo, async (set) => {
      const value = await fallbackHttpApi(getUserInfo, defaultUserInfo);
      set(value);
    }),
    selectedSessionIndex: new RxState<number>(0),
    sessionList: new RxState<SessionInfo[]>([], async (set) => {
      const value = await makeMutList(fallbackHttpApi(getSessions, []));
      set(value);
    }),
    contactList: new RxState<Array<FriendInfo | GroupInfo>>([], async (set) => {
      const friends = await fallbackHttpApi(getFriendInfos, []);
      const groups = await fallbackHttpApi(getGroupInfos, []);
      set([...friends, ...groups]);
    }),
    messageListCluster: new Map<IdType, MessageList>(),
    groupMemberListCluster: new RxStateCluster<IdType, GroupMemberInfo[]>(
      (key) =>
        new RxState<GroupMemberInfo[]>([], async (set) => {
          const value = await makeMutList(fallbackHttpApi(() => getGroupMembers(key), []));
          set(value);
        })
    ),
  }));

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}

async function makeMutList<T>(immutList: Promise<ReadonlyArray<T>>): Promise<T[]> {
  const result = await immutList;
  return [...result];
}
