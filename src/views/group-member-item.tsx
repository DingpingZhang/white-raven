type GroupMemberItemProps = {
  avatar: string;
  name: string;
};

export default function GroupMemberItem({ avatar, name }: GroupMemberItemProps) {
  return (
    <div className="group-member-item">
      <img className="avatar" src={avatar} alt="avatar" />
      <span className="username">{name}</span>
    </div>
  );
}
