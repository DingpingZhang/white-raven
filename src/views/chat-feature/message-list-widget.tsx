import { Message } from 'api';
import ScrollViewer from 'components/scroll-viewer';
import MessageList, { ItemsChangedInfo } from 'models/message-list';
import React from 'react';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  messageList: MessageList;
  renderItem: (item: Message, index: number) => ReactElement;
};

export default function MessageListWidget({ messageList, renderItem }: Props) {
  const scrollViewerRef = useRef<HTMLDivElement>(null);
  const scrollPointerElementRef = useRef<HTMLDivElement>(null);
  const [scrollPointerIndex, setScrollPointerIndex] = useState<number | 'top' | 'bottom'>('bottom');

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
          const isArrivedBottom =
            (scrollViewer.scrollTop + scrollViewer.offsetHeight) / scrollViewer.scrollHeight > 0.8;

          if (isArrivedBottom) {
            setScrollPointerIndex(Number.MIN_SAFE_INTEGER);
            setScrollPointerIndex('bottom');
          } else {
            setScrollPointerIndex(Number.MIN_SAFE_INTEGER);
            setScrollPointerIndex(-1);
          }
        }
        break;
      case 'pull-next':
        setScrollPointerIndex(Number.MIN_SAFE_INTEGER);
        setScrollPointerIndex(sliceCount - changedCount);
        break;
      case 'pull-prev':
        setScrollPointerIndex(Number.MIN_SAFE_INTEGER);
        setScrollPointerIndex(changedCount - 1);
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
    if (scrollPointerIndex === 'bottom') {
      if (
        nextMoreElement &&
        messageList.startIndex + messageList.capacity >= messageList.storage.items.length
      ) {
        nextMoreElement.scrollIntoView();
      }
    } else if (scrollPointerIndex === 'top') {
      if (prevMoreElement) {
        prevMoreElement.scrollIntoView();
      }
    } else if (scrollPointerIndex >= 0) {
      if (scrollPointerElementRef.current) {
        scrollPointerElementRef.current.scrollIntoView();
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

  return (
    <div className="MessageListWidget">
      <ScrollViewer
        ref={scrollViewerRef}
        className="MessageListWidget__messageList"
        enableVerticalScrollBar
      >
        <div ref={prevMoreRef} className="MessageListWidget__prevMore"></div>
        {messageList.items.map((item, index) => {
          const element = renderItem(item, index);
          return (
            <div
              ref={scrollPointerIndex === index ? scrollPointerElementRef : null}
              key={element.key}
            >
              {element}
            </div>
          );
        })}
        <div ref={nextMoreRef} className="MessageListWidget__nextMore"></div>
      </ScrollViewer>
    </div>
  );
}
