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
        <div className="message-content">
          {message.map((item) => (item.type === 'text' ? item.data.text : null))}
        </div>
      </div>
      {/* TODO: convert timestamp to display time text. */}
      <span className="timestamp">{new Date().toDateString()}</span>
    </div>
  );
}
