-- Mechanic class abilities (b1000000-0000-0000-0000-000000000002)

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

('b1000000-0000-0000-0000-000000000002', 'Artificial Intelligence',
 'You construct an artificial intelligence (AI), a sophisticated program of self-motivated code that you house in a technological brain. Your AI can take one of two forms: a drone or an exocortex. You must choose one of these forms upon taking your first level of mechanic, and once made, this choice cannot be changed. The selected AI is your constant companion throughout your career.',
 1, false, 'ai_type'),

('b1000000-0000-0000-0000-000000000002', 'Custom Rig',
 'You have a custom rig that serves as a mobile workstation. This rig can take many forms, such as a tablet, a wrist-mounted computer, or a jury-rigged collection of parts. Regardless of its form, your custom rig gives you access to a specialized suite of programs, allows you to make Computers and Engineering checks in 1/10th the normal time (to a minimum of 1 round), and contains a number of modules that you can use to boost your capabilities.',
 1, false, null),

('b1000000-0000-0000-0000-000000000002', 'Bypass',
 'You have a knack for getting inside computer systems and electronic devices. At 1st level, you gain a +1 insight bonus to Computers and Engineering skill checks. At 5th level, this bonus increases to +2.',
 1, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You have learned a mechanic trick, a knack for fine-tuning your gear, improving your AI, or otherwise enhancing your capabilities. Select one mechanic trick from the list of tricks. Some tricks require you to have a drone or an exocortex; those tricks are noted as such.',
 2, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Remote Hack',
 'As a standard action, you can use your custom rig to attempt a Computers or Engineering check against a computer or technological device within 20 feet, making your hack or the check without needing to physically access the system.',
 3, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 4, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Weapon Specialization',
 'You gain Weapon Specialization as a bonus feat for each weapon type with which you are proficient.',
 5, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 6, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Expert Rig',
 'Your custom rig is now fully optimized to serve as a combat tool. You can use your custom rig to make attacks in combat as if it were a basic melee weapon that deals 1d4 damage, and while making such an attack you can apply your Dexterity modifier to the attack roll if it is greater than your Strength modifier.',
 7, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 8, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Override',
 'As a standard action, you can use your custom rig to attempt to disable a robot, construct, or another creature with the technological subtype, or any item that has a technological component within 20 feet. If you beat the target''s Engineering check or the device''s AC with a Computers or Engineering check (your choice), you disable it for 1d4 rounds.',
 9, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 10, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Bypass',
 'Your Bypass insight bonus increases to +2 (if it has not already).',
 11, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 12, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 14, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Miracle Worker',
 'As a standard action, you can spend 1 Resolve Point to repair a starship or vehicle system. You can also use this ability to restore 1d8 Hit Points per mechanic level to a single target robot, construct, or creature with the technological subtype adjacent to you.',
 15, false, null),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 16, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 18, true, 'mechanic_trick'),

('b1000000-0000-0000-0000-000000000002', 'Mechanic Trick',
 'You learn another mechanic trick.',
 20, true, 'mechanic_trick');
