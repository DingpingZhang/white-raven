import { IdType } from 'api';
import { useConstant } from 'hooks';
import { createContext, useContext } from 'react';
import { Subject } from 'rxjs';

type ImageEventType = {
  imageId: IdType;
};

type AtEventType = {
  targetId: IdType;
};

export type MessagesContextType = {
  imageLoaded: Subject<ImageEventType>;
  atClicked: Subject<AtEventType>;
};

export const MessagesContext = createContext<MessagesContextType>(undefined as any);

// ********************************************************************
// Store
// ********************************************************************

export function useMessagesContextStore() {
  return useConstant<MessagesContextType>(() => ({
    imageLoaded: new Subject<ImageEventType>(),
    atClicked: new Subject<AtEventType>(),
  }));
}

// ********************************************************************
// Hooks
// ********************************************************************

export function useImageLoaded() {
  const ctx = useContext(MessagesContext);
  return ctx.imageLoaded;
}

export function useAtClicked() {
  const ctx = useContext(MessagesContext);
  return ctx.atClicked;
}
