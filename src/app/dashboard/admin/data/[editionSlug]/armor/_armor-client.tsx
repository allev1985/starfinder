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

// String-keyed numeric fields for clean input editing
interface ArmorNums {
  itemLevel: string;
  price: string;
  eacBonus: string;
  kacBonus: string;
  armorCheckPenalty: string;
  speedAdjustment: string;
  upgradeSlots: string;
}

const EMPTY_NUMS: ArmorNums = {
  itemLevel: "1", price: "0", eacBonus: "0", kacBonus: "0",
  armorCheckPenalty: "0", speedAdjustment: "0", upgradeSlots: "0",
};

interface ArmorStrings {
  name: string;
  type: ArmorType;
  maxDexBonus: number | null;
  bulk: string;
  sourceBook: string;
  dr: string | null;
  resistances: string | null;
}

const EMPTY_STR: ArmorStrings = {
  name: "", type: "light", maxDexBonus: null, bulk: "L", sourceBook: "crb", dr: null, resistances: null,
};

interface ArmorClientProps { edition: Edition; initialArmor: Armor[]; }

export function ArmorClient({ edition, initialArmor }: ArmorClientProps) {
  const [items, setItems] = useState(initialArmor);
  const { sorted, sortState, toggleSort } = useSortable<(typeof items)[0], "name" | "type" | "itemLevel" | "eacBonus" | "kacBonus" | "bulk">(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Armor | null>(null);
  const [f, setF] = useState<ArmorStrings>(EMPTY_STR);
  const [n, setN] = useState<ArmorNums>(EMPTY_NUMS);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Armor | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function setStr<K extends keyof ArmorStrings>(key: K, val: ArmorStrings[K]) { setF((s) => ({ ...s, [key]: val })); }
  function setNum(key: keyof ArmorNums, val: string) { setN((s) => ({ ...s, [key]: val })); }

  function openAdd() {
    setEditing(null); setF(EMPTY_STR); setN(EMPTY_NUMS); setError(null); setModalOpen(true);
  }

  function openEdit(item: Armor) {
    setEditing(item);
    setF({ name: item.name, type: item.type, maxDexBonus: item.maxDexBonus ?? null, bulk: item.bulk, sourceBook: item.sourceBook, dr: item.dr ?? null, resistances: item.resistances ?? null });
    setN({ itemLevel: String(item.itemLevel), price: String(item.price), eacBonus: String(item.eacBonus), kacBonus: String(item.kacBonus), armorCheckPenalty: String(item.armorCheckPenalty), speedAdjustment: String(item.speedAdjustment), upgradeSlots: String(item.upgradeSlots) });
    setError(null); setModalOpen(true);
  }

  function buildFormData(): ArmorFormData {
    return {
      ...f,
      itemLevel: parseInt(n.itemLevel) || 0,
      price: parseInt(n.price) || 0,
      eacBonus: parseInt(n.eacBonus) || 0,
      kacBonus: parseInt(n.kacBonus) || 0,
      armorCheckPenalty: parseInt(n.armorCheckPenalty) || 0,
      speedAdjustment: parseInt(n.speedAdjustment) || 0,
      upgradeSlots: parseInt(n.upgradeSlots) || 0,
    };
  }

  async function handleSubmit() {
    if (!f.name.trim()) { setError("Name is required."); return; }
    const data = buildFormData();
    setSubmitting(true);
    if (editing) {
      const result = await updateArmor(editing.id, data);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i));
    } else {
      const result = await createArmor(edition.id, data);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setItems((prev) => [...prev, result.data!]);
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
            <Input value={f.name} onChange={(e) => setStr("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Type</Label>
            <Select value={f.type} onValueChange={(v) => setStr("type", v as ArmorType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ARMOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Item Level</Label>
            <Input type="number" value={n.itemLevel} onChange={(e) => setNum("itemLevel", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Price (credits)</Label>
            <Input type="number" value={n.price} onChange={(e) => setNum("price", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Bulk</Label>
            <Input value={f.bulk} onChange={(e) => setStr("bulk", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>EAC Bonus</Label>
            <Input type="number" value={n.eacBonus} onChange={(e) => setNum("eacBonus", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>KAC Bonus</Label>
            <Input type="number" value={n.kacBonus} onChange={(e) => setNum("kacBonus", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Max Dex Bonus</Label>
            <Input type="number" value={f.maxDexBonus ?? ""} onChange={(e) => setStr("maxDexBonus", e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Armor Check Penalty</Label>
            <Input type="number" value={n.armorCheckPenalty} onChange={(e) => setNum("armorCheckPenalty", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Speed Adjustment</Label>
            <Input type="number" value={n.speedAdjustment} onChange={(e) => setNum("speedAdjustment", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Upgrade Slots</Label>
            <Input type="number" value={n.upgradeSlots} onChange={(e) => setNum("upgradeSlots", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Source Book</Label>
            <Input value={f.sourceBook} onChange={(e) => setStr("sourceBook", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>DR (optional)</Label>
            <Input value={f.dr ?? ""} onChange={(e) => setStr("dr", e.target.value || null)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Resistances (optional)</Label>
            <Input value={f.resistances ?? ""} onChange={(e) => setStr("resistances", e.target.value || null)} />
          </div>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
