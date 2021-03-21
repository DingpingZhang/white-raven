import { ReactNode } from 'react';
import { GlobalContext, useGlobalContextStore } from './global-context';
import { LoggedInContext, useLoggedInContextStore } from './logged-in-context';
import { ChatContext, useChatContextStore } from './chat-context';

export function GlobalContextRoot({ children }: { children: ReactNode }) {
  const store = useGlobalContextStore();

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}

export function LoggedInContextRoot({ children }: { children: ReactNode }) {
  const store = useLoggedInContextStore();

  return <LoggedInContext.Provider value={store}>{children}</LoggedInContext.Provider>;
}

export function ChatContextRoot({ children }: { children: ReactNode }) {
  const store = useChatContextStore();

  return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
}
