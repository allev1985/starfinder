"use client";

import { useState } from "react";
import { useSortable } from "../_components/use-sortable";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "../_components/data-table";
import { EntityModal } from "../_components/entity-modal";
import { ConfirmDeleteDialog } from "../_components/confirm-delete-dialog";
import { ExpandableRow } from "../_components/expandable-row";
import { ClassSubPanel } from "./_class-sub-panel";
import {
  createClass, updateClass, deleteClass,
} from "@/db/queries/admin-classes";
import type { Class, Skill, Edition } from "@/db/schema";

interface ClassesClientProps {
  edition: Edition;
  initialClasses: Class[];
  allSkills: Skill[];
}

export function ClassesClient({ edition, initialClasses, allSkills }: ClassesClientProps) {
  const [classes, setClasses] = useState(initialClasses);
  const { sorted: sortedClasses, sortState, toggleSort } = useSortable<(typeof classes)[0], "name" | "skillRanksPerLevel" | "isSpellcaster">(classes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [name, setName] = useState("");
  const [skillRanks, setSkillRanks] = useState("4");
  const [isSpellcaster, setIsSpellcaster] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Class | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null); setName(""); setSkillRanks("4"); setIsSpellcaster(false); setError(null);
    setModalOpen(true);
  }

  function openEdit(cls: Class) {
    setEditing(cls); setName(cls.name); setSkillRanks(String(cls.skillRanksPerLevel)); setIsSpellcaster(cls.isSpellcaster); setError(null);
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (!name.trim()) { setError("Name is required."); return; }
    const ranks = parseInt(skillRanks, 10);
    if (isNaN(ranks) || ranks < 0) { setError("Skill ranks must be a non-negative integer."); return; }
    setSubmitting(true);
    const data = { name: name.trim(), skillRanksPerLevel: ranks, isSpellcaster };
    if (editing) {
      const result = await updateClass(editing.id, data);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      setClasses((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...data } : c));
    } else {
      const result = await createClass(edition.id, data);
      setSubmitting(false);
      if (result.error) { setError(result.error); return; }
      if (result.data) setClasses((prev) => [...prev, result.data!]);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteClass(deleteTarget.id);
    if (result.error) { setDeleteError(result.error); return; }
    setClasses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const colCount = 6; // chevron + name + ranks + spellcaster + actions

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>Classes</h1>
        <Button onClick={openAdd}>+ Add Class</Button>
      </div>

      <DataTable
        columns={[
          "",
          { label: "Name", sortKey: "name" },
          { label: "Skill Ranks/Lvl", sortKey: "skillRanksPerLevel" },
          { label: "Spellcaster", sortKey: "isSpellcaster" },
          "Actions",
        ]}
        isEmpty={classes.length === 0}
        empty="No classes yet."
        sortState={sortState}
        onSort={toggleSort}
      >
        {sortedClasses.map((cls) => (
          <ExpandableRow
            key={cls.id}
            colSpan={colCount}
            cells={
              <>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.skillRanksPerLevel}</TableCell>
                <TableCell>{cls.isSpellcaster ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(cls)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => { setDeleteTarget(cls); setDeleteError(null); }}>Delete</Button>
                  </div>
                </TableCell>
              </>
            }
            panel={
              <Tabs defaultValue="skills">
                <TabsList>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="abilities">Abilities</TabsTrigger>
                  <TabsTrigger value="proficiencies">Proficiencies</TabsTrigger>
                </TabsList>
                <TabsContent value="skills"><ClassSubPanel classId={cls.id} editionId={edition.id} tab="skills" allSkills={allSkills} /></TabsContent>
                <TabsContent value="abilities"><ClassSubPanel classId={cls.id} editionId={edition.id} tab="abilities" allSkills={allSkills} /></TabsContent>
                <TabsContent value="proficiencies"><ClassSubPanel classId={cls.id} editionId={edition.id} tab="proficiencies" allSkills={allSkills} /></TabsContent>
              </Tabs>
            }
          />
        ))}
      </DataTable>

      <EntityModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Class" : "Add Class"}
        onSubmit={handleSubmit} submitting={submitting} error={error}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="class-name">Name</Label>
          <Input id="class-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="class-ranks">Skill Ranks per Level</Label>
          <Input id="class-ranks" type="number" min={0} value={skillRanks} onChange={(e) => setSkillRanks(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="spellcaster" checked={isSpellcaster} onCheckedChange={(v) => setIsSpellcaster(!!v)} />
          <Label htmlFor="spellcaster">Is Spellcaster</Label>
        </div>
      </EntityModal>

      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(null); } }}
        onConfirm={handleDelete} label={deleteTarget?.name ?? ""} error={deleteError} />
    </>
  );
}
