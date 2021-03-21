import { IdType, SessionType } from 'api';
import { useConstant } from 'hooks';
import { createContext, useContext } from 'react';
import { Subject } from 'rxjs';

type ImageEventType = {
  imageId: IdType;
};

type AtEventType = {
  targetId: IdType;
};

export type ChatContextType = {
  sessionType: SessionType;
  contactId: IdType;
  imageLoaded: Subject<ImageEventType>;
  atClicked: Subject<AtEventType>;
};

export const ChatContext = createContext<ChatContextType>(undefined as any);

// ********************************************************************
// Store
// ********************************************************************

export function useChatContextStore(sessionType: SessionType, contactId: IdType) {
  return useConstant<ChatContextType>(() => ({
    sessionType,
    contactId,
    imageLoaded: new Subject<ImageEventType>(),
    atClicked: new Subject<AtEventType>(),
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
