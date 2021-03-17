import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchWidget from 'views/search-widget';
import { useState } from 'react';
import useSearchWithText from 'models/use-search-with-text';
import { useSelectedSessionId, useSessionList } from 'models/store';

export default function SessionListWidget() {
  const [queriesText, setQueriesText] = useState('');
  const [sessionList, setSessionList] = useSessionList();
  const [selectedId, setSelectedId] = useSelectedSessionId();
  const filteredSessionList = useSearchWithText(
    sessionList,
    (item) => item.contact.name,
    queriesText
  );

  return (
    <div className="SessionListWidget">
      <SearchWidget text={queriesText} setText={setQueriesText} />
      <VirtualizingListBox
        sizeProvider={{ itemSize: 108, itemCount: filteredSessionList.length }}
        renderItems={(startIndex, endIndex) =>
          filteredSessionList.slice(startIndex, endIndex).map((item, index) => {
            return (
              <SessionItem
                key={item.contact.id}
                sessionType={item.type}
                contactId={item.contact.id}
                avatar={item.contact.avatar}
                name={item.contact.name}
                unreadCount={item.unreadCount}
                queriesText={queriesText}
                selected={selectedId === item.contact.id}
                onSelected={() => setSelectedId(item.contact.id)}
                onRemoved={() => {
                  setSessionList((prev) => [
                    ...prev.filter((element) => element.contact.id !== item.contact.id),
                  ]);
                }}
              />
            );
          })
        }
      />
    </div>
  );
}
