import {
  FriendSession,
  getFriendMessages,
  getStrangerMessages,
  IdType,
  sendMessageToFriend,
  sendMessageToStranger,
  StrangerSession,
} from 'api';
import { toDisplayTimestamp } from 'helpers';
import { GlobalContext } from 'models/global-context';
import { useCallback, useContext } from 'react';
import ChatWidget from './chat-widget';

type Props = {
  session: FriendSession | StrangerSession;
};

export default function PrivateSessionView({ session }: Props) {
  const lastMessage = session.lastMessages[session.lastMessages.length - 1];

  const fetchMessages = useCallback(
    async (startId?: IdType) => {
      const response =
        session.type === 'friend'
          ? await getFriendMessages(session.contact.id, startId)
          : await getStrangerMessages(session.contact.id, startId);
      return response.code === 200 ? response.content : [];
    },
    [session.contact.id, session.type]
  );
  const { id } = useContext(GlobalContext);

  return (
    <div className="PrivateSessionView">
      <div className="PrivateSessionView__titleBar">
        <img className="PrivateSessionView__avatar" src={session.contact.avatar} alt="avatar" />
        <span className="PrivateSessionView__title">{session.contact.name}</span>
        <span className="PrivateSessionView__subtitle">
          {toDisplayTimestamp(lastMessage.timestamp)}
        </span>
      </div>
      <ChatWidget
        fetchAsync={fetchMessages}
        sendMessage={async (content) => {
          const send = session.type === 'friend' ? sendMessageToFriend : sendMessageToStranger;

          const response = await send(session.contact.id, { content });
          if (response.code === 200) {
            const { id: messageId, timestamp } = response.content;
            return { id: messageId, senderId: id, content, timestamp };
          } else {
            return null;
          }
        }}
      />
    </div>
  );
}
