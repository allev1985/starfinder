-- Mystic class abilities (b1000000-0000-0000-0000-000000000003)

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

('b1000000-0000-0000-0000-000000000003', 'Connection',
 'You have forged a connection with a powerful spiritual force, granting you a suite of unique abilities. Choose a connection from the list of mystic connections. You gain the connection power listed for 1st level, and you gain the channel skill listed for the connection.',
 1, false, 'connection'),

('b1000000-0000-0000-0000-000000000003', 'Healing Touch',
 'Once per day, you can spend 10 minutes to magically heal a single living creature for 5 × your mystic level Hit Points. If the target is an undead creature, this ability instead deals 5 × your mystic level damage to it (Fortitude half; DC = 10 + half your mystic level + your Wisdom modifier).',
 1, false, null),

('b1000000-0000-0000-0000-000000000003', 'Channel Skill',
 'You gain a +1 bonus to skill checks for the two skills associated with your connection. This bonus increases by 1 at 5th level and every 4 levels thereafter.',
 1, false, null),

('b1000000-0000-0000-0000-000000000003', 'Mindlink',
 'You can form a mental link with willing creatures you touch, allowing you to pass messages or sensory impressions. You can maintain a mindlink with up to 1 creature per level simultaneously.',
 2, false, null),

('b1000000-0000-0000-0000-000000000003', 'Connection Power',
 'You gain the 3rd-level connection power from your connection.',
 3, false, null),

('b1000000-0000-0000-0000-000000000003', 'Telepathic Bond',
 'You can form a deeper mindlink with willing creatures within 30 feet, sharing thoughts without touching. You can share this bond with a number of creatures equal to your Wisdom modifier (minimum 1) simultaneously.',
 3, false, null),

('b1000000-0000-0000-0000-000000000003', 'Weapon Specialization',
 'You gain Weapon Specialization as a bonus feat for each weapon type with which you are proficient.',
 5, false, null),

('b1000000-0000-0000-0000-000000000003', 'Connection Power',
 'You gain the 6th-level connection power from your connection.',
 6, false, null),

('b1000000-0000-0000-0000-000000000003', 'Healing Touch',
 'You can use Healing Touch twice per day.',
 7, false, null),

('b1000000-0000-0000-0000-000000000003', 'Connection Power',
 'You gain the 9th-level connection power from your connection.',
 9, false, null),

('b1000000-0000-0000-0000-000000000003', 'Channel Skill',
 'Your Channel Skill bonus increases to +3.',
 9, false, null),

('b1000000-0000-0000-0000-000000000003', 'Healing Touch',
 'You can use Healing Touch three times per day.',
 11, false, null),

('b1000000-0000-0000-0000-000000000003', 'Connection Power',
 'You gain the 12th-level connection power from your connection.',
 12, false, null),

('b1000000-0000-0000-0000-000000000003', 'Channel Skill',
 'Your Channel Skill bonus increases to +4.',
 13, false, null),

('b1000000-0000-0000-0000-000000000003', 'Healing Touch',
 'You can use Healing Touch four times per day.',
 13, false, null),

('b1000000-0000-0000-0000-000000000003', 'Connection Power',
 'You gain the 15th-level connection power from your connection.',
 15, false, null),

('b1000000-0000-0000-0000-000000000003', 'Healing Touch',
 'You can use Healing Touch five times per day.',
 15, false, null),

('b1000000-0000-0000-0000-000000000003', 'Channel Skill',
 'Your Channel Skill bonus increases to +5.',
 17, false, null),

('b1000000-0000-0000-0000-000000000003', 'Connection Power',
 'You gain the 18th-level connection power from your connection.',
 18, false, null),

('b1000000-0000-0000-0000-000000000003', 'Transcendence',
 'You have achieved a spiritual union with your connection that transforms your nature. You are treated as an outsider in addition to your normal creature type for the purposes of spells and abilities. You can cast each of your connection spells once per day without expending a spell slot.',
 19, false, null),

('b1000000-0000-0000-0000-000000000003', 'Channel Skill',
 'Your Channel Skill bonus increases to +6.',
 20, false, null),

('b1000000-0000-0000-0000-000000000003', 'Enlightenment',
 'You achieve a form of virtual omniscience. You can cast commune once per day as a spell-like ability without expending a spell slot. You are immune to mind-affecting effects.',
 20, false, null);
