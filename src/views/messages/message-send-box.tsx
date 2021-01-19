import { ReactComponent as SendIcon } from '../../images/send.svg';
import { ReactComponent as MoreVerticalIcon } from '../../images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from '../../images/attachment.svg';
import { ReactComponent as FaceIcon } from '../../images/face.svg';

export default function MessageSendBox() {
  return (
    <div className="message-send-box">
      <button className="btn-circle secondary btn-upload-file">
        <AttachmentIcon
          style={{ fill: '#d9ecfc', verticalAlign: 'middle' }}
          width="16px"
          height="24px"
        />
      </button>
      <div className="text-edit-area">
        <input type="text" className="text-box" placeholder="Write a message..." />
        <button className="btn-circle default btn-face">
          <FaceIcon
            style={{ fill: '#d9ecfc', verticalAlign: 'middle' }}
            width="20px"
            height="24px"
          />
        </button>
        <button className="btn-circle default btn-more">
          <MoreVerticalIcon
            style={{ fill: '#d9ecfc', verticalAlign: 'middle' }}
            width="20px"
            height="24px"
          />
        </button>
      </div>
      <div className="split-line vertical"></div>
      <button className="btn-circle primary btn-send">
        <SendIcon style={{ fill: '#d9ecfc', verticalAlign: 'middle' }} width="28px" height="28px" />
      </button>
    </div>
  );
}
