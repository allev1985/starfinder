alter table spaceships
  rename column shield_forward to shield_forward_total;
alter table spaceships
  rename column shield_port to shield_port_total;
alter table spaceships
  rename column shield_starboard to shield_starboard_total;
alter table spaceships
  rename column shield_aft to shield_aft_total;

alter table spaceships
  add column shield_forward_current integer default null,
  add column shield_port_current integer default null,
  add column shield_starboard_current integer default null,
  add column shield_aft_current integer default null;
