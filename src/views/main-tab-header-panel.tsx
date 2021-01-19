import MainTabHeader from './main-tab-header';
import { ReactComponent as PersonIcon } from '../images/person.svg';
import { ReactComponent as GroupIcon } from '../images/group.svg';
import { useState } from 'react';

export default function MainTabHeaderPanel() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="main-tab-header-panel">
      <div className="tab-headers-container top">
        <MainTabHeader
          icon={<PersonIcon width="24px" height="24px" style={{ fill: '#3364ff' }} />}
          title="Person"
          selected
        />
        <MainTabHeader
          icon={<GroupIcon width="24px" height="24px" style={{ fill: '#44496d' }} />}
          title="Group"
        />
      </div>
      <div className="tab-headers-container bottom">
        <img className="avatar" src="http://q1.qlogo.cn/g?b=qq&nk={qq}&s=640" alt="avatar" />
      </div>
    </div>
  );
}
