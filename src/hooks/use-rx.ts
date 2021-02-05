import { useState, useEffect, Dispatch, SetStateAction, useRef, useCallback } from 'react';
import { Observable, Subject } from 'rxjs';

export function useRxValue<T>(observable: Observable<T>, initialValue: T): T;
export function useRxValue<T>(observable: Observable<T>): T | undefined;
export function useRxValue<T>(observable: any, initialValue?: any) {
  const [innerValue, setInnerValue] = useState<T | undefined>(initialValue);
  useEffect(() => {
    const token = observable.subscribe((next: T | undefined) => setInnerValue(next));
    return () => {
      if (!token.closed) {
        token.unsubscribe();
      }
    };
  }, [observable]);

  return innerValue;
}

export function useSetRxState<T>(
  observer: { next: (value?: T) => void },
  initialValue: T
): Dispatch<SetStateAction<T>>;
export function useSetRxState<T>(observer: {
  next: (value?: T) => void;
}): Dispatch<SetStateAction<T | undefined>>;
export function useSetRxState<T>(observer: any, initialValue?: any): any {
  const prevValue = useRef<T | undefined>(initialValue);
  const setValue = useCallback(
    (action: SetStateAction<T | undefined>) => {
      const v = isFunction(action) ? action(prevValue.current) : action;
      observer.next(v);
      prevValue.current = v;
    },
    [observer]
  );

  return setValue;
}

export function useRxState<T>(
  subject: Subject<T>,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>];
export function useRxState<T>(
  subject: Subject<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useRxState(subject: any, initialValue?: any) {
  return [useRxValue(subject), useSetRxState(subject, initialValue)];
}

function isFunction<T>(action: SetStateAction<T>): action is (prev: T) => T {
  const tryFunc = action as (prev: T) => T;
  return tryFunc !== undefined;
}
