export type IdType = string;
export type Disposable = () => void;

// ***************************************************
// Message
// ***************************************************

export type TextMessageSegment = {
  type: 'text';
  text: string;
};

export type ImageMessageSegment = {
  type: 'image';
  imageId: string;
};

export type FaceMessageSegment = {
  type: 'face';
  faceId: string;
};

export type AtMessageSegment = {
  type: 'at';
  targetId: IdType;
};

export type MessageSegment =
  | TextMessageSegment
  | ImageMessageSegment
  | FaceMessageSegment
  | AtMessageSegment;

export type MessageContent = ReadonlyArray<MessageSegment>;

export type Message = {
  id: IdType;
  senderId: IdType;
  timestamp: number;
  content: MessageContent;
};

// ***************************************************
// Contact Info
// ***************************************************

export type GroupRole = 'owner' | 'admin' | 'member';

export type PersonInfo = {
  id: IdType;
  name: string;
  avatar: string;
};

export type FriendInfo = PersonInfo & {
  remark?: string;
  category?: string;
};

export type StrangerInfo = PersonInfo & {
  fromGroupId: IdType;
};

export type GroupInfo = PersonInfo & {
  ownerId: IdType;
  memberCount: number;
  memberCapacity: number;
  selfMuteExpire?: number;
  allMuteExpire?: number;
  description?: string;
};

export type GroupMemberInfo = PersonInfo & {
  groupId: IdType;
  joinTime: number;
  role: GroupRole;
  remark?: string;
};

export function isGroupInfo(info: FriendInfo | GroupInfo): info is GroupInfo {
  return (info as GroupInfo).memberCapacity !== undefined;
}

// ***************************************************
// Session
// ***************************************************

type SessionBase = {
  unreadCount: number;
};

export type FriendSession = SessionBase & {
  type: 'friend';
  contact: FriendInfo;
};

export type StrangerSession = SessionBase & {
  type: 'stranger';
  contact: StrangerInfo;
};

export type GroupSession = SessionBase & {
  type: 'group';
  contact: GroupInfo;
};

export type SessionInfo = FriendSession | StrangerSession | GroupSession;
export type SessionType = 'friend' | 'stranger' | 'group';
