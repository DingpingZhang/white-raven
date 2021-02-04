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
    case 'face':
      const imageSource = require(`images/face/${message.faceId}.gif`);
      return (
        <img
          key={`${index}-${message.faceId}`}
          className="MessageTextItem__msgSegment msgFace"
          src={imageSource.default}
          alt={`[CQ:face,id=${message.faceId}]`}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          key={`${index}-${message.url}`}
          className="MessageTextItem__msgSegment msgImage"
          src={message.url}
          alt={`[CQ:image,file=${message.url}]`}
          onClick={async () =>
            await dialogBuilder
              .build<void>((close) => <ImageExplorerDialog close={close} imageUrl={message.url} />)
              .show()
          }
        />
      );
    default:
      return null;
  }
}
