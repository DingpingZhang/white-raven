import { IdType } from './basic';
import { Message } from './message';

export type GroupMember = {};

export type GroupInfo = {
  id: IdType;
  name: string;
  avatar: string;
  members: ReadonlyArray<GroupMember>;
};

export type GroupSession = GroupInfo & {
  messages: ReadonlyArray<Message>;
};

export type PersonInfo = {};

export type PersonSession = {};
