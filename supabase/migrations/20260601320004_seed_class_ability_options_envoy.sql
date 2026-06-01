-- Envoy improvisation options (pool: improvisation)
-- Envoy expertise talent options (pool: expertise_talent)

-- Improvisations
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Duck Under',
 'As a reaction when a foe attempts a melee attack against you, you can grant yourself a +2 bonus to AC against that attack. You can use this ability once per day. You must be 6th level to choose this improvisation.',
 '6th level'),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Clever Feint',
 'As a standard action, you can fake out a foe, making it think you are about to do something other than what you actually do. Attempt a Bluff check with the same DC as a check to feint in combat. If you succeed, the creature is flat-footed against your attacks until the end of your turn.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Dispiriting Taunt',
 'As a standard action, you can taunt a foe within 60 feet. Attempt an Intimidate check (DC = 10 + 1.5 × your opponent''s CR or character level, or 15 + 1.5 × the CR of the most powerful creature if there are multiple). If you succeed, the creature is shaken for 1 round.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Get ''Em',
 'As a move action, you can indicate a foe and rally your allies. Until the start of your next turn, you and your allies within 60 feet can each add your Charisma modifier (minimum +1) as a bonus to attack rolls against that foe.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Heads Up',
 'As a reaction, when an ally within 60 feet is hit by an attack, you can warn that ally. The ally can reduce the damage by your Charisma modifier (minimum 1). You can use this ability once per day.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Hidden Agenda',
 'You can attempt to hide a piece of information within a larger amount of normal-seeming information. When you attempt Bluff checks to deceive a creature, you can instead roll two dice and take the better result.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Hurry',
 'As a standard action, you can direct a willing ally within 60 feet who can see and hear you to immediately take a move action (which does not count against their actions on their next turn).',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Inspiring Boost',
 'As a standard action, you can signal an ally within 30 feet. That ally regains a number of Stamina Points equal to twice your envoy level + your Charisma modifier (minimum 1). Once an ally has benefited from your inspiring boost, they can''t benefit from it again until they regain Stamina Points from rest.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Clever Attack',
 'When you take a standard action to make a melee or ranged attack, you can also attempt a Bluff check (DC = 10 + 1.5 × the target''s CR or character level). If you succeed, you can roll one of the attack''s damage dice twice and take the higher result.',
 '6th level'),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Coordination',
 'As a move action, you can grant a single ally a +2 bonus to their next attack roll. You must be adjacent to that ally, or both you and the ally must be within 30 feet of the same identified enemy.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Lookout',
 'As a standard action on your turn, you can designate a single ally within 60 feet. Until the start of your next turn, that ally cannot be surprised. You can use this ability once per day.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Not in the Face',
 'When an enemy in your reach hits you with a melee attack, as a reaction you can make an Intimidate check (DC = the result of their attack roll). On a success, you force them to reroll the attack.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Pep Talk',
 'As a move action, you can inspire an ally within 30 feet who can see and hear you to persist through an ongoing negative condition. If that ally attempts a saving throw against the condition''s ongoing effect before the start of your next turn, they can roll the saving throw twice and take the better result.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Watch Your Back',
 'When an ally within 60 feet would be flanked, as a reaction you can warn them, negating the flanking bonus for that attack.',
 null),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Inspiring Oration',
 'As a full action, you give an inspiring speech. Each ally within 60 feet who can see and hear you gains a +1 morale bonus to attack rolls, saving throws, and skill checks until the start of your next turn.',
 '6th level'),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Boost Morale',
 'As a full action, you boost your allies'' fighting spirit. Each ally within 60 feet who can see and hear you gains temporary Hit Points equal to your Charisma modifier (minimum 1) until the start of your next turn.',
 '6th level'),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Quick Inspiring Boost',
 'You can use your inspiring boost ability as a move action instead of a standard action.',
 'Inspiring Boost, 8th level'),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Improved Get ''Em',
 'When you use Get ''Em, you and your allies can also reroll attack rolls of 1 against the designated target.',
 'Get ''Em, 8th level'),

('b1000000-0000-0000-0000-000000000001', 'improvisation', 'Extra Skill Expertise',
 'You gain another use of your Expertise ability per day.',
 '4th level');

-- Expertise Talent options
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Additional Skill Expertise',
 'You can apply your Expertise die to one additional skill of your choice.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Altered Bearing',
 'When you use your Expertise die on a Disguise check, you can attempt to disguise yourself as a different gender, age, or size category without the normal Disguise check penalties.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Convincing Liar',
 'When you use your Expertise die on a Bluff check, creatures that succeed at a Sense Motive check against your Bluff believe the truth is somewhere in the middle rather than recognizing you are lying.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Cunning Disguise',
 'When you use Expertise on a Disguise check, you can roll the Expertise die twice and add both results.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Expert Advice',
 'When you use Expertise on a Diplomacy check to change a creature''s attitude, that creature also gains a +1 morale bonus to one ability score of your choice for 24 hours.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Fast Talk',
 'When you use your Expertise die on a Bluff check, you do not take the –5 penalty when lying to a creature who has proof that you are lying.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Group Negotiation',
 'When you use Expertise on a Diplomacy check to change a creature''s attitude, you can attempt to change the attitudes of all similar creatures within 30 feet with a single check.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Hype',
 'When you use your Expertise die on a Diplomacy check to gather information, add double the die result.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Inspiring Expertise',
 'When you roll your Expertise die and get a 1, you can reroll it once. You must take the second result.',
 null),

('b1000000-0000-0000-0000-000000000001', 'expertise_talent', 'Slick Customer',
 'When you use Expertise on a Diplomacy check, that creature cannot take an action based on information you gave it during this interaction for 24 hours.',
 null);
