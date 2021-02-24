import React, { useEffect } from 'react';
import MessageTextItem from './message-text-item';
import SenderWidget from './sender-widget';
import {
  FriendMessageEvent,
  GroupMessageEvent,
  Message,
  MessageContent,
  StrangerMessageEvent,
} from 'api';
import { useRecoilValue } from 'recoil';
import { SessionKey, userInfoState } from 'models/store';
import { webSocketClient } from 'api/websocket-client';
import { filter } from 'rxjs/operators';
import MessageListWidget from './message-list-widget';
import { useMessageList } from 'models/use-message';

type Props = {
  chatKey: SessionKey;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
};

export default function ChatWidget({ chatKey, sendMessage }: Props) {
  const { id: currentUserId } = useRecoilValue(userInfoState);
  const messageList = useMessageList(chatKey.type, chatKey.contactId);

  useEffect(() => {
    const friendToken = webSocketClient
      .filter<FriendMessageEvent>('friend/message')
      .pipe(filter((e) => e.senderId === chatKey.contactId))
      .subscribe((e) => {
        messageList.pushItem({
          id: e.id,
          senderId: e.senderId,
          content: [...e.content],
          timestamp: e.timestamp,
        });
      });
    const strangerToken = webSocketClient
      .filter<StrangerMessageEvent>('stranger/message')
      .pipe(filter((e) => e.senderId === chatKey.contactId))
      .subscribe((e) => {
        messageList.pushItem({
          id: e.id,
          senderId: e.senderId,
          content: [...e.content],
          timestamp: e.timestamp,
        });
      });
    const groupToken = webSocketClient
      .filter<GroupMessageEvent>('group/message')
      .pipe(filter((e) => e.groupId === chatKey.contactId))
      .subscribe((e) => {
        messageList.pushItem({
          id: e.id,
          senderId: e.senderId,
          content: [...e.content],
          timestamp: e.timestamp,
        });
      });

    return () => {
      friendToken.unsubscribe();
      strangerToken.unsubscribe();
      groupToken.unsubscribe();
    };
  }, [chatKey.contactId, messageList]);

  return (
    <div className="ChatWidget">
      <div className="ChatWidget__messageList">
        <MessageListWidget
          messageList={messageList}
          renderItem={({ id, senderId, content, timestamp }) => (
            <MessageTextItem
              key={id}
              contactType={chatKey.type}
              contactId={chatKey.contactId}
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
