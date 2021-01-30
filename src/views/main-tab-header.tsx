import classNames from 'classnames';
import React from 'react';
import { ReactElement } from 'react';

type MainTabHeaderProps = {
  icon: ReactElement | string;
  title: string;
  selected?: boolean;
  messageCount?: number;
  onClick?: () => void;
};

export default function MainTabHeader({
  icon,
  title,
  selected,
  messageCount,
  onClick,
}: MainTabHeaderProps) {
  const mainTabHeaderClass = classNames('MainTabHeader', {
    selected,
    hasMessage: messageCount,
  });
  return (
    <div className={mainTabHeaderClass} onClick={() => onClick && onClick()}>
      {/* <div className="MainTabHeader__decorativeElement"></div> */}
      {typeof icon === 'string' ? (
        <img className="MainTabHeader__icon" src={icon} alt="icon" />
      ) : (
        React.cloneElement(icon, { className: 'MainTabHeader__icon' })
      )}
      <span className="MainTabHeader__title">{title}</span>
    </div>
  );
}
