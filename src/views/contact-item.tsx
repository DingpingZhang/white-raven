import classNames from 'classnames';

type ContactItemProps = {
  messageCount: number;
  selected?: boolean;
  avatar: string;
  username: string;
  lastMessage: string;
  lastMessageTimestamp: string;
};

export default function ContactItem({
  messageCount,
  selected,
  avatar,
  username,
  lastMessage,
  lastMessageTimestamp,
}: ContactItemProps) {
  const contactItemClass = classNames('contact-item', {
    'has-message': messageCount,
    selected,
  });

  return (
    <div className={contactItemClass}>
      <span className="red-dot"></span>
      <img className="avatar" src={avatar} alt="avatar" />
      <span className="username">{username}</span>
      {/* TODO: converter to display string */}
      <span className="last-message-time">{lastMessageTimestamp}</span>
      <span className="last-message">{lastMessage}</span>
    </div>
  );
}
