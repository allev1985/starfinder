-- CRB Feats M-Z

INSERT INTO "feats" ("name", "description", "prerequisites", "is_combat_feat") VALUES

('Marksman Shooting',
 'When you miss due to soft cover, you may reroll the miss chance once.',
 null, true),

('Mobility',
 'You gain a +4 bonus to AC against attacks of opportunity caused when you move out of or within a threatened area.',
 null, true),

('Multi-Weapon Fighting',
 'Your penalties for fighting with multiple weapons are reduced. The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6.',
 'Dex 13, base attack bonus +6', true),

('Mystic Strike',
 'Your melee attacks are considered magic for the purpose of overcoming damage reduction.',
 'Ability to cast spells or use spell-like abilities', true),

('Nimble Moves',
 'You can move through up to 5 feet of difficult terrain each round as if it were normal terrain.',
 'Dex 15', false),

('Opening Volley',
 'When you deal damage with a ranged attack on the first round of combat, you gain a +2 circumstance bonus to your next melee attack roll against the same target. This bonus lasts until the end of your next turn.',
 null, true),

('Penetrating Attack',
 'When you make an attack, you ignore 5 points of damage reduction or energy resistance.',
 'Base attack bonus +12', true),

('Powered Armor Proficiency',
 'You are proficient with powered armor.',
 'Heavy Armor Proficiency', false),

('Quick Draw',
 'You can draw a weapon as a free action instead of a move action. You can draw a hidden weapon (such as from a concealed holster) as a move action.',
 'Base attack bonus +1', true),

('Reflecting Armor',
 'Once per day, when a laser weapon hits you, you can reflect the beam. The beam ricochets to hit the attacker, dealing the same damage the attack would have dealt to you.',
 'Light armor proficiency, character level 5th', false),

('Sharpshoot',
 'When making an attack with a weapon that has the sniper special property, you can ignore cover that isn''t total cover.',
 'Weapon Focus (sniper weapons), character level 5th', true),

('Shield Proficiency',
 'You can use a shield. When using a shield you are proficient with, you gain the shield''s bonus to EAC and KAC.',
 null, false),

('Skill Focus',
 'Choose a skill. You gain a +3 insight bonus to checks with that skill. If you have 10 or more ranks in that skill, this bonus increases to +6.',
 null, false),

('Skill Synergy',
 'Choose two skills. These skills are considered class skills for you, and you gain a +2 insight bonus to checks with them.',
 null, false),

('Slippery Shooter',
 'When you are threatened in melee, you don''t take the –4 penalty to ranged attack rolls normally incurred by attacking with a ranged weapon while threatened.',
 'Dex 15, Mobility', true),

('Sniper''s Aim',
 'When using the sighting special property of a weapon, you don''t take penalties for shooting beyond a weapon''s first range increment.',
 null, true),

('Spring Attack',
 'As a full action, you can move up to your speed and make a single melee attack at any point during the movement. You can split your movement, moving some before the attack and some after. You do not provoke attacks of opportunity for the movement.',
 'Dex 15, Mobility, base attack bonus +4', true),

('Stand Still',
 'When a foe tries to move out of a square you threaten, you can make an attack of opportunity against that foe. If your attack of opportunity hits, the target must succeed at a Reflex saving throw (DC = 10 + your base attack bonus) or stop moving. This does not count against your attacks of opportunity per round.',
 'Combat Reflexes', true),

('Step Up',
 'Whenever a foe takes a 5-foot step away from you, you can also take a 5-foot step as a free action.',
 'Base attack bonus +1', true),

('Strike Back',
 'As a reaction when a creature with reach greater than yours makes a melee attack against you, you can make a melee attack against that creature at your full attack bonus.',
 'Base attack bonus +1', true),

('Suppressive Fire',
 'When you make a full attack with a weapon that has the automatic special property, you don''t halve the distance of its burst (i.e., you apply its full cone or line distance).',
 'Longarms or heavy weapons proficiency', true),

('Technomantic Dabbler',
 'Select a 0-level technomancer spell (a cantrip). Once per day as a standard action, you can cast that spell as a spell-like ability. Intelligence is your key ability score for this spell-like ability.',
 'Int 15, character level 4th', false),

('Toughness',
 'You gain 1 Hit Point for each character level you have, and you gain 1 additional Hit Point each time you gain a character level.',
 null, false),

('Unfriendly Fire',
 'You can use pistol-whip (or other melee attacks with a ranged weapon) to make a melee attack without provoking attacks of opportunity.',
 null, true),

('Versatile Focus',
 'You choose one weapon type (basic melee, advanced melee, small arms, longarms, etc.). When you have Weapon Focus for that type, you add the Weapon Focus bonus to your damage rolls instead of attack rolls as a free action, as long as you didn''t use Weapon Focus for the attack roll.',
 'Weapon Focus', true),

('Versatile Specialization',
 'When you use Weapon Specialization with one weapon type and make an attack with a second weapon type you are proficient with, you can apply half your Weapon Specialization bonus to the second attack.',
 'Weapon Specialization', true),

('Weapon Focus',
 'Choose one weapon type (basic melee, advanced melee, small arms, longarms, heavy weapons, sniper weapons, grenades, or special weapons). You gain a +1 bonus to attack rolls with that weapon type.',
 'Proficiency with selected weapon type', true),

('Weapon Proficiency (Advanced Melee)',
 'You gain proficiency with advanced melee weapons.',
 null, false),

('Weapon Proficiency (Heavy Weapons)',
 'You gain proficiency with heavy weapons.',
 null, false),

('Weapon Proficiency (Longarms)',
 'You gain proficiency with longarms.',
 null, false),

('Weapon Proficiency (Sniper)',
 'You gain proficiency with sniper weapons.',
 null, false),

('Weapon Proficiency (Special)',
 'You gain proficiency with special weapons.',
 null, false),

('Weapon Specialization',
 'You deal extra damage equal to half your character level with the selected weapon type. You must have Weapon Focus for that weapon type before selecting this feat. Note: most classes grant Weapon Specialization automatically at certain levels.',
 'Weapon Focus, proficiency with selected weapon type, character level 3rd', true);
