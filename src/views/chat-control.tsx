import React, { useCallback, useRef } from 'react';
import InfiniteScrollingListBox, {
  FetchItemsType,
} from '../components/infinite-scrolling-list-box';
import { MESSAGE_LIST } from '../mocks/message-list';
import BasicMessage from './messages/basic-message';
import MessageSendBox from './messages/message-send-box';

export default function ChatControl() {
  const messageCountRef = useRef(0);
  const renderMessage = useCallback((type: FetchItemsType) => {
    switch (type) {
      case 'initial':
      case 'previous':
        messageCountRef.current += MESSAGE_LIST.length;
        return MESSAGE_LIST.map((item, index) => (
          <BasicMessage
            key={`${messageCountRef.current}-${index}`}
            {...item}
            highlight={!!(index % 2)}
          />
        ));
      case 'next':
        return [];
    }
  }, []);

  return (
    <div className="chat-control">
      <div className="chat-message-list">
        <InfiniteScrollingListBox renderItems={renderMessage} />
      </div>
      <div className="chat-input-box">
        <MessageSendBox />
      </div>
    </div>
  );
}
