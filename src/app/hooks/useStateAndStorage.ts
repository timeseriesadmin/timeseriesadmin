import { useState } from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';

/**
 * Keep state and Local Storage in-sync
 * @param storageKey Local Storage key
 * @param initValue Initial value if Local Storage is empty
 */
export function useStateAndStorage<T>(
  storageKey: string,
  initValue: T,
): [T, (newState: T) => void] {
  const [storage, setStorage] = useLocalStorage<T>(storageKey, initValue);
  const [value, setState] = useState(storage);

  const setValue = (value: T): void => {
    setState(value);
    setStorage(value);
  };

  return [value, setValue];
}
