-- Soldier fighting style and gear boost options

-- Fighting Styles
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Arcane Assailant',
 'You combine martial skills with magic to fight effectively. Techniques: 1st — Rune of the Eldritch Knight (apply a magical rune to your weapon granting it a +1 enhancement bonus); 5th — Runic Arsenal (apply multiple runes and share them with adjacent allies); 9th — Magic Hacks (apply spell-based enhancements to your attacks); 13th — Eldritch Critical (your critical hits with the runed weapon deal an additional 1d6 energy damage); 17th — Eldritch Adept (apply a 1st-level spell effect as part of a standard attack).',
 null),

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Blitz',
 'You specialize in aggressive, lightning-fast charges. Techniques: 1st — Charge Attack (when you charge, you deal an additional 1d6 damage on your charge attack); 5th — Rapid Charge (you can charge as a standard action, and you don''t take a –2 penalty to attack rolls made as part of a charge); 9th — Blitz (when you charge, you ignore difficult terrain and attacks of opportunity from creatures you pass through); 13th — Formation Tactics (allies can charge along with you when you charge); 17th — Assault (you can make multiple attacks at the end of a charge, taking a cumulative –4 penalty to each).',
 null),

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Bombard',
 'You specialize in explosives and area-of-effect attacks. Techniques: 1st — Grenade Expert (you increase the range increment of grenades you throw by 5 feet, and you are not damaged by your own grenades); 5th — Grenadier (you gain Grenade Mastery as a bonus feat and can arm grenades as a free action); 9th — Focused Bombardment (your grenades ignore cover for targets in the burst radius); 13th — Heavy Impact (your area-of-effect weapons impose a –2 penalty to saving throws for 1 round); 17th — Saturation Fire (when you use a full-attack with an area weapon, you can affect two separate areas).',
 null),

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Guard',
 'You excel at defensive fighting and protecting allies. Techniques: 1st — Guard''s Protection (you grant adjacent allies a +1 shield bonus to EAC and KAC); 5th — Bodyguard (as a reaction, redirect an attack made against an adjacent ally to yourself); 9th — Protected Advance (allies benefit from your Guard''s Protection for 1 round when you move adjacent to them); 13th — Inspiring Shield (when you successfully block an attack, allies within 30 feet gain a +1 morale bonus to attack rolls for 1 round); 17th — Cover Ally (as a reaction, grant an ally within 30 feet a +4 bonus to AC against one attack).',
 null),

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Hit-and-Run',
 'You are an expert in making quick, decisive strikes and retreating. Techniques: 1st — Nimble Fusillade (if you move before making a ranged attack, you don''t provoke attacks of opportunity for that movement); 5th — Perfect Opportunity (when a creature misses you with a melee attack, you can take a 5-foot step as a reaction); 9th — Harrying Fire (your ranged attacks impose a –1 penalty to saving throws on targets until the end of their next turn); 13th — Running Gear (your speed increases by 10 feet and you don''t take penalties on attack rolls when moving and shooting); 17th — Fleet Attack (you can make a full attack after taking a move action).',
 null),

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Sharpshoot',
 'You are an expert in long-range combat. Techniques: 1st — Opening Shot (if you have not attacked since the start of the combat encounter, you deal +2 damage on your first attack); 5th — Long Range (you double the first range increment of ranged weapons); 9th — Focused Shot (once per round as a free action before making a ranged attack, you can aim precisely to deal +1d6 damage if you don''t move); 13th — Harrying Shot (your ranged attacks cause the target to be off-target until the end of their next turn if they fail a save); 17th — Pinning Shot (ranged attacks can pin targets in place).',
 null),

('b1000000-0000-0000-0000-000000000006', 'fighting_style', 'Teamwork',
 'You fight best in concert with allies. Techniques: 1st — Squad Tactics (you and adjacent allies gain a +1 bonus to attack rolls when making attacks against creatures adjacent to another ally); 5th — Covering Fire (your attacks grant allies +2 to AC against targeted creature until start of your next turn); 9th — Phalanx Fighting (while adjacent to at least 2 allies, you gain +2 AC); 13th — Commander (allies can use your base attack bonus instead of their own once per round); 17th — Company Charge (all allies can move up to their speed and make one attack as a reaction when you charge).',
 null);

-- Gear Boosts
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Armored Advantage',
 'Your armor grants you an additional +2 bonus to KAC against combat maneuvers.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Bullet Barrage',
 'When you make a full attack, the first attack deals an extra 1d6 damage.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Cleave',
 'When you score a critical hit with a melee weapon, you can immediately attack another creature adjacent to the target with a –4 penalty to the attack roll.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Deadly Aim',
 'You take a –2 penalty to ranged attack rolls in exchange for a +4 bonus to ranged attack damage rolls.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Excessive Proficiency',
 'Choose a weapon type you are proficient with. You gain a +1 bonus to attack rolls with that weapon type.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Extra Ammo',
 'Select a longarm or small arm. The weapon''s capacity increases by 50%, rounded down.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Flash of Rage',
 'Once per day as a free action, you gain a +4 morale bonus to Strength and Constitution for 1 minute but take a –2 penalty to AC.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Frenzied Dual-Strike',
 'Once per day when you make a full attack, you can make all your attacks against two targets. Each target must be attacked at least once.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Grenade Expert',
 'You can prime grenades as a swift action rather than a move action.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Laser Sight',
 'Once per day, you can spend 1 minute to apply an improvised laser sight to a ranged weapon, granting a +1 insight bonus to the next attack roll made with it.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Melee Striker',
 'You gain a +2 bonus to damage rolls with melee weapons.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Nimble Fusillade',
 'You don''t provoke attacks of opportunity for making ranged attacks.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Reliable Gear',
 'Once per day when you roll a 1 on an attack roll with a weapon, you can reroll that attack and take the second result.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Sniper''s Aim',
 'When you attack using a weapon''s sniper special property, you are considered to be one range increment closer for the purpose of attack roll penalties.',
 null),

('b1000000-0000-0000-0000-000000000006', 'gear_boost', 'Stunning Punch',
 'When you score a critical hit with a melee weapon, the target must succeed at a Fortitude save (DC 15 + your Strength modifier) or be staggered until the end of its next turn.',
 null);
