-- Technomancer magic hack options

INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Charging Jolt',
 'As a move action, you can touch a technological device and give it an electrical charge equal to its full capacity, or charge a battery to full.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Counter Hack',
 'As a reaction, when you fail a saving throw against a spell or magical effect, you can spend 1 Resolve Point to reroll the saving throw with a +2 bonus.',
 '8th level'),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Empowered Weapon',
 'As a standard action, you can temporarily imbue a weapon with magical energy. The weapon gains +1d6 damage of a type you choose (acid, cold, electricity, fire, or sonic) for 1 minute.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Flash Teleport',
 'As a move action, you can teleport to an unoccupied space you can see within 30 feet. You must have line of effect to the destination. You can use this ability once per day.',
 '8th level'),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Fabricate Arms',
 'You can spend 10 minutes to create a technological weapon of item level 5 or lower from raw materials. The weapon lasts until the start of your next day''s spell preparations.',
 '8th level'),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Ghost Protocol',
 'As a standard action, spend 1 Resolve Point to become invisible (as per the spell) for a number of rounds equal to your technomancer level.',
 '8th level'),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Harmful Spells',
 'When you cast a spell that deals energy damage, add your Intelligence modifier (minimum 1) to the total damage.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Magic Negation',
 'As a standard action, you can attempt a dispel magic effect (as the spell) against a magic effect or object within 30 feet. Use your technomancer level as the caster level.',
 '8th level'),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Mental Mark',
 'When you successfully hit a target with a spell, you mentally mark them. You automatically know the direction and distance to the target for 24 hours and you can communicate telepathically with the marked creature.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Selective Targeting',
 'When you cast a spell with an area of effect, you can choose a number of targets in the area equal to your Intelligence modifier (minimum 1) to exclude from the spell''s effects.',
 '8th level'),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Spell Countermeasures',
 'You gain a +2 insight bonus to saving throws against spells and spell-like abilities.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Spell Focus',
 'Choose one spell. When you cast that spell, increase the save DC by 2.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Spellshot',
 'You can store a spell in your weapon. Once per day, you can load one of your known technomancer spells of 1st level or lower into a ranged weapon. The next time you deal damage with that weapon, the spell is also triggered against the target.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Technomantic Proficiency',
 'Choose a weapon category you are not currently proficient with. You gain proficiency with that weapon category.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Thunderstrike',
 'As a standard action, you can channel a spell into a melee weapon for your next attack. If the attack hits, it deals normal damage and the spell is also delivered to the target.',
 null),

('b1000000-0000-0000-0000-000000000007', 'magic_hack', 'Weapon Fusion',
 'You can apply a fusion seal to a weapon as a standard action and remove it the same way, without using a fusion seal.',
 '8th level');
