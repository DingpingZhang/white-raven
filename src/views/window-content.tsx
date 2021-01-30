import MainTabHeaderPanel from './main-tab-header-panel';
import ChatTabContent from './chat-tab-content';
import MainTabHeader from './main-tab-header';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useRecoilValueLoadable } from 'recoil';
import { userInfoState } from 'models/basic-models';
import CircleIcon from 'components/circle-icon';

export default function WindowContent() {
  const userInfoLoadable = useRecoilValueLoadable(userInfoState);

  return (
    <div className="WindowContent">
      <div className="WindowContent__tabHeaderPanel">
        <MainTabHeaderPanel
          topHeaders={[
            <MainTabHeader icon={<ChatIcon />} title="Chat" selected />,
            <MainTabHeader icon={<ContactIcon />} title="Contact" />,
          ]}
          bottomHeaders={[
            <CircleIcon
              icon={
                userInfoLoadable.state === 'hasValue' ? userInfoLoadable.contents.avatar : undefined
              }
              diameter={36}
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
