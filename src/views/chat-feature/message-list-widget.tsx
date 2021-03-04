import { Message } from 'api';
import CircleButton from 'components/circle-button';
import ScrollViewer from 'components/scroll-viewer';
import MessageList, { ItemsChangedInfo } from 'models/message-list';
import React from 'react';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ReactComponent as BottomIcon } from 'images/bottom.svg';
import classNames from 'classnames';

type Props = {
  messageList: MessageList;
  renderItem: (item: Message, index: number) => ReactElement;
};
type ScrollIndex = {
  alignToTop: boolean;
  index: number | 'top' | 'bottom';
};

export default function MessageListWidget({ messageList, renderItem }: Props) {
  const scrollViewerRef = useRef<HTMLDivElement>(null);
  const scrollPointerElementRef = useRef<HTMLDivElement>(null);
  const [scrollPointerIndex, setScrollPointerIndex] = useState<ScrollIndex>({
    alignToTop: false,
    index: 'bottom',
  });
  const [isGotoBottomVisible, setIsGotoBottomVisible] = useState(false);

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

  const handleItemsChanged = useCallback(({ type, changedCount, sliceCount }: ItemsChangedInfo) => {
    if (changedCount <= 0 || sliceCount <= 0) return;

    switch (type) {
      case 'push':
        {
          const scrollViewer = scrollViewerRef.current;
          if (!scrollViewer) return;
          const isNearBottom =
            (scrollViewer.scrollTop + scrollViewer.offsetHeight) / scrollViewer.scrollHeight > 0.8;

          if (isNearBottom) {
            setScrollPointerIndex({ alignToTop: false, index: 'bottom' });
          } else {
            setScrollPointerIndex({ alignToTop: false, index: -1 });
          }
        }
        break;
      case 'pull-next':
        setScrollPointerIndex({ alignToTop: false, index: sliceCount - changedCount });
        break;
      case 'pull-prev':
        setScrollPointerIndex({ alignToTop: true, index: changedCount - 1 });
        break;
      case 'pull-until-latest':
        setScrollPointerIndex({ alignToTop: false, index: 'bottom' });
        break;
    }
  }, []);
  useEffect(() => {
    const token = messageList.itemsChanged.subscribe(handleItemsChanged);
    return () => token.unsubscribe();
  }, [handleItemsChanged, messageList.itemsChanged]);

  const prevMoreElement = prevMoreEntity?.target;
  const nextMoreElement = nextMoreEntity?.target;
  useEffect(() => {
    if (scrollPointerIndex.index === 'bottom') {
      if (
        nextMoreElement &&
        messageList.startIndex + messageList.capacity >= messageList.storage.items.length
      ) {
        nextMoreElement.scrollIntoView(scrollPointerIndex.alignToTop);
      }
    } else if (scrollPointerIndex.index === 'top') {
      if (prevMoreElement) {
        prevMoreElement.scrollIntoView(scrollPointerIndex.alignToTop);
      }
    } else if (scrollPointerIndex.index >= 0) {
      if (scrollPointerElementRef.current) {
        scrollPointerElementRef.current.scrollIntoView(scrollPointerIndex.alignToTop);
      }
    }
  }, [
    prevMoreElement,
    nextMoreElement,
    scrollPointerIndex,
    messageList.startIndex,
    messageList.capacity,
    messageList.storage.items.length,
  ]);
  const handleGotoBottomVisible = useCallback(() => {
    const scrollViewer = scrollViewerRef.current;
    if (!scrollViewer) return;

    const isNearBottom =
      messageList.startIndex + messageList.capacity >= messageList.storage.items.length &&
      (scrollViewer.scrollTop + scrollViewer.offsetHeight) / scrollViewer.scrollHeight > 0.8;
    setIsGotoBottomVisible(!isNearBottom);
  }, [messageList.capacity, messageList.startIndex, messageList.storage.items.length]);

  const gotoBottomClass = classNames('MessageListWidget__gotoBottom', {
    active: isGotoBottomVisible,
  });

  return (
    <div className="MessageListWidget">
      <ScrollViewer
        ref={scrollViewerRef}
        className="MessageListWidget__messageList"
        onScroll={handleGotoBottomVisible}
        enableVerticalScrollBar
      >
        <div ref={prevMoreRef} className="MessageListWidget__prevMore"></div>
        {messageList.items.map((item, index) => {
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
      <CircleButton
        className={gotoBottomClass}
        buttonType="default"
        icon={<BottomIcon />}
        onClick={() => messageList.pullUntilLatest()}
      />
    </div>
  );
}
