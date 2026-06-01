-- CRB Feats A-L

INSERT INTO "feats" ("name", "description", "prerequisites", "is_combat_feat") VALUES

('Barricade',
 'As a standard action, you can construct a barricade out of adjacent debris or materials. The barricade provides cover to you and allies until the start of your next turn.',
 null, false),

('Blind-Fight',
 'In melee, every time you miss because of concealment, you can reroll your miss chance percentile roll one time to see if you actually hit. An invisible attacker gets no advantages related to hitting you in melee. You take only a –4 penalty to Perception checks to detect invisible creatures.',
 null, true),

('Bodyguard',
 'As a reaction when an ally within your reach is attacked, you can take the attack in their place. You must declare this after the attacker says they''re attacking but before the roll.',
 'Combat Reflexes', true),

('Cleave',
 'As a standard action, you can make a single melee attack that affects two adjacent foes. Make a single melee attack roll and compare it against the AC of each creature. On a hit, both take damage from a single damage roll.',
 'Str 13, base attack bonus +1', true),

('Close Combat',
 'When you attack with a small arm or basic melee weapon as a standard action, you don''t provoke attacks of opportunity.',
 null, true),

('Combat Casting',
 'You can cast spells without provoking attacks of opportunity.',
 'Ability to cast spells', true),

('Combat Maneuver',
 'You can attempt combat maneuvers without provoking attacks of opportunity from the target of the maneuver.',
 null, true),

('Combat Reflexes',
 'The number of attacks of opportunity you can make per round equals your Dexterity modifier (minimum 1). You can still make only one attack of opportunity per opportunity.',
 null, true),

('Coordinated Shot',
 'When you take a full attack with a ranged weapon and at least one ally is threatening a creature you''re shooting at, you gain a +1 bonus to ranged attack rolls against that creature.',
 null, true),

('Deadly Aim',
 'You take a –2 penalty to all ranged attack rolls made during this action in exchange for a +4 bonus to all ranged damage rolls.',
 'Dex 15, base attack bonus +1', true),

('Diehard',
 'When you are dying, you are automatically stable. When you''re stable, you don''t need to attempt Constitution checks to remain stable. When you gain negative Hit Points and die, you automatically stabilize. Additionally, once per day you can spend 1 Resolve Point as a reaction to go to 1 HP instead of 0.',
 'Base attack bonus +1', false),

('Dispelling Strike',
 'When you damage a creature with a melee attack and that creature is under the effect of a spell or spell-like ability, as a free action you can attempt to dispel the effect (as dispel magic, using your base attack bonus as the caster level).',
 'Ability to cast 3rd-level spells', true),

('Dodge',
 'You gain a +1 dodge bonus to AC. A condition that makes you lose your Dex bonus to AC also makes you lose the benefits of this feat.',
 'Dex 13', true),

('Double Take',
 'When you make a Perception check to notice or detect hidden creatures or objects and fail by 5 or fewer, you can attempt the check again as an immediate action.',
 null, false),

('Driving Attack',
 'When piloting a vehicle during the vehicular combat phase, you can ram a creature with the vehicle and also make a melee attack against the same creature in the same action.',
 null, true),

('Echolocation Sense',
 'You have developed extraordinary sensitivity to sound. When you have the sightless condition or are in conditions of total darkness, you gain blindsense (sound) with a range of 30 feet.',
 null, false),

('Energy Resistance',
 'You gain resistance 5 to one energy type (acid, cold, electricity, fire, or sonic). You can take this feat multiple times, selecting a different energy type each time.',
 null, false),

('Enhanced Resistance',
 'Your resistance to one energy type increases by 5. You can take this feat multiple times, selecting a different energy type each time.',
 'Energy Resistance in the selected energy type', false),

('Envoy Improvisation',
 'Choose an envoy improvisation that you meet the prerequisites for. You gain that improvisation.',
 'Envoy improvisation class feature', false),

('Extra Resolve',
 'You gain 1 additional Resolve Point.',
 null, false),

('Far Shot',
 'The first range increment penalty you take for a ranged weapon is halved (from –2 to –1).',
 null, true),

('Fast Talk',
 'Once per day when you attempt a Bluff check to deceive a creature, you can attempt the check as a free action rather than a standard action.',
 null, false),

('Feint',
 'As a standard action, you can feint in combat. Attempt a Bluff check (DC = opponent''s AC or 10 + opponent''s Sense Motive skill bonus, whichever is higher). If you succeed, the target is flat-footed against your next attack before the end of your next turn.',
 null, true),

('Fleet',
 'Your speed increases by 10 feet.',
 null, false),

('Fusillade',
 'When making a full attack, you can fire all remaining shots in your weapon''s capacity as part of the full attack, dealing an additional 1d6 damage per two shots fired beyond the first (maximum +3d6). The weapon is then empty.',
 'Dex 15, Weapon Focus (longarms or small arms)', true),

('Goblin Juju',
 'Your use of salvaged and improvised weapons is remarkably effective. When using an improvised weapon, you gain a +1 bonus to attack and damage rolls with it.',
 null, true),

('Great Fortitude',
 'You gain a +2 bonus to Fortitude saves.',
 null, false),

('Grenade Proficiency',
 'You are proficient with grenades.',
 null, true),

('Heavy Armor Proficiency',
 'You are proficient with heavy armor.',
 'Light Armor Proficiency', false),

('Improved Combat Maneuver',
 'Choose one combat maneuver (bull rush, dirty trick, disarm, grapple, pin, reposition, sunder, or trip). You gain a +4 bonus to your attack roll when attempting that combat maneuver.',
 'Combat Maneuver, base attack bonus +6', true),

('Improved Initiative',
 'You get a +4 bonus on initiative checks.',
 null, true),

('Improved Unarmed Strike',
 'You are considered armed even when unarmed and you deal 1d3 lethal or nonlethal damage (your choice). You can make attacks of opportunity with unarmed strikes.',
 null, true),

('In Harm''s Way',
 'When adjacent to an ally, as a reaction you can take the damage from an attack targeting your ally. The ally is unaffected by the attack.',
 null, false),

('Iron Will',
 'You gain a +2 bonus to Will saves.',
 null, false),

('Jet Dash',
 'Your land and swimming speeds increase by 10 feet each. You can also run at 4 times your normal speed (rather than 3 times). You ignore the first 20 feet of difficult terrain when charging.',
 null, false),

('Kip Up',
 'As a swift action, you can stand up from the prone position.',
 null, false),

('Lunge',
 'On your turn, you can increase your reach by 5 feet until the end of your turn. When you do, you provoke an attack of opportunity from the target if your attack misses.',
 'Base attack bonus +6', true);
