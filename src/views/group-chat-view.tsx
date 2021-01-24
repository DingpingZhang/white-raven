import React, { useEffect, useState } from 'react';
import { Switch } from '../components/switch';
import { useNavigator } from '../components/switch-host';
import { VirtualizingListBox } from '../components/virtualizing-list-box';
import { getDisplayTimestamp } from '../helpers';
import { CONTACT_LIST } from '../mocks/contact-list';
import ChatControl from './chat-control';
import { SWITCH_NAME } from './constants';
import ContactListControl from './contact-list-control';
import GroupMemberItem from './group-member-item';

export default function GroupChatView() {
  const [selectedItem, setSelectedItem] = useState(CONTACT_LIST[0]);
  const chatControlNavigator = useNavigator(SWITCH_NAME.CHAT_GROUP);
  useEffect(() => chatControlNavigator(selectedItem.title, selectedItem), [
    chatControlNavigator,
    selectedItem,
    selectedItem.title,
  ]);

  return (
    <div className="group-chat-view">
      <div className="group-list-area">
        <ContactListControl
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          items={CONTACT_LIST}
        />
      </div>
      <div className="chat-area">
        <div className="group-chat-title-bar">
          <img className="avatar" src={selectedItem.avatar} alt="avatar" />
          <span className="text-title">{selectedItem.title}</span>
          <span className="text-subtitle">
            {getDisplayTimestamp(selectedItem.lastActivityTimestamp)}
          </span>
        </div>
        <Switch
          name={SWITCH_NAME.CHAT_GROUP}
          contentProvider={{
            isValidLabel: () => true,
            getRenderer: (sessionId) => () => <ChatControl />,
          }}
        />
      </div>
      <div className="group-info-area">
        <div className="group-info-card">
          <div className="group-info-title">Group Info</div>
          <div className="group-info-content"></div>
        </div>
        <div className="group-members">
          <div className="group-members-title">Group Members</div>
          <VirtualizingListBox
            sizeProvider={{ itemSize: 32, itemCount: CONTACT_LIST.length }}
            renderItems={(startIndex, endIndex) =>
              CONTACT_LIST.slice(startIndex, endIndex).map((item) => (
                <GroupMemberItem avatar={item.avatar} title={item.title} />
              ))
            }
          />
        </div>
      </div>
    </div>
  );
}
