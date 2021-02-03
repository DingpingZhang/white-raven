import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
import InfiniteScrollingListBox, { FetchItemsType } from 'components/infinite-scrolling-list-box';
import MessageTextItem from './message-text-item';
import SenderWidget from './sender-widget';
import {
  FriendMessageEvent,
  GroupMessageEvent,
  IdType,
  Message,
  MessageContent,
  StrangerMessageEvent,
} from 'api';
import { getAvatarById } from './common';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { Size, useForceUpdate, useLazyRef, useResizeObserver } from 'hooks';
import SortedSet from 'models/sorted-set';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { SessionKey, messageListState, userInfoState } from 'models/store';
import { webSocketClient } from 'api/websocket-client';
import { produce } from 'immer';

type Props = {
  chatKey: SessionKey;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
  getSenderNameById?: (id: IdType) => Promise<string>;
};

export default function ChatWidget({ chatKey, sendMessage, getSenderNameById }: Props) {
  const earliestMessageIdRef = useRef<IdType | undefined>(undefined);
  const { id: currentUserId } = useRecoilValue(userInfoState);
  const messageListLoadable = useRecoilValueLoadable(messageListState(chatKey));
  const setMessageList = useSetRecoilState(messageListState(chatKey));

  const renderMessage = useCallback(
    async (type: FetchItemsType) => {
      if (type === 'next') return [];

      if (messageListLoadable.state !== 'hasValue') return [];

      const messages = messageListLoadable.contents;
      earliestMessageIdRef.current = messages[0].id;
      return messages.map(({ id, senderId, content, timestamp }, index) => (
        <MessageTextItem
          key={id}
          avatar={getAvatarById(id)}
          content={content}
          timestamp={timestamp}
          highlight={senderId === currentUserId}
          getSenderName={async () => (getSenderNameById ? await getSenderNameById(senderId) : '')}
        />
      ));
    },
    [currentUserId, getSenderNameById, messageListLoadable.contents, messageListLoadable.state]
  );

  useEffect(() => {
    const friendToken = webSocketClient.subscribe<FriendMessageEvent>('friend/message', (e) => {
      if (e.senderId !== chatKey.contactId) return;
      setMessageList((prev) => [
        ...prev,
        { id: e.id, senderId: e.senderId, content: [...e.content], timestamp: e.timestamp },
      ]);
    });
    const strangerToken = webSocketClient.subscribe<StrangerMessageEvent>(
      'stranger/message',
      (e) => {
        if (e.senderId !== chatKey.contactId) return;
        setMessageList((prev) => [
          ...prev,
          { id: e.id, senderId: e.senderId, content: [...e.content], timestamp: e.timestamp },
        ]);
      }
    );
    const groupToken = webSocketClient.subscribe<GroupMessageEvent>('group/message', (e) => {
      if (e.senderId !== chatKey.contactId) return;
      setMessageList((prev) => [
        ...prev,
        { id: e.id, senderId: e.senderId, content: [...e.content], timestamp: e.timestamp },
      ]);
    });

    return () => {
      friendToken();
      strangerToken();
      groupToken();
    };
  }, [chatKey.contactId, setMessageList]);

  return (
    <div className="ChatWidget">
      <div className="ChatWidget__messageList">
        <InfiniteScrollingListBox renderItems={renderMessage} />
        {/* <MessageList fetchAsync={fetchAsync} getSenderNameById={getSenderNameById} /> */}
      </div>
      <div className="ChatWidget__inputBox">
        <SenderWidget
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
  const { id: currentUserId } = useRecoilValue(userInfoState);

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
                <MessageTextItem
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
