// Ref to: https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd

import React, { Ref, useRef } from 'react';

export function useCombinedRefs<T extends Element>(...refs: Ref<T>[]) {
  const targetRef = useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as any).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
