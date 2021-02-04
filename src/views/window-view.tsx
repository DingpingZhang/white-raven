import TabHeaderListWidget from './tab-header-list-widget';
import ChatView from './chat-feature/chat-view';
import TabHeaderItem from './tab-header-item';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useDialog } from 'components/dialog';
import { buildContactDialog } from './dialogs/contact-dialog';
import {
  FriendInfo,
  FriendMessageEvent,
  getSessions,
  getStrangerInfo,
  getUserInfo,
  GroupInfo,
  GroupMessageEvent,
  isGroupInfo,
  StrangerMessageEvent,
} from 'api';
import CircleIcon from 'components/circle-icon';
import { useI18n } from 'i18n';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import {
  contactListState,
  DEFAULT_USER_INFO,
  fallbackHttpApi,
  makeMutList,
  sessionListState,
  userInfoState,
} from 'models/store';
import { useEffect } from 'react';
import { webSocketClient } from 'api/websocket-client';
import { produce } from 'immer';
import { removeAll } from 'helpers/list-helpers';

export default function WindowView() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);
  const { avatar } = useRecoilValue(userInfoState);
  const { $t } = useI18n();

  const setUserInfo = useSetRecoilState(userInfoState);
  const [, setSessionList] = useRecoilState(sessionListState);
  const contactListLoadable = useRecoilValueLoadable(contactListState);

  // Initiailze
  useEffect(() => {
    const initiailze = async () => {
      setUserInfo(await fallbackHttpApi(getUserInfo, DEFAULT_USER_INFO));
      setSessionList(await makeMutList(fallbackHttpApi(getSessions, [])));
    };

    initiailze();
  }, [setSessionList, setUserInfo]);

  useEffect(() => {
    if (contactListLoadable.state !== 'hasValue') return;
    const contactList = contactListLoadable.contents;

    // Subscribe Events
    webSocketClient.subscribe<FriendMessageEvent>('friend/message', (e) => {
      setSessionList((prev) => {
        const session = prev.find((item) => item.contact.id === e.senderId);
        if (session) {
          return produce(prev, (draft) => {
            removeAll(draft, session, (x, y) => x.contact.id === y.contact.id);
            draft.unshift({ ...session, unreadCount: session.unreadCount + 1 });
          });
        } else {
          const contact = contactList.find((item) => item.id === e.senderId)!;
          return produce(prev, (draft) => {
            draft.unshift({ type: 'friend', contact: contact, unreadCount: 1 });
          });
        }
      });
    });
    webSocketClient.subscribe<StrangerMessageEvent>('stranger/message', async (e) => {
      const stranger = await fallbackHttpApi(() => getStrangerInfo(e.senderId), null);
      if (!stranger) return;

      setSessionList((prev) => {
        const session = prev.find((item) => item.contact.id === e.senderId);
        if (session) {
          return produce(prev, (draft) => {
            removeAll(draft, session, (x, y) => x.contact.id === y.contact.id);
            draft.unshift({ ...session, unreadCount: session.unreadCount + 1 });
          });
        } else {
          return produce(prev, (draft) => {
            draft.unshift({
              type: 'stranger',
              contact: stranger,
              unreadCount: 1,
            });
          });
        }
      });
    });
    webSocketClient.subscribe<GroupMessageEvent>('group/message', (e) => {
      setSessionList((prev) => {
        const session = prev.find((item) => item.contact.id === e.groupId);
        if (!session) {
          const contact = contactList.find((item) => item.id === e.groupId)!;
          if (!isGroupInfo(contact))
            throw new Error('The type of "group/message" argument must be GroupInfo.');

          return produce(prev, (draft) => {
            draft.unshift({ type: 'group', contact: contact, unreadCount: 1 });
          });
        }

        return prev;
      });
    });
  }, [contactListLoadable.contents, contactListLoadable.state, setSessionList]);

  return (
    <div className="WindowView">
      <div className="WindowView__tabHeaderPanel">
        <TabHeaderListWidget
          topHeaders={[
            <TabHeaderItem
              key="chat"
              icon={<ChatIcon />}
              title={$t('window.tabHeader.chat')}
              selected
            />,
            <TabHeaderItem
              key="contact"
              icon={<ContactIcon />}
              title={$t('window.tabHeader.contact')}
              onClick={async () => {
                const result = await contactDialogToken.show();
                if (result) {
                  setSessionList((prev) => [
                    isGroupInfo(result)
                      ? {
                          type: 'group',
                          unreadCount: 0,
                          contact: result,
                        }
                      : {
                          type: 'friend',
                          unreadCount: 0,
                          contact: result,
                        },
                    ...prev,
                  ]);
                }
              }}
            />,
          ]}
          bottomHeaders={[
            <CircleIcon
              key="user-avatar"
              icon={avatar}
              diameter={36}
              onClick={() => {
                if (document.body.classList.contains('theme-dark')) {
                  document.body.classList.remove('theme-dark');
                } else {
                  document.body.classList.add('theme-dark');
                }
              }}
            />,
          ]}
        />
      </div>
      <div className="WindowView__tabContent">
        <ChatView />
      </div>
    </div>
  );
}
