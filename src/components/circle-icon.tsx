import React from 'react';
import { ReactElement } from 'react';

type Props = {
  icon: ReactElement | string | undefined;
  diameter: number;
  onClick?: () => void;
};

export default function CircleIcon({ diameter, icon, onClick }: Props) {
  const css = {
    width: `${diameter}px`,
    height: `${diameter}px`,
    borderRadius: `${diameter / 2}px`,
  };

  return typeof icon === 'string' || icon === undefined ? (
    <img className="CircleIcon" src={icon} alt={icon} style={css} onClick={onClick} />
  ) : (
    React.cloneElement(icon, { className: 'CircleIcon', ...css, onClick })
  );
}
