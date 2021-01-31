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
  socket.onopen = (event) => {
    console.log('onopen');
    console.log(event);
  };
  socket.onmessage = (event) => {
    console.log('onmessage');
    console.log(event);
    // callback(event.data);
  };
  socket.onerror = (event) => {
    console.log('onerror');
    console.log(event);
  };
  socket.onclose = (event) => {
    console.log('onclose');
    console.log(event);
  };
}
