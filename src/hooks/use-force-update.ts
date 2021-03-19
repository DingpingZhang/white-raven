import { useCallback, useState } from 'react';

export function useForceUpdate() {
  const [, triggerUpdate] = useState(false);

  return useCallback(() => triggerUpdate(oldValue => !oldValue), []);
}
