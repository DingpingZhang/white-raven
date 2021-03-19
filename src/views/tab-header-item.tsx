import classNames from 'classnames';
import React from 'react';
import { ReactElement } from 'react';

type Props = {
  icon: ReactElement | string;
  title: string;
  selected?: boolean;
  messageCount?: number;
  onClick?: () => void;
};

export default function TabHeaderItem({ icon, title, selected, messageCount, onClick }: Props) {
  const TabHeaderItemClass = classNames('TabHeaderItem', {
    selected,
    hasMessage: messageCount,
  });

  return (
    <div className={TabHeaderItemClass} onClick={() => onClick && onClick()}>
      {/* <div className="TabHeaderItem__decorativeElement"></div> */}
      {typeof icon === 'string' ? (
        <img className="TabHeaderItem__icon" src={icon} alt="icon" />
      ) : (
        React.cloneElement(icon, { className: 'TabHeaderItem__icon' })
      )}
      <span className="TabHeaderItem__title">{title}</span>
    </div>
  );
}
