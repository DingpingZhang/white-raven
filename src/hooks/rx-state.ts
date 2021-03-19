import { SetStateAction } from 'react';
import { BehaviorSubject } from 'rxjs';

export interface IRxState<T> {
  readonly source: BehaviorSubject<T>;
  set(action: SetStateAction<T>): void;
}

export class RxState<T> implements IRxState<T> {
  readonly source: BehaviorSubject<T>;

  constructor(fallbackValue: T, initValue?: (set: (value: T) => void) => void) {
    this.set = this.set.bind(this);

    this.source = new BehaviorSubject(fallbackValue);

    if (initValue) {
      initValue(value => this.source.next(value));
    }
  }

  set(action: SetStateAction<T>) {
    const nextValue = isSetCallback(action) ? action(this.source.value) : action;
    this.source.next(nextValue);
  }
}

export class RxStateCluster<TKey, TValue> {
  private readonly subjectCluster: Map<TKey, IRxState<TValue>>;
  private readonly factory: (key: TKey) => IRxState<TValue>;

  constructor(factory: (key: TKey) => IRxState<TValue>) {
    this.getOrCreate = this.getOrCreate.bind(this);
    this.delete = this.delete.bind(this);

    this.subjectCluster = new Map<TKey, IRxState<TValue>>();
    this.factory = factory;
  }

  getOrCreate(key: TKey): IRxState<TValue> {
    if (!this.subjectCluster.has(key)) {
      this.subjectCluster.set(key, this.factory(key));
    }

    return this.subjectCluster.get(key)!;
  }

  delete(key: TKey): boolean {
    return this.subjectCluster.delete(key);
  }
}

function isSetCallback<T>(action: SetStateAction<T>): action is (prev: T) => T {
  return typeof action === 'function';
}
