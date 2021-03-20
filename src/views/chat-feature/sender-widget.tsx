import { ReactComponent as SendIcon } from 'images/send.svg';
import { ReactComponent as MoreVerticalIcon } from 'images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from 'images/attachment.svg';
import CircleButton from 'components/circle-button';
import { useI18n } from 'i18n';
import { ImageMessageSegment, MessageContent, MessageSegment } from 'api';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import FacePanelPopupButton from './face-panel-popup-button';
import { FaceSet, LoggedInContext, useFacePackages } from 'models/logged-in-context';
import { useAtClicked } from 'models/messages-context';

type Props = {
  sendMessage: (message: MessageContent) => Promise<boolean>;
};

export default function SenderWidget({ sendMessage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [canSend, setCanSend] = useState(false);
  const { $t } = useI18n();
  const facePackages = useFacePackages();
  const ctx = useContext(LoggedInContext);
  const faceSetStates = useMemo(
    () => facePackages.map(item => ctx.faceSetCluster.getOrCreate(item.id)),
    [ctx.faceSetCluster, facePackages]
  );
  const [faceSet, setFaceSet] = useState<FaceSet>([]);
  useEffect(() => {
    const tokens = faceSetStates.map(item =>
      item.source.subscribe(value =>
        setFaceSet(prev => {
          const result = [...prev];
          value.forEach(face => {
            if (result.every(existsFace => existsFace.imageId !== face.imageId)) {
              result.push(face);
            }
          });

          return result;
        })
      )
    );

    return () => tokens.forEach(item => item.unsubscribe());
  }, [faceSetStates]);

  const atClicked = useAtClicked();
  useEffect(() => {
    // TODO: 下面这段代码和 handleFaceSelected() 里的基本一样，应该提取出可复用的部分。
    const token = atClicked.subscribe(item => {
      const input = inputRef.current;
      // @Xxx 的前后都应该有空格。
      const atText = ` @${item.targetId} `;
      if (input) {
        input.focus();
        const prevText = input.value;
        if (input.selectionStart !== null) {
          const prevSelectionPosition = input.selectionStart + atText.length;

          input.value = `${prevText.slice(0, input.selectionStart)}${atText}${prevText.slice(
            input.selectionStart
          )}`;

          input.setSelectionRange(prevSelectionPosition, prevSelectionPosition);
        } else {
          input.value += atText;
        }

        setCanSend(true);
      }

      return () => token.unsubscribe();
    });
  }, [atClicked]);

  const handleEnterClick = useCallback(async () => {
    if (inputRef.current && inputRef.current.value) {
      const text = inputRef.current.value;
      inputRef.current.value = '';
      const message = parseMessageText(text, faceSet);
      const success = await sendMessage(message);
      if (success) {
        setCanSend(false);
      } else {
        inputRef.current.value = text;
      }
    } else {
      // TODO: Tip: Don't send empty message.
    }
  }, [faceSet, sendMessage]);
  const handleEnterDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter') {
        handleEnterClick();
      }
    },
    [handleEnterClick]
  );
  const handleFaceSelected = useCallback((item: ImageMessageSegment) => {
    const input = inputRef.current;
    const faceText = `[#${item.imageId}]`;
    if (input) {
      input.focus();
      const prevText = input.value;
      if (input.selectionStart !== null) {
        const prevSelectionPosition = input.selectionStart + faceText.length;

        input.value = `${prevText.slice(0, input.selectionStart)}${faceText}${prevText.slice(
          input.selectionStart
        )}`;

        input.setSelectionRange(prevSelectionPosition, prevSelectionPosition);
      } else {
        input.value += faceText;
      }

      setCanSend(true);
    }
  }, []);

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
          onChange={e => setCanSend(!!e.target.value)}
          type="text"
          className="SenderWidget__input"
          placeholder={$t('input.placeholder.writeAMessage')}
          onKeyDown={handleEnterDown}
        />
        <FacePanelPopupButton
          className="SenderWidget__btnFace"
          onFaceSelected={handleFaceSelected}
        />
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

const matchFaceRegex = /\[#(.+?)\]/g;

function parseMessageText(text: string, faceSet: FaceSet): MessageContent {
  const faceMatches = Array.from(text.matchAll(matchFaceRegex));
  const result: MessageSegment[] = [];

  let prevIndex = 0;
  for (let item of faceMatches) {
    const index = item.index!;
    const faceOriginText = item[0];
    const faceId = item[1];
    const textSegment = text.slice(prevIndex, index);
    if (textSegment) {
      result.push({ type: 'text', text: textSegment });
    }

    const face = faceSet.find(item => item.imageId === faceId);
    if (face) {
      result.push(face);
      prevIndex = index + faceOriginText.length;
    }
  }

  if (prevIndex < text.length) {
    const textSegment = text.slice(prevIndex, text.length);
    result.push({ type: 'text', text: textSegment });
  }

  return result;
}
