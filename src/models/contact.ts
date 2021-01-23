import { MessageContent } from './message';

export type ContactInfo = {
  avatar: string;
  title: string;
};

export type SessionSummary = ContactInfo & {
  subtitle: MessageContent;
  lastActivityTimestamp: number;
  unreadCount: number;
};

export type ContactSummaryList = {
  selctedIndex: number;
  items: ReadonlyArray<SessionSummary>;
};
