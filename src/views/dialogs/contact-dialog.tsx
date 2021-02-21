import { FriendInfo, GroupInfo } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import useRecoilValueLoaded from 'hooks/use-recoil-value-loaded';
import { useI18n } from 'i18n';
import { contactListState } from 'models/store';
import { useMemo, useState } from 'react';
import SearchWidget from 'views/search-widget';
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
  const [queriesText, setQueriesText] = useState('');
  const contactList = useRecoilValueLoaded(contactListState, []);
  const filteredContactInfos = useMemo(
    () =>
      queriesText ? contactList.filter((item) => item.name.includes(queriesText)) : contactList,
    [contactList, queriesText]
  );
  const { $t } = useI18n();

  return (
    <BaseDialog title={$t('dialog.title.contact')} close={() => close(null)}>
      <div className="ContactDialog">
        <SearchWidget text={queriesText} setText={setQueriesText} />
        <VirtualizingListBox
          sizeProvider={{ itemSize: 40, itemCount: filteredContactInfos.length }}
          renderItems={(startIndex, endIndex) =>
            filteredContactInfos
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
