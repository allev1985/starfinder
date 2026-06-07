"use client";

import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalFiltered: number;
  onPage: (p: number) => void;
}

export function TablePagination({ page, totalPages, totalFiltered, onPage }: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-3">
      <span style={{ fontSize: 13, color: "var(--text-2)" }}>
        Page {page} of {totalPages} ({totalFiltered} results)
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={page === 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
