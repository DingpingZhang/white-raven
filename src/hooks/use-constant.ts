import { useRef } from 'react';

export function useConstant<T>(factory: () => T) {
  const ref = useRef<{ value: T }>();
  if (!ref.current) {
    ref.current = { value: factory() };
  }

  return ref.current.value;
}
