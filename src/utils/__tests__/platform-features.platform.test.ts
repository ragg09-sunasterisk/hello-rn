// Exercises the real wrapper by faking Platform for each branch.
import { afterEach, expect, it, jest } from "@jest/globals";
import { Platform } from "react-native";

import { supportsFeatureX } from "../platform-features";

function mockPlatform(os: "ios" | "android", version: string | number) {
  jest.replaceProperty(Platform, "OS", os);
  // Version is a getter, so it has to be spied on rather than replaced.
  jest.spyOn(Platform, "Version", "get").mockReturnValue(version);
}

afterEach(() => {
  jest.restoreAllMocks();
});

it("Android API 31 → true", () => {
  mockPlatform("android", 31);
  expect(supportsFeatureX()).toBe(true);
});

it("Android API 30 → false", () => {
  mockPlatform("android", 30);
  expect(supportsFeatureX()).toBe(false);
});

it("iOS '15.2' → true", () => {
  mockPlatform("ios", "15.2");
  expect(supportsFeatureX()).toBe(true);
});

it("iOS '14.8' → false", () => {
  mockPlatform("ios", "14.8");
  expect(supportsFeatureX()).toBe(false);
});
