import { FriendInfo, getFriendInfos, getGroupInfos, GroupInfo } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { useHttpApi } from 'hooks/use-api';
import { useI18n } from 'i18n';
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
  const groupInfos = useHttpApi(getGroupInfos, []);

  const [queriesText, setQueriesText] = useState('');
  const contactInfos = useMemo(() => [...friendInfos, ...groupInfos], [friendInfos, groupInfos]);

  const filteredcontactInfos = useMemo(
    () =>
      contactInfos.filter((item) => (queriesText ? item.name.includes(queriesText) : contactInfos)),
    [contactInfos, queriesText]
  );
  const { $t } = useI18n();

  return (
    <BaseDialog title={$t('dialog.title.contact')} close={() => close(null)}>
      <div className="ContactDialog">
        <SearchBox text={queriesText} setText={setQueriesText} />
        <VirtualizingListBox
          sizeProvider={{ itemSize: 40, itemCount: filteredcontactInfos.length }}
          renderItems={(startIndex, endIndex) =>
            filteredcontactInfos
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
