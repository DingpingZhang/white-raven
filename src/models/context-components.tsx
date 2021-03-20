import { ReactNode } from 'react';
import { GlobalContext, useGlobalContextStore } from './global-context';
import { useLoggedInContextStore, LoggedInContext } from './logged-in-context';

export function GlobalContextRoot({ children }: { children: ReactNode }) {
  const store = useGlobalContextStore();

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}

export function LoggedInContextRoot({ children }: { children: ReactNode }) {
  const store = useLoggedInContextStore();

  return <LoggedInContext.Provider value={store}>{children}</LoggedInContext.Provider>;
}
