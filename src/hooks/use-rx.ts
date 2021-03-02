import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

type ObserverLike<T> = {
  next: (value: T) => void;
  value: T;
};

export function useRxValue<T>(observable: Observable<T>, initialValue: T): T;
export function useRxValue<T>(observable: Observable<T>): T | undefined;
export function useRxValue<T>(observable: Observable<T>, initialValue?: T) {
  const [innerValue, setInnerValue] = useState<T | undefined>(initialValue);
  useEffect(() => {
    const token = observable.subscribe((next: T | undefined) => setInnerValue(next));
    return () => token.unsubscribe();
  }, [observable]);

  return innerValue;
}

export function useSetRxState<T>(observer: ObserverLike<T>): Dispatch<SetStateAction<T>> {
  const setValue = useCallback(
    (action: SetStateAction<T>) => {
      const nextValue = isSetCallback(action) ? action(observer.value) : action;
      observer.next(nextValue);
    },
    [observer]
  );

  return setValue;
}

export function useRxState<T>(
  subject: BehaviorSubject<T>,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>];
export function useRxState<T>(
  subject: BehaviorSubject<T>
): [T | undefined, Dispatch<SetStateAction<T>>];
export function useRxState<T>(subject: BehaviorSubject<T>, initialValue?: any) {
  return [useRxValue(subject, initialValue), useSetRxState(subject)];
}

function isSetCallback<T>(action: SetStateAction<T>): action is (prev: T) => T {
  return typeof action === 'function';
}
