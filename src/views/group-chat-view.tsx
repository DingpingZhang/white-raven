import React, { useState } from 'react';
import { VirtualizingListBox } from '../components/virtualizing-list-box';
import { getDisplayTimestamp } from '../helpers';
import { CONTACT_LIST } from '../mocks/contact-list';
import ChatControl from './chat-control';
import ContactItem from './contact-item';
import ContactListControl from './contact-list-control';
import GroupMemberItem from './group-member-item';

export default function GroupChatView() {
  const [selectedItem, setSelectedItem] = useState(CONTACT_LIST[0]);

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
        <ChatControl />
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
              CONTACT_LIST.slice(startIndex, endIndex).map((item) => <GroupMemberItem {...item} />)
            }
          />
        </div>
      </div>
    </div>
  );
}
