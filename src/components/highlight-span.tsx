import { HTMLAttributes } from 'react';

type HighlightSpanProps = {
  sourceText: string;
  queriesText: string;
};

type Range = {
  start: number;
  end: number;
};

type Fragment = {
  text: string;
  isQuery: boolean;
};

// Linq helper functions

function distinct<T>(list: T[]) {
  const set = new Set(list);
  return Array.from(set.values());
}

function getQueryRanges(sourceText: string, query: string) {
  const result = new Array<Range>();
  if (!sourceText || !query) return result;

  let nextStartIndex = 0;
  while (nextStartIndex < sourceText.length) {
    const index = sourceText.indexOf(query, nextStartIndex);

    if (index === -1) return result;

    nextStartIndex = index + query.length;
    result.push({ start: index, end: nextStartIndex });
  }

  return result;
}

function mergeRanges(ranges: ReadonlyArray<Range>) {
  const result = new Array<Range>();
  if (!ranges.length) return result;

  const copyRanges = Array.from(ranges);
  copyRanges.sort((a, b) => (a.start !== b.start ? a.start - b.start : a.end - b.end));
  let { start: startPointer, end: endPointer } = copyRanges[0];

  for (let { start, end } of copyRanges.slice(1)) {
    if (start <= endPointer) {
      if (endPointer < end) {
        endPointer = end;
      }
    } else {
      result.push({ start: startPointer, end: endPointer });
      [startPointer, endPointer] = [start, end];
    }
  }

  result.push({ start: startPointer, end: endPointer });
  return result;
}

function splitTextByOrderedDisjointRanges(sourceText: string, mergedRanges: ReadonlyArray<Range>) {
  const result = new Array<Fragment>();
  if (!sourceText) return result;

  if (!mergedRanges.length) {
    result.push({ text: sourceText, isQuery: false });
    return result;
  }

  const { start: start0, end: end0 } = mergedRanges[0];

  if (start0 > 0) {
    result.push({ text: sourceText.substring(0, start0), isQuery: false });
  }

  result.push({ text: sourceText.substring(start0, end0), isQuery: true });

  let previousEnd = end0;
  for (let { start, end } of mergedRanges.slice(1)) {
    result.push({ text: sourceText.substring(previousEnd, start), isQuery: false });
    result.push({ text: sourceText.substring(start, end), isQuery: true });
    previousEnd = end;
  }

  if (previousEnd < sourceText.length) {
    result.push({ text: sourceText.substring(previousEnd), isQuery: false });
  }

  return result;
}

export default function HighlightSpan({
  sourceText,
  queriesText,
  ...otherProps
}: HighlightSpanProps & HTMLAttributes<HTMLSpanElement>) {
  const queries = distinct(
    queriesText
      .toLowerCase()
      .split(' ')
      .filter((item) => !!item)
  );
  const ranges = queries.flatMap((query) => getQueryRanges(sourceText.toLowerCase(), query));
  const mergedRanges = mergeRanges(ranges);
  const fragments = splitTextByOrderedDisjointRanges(sourceText, mergedRanges);

  return (
    <span {...otherProps}>
      {fragments.map((fragment, index) =>
        fragment.isQuery ? <mark key={index}>{fragment.text}</mark> : fragment.text
      )}
    </span>
  );
}
