"use client";

import { useState, useMemo } from "react";

export type SortDir = "asc" | "desc";

export interface SortState<K extends string> {
  key: K | null;
  dir: SortDir;
}

export interface UseSortableResult<T, K extends string> {
  sorted: T[];
  sortState: SortState<K>;
  toggleSort: (key: string) => void;
}

function compareValues(a: unknown, b: unknown, dir: SortDir): number {
  const av = a ?? "";
  const bv = b ?? "";
  let result: number;
  if (typeof av === "number" && typeof bv === "number") {
    result = av - bv;
  } else if (typeof av === "boolean" && typeof bv === "boolean") {
    result = Number(av) - Number(bv);
  } else {
    result = String(av).localeCompare(String(bv));
  }
  return dir === "asc" ? result : -result;
}

export function useSortable<T extends Record<string, unknown>, K extends string>(
  items: T[]
): UseSortableResult<T, K> {
  const [sortState, setSortState] = useState<SortState<K>>({ key: null, dir: "asc" });

  function toggleSort(key: string) {
    setSortState((prev) =>
      prev.key === (key as K)
        ? { key: key as K, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key: key as K, dir: "asc" }
    );
  }

  const sorted = useMemo(() => {
    if (!sortState.key) return items;
    return [...items].sort((a, b) =>
      compareValues(a[sortState.key as string], b[sortState.key as string], sortState.dir)
    );
  }, [items, sortState]);

  return { sorted, sortState, toggleSort };
}
