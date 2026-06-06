"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Spaceship, SpaceshipWeapon, SpaceshipNote, Character, SpaceshipCrew } from "@/db/schema";
import { updateSpaceshipAction, createWeaponAction, deleteWeaponAction, createSpaceshipNoteAction, updateSpaceshipNoteAction, deleteSpaceshipNoteAction } from "./actions";
import CrewSection from "./_crew-section";

type DamageState = "glitching" | "malfunctioning" | "wrecked" | null;
const DAMAGE_STATES: { value: Exclude<DamageState, null>; label: string }[] = [
  { value: "glitching", label: "Glitching" },
  { value: "malfunctioning", label: "Malfunctioning" },
  { value: "wrecked", label: "Wrecked" },
];

function DamageStatus({ value, onChange }: { value: DamageState; onChange: (v: DamageState) => void }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {DAMAGE_STATES.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(value === v ? null : v)}
          className={[
            "px-2 py-0.5 rounded text-xs border transition-colors",
            value === v
              ? "bg-destructive text-destructive-foreground border-destructive"
              : "bg-background text-muted-foreground border-border hover:border-foreground",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const SECTIONS = [
  { key: "systems", label: "Systems" },
  { key: "expansion_bays", label: "Expansion Bays" },
  { key: "cargo_passengers", label: "Cargo / Passengers" },
  { key: "notes", label: "Notes" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

type Props = {
  campaignId: string;
  spaceship: Spaceship;
  weapons: SpaceshipWeapon[];
  notes: SpaceshipNote[];
  characters: Character[];
  initialCrew: SpaceshipCrew[];
};

type TextField = "name" | "makeAndModel" | "tier" | "maneuverability" | "speed" | "size" | "frame" | "powerCoreName" | "driftEngine";
type SimpleNumField =
  | "pilotRank" | "sizeMod" | "armorBonus" | "acMiscMod" | "countermeasures" | "tlMiscMod"
  | "damageThreshold" | "criticalThreshold" | "shieldRegenPerMin" | "shieldMiscMod";
type TotalField =
  | "hullTotal" | "shieldForwardTotal" | "shieldPortTotal" | "shieldStarboardTotal" | "shieldAftTotal";
type CurrentField =
  | "hullCurrent" | "shieldForwardCurrent" | "shieldPortCurrent" | "shieldStarboardCurrent" | "shieldAftCurrent";
type NumField = SimpleNumField | TotalField | CurrentField;

type FieldPair = { total: TotalField; current: CurrentField };

const PAIRED_FIELDS: FieldPair[] = [
  { total: "hullTotal", current: "hullCurrent" },
  { total: "shieldForwardTotal", current: "shieldForwardCurrent" },
  { total: "shieldPortTotal", current: "shieldPortCurrent" },
  { total: "shieldStarboardTotal", current: "shieldStarboardCurrent" },
  { total: "shieldAftTotal", current: "shieldAftCurrent" },
];

const TEXT_FIELDS: { field: TextField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "makeAndModel", label: "Make and Model" },
  { field: "tier", label: "Tier" },
  { field: "maneuverability", label: "Maneuverability" },
  { field: "speed", label: "Speed" },
  { field: "size", label: "Size" },
  { field: "frame", label: "Frame" },
];

const ARCS = ["forward", "port", "starboard", "aft", "turret"] as const;
type Arc = (typeof ARCS)[number];
const ARC_LABELS: Record<Arc, string> = {
  forward: "Forward",
  port: "Port",
  starboard: "Starboard",
  aft: "Aft",
  turret: "Turret",
};

type DamageField =
  | "lifeSupportDamage" | "sensorsDamage" | "enginesDamage" | "powerCoreDamage"
  | "weaponsForwardDamage" | "weaponsPortDamage" | "weaponsStarboardDamage" | "weaponsAftDamage";

type WeaponForm = { name: string; damage: string; range: string; special: string };
const EMPTY_FORM: WeaponForm = { name: "", damage: "", range: "", special: "" };

export default function SpaceshipEditor({ campaignId, spaceship, weapons: initialWeapons, notes: initialNotes, characters, initialCrew }: Props) {
  const textTimers = useRef<Partial<Record<TextField, ReturnType<typeof setTimeout>>>>({});
  const numTimers = useRef<Partial<Record<NumField, ReturnType<typeof setTimeout>>>>({});
  const pcuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [textValues, setTextValues] = useState<Record<TextField, string>>(() => ({
    name: spaceship.name ?? "",
    makeAndModel: spaceship.makeAndModel ?? "",
    tier: spaceship.tier ?? "",
    maneuverability: spaceship.maneuverability ?? "",
    speed: spaceship.speed ?? "",
    size: spaceship.size ?? "",
    frame: spaceship.frame ?? "",
    powerCoreName: spaceship.powerCoreName ?? "",
    driftEngine: spaceship.driftEngine ?? "",
  }));
  const [powerCorePcu, setPowerCorePcu] = useState<number | null>(spaceship.powerCorePcu);
  const [driftRating, setDriftRating] = useState(spaceship.driftRating);
  const [pilotRank, setPilotRank] = useState(spaceship.pilotRank);
  const [sizeMod, setSizeMod] = useState(spaceship.sizeMod);
  const [armorBonus, setArmorBonus] = useState(spaceship.armorBonus);
  const [acMiscMod, setAcMiscMod] = useState(spaceship.acMiscMod);
  const [countermeasures, setCountermeasures] = useState(spaceship.countermeasures);
  const [tlMiscMod, setTlMiscMod] = useState(spaceship.tlMiscMod);
  const [hullTotal, setHullTotal] = useState(spaceship.hullTotal);
  const [hullCurrent, setHullCurrent] = useState<number | null>(spaceship.hullCurrent);
  const [damageThreshold, setDamageThreshold] = useState(spaceship.damageThreshold);
  const [criticalThreshold, setCriticalThreshold] = useState(spaceship.criticalThreshold);
  const [shieldForwardTotal, setShieldForwardTotal] = useState(spaceship.shieldForwardTotal);
  const [shieldForwardCurrent, setShieldForwardCurrent] = useState<number | null>(spaceship.shieldForwardCurrent);
  const [shieldPortTotal, setShieldPortTotal] = useState(spaceship.shieldPortTotal);
  const [shieldPortCurrent, setShieldPortCurrent] = useState<number | null>(spaceship.shieldPortCurrent);
  const [shieldStarboardTotal, setShieldStarboardTotal] = useState(spaceship.shieldStarboardTotal);
  const [shieldStarboardCurrent, setShieldStarboardCurrent] = useState<number | null>(spaceship.shieldStarboardCurrent);
  const [shieldAftTotal, setShieldAftTotal] = useState(spaceship.shieldAftTotal);
  const [shieldAftCurrent, setShieldAftCurrent] = useState<number | null>(spaceship.shieldAftCurrent);
  const [shieldRegenPerMin, setShieldRegenPerMin] = useState(spaceship.shieldRegenPerMin);
  const [shieldMiscMod, setShieldMiscMod] = useState(spaceship.shieldMiscMod);

  const [damageValues, setDamageValues] = useState<Record<DamageField, DamageState>>({
    lifeSupportDamage: (spaceship.lifeSupportDamage as DamageState) ?? null,
    sensorsDamage: (spaceship.sensorsDamage as DamageState) ?? null,
    enginesDamage: (spaceship.enginesDamage as DamageState) ?? null,
    powerCoreDamage: (spaceship.powerCoreDamage as DamageState) ?? null,
    weaponsForwardDamage: (spaceship.weaponsForwardDamage as DamageState) ?? null,
    weaponsPortDamage: (spaceship.weaponsPortDamage as DamageState) ?? null,
    weaponsStarboardDamage: (spaceship.weaponsStarboardDamage as DamageState) ?? null,
    weaponsAftDamage: (spaceship.weaponsAftDamage as DamageState) ?? null,
  });

  const [weapons, setWeapons] = useState<SpaceshipWeapon[]>(initialWeapons);
  const [notes, setNotes] = useState<SpaceshipNote[]>(initialNotes);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [noteForms, setNoteForms] = useState<Record<SectionKey, string>>({
    systems: "",
    expansion_bays: "",
    cargo_passengers: "",
    notes: "",
  });

  const [weaponForms, setWeaponForms] = useState<Record<Arc, WeaponForm>>({
    forward: { ...EMPTY_FORM },
    port: { ...EMPTY_FORM },
    starboard: { ...EMPTY_FORM },
    aft: { ...EMPTY_FORM },
    turret: { ...EMPTY_FORM },
  });

  const ac = 10 + pilotRank + armorBonus + sizeMod + acMiscMod;
  const tl = 10 + pilotRank + countermeasures + sizeMod + tlMiscMod;
  const shieldTotalValue = shieldForwardTotal + shieldPortTotal + shieldStarboardTotal + shieldAftTotal + shieldMiscMod;
  const shieldCurrentValue =
    (shieldForwardCurrent ?? shieldForwardTotal) +
    (shieldPortCurrent ?? shieldPortTotal) +
    (shieldStarboardCurrent ?? shieldStarboardTotal) +
    (shieldAftCurrent ?? shieldAftTotal);

  const totals: Record<TotalField, number> = {
    hullTotal, shieldForwardTotal, shieldPortTotal, shieldStarboardTotal, shieldAftTotal,
  };
  const currents: Record<CurrentField, number | null> = {
    hullCurrent, shieldForwardCurrent, shieldPortCurrent, shieldStarboardCurrent, shieldAftCurrent,
  };
  const currentSetters: Record<CurrentField, (v: number | null) => void> = {
    hullCurrent: setHullCurrent,
    shieldForwardCurrent: setShieldForwardCurrent,
    shieldPortCurrent: setShieldPortCurrent,
    shieldStarboardCurrent: setShieldStarboardCurrent,
    shieldAftCurrent: setShieldAftCurrent,
  };
  const simpleSetters: Record<SimpleNumField, (v: number) => void> = {
    pilotRank: setPilotRank, sizeMod: setSizeMod, armorBonus: setArmorBonus,
    acMiscMod: setAcMiscMod, countermeasures: setCountermeasures, tlMiscMod: setTlMiscMod,
    damageThreshold: setDamageThreshold, criticalThreshold: setCriticalThreshold,
    shieldRegenPerMin: setShieldRegenPerMin, shieldMiscMod: setShieldMiscMod,
  };
  const totalSetters: Record<TotalField, (v: number) => void> = {
    hullTotal: setHullTotal, shieldForwardTotal: setShieldForwardTotal,
    shieldPortTotal: setShieldPortTotal, shieldStarboardTotal: setShieldStarboardTotal,
    shieldAftTotal: setShieldAftTotal,
  };

  function scheduleCurrentUpdate(field: CurrentField, value: number | null) {
    if (numTimers.current[field]) clearTimeout(numTimers.current[field]);
    numTimers.current[field] = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { [field]: value });
    }, 600);
  }

  function scheduleNumUpdate(field: NumField, value: number) {
    if (numTimers.current[field]) clearTimeout(numTimers.current[field]);
    numTimers.current[field] = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { [field]: value });
    }, 600);
  }

  function handleTextChange(field: TextField, value: string) {
    setTextValues((prev) => ({ ...prev, [field]: value }));
    if (textTimers.current[field]) clearTimeout(textTimers.current[field]);
    textTimers.current[field] = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { [field]: value || null });
    }, 600);
  }

  function handleSimpleChange(field: SimpleNumField, raw: string) {
    const next = parseInt(raw, 10);
    const val = isNaN(next) ? 0 : next;
    simpleSetters[field](val);
    scheduleNumUpdate(field, val);
  }

  function handleTotalChange(field: TotalField, raw: string) {
    const next = parseInt(raw, 10);
    const nextTotal = isNaN(next) ? 0 : next;
    const prevTotal = totals[field];
    const delta = nextTotal - prevTotal;
    totalSetters[field](nextTotal);
    scheduleNumUpdate(field, nextTotal);

    const pair = PAIRED_FIELDS.find((p) => p.total === field)!;
    const rawCurrent = currents[pair.current];
    if (rawCurrent !== null) {
      const adjusted = Math.max(0, Math.min(rawCurrent + delta, nextTotal));
      const saveVal = adjusted >= nextTotal ? null : adjusted;
      currentSetters[pair.current](saveVal);
      scheduleCurrentUpdate(pair.current, saveVal);
    }
  }

  function handleCurrentChange(field: CurrentField, raw: string) {
    const pair = PAIRED_FIELDS.find((p) => p.current === field)!;
    const total = totals[pair.total];
    const next = parseInt(raw, 10);
    const val = isNaN(next) ? 0 : Math.max(0, Math.min(next, total));
    const saveVal = val >= total ? null : val;
    currentSetters[field](saveVal);
    scheduleCurrentUpdate(field, saveVal);
  }

  async function changeDrift(next: number) {
    if (next < 0) return;
    setDriftRating(next);
    await updateSpaceshipAction(campaignId, spaceship.id, { driftRating: next });
  }

  function handlePcuChange(raw: string) {
    const next = parseInt(raw, 10);
    const val = isNaN(next) ? null : next;
    setPowerCorePcu(val);
    if (pcuTimer.current) clearTimeout(pcuTimer.current);
    pcuTimer.current = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { powerCorePcu: val });
    }, 600);
  }

  async function handleDamageChange(field: DamageField, value: DamageState) {
    setDamageValues((prev) => ({ ...prev, [field]: value }));
    await updateSpaceshipAction(campaignId, spaceship.id, { [field]: value });
  }

  function startEditingNote(note: SpaceshipNote) {
    setEditingNoteId(note.id);
    setEditingNoteText(note.note);
  }

  async function commitNoteEdit(noteId: string) {
    const text = editingNoteText.trim();
    if (!text) return;
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, note: text } : n)));
    setEditingNoteId(null);
    await updateSpaceshipNoteAction(campaignId, noteId, text);
  }

  function cancelNoteEdit() {
    setEditingNoteId(null);
    setEditingNoteText("");
  }

  async function handleAddNote(section: SectionKey) {
    const text = noteForms[section].trim();
    if (!text) return;
    const result = await createSpaceshipNoteAction(campaignId, spaceship.id, section, text);
    if (result.success) {
      setNotes((prev) => [...prev, result.note]);
      setNoteForms((prev) => ({ ...prev, [section]: "" }));
    }
  }

  async function handleDeleteNote(noteId: string) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    await deleteSpaceshipNoteAction(campaignId, noteId);
  }

  function updateWeaponForm(arc: Arc, patch: Partial<WeaponForm>) {
    setWeaponForms((prev) => ({ ...prev, [arc]: { ...prev[arc], ...patch } }));
  }

  async function handleAddWeapon(arc: Arc) {
    const form = weaponForms[arc];
    if (!form.name.trim()) return;
    const result = await createWeaponAction(campaignId, spaceship.id, {
      arc,
      name: form.name.trim(),
      damage: form.damage.trim() || undefined,
      range: form.range.trim() || undefined,
      special: form.special.trim() || undefined,
    });
    if (result.success) {
      setWeapons((prev) => [...prev, result.weapon]);
      setWeaponForms((prev) => ({ ...prev, [arc]: { ...EMPTY_FORM } }));
    }
  }

  async function handleDeleteWeapon(weaponId: string) {
    setWeapons((prev) => prev.filter((w) => w.id !== weaponId));
    await deleteWeaponAction(campaignId, weaponId);
  }

  function shieldCell(
    label: string,
    totalField: TotalField,
    currentField: CurrentField,
  ) {
    const total = totals[totalField];
    const displayCurrent = currents[currentField] ?? total;
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground w-3">T</span>
            <Input
              type="number"
              value={total}
              onChange={(e) => handleTotalChange(totalField, e.target.value)}
              className="w-16 text-center h-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground w-3">C</span>
            <Input
              type="number"
              value={displayCurrent}
              onChange={(e) => handleCurrentChange(currentField, e.target.value)}
              className="w-16 text-center h-8 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      {TEXT_FIELDS.map(({ field, label }) => (
        <div key={field} className="flex flex-col gap-1.5">
          <Label htmlFor={`ship-${field}`}>{label}</Label>
          <Input
            id={`ship-${field}`}
            value={textValues[field]}
            onChange={(e) => handleTextChange(field, e.target.value)}
          />
        </div>
      ))}

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="ship-powerCoreName">Power Core</Label>
          <Input
            id="ship-powerCoreName"
            value={textValues.powerCoreName}
            onChange={(e) => handleTextChange("powerCoreName", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <Label htmlFor="ship-powerCorePcu">PCU</Label>
          <Input
            id="ship-powerCorePcu"
            type="number"
            value={powerCorePcu ?? ""}
            onChange={(e) => handlePcuChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="ship-driftEngine">Drift Engine</Label>
          <Input
            id="ship-driftEngine"
            value={textValues.driftEngine}
            onChange={(e) => handleTextChange("driftEngine", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Drift Rating</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeDrift(driftRating - 1)}
              disabled={driftRating <= 0}
              aria-label="Decrease drift rating"
            >
              −
            </Button>
            <span className="w-6 text-center text-sm font-medium">{driftRating}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeDrift(driftRating + 1)}
              aria-label="Increase drift rating"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold mb-4">Defensive Scores</h2>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-pilotRank">Pilot Rank</Label>
            <Input
              id="ship-pilotRank"
              type="number"
              value={pilotRank}
              onChange={(e) => handleSimpleChange("pilotRank", e.target.value)}
              className="w-24"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-sizeMod">Size Mod</Label>
            <Input
              id="ship-sizeMod"
              type="number"
              value={sizeMod}
              onChange={(e) => handleSimpleChange("sizeMod", e.target.value)}
              className="w-24"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AC</div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-armorBonus">Armor Bonus</Label>
              <Input
                id="ship-armorBonus"
                type="number"
                value={armorBonus}
                onChange={(e) => handleSimpleChange("armorBonus", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-acMiscMod">Misc Mod</Label>
              <Input
                id="ship-acMiscMod"
                type="number"
                value={acMiscMod}
                onChange={(e) => handleSimpleChange("acMiscMod", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold">{ac}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">TL</div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-countermeasures">Countermeasures</Label>
              <Input
                id="ship-countermeasures"
                type="number"
                value={countermeasures}
                onChange={(e) => handleSimpleChange("countermeasures", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-tlMiscMod">Misc Mod</Label>
              <Input
                id="ship-tlMiscMod"
                type="number"
                value={tlMiscMod}
                onChange={(e) => handleSimpleChange("tlMiscMod", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold">{tl}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold mb-4">Hull Points</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-hullTotal">Total</Label>
            <Input
              id="ship-hullTotal"
              type="number"
              value={hullTotal}
              onChange={(e) => handleTotalChange("hullTotal", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-hullCurrent">Current</Label>
            <Input
              id="ship-hullCurrent"
              type="number"
              value={hullCurrent ?? hullTotal}
              onChange={(e) => handleCurrentChange("hullCurrent", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-damageThreshold">Damage Threshold</Label>
            <Input
              id="ship-damageThreshold"
              type="number"
              value={damageThreshold}
              onChange={(e) => handleSimpleChange("damageThreshold", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-criticalThreshold">Critical Threshold</Label>
            <Input
              id="ship-criticalThreshold"
              type="number"
              value={criticalThreshold}
              onChange={(e) => handleSimpleChange("criticalThreshold", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold mb-4">Shields</h2>
        <div className="flex flex-col items-center gap-3 mb-4">
          {shieldCell("Forward", "shieldForwardTotal", "shieldForwardCurrent")}
          <div className="flex items-center gap-4">
            {shieldCell("Port", "shieldPortTotal", "shieldPortCurrent")}
            <div className="w-10 h-10 rounded bg-muted" />
            {shieldCell("Starboard", "shieldStarboardTotal", "shieldStarboardCurrent")}
          </div>
          {shieldCell("Aft", "shieldAftTotal", "shieldAftCurrent")}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-3">
          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">Total <span className="font-bold text-foreground">{shieldTotalValue}</span></span>
            <span className="text-muted-foreground">Current <span className="font-bold text-foreground">{shieldCurrentValue}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="ship-shieldMiscMod" className="text-xs">Misc Mod</Label>
              <Input
                id="ship-shieldMiscMod"
                type="number"
                value={shieldMiscMod}
                onChange={(e) => handleSimpleChange("shieldMiscMod", e.target.value)}
                className="w-20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="ship-shieldRegenPerMin" className="text-xs">Regen/min</Label>
              <Input
                id="ship-shieldRegenPerMin"
                type="number"
                value={shieldRegenPerMin}
                onChange={(e) => handleSimpleChange("shieldRegenPerMin", e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold mb-4">Critical Damage</h2>
        <div className="flex flex-col gap-3">
          {(
            [
              { field: "lifeSupportDamage", label: "Life Support" },
              { field: "sensorsDamage", label: "Sensors" },
            ] as { field: DamageField; label: string }[]
          ).map(({ field, label }) => (
            <div key={field} className="flex items-center gap-4">
              <span className="text-sm w-28 shrink-0">{label}</span>
              <DamageStatus
                value={damageValues[field]}
                onChange={(v) => handleDamageChange(field, v)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold mb-4">Weapons</h2>
        <div className="flex flex-col gap-3 mb-6">
          {(
            [
              { field: "enginesDamage", label: "Engines" },
              { field: "powerCoreDamage", label: "Power Core" },
            ] as { field: DamageField; label: string }[]
          ).map(({ field, label }) => (
            <div key={field} className="flex items-center gap-4">
              <span className="text-sm w-28 shrink-0">{label}</span>
              <DamageStatus
                value={damageValues[field]}
                onChange={(v) => handleDamageChange(field, v)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {ARCS.map((arc) => {
            const arcWeapons = weapons.filter((w) => w.arc === arc);
            const form = weaponForms[arc];
            return (
              <div key={arc}>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  {ARC_LABELS[arc]}
                </div>
                {arcWeapons.length > 0 && (
                  <div className="flex flex-col gap-1 mb-3">
                    {arcWeapons.map((w) => (
                      <div key={w.id} className="flex items-start gap-2 rounded border px-3 py-2 text-sm">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{w.name}</span>
                          {w.damage && <span className="text-muted-foreground ml-2">{w.damage}</span>}
                          {w.range && <span className="text-muted-foreground ml-2">· {w.range}</span>}
                          {w.special && <div className="text-muted-foreground text-xs mt-0.5">{w.special}</div>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteWeapon(w.id)}
                          aria-label={`Delete ${w.name}`}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {arc !== "turret" && (() => {
                  const arcDamageField: DamageField = `weapons${arc.charAt(0).toUpperCase() + arc.slice(1)}Damage` as DamageField;
                  return (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">Arc damage</span>
                      <DamageStatus
                        value={damageValues[arcDamageField]}
                        onChange={(v) => handleDamageChange(arcDamageField, v)}
                      />
                    </div>
                  );
                })()}
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => updateWeaponForm(arc, { name: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddWeapon(arc); }}
                      placeholder="Weapon name"
                      className="w-36 h-8 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Damage</Label>
                    <Input
                      value={form.damage}
                      onChange={(e) => updateWeaponForm(arc, { damage: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddWeapon(arc); }}
                      placeholder="2d8"
                      className="w-20 h-8 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Range</Label>
                    <Input
                      value={form.range}
                      onChange={(e) => updateWeaponForm(arc, { range: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddWeapon(arc); }}
                      placeholder="Short"
                      className="w-20 h-8 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Special</Label>
                    <Input
                      value={form.special}
                      onChange={(e) => updateWeaponForm(arc, { special: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddWeapon(arc); }}
                      placeholder="Notes"
                      className="w-28 h-8 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddWeapon(arc)}
                    disabled={!form.name.trim()}
                    className="h-8"
                  >
                    Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {SECTIONS.map(({ key, label }) => {
        const sectionNotes = notes.filter((n) => n.section === key);
        const inputValue = noteForms[key];
        return (
          <div key={key} className="border-t pt-5">
            <h2 className="text-sm font-semibold mb-3">{label}</h2>
            {sectionNotes.length > 0 && (
              <div className="flex flex-col gap-1 mb-3">
                {sectionNotes.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                    {editingNoteId === n.id ? (
                      <Input
                        autoFocus
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        onBlur={() => commitNoteEdit(n.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitNoteEdit(n.id);
                          if (e.key === "Escape") cancelNoteEdit();
                        }}
                        className="h-6 flex-1 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                      />
                    ) : (
                      <span
                        className="flex-1 min-w-0 cursor-text"
                        onClick={() => startEditingNote(n)}
                      >
                        {n.note}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteNote(n.id)}
                      aria-label="Delete note"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 items-end">
              <Input
                value={inputValue}
                onChange={(e) => setNoteForms((prev) => ({ ...prev, [key]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(key); }}
                placeholder="Add a note…"
                className="h-8 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddNote(key)}
                disabled={!inputValue.trim()}
                className="h-8 shrink-0"
              >
                Add
              </Button>
            </div>
          </div>
        );
      })}

      <CrewSection
        campaignId={campaignId}
        spaceshipId={spaceship.id}
        characters={characters}
        initialCrew={initialCrew}
      />
    </div>
  );
}
