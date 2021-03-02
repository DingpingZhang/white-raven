import { RefObject, useCallback, useEffect, useState } from 'react';

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

/**
 * A hook for ResizeObserver.
 * @param intialWidth The fake width of the target element before layouting.
 * @param initialHeight The fake height of the target element before layouting.
 * @returns [ref, width, height, targetElement]
 */
export function useResize<T extends Element = Element>(
  intialWidth?: number,
  initialHeight?: number
): [(node: T | null) => void, number, number, T | null] {
  const [element, setElement] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({ width: intialWidth || 0, height: initialHeight || 0 });
  const ref = useCallback((node: T | null) => setElement(node), []);
  useEffect(() => {
    if (!element) return;

    let cancel = false;
    const resizeObserver = new ResizeObserver((entities) =>
      // Ref: https://stackoverflow.com/a/58701523/9078911
      window.requestAnimationFrame(() => {
        // [BUGFIX]: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
        if (cancel) return;

        const entity = entities[0];
        setSize({ width: entity.contentRect.width, height: entity.contentRect.height });
      })
    );

    resizeObserver.observe(element);
    setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    });

    return () => {
      cancel = true;
      resizeObserver.disconnect();
    };
  }, [element]);

  return [ref, size.width, size.height, element];
}
