alter table class_spell_progression
  add column if not exists spells_per_day integer not null default 0;

create table if not exists character_spell_slots (
  character_id uuid not null references characters(id) on delete cascade,
  spell_level  integer not null,
  total_slots  integer not null default 0,
  used_slots   integer not null default 0,
  primary key (character_id, spell_level)
);
