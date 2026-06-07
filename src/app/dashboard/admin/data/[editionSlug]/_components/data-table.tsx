"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortState } from "./use-sortable";

export interface ColumnDef {
  label: string;
  sortKey?: string;
}

interface DataTableProps {
  columns: (string | ColumnDef)[];
  children: React.ReactNode;
  empty?: React.ReactNode;
  isEmpty?: boolean;
  sortState?: SortState<string>;
  onSort?: (key: string) => void;
}

function SortIcon({ col, sortState }: { col: string; sortState?: SortState<string> }) {
  if (!sortState || sortState.key !== col) return <ChevronsUpDown size={13} className="opacity-40" />;
  return sortState.dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
}

export function DataTable({ columns, children, empty, isEmpty, sortState, onSort }: DataTableProps) {
  const colCount = columns.length;

  return (
    <div className="rounded-[var(--r)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => {
              const label = typeof col === "string" ? col : col.label;
              const sortKey = typeof col === "string" ? undefined : col.sortKey;
              const sortable = !!sortKey && !!onSort;
              return (
                <TableHead
                  key={i}
                  onClick={sortable ? () => onSort!(sortKey!) : undefined}
                  style={sortable ? { cursor: "pointer", userSelect: "none" } : undefined}
                >
                  {sortable ? (
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon col={sortKey!} sortState={sortState} />
                    </span>
                  ) : (
                    label
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <tr>
              <td colSpan={colCount} className="py-10 text-center" style={{ color: "var(--text-2)", fontSize: 14 }}>
                {empty ?? "No records found."}
              </td>
            </tr>
          ) : (
            children
          )}
        </TableBody>
      </Table>
    </div>
  );
}
