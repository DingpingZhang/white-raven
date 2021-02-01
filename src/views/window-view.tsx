import { useContext } from 'react';
import TabHeaderListWidget from './tab-header-list-widget';
import ChatView from './chat-feature/chat-view';
import TabHeaderItem from './tab-header-item';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useDialog } from 'components/dialog';
import { buildContactDialog } from './dialogs/contact-dialog';
import { FriendInfo, GroupInfo } from 'api';
import { GlobalContext } from 'models/global-context';
import CircleIcon from 'components/circle-icon';
import { useI18n } from 'i18n';

export default function WindowView() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);
  const { avatar } = useContext(GlobalContext);
  const { $t } = useI18n();

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
