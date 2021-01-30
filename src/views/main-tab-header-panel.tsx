import MainTabHeader from './main-tab-header';
import { ReactComponent as ChatIcon } from 'images/chat.svg';
import { ReactComponent as ContactIcon } from 'images/contact.svg';
import { useRecoilValueLoadable } from 'recoil';
import { userInfoState } from 'models/basic-models';

type MainTabHeaderPanelProps = {
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
};

export default function MainTabHeaderPanel({
  selectedIndex,
  setSelectedIndex,
}: MainTabHeaderPanelProps) {
  const userInfoLoadable = useRecoilValueLoadable(userInfoState);

  return (
    <div className="MainTabHeaderPanel">
      <div className="MainTabHeaderPanel__tabHeaderContainer top">
        <MainTabHeader
          icon={<ChatIcon />}
          title="Chat"
          selected={selectedIndex === 0}
          onClick={() => setSelectedIndex(0)}
        />
        <MainTabHeader
          icon={<ContactIcon />}
          title="Contact"
          selected={selectedIndex === 1}
          onClick={() => setSelectedIndex(1)}
        />
      </div>
      <div className="MainTabHeaderPanel__tabHeaderContainer bottom">
        <img
          className="MainTabHeaderPanel__avatar"
          src={userInfoLoadable.state === 'hasValue' ? userInfoLoadable.contents.avatar : undefined}
          alt="avatar"
        />
      </div>
    </div>
  );
}
