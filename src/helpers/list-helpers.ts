export function removeAll<T>(list: T[], item: T, equals?: (x: T, y: T) => boolean): number {
  let toRemovedIndex = -1;
  let removedCount = 0;
  while (true) {
    toRemovedIndex = list.findIndex((element) =>
      equals ? equals(element, item) : element === item
    );
    if (toRemovedIndex >= 0) {
      list.splice(toRemovedIndex, 1);
      removedCount++;
    } else {
      break;
    }
  }

  return removedCount;
}

export function firstItem<T>(list: ReadonlyArray<T>) {
  if (list.length <= 0) {
    throw new Error('Index out of range.');
  }

  return list[0];
}

export function firstItemOrDefault<T>(list: ReadonlyArray<T>) {
  return list.length <= 0 ? null : list[0];
}

export function lastItem<T>(list: ReadonlyArray<T>) {
  if (list.length <= 0) {
    throw new Error('Index out of range.');
  }

  return list[list.length - 1];
}

export function lastItemOrDefault<T>(list: ReadonlyArray<T>) {
  return list.length <= 0 ? null : list[list.length - 1];
}
