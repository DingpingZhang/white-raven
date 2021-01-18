export default function MessageSendBox() {
  return (
    <div className="message-send-box">
      <button className="btn-circle secondary btn-upload-file"></button>
      <div className="text-edit-area">
        <input type="text" className="text-box" placeholder="Write a message..." />
        <button className="btn-circle default btn-face"></button>
        <button className="btn-circle default btn-more"></button>
      </div>
      <div className="split-line vertical"></div>
      <button className="btn-circle primary btn-send"></button>
    </div>
  );
}
