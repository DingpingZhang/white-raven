import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchWidget from 'views/search-widget';
import { useContext, useState } from 'react';
import useSearchWithText from 'models/use-search-with-text';
import { LoggedInContext, useSelectedSessionId, useSessionList } from 'models/logged-in-context';

export default function SessionListWidget() {
  const [queriesText, setQueriesText] = useState('');
  const [sessionList, setSessionList] = useSessionList();
  const [selectedId, setSelectedId] = useSelectedSessionId();
  const filteredSessionList = useSearchWithText(
    sessionList,
    item => item.contact.name,
    queriesText
  );
  const { messageListCluster } = useContext(LoggedInContext);

  return (
    <div className="SessionListWidget">
      <SearchWidget text={queriesText} setText={setQueriesText} />
      <VirtualizingListBox
        sizeProvider={{ itemSize: 108, itemCount: filteredSessionList.length }}
        renderItems={(startIndex, endIndex) =>
          filteredSessionList.slice(startIndex, endIndex).map(item => {
            const { type, contact, unreadCount } = item;
            const { id, avatar, name } = contact;

            return (
              <SessionItem
                key={id}
                sessionType={type}
                contactId={id}
                avatar={avatar}
                name={name}
                unreadCount={unreadCount}
                queriesText={queriesText}
                selected={selectedId === id}
                onSelected={() => setSelectedId(id)}
                onRemoved={() => {
                  setSessionList(prev => [...prev.filter(element => element.contact.id !== id)]);

                  const messageList = messageListCluster.get(id);
                  if (messageList) {
                    messageList.clear();
                  }
                }}
              />
            );
          })
        }
      />
    </div>
  );
}
