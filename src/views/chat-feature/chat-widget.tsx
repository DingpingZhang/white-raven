import { useCallback, useEffect } from 'react';
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
import { useContactList, useGroupMemberList, useMessageList } from 'models/logged-in-context';
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

  // 初始化 getContactById 方法，用于根据指定的 Id，从联系人列表及当前群成员（如果是群会话）中找到对应的实例。
  // 若非群会话，groupMemberList 返回 []。
  // FIXME: 感觉分成 GroupContext 和 PrivateContext 更好，可以避免不必要地对群成员列表进行请求。
  const groupMemberList = useGroupMemberList(contactId);
  const contactList = useContactList();
  const getContactById = useCallback(
    (id: IdType) => {
      const contact = contactList.find(item => item.id === id);
      if (contact) {
        return contact;
      } else {
        const groupMember = groupMemberList.find(item => item.id === id);
        return groupMember;
      }
    },
    [contactList, groupMemberList]
  );

  return (
    <ChatContextRoot
      sessionType={sessionType}
      contactId={contactId}
      getContactById={getContactById}
    >
      <InnerChatWidget {...props} />
    </ChatContextRoot>
  );
}

function InnerChatWidget({ sessionType, contactId, sendMessage }: Props) {
  const messageList = useMessageList(sessionType, contactId);

  return (
    <div className="ChatWidget">
      <div className="ChatWidget__messageList">
        <MessageListWidget
          messageList={messageList}
          renderItem={message => <MessageItem key={message.id} message={message} />}
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
