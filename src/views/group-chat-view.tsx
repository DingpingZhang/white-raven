import { useEffect, useState } from 'react';
import { getGroupMembers, GroupMemberInfo, GroupSession } from '../api';
import { VirtualizingListBox } from '../components/virtualizing-list-box';
import { getDisplayTimestamp } from '../helpers';
import ChatControl from './chat-control';
import GroupMemberItem from './group-member-item';

type GroupChatViewProps = {
  selectedItem: GroupSession;
};

export default function GroupChatView({ selectedItem }: GroupChatViewProps) {
  const lastMessage = selectedItem.lastMessages[selectedItem.lastMessages.length - 1];
  const [members, setMembers] = useState<GroupMemberInfo[]>([]);
  useEffect(() => {
    const fetchMembers = async () => {
      const response = await getGroupMembers(selectedItem.contact.id);
      if (response.code === 200) {
        setMembers([...response.content]);
      }
    };

    fetchMembers();
  }, [selectedItem.contact.id]);

  return (
    <div className="group-chat-view">
      <div className="group-chat-area">
        <div className="group-chat-title-bar">
          <img className="avatar" src={selectedItem.contact.avatar} alt="avatar" />
          <span className="text-title">{selectedItem.contact.name}</span>
          <span className="text-subtitle">{getDisplayTimestamp(lastMessage.timestamp)}</span>
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
          <div className="group-members-list">
            <VirtualizingListBox
              sizeProvider={{ itemSize: 32, itemCount: selectedItem.contact.memberCount }}
              renderItems={(startIndex, endIndex) =>
                members
                  .slice(startIndex, endIndex)
                  .map((item) => <GroupMemberItem avatar={item.avatar} name={item.name} />)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
