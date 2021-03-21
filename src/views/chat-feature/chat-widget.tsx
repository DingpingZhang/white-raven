import { useEffect } from 'react';
import MessageItem from './message-item';
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
import { filter, mergeAll } from 'rxjs/operators';
import MessageListWidget from './message-list-widget';
import { useMessageList, useUserInfo } from 'models/logged-in-context';
import { asyncScheduler, scheduled } from 'rxjs';
import { ChatContextRoot } from 'models/context-components';

type Props = {
  sessionType: SessionType;
  contactId: IdType;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
};

export default function ChatWidget(props: Props) {
  const { sessionType, contactId } = props;
  const messageList = useMessageList(sessionType, contactId);

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
    <ChatContextRoot sessionType={sessionType} contactId={contactId}>
      <InnerChatWidget {...props} />
    </ChatContextRoot>
  );
}

function InnerChatWidget({ sessionType, contactId, sendMessage }: Props) {
  const { id: currentUserId } = useUserInfo();
  const messageList = useMessageList(sessionType, contactId);

  return (
    <div className="ChatWidget">
      <div className="ChatWidget__messageList">
        <MessageListWidget
          messageList={messageList}
          renderItem={({ id, senderId, content, timestamp }) => (
            <MessageItem
              key={id}
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
          sendMessage={async content => {
            const message = await sendMessage(content);
            // NOTE: 不需要储存该 message，自己发送的消息，也会有 WebSocket 通知，
            // 除非以后有需求，要求先显示发送出的消息，等发送失败再撤回来。
            return !!message;
          }}
        />
      </div>
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
