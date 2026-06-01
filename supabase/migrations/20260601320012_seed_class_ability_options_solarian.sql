-- Solarian solar manifestation, stellar revelation, and zenith revelation options

-- Solar Manifestation
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000005', 'solar_manifestation', 'Solar Armor',
 'Protective stellar energy forms around you as armor. The armor''s EAC and KAC bonuses improve as you gain solarian levels. You can activate or deactivate your solar armor as a move action. While active, you gain EAC and KAC bonuses based on your level, and you can use your solar armor to substitute for any armor when determining proficiency.',
 null),

('b1000000-0000-0000-0000-000000000005', 'solar_manifestation', 'Solar Weapon',
 'You can form a melee weapon made of stellar energy as a move action. This weapon deals damage equal to that of a standard melee weapon for your level. The solar weapon''s damage and type can be photon (fire) or graviton (bludgeoning) depending on your attunement. The weapon bypasses DR as a magical weapon.',
 null);

-- Stellar Revelations (graviton)
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Black Hole (G)',
 'As a standard action, you can pull all creatures within 20 feet toward you. Creatures must succeed at a Fortitude save (DC = 10 + half your solarian level + your Charisma modifier) or be pulled 10 feet toward you and knocked prone. This is a graviton revelation.',
 'Fully attuned (graviton), 6th level'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Crush (G)',
 'When you are attuned or fully attuned in graviton mode, your attacks count as having the grapple weapon special property.',
 'Partially attuned (graviton)'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Dark Matter (G)',
 'When you are fully attuned in graviton mode, you can gain damage reduction equal to half your solarian level as a free action. This lasts until you change your stellar mode.',
 'Fully attuned (graviton)'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Gravity Boost (G)',
 'While attuned or fully attuned in graviton mode, you gain a +10-foot enhancement bonus to your land speed.',
 'Partially attuned (graviton)'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Gravity Hold (G)',
 'As a standard action while fully attuned in graviton mode, you can attempt a ranged combat maneuver against a creature within 30 feet to grapple it using gravity.',
 'Fully attuned (graviton), 6th level'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Gravitational Mastery (G)',
 'While fully attuned in graviton mode, you gain a fly speed of 30 feet (average maneuverability).',
 'Fully attuned (graviton), 12th level');

-- Stellar Revelations (photon)
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Blazing Orbit (P)',
 'While attuned or fully attuned in photon mode, creatures that hit you with melee attacks take 1d6 fire damage.',
 'Partially attuned (photon)'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Corona (P)',
 'As a standard action while fully attuned in photon mode, you create a burst of blinding light in a 10-foot radius. Creatures must succeed at a Reflex save or be blinded for 1 round.',
 'Fully attuned (photon), 6th level'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Flashing Strikes (P)',
 'While attuned or fully attuned in photon mode, you can make an additional attack at your highest attack bonus when you take a full attack.',
 'Partially attuned (photon), 9th level'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Plasma Sheath (P)',
 'While attuned or fully attuned in photon mode, your melee attacks deal an additional 1d4 fire damage.',
 'Partially attuned (photon)'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Stellar Rush (P)',
 'As a standard action while fully attuned in photon mode, you can move up to your speed in a straight line, passing through occupied spaces. Creatures in your path take 2d6 fire damage (Reflex half).',
 'Fully attuned (photon), 6th level'),

('b1000000-0000-0000-0000-000000000005', 'stellar_revelation', 'Supernova Flare (P)',
 'Your Flare class feature''s burst radius increases to 60 feet.',
 'Fully attuned (photon), 17th level');

-- Zenith Revelations
INSERT INTO "class_ability_options" ("class_id", "pool_name", "name", "description", "prerequisites") VALUES

('b1000000-0000-0000-0000-000000000005', 'zenith_revelation', 'Defy Gravity',
 'While fully attuned in graviton mode, you can levitate and move through the air at your normal speed (perfect maneuverability).',
 'Fully attuned (graviton), 6th level'),

('b1000000-0000-0000-0000-000000000005', 'zenith_revelation', 'Photon Roar',
 'While fully attuned in photon mode, as a standard action you release a shout of solar energy. All creatures within 30 feet take 1d8 fire damage per 2 solarian levels (Reflex half).',
 'Fully attuned (photon), 6th level'),

('b1000000-0000-0000-0000-000000000005', 'zenith_revelation', 'Sunspot',
 'While fully attuned in photon mode, you can create a blinding zone of concentrated sunlight. The area (20-foot radius) is brightly lit and creatures inside must succeed at a Fortitude save or be blinded while in the area.',
 'Fully attuned (photon), 12th level');
