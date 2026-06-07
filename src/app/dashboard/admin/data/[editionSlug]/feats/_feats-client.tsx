"use client";

import { useState } from "react";
import { useSortable } from "../_components/use-sortable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { createFeat, updateFeat, deleteFeat, type FeatFormData } from "@/db/queries/admin-feats";
import type { Feat, Edition } from "@/db/schema";

const EMPTY_FORM: FeatFormData = { name: "", description: "", prerequisites: null, isCombatFeat: false, sourceBook: "crb" };

interface FeatsClientProps { edition: Edition; initialFeats: Feat[]; }

export function FeatsClient({ edition, initialFeats }: FeatsClientProps) {
  const [items, setItems] = useState(initialFeats);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "isCombatFeat">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Feat | null>(null);
  const [form, setForm] = useState<FeatFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Feat | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof FeatFormData>(key: K, val: FeatFormData[K]) { setForm((f) => ({ ...f, [key]: val })); }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setError(null); setModalOpen(true); }
  function openEdit(item: Feat) {
    setEditing(item);
    setForm({ name: item.name, description: item.description, prerequisites: item.prerequisites ?? null, isCombatFeat: item.isCombatFeat, sourceBook: item.sourceBook });
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.description.trim()) { setError("Name and description are required."); return; }
    setSubmitting(true);
    const result = editing ? await updateFeat(editing.id, form) : await createFeat(edition.id, form);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), editionId: edition.id, ...form } as Feat]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteFeat(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Feats</h1>
        <Button onClick={openAdd}>+ Add Feat</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          { label: "Combat", sortKey: "isCombatFeat" },
          "Prerequisites",
          "Actions",
        ]}
        isEmpty={items.length === 0}
        empty="No feats yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.isCombatFeat ? "Yes" : "No"}</TableCell>
            <TableCell className="max-w-xs truncate text-sm" style={{ color: "var(--text-2)" }}>{item.prerequisites ?? "—"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(item); setDeleteError(null); }}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Feat" : "Add Feat"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Prerequisites (optional)</Label>
            <Input value={form.prerequisites ?? ""} onChange={(e) => set("prerequisites", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Source Book</Label>
            <Input value={form.sourceBook} onChange={(e) => set("sourceBook", e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="combat-feat" checked={form.isCombatFeat} onCheckedChange={(v) => set("isCombatFeat", !!v)} />
            <Label htmlFor="combat-feat">Combat Feat</Label>
          </div>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
