import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { IdType, Session } from '../api';
import { Switch } from '../components/switch';
import { useNavigator } from '../components/switch-host';
import { sessionListState, selectedSessionState } from '../models/basic-models';
import { SWITCH_NAME } from './constants';
import GroupChatView from './group-chat-view';
import PrivateChatView from './private-chat-view';
import SessionListControl from './session-list-control';

export default function ChatTabContent() {
  const sessionList = useRecoilValue(sessionListState);
  const [selectedSession, setSelectedSession] = useRecoilState(selectedSessionState);
  const chatAreaNavigator = useNavigator(SWITCH_NAME.CHAT_AREA);
  useEffect(() => {
    if (selectedSession) {
      chatAreaNavigator(selectedSession.contact.id, selectedSession);
    }
  }, [chatAreaNavigator, selectedSession]);

  return (
    <div className="chat-tab-content">
      <div className="session-list-area">
        <SessionListControl
          selectedItem={selectedSession}
          setSelectedItem={setSelectedSession}
          items={sessionList}
        />
      </div>
      <div className="chat-area">
        <Switch<IdType>
          name={SWITCH_NAME.CHAT_AREA}
          contentProvider={{
            isValidLabel: (id) => sessionList.some((item) => item.contact.id === id),
            getRenderer: () => (props) => {
              const session = props as Session;
              switch (session.type) {
                case 'friend':
                case 'stranger':
                  return <PrivateChatView selectedItem={session} />;
                case 'group':
                  return <GroupChatView selectedItem={session} />;
              }
            },
          }}
          // animation={{ className: 'float-in-out-rtl', timeout: 200 }}
        />
      </div>
    </div>
  );
}
