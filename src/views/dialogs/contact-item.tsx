import { FriendInfo, GroupInfo } from 'api';
import CircleIcon from 'components/circle-icon';
import HighlightSpan from 'components/highlight-span';

type Props = {
  item: FriendInfo | GroupInfo;
  queriesText: string;
  onClick?: () => void;
};

export default function ContactItem({ item, queriesText, onClick }: Props) {
  return (
    <div className="ContactItem" onClick={onClick}>
      <CircleIcon icon={item.avatar} diameter={24} />
      <HighlightSpan
        className="ContactItem__name text ellipsis"
        sourceText={item.name}
        queriesText={queriesText}
      />
    </div>
  );
}
