import React, { useState } from 'react';
import { getDisplayTimestamp } from '../helpers';
import { CONTACT_LIST } from '../mocks/contact-list';
import ChatControl from './chat-control';
import ContactListControl from './contact-list-control';

export default function PrivateChatView() {
  const [selectedItem, setSelectedItem] = useState(CONTACT_LIST[0]);

  return (
    <div className="private-chat-view">
      <div className="contact-list-area">
        <ContactListControl
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          items={CONTACT_LIST}
        />
      </div>
      <div className="chat-area">
        <div className="private-chat-title-bar">
          <img className="avatar" src={selectedItem.avatar} alt="avatar" />
          <span className="text-title">{selectedItem.title}</span>
          <span className="text-subtitle">
            {getDisplayTimestamp(selectedItem.lastActivityTimestamp)}
          </span>
        </div>
        <ChatControl />
      </div>
    </div>
  );
}
