import React, { useCallback, useRef } from 'react';
import InfiniteScrollingListBox, {
  FetchItemsType,
} from 'components/infinite-scrolling-list-box';
import { uuidv4 } from 'helpers';
import { MESSAGE_LIST } from 'mocks/message';
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
          <BasicMessage key={uuidv4()} {...item} highlight={!!(index % 2)} />
        ));
      case 'next':
        return [];
    }
  }, []);

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
