-- Soldier class abilities (b1000000-0000-0000-0000-000000000006)

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

('b1000000-0000-0000-0000-000000000006', 'Fighting Style',
 'You have a preferred fighting style that represents the type of soldier you are. Each fighting style is composed of various style techniques you learn as you advance in level. You must pick one fighting style upon taking your first soldier level; once made, this choice cannot be changed.',
 1, false, 'fighting_style'),

('b1000000-0000-0000-0000-000000000006', 'Primary Style Technique',
 'You gain the 1st-level technique from your chosen fighting style.',
 1, false, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You have learned to use your equipment to its greatest potential. Select one gear boost from the list. Some gear boosts require you to meet prerequisites.',
 2, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Weapon Specialization',
 'You gain Weapon Specialization as a bonus feat for each weapon type with which you are proficient.',
 3, false, null),

('b1000000-0000-0000-0000-000000000006', 'Secondary Style Technique',
 'You gain the 5th-level technique from your chosen fighting style.',
 5, false, null),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain a bonus combat feat. You must meet all prerequisites for this feat.',
 2, true, null),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 4, true, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You gain another gear boost.',
 5, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 6, true, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You gain another gear boost.',
 8, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Tertiary Style Technique',
 'You gain the 9th-level technique from your chosen fighting style.',
 9, false, null),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 10, true, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You gain another gear boost.',
 11, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 12, true, null),

('b1000000-0000-0000-0000-000000000006', 'Quaternary Style Technique',
 'You gain the 13th-level technique from your chosen fighting style.',
 13, false, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You gain another gear boost.',
 14, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 14, true, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You gain another gear boost.',
 17, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 16, true, null),

('b1000000-0000-0000-0000-000000000006', 'Quinary Style Technique',
 'You gain the 17th-level technique from your chosen fighting style.',
 17, false, null),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 18, true, null),

('b1000000-0000-0000-0000-000000000006', 'Gear Boost',
 'You gain another gear boost.',
 20, true, 'gear_boost'),

('b1000000-0000-0000-0000-000000000006', 'Combat Feat',
 'You gain another bonus combat feat.',
 20, true, null),

('b1000000-0000-0000-0000-000000000006', 'Senary Style Technique',
 'You gain the 20th-level technique from your chosen fighting style.',
 20, false, null);
