alter table spaceships
  alter column hull_current drop not null,
  alter column hull_current set default null;

update spaceships set hull_current = null where hull_current = 0;
