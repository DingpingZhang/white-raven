import { ReactComponent as SendIcon } from 'images/send.svg';
import { ReactComponent as MoreVerticalIcon } from 'images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from 'images/attachment.svg';
import CircleButton from 'components/circle-button';
import { useI18n } from 'i18n';
import { MessageContent, MessageSegment, uploadFile } from 'api';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import FacePanelPopupButton from './face-panel-popup-button';
import { FaceSet, LoggedInContext, useFacePackages } from 'models/logged-in-context';
import { ChatContext } from 'models/chat-context';
import { useConstant } from 'hooks';
import { uuidv4 } from 'helpers';

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
  const { markupAdded } = useContext(ChatContext);
  useEffect(() => {
    const token = markupAdded.subscribe(({ markup, content }) => {
      insertText(` ${markup}${content} `);
    });
    return () => token.unsubscribe();
  }, [markupAdded, insertText]);

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
  const handleInputKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        handleEnterClick();
      } else if (e.key === 'v' && e.ctrlKey) {
        const result = await navigator.permissions.query({
          // Ref to: https://github.com/microsoft/TypeScript/issues/33923#issuecomment-743062954
          name: 'clipboard-read' as PermissionName,
        });
        if (result.state === 'granted' || result.state === 'prompt') {
          const data = await ((navigator.clipboard as any).read() as Promise<any>);
          if (data.length <= 0) return;

          const dataType = data[0].types.find((item: string) => item.startsWith('image/'));
          if (dataType) {
            const imageBlob = await data[0].getType(dataType);
            const response = await uploadFile(imageBlob);
            if (response.code === 200) {
              markupAdded.next({ markup: '#', content: response.content.fileId });
            }
          }
        }
      }
    },
    [handleEnterClick, markupAdded]
  );

  return (
    <div className="SenderWidget">
      <UploadFileButton />
      <div className="SenderWidget__editArea">
        <input
          ref={inputRef}
          onChange={e => setCanSend(!!e.target.value)}
          type="text"
          className="SenderWidget__input"
          placeholder={$t('input.placeholder.writeAMessage')}
          onKeyDown={handleInputKeyDown}
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

function UploadFileButton() {
  const { markupAdded } = useContext(ChatContext);
  const inputFileId = useConstant(() => `input-${uuidv4()}`);

  return (
    <div className="SenderWidget__btnUpload">
      {/* Custom input-file, ref to: https://stackoverflow.com/a/25825731 */}
      <label className="SenderWidget__inputFile" htmlFor={inputFileId}>
        <AttachmentIcon />
      </label>
      <input
        id={inputFileId}
        type="file"
        accept="image/*"
        onChange={async e => {
          const file = e.target.files?.item(0);
          if (file) {
            const response = await uploadFile(file);
            if (response.code === 200) {
              markupAdded.next({ markup: '#', content: response.content.fileId });
            }
          }

          e.target.value = '';
          console.log(e.target.selectionStart);
        }}
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
        const image = faceSet.find(item => item.imageId === content) || {
          type: 'image',
          imageId: content,
          behavior: 'can-browse',
        };

        if (image) {
          result.push(image);
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
