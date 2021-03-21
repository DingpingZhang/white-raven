import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { Message } from 'api';
import { useContext, useMemo } from 'react';
import { useUserInfo } from 'models/logged-in-context';
import { ChatContext, useAtClicked, useGetContactName } from 'models/chat-context';
import MessageNormalContent from './message-normal-content';
import MessageQuoteContent from './message-quote-content';

type Props = {
  message: Message;
  ref?: (element: HTMLElement | null) => void;
};

export default function MessageItem({ message, ref }: Props) {
  const { sessionType } = useContext(ChatContext);

  const atClicked = useAtClicked();

  const { getContactById } = useContext(ChatContext);
  const getContactName = useGetContactName();

  const { senderId, timestamp } = message;
  const { id: currentUserId } = useUserInfo();
  const avatar = useMemo(() => {
    const contact = getContactById(senderId);
    return contact ? contact.avatar : undefined;
  }, [getContactById, senderId]);
  const senderName = useMemo(
    () => (sessionType === 'group' ? getContactName(senderId) : undefined),
    [sessionType, getContactName, senderId]
  );
  const messageContent = useMemo(() => {
    switch (message.type) {
      case 'normal':
        return <MessageNormalContent message={message} />;
      case 'quote':
        return <MessageQuoteContent message={message} />;
      default:
        // TODO: 写一个更好看的控件来处理不支持的消息类型。
        return <div>Not Supported Message: {message}</div>;
    }
  }, [message]);

  const messageBoxClass = classNames('MessageItem__messageArea', {
    highlight: senderId === currentUserId,
  });

  return (
    <div ref={ref} className="MessageItem">
      {senderName ? (
        <span className="MessageItem__senderName text tip-secondary">{senderName}</span>
      ) : null}
      <img
        className="MessageItem__avatar"
        src={avatar}
        alt="avatar"
        onClick={() => {
          atClicked.next({ targetId: senderId });
        }}
      />
      <div className={messageBoxClass}>
        <div className="MessageItem__messageContent">{messageContent}</div>
      </div>
      <span className="MessageItem__timestamp">{toDisplayTimestamp(timestamp)}</span>
    </div>
  );
}
