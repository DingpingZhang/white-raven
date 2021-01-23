import classNames from 'classnames';
import { getDisplayTimestamp } from '../helpers';
import { ContactSummary } from '../models/contact';
import { MessageSegment } from '../models/message';

export type ContactItemProps = ContactSummary & {
  selected?: boolean;
  onSelected?: () => void;
};

export default function ContactItem({
  unreadCount,
  selected,
  avatar,
  title,
  subtitle,
  lastActivityTimestamp,
  onSelected,
}: ContactItemProps) {
  const contactItemClass = classNames('contact-item', {
    'has-message': unreadCount,
    selected,
  });

  const messageSummary = subtitle.map(convertToHtmlElement);

  return (
    <div className={contactItemClass} onClick={onSelected}>
      <span className="red-dot"></span>
      <img className="avatar" src={avatar} alt="avatar" />
      <span className="username">{title}</span>
      <span className="last-message-time">{getDisplayTimestamp(lastActivityTimestamp)}</span>
      <span className="last-message text ellipsis" title={messageSummary.join('')}>
        {messageSummary}
      </span>
    </div>
  );
}

function convertToHtmlElement(message: MessageSegment) {
  switch (message.type) {
    case 'text':
      return message.data.text;
    case 'at':
      return `@${message.data.qq} `;
    case 'face':
      return `[face:${message.data.id}]`;
    case 'image':
      // TODO: I18n
      return '[image]';
    default:
      return '';
  }
}
