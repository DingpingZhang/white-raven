import { ReactComponent as SendIcon } from 'images/send.svg';
import { ReactComponent as MoreVerticalIcon } from 'images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from 'images/attachment.svg';
import CircleButton from 'components/circle-button';
import { useI18n } from 'i18n';
import { MessageContent } from 'api';
import { useCallback, useRef, useState } from 'react';
import FacePanelPopupButton from './face-panel-popup-button';

type Props = {
  sendMessage: (message: MessageContent) => Promise<boolean>;
};

export default function SenderWidget({ sendMessage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [canSend, setCanSend] = useState(false);
  const { $t } = useI18n();
  const handleEnterClick = useCallback(async () => {
    if (inputRef.current && inputRef.current.value) {
      const text = inputRef.current.value;
      inputRef.current.value = '';
      const success = await sendMessage([{ type: 'text', text }]);
      if (success) {
        setCanSend(false);
      } else {
        inputRef.current.value = text;
      }
    } else {
      // TODO: Tip: Don't send empty message.
    }
  }, [sendMessage]);
  const handleEnterDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter') {
        handleEnterClick();
      }
    },
    [handleEnterClick]
  );

  return (
    <div className="SenderWidget">
      <CircleButton
        buttonType="secondary"
        className="SenderWidget__btnUpload"
        icon={<AttachmentIcon />}
      />
      <div className="SenderWidget__editArea">
        <input
          ref={inputRef}
          onChange={(e) => setCanSend(!!e.target.value)}
          type="text"
          className="SenderWidget__input"
          placeholder={$t('input.placeholder.writeAMessage')}
          onKeyDown={handleEnterDown}
        />
        <FacePanelPopupButton className="SenderWidget__btnFace" />
        <CircleButton
          buttonType="default"
          className="SenderWidget__btnMore"
          icon={<MoreVerticalIcon />}
        />
      </div>
      <div className="SenderWidget__splitLine vertical"></div>
      <CircleButton
        buttonType="primary"
        className="SenderWidget__btnSend"
        icon={<SendIcon />}
        disabled={!canSend}
        onClick={handleEnterClick}
      />
    </div>
  );
}
