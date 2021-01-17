// Ref: https://github.com/streamich/react-use/blob/master/src/useThrottleFn.ts
/* eslint-disable */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useThrottleFn = <T, U extends any[]>(fn: (...args: U) => T, ms: number = 200, args: U) => {
  const [state, setState] = useState<T | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const nextArgs = useRef<U>();

  useEffect(() => {
    if (!timeout.current) {
      setState(fn(...args));
      const timeoutCallback = () => {
        if (nextArgs.current) {
          setState(fn(...nextArgs.current));
          nextArgs.current = undefined;
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextArgs.current = args;
    }
  }, args);

  useEffect(() => () => timeout.current && clearTimeout(timeout.current), []);

  return state;
};

export default useThrottleFn;

class Throttle<T> {
  private readonly callback: (value: T) => void;
  private readonly delay: number;

  private lastValue: T | undefined;
  private lastTriggeredTime: number = 0;
  private isWaiting: boolean = false;
  private timeoutToken: ReturnType<typeof setTimeout> | undefined;

  constructor(callback: (value: T) => void, delay: number) {
    this.callback = callback;
    this.delay = delay;
  }

  invoke(value: T): void {
    this.lastValue = value;
    this.lastTriggeredTime = Date.now();

    if (!this.isWaiting) {
      this.isWaiting = true;
      this.innerInvoke(this.delay);
    }
  }

  dispose() {
    if (this.timeoutToken) {
      clearTimeout(this.timeoutToken);
    }
  }

  private innerInvoke(delay: number) {
    this.timeoutToken = setTimeout(() => {
      const actualInterval = Date.now() - this.lastTriggeredTime;
      if (delay > actualInterval) {
        this.innerInvoke(delay - actualInterval);
      } else {
        this.callback(this.lastValue!);
        this.isWaiting = false;
      }
    }, delay);
  }
}

export function useThrottle<T>(
  callback: (value: T) => void,
  delay: number = 200
): (value: T) => void {
  const [throttle, setThrottle] = useState(() => new Throttle(callback, delay));
  useEffect(() => {
    setThrottle((oldValue) => {
      oldValue.dispose();
      return new Throttle(callback, delay);
    });
  }, [callback, delay]);

  return useCallback((value) => throttle.invoke(value), [throttle]);
}
