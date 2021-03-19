import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useResize } from 'hooks';
import ScrollViewer from './scroll-viewer';
import { equalNumber } from 'helpers';

type UnfixedSizeProvider = {
  /**
   * Gets the size of items with the specified start index and item count.
   * @param count The number of items starting at index 0. The `-1` indicates the total items.
   * @returns The size of seleced items.
   */
  getItemsSize: (count: number) => number;

  /**
   * Gets the count of items contained in the specified size.
   * @param startIndex: An offset of items.
   * @param size The specified size.
   * @returns The count of fully visible elements in the region.
   */
  getItemsCount: (startIndex: number, size: number) => number;
};
type FixedSizeProvider = {
  itemSize: number;
  itemCount: number;
};

type Props = {
  sizeProvider: UnfixedSizeProvider | FixedSizeProvider;
  renderItems: (startIndex: number, endIndex: number) => ReadonlyArray<ReactElement>;

  selectedIndex?: number;
  selectable?: boolean;
  setSelectedIndex?: (value: number) => void;
};

export function VirtualizingListBox({
  sizeProvider,
  renderItems,
  selectedIndex,
  selectable,
  setSelectedIndex,
}: Props) {
  const [wrapperRef, , wrapperHeight, wrapper] = useResize<HTMLDivElement>();
  const [viewSize, setViewSize] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  useEffect(() => {
    setViewSize(prev => (equalNumber(prev, wrapperHeight) ? prev : wrapperHeight));
  }, [wrapperHeight]);

  const recalculate = useCallback(() => {
    if (wrapper) {
      const {
        startIndex: newStartIndex,
        endIndex: newEndIndex,
        viewStartIndex,
        viewEndIndex,
      } = getItemsRange(sizeProvider, wrapper.scrollTop, viewSize);

      if (viewStartIndex < startIndex || viewEndIndex > endIndex) {
        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
      }
    }
  }, [wrapper, sizeProvider, viewSize, startIndex, endIndex]);

  // Trigger the recalculate() to update start/endIndex immediatly when the handleScroll was changed.
  useEffect(() => recalculate(), [recalculate]);

  const itemElements = useMemo(
    () =>
      renderItems(startIndex, endIndex).map((item, index) => {
        const offsetIndex = startIndex + index;
        const itemClass = classNames('VirtualizingListBox__item', {
          selected: selectable && offsetIndex === selectedIndex,
        });
        return (
          <li
            key={item.key}
            className={itemClass}
            onClick={() => {
              if (selectable && setSelectedIndex) {
                setSelectedIndex(offsetIndex);
              }
            }}
            style={{ top: `${getItemsSize(sizeProvider, offsetIndex)}px` }}
          >
            {item}
          </li>
        );
      }),
    [startIndex, endIndex, selectable, selectedIndex, sizeProvider, renderItems, setSelectedIndex]
  );

  return (
    <div className="VirtualizingListBox">
      <ScrollViewer ref={wrapperRef} onScroll={recalculate} enableVerticalScrollBar>
        <ul className="VirtualizingListBox__list">
          {/* HACK: Hold the height of the scroll area, and place it on top of item elements to
           * make sure it is in the lower layer of item elements, otherwise, its hit test
           * may cover item elements.
           */}
          <div
            style={{
              position: 'absolute',
              top: `${getItemsSize(sizeProvider, -1)}px`,
              height: '1px',
              width: '1px',
            }}
          />
          {itemElements}
        </ul>
      </ScrollViewer>
    </div>
  );
}

function getItemsSize(sizeProvider: UnfixedSizeProvider | FixedSizeProvider, index: number) {
  if (isFixedSizeProvider(sizeProvider)) {
    return (index < 0 ? sizeProvider.itemCount : index) * sizeProvider.itemSize;
  } else {
    return sizeProvider.getItemsSize(index);
  }
}

function getItemsRange(
  sizeProvider: UnfixedSizeProvider | FixedSizeProvider,
  scrollTop: number,
  viewSize: number
) {
  if (isFixedSizeProvider(sizeProvider)) {
    return getItemsRangeForFixedItemSize(sizeProvider, scrollTop, viewSize);
  } else {
    return getItemsRangeForUnfixedItemSize(sizeProvider, scrollTop, viewSize);
  }
}

function isFixedSizeProvider(
  sizeProvider: FixedSizeProvider | UnfixedSizeProvider
): sizeProvider is FixedSizeProvider {
  return (sizeProvider as FixedSizeProvider).itemSize !== undefined;
}

function getItemsRangeForUnfixedItemSize(
  sizeProvider: UnfixedSizeProvider,
  scrollTop: number,
  viewSize: number
) {
  const viewStartIndex = sizeProvider.getItemsCount(0, scrollTop);
  const viewCount = sizeProvider.getItemsCount(viewStartIndex, viewSize) + 1;
  const extraItemCount = viewCount;
  // Correct the data: add extra items
  const viewEndIndex = viewStartIndex + viewCount;
  const startIndex = Math.max(viewStartIndex - extraItemCount, 0);
  const endIndex = viewEndIndex + extraItemCount;
  return { viewStartIndex, viewEndIndex, startIndex, endIndex };
}

function getItemsRangeForFixedItemSize(
  sizeProvider: FixedSizeProvider,
  scrollTop: number,
  viewSize: number
) {
  const { itemSize } = sizeProvider;
  const viewStartIndex = Math.floor(scrollTop / itemSize);
  const viewCount = Math.ceil(viewSize / itemSize);
  const extraItemCount = viewCount;
  // Correct the data: add extra items
  const viewEndIndex = viewStartIndex + viewCount;
  const startIndex = Math.max(viewStartIndex - extraItemCount, 0);
  const endIndex = viewEndIndex + extraItemCount;
  return { viewStartIndex, viewEndIndex, startIndex, endIndex };
}
