import React, { useCallback, useContext, useRef } from 'react';
import InfiniteScrollingListBox, { FetchItemsType } from 'components/infinite-scrolling-list-box';
import BasicMessage from './messages/basic-message';
import MessageSendBox from './messages/message-send-box';
import { IdType, Message } from 'api';
import { GlobalContext } from 'models/global-context';
import { getAvatarById } from './messages/common';

type Props = {
  fetchAsync: (startId?: IdType) => Promise<ReadonlyArray<Message>>;
  getSenderNameById?: (id: IdType) => Promise<string>;
};

export default function ChatControl({ fetchAsync, getSenderNameById }: Props) {
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
      </div>
      <div className="ChatControl__inputBox">
        <MessageSendBox />
      </div>
    </div>
  );
}
