import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/db/queries/campaigns");
vi.mock("@/db/queries/characters");

import { isCampaignParticipant, canViewCharacter } from "@/lib/authorization";
import { checkIsCampaignGm, checkHasCharacterOwnerInCampaign } from "@/db/queries/campaigns";
import { checkIsCharacterOwner, getCharacterCampaignIds } from "@/db/queries/characters";

const mockCheckIsGm = vi.mocked(checkIsCampaignGm);
const mockCheckHasOwner = vi.mocked(checkHasCharacterOwnerInCampaign);
const mockCheckIsOwner = vi.mocked(checkIsCharacterOwner);
const mockGetCampaignIds = vi.mocked(getCharacterCampaignIds);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("isCampaignParticipant(campaignId, userId)", () => {
  it("returns true for the campaign GM", async () => {
    // Arrange
    mockCheckIsGm.mockResolvedValue(true);
    // Act
    const result = await isCampaignParticipant("campaign-001", "user-dm");
    // Assert
    expect(result).toBe(true);
    expect(mockCheckHasOwner).not.toHaveBeenCalled();
  });

  it("returns true for a player who owns a character in the campaign", async () => {
    // Arrange
    mockCheckIsGm.mockResolvedValue(false);
    mockCheckHasOwner.mockResolvedValue(true);
    // Act
    const result = await isCampaignParticipant("campaign-001", "user-player");
    // Assert
    expect(result).toBe(true);
  });

  it("returns false for a user with no connection to the campaign", async () => {
    // Arrange
    mockCheckIsGm.mockResolvedValue(false);
    mockCheckHasOwner.mockResolvedValue(false);
    // Act
    const result = await isCampaignParticipant("campaign-001", "user-stranger");
    // Assert
    expect(result).toBe(false);
  });
});

describe("canViewCharacter(characterId, userId)", () => {
  it("returns true for the character owner", async () => {
    // Arrange
    mockCheckIsOwner.mockResolvedValue(true);
    // Act
    const result = await canViewCharacter("char-001", "user-owner");
    // Assert
    expect(result).toBe(true);
    expect(mockGetCampaignIds).not.toHaveBeenCalled();
  });

  it("returns true for the GM of a campaign that includes the character", async () => {
    // Arrange
    mockCheckIsOwner.mockResolvedValue(false);
    mockGetCampaignIds.mockResolvedValue(["campaign-001"]);
    mockCheckIsGm.mockResolvedValue(true);
    // Act
    const result = await canViewCharacter("char-001", "user-dm");
    // Assert
    expect(result).toBe(true);
  });

  it("returns true for a player whose character is in the same campaign", async () => {
    // Arrange
    mockCheckIsOwner.mockResolvedValue(false);
    mockGetCampaignIds.mockResolvedValue(["campaign-001"]);
    mockCheckIsGm.mockResolvedValue(false);
    mockCheckHasOwner.mockResolvedValue(true);
    // Act
    const result = await canViewCharacter("char-001", "user-player");
    // Assert
    expect(result).toBe(true);
  });

  it("returns false for a stranger with no connection to the character or its campaigns", async () => {
    // Arrange
    mockCheckIsOwner.mockResolvedValue(false);
    mockGetCampaignIds.mockResolvedValue(["campaign-001"]);
    mockCheckIsGm.mockResolvedValue(false);
    mockCheckHasOwner.mockResolvedValue(false);
    // Act
    const result = await canViewCharacter("char-001", "user-stranger");
    // Assert
    expect(result).toBe(false);
  });

  it("returns false when the character belongs to no campaigns", async () => {
    // Arrange
    mockCheckIsOwner.mockResolvedValue(false);
    mockGetCampaignIds.mockResolvedValue([]);
    // Act
    const result = await canViewCharacter("char-001", "user-stranger");
    // Assert
    expect(result).toBe(false);
  });
});
