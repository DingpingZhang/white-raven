import classNames from 'classnames';
import { ReactNode, useContext, useEffect, useCallback, useState, ReactElement } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useForceUpdate, useLazyRef } from '../hooks';
import { SwitchHostContext } from './switch-host';

const EMPTY_OBJECT = {};

export type CaseItem<T extends string> = {
  label: T;
  renderer: (props: any) => ReactNode;
};

export type ContentProvider<T extends string> = {
  isValidLabel: (label: T) => boolean;
  getRenderer: (label: T) => (props: any) => ReactNode;
};

export function convertToContentProvider<T extends string>(
  cases: ReadonlyArray<CaseItem<T>>
): ContentProvider<T> {
  return {
    isValidLabel: (label) => cases.some((item) => item.label === label),
    getRenderer: (label) => (props: any) =>
      cases.find((item) => item.label === label)!.renderer(props),
  };
}

type SwitchProps<T extends string> = {
  name: string;
  contentProvider: ContentProvider<T>;
  animation?: {
    className: string;
    timeout: number;
  };
};

function isReactElement(node: ReactNode): node is ReactElement {
  return !!node && (node as ReactElement).props !== undefined;
}

function isEmptyObject(obj: Object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function equalProps(left: any, right: any) {
  return (
    ((left === undefined || isEmptyObject(left)) &&
      (right === undefined || isEmptyObject(right))) ||
    left === right
  );
}

export function Switch<T extends string>({ name, contentProvider, animation }: SwitchProps<T>) {
  const forceUpdate = useForceUpdate();
  const loadedViewCache = useLazyRef(() => new Map<T, ReactNode>());
  const [selectedLabel, setSelectedLabel] = useState('');
  const { registerSwitch, unregisterSwitch } = useContext(SwitchHostContext);

  // Clear loaded view cache
  useEffect(() => {
    const toRemovedKeys = Array.from(loadedViewCache.keys()).filter(
      (label) => !contentProvider.isValidLabel(label)
    );
    if (toRemovedKeys) {
      toRemovedKeys.forEach((label) => loadedViewCache.delete(label));
    }
  }, [contentProvider, loadedViewCache]);

  const navigate = useCallback(
    (viewName: string, props: any) => {
      const actualViewName = viewName as T;
      const selectedRenderer = contentProvider.getRenderer(actualViewName);
      if (selectedRenderer) {
        const viewCache = loadedViewCache;
        const oldNextView = viewCache.get(actualViewName);
        const requireForceUpdate =
          isReactElement(oldNextView) && !equalProps(oldNextView.props, props);
        const newNextView = selectedRenderer(props ? props : EMPTY_OBJECT);
        // Update the cache of the selected view.
        viewCache.set(actualViewName, newNextView);

        setSelectedLabel((oldValue) => {
          if (oldValue === actualViewName && requireForceUpdate) {
            forceUpdate();
          }

          return actualViewName;
        });
      }
    },
    [contentProvider, forceUpdate, loadedViewCache]
  );
  useEffect(() => {
    registerSwitch(name, navigate);
    return () => unregisterSwitch(name);
  }, [name, navigate, registerSwitch, unregisterSwitch]);

  return (
    <div className="Switch">
      {Array.from(loadedViewCache.entries()).map(([label, view]) => {
        const selected = selectedLabel === label;
        const switchItemClass = classNames('Switch__item', { animated: animation, selected });
        return animation ? (
          <CSSTransition
            key={label}
            appear
            in={selected}
            classNames={animation.className}
            timeout={animation.timeout}
          >
            <div className={switchItemClass}>{view}</div>
          </CSSTransition>
        ) : (
          <div key={label} className={switchItemClass}>
            {view}
          </div>
        );
      })}
    </div>
  );
}
