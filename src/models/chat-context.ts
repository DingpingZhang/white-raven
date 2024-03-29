import { FriendInfo, GroupInfo, GroupMemberInfo, IdType, SessionType } from 'api';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { Subject } from 'rxjs';

type ImageEventType = {
  imageId: IdType;
};

type MarkupEventType = {
  markup: string;
  content: string;
};

export type GetContactById = (id: IdType) => GroupMemberInfo | FriendInfo | GroupInfo | undefined;

export type ChatContextType = {
  sessionType: SessionType;
  contactId: IdType;
  imageLoaded: Subject<ImageEventType>;
  markupAdded: Subject<MarkupEventType>;
  getContactById: GetContactById;
};

export const ChatContext = createContext<ChatContextType>(undefined as any);

// ********************************************************************
// Store
// ********************************************************************

export function useChatContextStore(
  sessionType: SessionType,
  contactId: IdType,
  getContactById: GetContactById
) {
  return useMemo<ChatContextType>(() => {
    return {
      sessionType,
      contactId,
      imageLoaded: new Subject<ImageEventType>(),
      markupAdded: new Subject<MarkupEventType>(),
      getContactById,
    };
  }, [contactId, getContactById, sessionType]);
}

// ********************************************************************
// Hooks
// ********************************************************************

export function useGetContactName() {
  const { getContactById } = useContext(ChatContext);
  return useCallback(
    (id: IdType) => {
      const contact = getContactById(id);
      // FIXME: Don't use any.
      return contact ? ((contact as any).remark as string) || contact.name : id;
    },
    [getContactById]
  );
}

export function useSenderInfo(senderId: IdType | undefined) {
  const { sessionType } = useContext(ChatContext);
  const { getContactById } = useContext(ChatContext);
  const getContactName = useGetContactName();

  const avatar = useMemo(() => {
    if (!senderId) {
      return undefined;
    }

    const contact = getContactById(senderId);
    return contact ? contact.avatar : undefined;
  }, [getContactById, senderId]);
  const name = useMemo(
    () => (sessionType === 'group' && senderId ? getContactName(senderId) : undefined),
    [sessionType, getContactName, senderId]
  );

  return { avatar, name };
}
