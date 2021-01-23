import { useEffect, useMemo, useState } from 'react';
import { CaseItem, Switch } from '../components/switch';
import { useNavigator } from '../components/switch-host';
import GroupChatView from './group-chat-view';
import MainTabHeaderPanel from './main-tab-header-panel';
import PrivateChatView from './private-chat-view';

export const SWITCH_NAME_MAIN = 'main-window';
export type MainWindowViewName = 'private-chat' | 'group-view';

export default function WindowContent() {
  const mainWindowNavigator = useNavigator<MainWindowViewName>(SWITCH_NAME_MAIN);
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
        <Switch<MainWindowViewName> name={SWITCH_NAME_MAIN} cases={mainWindowCases} />
      </div>
    </div>
  );
}
