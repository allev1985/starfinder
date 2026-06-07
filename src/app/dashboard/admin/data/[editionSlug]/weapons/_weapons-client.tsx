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
import { createWeapon, updateWeapon, deleteWeapon, type WeaponFormData } from "@/db/queries/admin-weapons";
import type { Weapon, WeaponCategory, Edition } from "@/db/schema";

const WEAPON_CATEGORIES: WeaponCategory[] = [
  "small_arms", "longarms", "heavy", "sniper",
  "melee_basic", "melee_advanced", "grenade", "special",
];

const EMPTY_FORM: WeaponFormData = {
  name: "", category: "small_arms", itemLevel: 1, damageDice: "1d4",
  damageTypes: [], criticalEffect: null, criticalDice: null, range: null,
  capacity: null, usage: null, bulk: "L", special: null, ammoType: null, sourceBook: "crb",
};

interface WeaponsClientProps { edition: Edition; initialWeapons: Weapon[]; }

export function WeaponsClient({ edition, initialWeapons }: WeaponsClientProps) {
  const [items, setItems] = useState(initialWeapons);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "category" | "itemLevel" | "damageDice" | "bulk">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Weapon | null>(null);
  const [form, setForm] = useState<WeaponFormData>(EMPTY_FORM);
  const [itemLevelStr, setItemLevelStr] = useState("1");
  const [damageTypesStr, setDamageTypesStr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Weapon | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function set<K extends keyof WeaponFormData>(key: K, val: WeaponFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setItemLevelStr("1"); setDamageTypesStr(""); setError(null); setModalOpen(true); }
  function openEdit(item: Weapon) {
    setEditing(item);
    setForm({ name: item.name, category: item.category, itemLevel: item.itemLevel, damageDice: item.damageDice, damageTypes: item.damageTypes, criticalEffect: item.criticalEffect ?? null, criticalDice: item.criticalDice ?? null, range: item.range ?? null, capacity: item.capacity ?? null, usage: item.usage ?? null, bulk: item.bulk, special: item.special ?? null, ammoType: item.ammoType ?? null, sourceBook: item.sourceBook });
    setItemLevelStr(String(item.itemLevel));
    setDamageTypesStr(item.damageTypes.join(", "));
    setError(null); setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.damageDice.trim()) { setError("Name and damage dice are required."); return; }
    const finalForm = { ...form, itemLevel: parseInt(itemLevelStr) || 1, damageTypes: damageTypesStr.split(",").map((s) => s.trim()).filter(Boolean) };
    setSubmitting(true);
    if (editing) {
      const result = await updateWeapon(editing.id, finalForm);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...finalForm } : i));
    } else {
      const result = await createWeapon(edition.id, finalForm);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setItems((prev) => [...prev, result.data!]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteWeapon(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Weapons</h1>
        <Button onClick={openAdd}>+ Add Weapon</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          { label: "Category", sortKey: "category" },
          { label: "Lvl", sortKey: "itemLevel" },
          { label: "Damage", sortKey: "damageDice" },
          { label: "Bulk", sortKey: "bulk" },
          "Actions",
        ]}
        isEmpty={items.length === 0}
        empty="No weapons yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-xs">{item.category.replace(/_/g, " ")}</TableCell>
            <TableCell>{item.itemLevel}</TableCell>
            <TableCell>{item.damageDice}</TableCell>
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

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Weapon" : "Add Weapon"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v as WeaponCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{WEAPON_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Item Level</Label>
            <Input type="number" value={itemLevelStr} onChange={(e) => setItemLevelStr(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Damage Dice</Label>
            <Input value={form.damageDice} onChange={(e) => set("damageDice", e.target.value)} placeholder="1d6" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Damage Types (comma-separated)</Label>
            <Input value={damageTypesStr} onChange={(e) => setDamageTypesStr(e.target.value)} placeholder="P, S" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Bulk</Label>
            <Input value={form.bulk} onChange={(e) => set("bulk", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Range (optional)</Label>
            <Input value={form.range ?? ""} onChange={(e) => set("range", e.target.value || null)} placeholder="30 ft." />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Capacity (optional)</Label>
            <Input type="number" value={form.capacity ?? ""} onChange={(e) => set("capacity", e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Usage (optional)</Label>
            <Input type="number" value={form.usage ?? ""} onChange={(e) => set("usage", e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Critical Effect (optional)</Label>
            <Input value={form.criticalEffect ?? ""} onChange={(e) => set("criticalEffect", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Critical Dice (optional)</Label>
            <Input value={form.criticalDice ?? ""} onChange={(e) => set("criticalDice", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Special (optional)</Label>
            <Input value={form.special ?? ""} onChange={(e) => set("special", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Ammo Type (optional)</Label>
            <Input value={form.ammoType ?? ""} onChange={(e) => set("ammoType", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Source Book</Label>
            <Input value={form.sourceBook} onChange={(e) => set("sourceBook", e.target.value)} />
          </div>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
