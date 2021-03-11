import { FriendSession, GroupSession, SessionInfo, StrangerSession } from 'api';
import { getMockFriends, getMockGroups, getMockStrangers } from './contact';

export function getMockSessions(count: number): ReadonlyArray<SessionInfo> {
  return [...FRIEND_SESSION_LIST, ...STRANGER_SESSION_LIST, ...GROUP_SESSION_LIST];
}

export const FRIEND_SESSION_LIST: ReadonlyArray<FriendSession> = [
  {
    type: 'friend',
    unreadCount: 0,
    contact: getMockFriends(1)[0],
  },
  {
    type: 'friend',
    unreadCount: 1,
    contact: getMockFriends(1)[1],
  },
  {
    type: 'friend',
    unreadCount: 10,
    contact: getMockFriends(1)[2],
  },
];

export const STRANGER_SESSION_LIST: ReadonlyArray<StrangerSession> = [
  {
    type: 'stranger',
    unreadCount: 0,
    contact: getMockStrangers(1)[0],
  },
  {
    type: 'stranger',
    unreadCount: 1,
    contact: getMockStrangers(1)[1],
  },
  {
    type: 'stranger',
    unreadCount: 10,
    contact: getMockStrangers(1)[2],
  },
];

export const GROUP_SESSION_LIST: ReadonlyArray<GroupSession> = [
  {
    type: 'group',
    unreadCount: 0,
    contact: getMockGroups(1)[0],
  },
  {
    type: 'group',
    unreadCount: 1,
    contact: getMockGroups(1)[1],
  },
  {
    type: 'group',
    unreadCount: 10,
    contact: getMockGroups(1)[2],
  },
];
