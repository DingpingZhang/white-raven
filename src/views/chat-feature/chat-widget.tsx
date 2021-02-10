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
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { SessionKey, messageListState, userInfoState, groupMemberListState } from 'models/store';
import { webSocketClient } from 'api/websocket-client';
import { filter } from 'rxjs/operators';
import LazyLoadingListBox from 'components/lay-loading-list-box';

type Props = {
  chatKey: SessionKey;
  sendMessage: (message: MessageContent) => Promise<Message | null>;
  getSenderNameById?: (id: IdType) => Promise<string>;
};

export default function ChatWidget({ chatKey, sendMessage, getSenderNameById }: Props) {
  // const earliestMessageIdRef = useRef<IdType | undefined>(undefined);
  const { id: currentUserId } = useRecoilValue(userInfoState);
  const messageListLoadable = useRecoilValueLoadable(messageListState(chatKey));
  const setMessageList = useSetRecoilState(messageListState(chatKey));
  const groupMemberListLoadable = useRecoilValueLoadable(groupMemberListState(chatKey.contactId));

  useEffect(() => {
    const friendToken = webSocketClient
      .filter<FriendMessageEvent>('friend/message')
      .pipe(filter((e) => e.senderId === chatKey.contactId))
      .subscribe((e) => {
        setMessageList((prev) => [
          ...prev,
          { id: e.id, senderId: e.senderId, content: [...e.content], timestamp: e.timestamp },
        ]);
      });
    const strangerToken = webSocketClient
      .filter<StrangerMessageEvent>('stranger/message')
      .pipe(filter((e) => e.senderId === chatKey.contactId))
      .subscribe((e) => {
        setMessageList((prev) => [
          ...prev,
          { id: e.id, senderId: e.senderId, content: [...e.content], timestamp: e.timestamp },
        ]);
      });
    const groupToken = webSocketClient
      .filter<GroupMessageEvent>('group/message')
      .pipe(filter((e) => e.groupId === chatKey.contactId))
      .subscribe((e) => {
        setMessageList((prev) => {
          return [
            ...prev,
            { id: e.id, senderId: e.senderId, content: [...e.content], timestamp: e.timestamp },
          ];
        });
      });

    return () => {
      friendToken.unsubscribe();
      strangerToken.unsubscribe();
      groupToken.unsubscribe();
    };
  }, [chatKey.contactId, setMessageList]);

  return (
    <div className="ChatWidget">
      <div className="ChatWidget__messageList">
        <LazyLoadingListBox<Message>
          capacity={200}
          getPreviousItems={() =>
            Promise.resolve(
              messageListLoadable.state === 'hasValue' ? messageListLoadable.contents : []
            )
          }
          getNextItems={() => Promise.resolve([])}
          renderItem={({ id, senderId, content, timestamp }) => (
            <MessageTextItem
              key={id}
              avatar={
                groupMemberListLoadable.state === 'hasValue'
                  ? groupMemberListLoadable.contents.find((item) => item.id === senderId)!.avatar
                  : ''
              }
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
