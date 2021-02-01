import { Err, Ok } from 'api';
import { useCallback, useEffect, useState } from 'react';

export function useAsyncValue<T>(func: () => Promise<T>, initialValue: T): T {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    let cancel = false;
    const fetch = async () => {
      const result = await func();

      // [BUGFIX]: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
      if (cancel) return;

      setValue(result);
    };

    fetch();

    return () => {
      cancel = true;
    };
  }, [func]);

  return value;
}

export function useHttpApi<T>(
  func: () => Promise<Ok<T> | Err<any>>,
  initialValue: T,
  throwError?: boolean,
  errorMessage?: string
): T {
  const fetchAsync = useCallback(async () => {
    const response = await func();
    if (response.code === 200) {
      return response.content;
    }

    if (throwError) {
      throw new Error(errorMessage || 'Failed to fetch data.');
    }

    return initialValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage, func, throwError]);

  return useAsyncValue(fetchAsync, initialValue);
}
