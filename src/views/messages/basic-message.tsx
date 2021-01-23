import classNames from 'classnames';
import { getDisplayTimestamp } from '../../helpers';
import { Message, MessageSegment } from '../../models/message';
import { getAvatarById } from './common';

export type BasicMessageProps = Message & {
  highlight?: boolean;
};

export default function BasicMessage({ sender, content, timestamp, highlight }: BasicMessageProps) {
  const messageBoxClass = classNames('message-box', { highlight });
  return (
    <div className="basic-message">
      <img className="avatar" src={getAvatarById(sender)} alt="avatar" />
      <div className={messageBoxClass}>
        <div className="message-content">{content.map(convertToHtmlElement)}</div>
      </div>
      <span className="timestamp">{getDisplayTimestamp(timestamp)}</span>
    </div>
  );
}

function convertToHtmlElement(message: MessageSegment, index: number) {
  switch (message.type) {
    case 'text':
      return (
        <span key={`${index}-${message.data.text}`} className="msg-segment msg-type-text">
          {message.data.text}
        </span>
      );
    case 'at':
      return (
        <span key={`${index}-${message.data.qq}`} className="msg-segment msg-type-at">
          @{message.data.qq}{' '}
        </span>
      );
    case 'face':
      const imageSource = require(`../../images/face/${message.data.id}.gif`);
      return (
        <img
          key={`${index}-${message.data.id}`}
          className="msg-segment msg-type-face"
          src={imageSource.default}
          alt={`[CQ:face,id=${message.data.id}]`}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          key={`${index}-${message.data.file}`}
          className="msg-segment msg-type-image"
          src={message.data.file}
          alt={`[CQ:image,file=${message.data.file}]`}
        />
      );
    default:
      return null;
  }
}
