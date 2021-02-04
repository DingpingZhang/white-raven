import { FriendSession, GroupSession, SessionInfo, StrangerSession } from 'api';
import { uuidv4 } from 'helpers';
import { getMockItems } from './common';
import { getMockFriends, getMockGroups, getMockStrangers } from './contact';
import { getMockMessages } from './message';

export function getMockSessions(count: number): ReadonlyArray<SessionInfo> {
  const friendCount = Math.random() * count;
  const strangerCount = Math.random() * (count - friendCount);
  const groupCount = count - friendCount - strangerCount;

  return [
    ...getMockItems(FRIEND_SESSION_LIST, friendCount, (item) => ({
      ...item,
      id: `${uuidv4()}`,
    })),
    ...getMockItems(GROUP_SESSION_LIST, groupCount, (item) => ({
      ...item,
      id: `${uuidv4()}`,
    })),
    ...getMockItems(STRANGER_SESSION_LIST, strangerCount, (item) => ({
      ...item,
      id: `${uuidv4()}`,
    })),
  ];
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
    contact: getMockFriends(1)[0],
  },
  {
    type: 'friend',
    unreadCount: 10,
    contact: getMockFriends(1)[0],
  },
  {
    type: 'friend',
    unreadCount: 0,
    contact: getMockFriends(1)[0],
  },
  {
    type: 'friend',
    unreadCount: 30,
    contact: getMockFriends(1)[0],
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
    contact: getMockStrangers(1)[0],
  },
  {
    type: 'stranger',
    unreadCount: 10,
    contact: getMockStrangers(1)[0],
  },
  {
    type: 'stranger',
    unreadCount: 0,
    contact: getMockStrangers(1)[0],
  },
  {
    type: 'stranger',
    unreadCount: 30,
    contact: getMockStrangers(1)[0],
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
    contact: getMockGroups(1)[0],
  },
  {
    type: 'group',
    unreadCount: 10,
    contact: getMockGroups(1)[0],
  },
  {
    type: 'group',
    unreadCount: 0,
    contact: getMockGroups(1)[0],
  },
  {
    type: 'group',
    unreadCount: 30,
    contact: getMockGroups(1)[0],
  },
];
