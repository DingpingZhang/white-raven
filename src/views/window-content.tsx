import MainTabHeaderPanel from './main-tab-header-panel';
import ChatTabContent from './chat-tab-content';
import MainTabHeader from './main-tab-header';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useDialog } from 'components/dialog';
import { buildContactDialog } from './dialogs/contact-dialog';
import { FriendInfo, GroupInfo } from 'api';

export default function WindowContent() {
  const contactDialogToken = useDialog<FriendInfo | GroupInfo | null>(buildContactDialog);

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
          // bottomHeaders={[
          //   <CircleIcon
          //     icon={
          //       userInfoLoadable.state === 'hasValue' ? userInfoLoadable.contents.avatar : undefined
          //     }
          //     diameter={36}
          //   />,
          // ]}
        />
      </div>
      <div className="WindowContent__tabContent">
        <ChatTabContent />
      </div>
    </div>
  );
}
