import { useEffect, useState } from 'react';
import { getSessions, IdType, SessionInfo } from 'api';
import { Switch } from 'components/switch';
import { useNavigator } from 'components/switch-host';
import { SWITCH_NAME } from 'views/constants';
import GroupChatView from './group-chat-view';
import PrivateChatView from './private-chat-view';
import SessionListWidget from './session-list-widget';
import React from 'react';
import { useHttpApi } from 'hooks/use-api';

export default function ChatView() {
  const sessionList = useHttpApi(getSessions, []);
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    if (sessionList.length) {
      setSelectedSession(sessionList[0]);
    }
  }, [sessionList]);

  const chatAreaNavigator = useNavigator(SWITCH_NAME.CHAT_AREA);
  useEffect(() => {
    if (selectedSession) {
      chatAreaNavigator(selectedSession.contact.id, selectedSession);
    }
  }, [chatAreaNavigator, selectedSession]);

  return (
    <div className="ChatView">
      <div className="ChatView__sessionListArea">
        <SessionListWidget
          selectedItem={selectedSession}
          setSelectedItem={setSelectedSession}
          items={sessionList}
        />
      </div>
      <div className="ChatView__chatArea">
        <Switch<IdType>
          name={SWITCH_NAME.CHAT_AREA}
          contentProvider={{
            isValidLabel: (id) => sessionList.some((item) => item.contact.id === id),
            getRenderer: () => (props) => {
              const session = props as SessionInfo;
              switch (session.type) {
                case 'friend':
                case 'stranger':
                  return <PrivateChatView session={session} />;
                case 'group':
                  return <GroupChatView session={session} />;
              }
            },
          }}
          // animation={{ className: 'float-in-out-rtl', timeout: 200 }}
        />
      </div>
    </div>
  );
}
