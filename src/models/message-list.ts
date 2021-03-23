import { IdType, Message } from 'api';
import { firstItemOrDefault, lastItemOrDefault } from 'helpers/list-helpers';
import { Observable, Subject } from 'rxjs';
import SortedSet from './sorted-set';

type GetItems = (
  startId: IdType | undefined,
  count: number,
  previous: boolean
) => Promise<ReadonlyArray<Message>>;

type AddedAction = {
  type: 'add';

  /**
   * 代表被成功添加的元素的个数。
   */
  addedCount: number;
};

type ScrollAction = {
  type: 'scroll/forward' | 'scroll/back';

  /**
   * 代表滚动所至的目标元素在整个集合中的索引，根据 `type` 的不同，有以下含义：
   *
   * 1. `scroll/forward`：该索引对应的元素，是滚动后的 window 视图中的第一个元素；
   * 2. `scroll/back`：该索引对应的元素，是滚动后 window 视图中的最后一个元素。
   */
  targetIndex: number;
};

export type MessageListAction = AddedAction | ScrollAction;

export const BATCH_COUNT = 20;

export default class MessageList {
  private readonly getItems: GetItems;
  private readonly messageListAction: Subject<MessageListAction> = new Subject<MessageListAction>();

  private isBusy: boolean = false;

  readonly capacity: number = 100;
  readonly storage: SortedSet<Message>;

  startIndex: number = 0;

  /**
   * 滑动窗口（Sliding window），本上下文中出现的 window，指的均是滑动窗口，表示全集的一段可滑动的切片。
   */
  get window() {
    return this.storage.items.slice(this.startIndex, this.startIndex + this.capacity);
  }

  get action(): Observable<MessageListAction> {
    return this.messageListAction;
  }

  constructor(getItems: GetItems) {
    this.storage = new SortedSet<Message>(
      item => item.id,
      (x, y) => y.timestamp - x.timestamp
    );
    this.getItems = getItems;
  }

  pullPrev(): Promise<void> {
    return this.lock(async () => {
      if (this.startIndex >= BATCH_COUNT) {
        this.startIndex -= BATCH_COUNT;
      } else {
        const start = firstItemOrDefault(this.storage.items);
        const prevItems = await this.getItems(start?.id, BATCH_COUNT, true);
        const count = this.storage.addRange(prevItems);
        if (count > 0) {
          this.startIndex = 0;
        }
      }

      this.raiseAction({ type: 'scroll/forward', targetIndex: this.startIndex });
    });
  }

  pullNext(): Promise<void> {
    return this.lock(async () => {
      if (this.startIndex + BATCH_COUNT < this.storage.items.length) {
        const canScrollBack = this.startIndex + this.capacity < this.storage.items.length;
        if (canScrollBack) {
          const remainingCount = this.storage.items.length - this.startIndex - this.capacity;
          this.startIndex += Math.min(BATCH_COUNT, remainingCount);
        }

        this.raiseAction({ type: 'scroll/back', targetIndex: this.startIndex + this.capacity });
      } else {
        const end = lastItemOrDefault(this.storage.items);
        const nextItems = await this.getItems(end?.id, BATCH_COUNT, false);
        const count = this.storage.addRange(nextItems);
        if (count > 0) {
          this.startIndex = Math.max(this.storage.items.length - this.capacity, 0);
          this.raiseAction({ type: 'scroll/back', targetIndex: this.storage.items.length - 1 });
        }
      }
    });
  }

  pullUntilLatest() {
    this.startIndex = Math.max(this.storage.items.length - this.capacity, 0);
    this.raiseAction({ type: 'scroll/back', targetIndex: this.storage.items.length - 1 });
  }

  pushItem(item: Message) {
    if (this.storage.add(item)) {
      this.raiseAction({ type: 'add', addedCount: 1 });
    }
  }

  pushItems(items: ReadonlyArray<Message>) {
    const count = this.storage.addRange(items);
    if (count > 0) {
      this.raiseAction({ type: 'add', addedCount: count });
    }
  }

  isWindowAtLatest() {
    return this.startIndex + this.capacity >= this.storage.items.length;
  }

  private raiseAction(action: MessageListAction) {
    this.messageListAction.next(action);
  }

  private getSliceCount() {
    const count = this.storage.items.length - this.startIndex;
    return Math.min(count, this.capacity);
  }

  private async lock(callback: () => Promise<void>): Promise<void> {
    if (this.isBusy) return;
    this.isBusy = true;
    await callback();
    this.isBusy = false;
  }
}
