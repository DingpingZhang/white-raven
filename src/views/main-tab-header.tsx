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
  const mainTabHeaderClass = classNames('main-tab-header', {
    selected,
    'has-message': messageCount,
  });
  return (
    <div className={mainTabHeaderClass} onClick={() => onClick && onClick()}>
      <div className="selected-color-block"></div>
      {typeof icon === 'string' ? (
        <img className="tab-header-icon" src={icon} alt="icon" />
      ) : (
        React.cloneElement(icon, { className: 'tab-header-icon' })
      )}
      <span className="tab-header-title">{title}</span>
    </div>
  );
}
