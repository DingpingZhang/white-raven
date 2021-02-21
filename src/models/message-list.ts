import { IdType, Message } from 'api';
import { firstItemOrDefault, lastItemOrDefault } from 'helpers/list-helpers';
import { Observable, Subject } from 'rxjs';
import SortedSet from './sorted-set';

type GetItems = (
  startId: IdType | undefined,
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

  readonly capacity: number = 100;
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
      (x, y) => y.timestamp - x.timestamp
    );
    this.getItems = getItems;
  }

  async pullPrev(): Promise<void> {
    this.lock(async () => {
      if (this.startIndex >= BATCH_COUNT) {
        this.startIndex -= BATCH_COUNT;
        this.raiseItemsChanged({
          type: 'pull-prev',
          changedCount: BATCH_COUNT,
          sliceCount: this.getSliceCount(),
        });
      } else {
        const start = firstItemOrDefault(this.storage.items);
        const prevItems = await this.getItems(start?.id, BATCH_COUNT, true);
        const count = this.storage.addRange(prevItems);
        if (count > 0) {
          this.startIndex = 0;
          this.raiseItemsChanged({
            type: 'pull-prev',
            changedCount: count,
            sliceCount: this.getSliceCount(),
          });
        }
      }
    });
  }

  async pullNext(): Promise<void> {
    this.lock(async () => {
      if (this.startIndex + BATCH_COUNT < this.storage.items.length) {
        this.startIndex =
          this.startIndex + this.capacity < this.storage.items.length
            ? this.startIndex + BATCH_COUNT
            : this.startIndex;
        this.raiseItemsChanged({
          type: 'pull-next',
          changedCount: BATCH_COUNT,
          sliceCount: this.getSliceCount(),
        });
      } else {
        const end = lastItemOrDefault(this.storage.items);
        const nextItems = await this.getItems(end?.id, BATCH_COUNT, false);
        const count = this.storage.addRange(nextItems);
        if (count > 0) {
          this.startIndex = Math.max(this.storage.items.length - this.capacity, 0);
          this.raiseItemsChanged({
            type: 'pull-next',
            changedCount: count,
            sliceCount: this.getSliceCount(),
          });
        }
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
