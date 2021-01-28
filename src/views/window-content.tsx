import { useEffect, useMemo, useState } from 'react';
import { CaseItem, convertToContentProvider, Switch } from '../components/switch';
import { useNavigator } from '../components/switch-host';
import ChatTabContent from './chat-tab-content';
import { MainWindowViewName, SWITCH_NAME } from './constants';
import MainTabHeaderPanel from './main-tab-header-panel';

export default function WindowContent() {
  const mainWindowNavigator = useNavigator<MainWindowViewName>(SWITCH_NAME.MAIN);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => mainWindowNavigator(convertIndexToViewName(selectedTabIndex)), [
    mainWindowNavigator,
    selectedTabIndex,
  ]);

  const mainWindowCases = useMemo<CaseItem<MainWindowViewName>[]>(
    () => [
      { label: 'chat-tab', renderer: () => <ChatTabContent /> },
      { label: 'contact-tab', renderer: () => <div>TODO</div> },
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

function convertIndexToViewName(index: number): MainWindowViewName {
  switch (index) {
    case 0:
    default:
      return 'chat-tab';
    case 1:
      return 'contact-tab';
  }
}
