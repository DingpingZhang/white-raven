import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { IdType, MessageSegment, SessionType } from 'api';
import { ReactComponent as CloseIcon } from 'images/close.svg';
import HighlightSpan from 'components/highlight-span';
import { useLastMessage } from 'models/store';

export type Props = {
  sessionType: SessionType;
  contactId: IdType;
  avatar: string;
  name: string;
  unreadCount: number;
  queriesText: string;
  selected?: boolean;
  onSelected?: () => void;
  onRemoved?: () => void;
};

export default function SessionItem({
  sessionType,
  contactId,
  unreadCount,
  queriesText,
  selected,
  avatar,
  name,
  onSelected,
  onRemoved,
}: Props) {
  const lastMessage = useLastMessage(sessionType, contactId);
  const contactItemClass = classNames('SessionItem', {
    hasMessage: unreadCount,
    selected,
  });

  const messageSummary = lastMessage?.content.map(convertToHtmlElement).join('');

  return (
    <div className={contactItemClass} onClick={onSelected}>
      <span className="SessionItem__redDot"></span>
      <img className="SessionItem__avatar" src={avatar} alt="avatar" />
      <HighlightSpan
        className="SessionItem__title text ellipsis"
        sourceText={name}
        queriesText={queriesText}
      />
      <button
        className="SessionItem__btnClose"
        onClick={e => {
          e.stopPropagation();
          onRemoved && onRemoved();
        }}
      >
        <CloseIcon className="SessionItem__iconClose" />
      </button>
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
    case 'image':
      // TODO: I18n
      return '[image]';
    default:
      return '';
  }
}
