import { FriendSession, sendMessageToFriend, sendMessageToStranger, StrangerSession } from 'api';
import { toDisplayTimestamp } from 'helpers';
import { useLastMessage, useUserInfo } from 'models/logged-in-context';
import ChatWidget from './chat-widget';

type Props = {
  session: FriendSession | StrangerSession;
};

export default function PrivateSessionView({ session }: Props) {
  const lastMessage = useLastMessage(session.type, session.contact.id);
  const { id } = useUserInfo();

  return (
    <div className="PrivateSessionView">
      <div className="PrivateSessionView__titleBar">
        <img className="PrivateSessionView__avatar" src={session.contact.avatar} alt="avatar" />
        <span className="PrivateSessionView__title">{session.contact.name}</span>
        <span className="PrivateSessionView__subtitle">
          {lastMessage ? toDisplayTimestamp(lastMessage.timestamp) : null}
        </span>
      </div>
      <ChatWidget
        sessionType={session.type}
        contactId={session.contact.id}
        sendMessage={async messageContent => {
          const send = session.type === 'friend' ? sendMessageToFriend : sendMessageToStranger;

          const response = await send(session.contact.id, {
            content: { type: 'normal', content: messageContent },
          });
          if (response.code === 200) {
            const { id: messageId, timestamp } = response.content;
            return {
              type: 'normal',
              id: messageId,
              senderId: id,
              recipientId: session.contact.id,
              content: messageContent,
              timestamp,
            };
          } else {
            return null;
          }
        }}
      />
    </div>
  );
}
