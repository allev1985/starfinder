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
import { createEquipment, updateEquipment, deleteEquipment, type EquipmentFormData } from "@/db/queries/admin-equipment";
import type { Equipment, EquipmentCategory, AugmentationSystem } from "@/db/schema";

const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  "augmentation_cybernetic", "augmentation_biotech", "personal_upgrade", "ammunition", "shield",
  "computer", "magic_item", "trap", "technological", "personal",
];
const AUGMENTATION_SYSTEMS: AugmentationSystem[] = [
  "brain", "eyes", "ears", "throat", "arm", "hand", "lungs", "spinal_column", "feet", "skin",
];

const EMPTY_FORM: EquipmentFormData = {
  name: "", category: "personal_upgrade", itemLevel: 1, price: 0, bulk: "L",
  system: null, ammoType: null, ammoCapacity: null, bonusHint: null,
  eacBonus: null, kacBonus: null, acPenalty: null, maxDexBonus: null,
};

const isAugmentation = (c: EquipmentCategory) => c === "augmentation_cybernetic" || c === "augmentation_biotech";
const isShield = (c: EquipmentCategory) => c === "shield";

interface EquipmentClientProps { initialEquipment: Equipment[]; }

export function EquipmentClient({ initialEquipment }: EquipmentClientProps) {
  const [items, setItems] = useState(initialEquipment);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "category" | "itemLevel" | "price" | "bulk">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState<EquipmentFormData>(EMPTY_FORM);
  const [itemLevelStr, setItemLevelStr] = useState("1");
  const [priceStr, setPriceStr] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof EquipmentFormData>(key: K, val: EquipmentFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setItemLevelStr("1"); setPriceStr("0"); setError(null); setModalOpen(true); }
  function openEdit(item: Equipment) {
    setEditing(item);
    setForm({ name: item.name, category: item.category, itemLevel: item.itemLevel, price: item.price, bulk: item.bulk, system: item.system ?? null, ammoType: item.ammoType ?? null, ammoCapacity: item.ammoCapacity ?? null, bonusHint: item.bonusHint ?? null, eacBonus: item.eacBonus ?? null, kacBonus: item.kacBonus ?? null, acPenalty: item.acPenalty ?? null, maxDexBonus: item.maxDexBonus ?? null });
    setItemLevelStr(String(item.itemLevel));
    setPriceStr(String(item.price));
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    const finalForm = {
      ...form,
      itemLevel: parseInt(itemLevelStr) || 1,
      price: parseInt(priceStr) || 0,
      system: isAugmentation(form.category) ? form.system : null,
      eacBonus: isShield(form.category) ? form.eacBonus : null,
      kacBonus: isShield(form.category) ? form.kacBonus : null,
      acPenalty: isShield(form.category) ? form.acPenalty : null,
      maxDexBonus: isShield(form.category) ? form.maxDexBonus : null,
    };
    setSubmitting(true);
    if (editing) {
      const result = await updateEquipment(editing.id, finalForm);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...finalForm, system: finalForm.system ?? null, eacBonus: finalForm.eacBonus ?? null, kacBonus: finalForm.kacBonus ?? null, acPenalty: finalForm.acPenalty ?? null, maxDexBonus: finalForm.maxDexBonus ?? null } : i));
    } else {
      const result = await createEquipment(finalForm);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setItems((prev) => [...prev, result.data!]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteEquipment(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Equipment</h1>
        <Button onClick={openAdd}>+ Add Equipment</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          { label: "Category", sortKey: "category" },
          { label: "Lvl", sortKey: "itemLevel" },
          { label: "Price", sortKey: "price" },
          { label: "Bulk", sortKey: "bulk" },
          "Actions",
        ]}
        isEmpty={items.length === 0}
        empty="No equipment yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-xs">{item.category.replace(/_/g, " ")}</TableCell>
            <TableCell>{item.itemLevel}</TableCell>
            <TableCell>{item.price}</TableCell>
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

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Equipment" : "Add Equipment"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v as EquipmentCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EQUIPMENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {isAugmentation(form.category) && (
            <div className="flex flex-col gap-1">
              <Label>System</Label>
              <Select value={form.system ?? ""} onValueChange={(v) => set("system", v as AugmentationSystem || null)}>
                <SelectTrigger><SelectValue placeholder="Select system" /></SelectTrigger>
                <SelectContent>{AUGMENTATION_SYSTEMS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {isShield(form.category) && (
            <>
              <div className="flex flex-col gap-1">
                <Label>EAC Bonus</Label>
                <Input type="number" value={form.eacBonus ?? ""} onChange={(e) => set("eacBonus", e.target.value ? parseInt(e.target.value) : null)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>KAC Bonus</Label>
                <Input type="number" value={form.kacBonus ?? ""} onChange={(e) => set("kacBonus", e.target.value ? parseInt(e.target.value) : null)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>AC Penalty</Label>
                <Input type="number" value={form.acPenalty ?? ""} onChange={(e) => set("acPenalty", e.target.value ? parseInt(e.target.value) : null)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Max DEX Bonus (optional)</Label>
                <Input type="number" value={form.maxDexBonus ?? ""} onChange={(e) => set("maxDexBonus", e.target.value ? parseInt(e.target.value) : null)} />
              </div>
            </>
          )}
          <div className="flex flex-col gap-1">
            <Label>Item Level</Label>
            <Input type="number" value={itemLevelStr} onChange={(e) => setItemLevelStr(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Price (credits)</Label>
            <Input type="number" value={priceStr} onChange={(e) => setPriceStr(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Bulk</Label>
            <Input value={form.bulk} onChange={(e) => set("bulk", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Ammo Type (optional)</Label>
            <Input value={form.ammoType ?? ""} onChange={(e) => set("ammoType", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Ammo Capacity (optional)</Label>
            <Input type="number" value={form.ammoCapacity ?? ""} onChange={(e) => set("ammoCapacity", e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Bonus Hint (optional)</Label>
            <Input value={form.bonusHint ?? ""} onChange={(e) => set("bonusHint", e.target.value || null)} />
          </div>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
