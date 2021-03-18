import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { getImageUrl, IdType, ImageBehavior, MessageContent, MessageSegment } from 'api';
import { DialogBuilder, useDialogBuilder } from 'components/dialog';
import ImageExplorerDialog from 'views/dialogs/image-explorer-dialog';
import { useCallback, useMemo } from 'react';
import { useContactList, useGroupMemberList } from 'models/store';

const IMAGE_MAX_SIZE = 300;

type Props = {
  contactType: 'friend' | 'stranger' | 'group';
  contactId: IdType;
  senderId: IdType;
  content: MessageContent;
  timestamp: number;
  highlight?: boolean;
  ref?: (element: HTMLElement | null) => void;
};

export default function MessageTextItem({
  ref,
  contactType,
  contactId,
  senderId,
  content,
  timestamp,
  highlight,
}: Props) {
  const dialogBuilder = useDialogBuilder();
  const messageBoxClass = classNames('MessageTextItem__messageArea', { highlight });

  const groupMemberList = useGroupMemberList(contactId);
  const contactList = useContactList();
  const getContactById = useCallback(
    (id: IdType) => {
      const contact = contactList.find((item) => item.id === id);
      if (contact) {
        return contact;
      } else {
        const groupMember = groupMemberList.find((item) => item.id === id);
        return groupMember;
      }
    },
    [contactList, groupMemberList]
  );
  const avatar = useMemo(() => {
    const contact = getContactById(senderId);
    return contact ? contact.avatar : undefined;
  }, [getContactById, senderId]);
  const getContactName = useCallback(
    (id: IdType) => {
      const contact = getContactById(id);
      // FIXME: Don't use any.
      return contact ? ((contact as any).remark as string) || contact.name : id;
    },
    [getContactById]
  );
  const senderName = useMemo(
    () => (contactType === 'group' ? getContactName(senderId) : undefined),
    [contactType, getContactName, senderId]
  );

  return (
    <div ref={ref} className="MessageTextItem">
      {senderName ? (
        <span className="MessageTextItem__senderName text tip-secondary">{senderName}</span>
      ) : null}
      <img className="MessageTextItem__avatar" src={avatar} alt="avatar" />
      <div className={messageBoxClass}>
        <div className="MessageTextItem__messageContent">
          {content.map((message, index) =>
            convertToHtmlElement(message, index, dialogBuilder, getContactName)
          )}
        </div>
      </div>
      <span className="MessageTextItem__timestamp">{toDisplayTimestamp(timestamp)}</span>
    </div>
  );
}

function convertToHtmlElement(
  message: MessageSegment,
  index: number,
  dialogBuilder: DialogBuilder,
  getGroupMemberName: (id: IdType) => string
) {
  switch (message.type) {
    case 'text':
      return (
        <span key={`${index}-${message.text}`} className="MessageTextItem__msgSegment msgText">
          {message.text}
        </span>
      );
    case 'at':
      return (
        <span key={`${index}-${message.targetId}`} className="MessageTextItem__msgSegment msgAt">
          @{getGroupMemberName(message.targetId)}{' '}
        </span>
      );
    case 'image': {
      const imageUrl = getImageUrl(message.imageId);
      return (
        <img
          key={`${index}-${message.imageId}`}
          className={`MessageTextItem__msgSegment msgImage ${convertImageBehaviorToClassName(
            message.behavior
          )}`}
          src={imageUrl}
          alt={`[#${message.imageId}]`}
          width={message.behavior === 'like-text' ? message.width : undefined}
          height={message.behavior === 'like-text' ? message.height : undefined}
          style={{ maxHeight: IMAGE_MAX_SIZE }}
          onClick={async () => {
            if (message.behavior === 'can-browse') {
              await dialogBuilder
                .build<void>((close) => <ImageExplorerDialog close={close} imageUrl={imageUrl} />)
                .show();
            }
          }}
        />
      );
    }
    default:
      return null;
  }
}

// TODO: Replace with more general method.
function convertImageBehaviorToClassName(behavior: ImageBehavior) {
  switch (behavior) {
    case 'can-browse':
      return 'canBrowse';
    case 'like-text':
      return 'likeText';
  }
}
