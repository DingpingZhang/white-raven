import { NormalMessage } from 'api';
import { MessageSegments } from 'views/chat-feature/message-segments';

type Props = {
  message: NormalMessage;
};

export default function MessageNormalContent({ message }: Props) {
  return (
    <div className="MessageNormalContent">
      <MessageSegments segments={message.content} />
    </div>
  );
}
