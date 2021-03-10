import { GroupSession, IdType, sendMessageToGroup } from 'api';
import { VirtualizingListBox } from 'components/virtualizing-list-box';
import { toDisplayTimestamp } from 'helpers';
import ChatWidget from './chat-widget';
import GroupMemberItem from './group-member-item';
import { useI18n } from 'i18n';
import { useGroupMemberList, useLastMessage, useUserInfo } from 'models/store';
import CircleButton from 'components/circle-button';
import { ReactComponent as LeftIcon } from 'images/left-arrow.svg';
import { ReactComponent as RightIcon } from 'images/right-arrow.svg';
import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  session: GroupSession;
};

export default function GroupSessionView({
  session: {
    contact: { id: contactId, name, avatar, description, memberCapacity },
  },
}: Props) {
  const lastMessage = useLastMessage('group', contactId);
  const { id } = useUserInfo();
  const [isVisibleGroupInfo, setIsVisibleGroupInfo] = useState(true);

  return (
    <div className="GroupSessionView">
      <div className="GroupSessionView__chatArea">
        <div className="GroupSessionView__titleBar">
          <img className="GroupSessionView__chatAvatar" src={avatar} alt="avatar" />
          <span className="GroupSessionView__chatTitle">{name}</span>
          <span className="GroupSessionView__chatSubtitle">
            {lastMessage ? toDisplayTimestamp(lastMessage.timestamp) : null}
          </span>
          <CircleButton
            className="GroupSessionView__btnGroupInfo"
            buttonType="default"
            icon={isVisibleGroupInfo ? <RightIcon /> : <LeftIcon />}
            onClick={() => setIsVisibleGroupInfo((prev) => !prev)}
          />
        </div>
        <ChatWidget
          sessionType="group"
          contactId={contactId}
          sendMessage={async (message) => {
            const response = await sendMessageToGroup(contactId, { content: message });
            if (response.code === 200) {
              const { id: messageId, timestamp } = response.content;
              return {
                id: messageId,
                senderId: id,
                recipientId: contactId,
                content: message,
                timestamp,
              };
            } else {
              return null;
            }
          }}
        />
      </div>
      <GroupInfoPanel
        contactId={contactId}
        description={description}
        memberCapacity={memberCapacity}
        isVisible={isVisibleGroupInfo}
      />
    </div>
  );
}

type GroupInfoPanelProps = {
  contactId: IdType;
  memberCapacity: number;
  isVisible: boolean;
  description?: string;
};

function GroupInfoPanel({
  contactId,
  memberCapacity,
  isVisible,
  description,
}: GroupInfoPanelProps) {
  const { $t } = useI18n();
  const groupMemberList = useGroupMemberList(contactId);
  const infoAreaClass = classNames('GroupSessionView__infoArea', {
    active: isVisible,
  });

  return (
    <div className={infoAreaClass}>
      <div className="GroupSessionView__infoCard">
        <div className="GroupSessionView__infoTitle">
          <span className="text subtitle">{$t('groupSession.groupInfo')}</span>
        </div>
        <div className="GroupSessionView__infoContent">
          <span className="text tip">{description}</span>
        </div>
      </div>
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
                  <GroupMemberItem
                    key={item.id}
                    avatar={item.avatar}
                    name={item.remark || item.name || item.id}
                  />
                ))
            }
          />
        </div>
      </div>
    </div>
  );
}
