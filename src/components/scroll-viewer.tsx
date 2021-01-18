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
import { useCombinedRefs, useResizeObserver } from '../hooks';

const FLOAT_TOLERANCE = 1e-3;

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
    useResizeObserver(wrapperRef, updateSize);
    useResizeObserver(scrollContentRef, updateSize);
    useEffect(() => {
      if (scrollContentRef.current) {
        const mutationObserver = new MutationObserver(() => updateSize());
        mutationObserver.observe(scrollContentRef.current, {
          childList: true,
          subtree: true,
        });
        return () => mutationObserver.disconnect();
      }
    }, [updateSize]);

    const wrapperClass = classNames(
      'scroll-viewer-wrapper',
      className,
      `${scrollBarStyle ?? 'overlay'}`
    );

    const activeHorizontalScrollBar =
      enableHorizontalScrollBar &&
      wrapperRef.current &&
      wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth > FLOAT_TOLERANCE;
    const activeVerticalScrollBar =
      enableVerticalScrollBar &&
      wrapperRef.current &&
      wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight > FLOAT_TOLERANCE;

    const horizontalScrollBarClass = classNames('scroll-bar', 'horizontal', {
      active: activeHorizontalScrollBar,
    });
    const verticalScrollBarClass = classNames('scroll-bar', 'vertical', {
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

    return (
      <div className={wrapperClass} style={style}>
        <div
          ref={combinedRef}
          className="scroll-view"
          onScroll={innerOnScroll}
          onWheel={handleHorizontalScroll}
        >
          <div ref={scrollContentRef} className="scroll-content">
            {children}
          </div>
        </div>
        {enableHorizontalScrollBar ? (
          <div className={horizontalScrollBarClass}>
            <div
              className="scroll-thumb"
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
              className="scroll-thumb"
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
