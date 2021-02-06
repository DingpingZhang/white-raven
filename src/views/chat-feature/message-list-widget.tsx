import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { Size, useResize, useCombinedRefs } from 'hooks';
import MessageAndSizeList from 'models/message-and-size-list';
import { userInfoState } from 'models/store';
import React, { ReactElement, Ref, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRecoilValue } from 'recoil';
import MessageTextItem from './message-text-item';

type Props = {
  messages: MessageAndSizeList;
};

export default function MessageListWidget({ messages }: Props) {
  const [anchorTopRef] = useInView();
  const [anchorBottomRef, inViewAnchorBottom, bottomEntity] = useInView();

  const bottomElement = bottomEntity?.target;
  useEffect(() => {
    if (inViewAnchorBottom && bottomElement) {
      bottomElement.scrollIntoView();
    }
  }, [bottomElement, inViewAnchorBottom]);

  const { id: currentUserId } = useRecoilValue(userInfoState);

  return (
    <div className="MessageListWidget">
      <VirtualizingListBox
        sizeProvider={{
          getItemsCount: messages.getItemsCount,
          getItemsSize: messages.getItemsSize,
        }}
        renderItems={(startIndex, endIndex) => {
          return messages
            .slice(startIndex, endIndex)
            .map(({ id, content, timestamp, sender }, index) => {
              const actualIndex = startIndex + index;
              return (
                <MessageItem
                  ref={
                    startIndex === 0
                      ? anchorTopRef
                      : actualIndex === messages.length - 1
                      ? anchorBottomRef
                      : null
                  }
                  index={actualIndex}
                  onSizeChanged={messages.setSize}
                >
                  <MessageTextItem
                    key={id}
                    avatar={sender.avatar}
                    content={content}
                    timestamp={timestamp}
                    highlight={sender.id === currentUserId}
                    getSenderName={() => Promise.resolve(sender.name)}
                  />
                </MessageItem>
              );
            });
        }}
      />
    </div>
  );
}

type MessageItemProps = {
  ref: Ref<HTMLDivElement>;
  index: number;
  children: ReactElement;
  onSizeChanged: (index: number, size: Size) => void;
};

function MessageItem({ ref, index, children, onSizeChanged }: MessageItemProps) {
  const [itemRef, width, height] = useResize();
  const combinedRef = useCombinedRefs<HTMLDivElement>(itemRef, ref);
  useEffect(() => onSizeChanged(index, { width, height }), [height, index, onSizeChanged, width]);

  return (
    <div ref={combinedRef} className="MessageItem">
      {children}
    </div>
  );
}
