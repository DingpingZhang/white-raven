import { useContext } from 'react';
import MainTabHeaderPanel from './main-tab-header-panel';
import ChatTabContent from './chat-tab-content';
import MainTabHeader from './main-tab-header';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useDialog } from 'components/dialog';
import { buildContactDialog } from './dialogs/contact-dialog';
import { FriendInfo, GroupInfo } from 'api';
import { GlobalContext } from 'models/global-context';
import CircleIcon from 'components/circle-icon';

export default function WindowContent() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);
  const { avatar } = useContext(GlobalContext);

  return (
    <div className="WindowContent">
      <div className="WindowContent__tabHeaderPanel">
        <MainTabHeaderPanel
          topHeaders={[
            <MainTabHeader key="Chat" icon={<ChatIcon />} title="Chat" selected />,
            <MainTabHeader
              key="Contact"
              icon={<ContactIcon />}
              title="Contact"
              onClick={async () => {
                const result = await contactDialogToken.show();
                console.log(result);
              }}
            />,
          ]}
          bottomHeaders={[
            <CircleIcon
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
