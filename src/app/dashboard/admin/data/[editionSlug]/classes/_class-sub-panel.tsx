"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  listClassSkillIds, setClassSkill,
  listClassAbilities, createClassAbility, updateClassAbility, deleteClassAbility,
  listClassArmorProficiencies, setClassArmorProficiency,
  listClassWeaponProficiencies, setClassWeaponProficiency,
  getClassShieldProficiency, setClassShieldProficiency,
} from "@/db/queries/admin-classes";
import type { Skill, ClassAbility, ArmorType, WeaponCategory } from "@/db/schema";

const ARMOR_TYPES: ArmorType[] = ["light", "heavy", "powered"];
const WEAPON_CATEGORIES: WeaponCategory[] = [
  "small_arms", "longarms", "heavy", "sniper",
  "melee_basic", "melee_advanced", "grenade", "special",
];

interface ClassSubPanelProps {
  classId: string;
  editionId: string;
  tab: "skills" | "abilities" | "proficiencies";
  allSkills: Skill[];
}

export function ClassSubPanel({ classId, editionId, tab, allSkills }: ClassSubPanelProps) {
  if (tab === "skills") return <SkillsTab classId={classId} allSkills={allSkills} />;
  if (tab === "abilities") return <AbilitiesTab classId={classId} editionId={editionId} />;
  return <ProficienciesTab classId={classId} />;
}

function SkillsTab({ classId, allSkills }: { classId: string; allSkills: Skill[] }) {
  const [classSkillIds, setClassSkillIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listClassSkillIds(classId).then((ids) => { setClassSkillIds(new Set(ids)); setLoaded(true); });
  }, [classId]);

  async function toggle(skillId: string, checked: boolean) {
    setClassSkillIds((prev) => { const next = new Set(prev); if (checked) { next.add(skillId); } else { next.delete(skillId); } return next; });
    await setClassSkill(classId, skillId, checked);
  }

  if (!loaded) return <p className="text-sm py-3" style={{ color: "var(--text-2)" }}>Loading…</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3">
      {allSkills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-2">
          <Checkbox
            id={`cs-${classId}-${skill.id}`}
            checked={classSkillIds.has(skill.id)}
            onCheckedChange={(v) => toggle(skill.id, !!v)}
          />
          <Label htmlFor={`cs-${classId}-${skill.id}`} className="cursor-pointer">{skill.name}</Label>
        </div>
      ))}
    </div>
  );
}

function AbilitiesTab({ classId, editionId }: { classId: string; editionId: string }) {
  const [abilities, setAbilities] = useState<ClassAbility[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", level: "1", repeatable: false, choicePool: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listClassAbilities(classId).then((rows) => { setAbilities(rows); setLoaded(true); });
  }, [classId]);

  function openAdd() { setEditingId(null); setForm({ name: "", description: "", level: "1", repeatable: false, choicePool: "" }); setShowForm(true); }
  function openEdit(a: ClassAbility) { setEditingId(a.id); setForm({ name: a.name, description: a.description, level: String(a.level), repeatable: a.repeatable, choicePool: a.choicePool ?? "" }); setShowForm(true); }

  async function handleSubmit() {
    const data = { name: form.name.trim(), description: form.description.trim(), level: parseInt(form.level, 10), repeatable: form.repeatable, choicePool: form.choicePool.trim() || null };
    if (!data.name || isNaN(data.level)) return;
    setSubmitting(true);
    if (editingId) {
      await updateClassAbility(editingId, data);
      setAbilities((prev) => prev.map((a) => a.id === editingId ? { ...a, ...data } : a));
    } else {
      await createClassAbility(classId, editionId, data);
      const refreshed = await listClassAbilities(classId);
      setAbilities(refreshed);
    }
    setSubmitting(false);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    await deleteClassAbility(id);
    setAbilities((prev) => prev.filter((a) => a.id !== id));
  }

  if (!loaded) return <p className="text-sm py-3" style={{ color: "var(--text-2)" }}>Loading…</p>;

  return (
    <div className="pt-3 flex flex-col gap-3">
      {abilities.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Lvl</TableHead>
              <TableHead>Repeatable</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abilities.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.level}</TableCell>
                <TableCell>{a.repeatable ? "Yes" : "No"}</TableCell>
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
          <div className="flex flex-col gap-1">
            <Label>Choice Pool (optional)</Label>
            <Input value={form.choicePool} onChange={(e) => setForm((f) => ({ ...f, choicePool: e.target.value }))} placeholder="pool name" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id={`rep-${classId}`} checked={form.repeatable} onCheckedChange={(v) => setForm((f) => ({ ...f, repeatable: !!v }))} />
            <Label htmlFor={`rep-${classId}`}>Repeatable</Label>
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

function ProficienciesTab({ classId }: { classId: string }) {
  const [armorProfs, setArmorProfs] = useState<Set<ArmorType>>(new Set());
  const [weaponProfs, setWeaponProfs] = useState<Set<WeaponCategory>>(new Set());
  const [shieldProf, setShieldProf] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      listClassArmorProficiencies(classId),
      listClassWeaponProficiencies(classId),
      getClassShieldProficiency(classId),
    ]).then(([armor, weapon, shield]) => {
      setArmorProfs(new Set(armor));
      setWeaponProfs(new Set(weapon));
      setShieldProf(shield);
      setLoaded(true);
    });
  }, [classId]);

  async function toggleArmor(type: ArmorType, checked: boolean) {
    setArmorProfs((prev) => { const next = new Set(prev); if (checked) { next.add(type); } else { next.delete(type); } return next; });
    await setClassArmorProficiency(classId, type, checked);
  }

  async function toggleWeapon(cat: WeaponCategory, checked: boolean) {
    setWeaponProfs((prev) => { const next = new Set(prev); if (checked) { next.add(cat); } else { next.delete(cat); } return next; });
    await setClassWeaponProficiency(classId, cat, checked);
  }

  async function toggleShield(checked: boolean) {
    setShieldProf(checked);
    await setClassShieldProficiency(classId, checked);
  }

  if (!loaded) return <p className="text-sm py-3" style={{ color: "var(--text-2)" }}>Loading…</p>;

  return (
    <div className="pt-3 flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-1)" }}>Armor</p>
        <div className="flex gap-4">
          {ARMOR_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`armor-${classId}-${type}`}
                checked={armorProfs.has(type)}
                onCheckedChange={(v) => toggleArmor(type, !!v)}
              />
              <Label htmlFor={`armor-${classId}-${type}`} className="cursor-pointer capitalize">{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-1)" }}>Shields</p>
        <div className="flex items-center gap-2">
          <Checkbox id={`shield-${classId}`} checked={shieldProf} onCheckedChange={(v) => toggleShield(!!v)} />
          <Label htmlFor={`shield-${classId}`} className="cursor-pointer">Shield Proficiency</Label>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-1)" }}>Weapons</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEAPON_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`weapon-${classId}-${cat}`}
                checked={weaponProfs.has(cat)}
                onCheckedChange={(v) => toggleWeapon(cat, !!v)}
              />
              <Label htmlFor={`weapon-${classId}-${cat}`} className="cursor-pointer text-xs">{cat.replace(/_/g, " ")}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
