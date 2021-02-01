import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { Message, MessageSegment } from 'api';

export type Props = {
  avatar: string;
  name: string;
  unreadCount: number;
  lastMessage?: Message;
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
}: Props) {
  const contactItemClass = classNames('SessionItem', {
    hasMessage: unreadCount,
    selected,
  });

  const messageSummary = lastMessage?.content.map(convertToHtmlElement).join('');

  return (
    <div className={contactItemClass} onClick={onSelected}>
      <span className="SessionItem__redDot"></span>
      <img className="SessionItem__avatar" src={avatar} alt="avatar" />
      <span className="SessionItem__title">{name}</span>
      {lastMessage ? (
        <span className="SessionItem__subtitle">{toDisplayTimestamp(lastMessage.timestamp)}</span>
      ) : null}
      <span className="SessionItem__message text ellipsis" title={messageSummary}>
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
