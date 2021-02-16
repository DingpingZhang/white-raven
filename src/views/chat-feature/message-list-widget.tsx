import { Message } from 'api';
import ScrollViewer from 'components/scroll-viewer';
import MessageList from 'models/message-list';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  messageList: MessageList;
  renderItem: (item: Message) => ReactElement;
};

export default function MessageListWidget({ messageList, renderItem }: Props) {
  const scrollViewerRef = useRef<HTMLDivElement>(null);
  const [prevMoreRef, inViewPrevMore] = useInView();
  const [nextMoreRef, inViewNextMore] = useInView();

  useEffect(() => {
    if (inViewPrevMore) {
      messageList.prevItems();
    }
  }, [inViewPrevMore, messageList]);

  useEffect(() => {
    if (inViewNextMore) {
      messageList.nextItems();
    }
  }, [inViewNextMore, messageList]);

  return (
    <div className="MessageListWidget">
      <ScrollViewer ref={scrollViewerRef} enableVerticalScrollBar>
        <div ref={prevMoreRef} className="MessageListWidget__prevMore"></div>
        {messageList.items.map((item, index) => (
          <MessageListItem key={item.id} index={index} setReaded={() => {}} setVisible={() => {}}>
            {renderItem(item)}
          </MessageListItem>
        ))}
        <div ref={nextMoreRef} className="MessageListWidget__nextMore"></div>
      </ScrollViewer>
      <GotoButton classSuffix="top" icon="TODO: up-arrow" onClick={() => {}} />
      <GotoButton classSuffix="bottom" icon="TODO: down-arrow" onClick={() => {}} />
    </div>
  );
}

type MessageListItemProps = {
  children: ReactElement;
  index: number;
  setReaded: (index: number) => void;
  setVisible: (index: number, visible: boolean) => void;
};

function MessageListItem({ children, index, setReaded, setVisible }: MessageListItemProps) {
  return <div className="MessageListItem">{children}</div>;
}

type GotoButtonProps = {
  classSuffix: string;
  icon: string;
  onClick: () => void;
  text?: string;
};

function GotoButton({ classSuffix, icon, onClick, text }: GotoButtonProps) {
  return (
    <button className={`GotoButton__${classSuffix}`} onClick={onClick}>
      {text ? <span>{text}</span> : null}
      <img src={icon} alt="icon" />
    </button>
  );
}

function useIntersectionObserver(
  root: Element | null
): [(element: Element | null) => void, boolean] {
  const [visible, setVisible] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const ref = useCallback((element: Element | null) => setElement(element), []);

  useEffect(() => {
    if (!element || !root) return;

    const observer = new IntersectionObserver(
      (entities) => {
        if (entities.length !== 1) return;
        const entity = entities[0];
        if (entity.target === element) {
          setVisible(entity.isIntersecting);
          console.log(entity);
        }
      },
      { root: root }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [element, root]);

  return [ref, visible];
}
