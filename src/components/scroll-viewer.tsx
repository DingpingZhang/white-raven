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
import { equalNumber, FLOAT_TOLERANCE } from '../helpers';
import { useCombinedRefs, useResizeObserver } from '../hooks';

type ScrollBarStyle = 'inline' | 'overlay';
interface ScrollViewerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollBarStyle?: ScrollBarStyle;
  enableVerticalScrollBar?: boolean;
  enableHorizontalScrollBar?: boolean;
  onArrivedTop?: () => void;
  onArrivedBottom?: () => void;
  onArrivedLeft?: () => void;
  onArrivedRight?: () => void;
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
      onArrivedTop,
      onArrivedBottom,
      onArrivedLeft,
      onArrivedRight,
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
        const mutationObserver = new MutationObserver(() => updateSize());
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
    useEffect(() => {
      const view = wrapperRef.current;
      if (!view) return;

      if (activeHorizontalScrollBar) {
        if (equalNumber(scrollBarLeft, 0)) {
          onArrivedLeft && onArrivedLeft();
        } else if (equalNumber(scrollBarLeft + scrollBarWidth, view.clientWidth, 1)) {
          onArrivedRight && onArrivedRight();
        }
      }

      if (activeVerticalScrollBar) {
        if (equalNumber(scrollBarTop, 0)) {
          onArrivedTop && onArrivedTop();
        } else if (equalNumber(scrollBarTop + scrollBarHeight, view.clientHeight, 0.5)) {
          onArrivedBottom && onArrivedBottom();
        }
      }
    }, [
      activeHorizontalScrollBar,
      activeVerticalScrollBar,
      onArrivedBottom,
      onArrivedLeft,
      onArrivedRight,
      onArrivedTop,
      scrollBarHeight,
      scrollBarLeft,
      scrollBarTop,
      scrollBarWidth,
    ]);

    const wrapperClass = classNames(
      'scroll-viewer-wrapper',
      className,
      `${scrollBarStyle ?? 'overlay'}`
    );

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
