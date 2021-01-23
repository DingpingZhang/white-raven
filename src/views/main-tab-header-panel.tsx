import MainTabHeader from './main-tab-header';
import { ReactComponent as PersonIcon } from '../images/person.svg';
import { ReactComponent as GroupIcon } from '../images/group.svg';

type MainTabHeaderPanelProps = {
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
};

export default function MainTabHeaderPanel({
  selectedIndex,
  setSelectedIndex,
}: MainTabHeaderPanelProps) {
  return (
    <div className="main-tab-header-panel">
      <div className="tab-headers-container top">
        <MainTabHeader
          icon={<PersonIcon />}
          title="Person"
          selected={selectedIndex === 0}
          onClick={() => setSelectedIndex(0)}
        />
        <MainTabHeader
          icon={<GroupIcon />}
          title="Group"
          selected={selectedIndex === 1}
          onClick={() => setSelectedIndex(1)}
        />
      </div>
      <div className="tab-headers-container bottom">
        <img className="avatar" src="http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640" alt="avatar" />
      </div>
    </div>
  );
}
