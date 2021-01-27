export type IdType = string;

// ***************************************************
// Message
// ***************************************************

export type TextMessageSegment = {
  type: 'text';
  text: string;
};

export type ImageMessageSegment = {
  type: 'image';
  url: string;
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

export type Gender = 'male' | 'female' | 'unknown';
export type GroupRole = 'owner' | 'admin' | 'member';

export type PersonInfo = {
  id: IdType;
  name: string;
  avatar: string;
};

export type FriendInfo = PersonInfo & {
  remark: string;
  category: string;
};

export type StrangerInfo = PersonInfo & {
  fromGroupId: IdType;
};

export type GroupInfo = PersonInfo & {
  ownerId: IdType;
  selfMuteExpire: number;
  allMuteExpire: number;
  description: string;
  memberCount: number;
  memberCapacity: number;
};

export type GroupMemberInfo = PersonInfo & {
  groupId: IdType;
  remark: string;
  joinTime: number;
  role: GroupRole;
};

// ***************************************************
// Session
// ***************************************************

export type FriendSession = {
  type: 'friend';
  contact: FriendInfo;
  lastMessage: Message;
};

export type StrangerSession = {
  type: 'stranger';
  contact: StrangerInfo;
  lastMessage: Message;
};

export type GroupSession = {
  type: 'group';
  contact: GroupInfo;
  lastMessage: Message;
};

export type Session = FriendSession | StrangerSession | GroupSession;

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
  reason: T;
};

export type MessageResponse = {
  id: IdType;
  timestamp: number;
};
