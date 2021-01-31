import { IdType, Message } from './basic-types';

type FriendMessageNotification = Message & {
  type: 'friend';
};

type StrangerMessageNotification = Message & {
  type: 'stranger';
  fromGroupId: IdType;
};

type GroupMessageNotification = Message & {
  type: 'group';
  groupId: IdType;
};

export type MessageNotification =
  | FriendMessageNotification
  | StrangerMessageNotification
  | GroupMessageNotification;

export function onMessage(callback: (message: MessageNotification) => void) {
  const socket = new WebSocket('ws://localhost:9500/api/v1/messages');
  socket.onmessage = (event) => {
    console.log(event);
    console.log(event.data);
    // callback(event.data);
  };
}
