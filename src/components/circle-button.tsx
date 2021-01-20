import classNames from 'classnames';
import React from 'react';
import { ButtonHTMLAttributes, ReactElement } from 'react';

type ButtonType = 'primary' | 'secondary' | 'default';

type CustomProps = {
  buttonType: ButtonType;
  icon: ReactElement | string;
  diameter?: number;
};

type CircleButtonProps = CustomProps & Partial<ButtonHTMLAttributes<HTMLButtonElement>>;

export default function CircleButton({ buttonType, diameter, icon, className }: CircleButtonProps) {
  const wrapperClass = classNames('btn-circle', {
    [`${buttonType}`]: buttonType,
    [`${className}`]: className,
  });

  return (
    <button
      className={wrapperClass}
      style={{
        width: diameter ? `${diameter}px` : undefined,
        height: diameter ? `${diameter}px` : undefined,
        borderRadius: diameter ? `${diameter / 2}px` : undefined,
      }}
    >
      {typeof icon === 'string' ? (
        <img className="button-icon" src={icon} alt={icon} />
      ) : (
        React.cloneElement(icon, { className: 'button-icon' })
      )}
    </button>
  );
}

function getSize(size: number | undefined, type: ButtonType) {
  if (!size) {
    switch (type) {
      case 'primary':
        return '40px';
      case 'secondary':
        return '32px';
      case 'default':
        return '32px';
      default:
        return '32px';
    }
  } else {
    return `${size}px`;
  }
}
