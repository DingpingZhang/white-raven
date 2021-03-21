import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import {
  AtMessageSegment,
  getImageUrl,
  IdType,
  ImageBehavior,
  ImageMessageSegment,
  MessageContent,
  TextMessageSegment,
} from 'api';
import { useDialogBuilder } from 'components/dialog';
import ImageExplorerDialog from 'views/dialogs/image-explorer-dialog';
import { useCallback, useContext, useMemo } from 'react';
import { useContactList, useGroupMemberList } from 'models/logged-in-context';
import { ChatContext, useAtClicked, useImageLoaded } from 'models/chat-context';

const IMAGE_MAX_SIZE = 300;

type Props = {
  senderId: IdType;
  content: MessageContent;
  timestamp: number;
  highlight?: boolean;
  ref?: (element: HTMLElement | null) => void;
};

type AtSegmentProps = AtMessageSegment & {
  getContactName: (id: IdType) => string;
};

export default function MessageTextItem({ ref, senderId, content, timestamp, highlight }: Props) {
  const { sessionType, contactId } = useContext(ChatContext);
  const groupMemberList = useGroupMemberList(contactId);
  const contactList = useContactList();
  const atClicked = useAtClicked();

  const getContactById = useCallback(
    (id: IdType) => {
      const contact = contactList.find(item => item.id === id);
      if (contact) {
        return contact;
      } else {
        const groupMember = groupMemberList.find(item => item.id === id);
        return groupMember;
      }
    },
    [contactList, groupMemberList]
  );
  const getContactName = useCallback(
    (id: IdType) => {
      const contact = getContactById(id);
      // FIXME: Don't use any.
      return contact ? ((contact as any).remark as string) || contact.name : id;
    },
    [getContactById]
  );
  const avatar = useMemo(() => {
    const contact = getContactById(senderId);
    return contact ? contact.avatar : undefined;
  }, [getContactById, senderId]);
  const senderName = useMemo(
    () => (sessionType === 'group' ? getContactName(senderId) : undefined),
    [sessionType, getContactName, senderId]
  );

  const messageBoxClass = classNames('MessageTextItem__messageArea', { highlight });

  return (
    <div ref={ref} className="MessageTextItem">
      {senderName ? (
        <span className="MessageTextItem__senderName text tip-secondary">{senderName}</span>
      ) : null}
      <img
        className="MessageTextItem__avatar"
        src={avatar}
        alt="avatar"
        onClick={() => {
          atClicked.next({ targetId: senderId });
        }}
      />
      <div className={messageBoxClass}>
        <div className="MessageTextItem__messageContent">
          {content.map((message, index) => {
            switch (message.type) {
              case 'text':
                return <TextSegment key={`${index}-${message.text}`} {...message} />;
              case 'at':
                return (
                  <AtSegment
                    key={`${index}-${message.targetId}`}
                    {...message}
                    getContactName={getContactName}
                  />
                );
              case 'image':
                return <ImageSegment key={`${index}-${message.imageId}`} {...message} />;
              default:
                return null;
            }
          })}
        </div>
      </div>
      <span className="MessageTextItem__timestamp">{toDisplayTimestamp(timestamp)}</span>
    </div>
  );
}

function TextSegment({ text }: TextMessageSegment) {
  return <span className="MessageTextItem__msgSegment msgText">{text}</span>;
}

function AtSegment({ targetId, getContactName }: AtSegmentProps) {
  const atClicked = useAtClicked();

  return (
    <span
      className="MessageTextItem__msgSegment msgAt"
      onClick={() => {
        atClicked.next({ targetId });
      }}
    >{`@${getContactName(targetId)}`}</span>
  );
}

function ImageSegment({ imageId, behavior, width, height }: ImageMessageSegment) {
  const dialogBuilder = useDialogBuilder();
  const imageLoaded = useImageLoaded();
  const imageUrl = getImageUrl(imageId);

  return (
    <img
      className={`MessageTextItem__msgSegment msgImage ${convertImageBehaviorToClassName(
        behavior
      )}`}
      src={imageUrl}
      alt={`[#${imageId}]`}
      width={behavior === 'like-text' ? width : undefined}
      height={behavior === 'like-text' ? height : undefined}
      style={{ maxHeight: IMAGE_MAX_SIZE }}
      onClick={async () => {
        if (behavior === 'can-browse') {
          await dialogBuilder
            .build<void>(close => <ImageExplorerDialog close={close} imageUrl={imageUrl} />)
            .show();
        }
      }}
      onLoad={() => imageLoaded.next({ imageId })}
    />
  );
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
