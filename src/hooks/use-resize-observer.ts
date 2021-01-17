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
      const resizeObserver = new ResizeObserver((entities) =>
        // Ref: https://stackoverflow.com/a/58701523/9078911
        window.requestAnimationFrame(() => {
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

      return () => resizeObserver.disconnect();
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
