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
