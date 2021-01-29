import { useEffect, useState } from 'react';
import { getGroupMembers, GroupMemberInfo, GroupSession } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { getDisplayTimestamp } from 'helpers';
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
    <div className="GroupChatView">
      <div className="GroupChatView__chatArea">
        <div className="GroupChatView__titleBar">
          <img
            className="GroupChatView__chatAvatar"
            src={selectedItem.contact.avatar}
            alt="avatar"
          />
          <span className="GroupChatView__chatTitle">{selectedItem.contact.name}</span>
          <span className="GroupChatView__chatSubtitle">
            {getDisplayTimestamp(lastMessage.timestamp)}
          </span>
        </div>
        <ChatControl />
      </div>
      <div className="GroupChatView__infoArea">
        <div className="GroupChatView__infoCard">
          <div className="GroupChatView__infoTitle">Group Info</div>
          <div className="GroupChatView__infoContent"></div>
        </div>
        <div className="GroupChatView__member">
          <div className="GroupChatView__memberTitle">Group Members</div>
          <div className="GroupChatView__memberList">
            <VirtualizingListBox
              sizeProvider={{ itemSize: 32, itemCount: members.length }}
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
