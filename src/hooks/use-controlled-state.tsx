import * as React from 'react';

interface CommonControlledStateProps<T> {
  value?: T;
  defaultValue?: T;
}

export function useControlledState<T, Rest extends unknown[] = []>(
  props: CommonControlledStateProps<T> & {
    onChange?: (value: T, ...args: Rest) => void;
  },
): readonly [T, (next: T, ...args: Rest) => void] {
  const { value, defaultValue, onChange } = props;

  const [state, setInternalState] = React.useState<T>(
    value !== undefined ? value : (defaultValue as T),
  );

  const isControlled = value !== undefined;
  const currentState = isControlled ? value : state;

  const setState = React.useCallback(
    (next: T, ...args: Rest) => {
      if (!isControlled) setInternalState(next);
      onChange?.(next, ...args);
    },
    [isControlled, onChange],
  );

  return [currentState, setState] as const;
}
