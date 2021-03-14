import {
  CommonErr,
  Err,
  FacePackage,
  FriendInfo,
  getFriendMessages,
  getGroupMessages,
  getStrangerMessages,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  ImageMessageSegment,
  Message,
  Ok,
  PersonInfo,
  SessionInfo,
  SessionType,
} from 'api';
import { createContext, useContext, useEffect, useMemo } from 'react';
import MessageList from './message-list';
import { useRxState, useRxValue } from 'hooks/use-rx';
import { lastItemOrDefault } from 'helpers/list-helpers';
import { useState } from 'react';
import { LanguageCode } from 'i18n';
import { IRxState, RxStateCluster } from 'hooks/rx-state';

export type ThemeType = 'theme-light' | 'theme-dark';

export type GlobalContextType = {
  theme: IRxState<ThemeType>;
  culture: IRxState<LanguageCode>;
};

export type FaceSet = ReadonlyArray<ImageMessageSegment>;

export type LoggedInContextType = {
  userInfo: IRxState<PersonInfo>;
  selectedSessionIndex: IRxState<number>;
  sessionList: IRxState<SessionInfo[]>;
  contactList: IRxState<Array<FriendInfo | GroupInfo>>;
  facePackages: IRxState<ReadonlyArray<FacePackage>>;
  messageListCluster: Map<IdType, MessageList>;
  groupMemberListCluster: RxStateCluster<IdType, GroupMemberInfo[]>;
  faceSetCluster: RxStateCluster<IdType, FaceSet>;
};

export const GlobalContext = createContext<GlobalContextType>(undefined as any);

export const LoggedInContext = createContext<LoggedInContextType>(undefined as any);

export function useTheme() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.theme);
}

export function useCulture() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.culture);
}

export function useFacePackages() {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.facePackages);
}

export function useFaceSet(id: IdType) {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.faceSetCluster.get(id));
}

export function useUserInfo() {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.userInfo);
}

export function useSelectedSessionIndex() {
  const ctx = useContext(LoggedInContext);
  return useRxState(ctx.selectedSessionIndex);
}

export function useSessionList() {
  const ctx = useContext(LoggedInContext);
  return useRxState(ctx.sessionList);
}

export function useContactList() {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.contactList);
}

export function useMessageList(sessionType: SessionType, contactId: IdType) {
  const ctx = useContext(LoggedInContext);

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
  const ctx = useContext(LoggedInContext);
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
