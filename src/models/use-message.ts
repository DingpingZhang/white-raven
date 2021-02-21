import { getFriendMessages, getGroupMessages, getStrangerMessages, IdType, Message } from 'api';
import { lastItemOrDefault } from 'helpers/list-helpers';
import { useState, useEffect, createContext, useContext } from 'react';
import MessageList from './message-list';
import { fallbackHttpApi } from './store';

export function useLastMessage(messageList: MessageList) {
  const [lastMessage, setLastMessage] = useState<Message | null>(() =>
    lastItemOrDefault(messageList.storage.items)
  );
  useEffect(() => {
    const handler = () => setLastMessage(lastItemOrDefault(messageList.storage.items));
    const token = messageList.itemsChanged.subscribe(handler);
    return () => token.unsubscribe();
  }, [messageList]);

  return lastMessage;
}

export const MessageListContext = createContext<Map<IdType, MessageList>>(
  new Map<IdType, MessageList>()
);

export function useMessageList(type: 'friend' | 'stranger' | 'group', id: IdType) {
  const messageListStore = useContext(MessageListContext);
  if (!messageListStore.has(id)) {
    const getPrevMessages = getGetMessages(type);
    messageListStore.set(
      id,
      new MessageList(async (startId, _, prev) =>
        prev ? await fallbackHttpApi(() => getPrevMessages(id, startId), []) : []
      )
    );
  }

  return messageListStore.get(id)!;
}

function getGetMessages(type: 'friend' | 'stranger' | 'group') {
  switch (type) {
    case 'friend':
      return getFriendMessages;
    case 'stranger':
      return getStrangerMessages;
    case 'group':
      return getGroupMessages;
  }
}
