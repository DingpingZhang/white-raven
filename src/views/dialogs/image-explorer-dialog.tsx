import BaseDialog from './base-dialog';

type Props = {
  close: () => void;
  imageUrl: string;
};

export function buildImageExplorerDialog({ ...props }: Props) {
  return <ImageExplorerDialog {...props} />;
}

export default function ImageExplorerDialog({ close, imageUrl }: Props) {
  return (
    <BaseDialog title="Image" close={close}>
      <div className="ImageExplorerDialog">
        <img src={imageUrl} alt="preview" />
      </div>
    </BaseDialog>
  );
}
