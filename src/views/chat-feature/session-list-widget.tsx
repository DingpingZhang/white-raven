import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchWidget from 'views/search-widget';
import { useState } from 'react';
import useSearchWithText from 'models/use-search-with-text';
import { useSelectedSessionIndex, useSessionList } from 'models/store';

export default function SessionListWidget() {
  const [queriesText, setQueriesText] = useState('');
  const [sessionList, setSessionList] = useSessionList();
  const [selectedIndex, setSelectedIndex] = useSelectedSessionIndex();
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
            const actualIndex = startIndex + index;
            return (
              <SessionItem
                sessionType={item.type}
                contactId={item.contact.id}
                avatar={item.contact.avatar}
                name={item.contact.name}
                unreadCount={item.unreadCount}
                queriesText={queriesText}
                selected={selectedIndex === actualIndex}
                onSelected={() => setSelectedIndex(startIndex + index)}
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
