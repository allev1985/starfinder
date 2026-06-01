-- Operative class abilities (b1000000-0000-0000-0000-000000000004)

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

('b1000000-0000-0000-0000-000000000004', 'Operative''s Edge',
 'Your diverse training as an operative grants you a +1 insight bonus to initiative checks and to skill checks for skills you have chosen as your operative specialization skills. This bonus increases by 1 at 3rd level and every 4 levels thereafter.',
 1, false, null),

('b1000000-0000-0000-0000-000000000004', 'Specialization',
 'Your diverse training as an operative grants you a specialization that provides expertise in two skills of your choice, and a unique specialization ability. Choose your specialization from the list. Once made, this choice cannot be changed.',
 1, false, 'specialization'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'You can trick or startle a foe and then attack when they are off guard. As a full action, you can move up to your speed. Whether or not you moved, you can then make an attack with a melee weapon with the operative special property or with any small arm. Just before making your attack, attempt a skill check (usually Bluff, Intimidate, or Stealth). If you succeed, you deal 1d4 extra damage and the target is flat-footed. This extra damage increases at 3rd, 5th, 7th, 9th, 11th, 13th, 15th, 17th, and 19th levels.',
 1, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to an operative exploit. Some exploits require you to reach a specific operative level before you can choose them.',
 2, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Operative''s Edge',
 'Your Operative''s Edge bonus increases to +2.',
 3, false, null),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 1d8.',
 3, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 4, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Debilitating Trick',
 'When you deal trick attack damage to a foe, you can make that foe flat-footed OR staggered (their choice) until the start of your next turn.',
 5, false, null),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 3d8.',
 5, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 6, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 5d8.',
 7, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 8, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Operative''s Edge',
 'Your Operative''s Edge bonus increases to +3.',
 9, false, null),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 7d8.',
 9, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 10, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 9d8.',
 11, false, null),

('b1000000-0000-0000-0000-000000000004', 'Weapon Specialization',
 'You gain Weapon Specialization as a bonus feat for each weapon type with which you are proficient.',
 11, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 12, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Operative''s Edge',
 'Your Operative''s Edge bonus increases to +4.',
 13, false, null),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 11d8.',
 13, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 14, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 13d8.',
 15, false, null),

('b1000000-0000-0000-0000-000000000004', 'Uncanny Agility',
 'You are immune to the flat-footed condition, and your opponents don''t gain bonuses to attack rolls against you from flanking. This doesn''t affect the off-target condition.',
 17, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 16, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 15d8.',
 17, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 18, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 17d8.',
 19, false, null),

('b1000000-0000-0000-0000-000000000004', 'Operative Exploit',
 'You gain access to another operative exploit.',
 20, true, 'operative_exploit'),

('b1000000-0000-0000-0000-000000000004', 'Trick Attack',
 'Your trick attack extra damage increases to 19d8.',
 20, false, null);
