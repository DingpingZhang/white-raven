import { ReactComponent as SendIcon } from '../../images/send.svg';
import { ReactComponent as MoreVerticalIcon } from '../../images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from '../../images/attachment.svg';
import { ReactComponent as FaceIcon } from '../../images/face.svg';
import CircleButton from '../../components/circle-button';

export default function MessageSendBox() {
  return (
    <div className="message-send-box">
      <CircleButton buttonType="secondary" className="btn-upload-file" icon={<AttachmentIcon />} />
      <div className="text-edit-area">
        <input type="text" className="text-box" placeholder="Write a message..." />
        <CircleButton buttonType="default" className="btn-face" icon={<FaceIcon />} />
        <CircleButton buttonType="default" className="btn-more" icon={<MoreVerticalIcon />} />
      </div>
      <div className="split-line vertical"></div>
      <CircleButton buttonType="primary" className="btn-send" icon={<SendIcon />} />
    </div>
  );
}
