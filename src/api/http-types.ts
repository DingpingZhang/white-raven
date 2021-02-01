import { MessageContent, IdType } from './basic-types';

// ***************************************************
// Request
// ***************************************************

export type MessageBody = {
  content: MessageContent;
};

// ***************************************************
// Response
// ***************************************************

export type Ok<T> = {
  code: 200;
  content: T;
};

export type Err<T> = {
  code: 500;
  errorCode: T;
  detailMsg: string;
};

export type MessageResponse = {
  id: IdType;
  timestamp: number;
};
