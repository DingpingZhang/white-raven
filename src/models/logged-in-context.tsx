import {
  FacePackage,
  FriendInfo,
  getFacePackageById,
  getFacePackages,
  getFriendInfos,
  getGroupInfos,
  getGroupMembers,
  getSessions,
  getUserInfo,
  GroupInfo,
  GroupMemberInfo,
  IdType,
  PersonInfo,
  SessionInfo,
} from 'api';
import { ReactNode } from 'react';
import MessageList from './message-list';
import AvatarDefaultIcon from 'images/avatar-default.png';
import { useConstant } from 'hooks';
import { RxState, RxStateCluster } from 'hooks/rx-state';
import { FaceSet, fallbackHttpApi, LoggedInContext, LoggedInContextType } from './store';

const defaultUserInfo: PersonInfo = { id: '', name: '', avatar: AvatarDefaultIcon };

export default function LoggedInContextRoot({ children }: { children: ReactNode }) {
  const store = useConstant<LoggedInContextType>(() => {
    const { selectedSessionId, sessionList } = createSessionState();
    return {
      userInfo: new RxState<PersonInfo>(defaultUserInfo, async set => {
        const value = await fallbackHttpApi(getUserInfo, defaultUserInfo);
        set(value);
      }),
      selectedSessionId,
      sessionList,
      contactList: new RxState<Array<FriendInfo | GroupInfo>>([], async set => {
        const friends = await fallbackHttpApi(getFriendInfos, []);
        const groups = await fallbackHttpApi(getGroupInfos, []);
        set([...friends, ...groups]);
      }),
      facePackages: new RxState<ReadonlyArray<FacePackage>>([], async set => {
        const value = await fallbackHttpApi(getFacePackages, []);
        set(value);
      }),
      messageListCluster: new Map<IdType, MessageList>(),
      groupMemberListCluster: new RxStateCluster<IdType, GroupMemberInfo[]>(
        key =>
          new RxState<GroupMemberInfo[]>([], async set => {
            const value = await makeMutList(fallbackHttpApi(() => getGroupMembers(key), []));
            set(value);
          })
      ),
      faceSetCluster: new RxStateCluster<IdType, FaceSet>(
        key =>
          new RxState<FaceSet>([], async set => {
            const value = await fallbackHttpApi(() => getFacePackageById(key), []);
            set(value);
          })
      ),
    };
  });

  return <LoggedInContext.Provider value={store}>{children}</LoggedInContext.Provider>;
}

function createSessionState() {
  const selectedSessionId = new RxState<IdType | null>(null);
  const sessionList = new RxState<SessionInfo[]>([], async set => {
    const value = await makeMutList(fallbackHttpApi(getSessions, []));
    set(value);
  });

  // 闭包变量
  let prevSelectedIndex = -1;

  selectedSessionId.source.subscribe(nextValue => {
    prevSelectedIndex = sessionList.source.value.findIndex(item => item.contact.id === nextValue);
  });
  sessionList.source.subscribe(nextValue => {
    if (nextValue.length === 0) return;

    const selectedId = selectedSessionId.source.value;
    const selectedIndex = nextValue.findIndex(item => item.contact.id === selectedId);

    // session 被删除，或 selectedId 为 null.
    if (selectedIndex < 0) {
      if (prevSelectedIndex < 0) {
        prevSelectedIndex = 0;
      } else if (prevSelectedIndex >= nextValue.length) {
        prevSelectedIndex = nextValue.length - 1;
      }

      selectedSessionId.set(nextValue[prevSelectedIndex].contact.id);
    } else {
      prevSelectedIndex = selectedIndex;
    }
  });

  return { selectedSessionId, sessionList };
}

async function makeMutList<T>(immutList: Promise<ReadonlyArray<T>>): Promise<T[]> {
  const result = await immutList;
  return [...result];
}
