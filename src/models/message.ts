import { IdType } from './basic-types';

export type TextMessage = {
  type: 'text';
  data: {
    text: string;
  };
};

export type ImageMessage = {
  type: 'image';
  data: {
    file: string;
  };
};

export type FaceMessage = {
  type: 'face';
  data: {
    id: string;
  };
};

export type AtMessage = {
  type: 'at';
  data: {
    qq: string;
  };
};

export type MessageSegment = TextMessage | ImageMessage | FaceMessage | AtMessage;

export type MessageContent = ReadonlyArray<MessageSegment>;

export type Message = {
  id: IdType;
  sender: IdType;
  content: MessageContent;
  timestamp: number;
};
