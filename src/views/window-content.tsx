import { useState } from 'react';
import { CONTACT_LIST } from '../mocks/contact-list';
import ContactItem from './contact-item';

export default function WindowContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = CONTACT_LIST[selectedIndex];

  return (
    <div className="window-content">
      <div className="contact-list-area">
        {CONTACT_LIST.map((item, index) => (
          <ContactItem
            {...item}
            selected={selectedIndex === index}
            onSelected={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      <div className="chat-area">
        <div className="chat-title-bar">
          <img className="avatar" src={selectedItem.avatar} alt="avatar" />
          <span className="text-title">{selectedItem.username}</span>
          <span className="text-subtitle">{selectedItem.lastMessageTimestamp}</span>
        </div>
        <div className="chat-message-list"></div>
        <div className="chat-input-box"></div>
      </div>
    </div>
  );
}
