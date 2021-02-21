import { IdType, Message } from 'api';
import { firstItem, lastItem } from 'helpers/list-helpers';
import SortedSet from './sorted-set';

type GetItems = (
  startId: IdType,
  count: number,
  previous: boolean
) => Promise<ReadonlyArray<Message>>;

const BATCH_COUNT = 20;

export default class MessageList {
  private readonly storage: SortedSet<Message>;
  private readonly getItems: GetItems;

  private isBusy: boolean = false;
  private changed: () => void = () => {};

  readonly capacity: number = 200;

  startIndex: number = 0;

  get items() {
    return this.storage.items.slice(this.startIndex, this.startIndex + this.capacity);
  }

  constructor(getItems: GetItems) {
    this.storage = new SortedSet<Message>(
      (item) => item.id,
      (x, y) => x.timestamp - y.timestamp
    );
    this.getItems = getItems;
  }

  async previous(): Promise<void> {
    this.lock(async () => {
      const start = firstItem(this.storage.items);
      const prevItems = await this.getItems(start.id, BATCH_COUNT, true);
      const count = this.storage.addRange(prevItems);
      if (count > 0) {
        this.startIndex = 0;
        this.changed();
      }
    });
  }

  async next(): Promise<void> {
    this.lock(async () => {
      const end = lastItem(this.storage.items);
      const nextItems = await this.getItems(end.id, BATCH_COUNT, false);
      const count = this.storage.addRange(nextItems);
      if (count > 0) {
        this.startIndex = Math.max(this.storage.items.length - this.capacity, 0);
        this.changed();
      }
    });
  }

  pushItem(item: Message) {
    if (this.storage.add(item)) {
      this.changed();
    }
  }

  pushItems(items: ReadonlyArray<Message>) {
    const count = this.storage.addRange(items);
    if (count > 0) {
      this.changed();
    }
  }

  onListChanged(callback: () => void) {
    this.changed = callback;
  }

  private async lock(callback: () => Promise<void>): Promise<void> {
    if (this.isBusy) return;
    this.isBusy = true;
    await callback();
    this.isBusy = false;
  }
}
