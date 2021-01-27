import classNames from 'classnames';
import { getDisplayTimestamp } from '../helpers';
import { Message, MessageSegment } from '../models';

export type ContactItemProps = {
  avatar: string;
  name: string;
  lastMessage: Message;
  unreadCount: number;
  selected?: boolean;
  onSelected?: () => void;
};

export default function SessionItem({
  unreadCount,
  selected,
  avatar,
  name,
  lastMessage,
  onSelected,
}: ContactItemProps) {
  const contactItemClass = classNames('session-item', {
    'has-message': unreadCount,
    selected,
  });

  const messageSummary = lastMessage.content.map(convertToHtmlElement);

  return (
    <div className={contactItemClass} onClick={onSelected}>
      <span className="red-dot"></span>
      <img className="avatar" src={avatar} alt="avatar" />
      <span className="username">{name}</span>
      <span className="last-message-time">{getDisplayTimestamp(lastMessage.timestamp)}</span>
      <span className="last-message text ellipsis" title={messageSummary.join('')}>
        {messageSummary}
      </span>
    </div>
  );
}

function convertToHtmlElement(message: MessageSegment) {
  switch (message.type) {
    case 'text':
      return message.text;
    case 'at':
      return `@${message.targetId} `;
    case 'face':
      return `[face:${message.faceId}]`;
    case 'image':
      // TODO: I18n
      return '[image]';
    default:
      return '';
  }
}
