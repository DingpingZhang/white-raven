import { FriendInfo, getFriendInfos, GroupInfo } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { useHttpApi } from 'hooks/use-async-value';
import { useMemo, useState } from 'react';
import SearchBox from 'views/search-box';
import BaseDialog from './base-dialog';
import ContactItem from './contact-item';

type DialogResult = FriendInfo | GroupInfo | null;
type OnClose = (value: DialogResult) => void;

type Props = {
  close: OnClose;
};

export function buildContactDialog(close: OnClose) {
  return <ContactDialog close={close} />;
}

export default function ContactDialog({ close }: Props) {
  const friendInfos = useHttpApi(getFriendInfos, []);
  const [queriesText, setQueriesText] = useState('');
  const filteredFirendInfos = useMemo(
    () =>
      friendInfos.filter((item) => (queriesText ? item.name.includes(queriesText) : friendInfos)),
    [friendInfos, queriesText]
  );

  return (
    <BaseDialog title="Contact" close={() => close(null)}>
      <div className="ContactDialog">
        <SearchBox text={queriesText} setText={setQueriesText} />
        <VirtualizingListBox
          sizeProvider={{ itemSize: 40, itemCount: filteredFirendInfos.length }}
          renderItems={(startIndex, endIndex) =>
            filteredFirendInfos
              .slice(startIndex, endIndex)
              .map((item) => (
                <ContactItem
                  key={item.id}
                  item={item}
                  queriesText={queriesText}
                  onClick={() => close(item)}
                />
              ))
          }
        />
      </div>
    </BaseDialog>
  );
}
