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

const atMarkup = '@';
const imageMarkup = '#';
const matchMarkRegex = /(#|@)(.+?)(?: |$)/g;
const markFullTextGroupIndex = 0;
const markCodeGroupIndex = 1;
const markContentGroupIndex = 2;

type Props = {
  sendMessage: (message: MessageContent) => Promise<boolean>;
};

export default function SenderWidget({ sendMessage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [canSend, setCanSend] = useState(false);
  const { $t } = useI18n();
  const faceSet = useAllFaceSet();

  const insertText = useCallback((newText: string) => {
    const input = inputRef.current;
    if (input) {
      insertTextToInput(input, newText);
      setCanSend(true);
    }
  }, []);
  const atClicked = useAtClicked();
  useEffect(() => {
    const token = atClicked.subscribe(item => insertText(` ${atMarkup}${item.targetId} `));
    return () => token.unsubscribe();
  }, [atClicked, insertText]);

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
  const handleFaceSelected = useCallback(
    (item: ImageMessageSegment) => insertText(` ${imageMarkup}${item.imageId} `),
    [insertText]
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

function useAllFaceSet() {
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

  return faceSet;
}

/**
 * 插入指定的文本到指定的 input 元素中，插入位置为 input 元素当前光标的位置。
 * @param input 待插入文本的 input 元素。
 * @param newText 待插入的文本。
 */
function insertTextToInput(input: HTMLInputElement, newText: string) {
  input.focus();
  const prevText = input.value;
  if (input.selectionStart !== null) {
    const prevSelectionPosition = input.selectionStart + newText.length;

    input.value = `${prevText.slice(0, input.selectionStart)}${newText}${prevText.slice(
      input.selectionStart
    )}`;

    input.setSelectionRange(prevSelectionPosition, prevSelectionPosition);
  } else {
    input.value += newText;
  }
}

function parseMessageText(text: string, faceSet: FaceSet): MessageContent {
  const markMatches = Array.from(text.matchAll(matchMarkRegex));
  const result: MessageSegment[] = [];

  let prevIndex = 0;
  for (let item of markMatches) {
    const index = item.index!;
    const fullText = item[markFullTextGroupIndex];
    const code = item[markCodeGroupIndex];
    const content = item[markContentGroupIndex];

    const textSegment = text.slice(prevIndex, index);
    if (textSegment) {
      result.push({ type: 'text', text: textSegment });
    }

    switch (code) {
      case imageMarkup:
        const face = faceSet.find(item => item.imageId === content);
        if (face) {
          result.push(face);
          prevIndex = index + fullText.length;
        }
        break;
      case atMarkup:
        result.push({ type: 'at', targetId: content });
        prevIndex = index + fullText.length;
        break;
    }
  }

  if (prevIndex < text.length) {
    const textSegment = text.slice(prevIndex, text.length);
    result.push({ type: 'text', text: textSegment });
  }

  return result;
}
