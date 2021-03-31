import {
  TextMessageSegment,
  ImageMessageSegment,
  getFileUrl,
  ImageBehavior,
  AtMessageSegment,
  MessageContent,
} from 'api';
import classNames from 'classnames';
import { useDialogBuilder } from 'components/dialog';
import { ChatContext, useGetContactName } from 'models/chat-context';
import { useUserInfo } from 'models/logged-in-context';
import { useContext } from 'react';
import ImageExplorerDialog from 'views/dialogs/image-explorer-dialog';

const IMAGE_MAX_SIZE = 300;

type Props = {
  segments: MessageContent;
};

export function MessageSegments({ segments }: Props) {
  return (
    <div className="MessageSegments">
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'text':
            return <TextSegment key={`${index}-${segment.text}`} {...segment} />;
          case 'at':
            return <AtSegment key={`${index}-${segment.targetId}`} {...segment} />;
          case 'image':
            return <ImageSegment key={`${index}-${segment.imageId}`} {...segment} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function TextSegment({ text }: TextMessageSegment) {
  return <span className="MessageSegments__item msgText">{text}</span>;
}

function AtSegment({ targetId }: AtMessageSegment) {
  const { markupAdded } = useContext(ChatContext);
  const getContactName = useGetContactName();
  const { id: currentUserId } = useUserInfo();

  const atClass = classNames('MessageSegments__item', 'msgAt', {
    atMySelf: targetId === currentUserId,
  });
  return (
    <span
      className={atClass}
      onClick={() => {
        markupAdded.next({ markup: '@', content: targetId });
      }}
    >{`@${getContactName(targetId)}`}</span>
  );
}

function ImageSegment({ imageId, behavior, width, height }: ImageMessageSegment) {
  const dialogBuilder = useDialogBuilder();
  const { imageLoaded } = useContext(ChatContext);
  const imageUrl = getFileUrl(imageId);

  return (
    <img
      className={`MessageSegments__item msgImage ${convertImageBehaviorToClassName(behavior)}`}
      src={imageUrl}
      alt={`#${imageId} `}
      width={behavior === 'like-text' ? width : undefined}
      height={behavior === 'like-text' ? height : undefined}
      style={{ maxHeight: IMAGE_MAX_SIZE }}
      onClick={async () => {
        if (behavior === 'can-browse') {
          await dialogBuilder
            .build<void>(close => <ImageExplorerDialog close={close} imageUrl={imageUrl} />)
            .show();
        }
      }}
      onLoad={() => imageLoaded.next({ imageId })}
    />
  );
}

// TODO: Replace with more general method.
function convertImageBehaviorToClassName(behavior: ImageBehavior) {
  switch (behavior) {
    case 'can-browse':
      return 'canBrowse';
    case 'like-text':
      return 'likeText';
  }
}
