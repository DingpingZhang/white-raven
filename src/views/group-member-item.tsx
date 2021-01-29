type GroupMemberItemProps = {
  avatar: string;
  name: string;
};

export default function GroupMemberItem({ avatar, name }: GroupMemberItemProps) {
  return (
    <div className="GroupMemberItem">
      <img className="GroupMemberItem__avatar" src={avatar} alt="avatar" />
      <span className="GroupMemberItem__name">{name}</span>
    </div>
  );
}
