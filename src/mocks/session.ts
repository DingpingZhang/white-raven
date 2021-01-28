import { FriendSession, GroupSession, Session, StrangerSession } from '../api';
import { getMockItems } from './common';
import { getFriends, getGroups, getStrangers } from './contact';
import { getMessages } from './message';

export function getMockSessions(count: number): ReadonlyArray<Session> {
  const friendCount = Math.random() * count;
  const strangerCount = Math.random() * (count - friendCount);
  const groupCount = count - friendCount - strangerCount;

  return [
    ...getMockItems(FRIEND_SESSION_LIST, friendCount),
    ...getMockItems(STRANGER_SESSION_LIST, strangerCount),
    ...getMockItems(GROUP_SESSION_LIST, groupCount),
  ];
}

export const FRIEND_SESSION_LIST: ReadonlyArray<FriendSession> = [
  { type: 'friend', unreadCount: 0, lastMessages: getMessages(10), contact: getFriends(1)[0] },
  { type: 'friend', unreadCount: 1, lastMessages: getMessages(10), contact: getFriends(1)[0] },
  { type: 'friend', unreadCount: 10, lastMessages: getMessages(10), contact: getFriends(1)[0] },
  { type: 'friend', unreadCount: 0, lastMessages: getMessages(10), contact: getFriends(1)[0] },
  { type: 'friend', unreadCount: 30, lastMessages: getMessages(10), contact: getFriends(1)[0] },
];

export const STRANGER_SESSION_LIST: ReadonlyArray<StrangerSession> = [
  { type: 'stranger', unreadCount: 0, lastMessages: getMessages(10), contact: getStrangers(1)[0] },
  { type: 'stranger', unreadCount: 1, lastMessages: getMessages(10), contact: getStrangers(1)[0] },
  { type: 'stranger', unreadCount: 10, lastMessages: getMessages(10), contact: getStrangers(1)[0] },
  { type: 'stranger', unreadCount: 0, lastMessages: getMessages(10), contact: getStrangers(1)[0] },
  { type: 'stranger', unreadCount: 30, lastMessages: getMessages(10), contact: getStrangers(1)[0] },
];

export const GROUP_SESSION_LIST: ReadonlyArray<GroupSession> = [
  { type: 'group', unreadCount: 0, lastMessages: getMessages(10), contact: getGroups(1)[0] },
  { type: 'group', unreadCount: 1, lastMessages: getMessages(10), contact: getGroups(1)[0] },
  { type: 'group', unreadCount: 10, lastMessages: getMessages(10), contact: getGroups(1)[0] },
  { type: 'group', unreadCount: 0, lastMessages: getMessages(10), contact: getGroups(1)[0] },
  { type: 'group', unreadCount: 30, lastMessages: getMessages(10), contact: getGroups(1)[0] },
];
