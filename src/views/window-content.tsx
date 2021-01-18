import { useState } from 'react';
import ScrollViewer from '../components/scroll-viewer';
import { VirtualizingListBox } from '../components/virtualizing-list-box';
import { CONTACT_LIST } from '../mocks/contact-list';
import { MESSAGE_LIST } from '../mocks/message-list';
import ContactItem from './contact-item';
import BasicMessage from './messages/basic-message';
import MessageSendBox from './messages/message-send-box';

export default function WindowContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = CONTACT_LIST[selectedIndex];

  return (
    <div className="window-content">
      <div className="contact-list-area">
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
          <ScrollViewer enableVerticalScrollBar>
            {MESSAGE_LIST.map((item) => (
              <BasicMessage {...item} />
            ))}
          </ScrollViewer>
        </div>
        <div className="chat-input-box">
          <MessageSendBox />
        </div>
      </div>
    </div>
  );
}
