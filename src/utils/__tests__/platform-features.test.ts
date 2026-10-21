import { describe, expect, it } from "@jest/globals";

import { supportsFeatureXFor } from "../platform-features";

describe("supportsFeatureXFor — Android (number API level)", () => {
  it("is false below API 31", () => {
    expect(supportsFeatureXFor("android", 30)).toBe(false);
  });
  it("is true at exactly API 31", () => {
    expect(supportsFeatureXFor("android", 31)).toBe(true);
  });
  it("is true above API 31", () => {
    expect(supportsFeatureXFor("android", 35)).toBe(true);
  });
  it("does not treat a string as an API level", () => {
    expect(supportsFeatureXFor("android", "31")).toBe(false);
  });
});

describe("supportsFeatureXFor — iOS (string version)", () => {
  it("is false below 15", () => {
    expect(supportsFeatureXFor("ios", "14.8")).toBe(false);
  });
  it("is true at exactly 15", () => {
    expect(supportsFeatureXFor("ios", "15.0")).toBe(true);
  });
  it("is true for a three-part version", () => {
    expect(supportsFeatureXFor("ios", "17.4.1")).toBe(true);
  });
  it("compares numerically, not as text ('9' > '15' as strings)", () => {
    expect(supportsFeatureXFor("ios", "9.3")).toBe(false);
  });
});

describe("supportsFeatureXFor — other platforms", () => {
  it("is false on web", () => {
    expect(supportsFeatureXFor("web", "")).toBe(false);
  });
});
