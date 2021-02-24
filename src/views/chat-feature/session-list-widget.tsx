import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchWidget from 'views/search-widget';
import { useState } from 'react';
import { sessionListState, selectedSessionIndexState } from 'models/store';
import { useRecoilState } from 'recoil';
import { produce } from 'immer';
import { removeAll } from 'helpers/list-helpers';
import useSearchWithText from 'models/use-search-with-text';

export default function SessionListWidget() {
  const [queriesText, setQueriesText] = useState('');
  const [sessionList, setSessionList] = useRecoilState(sessionListState);
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedSessionIndexState);
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
                sessionKey={{ type: item.type, contactId: item.contact.id }}
                avatar={item.contact.avatar}
                name={item.contact.name}
                unreadCount={item.unreadCount}
                queriesText={queriesText}
                selected={selectedIndex === actualIndex}
                onSelected={() => setSelectedIndex(startIndex + index)}
                onRemoved={() => {
                  setSessionList((prev) =>
                    produce(prev, (draft) => {
                      removeAll(draft, item, (x, y) => x.contact.id === y.contact.id);
                    })
                  );
                }}
              />
            );
          })
        }
      />
    </div>
  );
}
