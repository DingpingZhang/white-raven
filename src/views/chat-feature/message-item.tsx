import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { Message } from 'api';
import { useMemo } from 'react';
import { useUserInfo } from 'models/logged-in-context';
import { useAtClicked, useSenderInfo } from 'models/chat-context';
import MessageNormalContent from './message-normal-content';
import MessageQuoteContent from './message-quote-content';

type Props = {
  message: Message;
  ref?: (element: HTMLElement | null) => void;
};

export default function MessageItem({ message, ref }: Props) {
  const { senderId, timestamp } = message;
  const atClicked = useAtClicked();
  const { id: currentUserId } = useUserInfo();
  const { avatar, name } = useSenderInfo(senderId);

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

  const messageBoxClass = classNames('MessageItem__messageContent', {
    highlight: senderId === currentUserId,
  });

  return (
    <div ref={ref} className="MessageItem">
      {name ? <span className="MessageItem__senderName text tip-secondary">{name}</span> : null}
      <img
        className="MessageItem__avatar"
        src={avatar}
        alt="avatar"
        onClick={e => {
          e.stopPropagation();
          atClicked.next({ targetId: senderId });
        }}
      />
      <div className={messageBoxClass}>{messageContent}</div>
      <span className="MessageItem__timestamp">{toDisplayTimestamp(timestamp)}</span>
    </div>
  );
}
