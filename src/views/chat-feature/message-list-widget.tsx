import { Message } from 'api';
import CircleButton from 'components/circle-button';
import ScrollViewer from 'components/scroll-viewer';
import MessageList, { BATCH_COUNT, MessageListAction } from 'models/message-list';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ReactComponent as BottomIcon } from 'images/bottom.svg';
import classNames from 'classnames';
import {
  SetCallback,
  useSetOfSeparatedState,
  useValueOfSeparatedState,
} from 'hooks/use-child-state';

type Props = {
  messageList: MessageList;
  renderItem: (item: Message, index: number) => ReactElement;
};

type ScrollIndex = {
  alignToTop: boolean;
  index: number | 'top' | 'bottom';
};

const INVALID_SCROLL_INDEX: ScrollIndex = { alignToTop: false, index: -1 };
const INITIAL_SCROLL_INDEX: ScrollIndex = { alignToTop: false, index: 'bottom' };
// TODO: 这里的自动滚动到底部的滚动率本应该是 0.95，使得滚动条更接近底部时，才会执行自动滚动到底（当新消息来临时）
// 但由于当前图片加载后不触发滚动，导致新图片消息来临时，滚动条可能不再处于底部，从而使自动滚动模式失效。
// 所以暂时先设置小一些。
const NEAR_BOTTOM_SCROLL_RADIO = 0.8;
const VISIBLE_GOTO_SCROLL_RADIO = 0.8;

export default function MessageListWidget({ messageList, renderItem }: Props) {
  const scrollViewerRef = useRef<HTMLDivElement>(null);
  const scrollPointerElementRef = useRef<HTMLDivElement>(null);
  const [
    setIsVisibleGotoBottom,
    setIsVisibleGotoBottomCallback,
  ] = useSetOfSeparatedState<boolean>();
  const [scrollPointerIndex, setScrollPointerIndex] = useState(INITIAL_SCROLL_INDEX);

  const [prevMoreRef, inViewPrevMore, prevMoreEntity] = useInView();
  const [nextMoreRef, inViewNextMore, nextMoreEntity] = useInView();

  useEffect(() => {
    if (inViewPrevMore) {
      messageList.pullPrev();
    }
  }, [inViewPrevMore, messageList]);
  useEffect(() => {
    if (inViewNextMore) {
      messageList.pullNext();
    }
  }, [inViewNextMore, messageList]);

  const handleAction = useCallback(
    (action: MessageListAction) => {
      switch (action.type) {
        case 'add':
          {
            const scrollViewer = scrollViewerRef.current;
            if (!scrollViewer) return;
            const isNearBottom = calculateScrollRadio(scrollViewer) > NEAR_BOTTOM_SCROLL_RADIO;

            if (isNearBottom) {
              messageList.pullUntilLatest();
            } else {
              setScrollPointerIndex(INVALID_SCROLL_INDEX);
            }
          }
          break;
        case 'scroll/back':
          setScrollPointerIndex({
            alignToTop: false,
            index: action.targetIndex - messageList.startIndex,
          });
          break;
        case 'scroll/forward':
          setScrollPointerIndex({
            alignToTop: true,
            index: action.targetIndex - messageList.startIndex + BATCH_COUNT - 1,
          });
          break;
      }
    },
    [messageList]
  );
  useEffect(() => {
    const token = messageList.action.subscribe(handleAction);
    return () => token.unsubscribe();
  }, [handleAction, messageList.action]);

  const prevMoreElement = prevMoreEntity?.target;
  const nextMoreElement = nextMoreEntity?.target;
  const executeScorlling = useCallback(
    (scrollIndex: ScrollIndex) => {
      if (scrollIndex.index === 'bottom') {
        if (nextMoreElement && messageList.isWindowAtLatest()) {
          nextMoreElement.scrollIntoView(scrollIndex.alignToTop);
        }
      } else if (scrollIndex.index === 'top') {
        if (prevMoreElement) {
          prevMoreElement.scrollIntoView(scrollIndex.alignToTop);
        }
      } else if (scrollIndex.index >= 0) {
        if (scrollPointerElementRef.current) {
          scrollPointerElementRef.current.scrollIntoView(scrollIndex.alignToTop);
        }
      }
    },
    [messageList, nextMoreElement, prevMoreElement]
  );
  useEffect(() => executeScorlling(scrollPointerIndex), [executeScorlling, scrollPointerIndex]);

  const isNearBottom = useCallback(() => {
    const scrollViewer = scrollViewerRef.current;
    if (!scrollViewer) return undefined;

    return (
      messageList.isWindowAtLatest() &&
      calculateScrollRadio(scrollViewer) > VISIBLE_GOTO_SCROLL_RADIO
    );
  }, [messageList]);
  const handleGotoBottomVisible = useCallback(() => {
    const isNearBottomValue = isNearBottom();
    if (isNearBottomValue === undefined) return;

    if (setIsVisibleGotoBottom) {
      setIsVisibleGotoBottom(!isNearBottomValue);
    }
  }, [isNearBottom, setIsVisibleGotoBottom]);

  return (
    <div className="MessageListWidget">
      <ScrollViewer
        ref={scrollViewerRef}
        className="MessageListWidget__messageList"
        onScroll={handleGotoBottomVisible}
        enableVerticalScrollBar
      >
        <div ref={prevMoreRef} className="MessageListWidget__prevMore"></div>
        {messageList.window.map((item, index) => {
          const element = renderItem(item, index);
          return (
            <div
              ref={scrollPointerIndex.index === index ? scrollPointerElementRef : null}
              key={element.key}
            >
              {element}
            </div>
          );
        })}
        <div ref={nextMoreRef} className="MessageListWidget__nextMore"></div>
      </ScrollViewer>
      <GotoButtomButton
        messageList={messageList}
        setIsVisibleCallback={setIsVisibleGotoBottomCallback}
      />
    </div>
  );
}

type GotoBottomButtonProps = {
  messageList: MessageList;
  setIsVisibleCallback: SetCallback<boolean>;
};

function GotoButtomButton({ messageList, setIsVisibleCallback }: GotoBottomButtonProps) {
  // NOTE: 单独将 GotoButtomButton 提取出来，以保存 isVisible state，若将 isVisible state 放置
  // 父控件 MessageList 中，则会在变化时触发整个 MessageList 重新渲染。该渲染会导致在 Safari 上严重的卡顿，
  // 但在 Chromium 内核的浏览器中还可以接受。
  // NOTE: 上面的注释是错的！这里真正导致性能问题的，是 css 布局，不要用 grid，直接用相对定位，屁事没有。
  const isVisible = useValueOfSeparatedState(setIsVisibleCallback, false);

  const gotoBottomClass = classNames('MessageListWidget__gotoBottom', {
    active: isVisible,
  });

  return (
    <CircleButton
      className={gotoBottomClass}
      buttonType="default"
      icon={<BottomIcon />}
      onClick={() => messageList.pullUntilLatest()}
    />
  );
}

function calculateScrollRadio(element: HTMLElement) {
  return (element.scrollTop + element.offsetHeight) / element.scrollHeight;
}
