import { FriendSession, StrangerSession } from 'api';
import { getDisplayTimestamp } from 'helpers';
import ChatControl from './chat-control';

type PrivateChatViewProps = {
  selectedItem: FriendSession | StrangerSession;
};

export default function PrivateChatView({ selectedItem }: PrivateChatViewProps) {
  const lastMessage = selectedItem.lastMessages[selectedItem.lastMessages.length - 1];

  return (
    <div className="PrivateChatView">
      <div className="PrivateChatView__titleBar">
        <img className="PrivateChatView__avatar" src={selectedItem.contact.avatar} alt="avatar" />
        <span className="PrivateChatView__title">{selectedItem.contact.name}</span>
        <span className="PrivateChatView__subtitle">
          {getDisplayTimestamp(lastMessage.timestamp)}
        </span>
      </div>
      <ChatControl />
    </div>
  );
}
