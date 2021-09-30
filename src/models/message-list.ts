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
  type: 'scroll/previous' | 'scroll/next';

  /**
   * 代表滚动所至的目标元素在整个集合中的索引，根据 `type` 的不同，有以下含义：
   *
   * 1. `scroll/previous`：该索引对应的元素，是滚动后的 window 视图中的第一个元素；
   * 2. `scroll/next`：该索引对应的元素，是滚动后 window 视图中的最后一个元素。
   */
  targetIndex: number;
};

export type MessageListAction = AddedAction | ScrollAction;

const BATCH_COUNT = 20;
const SCROLL_PULL_COUNT_LIMIT = 5;

export default class MessageList {
  private readonly getItems: GetItems;
  private readonly messageListAction: Subject<MessageListAction> = new Subject<MessageListAction>();

  private isBusy: boolean = false;
  private innerStartIndex: number = 0;

  readonly capacity: number = 100;
  readonly storage: SortedSet<Message>;

  /**
   * 滑动窗口（Sliding window），本上下文中出现的 window，指的均是滑动窗口，表示全集的一段可滑动的切片。
   */
  get window() {
    return this.storage.items.slice(this.innerStartIndex, this.innerStartIndex + this.capacity);
  }

  get action(): Observable<MessageListAction> {
    return this.messageListAction;
  }

  get startIndex() {
    return this.innerStartIndex;
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
      const prevStartIndex = this.innerStartIndex;
      if (this.innerStartIndex >= BATCH_COUNT) {
        this.innerStartIndex -= BATCH_COUNT;
        this.raiseAction({ type: 'scroll/previous', targetIndex: prevStartIndex - 1 });
      } else {
        const count = await this.pullPrevItemsFromRemote();
        if (count > 0) {
          this.innerStartIndex = 0;
          this.raiseAction({ type: 'scroll/previous', targetIndex: prevStartIndex + count - 1 });
        }
      }
    });
  }

  pullNext(): Promise<void> {
    return this.lock(async () => {
      const prevEndIndex = this.getEndIndex();
      if (this.innerStartIndex + BATCH_COUNT < this.storage.items.length) {
        const canScrollBack = this.innerStartIndex + this.capacity < this.storage.items.length;
        if (canScrollBack) {
          const remainingCount = this.storage.items.length - this.innerStartIndex - this.capacity;
          this.innerStartIndex += Math.min(BATCH_COUNT, remainingCount);
          this.raiseAction({ type: 'scroll/next', targetIndex: prevEndIndex + 1 });
        }
      } else {
        const end = lastItemOrDefault(this.storage.items);
        const nextItems = await this.getItems(end?.id, BATCH_COUNT, false);
        const count = this.storage.addRange(nextItems);
        if (count > 0) {
          this.innerStartIndex = Math.max(this.storage.items.length - this.capacity, 0);
          this.raiseAction({ type: 'scroll/next', targetIndex: prevEndIndex + 1 });
        }
      }
    });
  }

  scrollTo(predicate: ((item: Message) => boolean) | 'latest'): Promise<void> {
    return this.lock(async () => {
      if (predicate === 'latest') {
        this.innerStartIndex = Math.max(this.storage.items.length - this.capacity, 0);
        this.raiseAction({ type: 'scroll/next', targetIndex: this.storage.items.length - 1 });
      } else {
        for (let pullCount = 0; pullCount < SCROLL_PULL_COUNT_LIMIT; pullCount++) {
          const targetIndex = this.storage.items.findIndex(predicate);
          if (targetIndex < 0) {
            // TODO: 目前默认就是向前（previous）搜索，以后酌情添加向后（next）查询跳转功能。
            await this.pullPrevItemsFromRemote();
          } else {
            if (targetIndex < this.innerStartIndex) {
              this.innerStartIndex = targetIndex;
              this.raiseAction({ type: 'scroll/previous', targetIndex });
            } else if (targetIndex >= this.innerStartIndex + this.capacity) {
              this.innerStartIndex = targetIndex - this.capacity;
              this.raiseAction({ type: 'scroll/next', targetIndex });
            } else {
              this.raiseAction({ type: 'scroll/previous', targetIndex });
            }
          }
        }
      }
    });
  }

  pushItem(item: Message) {
    if (this.storage.add(item)) {
      this.innerStartIndex = Math.max(
        this.storage.items.length - this.capacity,
        this.innerStartIndex
      );
      this.raiseAction({ type: 'add', addedCount: 1 });
    }
  }

  pushItems(items: ReadonlyArray<Message>) {
    const count = this.storage.addRange(items);
    if (count > 0) {
      this.innerStartIndex = Math.max(
        this.storage.items.length - this.capacity,
        this.innerStartIndex
      );
      this.raiseAction({ type: 'add', addedCount: count });
    }
  }

  clear() {
    this.innerStartIndex = 0;
    this.isBusy = false;
    this.storage.clear();
  }

  isWindowAtLatest() {
    return this.innerStartIndex + this.capacity >= this.storage.items.length;
  }

  private async pullPrevItemsFromRemote() {
    const start = firstItemOrDefault(this.storage.items);
    const prevItems = await this.getItems(start?.id, BATCH_COUNT, true);
    return this.storage.addRange(prevItems);
  }

  private raiseAction(action: MessageListAction) {
    this.messageListAction.next(action);
  }

  private getEndIndex() {
    const count = this.storage.items.length - this.innerStartIndex;
    const actualCount = Math.min(count, this.capacity);
    return this.innerStartIndex + actualCount;
  }

  private async lock(callback: () => Promise<void>): Promise<void> {
    if (this.isBusy) return;

    try {
      this.isBusy = true;
      await callback();
    } catch (e) {
      console.log(e);
    } finally {
      this.isBusy = false;
    }
  }
}
