import { useCallback } from 'react';
import { getGroupMember, GroupSession, IdType, sendMessageToGroup } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { toDisplayTimestamp } from 'helpers';
import ChatWidget from './chat-widget';
import GroupMemberItem from './group-member-item';
import { useI18n } from 'i18n';
import { groupMemberListState, userInfoState } from 'models/store';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';

type Props = {
  session: GroupSession;
};

export default function GroupSessionView({ session }: Props) {
  const lastMessage = session.lastMessages[session.lastMessages.length - 1];
  const groupMemberListLoadable = useRecoilValueLoadable(groupMemberListState(session.contact.id));
  const getGroupMemberNameById = useCallback(
    async (memberId: IdType) => {
      const response = await getGroupMember(session.contact.id, memberId);
      return response.code === 200 ? response.content.name : '';
    },
    [session.contact.id]
  );
  const { id } = useRecoilValue(userInfoState);
  const { $t } = useI18n();

  return (
    <div className="GroupSessionView">
      <div className="GroupSessionView__chatArea">
        <div className="GroupSessionView__titleBar">
          <img className="GroupSessionView__chatAvatar" src={session.contact.avatar} alt="avatar" />
          <span className="GroupSessionView__chatTitle">{session.contact.name}</span>
          <span className="GroupSessionView__chatSubtitle">
            {toDisplayTimestamp(lastMessage.timestamp)}
          </span>
        </div>
        <ChatWidget
          chatKey={{ type: 'group', contactId: session.contact.id }}
          sendMessage={async (message) => {
            const response = await sendMessageToGroup(session.contact.id, { content: message });
            if (response.code === 200) {
              const { id: messageId, timestamp } = response.content;
              return { id: messageId, senderId: id, content: message, timestamp };
            } else {
              return null;
            }
          }}
          getSenderNameById={getGroupMemberNameById}
        />
      </div>
      <div className="GroupSessionView__infoArea">
        <div className="GroupSessionView__infoCard">
          <div className="GroupSessionView__infoTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
          </div>
          <div className="GroupSessionView__infoContent">
            <span className="text tip">{session.contact.description}</span>
          </div>
        </div>
        <div className="GroupSessionView__member">
          <div className="GroupSessionView__memberTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
            <span className="text tip-secondary">{`(${
              groupMemberListLoadable.state === 'hasValue'
                ? groupMemberListLoadable.contents.length
                : 0
            } / ${session.contact.memberCapacity})`}</span>
          </div>
          <div className="GroupSessionView__memberList">
            {groupMemberListLoadable.state === 'hasValue' ? (
              <VirtualizingListBox
                sizeProvider={{ itemSize: 32, itemCount: groupMemberListLoadable.contents.length }}
                renderItems={(startIndex, endIndex) =>
                  groupMemberListLoadable.contents
                    .slice(startIndex, endIndex)
                    .map((item) => <GroupMemberItem avatar={item.avatar} name={item.name} />)
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
