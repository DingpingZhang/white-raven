import { VirtualizingListBox } from '../components/virtualizing-list-box';
import SessionItem from './session-item';
import SearchBox from './search-box';
import { Session } from '../api';

type ContactListControlProps = {
  selectedItem: Session | null;
  setSelectedItem: (value: Session) => void;
  items: ReadonlyArray<Session>;
};

export default function SessionListControl({
  selectedItem,
  setSelectedItem,
  items,
}: ContactListControlProps) {
  return (
    <div className="session-list-control">
      <SearchBox />
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
