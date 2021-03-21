import { FriendInfo, GroupInfo, GroupMemberInfo, IdType, SessionType } from 'api';
import { useConstant } from 'hooks';
import { createContext, useCallback, useContext } from 'react';
import { Subject } from 'rxjs';

type ImageEventType = {
  imageId: IdType;
};

type AtEventType = {
  targetId: IdType;
};

export type GetContactById = (id: IdType) => GroupMemberInfo | FriendInfo | GroupInfo | undefined;

export type ChatContextType = {
  sessionType: SessionType;
  contactId: IdType;
  imageLoaded: Subject<ImageEventType>;
  atClicked: Subject<AtEventType>;
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
  return useConstant<ChatContextType>(() => ({
    sessionType,
    contactId,
    imageLoaded: new Subject<ImageEventType>(),
    atClicked: new Subject<AtEventType>(),
    getContactById,
  }));
}

// ********************************************************************
// Hooks
// ********************************************************************

export function useImageLoaded() {
  const ctx = useContext(ChatContext);
  return ctx.imageLoaded;
}

export function useAtClicked() {
  const ctx = useContext(ChatContext);
  return ctx.atClicked;
}

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
