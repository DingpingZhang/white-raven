import { useI18n } from 'i18n';
import BaseDialog from './base-dialog';

type Props = {
  close: () => void;
  imageUrl: string;
};

export function buildImageExplorerDialog({ ...props }: Props) {
  return <ImageExplorerDialog {...props} />;
}

export default function ImageExplorerDialog({ close, imageUrl }: Props) {
  const { $t } = useI18n();

  return (
    <BaseDialog title={$t('dialog.title.image')} close={close}>
      <div className="ImageExplorerDialog">
        <img src={imageUrl} alt="preview" style={{ maxWidth: '1000px', maxHeight: '720px' }} />
      </div>
    </BaseDialog>
  );
}
