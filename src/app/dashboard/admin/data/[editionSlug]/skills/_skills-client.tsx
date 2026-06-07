"use client";

import { useState } from "react";
import { useSortable } from "../_components/use-sortable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { createSkill, updateSkill, deleteSkill } from "@/db/queries/admin-skills";
import type { Skill, Edition } from "@/db/schema";

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];

interface SkillsClientProps {
  edition: Edition;
  initialSkills: Skill[];
}

export function SkillsClient({ edition, initialSkills }: SkillsClientProps) {
  const [skills, setSkills] = useState(initialSkills);
  const { sorted: sortedSkills, sortState, toggleSort } = useSortable<(typeof skills)[0], "name" | "ability" | "trainedOnly" | "armorCheckPenalty">(skills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [name, setName] = useState("");
  const [ability, setAbility] = useState("int");
  const [abilityAlts, setAbilityAlts] = useState("");
  const [trainedOnly, setTrainedOnly] = useState(false);
  const [armorCheckPenalty, setArmorCheckPenalty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setName(""); setAbility("int"); setAbilityAlts(""); setTrainedOnly(false); setArmorCheckPenalty(false);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditing(skill);
    setName(skill.name);
    setAbility(skill.ability);
    setAbilityAlts(skill.abilityAlts?.join(", ") ?? "");
    setTrainedOnly(skill.trainedOnly);
    setArmorCheckPenalty(skill.armorCheckPenalty);
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (!name.trim()) { setError("Name is required."); return; }
    setSubmitting(true);
    const alts = abilityAlts.trim() ? abilityAlts.split(",").map((s) => s.trim()).filter(Boolean) : null;
    const data = { name: name.trim(), ability, abilityAlts: alts, trainedOnly, armorCheckPenalty };
    const result = editing ? await updateSkill(editing.id, data) : await createSkill(edition.id, data);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    if (editing) {
      setSkills((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...data } : s));
    } else {
      setSkills((prev) => [...prev, { id: crypto.randomUUID(), editionId: edition.id, ...data }]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteSkill(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Skills</h1>
        <Button onClick={openAdd}>+ Add Skill</Button>
      </div>

      <DataTable
        columns={[
          { label: "Name", sortKey: "name" },
          { label: "Ability", sortKey: "ability" },
          { label: "Trained Only", sortKey: "trainedOnly" },
          { label: "ACP", sortKey: "armorCheckPenalty" },
          "Actions",
        ]}
        isEmpty={skills.length === 0}
        empty="No skills yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sortedSkills.map((skill) => (
          <TableRow key={skill.id}>
            <TableCell>{skill.name}</TableCell>
            <TableCell style={{ textTransform: "uppercase" }}>{skill.ability}</TableCell>
            <TableCell>{skill.trainedOnly ? "Yes" : "No"}</TableCell>
            <TableCell>{skill.armorCheckPenalty ? "Yes" : "No"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(skill)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(skill); setDeleteError(null); }}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Skill" : "Add Skill"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="skill-name">Name</Label>
          <Input id="skill-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Key Ability</Label>
          <Select value={ability} onValueChange={(v) => { if (v) setAbility(v); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ABILITIES.map((a) => <SelectItem key={a} value={a}>{a.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="skill-alts">Ability Alternates (optional, comma-separated)</Label>
          <Input id="skill-alts" value={abilityAlts} onChange={(e) => setAbilityAlts(e.target.value)} placeholder="e.g. str, dex" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="trained-only" checked={trainedOnly} onCheckedChange={(v) => setTrainedOnly(!!v)} />
          <Label htmlFor="trained-only">Trained Only</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="acp" checked={armorCheckPenalty} onCheckedChange={(v) => setArmorCheckPenalty(!!v)} />
          <Label htmlFor="acp">Armor Check Penalty</Label>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
