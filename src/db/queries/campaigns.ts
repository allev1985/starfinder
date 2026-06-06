import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, characters, campaignCharacters, spaceships, spaceshipWeapons, spaceshipNotes, type NewCampaign, type Campaign, type Character, type NewSpaceship, type Spaceship, type SpaceshipWeapon, type NewSpaceshipWeapon, type SpaceshipNote, type NewSpaceshipNote } from "@/db/schema";

export async function createCampaign(data: NewCampaign): Promise<Campaign> {
  const [campaign] = await db.insert(campaigns).values(data).returning();
  return campaign;
}

export async function getCampaignsByDm(dmId: string): Promise<Campaign[]> {
  return db.select().from(campaigns).where(eq(campaigns.dmId, dmId));
}

export async function getCampaignsForUser(
  userId: string
): Promise<{ dmCampaigns: Campaign[]; playerCampaigns: Campaign[] }> {
  const dmCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.dmId, userId));

  const playerCampaigns = await db
    .selectDistinct({ campaign: campaigns })
    .from(campaigns)
    .innerJoin(campaignCharacters, eq(campaignCharacters.campaignId, campaigns.id))
    .innerJoin(characters, eq(characters.id, campaignCharacters.characterId))
    .where(eq(characters.ownerId, userId))
    .then((rows) => rows.map((r) => r.campaign));

  return { dmCampaigns, playerCampaigns };
}

export async function getCampaignWithCharacters(
  campaignId: string
): Promise<{ campaign: Campaign | null; characters: Character[] }> {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId));

  if (!campaign) return { campaign: null, characters: [] };

  const joined = await db
    .select({ character: characters })
    .from(characters)
    .innerJoin(campaignCharacters, eq(campaignCharacters.characterId, characters.id))
    .where(eq(campaignCharacters.campaignId, campaignId))
    .then((rows) => rows.map((r) => r.character));

  return { campaign, characters: joined };
}

export async function getCharacterById(characterId: string): Promise<Character | null> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId));
  return character ?? null;
}

export async function updateCampaign(
  campaignId: string,
  data: { name: string }
): Promise<Campaign> {
  const [updated] = await db
    .update(campaigns)
    .set({ name: data.name })
    .where(eq(campaigns.id, campaignId))
    .returning();
  return updated;
}

export async function updateCampaignJoinCode(
  campaignId: string,
  joinCode: string
): Promise<Campaign> {
  const [updated] = await db
    .update(campaigns)
    .set({ joinCode })
    .where(eq(campaigns.id, campaignId))
    .returning();
  return updated;
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  await db
    .delete(campaignCharacters)
    .where(eq(campaignCharacters.campaignId, campaignId));
  await db.delete(campaigns).where(eq(campaigns.id, campaignId));
}

export async function checkIsCampaignDm(
  campaignId: string,
  userId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.dmId, userId)))
    .limit(1);
  return !!row;
}

export async function checkHasCharacterOwnerInCampaign(
  campaignId: string,
  userId: string
): Promise<boolean> {
  const [row] = await db
    .select({ characterId: campaignCharacters.characterId })
    .from(campaignCharacters)
    .innerJoin(characters, eq(characters.id, campaignCharacters.characterId))
    .where(
      and(
        eq(campaignCharacters.campaignId, campaignId),
        eq(characters.ownerId, userId)
      )
    )
    .limit(1);
  return !!row;
}

export async function createSpaceship(data: NewSpaceship): Promise<Spaceship> {
  const [ship] = await db.insert(spaceships).values(data).returning();
  return ship;
}

export async function getSpaceshipByCampaign(campaignId: string): Promise<Spaceship | null> {
  const [ship] = await db
    .select()
    .from(spaceships)
    .where(eq(spaceships.campaignId, campaignId));
  return ship ?? null;
}

export async function updateSpaceship(
  spaceshipId: string,
  data: Partial<Pick<Spaceship, "name" | "makeAndModel" | "speed" | "size" | "frame" | "driftRating">>
): Promise<Spaceship> {
  const [ship] = await db
    .update(spaceships)
    .set(data)
    .where(eq(spaceships.id, spaceshipId))
    .returning();
  return ship;
}

export async function deleteSpaceship(spaceshipId: string): Promise<void> {
  await db.delete(spaceships).where(eq(spaceships.id, spaceshipId));
}

export async function getWeaponsBySpaceship(spaceshipId: string): Promise<SpaceshipWeapon[]> {
  return db
    .select()
    .from(spaceshipWeapons)
    .where(eq(spaceshipWeapons.spaceshipId, spaceshipId))
    .orderBy(spaceshipWeapons.createdAt);
}

export async function createSpaceshipWeapon(
  data: NewSpaceshipWeapon
): Promise<SpaceshipWeapon> {
  const [weapon] = await db.insert(spaceshipWeapons).values(data).returning();
  return weapon;
}

export async function deleteSpaceshipWeapon(weaponId: string): Promise<void> {
  await db.delete(spaceshipWeapons).where(eq(spaceshipWeapons.id, weaponId));
}

export async function getNotesBySpaceship(spaceshipId: string): Promise<SpaceshipNote[]> {
  return db
    .select()
    .from(spaceshipNotes)
    .where(eq(spaceshipNotes.spaceshipId, spaceshipId))
    .orderBy(spaceshipNotes.createdAt);
}

export async function createSpaceshipNote(data: NewSpaceshipNote): Promise<SpaceshipNote> {
  const [note] = await db.insert(spaceshipNotes).values(data).returning();
  return note;
}

export async function updateSpaceshipNote(noteId: string, note: string): Promise<void> {
  await db.update(spaceshipNotes).set({ note }).where(eq(spaceshipNotes.id, noteId));
}

export async function deleteSpaceshipNote(noteId: string): Promise<void> {
  await db.delete(spaceshipNotes).where(eq(spaceshipNotes.id, noteId));
}
