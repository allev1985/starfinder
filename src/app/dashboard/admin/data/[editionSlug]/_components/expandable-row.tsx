"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpandableRowProps {
  colSpan: number;
  cells: React.ReactNode;
  panel: React.ReactNode;
}

export function ExpandableRow({ colSpan, cells, panel }: ExpandableRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell style={{ width: 40, paddingRight: 0 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        </TableCell>
        {cells}
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={colSpan} className="p-0">
            <div className="p-4" style={{ backgroundColor: "var(--surface-2, var(--surface))" }}>
              {panel}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
