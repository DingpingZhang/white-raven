import classNames from 'classnames';
import { toDisplayTimestamp } from 'helpers';
import { Message, MessageSegment } from 'api';
import { getAvatarById } from './common';
import { DialogBuilder, useDialogBuilder } from 'components/dialog';
import ImageExplorerDialog from 'views/dialogs/image-explorer-dialog';

export type BasicMessageProps = Message & {
  highlight?: boolean;
};

export default function BasicMessage({
  senderId,
  content,
  timestamp,
  highlight,
}: BasicMessageProps) {
  const dialogBuilder = useDialogBuilder();
  const messageBoxClass = classNames('BasicMessage__messageArea', { highlight });
  return (
    <div className="BasicMessage">
      <img className="BasicMessage__avatar" src={getAvatarById(senderId)} alt="avatar" />
      <div className={messageBoxClass}>
        <div className="BasicMessage__messageContent">
          {content.map((message, index) => convertToHtmlElement(message, index, dialogBuilder))}
        </div>
      </div>
      <span className="BasicMessage__timestamp">{toDisplayTimestamp(timestamp)}</span>
    </div>
  );
}

function convertToHtmlElement(message: MessageSegment, index: number) {
  switch (message.type) {
    case 'text':
      return (
        <span key={`${index}-${message.text}`} className="BasicMessage__msgSegment msgText">
          {message.text}
        </span>
      );
    case 'at':
      return (
        <span key={`${index}-${message.targetId}`} className="BasicMessage__msgSegment msgAt">
          @{message.targetId}{' '}
        </span>
      );
    case 'face':
      const imageSource = require(`images/face/${message.faceId}.gif`);
      return (
        <img
          key={`${index}-${message.faceId}`}
          className="BasicMessage__msgSegment msgFace"
          src={imageSource.default}
          alt={`[CQ:face,id=${message.faceId}]`}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          key={`${index}-${message.url}`}
          className="BasicMessage__msgSegment msgImage"
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
