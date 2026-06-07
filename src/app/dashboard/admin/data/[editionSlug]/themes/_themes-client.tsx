"use client";

import { useState, useEffect } from "react";
import { useSortable } from "../_components/use-sortable";
import { useTableControls } from "../_components/use-table-controls";
import { TablePagination } from "../_components/table-pagination";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { ExpandableRow } from "../_components/expandable-row";
import { createTheme, updateTheme, deleteTheme, listThemeAbilities, createThemeAbility, updateThemeAbility, deleteThemeAbility } from "@/db/queries/admin-themes";
import type { Theme, ThemeAbility, Edition } from "@/db/schema";

interface ThemesClientProps {
  edition: Edition;
  initialThemes: Theme[];
}

export function ThemesClient({ edition, initialThemes }: ThemesClientProps) {
  const [themes, setThemes] = useState(initialThemes);
  const { sorted: sortedThemes, sortState, toggleSort } = useSortable<(typeof themes)[0], "name">(themes);
  const { filter, setFilter, page, setPage, totalPages, paged: pagedThemes, totalFiltered } = useTableControls(sortedThemes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Theme | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openAdd() { setEditing(null); setName(""); setError(null); setModalOpen(true); }
  function openEdit(theme: Theme) { setEditing(theme); setName(theme.name); setError(null); setModalOpen(true); }

  async function handleSubmit() {
    if (!name.trim()) { setError("Name is required."); return; }
    setSubmitting(true);
    if (editing) {
      const result = await updateTheme(editing.id, name.trim());
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setThemes((prev) => prev.map((t) => t.id === editing.id ? { ...t, name: name.trim() } : t));
    } else {
      const result = await createTheme(edition.id, name.trim());
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setThemes((prev) => [...prev, result.data!]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteTheme(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setThemes((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Themes</h1>
        <Input placeholder="Filter by name…" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-56 ml-4" />
        <Button className="ml-auto" onClick={openAdd}>+ Add Theme</Button>
      </div>

      <DataTable
        columns={["", { label: "Name", sortKey: "name" }, "Actions"]}
        isEmpty={totalFiltered === 0}
        empty="No themes yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {pagedThemes.map((theme) => (
          <ExpandableRow
            key={theme.id}
            colSpan={3}
            cells={
              <>
                <TableCell>{theme.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(theme)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(theme); setDeleteError(null); }}>Delete</Button>
                  </div>
                </TableCell>
              </>
            }
            panel={<ThemeAbilitiesPanel themeId={theme.id} editionId={edition.id} />}
          />
        ))}
      </DataTable>
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} onPage={setPage} />

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Theme" : "Add Theme"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="theme-name">Name</Label>
          <Input id="theme-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}

function ThemeAbilitiesPanel({ themeId, editionId }: { themeId: string; editionId: string }) {
  const [abilities, setAbilities] = useState<ThemeAbility[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", level: "1" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listThemeAbilities(themeId).then((rows) => { setAbilities(rows); setLoaded(true); });
  }, [themeId]);

  function openAdd() { setEditingId(null); setForm({ name: "", description: "", level: "1" }); setShowForm(true); }
  function openEdit(a: ThemeAbility) { setEditingId(a.id); setForm({ name: a.name, description: a.description, level: String(a.level) }); setShowForm(true); }

  async function handleSubmit() {
    const data = { name: form.name.trim(), description: form.description.trim(), level: parseInt(form.level, 10) };
    if (!data.name || isNaN(data.level)) return;
    setSubmitting(true);
    if (editingId) {
      await updateThemeAbility(editingId, data);
      setAbilities((prev) => prev.map((a) => a.id === editingId ? { ...a, ...data } : a));
    } else {
      await createThemeAbility(themeId, editionId, data);
      const refreshed = await listThemeAbilities(themeId);
      setAbilities(refreshed);
    }
    setSubmitting(false);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    await deleteThemeAbility(id);
    setAbilities((prev) => prev.filter((a) => a.id !== id));
  }

  if (!loaded) return <p className="text-sm" style={{ color: "var(--text-2)" }}>Loading…</p>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Abilities</p>
      {abilities.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead><TableHead>Lvl</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abilities.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.level}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {showForm ? (
        <div className="flex flex-col gap-3 border rounded-[var(--r)] p-4" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Level</Label>
              <Input type="number" min={1} value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? "Saving…" : "Save"}</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="self-start" onClick={openAdd}>+ Add Ability</Button>
      )}
    </div>
  );
}
