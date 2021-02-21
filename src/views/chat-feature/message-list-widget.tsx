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
            scrollViewer.scrollTop + scrollViewer.offsetHeight / scrollViewer.scrollHeight > 0.8;

          if (isArrivedBottom) {
            setScrollPointerIndex('bottom');
          } else {
            setScrollPointerIndex(-1);
          }
        }
        break;
      case 'pull-next':
        setScrollPointerIndex(sliceCount - changedCount);
        break;
      case 'pull-prev':
        setScrollPointerIndex(changedCount - 1);
        break;
    }
  }, []);
  useEffect(() => {
    const token = messageList.itemsChanged.subscribe(handleItemsChanged);
    return () => token.unsubscribe();
  }, [handleItemsChanged, messageList.itemsChanged]);

  useEffect(() => {
    if (scrollPointerIndex === 'bottom') {
      if (nextMoreEntity) {
        nextMoreEntity.target.scrollIntoView();
      }
    } else if (scrollPointerIndex === 'top') {
      if (prevMoreEntity) {
        prevMoreEntity.target.scrollIntoView();
      }
    } else if (scrollPointerIndex >= 0) {
      if (scrollPointerElementRef.current) {
        scrollPointerElementRef.current.scrollIntoView();
      }
    }
  }, [nextMoreEntity, prevMoreEntity, scrollPointerIndex]);

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

          return scrollPointerIndex === index
            ? React.cloneElement(element, { ref: scrollPointerElementRef })
            : element;
        })}
        <div ref={nextMoreRef} className="MessageListWidget__nextMore"></div>
      </ScrollViewer>
    </div>
  );
}
