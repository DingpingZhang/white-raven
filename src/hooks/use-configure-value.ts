import { useForceUpdate } from './use-force-update';
import { useConstant } from './use-constant';

// TODO: Replace with log system
const log = (level: string, message: string) => console.log(`$[${level} ${message}]`);

class ConfigureValueBase<T> {
  private valueStorage: T;

  protected raisePropertyChanged: () => void;

  changed: boolean = false;

  get value() {
    return this.valueStorage;
  }

  set value(newValue: T) {
    this.changed = this.valueStorage !== newValue;

    if (this.changed) {
      this.valueStorage = newValue;
      this.raisePropertyChanged();
    }
  }

  constructor(raisePropertyChanged: () => void, initialValue: T) {
    this.valueStorage = initialValue;
    this.raisePropertyChanged = raisePropertyChanged;
  }
}

class ConfigureValue<T> extends ConfigureValueBase<T> {
  private getter: () => T;
  private setter: (value: T) => void;

  changed: boolean = false;

  constructor(getter: () => T, setter: (value: T) => void, raisePropertyChanged: () => void) {
    super(raisePropertyChanged, getter());

    this.getter = getter;
    this.setter = setter;
  }

  setAndApply(value: T) {
    this.value = value;
    this.apply();
  }

  reset(force = false) {
    if (this.changed || force) {
      this.value = this.getter();
      this.changed = false;
    }
  }

  apply(force = false) {
    if (this.changed || force) {
      try {
        this.setter(this.value);
      } catch (e) {
        log('error', `unexpected exception occurred when appling configure value. ${e}`);
      }
      this.reset(force);
    }
  }
}

class AsyncConfigureValue<T> extends ConfigureValueBase<T> {
  private getter: () => Promise<T>;
  private setter: (value: T) => Promise<void>;

  changed: boolean = false;
  isBusy: boolean = false;

  constructor(
    getter: () => Promise<T>,
    setter: (value: T) => Promise<void>,
    raisePropertyChanged: () => void,
    initialValue: T
  ) {
    super(raisePropertyChanged, initialValue);

    this.getter = async () => {
      this.isBusy = true;
      const result = await getter();
      this.isBusy = false;
      return result;
    };
    this.setter = async value => {
      this.isBusy = true;
      await setter(value);
      this.isBusy = false;
    };
  }

  async setAndApply(value: T) {
    this.value = value;
    await this.apply();
  }

  async reset(force = false) {
    if (this.changed || force) {
      this.value = await this.getter();
      this.changed = false;
    }
  }

  async apply(force = false) {
    if (this.changed || force) {
      try {
        await this.setter(this.value);
      } catch (e) {
        log('error', `unexpected exception occurred when appling configure value. ${e}`);
      }
      await this.reset(force);
    }
  }
}

export function useConfigureValue<T>(getter: () => T, setter: (value: T) => void) {
  const forceUpdate = useForceUpdate();
  return useConstant(() => new ConfigureValue<T>(getter, setter, forceUpdate));
}

export function useAsyncConfigureValue<T>(
  getter: () => Promise<T>,
  setter: (value: T) => Promise<void>,
  initialValue: T
) {
  const forceUpdate = useForceUpdate();
  return useConstant(() => new AsyncConfigureValue<T>(getter, setter, forceUpdate, initialValue));
}
