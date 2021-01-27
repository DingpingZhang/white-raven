import React, { useEffect, useState } from 'react';
import { Switch } from '../components/switch';
import { useNavigator } from '../components/switch-host';
import { getDisplayTimestamp } from '../helpers';
import { CONTACT_LIST } from '../mocks/contact';
import ChatControl from './chat-control';
import { SWITCH_NAME } from './constants';
import SessionListControl from './session-list-control';

export default function PrivateChatView() {
  const [selectedItem, setSelectedItem] = useState(CONTACT_LIST[0]);
  const chatControlNavigator = useNavigator(SWITCH_NAME.CHAT_PRIVATE);
  useEffect(() => chatControlNavigator(selectedItem.title, selectedItem), [
    chatControlNavigator,
    selectedItem,
    selectedItem.title,
  ]);

  return (
    <div className="private-chat-view">
      <div className="contact-list-area">
        <SessionListControl
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
        <Switch
          name={SWITCH_NAME.CHAT_PRIVATE}
          contentProvider={{
            isValidLabel: () => true,
            getRenderer: (sessionId) => () => <ChatControl />,
          }}
          animation={{ className: 'fade-in-out', timeout: 200 }}
        />
      </div>
    </div>
  );
}
