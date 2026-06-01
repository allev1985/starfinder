-- Mechanic: AI type options and Mechanic Trick options

-- AI Type
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000002', 'ai_type', 'Drone',
 'You build a drone that can fight alongside you. Your drone begins as a Tiny creature, though with time and investment it can become a more powerful companion. Your drone is treated as a creature for all effects that target creatures; it gains Hit Points, skill ranks, base attack bonus, and saves based on its drone level, which is equal to your mechanic level.',
 null),

('b1000000-0000-0000-0000-000000000002', 'ai_type', 'Exocortex',
 'You have a sophisticated, miniaturized computer system implanted in your brain. Your exocortex gives you the ability to fight using your Intelligence modifier instead of your Strength modifier on melee attack rolls, and lets you take more efficient combat actions. You also gain access to exocortex upgrades as you level up.',
 null);

-- Mechanic Tricks
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Boost Shield',
 'When you take a move action to adjust your personal protective field or shield, you gain a +1 shield bonus to EAC and KAC until the start of your next turn.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Countertech',
 'As a reaction, you can expend an unused spell slot or a number of charges from a battery equal to the spell level to reduce the damage of a single technological attack or ability against you or an adjacent ally by 2d6.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Distracting Hack',
 'When you successfully hack a system, creatures using that system to aid another are instead providing a –1 penalty on their ally''s checks.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Drone Meld',
 'You can meld with your drone. While melded, your drone gains a +2 bonus to attack rolls, and you share the drone''s senses and can direct it telepathically. The melding takes 10 minutes and ends when you decide to end it or if you move more than 30 feet from the drone.',
 'Drone'),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Energy Shield',
 'As a standard action, you can use your custom rig to activate an energy field that absorbs incoming damage. This field has a number of Hit Points equal to your mechanic level × your Intelligence modifier (minimum 1).',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Engineer''s Eye',
 'When you attempt an Engineering check to determine the power remaining in a battery or other power source, you don''t need any tools and don''t need to touch the object.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Explosive Hack',
 'When you successfully use your remote hack ability on a technological item, you can cause it to deal 2d6 electricity damage in a 5-foot-radius burst. Targets can attempt a Reflex save (DC = 10 + half your mechanic level + your Intelligence modifier) for half damage.',
 '8th level'),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Ext. Bypass',
 'Increase the range of your Remote Hack ability by 20 feet. You can take this trick up to four times, each time increasing the range by an additional 20 feet.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Invisibility Circuit (Minor)',
 'As a standard action, you can render yourself invisible for 1 round as the spell invisibility.',
 '8th level'),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Neural Shunt',
 'Once per day as a reaction, when you fail a saving throw against an effect that would control or affect your mind, you can shunt the effect into your exocortex. The effect affects your exocortex instead of your mind for the effect''s duration.',
 'Exocortex, 8th level'),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Overcharge',
 'When you hit with a melee attack using your custom rig as a weapon, you can push excess electrical charge into the target. The attack deals an additional 1d6 electricity damage.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Portable Power',
 'You can draw power from your own Stamina to charge batteries or power devices. Spending 1 Stamina Point provides 1 charge to a battery or similar power source.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Quick Patch',
 'You can use the patch starship system engineer action in combat. Doing so takes a standard action.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Resistant Energy',
 'Select one type of energy: acid, cold, electricity, fire, or sonic. You gain resistance 5 to that type. You can take this trick multiple times, each time selecting a different energy type.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Rig Jockey',
 'When piloting a vehicle, you gain a +2 bonus to Piloting checks.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Selective Targeting',
 'When you make a ranged attack against a target in a crowd, you can ignore the –4 penalty for firing into melee, and allies in the crowd are not considered for the purpose of cover.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Signal Boost',
 'You can use your remote hack ability at a range of up to 120 feet, and through solid barriers up to 1 foot thick (not including force effects).',
 'Ext. Bypass (x2), 8th level'),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Techlore (+1)',
 'You gain a +1 insight bonus to all Computers and Engineering checks. This stacks with Bypass but does not increase your Bypass bonus.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Ultralink',
 'The range of your custom rig''s wireless abilities increases by 10 feet, and you can use your custom rig to hack or access networks at twice the normal range for such activities.',
 null),

('b1000000-0000-0000-0000-000000000002', 'mechanic_trick', 'Visual Interface',
 'Your custom rig can project a small holographic display or otherwise present visual information. This has no combat effect but aids in tasks requiring fine detail.',
 null);
