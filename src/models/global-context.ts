import { useConstant } from 'hooks';
import { IRxState, RxState } from 'hooks/rx-state';
import { useRxState } from 'hooks/use-rx';
import { LanguageCode } from 'i18n';
import { createContext, useContext } from 'react';

export type ThemeType = 'theme-light' | 'theme-dark';

export type GlobalContextType = {
  theme: IRxState<ThemeType>;
  culture: IRxState<LanguageCode>;
};

export const GlobalContext = createContext<GlobalContextType>(undefined as any);

// ********************************************************************
// Store
// ********************************************************************

export function useGlobalContextStore() {
  return useConstant<GlobalContextType>(() => ({
    theme: new RxState<ThemeType>('theme-dark'),
    culture: new RxState<LanguageCode>('zh-CN'),
  }));
}

// ********************************************************************
// Hooks
// ********************************************************************

export function useTheme() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.theme);
}

export function useCulture() {
  const ctx = useContext(GlobalContext);
  return useRxState(ctx.culture);
}
