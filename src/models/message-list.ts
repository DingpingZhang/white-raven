import { IdType, Message } from 'api';
import { firstItem, lastItem } from 'helpers/list-helpers';
import { Observable, Subject } from 'rxjs';
import SortedSet from './sorted-set';

type GetItems = (
  startId: IdType,
  count: number,
  previous: boolean
) => Promise<ReadonlyArray<Message>>;
export type ItemsChangedInfo = {
  type: 'push' | 'pull-prev' | 'pull-next';
  changedCount: number;
  sliceCount: number;
};

const BATCH_COUNT = 20;

export default class MessageList {
  private readonly getItems: GetItems;
  private readonly innerItemsChanged: Subject<ItemsChangedInfo> = new Subject<ItemsChangedInfo>();

  private isBusy: boolean = false;

  readonly capacity: number = 200;
  readonly storage: SortedSet<Message>;

  startIndex: number = 0;

  get items() {
    return this.storage.items.slice(this.startIndex, this.startIndex + this.capacity);
  }

  get itemsChanged(): Observable<ItemsChangedInfo> {
    return this.innerItemsChanged;
  }

  constructor(getItems: GetItems) {
    this.storage = new SortedSet<Message>(
      (item) => item.id,
      (x, y) => x.timestamp - y.timestamp
    );
    this.getItems = getItems;
  }

  async pullPrev(): Promise<void> {
    this.lock(async () => {
      const start = firstItem(this.storage.items);
      const prevItems = await this.getItems(start.id, BATCH_COUNT, true);
      const count = this.storage.addRange(prevItems);
      if (count > 0) {
        this.startIndex = 0;
        this.raiseItemsChanged({
          type: 'pull-prev',
          changedCount: count,
          sliceCount: this.getSliceCount(),
        });
      }
    });
  }

  async pullNext(): Promise<void> {
    this.lock(async () => {
      const end = lastItem(this.storage.items);
      const nextItems = await this.getItems(end.id, BATCH_COUNT, false);
      const count = this.storage.addRange(nextItems);
      if (count > 0) {
        this.startIndex = Math.max(this.storage.items.length - this.capacity, 0);
        this.raiseItemsChanged({
          type: 'pull-next',
          changedCount: count,
          sliceCount: this.getSliceCount(),
        });
      }
    });
  }

  pushItem(item: Message) {
    if (this.storage.add(item)) {
      this.raiseItemsChanged({ type: 'push', changedCount: 1, sliceCount: this.getSliceCount() });
    }
  }

  pushItems(items: ReadonlyArray<Message>) {
    const count = this.storage.addRange(items);
    if (count > 0) {
      this.raiseItemsChanged({
        type: 'push',
        changedCount: count,
        sliceCount: this.getSliceCount(),
      });
    }
  }

  private raiseItemsChanged(e: ItemsChangedInfo) {
    console.log(e);
    this.innerItemsChanged.next(e);
  }

  private getSliceCount() {
    return this.startIndex + this.capacity > this.storage.items.length
      ? this.capacity
      : this.storage.items.length - this.startIndex;
  }

  private async lock(callback: () => Promise<void>): Promise<void> {
    if (this.isBusy) return;
    this.isBusy = true;
    await callback();
    this.isBusy = false;
  }
}
