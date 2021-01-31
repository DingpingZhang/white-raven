import { useCallback } from 'react';
import { getGroupMember, getGroupMembers, getGroupMessages, GroupSession, IdType } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { toDisplayTimestamp } from 'helpers';
import ChatControl from './chat-control';
import GroupMemberItem from './group-member-item';
import { useHttpApi } from 'hooks/use-async-value';
import { useI18n } from 'i18n';

type GroupChatViewProps = {
  selectedItem: GroupSession;
};

export default function GroupChatView({ selectedItem }: GroupChatViewProps) {
  const lastMessage = selectedItem.lastMessages[selectedItem.lastMessages.length - 1];
  const fetchGroupMembers = useCallback(() => getGroupMembers(selectedItem.contact.id), [
    selectedItem.contact.id,
  ]);
  const groupMembers = useHttpApi(fetchGroupMembers, []);
  const fetchMessages = useCallback(
    async (startId?: IdType) => {
      const response = await getGroupMessages(selectedItem.contact.id, startId);
      return response.code === 200 ? response.content : [];
    },
    [selectedItem.contact.id]
  );
  const getGroupMemberNameById = useCallback(
    async (memberId: IdType) => {
      const response = await getGroupMember(selectedItem.contact.id, memberId);
      return response.code === 200 ? response.content.name : '';
    },
    [selectedItem.contact.id]
  );
  const { $t } = useI18n();

  return (
    <div className="GroupChatView">
      <div className="GroupChatView__chatArea">
        <div className="GroupChatView__titleBar">
          <img
            className="GroupChatView__chatAvatar"
            src={selectedItem.contact.avatar}
            alt="avatar"
          />
          <span className="GroupChatView__chatTitle">{selectedItem.contact.name}</span>
          <span className="GroupChatView__chatSubtitle">
            {toDisplayTimestamp(lastMessage.timestamp)}
          </span>
        </div>
        <ChatControl fetchAsync={fetchMessages} getSenderNameById={getGroupMemberNameById} />
      </div>
      <div className="GroupChatView__infoArea">
        <div className="GroupChatView__infoCard">
          <div className="GroupChatView__infoTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
          </div>
          <div className="GroupChatView__infoContent">
            <span className="text tip">{selectedItem.contact.description}</span>
          </div>
        </div>
        <div className="GroupChatView__member">
          <div className="GroupChatView__memberTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
            <span className="text tip-secondary">{`(${groupMembers.length} / ${selectedItem.contact.memberCapacity})`}</span>
          </div>
          <div className="GroupChatView__memberList">
            <VirtualizingListBox
              sizeProvider={{ itemSize: 32, itemCount: groupMembers.length }}
              renderItems={(startIndex, endIndex) =>
                groupMembers
                  .slice(startIndex, endIndex)
                  .map((item) => <GroupMemberItem avatar={item.avatar} name={item.name} />)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
