import { ContactInfo } from '../models/contact';

type GroupMemberItemProps = ContactInfo;

export default function GroupMemberItem({ avatar, title }: GroupMemberItemProps) {
  return (
    <div className="group-member-item">
      <img className="avatar" src={avatar} alt="avatar" />
      <span className="username">{title}</span>
    </div>
  );
}
