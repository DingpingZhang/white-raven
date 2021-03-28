import classNames from 'classnames';
import React, {
  HTMLAttributes,
  ReactNode,
  Ref,
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FLOAT_TOLERANCE } from 'helpers';
import { useCombinedRefs, useResizeObserver } from 'hooks';

type ScrollBarStyle = 'inline' | 'overlay';
interface ScrollViewerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollBarStyle?: ScrollBarStyle;
  enableVerticalScrollBar?: boolean;
  enableHorizontalScrollBar?: boolean;
}

const ScrollViewer = React.forwardRef(
  (
    {
      children,
      scrollBarStyle,
      enableVerticalScrollBar,
      enableHorizontalScrollBar,
      className,
      onScroll,
      style,
    }: ScrollViewerProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRefs(ref, wrapperRef);
    const [scrollBarTop, setScrollBarTop] = useState(0);
    const [scrollBarHeight, setScrollBarHeight] = useState(0);
    const [scrollBarLeft, setScrollBarLeft] = useState(0);
    const [scrollBarWidth, setScrollBarWidth] = useState(0);

    const updateSize = useCallback(() => {
      const view = wrapperRef.current;
      if (!view) return;
      const viewWidth = view.clientWidth;
      const viewHeight = view.clientHeight;

      if (enableHorizontalScrollBar) {
        const ratio = viewWidth / view.scrollWidth;
        setScrollBarWidth(viewWidth * ratio);
        setScrollBarLeft(view.scrollLeft * ratio);
      }

      if (enableVerticalScrollBar) {
        const ratio = viewHeight / view.scrollHeight;
        setScrollBarHeight(viewHeight * ratio);
        setScrollBarTop(view.scrollTop * ratio);
      }
    }, [enableHorizontalScrollBar, enableVerticalScrollBar]);
    // Trigger the size update when itself changed.
    useResizeObserver(wrapperRef, updateSize);
    useResizeObserver(scrollContentRef, updateSize);
    // Trigger the size update when its children changed.
    useEffect(() => {
      if (scrollContentRef.current) {
        const mutationObserver = new MutationObserver(updateSize);
        mutationObserver.observe(scrollContentRef.current, {
          childList: true,
          subtree: true,
        });
        return () => mutationObserver.disconnect();
      }
    }, [updateSize]);

    const activeHorizontalScrollBar =
      enableHorizontalScrollBar &&
      wrapperRef.current &&
      wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth > FLOAT_TOLERANCE;
    const activeVerticalScrollBar =
      enableVerticalScrollBar &&
      wrapperRef.current &&
      wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight > FLOAT_TOLERANCE;

    const wrapperClass = classNames('ScrollViewer', className, `${scrollBarStyle ?? 'overlay'}`);

    const horizontalScrollBarClass = classNames('ScrollViewer__bar', 'horizontal', {
      active: activeHorizontalScrollBar,
    });
    const verticalScrollBarClass = classNames('ScrollViewer__bar', 'vertical', {
      active: activeVerticalScrollBar,
    });

    const handleScroll = useCallback(() => {
      const view = wrapperRef.current;
      if (!view) return;

      if (activeHorizontalScrollBar) {
        const barLeft = (view.clientWidth * view.scrollLeft) / view.scrollWidth;
        setScrollBarLeft(barLeft);
      }

      if (activeVerticalScrollBar) {
        const barTop = (view.clientHeight * view.scrollTop) / view.scrollHeight;
        setScrollBarTop(barTop);
      }
    }, [activeHorizontalScrollBar, activeVerticalScrollBar]);
    const innerOnScroll = useCallback<UIEventHandler<HTMLDivElement>>(
      (...args) => {
        handleScroll();
        if (onScroll) {
          onScroll(...args);
        }
      },
      [handleScroll, onScroll]
    );
    const handleHorizontalScroll = useCallback(
      (e: React.WheelEvent<HTMLDivElement>) => {
        if (!wrapperRef.current || !enableHorizontalScrollBar) return;
        // https://stackoverflow.com/a/15343916
        const delta = Math.max(-1, Math.min(1, e.deltaX || e.deltaY || -e.detail));
        wrapperRef.current.scrollLeft += delta * 40;
      },
      [enableHorizontalScrollBar]
    );

    const handleVerticalDragging = useCallback(
      (_x: number, y: number) => {
        const scrollElement = wrapperRef.current;
        if (enableVerticalScrollBar && scrollElement) {
          const radio = scrollElement.scrollHeight / scrollElement.clientHeight;
          const newValue = scrollElement.scrollTop + y * radio;

          if (
            newValue >= 0 &&
            newValue <= scrollElement.scrollHeight - scrollElement.clientHeight
          ) {
            scrollElement.scrollTop = newValue;
            return true;
          }
        }

        return false;
      },
      [enableVerticalScrollBar]
    );
    const handleHorizontalDragging = useCallback(
      (x: number, _y: number) => {
        const scrollElement = wrapperRef.current;
        if (enableHorizontalScrollBar && scrollElement) {
          const radio = scrollElement.scrollWidth / scrollElement.clientWidth;
          scrollElement.scrollLeft += x * radio;
        }

        return false;
      },
      [enableHorizontalScrollBar]
    );
    const verticalThumbRef = useDragging(handleVerticalDragging);
    const horizontalThumbRef = useDragging(handleHorizontalDragging);

    return (
      <div className={wrapperClass} style={style}>
        <div
          ref={combinedRef}
          className="ScrollViewer__view"
          onScroll={innerOnScroll}
          onWheel={handleHorizontalScroll}
        >
          <div ref={scrollContentRef} className="ScrollViewer__content">
            {children}
          </div>
        </div>
        {enableHorizontalScrollBar ? (
          <div className={horizontalScrollBarClass}>
            <div
              ref={horizontalThumbRef}
              className="ScrollViewer__thumb"
              style={{
                left: scrollBarLeft || 0,
                width: activeHorizontalScrollBar && scrollBarWidth ? scrollBarWidth : 0,
              }}
            />
          </div>
        ) : null}
        {enableVerticalScrollBar ? (
          <div className={verticalScrollBarClass}>
            <div
              ref={verticalThumbRef}
              className="ScrollViewer__thumb"
              style={{
                top: scrollBarTop || 0,
                height: activeVerticalScrollBar && scrollBarHeight ? scrollBarHeight : 0,
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

ScrollViewer.defaultProps = {
  scrollBarStyle: 'overlay',
  enableHorizontalScrollBar: false,
  enableVerticalScrollBar: false,
};

export default ScrollViewer;

function useDragging<T extends HTMLElement = HTMLElement>(
  callback: (x: number, y: number) => boolean
) {
  const [element, setElement] = useState<T | null>(null);
  const ref = useCallback((node: T | null) => setElement(node), []);
  const prevX = useRef(0);
  const prevY = useRef(0);

  useEffect(() => {
    if (element) {
      function onDragging(e: MouseEvent) {
        if (callback(e.screenX - prevX.current, e.screenY - prevY.current)) {
          prevX.current = e.screenX;
          prevY.current = e.screenY;
        }
      }

      function onDragEnd() {
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('mousemove', onDragging);
      }

      function onDragStart(e: MouseEvent) {
        prevX.current = e.screenX;
        prevY.current = e.screenY;

        window.addEventListener('mousemove', onDragging);
        window.addEventListener('mouseup', onDragEnd);
      }

      element.addEventListener('mousedown', onDragStart);

      return () => {
        element.removeEventListener('mousedown', onDragStart);
        onDragEnd();
      };
    }
  }, [callback, element]);

  return ref;
}
