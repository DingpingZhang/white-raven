import React, { useEffect } from 'react';
import MessageTextItem from './message-text-item';
import SenderWidget from './sender-widget';
import {
  FriendMessageEvent,
  GroupMessageEvent,
  IdType,
  Message,
  MessageContent,
  StrangerMessageEvent,
} from 'api';
import { useRecoilValue } from 'recoil';
import { SessionKey, messageListState, userInfoState, groupMemberListState } from 'models/store';
import { webSocketClient } from 'api/websocket-client';
import { filter } from 'rxjs/operators';
import useRecoilValueLoaded from 'hooks/use-recoil-value-loaded';
import MessageListWidget from './message-list-widget';

type Props = {
  chatKey: SessionKey;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
  getSenderNameById?: (id: IdType) => Promise<string>;
};

export default function ChatWidget({ chatKey, sendMessage, getSenderNameById }: Props) {
  const { id: currentUserId } = useRecoilValue(userInfoState);
  const messageList = useRecoilValue(messageListState(chatKey));
  const groupMemberList = useRecoilValueLoaded(groupMemberListState(chatKey.contactId), []);

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
              avatar={groupMemberList.find((item) => item.id === senderId)?.avatar || ''}
              content={content}
              timestamp={timestamp}
              highlight={senderId === currentUserId}
              getSenderName={async () =>
                getSenderNameById ? await getSenderNameById(senderId) : ''
              }
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
