import { VirtualizingListBox } from 'components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchBox from 'views/search-box';
import { SessionInfo } from 'api';
import { useState } from 'react';

type ContactListControlProps = {
  selectedItem: SessionInfo | null;
  setSelectedItem: (value: SessionInfo) => void;
  items: ReadonlyArray<SessionInfo>;
};

export default function SessionListControl({
  selectedItem,
  setSelectedItem,
  items,
}: ContactListControlProps) {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="SessionListControl">
      <SearchBox text={searchText} setText={setSearchText} />
      <VirtualizingListBox
        sizeProvider={{ itemSize: 108, itemCount: items.length }}
        renderItems={(startIndex, endIndex) =>
          items
            .slice(startIndex, endIndex)
            .map((item) => (
              <SessionItem
                avatar={item.contact.avatar}
                name={item.contact.name}
                lastMessage={item.lastMessages[item.lastMessages.length - 1]}
                unreadCount={item.unreadCount}
                selected={selectedItem === item}
                onSelected={() => setSelectedItem(item)}
              />
            ))
        }
      />
    </div>
  );
}
