import { FriendSession, StrangerSession } from '../api';
import { getDisplayTimestamp } from '../helpers';
import ChatControl from './chat-control';

type PrivateChatViewProps = {
  selectedItem: FriendSession | StrangerSession;
};

export default function PrivateChatView({ selectedItem }: PrivateChatViewProps) {
  const lastMessage = selectedItem.lastMessages[selectedItem.lastMessages.length - 1];

  return (
    <div className="private-chat-view">
      <div className="private-chat-title-bar">
        <img className="avatar" src={selectedItem.contact.avatar} alt="avatar" />
        <span className="text-title">{selectedItem.contact.name}</span>
        <span className="text-subtitle">{getDisplayTimestamp(lastMessage.timestamp)}</span>
      </div>
      <ChatControl />
    </div>
  );
}
