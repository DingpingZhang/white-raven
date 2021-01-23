import { MessageContent } from './message';

export type ContactSummary = {
  avatar: string;
  title: string;
  subtitle: MessageContent;
  lastActivityTimestamp: number;
  unreadCount: number;
};

export type ContactSummaryList = {
  selctedIndex: number;
  items: ReadonlyArray<ContactSummary>;
};
