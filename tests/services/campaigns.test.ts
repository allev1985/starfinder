import { describe, it, expect, vi, beforeEach } from "vitest";
import { campaignFixture } from "../fixtures/campaign";

vi.mock("@/db/queries/campaigns");

import { generateJoinCode, listCampaignsForUser } from "@/services/campaigns";
import { getCampaignsForUser } from "@/db/queries/campaigns";

const mockGetCampaignsForUser = vi.mocked(getCampaignsForUser);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateJoinCode()", () => {
  it("returns exactly 6 characters", () => {
    // Arrange — (none)
    // Act
    const code = generateJoinCode();
    // Assert
    expect(code).toHaveLength(6);
  });

  it("uses only uppercase letters and digits (A-Z, 0-9)", () => {
    // Arrange — (none)
    // Act
    const code = generateJoinCode();
    // Assert
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it("generates different codes on repeated calls", () => {
    // Arrange
    const attempts = 20;
    // Act
    const codes = new Set(Array.from({ length: attempts }, generateJoinCode));
    // Assert: extremely unlikely to get only 1 unique code out of 20
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("listCampaignsForUser(userId)", () => {
  it("returns player role for a player-only campaign", async () => {
    // Arrange
    mockGetCampaignsForUser.mockResolvedValue({
      dmCampaigns: [],
      playerCampaigns: [campaignFixture],
    });
    // Act
    const result = await listCampaignsForUser("user-001");
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("player");
  });

  it("returns dm role for a DM-only campaign", async () => {
    // Arrange
    mockGetCampaignsForUser.mockResolvedValue({
      dmCampaigns: [campaignFixture],
      playerCampaigns: [],
    });
    // Act
    const result = await listCampaignsForUser("user-001");
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("dm");
  });

  it("dm role wins when the same campaign appears in both lists", async () => {
    // Arrange: same campaign in both
    mockGetCampaignsForUser.mockResolvedValue({
      dmCampaigns: [campaignFixture],
      playerCampaigns: [campaignFixture],
    });
    // Act
    const result = await listCampaignsForUser("user-001");
    // Assert: de-duplicated to one entry, role = dm
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("dm");
  });

  it("returns both campaigns when the user has distinct dm and player campaigns", async () => {
    // Arrange
    const dmCampaign = { ...campaignFixture, id: "campaign-dm", name: "DM Campaign" };
    const playerCampaign = { ...campaignFixture, id: "campaign-player", name: "Player Campaign" };
    mockGetCampaignsForUser.mockResolvedValue({
      dmCampaigns: [dmCampaign],
      playerCampaigns: [playerCampaign],
    });
    // Act
    const result = await listCampaignsForUser("user-001");
    // Assert
    expect(result).toHaveLength(2);
    expect(result.find((c) => c.id === "campaign-dm")?.role).toBe("dm");
    expect(result.find((c) => c.id === "campaign-player")?.role).toBe("player");
  });
});
