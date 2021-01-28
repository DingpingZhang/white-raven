import classNames from 'classnames';
import { getDisplayTimestamp } from '../../helpers';
import { Message, MessageSegment } from '../../api';
import { getAvatarById } from './common';

export type BasicMessageProps = Message & {
  highlight?: boolean;
};

export default function BasicMessage({ senderId, content, timestamp, highlight }: BasicMessageProps) {
  const messageBoxClass = classNames('message-box', { highlight });
  return (
    <div className="basic-message">
      <img className="avatar" src={getAvatarById(senderId)} alt="avatar" />
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
        <span key={`${index}-${message.text}`} className="msg-segment msg-type-text">
          {message.text}
        </span>
      );
    case 'at':
      return (
        <span key={`${index}-${message.targetId}`} className="msg-segment msg-type-at">
          @{message.targetId}{' '}
        </span>
      );
    case 'face':
      const imageSource = require(`../../images/face/${message.faceId}.gif`);
      return (
        <img
          key={`${index}-${message.faceId}`}
          className="msg-segment msg-type-face"
          src={imageSource.default}
          alt={`[CQ:face,id=${message.faceId}]`}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          key={`${index}-${message.url}`}
          className="msg-segment msg-type-image"
          src={message.url}
          alt={`[CQ:image,file=${message.url}]`}
        />
      );
    default:
      return null;
  }
}
