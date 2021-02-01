import { useCallback, useContext } from 'react';
import {
  getGroupMember,
  getGroupMembers,
  getGroupMessages,
  GroupSession,
  IdType,
  sendMessageToGroup,
} from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { toDisplayTimestamp } from 'helpers';
import ChatControl from './chat-control';
import GroupMemberItem from './group-member-item';
import { useHttpApi } from 'hooks/use-api';
import { useI18n } from 'i18n';
import { GlobalContext } from 'models/global-context';

type GroupChatViewProps = {
  session: GroupSession;
};

export default function GroupChatView({ session }: GroupChatViewProps) {
  const lastMessage = session.lastMessages[session.lastMessages.length - 1];
  const fetchGroupMembers = useCallback(() => getGroupMembers(session.contact.id), [
    session.contact.id,
  ]);
  const groupMembers = useHttpApi(fetchGroupMembers, []);
  const fetchMessages = useCallback(
    async (startId?: IdType) => {
      const response = await getGroupMessages(session.contact.id, startId);
      return response.code === 200 ? response.content : [];
    },
    [session.contact.id]
  );
  const getGroupMemberNameById = useCallback(
    async (memberId: IdType) => {
      const response = await getGroupMember(session.contact.id, memberId);
      return response.code === 200 ? response.content.name : '';
    },
    [session.contact.id]
  );
  const { id } = useContext(GlobalContext);
  const { $t } = useI18n();

  return (
    <div className="GroupChatView">
      <div className="GroupChatView__chatArea">
        <div className="GroupChatView__titleBar">
          <img className="GroupChatView__chatAvatar" src={session.contact.avatar} alt="avatar" />
          <span className="GroupChatView__chatTitle">{session.contact.name}</span>
          <span className="GroupChatView__chatSubtitle">
            {toDisplayTimestamp(lastMessage.timestamp)}
          </span>
        </div>
        <ChatControl
          fetchAsync={fetchMessages}
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
      <div className="GroupChatView__infoArea">
        <div className="GroupChatView__infoCard">
          <div className="GroupChatView__infoTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
          </div>
          <div className="GroupChatView__infoContent">
            <span className="text tip">{session.contact.description}</span>
          </div>
        </div>
        <div className="GroupChatView__member">
          <div className="GroupChatView__memberTitle">
            <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
            <span className="text tip-secondary">{`(${groupMembers.length} / ${session.contact.memberCapacity})`}</span>
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
