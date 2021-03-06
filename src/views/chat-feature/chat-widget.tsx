import React, { useEffect } from 'react';
import MessageTextItem from './message-text-item';
import SenderWidget from './sender-widget';
import {
  FriendMessageEvent,
  GroupMessageEvent,
  IdType,
  Message,
  MessageContent,
  SessionType,
  StrangerMessageEvent,
} from 'api';
import { webSocketClient } from 'api/websocket-client';
import { filter } from 'rxjs/operators';
import MessageListWidget from './message-list-widget';
import { useMessageList, useUserInfo } from 'models/store';

type Props = {
  sessionType: SessionType;
  contactId: IdType;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
};

export default function ChatWidget({ sessionType, contactId, sendMessage }: Props) {
  const { id: currentUserId } = useUserInfo();
  const messageList = useMessageList(sessionType, contactId);

  useEffect(() => {
    if (!messageList) return;

    const friendToken = webSocketClient
      .filter<FriendMessageEvent>('friend/message')
      .pipe(filter((e) => e.senderId === contactId || e.recipientId === contactId))
      .subscribe((e) => {
        messageList.pushItem({
          id: e.id,
          senderId: e.senderId,
          recipientId: currentUserId,
          content: [...e.content],
          timestamp: e.timestamp,
        });
      });
    const strangerToken = webSocketClient
      .filter<StrangerMessageEvent>('stranger/message')
      .pipe(filter((e) => e.senderId === contactId || e.recipientId === contactId))
      .subscribe((e) => {
        messageList.pushItem({
          id: e.id,
          senderId: e.senderId,
          recipientId: currentUserId,
          content: [...e.content],
          timestamp: e.timestamp,
        });
      });
    const groupToken = webSocketClient
      .filter<GroupMessageEvent>('group/message')
      .pipe(filter((e) => e.groupId === contactId))
      .subscribe((e) => {
        messageList.pushItem({
          id: e.id,
          senderId: e.senderId,
          recipientId: currentUserId,
          content: [...e.content],
          timestamp: e.timestamp,
        });
      });

    return () => {
      friendToken.unsubscribe();
      strangerToken.unsubscribe();
      groupToken.unsubscribe();
    };
  }, [contactId, currentUserId, messageList]);

  return (
    <div className="ChatWidget">
      <div className="ChatWidget__messageList">
        <MessageListWidget
          messageList={messageList}
          renderItem={({ id, senderId, content, timestamp }) => (
            <MessageTextItem
              key={id}
              contactType={sessionType}
              contactId={contactId}
              senderId={senderId}
              content={content}
              timestamp={timestamp}
              highlight={senderId === currentUserId}
            />
          )}
        />
      </div>
      <div className="ChatWidget__inputBox">
        <SenderWidget
          sendMessage={async (content) => {
            const message = await sendMessage(content);
            if (message) {
              // TODO: Add message to message list.
              return true;
            } else {
              return false;
            }
          }}
        />
      </div>
    </div>
  );
}
