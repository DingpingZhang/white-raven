import React, {
  ReactNode,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactElement,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { useForceUpdate, useLazyRef } from '../hooks';
import { SwitchHostContext } from './switch-host';

const EMPTY_OBJECT = {};

export type CaseItem<T extends string> = {
  label: T;
  renderer: (props: any) => ReactNode;
};

type SwitchProps<T extends string> = {
  name: string;
  cases: ReadonlyArray<CaseItem<T>>;
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

export function Switch<T extends string>({ name, cases }: SwitchProps<T>) {
  const forceUpdate = useForceUpdate();
  const loadedViewCache = useLazyRef(() => new Map<string, ReactNode>());
  const [selectedLabel, setSelectedLabel] = useState('');
  const { registerSwitch, unregisterSwitch } = useContext(SwitchHostContext);

  // Clear loaded view cache
  useEffect(() => {
    const toRemovedKeys = Array.from(loadedViewCache.keys()).filter((label) =>
      cases.every((item) => item.label !== label)
    );
    if (toRemovedKeys) {
      toRemovedKeys.forEach((label) => loadedViewCache.delete(label));
    }
  }, [cases, loadedViewCache]);

  const navigate = useCallback(
    (viewName: string, props: any) => {
      const selectedItem = cases.find((item) => item.label === viewName);
      if (selectedItem) {
        const viewCache = loadedViewCache;
        const oldNextView = viewCache.get(viewName);
        const requireForceUpdate =
          isReactElement(oldNextView) && !equalProps(oldNextView.props, props);
        const newNextView = selectedItem.renderer(props ? props : EMPTY_OBJECT);
        // Update the cache of the selected view.
        viewCache.set(viewName, newNextView);

        setSelectedLabel((oldValue) => {
          if (oldValue === viewName && requireForceUpdate) {
            forceUpdate();
          }

          return viewName;
        });
      }
    },
    [cases, forceUpdate, loadedViewCache]
  );
  useEffect(() => {
    registerSwitch(name, navigate);
    return () => unregisterSwitch(name);
  }, [name, navigate, registerSwitch, unregisterSwitch]);

  return (
    <div className="switch-wrapper">
      {Array.from(loadedViewCache.entries()).map(([label, view]) => {
        const selected = selectedLabel === label;
        return (
          <CSSTransition key={label} appear in={selected} timeout={200}>
            <div className="switch-item">{view}</div>
          </CSSTransition>
        );
      })}
    </div>
  );
}
