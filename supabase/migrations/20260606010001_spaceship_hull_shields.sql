alter table spaceships
  add column hull_total integer not null default 0,
  add column hull_current integer not null default 0,
  add column damage_threshold integer not null default 0,
  add column critical_threshold integer not null default 0,
  add column shield_forward integer not null default 0,
  add column shield_port integer not null default 0,
  add column shield_starboard integer not null default 0,
  add column shield_aft integer not null default 0,
  add column shield_regen_per_min integer not null default 0;
