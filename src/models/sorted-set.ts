import { IdType } from 'api';

export default class SortedSet<T> {
  private readonly getId: (item: T) => IdType;
  private readonly compare: (x: T, y: T) => number;
  private readonly ids: Set<IdType> = new Set<IdType>();
  private storage: T[] = [];

  get items(): ReadonlyArray<T> {
    return this.storage;
  }

  constructor(getId: (item: T) => IdType, compare: (x: T, y: T) => number) {
    this.getId = getId;
    this.compare = compare;
  }

  add(item: T): boolean {
    const itemId = this.getId(item);
    if (this.ids.has(itemId)) return false;

    const insertIndex = this.storage.findIndex(existItem => this.compare(existItem, item) < 0);
    if (insertIndex < 0 || insertIndex >= this.storage.length) {
      this.storage.push(item);
    } else if (insertIndex === 0) {
      this.storage.unshift(item);
    } else {
      this.storage.splice(insertIndex, 0, item);
    }

    this.ids.add(itemId);
    return true;
  }

  addRange(items: ReadonlyArray<T>): number {
    return items.map(item => this.add(item)).filter(item => item).length;
  }

  clear() {
    this.ids.clear();
    this.storage = [];
  }
}
