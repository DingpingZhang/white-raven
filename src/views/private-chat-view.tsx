import {
  FriendSession,
  getFriendMessages,
  getStrangerMessages,
  IdType,
  StrangerSession,
} from 'api';
import { getDisplayTimestamp } from 'helpers';
import { useCallback } from 'react';
import ChatControl from './chat-control';

type PrivateChatViewProps = {
  selectedItem: FriendSession | StrangerSession;
};

export default function PrivateChatView({ selectedItem }: PrivateChatViewProps) {
  const lastMessage = selectedItem.lastMessages[selectedItem.lastMessages.length - 1];

  const fetchMessages = useCallback(
    async (startId?: IdType) => {
      const response =
        selectedItem.type === 'friend'
          ? await getFriendMessages(selectedItem.contact.id, startId)
          : await getStrangerMessages(selectedItem.contact.id, startId);
      return response.code === 200 ? response.content : [];
    },
    [selectedItem.contact.id, selectedItem.type]
  );

  return (
    <div className="PrivateChatView">
      <div className="PrivateChatView__titleBar">
        <img className="PrivateChatView__avatar" src={selectedItem.contact.avatar} alt="avatar" />
        <span className="PrivateChatView__title">{selectedItem.contact.name}</span>
        <span className="PrivateChatView__subtitle">
          {getDisplayTimestamp(lastMessage.timestamp)}
        </span>
      </div>
      <ChatControl fetchAsync={fetchMessages} />
    </div>
  );
}
