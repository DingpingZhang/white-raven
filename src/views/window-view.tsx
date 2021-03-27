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
  getStrangerInfo,
  GroupInfo,
  GroupMessageEvent,
  isGroupInfo,
  SessionInfo,
  StrangerMessageEvent,
} from 'api';
import CircleIcon from 'components/circle-icon';
import { useI18n } from 'i18n';
import { useCallback, useEffect } from 'react';
import { webSocketClient } from 'api/websocket-client';
import {
  useUserInfo,
  useContactList,
  useSessionList,
  fallbackHttpApi,
  useSelectedSessionId,
} from 'models/logged-in-context';
import { buildSettingsDialog } from './dialogs/settings-dialog';
import { filter, map } from 'rxjs/operators';

export default function WindowView() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);
  const settingsDialogToken = useDialog<void>(buildSettingsDialog);
  const { $t } = useI18n();

  useObserveSession();

  const { avatar } = useUserInfo();
  const [, setSessionList] = useSessionList();
  const [, setSelectedSessionId] = useSelectedSessionId();
  const showContactDialog = useCallback(async () => {
    const result = await contactDialogToken.show();

    if (result) {
      setSessionList(prev => {
        if (prev.some(item => item.contact.id === result.id)) return prev;

        const newSession: SessionInfo = isGroupInfo(result)
          ? {
              type: 'group',
              unreadCount: 0,
              contact: result,
            }
          : {
              type: 'friend',
              unreadCount: 0,
              contact: result,
            };

        return [newSession, ...prev];
      });
      setSelectedSessionId(result.id);
    }
  }, [contactDialogToken, setSelectedSessionId, setSessionList]);

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
              onClick={showContactDialog}
            />,
          ]}
          bottomHeaders={[
            <CircleIcon
              key="user-avatar"
              icon={avatar}
              diameter={36}
              onClick={() => {
                settingsDialogToken.show();
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

function useObserveSession() {
  const contactList = useContactList();
  const { id: currentUserId } = useUserInfo();
  const [, setSessionList] = useSessionList();

  useEffect(() => {
    const token = webSocketClient
      .event<FriendMessageEvent>('friend/message')
      .pipe(
        filter(item => item.message.senderId !== currentUserId),
        map(item => {
          const { senderId } = item.message;
          return {
            senderId,
            contact: contactList.find(item => item.id === senderId),
          };
        }),
        filter(({ contact }) => !!contact)
      )
      .subscribe(({ senderId, contact }) => {
        setSessionList(prev => {
          const session = prev.find(item => item.contact.id === senderId);
          return session ? prev : [{ type: 'friend', contact: contact!, unreadCount: 1 }, ...prev];
        });
      });

    return () => token.unsubscribe();
  }, [contactList, currentUserId, setSessionList]);

  useEffect(() => {
    const token = webSocketClient
      .event<StrangerMessageEvent>('stranger/message')
      .subscribe(async e => {
        const { senderId } = e.message;
        const stranger = await fallbackHttpApi(() => getStrangerInfo(senderId), null);
        if (!stranger) return;

        setSessionList(prev => {
          const session = prev.find(item => item.contact.id === senderId);
          if (!session) {
            return [{ type: 'stranger', contact: stranger, unreadCount: 1 }, ...prev];
          }

          return prev;
        });
      });

    return () => token.unsubscribe();
  }, [setSessionList]);

  useEffect(() => {
    const token = webSocketClient
      .event<GroupMessageEvent>('group/message')
      .pipe(
        map(({ groupId }) => {
          const groupOrFriend = contactList.find(item => item.id === groupId);
          const contact = groupOrFriend
            ? isGroupInfo(groupOrFriend)
              ? groupOrFriend
              : undefined
            : undefined;

          return { groupId, contact };
        }),
        filter(({ contact }) => !!contact)
      )
      .subscribe(({ groupId, contact }) => {
        setSessionList(prev => {
          const session = prev.find(item => item.contact.id === groupId);
          return session ? prev : [{ type: 'group', contact: contact!, unreadCount: 1 }, ...prev];
        });
      });

    return () => token.unsubscribe();
  }, [contactList, setSessionList]);
}
