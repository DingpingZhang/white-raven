import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { equalNumber } from '../helpers';
import ScrollViewer from './scroll-viewer';

export type FetchItemsType = 'initial' | 'previous' | 'next';

type InfiniteScrollingListBoxProps = {
  renderItems: (type: FetchItemsType) => ReadonlyArray<ReactElement>;
};

// TODO: Virtualizing
export default function InfiniteScrollingListBox({ renderItems }: InfiniteScrollingListBoxProps) {
  const [items, setItems] = useState<JSX.Element[]>([]);
  const [anchorElement, setAnchorElement] = useState<HTMLLIElement | null>(null);
  const anchorElementRef = useCallback(
    (element: HTMLLIElement | null) => setAnchorElement(element),
    []
  );

  const scrollViewRef = useRef<HTMLDivElement>(null);
  const topElementRef = useRef<HTMLDivElement>(null);
  const bottomElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchorElement) {
      anchorElement.scrollIntoView();
    }
  }, [anchorElement]);

  useEffect(() => {
    if (!scrollViewRef.current || !topElementRef.current || !bottomElementRef.current) return;

    const observer = new IntersectionObserver(
      (entities) => {
        if (entities.length === 2) {
          if (
            equalNumber(entities[0].intersectionRatio, 0) &&
            equalNumber(entities[1].intersectionRatio, 0)
          ) {
            return;
          }

          const initialItems = renderItems('initial');
          if (initialItems && initialItems.length > 0) {
            const initialLIs = initialItems.map(
              renderLIElement(anchorElementRef, initialItems.length - 1)
            );
            setItems(initialLIs);
          }

          return;
        } else if (entities.length === 1) {
          const firstElement = entities[0];
          if (equalNumber(firstElement.intersectionRatio, 0)) return;

          if (firstElement.target === topElementRef.current) {
            const prevItems = renderItems('previous');
            if (prevItems && prevItems.length > 0) {
              setItems((prev) => {
                const prevLIs = prevItems.map(
                  renderLIElement(anchorElementRef, prevItems.length - 1)
                );
                return [...prevLIs, ...prev];
              });
            }
          } else {
            const nextItems = renderItems('next');
            if (nextItems && nextItems.length) {
              setItems((prev) => {
                const nextLIs = nextItems.map(renderLIElement(anchorElementRef, 0));
                return [...prev, ...nextLIs];
              });
            }
          }
        }
      },
      {
        root: scrollViewRef.current,
      }
    );
    observer.observe(topElementRef.current);
    observer.observe(bottomElementRef.current);

    return () => observer.disconnect();
  }, [anchorElementRef, renderItems]);

  return (
    <div className="infinite-scrolling-list-box">
      <ScrollViewer ref={scrollViewRef} enableVerticalScrollBar>
        <div key="anchor-element-top" className="anchor-element-top" ref={topElementRef}></div>
        <ul className="infinite-scrolling-list-box-ul">{items}</ul>
        <div
          key="anchor-element-bottom"
          className="anchor-element-bottom"
          ref={bottomElementRef}
        ></div>
      </ScrollViewer>
    </div>
  );
}

function renderLIElement(ref: (element: HTMLLIElement | null) => void, anchorIndex: number) {
  return (item: ReactElement, index: number) => (
    <li
      ref={index === anchorIndex ? ref : null}
      key={item.key}
      className="infinite-scrolling-list-box-item"
    >
      {item}
    </li>
  );
}
