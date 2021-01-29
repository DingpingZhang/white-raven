import { ReactComponent as SendIcon } from 'images/send.svg';
import { ReactComponent as MoreVerticalIcon } from 'images/more-vertical.svg';
import { ReactComponent as AttachmentIcon } from 'images/attachment.svg';
import { ReactComponent as FaceIcon } from 'images/face.svg';
import CircleButton from 'components/circle-button';

export default function MessageSendBox() {
  return (
    <div className="MessageSendBox">
      <CircleButton
        buttonType="secondary"
        className="MessageSendBox__btnUpload"
        icon={<AttachmentIcon />}
      />
      <div className="MessageSendBox__editArea">
        <input type="text" className="MessageSendBox__input" placeholder="Write a message..." />
        <CircleButton
          buttonType="default"
          className="MessageSendBox__btnFace"
          icon={<FaceIcon />}
        />
        <CircleButton
          buttonType="default"
          className="MessageSendBox__btnMore"
          icon={<MoreVerticalIcon />}
        />
      </div>
      <div className="MessageSendBox__splitLine vertical"></div>
      <CircleButton
        buttonType="primary"
        className="MessageSendBox__btnSend"
        icon={<SendIcon />}
        onClick={() => {
          if (document.body.classList.contains('theme-dark')) {
            document.body.classList.remove('theme-dark');
          } else {
            document.body.classList.add('theme-dark');
          }
        }}
      />
    </div>
  );
}
