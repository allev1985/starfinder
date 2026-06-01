-- Technomancer class abilities (b1000000-0000-0000-0000-000000000007)

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

('b1000000-0000-0000-0000-000000000007', 'Spell Cache',
 'As the culmination of your early technical training, you create a spell cache that allows you to store and access spells. Your spell cache can be any piece of tech — a ring, a weapon, a data tablet, etc. Your cache stores your known spells and allows you to cast them. If you lose your spell cache, you can create a new one over 24 hours (losing access to spells in the interim).',
 1, false, null),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You have learned a magic hack, a modification to your spells or the fabric of magic itself. Select one magic hack from the list. Some magic hacks require you to reach a specific technomancer level before you can choose them.',
 2, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Techlore',
 'You are deeply familiar with the technology of the Pact Worlds and beyond. You gain a +1 insight bonus to Computers and Engineering skill checks. This bonus increases to +2 at 9th level.',
 3, false, null),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You learn another magic hack.',
 5, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Weapon Specialization',
 'You gain Weapon Specialization as a bonus feat for each weapon type with which you are proficient.',
 5, false, null),

('b1000000-0000-0000-0000-000000000007', 'Cache Capacitor',
 'Your spell cache gains the ability to store additional spell energy. You can store a spell of 1st level or lower in your cache for immediate access. Retrieving the stored spell and casting it is a standard action. You can replace the stored spell whenever you prepare your spells.',
 6, false, null),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You learn another magic hack.',
 8, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Techlore',
 'Your Techlore insight bonus increases to +2.',
 9, false, null),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You learn another magic hack.',
 11, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Cache Capacitor',
 'Your cache capacitor can now store a spell of up to 2nd level.',
 12, false, null),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You learn another magic hack.',
 14, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You learn another magic hack.',
 17, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Cache Capacitor',
 'Your cache capacitor can now store a spell of up to 3rd level.',
 18, false, null),

('b1000000-0000-0000-0000-000000000007', 'Magic Hack',
 'You learn another magic hack.',
 20, true, 'magic_hack'),

('b1000000-0000-0000-0000-000000000007', 'Resolve Attunement',
 'You have mastered channeling power through your Resolve. Whenever you spend a Resolve Point to regain Stamina Points, you also gain a free casting of any 1st-level technomancer spell you know without expending a spell slot.',
 20, false, null);
