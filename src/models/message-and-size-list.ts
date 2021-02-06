import { IdType, MessageContent, PersonInfo } from 'api';
import { Size } from 'hooks';
import { Observable, Subject } from 'rxjs';
import SortedSet from './sorted-set';

export type ItemSizeRecord<T> = {
  item: T;
  size: number;
};

export type DisplayMessage = {
  id: IdType;
  content: MessageContent;
  sender: PersonInfo;
  timestamp: number;
};

export type CollectionChangedEventArgs = {};

export default class MessageAndSizeList {
  private readonly storage: SortedSet<ItemSizeRecord<DisplayMessage>>;
  private readonly _collectionChanged: Subject<CollectionChangedEventArgs>;

  get collectionChanged(): Observable<CollectionChangedEventArgs> {
    return this._collectionChanged;
  }

  get length() {
    return this.storage.items.length;
  }

  constructor() {
    this.storage = new SortedSet<ItemSizeRecord<DisplayMessage>>(
      (item) => item.item.id,
      (x, y) => x.item.timestamp - y.item.timestamp
    );
    this._collectionChanged = new Subject();

    this.addRange = this.addRange.bind(this);
    this.slice = this.slice.bind(this);
    this.setSize = this.setSize.bind(this);
    this.getItemsCount = this.getItemsCount.bind(this);
    this.getItemsSize = this.getItemsSize.bind(this);
  }

  addRange = (items: ReadonlyArray<DisplayMessage>) => {
    this.storage.addRange(items.map((item) => ({ item, size: 50 })));
    this._collectionChanged.next({});
  };

  slice = (startIndex: number, endIndex: number): ReadonlyArray<DisplayMessage> => {
    return this.storage.items.slice(startIndex, endIndex).map((item) => item.item);
  };

  setSize = (index: number, { height }: Size) => {
    this.storage.items[index].size = height;
    this._collectionChanged.next({});
  };

  getItemsCount = (startIndex: number, size: number): number => {
    let count = 0;
    let sumSize = 0;
    while (sumSize < size) {
      sumSize += this.storage.items[startIndex + count].size;
    }
    return count;
  };

  getItemsSize = (count: number): number => {
    let sumSize = 0;
    for (let i = 0; i < count; i++) {
      sumSize += this.storage.items[i].size;
    }
    return sumSize;
  };
}
