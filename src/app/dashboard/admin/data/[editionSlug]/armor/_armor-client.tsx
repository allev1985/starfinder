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
import { createArmor, updateArmor, deleteArmor, type ArmorFormData } from "@/db/queries/admin-armor";
import type { Armor, ArmorType, Edition } from "@/db/schema";

const ARMOR_TYPES: ArmorType[] = ["light", "heavy", "powered"];

const EMPTY_FORM: ArmorFormData = {
  name: "", type: "light", itemLevel: 1, price: 0, eacBonus: 0, kacBonus: 0,
  maxDexBonus: null, armorCheckPenalty: 0, speedAdjustment: 0, bulk: "L",
  upgradeSlots: 0, sourceBook: "crb", dr: null, resistances: null,
};

interface ArmorClientProps { edition: Edition; initialArmor: Armor[]; }

export function ArmorClient({ edition, initialArmor }: ArmorClientProps) {
  const [items, setItems] = useState(initialArmor);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "type" | "itemLevel" | "eacBonus" | "kacBonus" | "bulk">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Armor | null>(null);
  const [form, setForm] = useState<ArmorFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Armor | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof ArmorFormData>(key: K, val: ArmorFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setError(null); setModalOpen(true); }
  function openEdit(item: Armor) {
    setEditing(item);
    setForm({ name: item.name, type: item.type, itemLevel: item.itemLevel, price: item.price, eacBonus: item.eacBonus, kacBonus: item.kacBonus, maxDexBonus: item.maxDexBonus ?? null, armorCheckPenalty: item.armorCheckPenalty, speedAdjustment: item.speedAdjustment, bulk: item.bulk, upgradeSlots: item.upgradeSlots, sourceBook: item.sourceBook, dr: item.dr ?? null, resistances: item.resistances ?? null });
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSubmitting(true);
    const result = editing ? await updateArmor(editing.id, form) : await createArmor(edition.id, form);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), editionId: edition.id, ...form } as Armor]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteArmor(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Armor</h1>
        <Button onClick={openAdd}>+ Add Armor</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          { label: "Type", sortKey: "type" },
          { label: "Lvl", sortKey: "itemLevel" },
          { label: "EAC", sortKey: "eacBonus" },
          { label: "KAC", sortKey: "kacBonus" },
          { label: "Bulk", sortKey: "bulk" },
          "Actions",
        ]}
        isEmpty={items.length === 0}
        empty="No armor yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="capitalize">{item.type}</TableCell>
            <TableCell>{item.itemLevel}</TableCell>
            <TableCell>{item.eacBonus >= 0 ? `+${item.eacBonus}` : item.eacBonus}</TableCell>
            <TableCell>{item.kacBonus >= 0 ? `+${item.kacBonus}` : item.kacBonus}</TableCell>
            <TableCell>{item.bulk}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(item); setDeleteError(null); }}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Armor" : "Add Armor"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v as ArmorType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ARMOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Item Level</Label>
            <Input type="number" value={form.itemLevel} onChange={(e) => set("itemLevel", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Price (credits)</Label>
            <Input type="number" value={form.price} onChange={(e) => set("price", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Bulk</Label>
            <Input value={form.bulk} onChange={(e) => set("bulk", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>EAC Bonus</Label>
            <Input type="number" value={form.eacBonus} onChange={(e) => set("eacBonus", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>KAC Bonus</Label>
            <Input type="number" value={form.kacBonus} onChange={(e) => set("kacBonus", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Max Dex Bonus</Label>
            <Input type="number" value={form.maxDexBonus ?? ""} onChange={(e) => set("maxDexBonus", e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Armor Check Penalty</Label>
            <Input type="number" value={form.armorCheckPenalty} onChange={(e) => set("armorCheckPenalty", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Speed Adjustment</Label>
            <Input type="number" value={form.speedAdjustment} onChange={(e) => set("speedAdjustment", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Upgrade Slots</Label>
            <Input type="number" value={form.upgradeSlots} onChange={(e) => set("upgradeSlots", parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Source Book</Label>
            <Input value={form.sourceBook} onChange={(e) => set("sourceBook", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>DR (optional)</Label>
            <Input value={form.dr ?? ""} onChange={(e) => set("dr", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Resistances (optional)</Label>
            <Input value={form.resistances ?? ""} onChange={(e) => set("resistances", e.target.value || null)} />
          </div>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
