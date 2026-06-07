"use client";

import { useState } from "react";
import { useSortable } from "../_components/use-sortable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { createChassis, updateChassis, deleteChassis, type ChassisFormData } from "@/db/queries/admin-chassis";
import type { Chassis, Skill, Edition } from "@/db/schema";

const EMPTY_FORM: ChassisFormData = {
  name: "", bonusSkillId: null, defaultStr: 10, defaultDex: 10, defaultInt: 10, defaultWis: 10, defaultCha: 10,
};

interface ChassisClientProps { edition: Edition; initialChassis: Chassis[]; allSkills: Skill[]; }

export function ChassisClient({ edition, initialChassis, allSkills }: ChassisClientProps) {
  const [items, setItems] = useState(initialChassis);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "defaultStr" | "defaultDex" | "defaultInt" | "defaultWis" | "defaultCha">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Chassis | null>(null);
  const [form, setForm] = useState<ChassisFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Chassis | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof ChassisFormData>(key: K, val: ChassisFormData[K]) { setForm((f) => ({ ...f, [key]: val })); }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setError(null); setModalOpen(true); }
  function openEdit(item: Chassis) {
    setEditing(item);
    setForm({ name: item.name, bonusSkillId: item.bonusSkillId ?? null, defaultStr: item.defaultStr, defaultDex: item.defaultDex, defaultInt: item.defaultInt, defaultWis: item.defaultWis, defaultCha: item.defaultCha });
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSubmitting(true);
    const result = editing ? await updateChassis(editing.id, form) : await createChassis(edition.id, form);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), editionId: edition.id, ...form } as Chassis]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteChassis(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const skillName = (id: string | null) => allSkills.find((s) => s.id === id)?.name ?? "—";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Chassis</h1>
        <Button onClick={openAdd}>+ Add Chassis</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          "Bonus Skill",
          { label: "STR", sortKey: "defaultStr" },
          { label: "DEX", sortKey: "defaultDex" },
          { label: "INT", sortKey: "defaultInt" },
          { label: "WIS", sortKey: "defaultWis" },
          { label: "CHA", sortKey: "defaultCha" },
          "Actions",
        ]}
        isEmpty={items.length === 0}
        empty="No chassis yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{skillName(item.bonusSkillId ?? null)}</TableCell>
            <TableCell>{item.defaultStr}</TableCell>
            <TableCell>{item.defaultDex}</TableCell>
            <TableCell>{item.defaultInt}</TableCell>
            <TableCell>{item.defaultWis}</TableCell>
            <TableCell>{item.defaultCha}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(item); setDeleteError(null); }}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Chassis" : "Add Chassis"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Bonus Skill (optional)</Label>
            <Select value={form.bonusSkillId ?? "none"} onValueChange={(v) => set("bonusSkillId", v === "none" ? null : v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {allSkills.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {(["defaultStr", "defaultDex", "defaultInt", "defaultWis", "defaultCha"] as const).map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <Label>{key.replace("default", "Default ")}</Label>
              <Input type="number" value={form[key]} onChange={(e) => set(key, parseInt(e.target.value) || 10)} />
            </div>
          ))}
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
