import { useRef } from 'react';

export function useLazyRef<T>(factory: () => T) {
  const ref = useRef<T>();
  const getter = () => {
    if (!ref.current) {
      ref.current = factory();
    }

    return ref.current;
  };

  return getter();
}
