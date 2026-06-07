import { describe, it, expect } from "vitest";
import { modifier } from "@/lib/ability";

describe("modifier(score)", () => {
  it("returns 0 for score 10", () => {
    // Arrange
    const score = 10;
    // Act
    const result = modifier(score);
    // Assert
    expect(result).toBe(0);
  });

  it("returns +4 for score 18", () => {
    // Arrange
    const score = 18;
    // Act
    const result = modifier(score);
    // Assert
    expect(result).toBe(4);
  });

  it("returns -2 for score 7", () => {
    // Arrange
    const score = 7;
    // Act
    const result = modifier(score);
    // Assert
    expect(result).toBe(-2);
  });

  it("floors score 11 to +0, not +0.5", () => {
    // Arrange
    const score = 11;
    // Act
    const result = modifier(score);
    // Assert
    expect(result).toBe(0);
  });

  it("returns -5 for score 1 (minimum)", () => {
    // Arrange
    const score = 1;
    // Act
    const result = modifier(score);
    // Assert
    expect(result).toBe(-5);
  });
});
