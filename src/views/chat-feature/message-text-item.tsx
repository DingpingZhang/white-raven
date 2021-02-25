import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { IdType, MessageContent, MessageSegment } from 'api';
import { DialogBuilder, useDialogBuilder } from 'components/dialog';
import ImageExplorerDialog from 'views/dialogs/image-explorer-dialog';
import { useCallback, useMemo } from 'react';
import useRecoilValueLoaded from 'hooks/use-recoil-value-loaded';
import { groupMemberListState, contactListState } from 'models/store';

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

  const groupMemberList = useRecoilValueLoaded(groupMemberListState(contactId), []);
  const contactList = useRecoilValueLoaded(contactListState, []);
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
    case 'face': {
      const imageUrl = `http://localhost:6900/api/v1/assets/images/${message.faceId}`;
      return (
        <img
          key={`${index}-${message.faceId}`}
          className="MessageTextItem__msgSegment msgFace"
          src={imageUrl}
          alt={`[face,faceId=${message.faceId}]`}
        />
      );
    }
    case 'image': {
      const imageUrl = `http://localhost:6900/api/v1/assets/images/${message.imageId}`;
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          key={`${index}-${message.imageId}`}
          className="MessageTextItem__msgSegment msgImage"
          src={imageUrl}
          alt={`[image,imageId=${message.imageId}]`}
          onClick={async () =>
            await dialogBuilder
              .build<void>((close) => <ImageExplorerDialog close={close} imageUrl={imageUrl} />)
              .show()
          }
        />
      );
    }
    default:
      return null;
  }
}