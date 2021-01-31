import { ReactComponent as SendIcon } from 'images/send.svg';
import { ReactComponent as MoreVerticalIcon } from 'images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from 'images/attachment.svg';
import { ReactComponent as FaceIcon } from 'images/face.svg';
import CircleButton from 'components/circle-button';
import { useI18n } from 'i18n';
import { MessageContent } from 'api';
import { useRef, useState } from 'react';

type Props = {
  sendMessage: (message: MessageContent) => Promise<boolean>;
};

export default function MessageSendBox({ sendMessage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [canSend, setCanSend] = useState(false);
  const { $t } = useI18n();

  return (
    <div className="MessageSendBox">
      <CircleButton
        buttonType="secondary"
        className="MessageSendBox__btnUpload"
        icon={<AttachmentIcon />}
      />
      <div className="MessageSendBox__editArea">
        <input
          ref={inputRef}
          onChange={(e) => setCanSend(!!e.target.value)}
          type="text"
          className="MessageSendBox__input"
          placeholder={$t('input.placeholder.writeAMessage')}
        />
        <CircleButton
          buttonType="default"
          className="MessageSendBox__btnFace"
          icon={<FaceIcon />}
        />
        <CircleButton
          buttonType="default"
          className="MessageSendBox__btnMore"
          icon={<MoreVerticalIcon />}
        />
      </div>
      <div className="MessageSendBox__splitLine vertical"></div>
      <CircleButton
        buttonType="primary"
        className="MessageSendBox__btnSend"
        icon={<SendIcon />}
        disabled={!canSend}
        onClick={async () => {
          if (inputRef.current && inputRef.current.value) {
            await sendMessage([{ type: 'text', text: inputRef.current.value }]);
          } else {
            // TODO: Tip: Don't send empty message.
          }
        }}
      />
    </div>
  );
}
