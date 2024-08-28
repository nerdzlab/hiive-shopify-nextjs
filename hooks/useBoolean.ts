import { useCallback, useState } from 'react';

export function useBoolean(defaultValue?: boolean): [
  boolean,
  {
    on: () => void;
    off: () => void;
    toggle: () => void;
  },
] {
  const [value, setValue] = useState(!!defaultValue);

  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(x => !x), []);

  return [
    value,
    {
      on,
      off,
      toggle,
    },
  ];
}
