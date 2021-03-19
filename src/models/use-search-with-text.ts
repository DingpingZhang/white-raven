import { useMemo } from 'react';

export default function useSearchWithText<T>(
  list: ReadonlyArray<T>,
  getText: (item: T) => string,
  queriesText: string
) {
  return useMemo(() => {
    if (!queriesText) return list;

    const queries = queriesText
      .split(' ')
      .filter(item => !!item)
      .map(item => item.toLowerCase());
    return list.filter(item => {
      const originText = getText(item).toLowerCase();
      return queries.some(query => originText.includes(query));
    });
  }, [getText, list, queriesText]);
}
