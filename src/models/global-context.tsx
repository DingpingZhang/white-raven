import { ReactNode } from 'react';
import { useConstant } from 'hooks';
import { LanguageCode } from 'i18n';
import { RxState } from 'hooks/rx-state';
import { ThemeType, GlobalContext, GlobalContextType } from './store';

export default function GlobalContextRoot({ children }: { children: ReactNode }) {
  const store = useConstant<GlobalContextType>(() => ({
    theme: new RxState<ThemeType>('theme-dark'),
    culture: new RxState<LanguageCode>('zh-CN'),
  }));

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
}
