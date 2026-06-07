import { useState, useEffect, useRef } from "react";

/**
 * Manages a number-backed input as a string so the field can be cleared mid-edit
 * without snapping back to 0. Only calls onChange when the entered value is a
 * valid integer. Resets to the committed value on blur if left invalid.
 * Syncs display when the external value changes (e.g. realtime updates).
 */
export function useNumericInput(value: number, onChange: (v: number) => void) {
  const [str, setStr] = useState(String(value));
  const committed = useRef(value);

  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value;
      setStr(String(value));
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setStr(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n)) {
      committed.current = n;
      onChange(n);
    }
  }

  function handleBlur() {
    if (isNaN(parseInt(str, 10))) {
      setStr(String(committed.current));
    }
  }

  return { inputValue: str, handleChange, handleBlur };
}
