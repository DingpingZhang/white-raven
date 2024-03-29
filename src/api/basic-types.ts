export type IdType = string;
export type Disposable = () => void;

// ***************************************************
// Message
// ***************************************************

export type TextMessageSegment = {
  type: 'text';
  text: string;
};

export type ImageBehavior = 'can-browse' | 'like-text';

export type ImageMessageSegment = {
  type: 'image';
  behavior: ImageBehavior;
  imageId: string;
  width?: number;
  height?: number;
  displayName?: string;
};

export type AtMessageSegment = {
  type: 'at';
  targetId: IdType;
};

export type MessageSegment = TextMessageSegment | ImageMessageSegment | AtMessageSegment;

export type MessageContent = ReadonlyArray<MessageSegment>;

export type MessageBase = {
  content: MessageContent;
};

type SentMessageFields = {
  id: IdType;
  senderId: IdType;
  recipientId: IdType;
  timestamp: number;
};

export type UnsentNormalMessage = MessageBase & {
  type: 'normal';
};

export type UnsentQuoteMessage = MessageBase & {
  type: 'quote';
  prevId: IdType;
  quote: MessageContent;
};

export type UnsentMessage = UnsentNormalMessage | UnsentQuoteMessage;

export type NormalMessage = SentMessageFields & UnsentNormalMessage;

export type QuoteMessage = SentMessageFields & UnsentQuoteMessage;

export type Message = NormalMessage | QuoteMessage;

// ***************************************************
// Other
// ***************************************************

export type FacePackage = {
  id: IdType;
  displayName: string;
  displayFaceId?: IdType;
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
  const groupInfo = info as GroupInfo;
  return groupInfo && groupInfo.memberCapacity !== undefined;
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
