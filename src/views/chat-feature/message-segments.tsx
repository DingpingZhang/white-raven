import {
  TextMessageSegment,
  ImageMessageSegment,
  getImageUrl,
  ImageBehavior,
  AtMessageSegment,
  MessageContent,
} from 'api';
import { useDialogBuilder } from 'components/dialog';
import { useAtClicked, useGetContactName, useImageLoaded } from 'models/chat-context';
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
  return <span className="MessageSegments__msgText">{text}</span>;
}

function AtSegment({ targetId }: AtMessageSegment) {
  const atClicked = useAtClicked();
  const getContactName = useGetContactName();

  return (
    <span
      className="MessageSegments__msgAt"
      onClick={() => {
        atClicked.next({ targetId });
      }}
    >{`@${getContactName(targetId)}`}</span>
  );
}

function ImageSegment({ imageId, behavior, width, height }: ImageMessageSegment) {
  const dialogBuilder = useDialogBuilder();
  const imageLoaded = useImageLoaded();
  const imageUrl = getImageUrl(imageId);

  return (
    <img
      className={`MessageSegments__msgImage ${convertImageBehaviorToClassName(behavior)}`}
      src={imageUrl}
      alt={`[#${imageId}]`}
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
