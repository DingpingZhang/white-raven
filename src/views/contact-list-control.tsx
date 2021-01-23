import React from 'react';
import { VirtualizingListBox } from '../components/virtualizing-list-box';
import { SessionSummary } from '../models/contact';
import ContactItem from './contact-item';
import ContactSearchBox from './contact-search-box';

type ContactListControlProps = {
  selectedItem: SessionSummary;
  setSelectedItem: (value: SessionSummary) => void;
  items: ReadonlyArray<SessionSummary>;
};

export default function ContactListControl({
  selectedItem,
  setSelectedItem,
  items,
}: ContactListControlProps) {
  return (
    <div className="contact-list-control">
      <ContactSearchBox />
      <VirtualizingListBox
        sizeProvider={{ itemSize: 108, itemCount: items.length }}
        renderItems={(startIndex, endIndex) =>
          items
            .slice(startIndex, endIndex)
            .map((item) => (
              <ContactItem
                {...item}
                selected={selectedItem === item}
                onSelected={() => setSelectedItem(item)}
              />
            ))
        }
      />
    </div>
  );
}
