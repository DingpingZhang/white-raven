import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ScrollViewer from './scroll-viewer';

export type FetchItemsType = 'initial' | 'previous' | 'next';

type Props<T> = {
  getPreviousItems: (count: number) => Promise<ReadonlyArray<T>>;
  getNextItems: (count: number) => Promise<ReadonlyArray<T>>;
  renderItem: (item: T) => ReactElement;
  capacity: number;
};

// TODO: Virtualizing
export default function LazyLoadingListBox<T>({
  getPreviousItems,
  getNextItems,
  renderItem,
  capacity,
}: Props<T>) {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const isBusyRef = useRef(false);
  const [items, setItems] = useState<ReadonlyArray<T>>([]);
  const [minInViewIndex, setMinInViewIndex] = useState(0);
  const [maxInViewIndex, setMaxInViewIndex] = useState(0);
  const [isPrev, setIsPrev] = useState(false);

  const updateItems = useCallback(async () => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    if (minInViewIndex <= 1) {
      const prevItems = await getPreviousItems(20);
      setItems((prev) => [...prevItems, ...prev.slice(0, capacity)]);
      setIsPrev(true);
      isBusyRef.current = false;
    } else if (maxInViewIndex >= items.length - 2) {
      const nextItems = await getNextItems(20);
      setItems((prev) => {
        const endIndex = prev.length;
        const startIndex = Math.max(endIndex - nextItems.length, 0);
        return [...prev.slice(startIndex, endIndex), ...nextItems];
      });
      setIsPrev(false);
      isBusyRef.current = false;
    }
  }, [capacity, getNextItems, getPreviousItems, items.length, maxInViewIndex, minInViewIndex]);

  useEffect(() => {
    updateItems();
  }, [updateItems]);

  return (
    <div className="LazyLoadingListBox">
      <ScrollViewer ref={scrollViewRef} enableVerticalScrollBar>
        <ul className="LazyLoadingListBox__list">
          {items.map((item, index) => (
            <ListItem
              onInViewChanged={(inView) => {
                if (inView) {
                  setMinInViewIndex((prev) => (prev > index ? index : prev));
                  setMaxInViewIndex((prev) => (prev < index ? index : prev));
                }
              }}
            >
              {renderItem(item)}
            </ListItem>
          ))}
        </ul>
      </ScrollViewer>
    </div>
  );
}

type ListItemProps = {
  children: ReactElement;
  onInViewChanged: (inView: boolean) => void;
};

function ListItem({ children, onInViewChanged }: ListItemProps) {
  const [ref, inView] = useInView();

  useEffect(() => onInViewChanged(inView), [inView, onInViewChanged]);

  return (
    <li ref={ref} className="LazyLoadingListBox_item">
      {children}
    </li>
  );
}
