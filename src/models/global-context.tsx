import {
  CommonErr,
  Err,
  FriendInfo,
  getFriendInfos,
  getFriendMessages,
  getGroupInfos,
  getGroupMembers,
  getGroupMessages,
  getSessions,
  getStrangerMessages,
  getUserInfo,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  Message,
  Ok,
  PersonInfo,
  SessionInfo,
  SessionType,
} from 'api';
import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import MessageList from './message-list';
import AvatarDefaultIcon from 'images/avatar-default.png';
import { useConstant } from 'hooks';
import { useRxState, useRxValue } from 'hooks/use-rx';
import { lastItemOrDefault } from 'helpers/list-helpers';
import { useState } from 'react';
import { LanguageCode } from 'i18n';
import { IRxState, RxState, RxStateCluster } from 'hooks/rx-state';

export type ThemeType = 'theme-light' | 'theme-dark';
type GlobalContextType = {
  theme: IRxState<ThemeType>;
  culture: IRxState<LanguageCode>;
  userInfo: IRxState<PersonInfo>;
  selectedSessionIndex: IRxState<number>;
  sessionList: IRxState<SessionInfo[]>;
  contactList: IRxState<Array<FriendInfo | GroupInfo>>;
  messageListCluster: Map<IdType, MessageList>;
  groupMemberListCluster: RxStateCluster<IdType, GroupMemberInfo[]>;
};

const defaultUserInfo: PersonInfo = { id: '', name: '', avatar: AvatarDefaultIcon };

const GlobalContext = createContext<GlobalContextType>(undefined as any);

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

export function useTheme() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.theme);
}

export function useUserInfo() {
  const ctx = useContext(GlobalContext);
  return useRxValue(ctx.userInfo);
}

export function useSelectedSessionIndex() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.selectedSessionIndex);
}

export function useSessionList() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.sessionList);
}

export function useContactList() {
  const ctx = useContext(GlobalContext);
  return useRxValue(ctx.contactList);
}

export function useMessageList(sessionType: SessionType, contactId: IdType) {
  const ctx = useContext(GlobalContext);

  return useMemo(() => {
    const getPrevMessages = getGetMessages(sessionType);
    if (!ctx.messageListCluster.has(contactId)) {
      ctx.messageListCluster.set(
        contactId,
        new MessageList(async (startId, _, prev) =>
          prev ? await fallbackHttpApi(() => getPrevMessages(contactId, startId), []) : []
        )
      );
    }

    return ctx.messageListCluster.get(contactId)!;
  }, [contactId, ctx.messageListCluster, sessionType]);
}

export function useLastMessage(sessionType: SessionType, contactId: IdType) {
  const messageList = useMessageList(sessionType, contactId)!;
  const [lastMessage, setLastMessage] = useState<Message | null>(() =>
    lastItemOrDefault(messageList.storage.items)
  );
  useEffect(() => {
    const handler = () => setLastMessage(lastItemOrDefault(messageList.storage.items));
    const token = messageList.itemsChanged.subscribe(handler);
    return () => token.unsubscribe();
  }, [messageList]);

  return lastMessage;
}

export function useGroupMemberList(groupId: IdType) {
  const ctx = useContext(GlobalContext);
  return useRxValue(ctx.groupMemberListCluster.get(groupId));
}

// ********************************************************************
// Helper functions
// ********************************************************************

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

async function makeMutList<T>(immutList: Promise<ReadonlyArray<T>>): Promise<T[]> {
  const result = await immutList;
  return [...result];
}
