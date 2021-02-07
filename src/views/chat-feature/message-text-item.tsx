import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { MessageContent, MessageSegment } from 'api';
import { DialogBuilder, useDialogBuilder } from 'components/dialog';
import ImageExplorerDialog from 'views/dialogs/image-explorer-dialog';
import { useAsyncValue } from 'hooks/use-api';

type Props = {
  avatar: string;
  content: MessageContent;
  timestamp: number;
  getSenderName: () => Promise<string>;
  highlight?: boolean;
  ref?: (element: HTMLElement | null) => void;
};

export default function MessageTextItem({
  ref,
  avatar,
  content,
  timestamp,
  getSenderName,
  highlight,
}: Props) {
  const dialogBuilder = useDialogBuilder();
  const messageBoxClass = classNames('MessageTextItem__messageArea', { highlight });
  const senderName = useAsyncValue(getSenderName, '');

  return (
    <div ref={ref} className="MessageTextItem">
      {senderName ? (
        <span className="MessageTextItem__senderName text tip-secondary">{senderName}</span>
      ) : null}
      <img className="MessageTextItem__avatar" src={avatar} alt="avatar" />
      <div className={messageBoxClass}>
        <div className="MessageTextItem__messageContent">
          {content.map((message, index) => convertToHtmlElement(message, index, dialogBuilder))}
        </div>
      </div>
      <span className="MessageTextItem__timestamp">{toDisplayTimestamp(timestamp)}</span>
    </div>
  );
}

function convertToHtmlElement(
  message: MessageSegment,
  index: number,
  dialogBuilder: DialogBuilder
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
          @{message.targetId}{' '}
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
