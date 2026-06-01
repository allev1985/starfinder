-- Operative specialization and exploit options

-- Specializations
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000004', 'specialization', 'Daredevil',
 'You perform death-defying stunts with precision and style. Your specialization skills are Acrobatics and Athletics. Specialization Exploit: Quick Quip — As a reaction when you succeed a skill check for your trick attack, you can make an Intimidate check to demoralize a single target who witnessed the success.',
 null),

('b1000000-0000-0000-0000-000000000004', 'specialization', 'Ghost',
 'You move unseen and make your opponents question their senses. Your specialization skills are Sleight of Hand and Stealth. Specialization Exploit: Cloaking Field — As a move action, you can render yourself invisible until the start of your next turn.',
 null),

('b1000000-0000-0000-0000-000000000004', 'specialization', 'Hacker',
 'You are skilled at bypassing computer security systems. Your specialization skills are Computers and Engineering. Specialization Exploit: Hack Trick — You can use your trick attack skill check with Computers to hack a computer system adjacent to your target as part of your trick attack.',
 null),

('b1000000-0000-0000-0000-000000000004', 'specialization', 'Spy',
 'You are trained to observe, infiltrate, and relay information. Your specialization skills are Culture and Diplomacy. Specialization Exploit: Blend In — You can attempt a Disguise check as a move action instead of a full action, and you don''t take a penalty for crafting a disguise without a disguise kit.',
 null),

('b1000000-0000-0000-0000-000000000004', 'specialization', 'Thief',
 'You have a talent for taking things that aren''t yours. Your specialization skills are Sleight of Hand and Stealth. Specialization Exploit: Pickpocket — You can attempt a Sleight of Hand check to steal an item from a target as a move action, and if you succeed you can immediately use your trick attack against that target.',
 null);

-- Operative Exploits
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Combat Trick',
 'You gain a combat feat as a bonus feat. You must meet all prerequisites for this feat.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Crippling Shot',
 'When you hit a target with a trick attack, you can reduce their speed by 10 feet for 1d4 rounds. You can choose this exploit again; each selection reduces the speed by an additional 10 feet.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Distracting Shot',
 'When you make a trick attack and succeed at the skill check, you can choose to make the target staggered instead of flat-footed.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Elusive',
 'While you are moving on your turn, you gain a +2 dodge bonus to AC.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Hampering Shot',
 'When you make a successful trick attack, the target is entangled for 1 round.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Improved Debilitating Trick',
 'When you use Debilitating Trick, you can choose to make the target flat-footed AND staggered.',
 'Debilitating Trick, 8th level'),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Inspired Shot',
 'When you attempt a trick attack, you can also attempt an Aid Another action to grant a +2 bonus to an ally''s next attack roll against the same target.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Knockdown',
 'When you make a successful trick attack, you can attempt a trip combat maneuver against the target as a free action.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Nightside Step',
 'As a move action, if you are in dim light or darkness, you can teleport up to 20 feet to another location that is also in dim light or darkness. You must have line of sight to your destination.',
 '10th level'),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Quick Movement',
 'Your speed increases by 10 feet. You can take this exploit a second time (its effects do not stack with haste or similar effects).',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Staggering Shot',
 'When you make a successful trick attack, you can choose to make the target staggered for 1 round instead of flat-footed.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Sure-footed',
 'You are not hindered by difficult terrain when you move.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Trickster''s Edge',
 'Choose two additional skills. You can apply your Operative''s Edge bonus to those skills.',
 null),

('b1000000-0000-0000-0000-000000000004', 'operative_exploit', 'Uncanny Mobility',
 'When you take a move action, you can move up to your speed and ignore difficult terrain and attacks of opportunity.',
 null);
