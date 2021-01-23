import React, { useCallback, useRef, useState } from 'react';
import InfiniteScrollingListBox, {
  FetchItemsType,
} from '../components/infinite-scrolling-list-box';
import { VirtualizingListBox } from '../components/virtualizing-list-box';
import { CONTACT_LIST } from '../mocks/contact-list';
import { MESSAGE_LIST } from '../mocks/message-list';
import ContactItem from './contact-item';
import ContactSearchBox from './contact-search-box';
import BasicMessage from './messages/basic-message';
import MessageSendBox from './messages/message-send-box';

export default function PrivateChatView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const messageCountRef = useRef(0);
  const selectedItem = CONTACT_LIST[selectedIndex];
  const renderMessage = useCallback((type: FetchItemsType) => {
    switch (type) {
      case 'initial':
      case 'previous':
        messageCountRef.current += MESSAGE_LIST.length;
        return MESSAGE_LIST.map((item, index) => (
          <BasicMessage key={`${messageCountRef.current}-${index}`} {...item} />
        ));
      case 'next':
        return [];
    }
  }, []);

  return (
    <div className="private-chat-view">
      <div className="contact-list-area">
        <ContactSearchBox />
        <VirtualizingListBox
          sizeProvider={{ itemSize: 108, itemCount: CONTACT_LIST.length }}
          renderItems={(startIndex, endIndex) =>
            CONTACT_LIST.slice(startIndex, endIndex).map((item, index) => (
              <ContactItem
                {...item}
                selected={selectedIndex === index}
                onSelected={() => setSelectedIndex(index)}
              />
            ))
          }
        />
      </div>
      <div className="chat-area">
        <div className="chat-title-bar">
          <img className="avatar" src={selectedItem.avatar} alt="avatar" />
          <span className="text-title">{selectedItem.username}</span>
          <span className="text-subtitle">{selectedItem.lastMessageTimestamp}</span>
        </div>
        <div className="chat-message-list">
          <InfiniteScrollingListBox renderItems={renderMessage} />
        </div>
        <div className="chat-input-box">
          <MessageSendBox />
        </div>
      </div>
    </div>
  );
}
