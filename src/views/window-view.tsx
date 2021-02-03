import TabHeaderListWidget from './tab-header-list-widget';
import ChatView from './chat-feature/chat-view';
import TabHeaderItem from './tab-header-item';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useDialog } from 'components/dialog';
import { buildContactDialog } from './dialogs/contact-dialog';
import { FriendInfo, getSessions, getUserInfo, GroupInfo } from 'api';
import CircleIcon from 'components/circle-icon';
import { useI18n } from 'i18n';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  DEFAULT_USER_INFO,
  fallbackHttpApi,
  makeMutList,
  sessionListState,
  userInfoState,
} from 'models/store';
import { useEffect } from 'react';

export default function WindowView() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);
  const { avatar } = useRecoilValue(userInfoState);
  const { $t } = useI18n();

  const setUserInfo = useSetRecoilState(userInfoState);
  const setSessionList = useSetRecoilState(sessionListState);
  // Initiailze
  useEffect(() => {
    const initiailze = async () => {
      setUserInfo(await fallbackHttpApi(getUserInfo, DEFAULT_USER_INFO));
      setSessionList(await makeMutList(fallbackHttpApi(getSessions, [])));
    };

    initiailze();
  }, [setSessionList, setUserInfo]);

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
                console.log(result);
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
