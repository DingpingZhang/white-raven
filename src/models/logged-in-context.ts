import {
  CommonErr,
  Err,
  FacePackage,
  FriendInfo,
  getFacePackageById,
  getFacePackages,
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
import { IRxState, RxState, RxStateCluster } from 'hooks/rx-state';
import { useConstant } from 'hooks';

export type FaceSet = ReadonlyArray<ImageMessageSegment>;

export type LoggedInContextType = {
  userInfo: IRxState<PersonInfo>;
  selectedSessionId: IRxState<IdType | null>;
  sessionList: IRxState<SessionInfo[]>;
  contactList: IRxState<Array<FriendInfo | GroupInfo>>;
  facePackages: IRxState<ReadonlyArray<FacePackage>>;
  messageListCluster: Map<IdType, MessageList>;
  groupMemberListCluster: RxStateCluster<IdType, GroupMemberInfo[]>;
  faceSetCluster: RxStateCluster<IdType, FaceSet>;
};

export const LoggedInContext = createContext<LoggedInContextType>(undefined as any);

// ********************************************************************
// Store
// ********************************************************************

const defaultUserInfo: PersonInfo = { id: '', name: '', avatar: '' };

export function useLoggedInContextStore() {
  return useConstant<LoggedInContextType>(() => {
    const { selectedSessionId, sessionList } = createSessionState();

    return {
      userInfo: new RxState<PersonInfo>(defaultUserInfo, async set => {
        const value = await fallbackHttpApi(getUserInfo, defaultUserInfo);
        set(value);
      }),
      selectedSessionId,
      sessionList,
      contactList: new RxState<Array<FriendInfo | GroupInfo>>([], async set => {
        const friends = await fallbackHttpApi(getFriendInfos, []);
        const groups = await fallbackHttpApi(getGroupInfos, []);
        set([...friends, ...groups]);
      }),
      facePackages: new RxState<ReadonlyArray<FacePackage>>([], async set => {
        const value = await fallbackHttpApi(getFacePackages, []);
        set(value);
      }),
      messageListCluster: new Map<IdType, MessageList>(),
      groupMemberListCluster: new RxStateCluster<IdType, GroupMemberInfo[]>(
        key =>
          new RxState<GroupMemberInfo[]>([], async set => {
            const value = await makeMutList(fallbackHttpApi(() => getGroupMembers(key), []));
            set(value);
          })
      ),
      faceSetCluster: new RxStateCluster<IdType, FaceSet>(
        key =>
          new RxState<FaceSet>([], async set => {
            const value = await fallbackHttpApi(() => getFacePackageById(key), []);
            set(value);
          })
      ),
    };
  });
}

function createSessionState() {
  // 声明字段
  const selectedSessionId = new RxState<IdType | null>(null);
  const sessionList = new RxState<SessionInfo[]>([], async set => {
    const value = await makeMutList(fallbackHttpApi(getSessions, []));
    set(value);
  });

  // 闭包变量
  let prevSelectedIndex = -1;

  // 构造依赖关系
  selectedSessionId.source.subscribe(nextValue => {
    prevSelectedIndex = sessionList.source.value.findIndex(item => item.contact.id === nextValue);
  });
  sessionList.source.subscribe(nextValue => {
    if (nextValue.length === 0) return;

    const selectedId = selectedSessionId.source.value;
    const selectedIndex = nextValue.findIndex(item => item.contact.id === selectedId);

    // session 被删除，或 selectedId 为 null.
    if (selectedIndex < 0) {
      if (prevSelectedIndex < 0) {
        prevSelectedIndex = 0;
      } else if (prevSelectedIndex >= nextValue.length) {
        prevSelectedIndex = nextValue.length - 1;
      }

      selectedSessionId.set(nextValue[prevSelectedIndex].contact.id);
    } else {
      prevSelectedIndex = selectedIndex;
    }
  });

  return { selectedSessionId, sessionList };
}

// ********************************************************************
// Hooks
// ********************************************************************

export function useFacePackages() {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.facePackages);
}

export function useFaceSet(id: IdType) {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.faceSetCluster.getOrCreate(id));
}

export function useUserInfo() {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.userInfo);
}

export function useSelectedSessionId() {
  const ctx = useContext(LoggedInContext);
  return useRxState(ctx.selectedSessionId);
}

export function useSessionList(): [
  SessionInfo[],
  React.Dispatch<React.SetStateAction<SessionInfo[]>>
] {
  const ctx = useContext(LoggedInContext);
  return useRxState(ctx.sessionList);
  // const [value, setValue] = useRxState(ctx.sessionList);
  // const { id } = useUserInfo();
  // return [useMemo(() => value.filter(session => session.contact.id !== id), [id, value]), setValue];
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
    const token = messageList.action.subscribe(handler);
    return () => token.unsubscribe();
  }, [messageList]);

  return lastMessage;
}

export function useGroupMemberList(groupId: IdType) {
  const ctx = useContext(LoggedInContext);
  return useRxValue(ctx.groupMemberListCluster.getOrCreate(groupId));
}

// ********************************************************************
// Helper functions
// ********************************************************************

async function makeMutList<T>(immutList: Promise<ReadonlyArray<T>>): Promise<T[]> {
  const result = await immutList;
  return [...result];
}

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
