import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';

export type Navigate = (viewName: string, props: any) => void;
type Navigator = (switchName: string, viewName: string, props?: any) => void;

type SwitchHostContextType = {
  registerSwitch: (switchName: string, navigate: Navigate) => void;
  unregisterSwitch: (switchName: string) => void;
  navigate: Navigator;
};

export const SwitchHostContext = createContext<SwitchHostContextType>(undefined as any);

export function useNavigator<T extends string>(switchName: string) {
  const context = useContext(SwitchHostContext);
  return useCallback(
    (viewName: T, props?: any) => {
      context.navigate(switchName, viewName, props);
    },
    [context, switchName]
  );
}

export function SwitchHost({ children }: { children: ReactNode }) {
  const switchMap = useMemo(() => new Map<string, Navigate>(), []);
  const registerSwitch = useCallback(
    (switchName: string, navigate: Navigate) => {
      if (switchMap.has(switchName)) {
        throw new Error('The same switch name already exists.');
      }

      switchMap.set(switchName, navigate);
    },
    [switchMap]
  );
  const unregisterSwitch = useCallback((switchName: string) => switchMap.delete(switchName), [
    switchMap,
  ]);
  const navigate = useCallback(
    (switchName: string, viewName: string, props: any) => {
      const selectedNavigate = switchMap.get(switchName);
      if (!selectedNavigate) {
        throw new Error(`Not found the switch named ${switchName}.`);
      }

      selectedNavigate(viewName, props);
    },
    [switchMap]
  );

  return (
    <SwitchHostContext.Provider value={{ registerSwitch, unregisterSwitch, navigate }}>
      {children}
    </SwitchHostContext.Provider>
  );
}
