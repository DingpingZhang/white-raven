import classNames from 'classnames';
import { Message } from './message-types';

export type BasicMessageProps = {
  avatar: string;
  message: ReadonlyArray<Message>;
  timestamp: number;
  highlight?: boolean;
};

export default function BasicMessage({ avatar, message, timestamp, highlight }: BasicMessageProps) {
  const messageBoxClass = classNames('message-box', { highlight });
  return (
    <div className="basic-message">
      <img className="avatar" src={avatar} alt="avatar" />
      <div className={messageBoxClass}>
        <div className="message-content">{message.map((item) => convertToHtmlElement(item))}</div>
      </div>
      {/* TODO: convert timestamp to display time text. */}
      <span className="timestamp">{new Date().toDateString()}</span>
    </div>
  );
}

function convertToHtmlElement(message: Message) {
  switch (message.type) {
    case 'text':
      return <span className="msg-segment msg-type-text">{message.data.text}</span>;
    case 'at':
      return <span className="msg-segment msg-type-at">@{message.data.qq} </span>;
    case 'face':
      const imageSource = require(`../../images/face/${message.data.id}.gif`);
      return (
        <img
          className="msg-segment msg-type-face"
          src={imageSource.default}
          alt={`[CQ:face,id=${message.data.id}]`}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          className="msg-segment msg-type-image"
          src={message.data.file}
          alt={`[CQ:image,file=${message.data.file}]`}
        />
      );
    default:
      return null;
  }
}
