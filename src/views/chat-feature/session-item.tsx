import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { FriendMessageEvent, GroupMessageEvent, IdType, MessageSegment, SessionType, StrangerMessageEvent } from 'api';
import { ReactComponent as CloseIcon } from 'images/close.svg';
import HighlightSpan from 'components/highlight-span';
import { useLastMessage, useMessageList } from 'models/logged-in-context';
import { webSocketClient } from 'api/websocket-client';
import { useEffect } from 'react';
import { scheduled, asyncScheduler } from 'rxjs';
import { mergeAll, filter } from 'rxjs/operators';

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

  const messageList = useMessageList(sessionType, contactId);

  // 订阅 Message 事件。
  useEffect(() => {
    if (!messageList) return;

    const token = scheduled(
      [
        webSocketClient.event<FriendMessageEvent>('friend/message'),
        webSocketClient.event<StrangerMessageEvent>('stranger/message'),
        webSocketClient.event<GroupMessageEvent>('group/message'),
      ],
      asyncScheduler
    )
      .pipe(mergeAll(), filter(filterCurrentContact(contactId)))
      .subscribe(e => messageList.pushItem(e.message));

    return () => token.unsubscribe();
  }, [contactId, messageList]);

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

function filterCurrentContact(contactId: IdType) {
  return (e: FriendMessageEvent | StrangerMessageEvent | GroupMessageEvent) => {
    const { senderId, recipientId } = e.message;
    return e.type === 'group/message'
      ? e.groupId === contactId
      : senderId === contactId || recipientId === contactId;
  };
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
