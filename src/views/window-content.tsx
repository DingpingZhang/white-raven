import { useContext } from 'react';
import MainTabHeaderPanel from './main-tab-header-panel';
import ChatTabContent from './chat-feature/chat-tab-content';
import MainTabHeader from './main-tab-header';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useDialog } from 'components/dialog';
import { buildContactDialog } from './dialogs/contact-dialog';
import { FriendInfo, GroupInfo } from 'api';
import { GlobalContext } from 'models/global-context';
import CircleIcon from 'components/circle-icon';
import { useI18n } from 'i18n';

export default function WindowContent() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);
  const { avatar } = useContext(GlobalContext);
  const { $t } = useI18n();

  return (
    <div className="WindowContent">
      <div className="WindowContent__tabHeaderPanel">
        <MainTabHeaderPanel
          topHeaders={[
            <MainTabHeader
              key="chat"
              icon={<ChatIcon />}
              title={$t('window.tabHeader.chat')}
              selected
            />,
            <MainTabHeader
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
      <div className="WindowContent__tabContent">
        <ChatTabContent />
      </div>
    </div>
  );
}
