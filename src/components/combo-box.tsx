import React, { ReactNode, useState, useEffect, CSSProperties, useRef } from 'react';
import classNames from 'classnames';

export interface ComboBoxItem<T> {
  value: T;
  label: string;
}

interface ComboBoxProps<T> {
  itemsSource: Array<ComboBoxItem<T>>;
  selectedItem: ComboBoxItem<T>;
  dropDownBoxWidth?: number | string;
  dorpDownBoxHeight?: number | string;
  style?: CSSProperties;

  setSelectedItem: (item: ComboBoxItem<T>) => void;
  renderItem?: (item: ComboBoxItem<T>) => ReactNode;
  renderDisplayItem?: (item: ComboBoxItem<T>) => ReactNode;
}

export function ComboBox<T>({
  itemsSource,
  selectedItem,
  dropDownBoxWidth,
  dorpDownBoxHeight,
  style,
  setSelectedItem,
  renderItem,
  renderDisplayItem,
}: ComboBoxProps<T>) {
  const [active, setActive] = useState(false);
  const selectedElementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active) {
      const onGlobalClick = () => setActive(false);
      window.addEventListener('click', onGlobalClick);
      window.addEventListener('blur', onGlobalClick);
      return () => {
        window.removeEventListener('click', onGlobalClick);
        window.removeEventListener('blur', onGlobalClick);
      };
    }
  }, [active]);
  useEffect(() => {
    if (active && selectedElementRef.current) {
      selectedElementRef.current.scrollIntoView();
    }
  }, [active]);
  const selectedIndex = itemsSource.findIndex(item => item.label === selectedItem.label);

  const comboBoxClass = classNames('ComboBox', { active });
  const dropDownBoxClass = classNames('ComboBox__dropDownBox', { active });

  return (
    <div className={comboBoxClass} onClick={() => setActive(true)} style={style}>
      <span className="ComboBox__textBox">
        {renderDisplayItem ? renderDisplayItem(selectedItem) : selectedItem.label}
      </span>
      <div
        className={dropDownBoxClass}
        style={{ width: dropDownBoxWidth, maxHeight: dorpDownBoxHeight }}
      >
        {itemsSource.map((item, index) => {
          const selected = selectedIndex === index;
          const itemClass = classNames('ComboBox__item', { selected });

          const itemElement = (
            <div
              key={`${item.label}-${index}`}
              className={itemClass}
              onClick={e => {
                e.stopPropagation();
                setSelectedItem(item);
                setActive(false);
              }}
            >
              {renderItem ? renderItem(item) : <span>{item.label}</span>}
            </div>
          );

          return selected
            ? React.cloneElement(itemElement, { ref: selectedElementRef })
            : itemElement;
        })}
      </div>
    </div>
  );
}
