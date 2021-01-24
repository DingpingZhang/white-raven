import { useEffect, useMemo, useState } from 'react';
import { CaseItem, convertToContentProvider, Switch } from '../components/switch';
import { useNavigator } from '../components/switch-host';
import { MainWindowViewName, SWITCH_NAME } from './constants';
import GroupChatView from './group-chat-view';
import MainTabHeaderPanel from './main-tab-header-panel';
import PrivateChatView from './private-chat-view';

export default function WindowContent() {
  const mainWindowNavigator = useNavigator<MainWindowViewName>(SWITCH_NAME.MAIN);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => {
    switch (selectedTabIndex) {
      case 0:
        mainWindowNavigator('private-chat');
        break;
      case 1:
        mainWindowNavigator('group-view');
        break;
    }
  }, [mainWindowNavigator, selectedTabIndex]);

  const mainWindowCases = useMemo<CaseItem<MainWindowViewName>[]>(
    () => [
      { label: 'private-chat', renderer: () => <PrivateChatView /> },
      { label: 'group-view', renderer: () => <GroupChatView /> },
    ],
    []
  );

  return (
    <div className="window-content">
      <div className="main-window-tab-header-panel">
        <MainTabHeaderPanel
          selectedIndex={selectedTabIndex}
          setSelectedIndex={setSelectedTabIndex}
        />
      </div>
      <div className="main-window-tab-content">
        <Switch<MainWindowViewName>
          name={SWITCH_NAME.MAIN}
          contentProvider={convertToContentProvider(mainWindowCases)}
          animation={{ className: 'float-in-out-rtl', timeout: 200 }}
        />
      </div>
    </div>
  );
}
