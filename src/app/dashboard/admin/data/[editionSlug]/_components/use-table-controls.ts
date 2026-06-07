"use client";

import { useState, useMemo } from "react";

const PAGE_SIZE = 50;

export interface TableControlsResult<T> {
  filter: string;
  setFilter: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  paged: T[];
  totalFiltered: number;
}

export function useTableControls<T extends { name: string }>(items: T[]): TableControlsResult<T> {
  const [filter, setFilterRaw] = useState("");
  const [page, setPage] = useState(1);

  function setFilter(v: string) {
    setFilterRaw(v);
    setPage(1);
  }

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const q = filter.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return { filter, setFilter, page: safePage, setPage, totalPages, paged, totalFiltered: filtered.length };
}
