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
import { BehaviorSubject } from 'rxjs';
import { useRxState } from 'hooks/use-rx';
import { lastItemOrDefault } from 'helpers/list-helpers';
import { useState } from 'react';
import { LanguageCode } from 'i18n';

export type ThemeType = 'theme-light' | 'theme-dark';
type GlobalContextType = {
  theme: BehaviorSubject<ThemeType>;
  culture: BehaviorSubject<LanguageCode>;
  userInfo: BehaviorSubject<PersonInfo>;
  selectedSessionIndex: BehaviorSubject<number>;
  sessionList: BehaviorSubject<SessionInfo[]>;
  contactList: BehaviorSubject<Array<FriendInfo | GroupInfo>>;
  messageListStore: Map<IdType, MessageList>;
  groupMemberListStore: Map<IdType, BehaviorSubject<GroupMemberInfo[]>>;
};

const defaultUserInfo: PersonInfo = { id: '', name: '', avatar: AvatarDefaultIcon };

const GlobalContext = createContext<GlobalContextType>(undefined as any);

export default function GlobalContextRoot({ children }: { children: ReactNode }) {
  const store = useConstant<GlobalContextType>(() => ({
    theme: new BehaviorSubject<ThemeType>('theme-dark'),
    culture: new BehaviorSubject<LanguageCode>('zh-CN'),
    userInfo: new BehaviorSubject<PersonInfo>(defaultUserInfo),
    selectedSessionIndex: new BehaviorSubject<number>(0),
    sessionList: new BehaviorSubject<SessionInfo[]>([]),
    contactList: new BehaviorSubject<Array<FriendInfo | GroupInfo>>([]),
    messageListStore: new Map<IdType, MessageList>(),
    groupMemberListStore: new Map<IdType, BehaviorSubject<GroupMemberInfo[]>>(),
  }));

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.theme, 'theme-dark');
}

export function useUserInfo() {
  const ctx = useContext(GlobalContext);
  const [value, setValue] = useRxState(ctx.userInfo, defaultUserInfo);
  useEffect(() => {
    const fetch = async () => setValue(await fallbackHttpApi(getUserInfo, defaultUserInfo));

    fetch();
  }, [setValue]);

  return value;
}

export function useSelectedSessionIndex() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.selectedSessionIndex, 0);
}

export function useSessionList(): [
  SessionInfo[],
  React.Dispatch<React.SetStateAction<SessionInfo[]>>
] {
  const ctx = useContext(GlobalContext);
  const [value, setValue] = useRxState(ctx.sessionList, []);
  useEffect(() => {
    const fetch = async () => setValue(await makeMutList(fallbackHttpApi(getSessions, [])));

    fetch();
  }, [setValue]);

  return [value, setValue];
}

export function useContactList() {
  const ctx = useContext(GlobalContext);
  const [value, setValue] = useRxState(ctx.contactList, []);
  useEffect(() => {
    const fetch = async () => {
      const friends = await fallbackHttpApi(getFriendInfos, []);
      const groups = await fallbackHttpApi(getGroupInfos, []);

      setValue([...friends, ...groups]);
    };

    fetch();
  }, [setValue]);

  return value;
}

export function useMessageList(sessionType: SessionType, contactId: IdType) {
  const ctx = useContext(GlobalContext);

  return useMemo(() => {
    const getPrevMessages = getGetMessages(sessionType);
    if (!ctx.messageListStore.has(contactId)) {
      ctx.messageListStore.set(
        contactId,
        new MessageList(async (startId, _, prev) =>
          prev ? await fallbackHttpApi(() => getPrevMessages(contactId, startId), []) : []
        )
      );
    }

    return ctx.messageListStore.get(contactId)!;
  }, [contactId, ctx.messageListStore, sessionType]);
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
  const groupMemberListState = useMemo(() => {
    if (!ctx.groupMemberListStore.has(groupId)) {
      ctx.groupMemberListStore.set(groupId, new BehaviorSubject<GroupMemberInfo[]>([]));
    }

    return ctx.groupMemberListStore.get(groupId)!;
  }, [ctx.groupMemberListStore, groupId]);

  const [value, setValue] = useRxState(groupMemberListState, []);
  useEffect(() => {
    const fetch = async () =>
      setValue(await makeMutList(fallbackHttpApi(() => getGroupMembers(groupId), [])));

    fetch();
  }, [groupId, setValue]);

  return value;
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
