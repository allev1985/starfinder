"use client";

import { useState } from "react";
import { useSortable } from "../_components/use-sortable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { createRace, updateRace, deleteRace } from "@/db/queries/admin-races";
import type { Race, RaceType, Edition } from "@/db/schema";

interface RacesClientProps {
  edition: Edition;
  initialRaces: Race[];
}

const RACE_TYPES: { value: RaceType; label: string }[] = [
  { value: "biological", label: "Biological" },
  { value: "drone", label: "Drone" },
];

export function RacesClient({ edition, initialRaces }: RacesClientProps) {
  const [races, setRaces] = useState(initialRaces);
  const { sorted: sortedRaces, sortState, toggleSort } = useSortable<(typeof races)[0], "name" | "type">(races);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Race | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<RaceType>("biological");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Race | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setName("");
    setType("biological");
    setError(null);
    setModalOpen(true);
  }

  function openEdit(race: Race) {
    setEditing(race);
    setName(race.name);
    setType(race.type);
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (!name.trim()) { setError("Name is required."); return; }
    setSubmitting(true);
    setError(null);
    const result = editing
      ? await updateRace(editing.id, name.trim(), type)
      : await createRace(edition.id, name.trim(), type);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    if (editing) {
      setRaces((prev) => prev.map((r) => r.id === editing.id ? { ...r, name: name.trim(), type } : r));
    } else {
      // Refresh by re-fetching would be ideal but we rely on revalidatePath; optimistically add a temp
      setRaces((prev) => [...prev, { id: crypto.randomUUID(), name: name.trim(), type, editionId: edition.id }]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteRace(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setRaces((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteError(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Races</h1>
        <Button onClick={openAdd}>+ Add Race</Button>
      </div>

      <DataTable
        columns={["", { label: "Name", sortKey: "name" }, { label: "Type", sortKey: "type" }, "Actions"]}
        isEmpty={races.length === 0}
        empty="No races yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sortedRaces.map((race) => (
          <TableRow key={race.id}>
            <TableCell style={{ width: 40 }} />
            <TableCell>{race.name}</TableCell>
            <TableCell style={{ textTransform: "capitalize" }}>{race.type}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(race)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(race); setDeleteError(null); }}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      <EntityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Race" : "Add Race"}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="race-name">Name</Label>
          <Input id="race-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as RaceType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {RACE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete}
        label={deleteTarget?.name ?? ""}
        error={deleteError}
      />
    </>
  );
}
