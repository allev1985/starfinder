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

const ABILITY_KEYS = ["defaultStr", "defaultDex", "defaultInt", "defaultWis", "defaultCha"] as const;
type AbilityKey = typeof ABILITY_KEYS[number];
type AbilityStrs = Record<AbilityKey, string>;

const EMPTY_FORM: Omit<ChassisFormData, AbilityKey> = { name: "", bonusSkillId: null };
const EMPTY_ABILITY_STRS: AbilityStrs = { defaultStr: "10", defaultDex: "10", defaultInt: "10", defaultWis: "10", defaultCha: "10" };

interface ChassisClientProps { edition: Edition; initialChassis: Chassis[]; allSkills: Skill[]; }

export function ChassisClient({ edition, initialChassis, allSkills }: ChassisClientProps) {
  const [items, setItems] = useState(initialChassis);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "defaultStr" | "defaultDex" | "defaultInt" | "defaultWis" | "defaultCha">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Chassis | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [abilityStrs, setAbilityStrs] = useState<AbilityStrs>(EMPTY_ABILITY_STRS);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Chassis | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setAbilityStrs(EMPTY_ABILITY_STRS); setError(null); setModalOpen(true); }
  function openEdit(item: Chassis) {
    setEditing(item);
    setForm({ name: item.name, bonusSkillId: item.bonusSkillId ?? null });
    setAbilityStrs({ defaultStr: String(item.defaultStr), defaultDex: String(item.defaultDex), defaultInt: String(item.defaultInt), defaultWis: String(item.defaultWis), defaultCha: String(item.defaultCha) });
    setError(null); setModalOpen(true);
  }

  function buildFormData(): ChassisFormData {
    return {
      ...form,
      defaultStr: parseInt(abilityStrs.defaultStr) || 10,
      defaultDex: parseInt(abilityStrs.defaultDex) || 10,
      defaultInt: parseInt(abilityStrs.defaultInt) || 10,
      defaultWis: parseInt(abilityStrs.defaultWis) || 10,
      defaultCha: parseInt(abilityStrs.defaultCha) || 10,
    };
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    const data = buildFormData();
    setSubmitting(true);
    if (editing) {
      const result = await updateChassis(editing.id, data);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i));
    } else {
      const result = await createChassis(edition.id, data);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setItems((prev) => [...prev, result.data!]);
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
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Bonus Skill (optional)</Label>
            <Select value={form.bonusSkillId ?? "none"} onValueChange={(v) => setForm((f) => ({ ...f, bonusSkillId: v === "none" ? null : v }))}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {allSkills.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {ABILITY_KEYS.map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <Label>{key.replace("default", "Default ")}</Label>
              <Input type="number" value={abilityStrs[key]} onChange={(e) => setAbilityStrs((s) => ({ ...s, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
