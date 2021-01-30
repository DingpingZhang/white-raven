import { RefObject, useEffect } from 'react';

// TODO: Replace with log system
const log = (level: string, message: string) => console.log(`$[${level} ${message}]`);

export type Size = {
  width: number;
  height: number;
};

export function useResizeObserver<T extends HTMLElement>(
  targetRef: RefObject<T>,
  callback: (rect: Size) => void
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    if (window.ResizeObserver) {
      log('debug', 'The current browser is support the ResizeObserver.');
      let cancel = false;
      const resizeObserver = new ResizeObserver((entities) =>
        // Ref: https://stackoverflow.com/a/58701523/9078911
        window.requestAnimationFrame(() => {
          // [BUGFIX]: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
          if (cancel) return;

          const entity = entities[0];
          callback({
            width: entity.contentRect.width,
            height: entity.contentRect.height,
          });
        })
      );

      resizeObserver.observe(target);
      callback({
        width: target.offsetWidth,
        height: target.offsetHeight,
      });

      return () => {
        cancel = true;
        resizeObserver.disconnect();
      };
    } else {
      // Fall back to resize event.
      log('debug', 'Fallback to resize event.');
      const handleResize = () =>
        callback({
          width: target.offsetWidth,
          height: target.offsetHeight,
        });
      handleResize();
      window.addEventListener('resize', handleResize);

      const mutationObserver = new MutationObserver(handleResize);
      mutationObserver.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        mutationObserver.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
}
