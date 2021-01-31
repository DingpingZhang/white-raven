import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import InfiniteScrollingListBox, { FetchItemsType } from 'components/infinite-scrolling-list-box';
import BasicMessage from './messages/basic-message';
import MessageSendBox from './messages/message-send-box';
import { IdType, Message, MessageContent } from 'api';
import { GlobalContext } from 'models/global-context';
import { getAvatarById } from './messages/common';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { Size, useForceUpdate, useLazyRef, useResizeObserver } from 'hooks';
import SortedSet from 'models/sorted-set';

type Props = {
  fetchAsync: (startId?: IdType) => Promise<ReadonlyArray<Message>>;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
  getSenderNameById?: (id: IdType) => Promise<string>;
};

export default function ChatControl({ fetchAsync, sendMessage, getSenderNameById }: Props) {
  const earliestMessageIdRef = useRef<IdType | undefined>(undefined);
  const { id: currentUserId } = useContext(GlobalContext);
  const renderMessage = useCallback(
    async (type: FetchItemsType) => {
      if (type === 'next') return [];

      const messages = await fetchAsync(earliestMessageIdRef.current);
      if (!messages.length) return [];

      earliestMessageIdRef.current = messages[0].id;
      return messages.map(({ id, senderId, content, timestamp }) => (
        <BasicMessage
          key={id}
          avatar={getAvatarById(id)}
          content={content}
          timestamp={timestamp}
          highlight={senderId === currentUserId}
          getSenderName={async () => (getSenderNameById ? await getSenderNameById(senderId) : '')}
        />
      ));
    },
    [currentUserId, fetchAsync, getSenderNameById]
  );

  return (
    <div className="ChatControl">
      <div className="ChatControl__messageList">
        <InfiniteScrollingListBox renderItems={renderMessage} />
        {/* <MessageList fetchAsync={fetchAsync} getSenderNameById={getSenderNameById} /> */}
      </div>
      <div className="ChatControl__inputBox">
        <MessageSendBox
          sendMessage={async (content) => {
            const message = await sendMessage(content);
            if (message) {
              // TODO: Add message to message list.
              return true;
            } else {
              return false;
            }
          }}
        />
      </div>
    </div>
  );
}

type ItemSizeRecord<T> = {
  item: T;
  size: number;
};

class List {
  private readonly storage: SortedSet<ItemSizeRecord<Message>>;

  constructor() {
    this.storage = new SortedSet<ItemSizeRecord<Message>>(
      (item) => item.item.id,
      (x, y) => x.item.timestamp - y.item.timestamp
    );
  }

  addRange = (items: ReadonlyArray<Message>) => {
    this.storage.addRange(items.map((item) => ({ item, size: 0 })));
  };

  slice = (startIndex: number, endIndex: number): ReadonlyArray<Message> => {
    return this.storage.items.slice(startIndex, endIndex).map((item) => item.item);
  };

  setSize = (index: number, { height }: Size) => {
    this.storage.items[index].size = height;
  };

  getItemsCount = (startIndex: number, size: number): number => {
    let count = 0;
    let sumSize = 0;
    while (sumSize < size) {
      sumSize += this.storage.items[startIndex + count].size;
    }

    return count;
  };

  getItemsSize = (count: number): number => {
    let sumSize = 0;
    for (let i = 0; i < count; i++) {
      sumSize += this.storage.items[i].size;
    }

    return sumSize;
  };
}

type MessageListProps = {
  fetchAsync: (startId?: IdType) => Promise<ReadonlyArray<Message>>;
  getSenderNameById?: (id: IdType) => Promise<string>;
};

function MessageList({ fetchAsync, getSenderNameById }: MessageListProps) {
  const messageList = useLazyRef(() => new List());

  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const fetch = async () => {
      messageList.addRange(await fetchAsync());
    };

    fetch();
  }, [fetchAsync, forceUpdate, messageList]);
  const { id: currentUserId } = useContext(GlobalContext);

  return (
    <div className="MessageList" style={{ height: '100%' }}>
      <VirtualizingListBox
        sizeProvider={{
          getItemsCount: messageList.getItemsCount,
          getItemsSize: messageList.getItemsSize,
        }}
        renderItems={(startIndex, endIndex) => {
          return messageList
            .slice(startIndex, endIndex)
            .map(({ id, content, timestamp, senderId }, index) => (
              <MessageItem
                onSizeChanged={(size) => {
                  messageList.setSize(startIndex + index, size);
                  forceUpdate();
                }}
              >
                <BasicMessage
                  key={id}
                  avatar={getAvatarById(id)}
                  content={content}
                  timestamp={timestamp}
                  highlight={senderId === currentUserId}
                  getSenderName={async () =>
                    getSenderNameById ? await getSenderNameById(senderId) : ''
                  }
                />
              </MessageItem>
            ));
        }}
      />
    </div>
  );
}

type MessageItemProps = {
  children: ReactElement;
  onSizeChanged: (size: Size) => void;
};

function MessageItem({ children, onSizeChanged }: MessageItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  useResizeObserver(itemRef, onSizeChanged);

  return (
    <div ref={itemRef} className="MessageItem">
      {children}
    </div>
  );
}
