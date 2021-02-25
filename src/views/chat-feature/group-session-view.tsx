import { GroupSession, IdType, sendMessageToGroup } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { toDisplayTimestamp } from 'helpers';
import ChatWidget from './chat-widget';
import GroupMemberItem from './group-member-item';
import { useI18n } from 'i18n';
import { groupMemberListState, userInfoState } from 'models/store';
import { useRecoilValue } from 'recoil';
import useRecoilValueLoaded from 'hooks/use-recoil-value-loaded';
import { useLastMessage, useMessageList } from 'models/use-message';

type Props = {
  session: GroupSession;
};

export default function GroupSessionView({
  session: {
    contact: { id: contactId, name, avatar, description, memberCapacity },
  },
}: Props) {
  const messageList = useMessageList('group', contactId);
  const lastMessage = useLastMessage(messageList);
  const { id } = useRecoilValue(userInfoState);
  const { $t } = useI18n();

  return (
    <div className="GroupSessionView">
      <div className="GroupSessionView__chatArea">
        <div className="GroupSessionView__titleBar">
          <img className="GroupSessionView__chatAvatar" src={avatar} alt="avatar" />
          <span className="GroupSessionView__chatTitle">{name}</span>
          <span className="GroupSessionView__chatSubtitle">
            {lastMessage ? toDisplayTimestamp(lastMessage.timestamp) : null}
          </span>
        </div>
        <ChatWidget
          chatKey={{ type: 'group', contactId }}
          sendMessage={async (message) => {
            const response = await sendMessageToGroup(contactId, { content: message });
            if (response.code === 200) {
              const { id: messageId, timestamp } = response.content;
              return { id: messageId, senderId: id, content: message, timestamp };
            } else {
              return null;
            }
          }}
        />
      </div>
      <div className="GroupSessionView__infoArea">
        <div className="GroupSessionView__infoCard">
          <div className="GroupSessionView__infoTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
          </div>
          <div className="GroupSessionView__infoContent">
            <span className="text tip">{description}</span>
          </div>
        </div>
        <GroupMemberList contactId={contactId} memberCapacity={memberCapacity} />
      </div>
    </div>
  );
}

type GroupMemberListProps = {
  contactId: IdType;
  memberCapacity: number;
};

function GroupMemberList({ contactId, memberCapacity }: GroupMemberListProps) {
  const groupMemberList = useRecoilValueLoaded(groupMemberListState(contactId), []);
  const { $t } = useI18n();

  return (
    <div className="GroupSessionView__member">
      <div className="GroupSessionView__memberTitle">
        <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
        <span className="text tip-secondary">{`(${groupMemberList.length} / ${memberCapacity})`}</span>
      </div>
      <div className="GroupSessionView__memberList">
        <VirtualizingListBox
          sizeProvider={{ itemSize: 32, itemCount: groupMemberList.length }}
          renderItems={(startIndex, endIndex) =>
            groupMemberList
              .slice(startIndex, endIndex)
              .map((item) => (
                <GroupMemberItem avatar={item.avatar} name={item.remark || item.name || item.id} />
              ))
          }
        />
      </div>
    </div>
  );
}