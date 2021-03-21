import { QuoteMessage } from 'api';
import { MessageSegments } from 'views/chat-feature/message-segments';

type Props = {
  message: QuoteMessage;
};

export default function MessageQuoteContent({ message }: Props) {
  return (
    <div className="MessageQuoteContent">
      <MessageSegments segments={message.content} />
    </div>
  );
}
