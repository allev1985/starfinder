import { useEffect, useLayoutEffect, useRef } from "react";

const SAVE_DELAY_MS = 600;

export function useDebouncedSave<T>(save: (value: T) => void) {
  const saveRef = useRef(save);
  useLayoutEffect(() => {
    saveRef.current = save;
  });

  const pendingRef = useRef<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current !== null) saveRef.current(pendingRef.current);
    };
  }, []);

  return function schedule(value: T) {
    pendingRef.current = value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      pendingRef.current = null;
      saveRef.current(value);
    }, SAVE_DELAY_MS);
  };
}
