import React, { useCallback, useRef } from 'react';
import InfiniteScrollingListBox, { FetchItemsType } from 'components/infinite-scrolling-list-box';
import BasicMessage from './messages/basic-message';
import MessageSendBox from './messages/message-send-box';
import { IdType, Message } from 'api';

type Props = {
  fetchAsync: (startId?: IdType) => Promise<ReadonlyArray<Message>>;
};

export default function ChatControl({ fetchAsync }: Props) {
  const earliestMessageIdRef = useRef<IdType | undefined>(undefined);
  const renderMessage = useCallback(
    async (type: FetchItemsType) => {
      if (type === 'next') return [];

      const messages = await fetchAsync(earliestMessageIdRef.current);
      if (!messages.length) return [];

      earliestMessageIdRef.current = messages[0].id;
      return messages.map(({ id, senderId, content, timestamp }) => (
        <BasicMessage
          key={id}
          id={id}
          senderId={senderId}
          content={content}
          timestamp={timestamp}
        />
      ));
    },
    [fetchAsync]
  );

  return (
    <div className="ChatControl">
      <div className="ChatControl__messageList">
        <InfiniteScrollingListBox renderItems={renderMessage} />
      </div>
      <div className="ChatControl__inputBox">
        <MessageSendBox />
      </div>
    </div>
  );
}
