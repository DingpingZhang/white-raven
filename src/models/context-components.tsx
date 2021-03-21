import { ReactNode } from 'react';
import { GlobalContext, useGlobalContextStore } from './global-context';
import { LoggedInContext, useLoggedInContextStore } from './logged-in-context';
import { ChatContext, GetContactById, useChatContextStore } from './chat-context';
import { SessionType, IdType } from 'api';

type ChildrenProps = {
  children: ReactNode;
};
type ChatContextRootProps = ChildrenProps & {
  sessionType: SessionType;
  contactId: IdType;
  getContactById: GetContactById;
};

export function GlobalContextRoot({ children }: ChildrenProps) {
  const store = useGlobalContextStore();

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}

export function LoggedInContextRoot({ children }: ChildrenProps) {
  const store = useLoggedInContextStore();

  return <LoggedInContext.Provider value={store}>{children}</LoggedInContext.Provider>;
}

export function ChatContextRoot({
  children,
  sessionType,
  contactId,
  getContactById,
}: ChatContextRootProps) {
  const store = useChatContextStore(sessionType, contactId, getContactById);

  return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
}
