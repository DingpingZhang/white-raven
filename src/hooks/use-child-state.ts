import { useCallback, useEffect, useRef, useState } from 'react';

export type SetCallback<T> = (set: React.Dispatch<React.SetStateAction<T>>) => void;

/**
 * 使用一个状态值，该值的改变是由其父组件控制的。与 `useSetOfSeparatedState` 配合使用。
 *
 * 一些时候，子组件的某些状态由其父组件控制，一般的做法是：由父组件维护此状态（`useState`），
 * 再将此状态通过 props 传递给子组件。这样带来的问题是：State 发生改变时，父组件也要刷新。
 * 大多数情况下，React 刷新虚拟 Dom 是很高效的，所以无需担心此问题；但某些时候，当父组件十分复杂时，
 * 为考虑性能问题，应当避免该做法，而让子组件自己维护这个状态，但将 `setValue` 回传给父组件控制。
 * 这样，当父组件改变该状态时，只有子组件会被刷新。
 * @param setCallback 从父组件传递下来的，用于回传子组件中 `setValue` 的回调函数。即：`useSetOfSeparatedState` 返回元组的第二个参数。
 * @param initialValue 初始化值
 * @returns 返回由父组件控制的状态值。
 */
export function useValueOfSeparatedState<T>(setCallback: SetCallback<T>, initialValue: T) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setCallback(setValue);
  }, [setCallback]);

  return value;
}

/**
 * 使用一个 `setValue`，其可以改变子组件中的状态值。与 `useValueOfSeparatedState` 配合使用。
 *
 * 详细备注请看 `useValueOfSeparatedState` 的注释。
 * @returns 返回子组件中状态值的 `setValue` 方法，和用于回传子组件中 `steValue` 方法的回调函数。
 */
export function useSetOfSeparatedState<T>(): [
  React.Dispatch<React.SetStateAction<T>> | null,
  SetCallback<T>
] {
  const ref = useRef<React.Dispatch<React.SetStateAction<T>> | null>(null);
  const setCallback = useCallback(
    (set: React.Dispatch<React.SetStateAction<T>>) => (ref.current = set),
    []
  );

  return [ref.current, setCallback];
}
