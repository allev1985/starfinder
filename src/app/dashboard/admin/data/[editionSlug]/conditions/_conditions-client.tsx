"use client";

import { useState } from "react";
import { useSortable } from "../_components/use-sortable";
import { useTableControls } from "../_components/use-table-controls";
import { TablePagination } from "../_components/table-pagination";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { createCondition, updateCondition, deleteCondition, type ConditionFormData } from "@/db/queries/admin-conditions";
import type { Condition, Edition } from "@/db/schema";

const EMPTY_FORM: ConditionFormData = { name: "", slug: "", description: "" };

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface ConditionsClientProps { edition: Edition; initialConditions: Condition[]; }

export function ConditionsClient({ edition, initialConditions }: ConditionsClientProps) {
  const [items, setItems] = useState(initialConditions);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "slug">(items);
  const { filter, setFilter, page, setPage, totalPages, paged, totalFiltered } = useTableControls(sorted);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Condition | null>(null);
  const [form, setForm] = useState<ConditionFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Condition | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof ConditionFormData>(key: K, val: ConditionFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: editing ? f.slug : toSlug(name) }));
  }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setError(null); setModalOpen(true); }
  function openEdit(item: Condition) {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, description: item.description });
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      setError("Name, slug, and description are required."); return;
    }
    setSubmitting(true);
    if (editing) {
      const result = await updateCondition(editing.id, form);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      const result = await createCondition(edition.id, form);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setItems((prev) => [...prev, result.data!]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteCondition(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Conditions</h1>
        <Input placeholder="Filter by name…" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-56 ml-4" />
        <Button className="ml-auto" onClick={openAdd}>+ Add Condition</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          { label: "Slug", sortKey: "slug" },
          "Description",
          "Actions",
        ]}
        isEmpty={totalFiltered === 0}
        empty="No conditions yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {paged.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-sm font-mono" style={{ color: "var(--text-2)" }}>{item.slug}</TableCell>
            <TableCell className="max-w-xs truncate text-sm" style={{ color: "var(--text-2)" }}>{item.description}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(item); setDeleteError(null); }}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} onPage={setPage} />

      <EntityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Condition" : "Add Condition"}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              readOnly={!!editing}
              className={editing ? "opacity-60" : ""}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} />
          </div>
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
