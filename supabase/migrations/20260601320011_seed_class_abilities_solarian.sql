-- Solarian class abilities (b1000000-0000-0000-0000-000000000005)

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

('b1000000-0000-0000-0000-000000000005', 'Stellar Mode',
 'As a free action at the start of your turn, you can enter a stellar mode — graviton or photon. While in a stellar mode, you gain certain benefits based on which mode you''re in. You can exit your stellar mode as a free action. You also have an attunement state: unattuned, partially attuned (entering graviton or photon), or fully attuned (maximum attunement in a single mode). Certain stellar revelations require you to be attuned.',
 1, false, null),

('b1000000-0000-0000-0000-000000000005', 'Solar Manifestation',
 'At 1st level, you gain a solar manifestation—physical evidence of your connection to the stars. Select one: Solar Armor (protective solar energy manifests as armor) or Solar Weapon (you can form a melee weapon from stellar energy). This manifestation begins fully attuned to either the photon or graviton side.',
 1, false, 'solar_manifestation'),

('b1000000-0000-0000-0000-000000000005', 'Sidereal Influence',
 'You can call upon the stars to aid you outside of combat. While unattuned, you can use your stellar mode to guide your actions. At the start of each day, select two skills from the sidereal influence list (one from the graviton list and one from the photon list). Until the start of your next day, you can apply a +1d6 insight bonus to those skill checks.',
 1, false, null),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain a stellar revelation — an ability fueled by your stellar attunement. You gain one graviton revelation and one photon revelation of your choice. Some revelations require a minimum solarian level.',
 1, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 2, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 3, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Weapon Specialization',
 'You gain Weapon Specialization as a bonus feat for each weapon type with which you are proficient.',
 3, false, null),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 4, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 5, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Zenith Revelation',
 'You gain a zenith revelation. Zenith revelations are special stellar revelations that can only be used when you are fully attuned.',
 6, true, 'zenith_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 7, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 8, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 9, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 10, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 11, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Zenith Revelation',
 'You gain another zenith revelation.',
 12, true, 'zenith_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 13, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 14, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 15, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 16, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 17, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Zenith Revelation',
 'You gain another zenith revelation.',
 18, true, 'zenith_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 19, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Stellar Revelation',
 'You gain another stellar revelation.',
 20, true, 'stellar_revelation'),

('b1000000-0000-0000-0000-000000000005', 'Flare',
 'You become a blinding flash of photon energy. Creatures within 30 feet must succeed at a Fortitude save (DC = 10 + half your solarian level + your Charisma modifier) or be blinded for 1 minute. You can use this ability once per day.',
 17, false, null),

('b1000000-0000-0000-0000-000000000005', 'Supernova',
 'You explode in a burst of stellar energy in a 20-foot radius. Creatures in the area take 1d6 damage per solarian level (half fire, half force). A Reflex save (DC = 10 + half your solarian level + your Charisma modifier) halves the damage. You can use this ability once per day.',
 20, false, null);
