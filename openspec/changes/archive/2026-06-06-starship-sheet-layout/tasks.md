## 1. Container and Top Row

- [x] 1.1 Change root container from `max-w-2xl flex flex-col` to `max-w-6xl space-y-6`
- [x] 1.2 Wrap identity block, shields compass, and stats block in `grid grid-cols-1 lg:grid-cols-3 gap-4`
- [x] 1.3 Reorganize identity fields into compact paired sub-grid: Name+Tier header row, Make & Model full-width, Size|Frame paired, Speed|Maneuverability paired, Drift Engine+Drift Rating together
- [x] 1.4 Verify AC / TL / HP stats block renders correctly as the third column of the top row

## 2. Weapons Strip

- [x] 2.1 Wrap weapons section in `flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-x-visible`
- [x] 2.2 Give each arc card `min-w-[200px] shrink-0 lg:min-w-0` so cards maintain width in the scroll strip and fill naturally in the grid
- [x] 2.3 Verify arc damage status controls appear inside their respective arc cards
- [x] 2.4 Verify turret card has no damage status control

## 3. Bottom Row (Crew / Notes / Expansion Bays)

- [x] 3.1 Wrap Crew section, Notes note-section, and Expansion Bays note-section in `grid grid-cols-1 sm:grid-cols-3 gap-4`
- [x] 3.2 Confirm each section renders its own heading and note list/add form within its column

## 4. Systems Row (Power Core+Drift / Systems / Cargo)

- [x] 4.1 Wrap Power Core+Drift Engine inputs, Systems note-section, and Cargo/Passengers note-section in `grid grid-cols-1 sm:grid-cols-3 gap-4`
- [x] 4.2 Move Power Core name, PCU, Drift Engine, and Drift Rating inputs into the left column of this row

## 5. Critical Damage

- [x] 5.1 Place Critical Damage section below the systems row as a full-width block (remove `border-t` if it looks redundant given the new grid structure; keep if it still provides useful visual separation)

## 6. Verify

- [x] 6.1 Run `npm run lint` and `npx tsc --noEmit` — no new errors
- [ ] 6.2 Open the spaceship sheet in a browser at mobile width (375px) — all zones stack vertically in correct order
- [ ] 6.3 Open at tablet width (768px) — weapons strip scrolls horizontally; bottom row is 3-col
- [ ] 6.4 Open at desktop width (1280px) — top row is 3-col, weapons is 5-col grid, bottom rows are 3-col
