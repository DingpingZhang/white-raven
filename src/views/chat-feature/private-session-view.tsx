import { FriendSession, sendMessageToFriend, sendMessageToStranger, StrangerSession } from 'api';
import { toDisplayTimestamp } from 'helpers';
import { messageListState, userInfoState } from 'models/store';
import useLastMessage from 'models/use-last-message';
import { useRecoilValue } from 'recoil';
import ChatWidget from './chat-widget';

type Props = {
  session: FriendSession | StrangerSession;
};

export default function PrivateSessionView({ session }: Props) {
  const messageList = useRecoilValue(
    messageListState({ contactId: session.contact.id, type: 'group' })
  );
  const lastMessage = useLastMessage(messageList);
  const { id } = useRecoilValue(userInfoState);

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
        chatKey={{ type: session.type, contactId: session.contact.id }}
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
