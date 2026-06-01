-- Envoy class abilities (b1000000-0000-0000-0000-000000000001)
-- Repeatable features (Improvisation, Expertise Talent) are stored once per level occurrence
-- so the UI can derive slot counts by filtering level <= characterLevel.
-- repeatable=true flags them for grouped picker rendering.

INSERT INTO "class_abilities" ("class_id", "name", "description", "level", "repeatable", "choice_pool") VALUES

-- Level 1
('b1000000-0000-0000-0000-000000000001', 'Expertise',
 'You are an expert at dealing with challenges that test your skills. At 1st level, when you attempt a Sense Motive check or a skill check, you can roll 1d6 and add the result to your total as an insight bonus. You can use this ability a number of times per day equal to your Charisma modifier (minimum 1).',
 1, false, null),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations. You gain that improvisation, and you can use it a number of times per day as noted in the improvisation''s description. Some improvisations require you to reach a specific envoy level before you can choose them.',
 1, true, 'improvisation'),

-- Level 2
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent. Expertise talents are listed in the envoy class section of the CRB. Some expertise talents alter or improve your Expertise ability, while others provide new uses for it.',
 2, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations. You gain that improvisation, and you can use it a number of times per day as noted in the improvisation''s description.',
 2, true, 'improvisation'),

-- Level 3
('b1000000-0000-0000-0000-000000000001', 'Skill Expertise',
 'Choose a skill — this skill is added to the list of skills you can apply your Expertise die to. You can choose this ability again at 11th level.',
 3, false, null),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 3, true, 'improvisation'),

-- Level 4
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 4, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 4, true, 'improvisation'),

-- Level 5
('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 5, true, 'improvisation'),

-- Level 6
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 6, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 6, true, 'improvisation'),

-- Level 7
('b1000000-0000-0000-0000-000000000001', 'Expertise (1d6+1)',
 'Your expertise die improves to 1d6+1.',
 7, false, null),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 7, true, 'improvisation'),

-- Level 8
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 8, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 8, true, 'improvisation'),

-- Level 9
('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 9, true, 'improvisation'),

-- Level 10
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 10, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 10, true, 'improvisation'),

-- Level 11
('b1000000-0000-0000-0000-000000000001', 'Skill Expertise',
 'Choose another skill — this skill is added to the list of skills you can apply your Expertise die to.',
 11, false, null),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 11, true, 'improvisation'),

-- Level 12
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 12, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 12, true, 'improvisation'),

-- Level 13
('b1000000-0000-0000-0000-000000000001', 'Expertise (1d6+2)',
 'Your expertise die improves to 1d6+2.',
 13, false, null),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 13, true, 'improvisation'),

-- Level 14
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 14, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 14, true, 'improvisation'),

-- Level 15
('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 15, true, 'improvisation'),

-- Level 16
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 16, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 16, true, 'improvisation'),

-- Level 17
('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 17, true, 'improvisation'),

-- Level 18
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 18, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 18, true, 'improvisation'),

-- Level 19
('b1000000-0000-0000-0000-000000000001', 'Expertise (1d6+3)',
 'Your expertise die improves to 1d6+3.',
 19, false, null),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 19, true, 'improvisation'),

-- Level 20
('b1000000-0000-0000-0000-000000000001', 'Expertise Talent',
 'You gain an expertise talent.',
 20, true, 'expertise_talent'),

('b1000000-0000-0000-0000-000000000001', 'Improvisation',
 'You have a knack for getting things done. Choose an improvisation from the list of improvisations.',
 20, true, 'improvisation');
