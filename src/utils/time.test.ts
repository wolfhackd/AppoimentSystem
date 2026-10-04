import { describe, expect, it } from "vitest";
import { timeToMinutes } from "./time";

describe("timeToMinutes", () => {
  it("converts a valid HH:MM time to minutes", () => {
    expect(timeToMinutes("09:30")).toBe(570);
  });

  it("rejects invalid time strings", () => {
    expect(() => timeToMinutes("25:00")).toThrow("Invalid time format (expected HH:MM)");
    expect(() => timeToMinutes("9:00")).toThrow("Invalid time format (expected HH:MM)");
  });
});
