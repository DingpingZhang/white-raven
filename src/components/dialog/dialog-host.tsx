import React, { ReactNode, createContext, useState, useContext, useRef, useMemo } from 'react';
import classNames from 'classnames';
import { uuidv4 } from '../../helpers';
import DialogManager from './dialog-manager';

interface DialogHostProps {
  children: ReactNode;
}

const DialogHostContext = createContext<DialogManager>(undefined as any);

export interface DialogToken<T> {
  show(): Promise<T>;
  close(): void;
}

type DialogFactory<T> = (close: (value: T) => void) => ReactNode;

export interface DialogBuilder {
  build<T>(factory: DialogFactory<T>): DialogToken<T>;
}

class DialogBuilderInternal implements DialogBuilder {
  private _manager: DialogManager;

  constructor(manager: DialogManager) {
    this._manager = manager;
  }

  build<T>(factory: DialogFactory<T>): DialogToken<T> {
    let id: string;
    const close = () => this._manager.close(id);
    const show = () =>
      new Promise<T>((resolve) => {
        id = uuidv4();
        const dialog = factory((value) => {
          resolve(value);
          close();
        });
        this._manager.show(id, dialog);
      });
    return { show, close };
  }
}

export function useDialogBuilder(): DialogBuilder {
  const manager = useContext(DialogHostContext);
  if (!manager) {
    throw new Error(
      'The ancestor nodes of the current element does not contain <DialogHost />, ' +
        'please make sure to use useDialog(Builder) hook in the descendants of <DialogHost />.'
    );
  }

  return useMemo(() => new DialogBuilderInternal(manager), [manager]);
}

export function useDialog<T>(factory: DialogFactory<T>): DialogToken<T> {
  const builder = useDialogBuilder();
  return useMemo(() => builder.build(factory), [builder, factory]);
}

export function DialogHost({ children }: DialogHostProps) {
  const [currentDialog, setCurrentDialog] = useState<ReactNode>();
  const dialogManagerRef = useRef(new DialogManager(setCurrentDialog));

  const contentClass = classNames('DialogHost__content', {
    blur: currentDialog,
  });
  const maskClass = classNames('DialogHost__mask', {
    active: currentDialog,
  });

  return (
    <div className="DialogHost">
      <DialogHostContext.Provider value={dialogManagerRef.current}>
        <div className={contentClass}>{children}</div>
        <div className={maskClass}>
          <div className="DialogHost__placeholder">{currentDialog}</div>
        </div>
      </DialogHostContext.Provider>
    </div>
  );
}
