import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { IRxState } from './rx-state';

export function useRxValue<T>(state: IRxState<T>): T {
  const [innerValue, setInnerValue] = useState<T>(state.source.value);
  useEffect(() => {
    const token = state.source.subscribe((next) => setInnerValue(next));
    return () => token.unsubscribe();
  }, [state]);

  return innerValue;
}

export function useRxState<T>(state: IRxState<T>): [T, Dispatch<SetStateAction<T>>] {
  return [useRxValue(state), state.set];
}
