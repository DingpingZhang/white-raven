export function removeAll<T>(list: T[], item: T): number {
  let toRemovedIndex = -1;
  let removedCount = 0;
  while (true) {
    toRemovedIndex = list.findIndex((element) => element === item);
    if (toRemovedIndex >= 0) {
      list.splice(toRemovedIndex, 1);
      removedCount++;
    } else {
      break;
    }
  }

  return removedCount;
}
