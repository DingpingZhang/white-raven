import { ReactNode } from 'react';
import { GlobalContext, useGlobalContextStore } from './global-context';
import { LoggedInContext, useLoggedInContextStore } from './logged-in-context';
import { MessagesContext, useMessagesContextStore } from './messages-context';

export function GlobalContextRoot({ children }: { children: ReactNode }) {
  const store = useGlobalContextStore();

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}

export function LoggedInContextRoot({ children }: { children: ReactNode }) {
  const store = useLoggedInContextStore();

  return <LoggedInContext.Provider value={store}>{children}</LoggedInContext.Provider>;
}

export function MessagesContextRoot({ children }: { children: ReactNode }) {
  const store = useMessagesContextStore();

  return <MessagesContext.Provider value={store}>{children}</MessagesContext.Provider>;
}
