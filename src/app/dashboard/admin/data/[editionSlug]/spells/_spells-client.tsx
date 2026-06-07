"use client";

import { useState, useEffect } from "react";
import { useSortable } from "../_components/use-sortable";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { ExpandableRow } from "../_components/expandable-row";
import { createSpell, updateSpell, deleteSpell, listSpellClassAssignments, setSpellClass, type SpellFormData, type SpellClassAssignment } from "@/db/queries/admin-spells";
import type { Spell, SpellSchool, Edition } from "@/db/schema";

const SPELL_SCHOOLS: SpellSchool[] = [
  "abjuration", "conjuration", "divination", "enchantment",
  "evocation", "illusion", "necromancy", "transmutation", "universal",
];

const EMPTY_FORM: SpellFormData = {
  name: "", school: "evocation", castingTime: "1 standard action",
  range: "close (25 ft. + 5 ft./2 levels)", duration: "instantaneous",
  description: "", area: null, targets: null, savingThrow: null,
  spellResist: null, damage: null, damageNote: null, source: "CRB",
};

interface SpellsClientProps { edition: Edition; initialSpells: Spell[]; }

export function SpellsClient({ edition, initialSpells }: SpellsClientProps) {
  const [items, setItems] = useState(initialSpells);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "school" | "castingTime">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Spell | null>(null);
  const [form, setForm] = useState<SpellFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Spell | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof SpellFormData>(key: K, val: SpellFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setError(null); setModalOpen(true); }
  function openEdit(item: Spell) {
    setEditing(item);
    setForm({ name: item.name, school: item.school, castingTime: item.castingTime, range: item.range, duration: item.duration, description: item.description, area: item.area ?? null, targets: item.targets ?? null, savingThrow: item.savingThrow ?? null, spellResist: item.spellResist ?? null, damage: item.damage ?? null, damageNote: item.damageNote ?? null, source: item.source });
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.description.trim()) { setError("Name and description are required."); return; }
    setSubmitting(true);
    if (editing) {
      const result = await updateSpell(editing.id, form);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      const result = await createSpell(edition.id, form);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setItems((prev) => [...prev, result.data!]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteSpell(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Spells</h1>
        <Button onClick={openAdd}>+ Add Spell</Button>
      </div>

      <DataTable
        columns={[
          "",
          { label: "Name", sortKey: "name" },
          { label: "School", sortKey: "school" },
          { label: "Casting Time", sortKey: "castingTime" },
          "Actions",
        ]}
        isEmpty={items.length === 0}
        empty="No spells yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sorted.map((spell) => (
          <ExpandableRow
            key={spell.id}
            colSpan={5}
            cells={
              <>
                <TableCell>{spell.name}</TableCell>
                <TableCell className="capitalize">{spell.school}</TableCell>
                <TableCell>{spell.castingTime}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(spell)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(spell); setDeleteError(null); }}>Delete</Button>
                  </div>
                </TableCell>
              </>
            }
            panel={<SpellClassPanel spellId={spell.id} editionId={edition.id} />}
          />
        ))}
      </DataTable>

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Spell" : "Add Spell"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>School</Label>
            <Select value={form.school} onValueChange={(v) => set("school", v as SpellSchool)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SPELL_SCHOOLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Casting Time</Label>
            <Input value={form.castingTime} onChange={(e) => set("castingTime", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Range</Label>
            <Input value={form.range} onChange={(e) => set("range", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Duration</Label>
            <Input value={form.duration} onChange={(e) => set("duration", e.target.value)} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Area (optional)</Label>
            <Input value={form.area ?? ""} onChange={(e) => set("area", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Targets (optional)</Label>
            <Input value={form.targets ?? ""} onChange={(e) => set("targets", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Saving Throw (optional)</Label>
            <Input value={form.savingThrow ?? ""} onChange={(e) => set("savingThrow", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Source</Label>
            <Input value={form.source} onChange={(e) => set("source", e.target.value)} />
          </div>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}

function SpellClassPanel({ spellId, editionId }: { spellId: string; editionId: string }) {
  const [assignments, setAssignments] = useState<SpellClassAssignment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listSpellClassAssignments(spellId, editionId).then((rows) => { setAssignments(rows); setLoaded(true); });
  }, [spellId, editionId]);

  async function toggle(classId: string, currentLevel: number | null) {
    const newLevel = currentLevel === null ? 1 : null;
    setAssignments((prev) => prev.map((a) => a.classId === classId ? { ...a, spellLevel: newLevel } : a));
    await setSpellClass(spellId, classId, newLevel);
  }

  async function updateLevel(classId: string, level: number) {
    setAssignments((prev) => prev.map((a) => a.classId === classId ? { ...a, spellLevel: level } : a));
    await setSpellClass(spellId, classId, level);
  }

  if (!loaded) return <p className="text-sm" style={{ color: "var(--text-2)" }}>Loading…</p>;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Class Assignments</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {assignments.map((a) => (
          <div key={a.classId} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`sc-${spellId}-${a.classId}`}
              checked={a.spellLevel !== null}
              onChange={() => toggle(a.classId, a.spellLevel)}
              className="w-4 h-4"
            />
            <label htmlFor={`sc-${spellId}-${a.classId}`} className="text-sm cursor-pointer" style={{ color: "var(--text-1)" }}>
              {a.className}
            </label>
            {a.spellLevel !== null && (
              <Input
                type="number"
                min={0}
                max={6}
                value={a.spellLevel}
                onChange={(e) => updateLevel(a.classId, parseInt(e.target.value) || 0)}
                className="w-14 h-7 text-xs"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
