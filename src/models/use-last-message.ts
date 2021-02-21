import { Message } from 'api';
import { lastItemOrDefault } from 'helpers/list-helpers';
import { useState, useEffect } from 'react';
import MessageList, { ItemsChangedInfo } from './message-list';

export default function useLastMessage(messageList: MessageList) {
  const [lastMessage, setLastMessage] = useState<Message | null>(() =>
    lastItemOrDefault(messageList.storage.items)
  );
  useEffect(() => {
    const handler = (e: ItemsChangedInfo) => {
      if (e.type === 'push') {
        setLastMessage(lastItemOrDefault(messageList.storage.items));
      }
    };
    const token = messageList.itemsChanged.subscribe(handler);
    return () => token.unsubscribe();
  }, [messageList]);

  return lastMessage;
}
