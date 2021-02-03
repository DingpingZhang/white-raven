import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchWidget from 'views/search-widget';
import { useState } from 'react';
import { sessionListState, selectedSessionIndexState } from 'models/store';
import { useRecoilState } from 'recoil';
import { produce } from 'immer';
import { removeAll } from 'helpers/list-helpers';

export default function SessionListWidget() {
  const [searchText, setSearchText] = useState('');
  const [sessionList, setSessionList] = useRecoilState(sessionListState);
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedSessionIndexState);

  return (
    <div className="SessionListWidget">
      <SearchWidget text={searchText} setText={setSearchText} />
      <VirtualizingListBox
        sizeProvider={{ itemSize: 108, itemCount: sessionList.length }}
        renderItems={(startIndex, endIndex) =>
          sessionList.slice(startIndex, endIndex).map((item, index) => {
            const actualIndex = startIndex + index;
            return (
              <SessionItem
                sessionKey={{ type: item.type, contactId: item.contact.id }}
                avatar={item.contact.avatar}
                name={item.contact.name}
                unreadCount={item.unreadCount}
                selected={selectedIndex === actualIndex}
                onSelected={() => setSelectedIndex(startIndex + index)}
                onRemoved={() => {
                  setSessionList((prev) =>
                    produce(prev, (draft) => {
                      console.log(item);
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
