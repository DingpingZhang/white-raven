import { ReactComponent as CloseIcon } from 'images/close.svg';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  close?: () => void;
};

export default function BaseDialog({ title, close, children }: Props) {
  return (
    <div className="BaseDialog">
      <div className="BaseDialog__titleBar">
        <span className="BaseDialog__title">{title}</span>
        {close ? (
          <button className="BaseDialog__btnClose" onClick={close}>
            <CloseIcon className="BaseDialog__iconClose" />
          </button>
        ) : null}
      </div>
      <div className="BaseDialog__content">{children}</div>
    </div>
  );
}
