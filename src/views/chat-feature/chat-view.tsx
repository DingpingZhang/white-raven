import { useEffect } from 'react';
import { IdType, SessionInfo } from 'api';
import { Switch } from 'components/switch';
import { useNavigator } from 'components/switch-host';
import { SWITCH_NAME } from 'models/constants';
import GroupSessionView from './group-session-view';
import PrivateSessionView from './private-session-view';
import SessionListWidget from './session-list-widget';
import { useSelectedSessionId, useSessionList } from 'models/logged-in-context';

export default function ChatView() {
  const [sessionList] = useSessionList();
  const [selectedId] = useSelectedSessionId();
  const chatAreaNavigator = useNavigator(SWITCH_NAME.CHAT_AREA);
  useEffect(() => {
    if (sessionList.length > 0) {
      const selectedSession = sessionList.find(item => item.contact.id === selectedId);
      if (selectedSession) {
        chatAreaNavigator(selectedSession.contact.id, selectedSession);
      }
    }
  }, [chatAreaNavigator, selectedId, sessionList]);

  return (
    <div className="ChatView">
      <div className="ChatView__sessionListArea">
        <SessionListWidget />
      </div>
      <div className="ChatView__chatArea">
        <Switch<IdType>
          name={SWITCH_NAME.CHAT_AREA}
          contentProvider={{
            isValidLabel: id => sessionList.some(item => item.contact.id === id),
            getRenderer: () => props => {
              const session = props as SessionInfo;
              switch (session.type) {
                case 'friend':
                case 'stranger':
                  return <PrivateSessionView session={session} />;
                case 'group':
                  return <GroupSessionView session={session} />;
              }
            },
          }}
          // animation={{ className: 'float-in-out-rtl', timeout: 200 }}
        />
      </div>
    </div>
  );
}
