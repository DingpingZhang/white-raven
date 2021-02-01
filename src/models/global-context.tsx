import { getUserInfo, PersonInfo } from 'api';
import { useHttpApi } from 'hooks/use-api';
import { createContext, ReactNode } from 'react';

export type GlobalContextType = PersonInfo;

export const GlobalContext = createContext<GlobalContextType>(undefined as any);

const DEFAULT_CONTEXT: GlobalContextType = {
  id: '',
  name: '',
  avatar: '',
};

type Props = {
  children: ReactNode;
};

export function GlobalContextRoot({ children }: Props) {
  const ctx = useHttpApi(getUserInfo, DEFAULT_CONTEXT);

  return <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>;
}
