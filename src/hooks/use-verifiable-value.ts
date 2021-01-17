import { useState, useMemo, useCallback, useReducer } from 'react';

const EMPTY_TEXT = '';

export interface VerifiableValue<T> {
  readonly value: T;
  readonly error: string;

  /**
   * Sets the value with check.
   */
  set(value: T): void;

  /**
   * Sets the value without check and clear the current error text if not empty.
   */
  setOnly(value: T): void;

  /**
   * Checks the current value and update the error text.
   */
  check(): boolean;
}

type Rule<T> = {
  assert: (value: T) => boolean;
  getError: () => string;
};

interface RuleConfiguration<T> {
  addRule(assert: (value: T) => boolean, getError: () => string): RuleConfiguration<T>;
}

class RuleConfigurationImpl<T> implements RuleConfiguration<T> {
  readonly rules: Array<Rule<T>> = new Array<Rule<T>>();

  addRule(assert: (value: T) => boolean, getError: () => string): RuleConfiguration<T> {
    this.rules.push({ assert, getError });
    return this;
  }
}

export type ConfigureRule<T> = (configuration: RuleConfiguration<T>) => void;

export function useVerifiableValue<T>(
  configure: ConfigureRule<T>,
  initValue: T
): VerifiableValue<T> {
  const ruleCollection = useMemo(() => {
    const ruleConfiguration = new RuleConfigurationImpl<T>();
    configure(ruleConfiguration);
    // Add clear logic to end of rule array.
    ruleConfiguration.addRule(
      () => false,
      () => EMPTY_TEXT
    );
    return ruleConfiguration.rules;
  }, [configure]);
  const [error, setError] = useState(EMPTY_TEXT);
  const checkValue = useCallback(
    (value: T) => {
      const index = ruleCollection.findIndex((rule) => !rule.assert(value));
      setError(ruleCollection[index].getError());
      // The last rule must be the clear logic, so it means that the value is valid.
      return index === ruleCollection.length - 1;
    },
    [ruleCollection]
  );
  const valueReducer = useCallback(
    (_state: T, action: { newValue: T; withCheck: boolean }) => {
      const { newValue, withCheck } = action;
      if (withCheck) {
        checkValue(newValue);
      } else if (error) {
        // Clear error text when setting value without check.
        setError(EMPTY_TEXT);
      }

      return newValue;
    },
    [checkValue, error]
  );
  const [value, dispatch] = useReducer(valueReducer, initValue);

  return useMemo(
    () => ({
      value,
      error,
      check: () => checkValue(value),
      set: (value: T) => dispatch({ newValue: value, withCheck: true }),
      setOnly: (value: T) => dispatch({ newValue: value, withCheck: false }),
    }),
    [checkValue, error, value]
  );
}
