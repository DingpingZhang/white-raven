import {
  getFriendMessage,
  getGroupMessage,
  getStrangerMessage,
  IdType,
  Message,
  QuoteMessage,
  SessionType,
} from 'api';
import { toDisplayTimestamp } from 'helpers';
import { useAsyncValue } from 'hooks/use-api';
import { ChatContext, useSenderInfo } from 'models/chat-context';
import { fallbackHttpApi } from 'models/logged-in-context';
import { useCallback, useContext, useMemo } from 'react';
import { MessageSegments } from 'views/chat-feature/message-segments';

type Props = {
  message: QuoteMessage;
};

export default function MessageQuoteContent({ message }: Props) {
  const { quote, content } = message;
  const getMassageById = useGetMessage();
  const getMessage = useCallback(() => getMassageById(message.prevId), [
    getMassageById,
    message.prevId,
  ]);
  const prevMessage = useAsyncValue(getMessage, null);
  const { avatar, name } = useSenderInfo(prevMessage?.senderId);

  return (
    <div className="MessageQuoteContent">
      <div className="MessageQuoteContent__quoteArea">
        <div className="MessageQuoteContent__quoteTitleBar">
          <img className="MessageQuoteContent__avatar" src={avatar} alt="avatar" />
          <span className="MessageQuoteContent__name text tip-secondary">{name}</span>
          <span className="MessageQuoteContent__timestamp">
            {prevMessage ? toDisplayTimestamp(prevMessage.timestamp) : null}
          </span>
        </div>
        <MessageSegments segments={quote} />
      </div>
      <div className="MessageQuoteContent__replyArea">
        <MessageSegments segments={content} />
      </div>
    </div>
  );
}

function useGetMessage() {
  const { sessionType, contactId } = useContext(ChatContext);
  return useMemo(() => getGetMessage(sessionType, contactId), [contactId, sessionType]);
}

function getRequestMessageById(sessionType: SessionType, contactId: IdType) {
  switch (sessionType) {
    case 'friend':
      return (id: IdType) => getFriendMessage(contactId, id);
    case 'stranger':
      return (id: IdType) => getStrangerMessage(contactId, id);
    case 'group':
      return (id: IdType) => getGroupMessage(contactId, id);
  }
}

function getGetMessage(sessionType: SessionType, contactId: IdType) {
  return (id: IdType) =>
    fallbackHttpApi<Message | null>(() => getRequestMessageById(sessionType, contactId)(id), null);
}
