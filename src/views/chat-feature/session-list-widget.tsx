import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchWidget from 'views/search-widget';
import { useState } from 'react';
import { sessionListState, selectedSessionState } from 'models/store';
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { produce } from 'immer';
import { removeAll } from 'helpers/list-helpers';

export default function SessionListWidget() {
  const [searchText, setSearchText] = useState('');
  const [sessionList, setSessionList] = useRecoilState(sessionListState);
  const selectedSessionLoadable = useRecoilValueLoadable(selectedSessionState);
  const setSelectedSession = useSetRecoilState(selectedSessionState);

  return (
    <div className="SessionListWidget">
      <SearchWidget text={searchText} setText={setSearchText} />
      <VirtualizingListBox
        sizeProvider={{ itemSize: 108, itemCount: sessionList.length }}
        renderItems={(startIndex, endIndex) =>
          sessionList.slice(startIndex, endIndex).map((item) => (
            <SessionItem
              sessionKey={{ type: item.type, contactId: item.contact.id }}
              avatar={item.contact.avatar}
              name={item.contact.name}
              unreadCount={item.unreadCount}
              selected={
                selectedSessionLoadable.state === 'hasValue' &&
                selectedSessionLoadable.contents === item
              }
              onSelected={() => setSelectedSession(item)}
              onRemoved={() => {
                setSessionList((prev) =>
                  produce(prev, (draft) => {
                    removeAll(draft, item);
                  })
                );
              }}
            />
          ))
        }
      />
    </div>
  );
}
