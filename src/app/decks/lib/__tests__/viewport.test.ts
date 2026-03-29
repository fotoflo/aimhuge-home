import { describe, it, expect } from "vitest";
import { computeSlideScale, applyWheelZoom, clickNavDirection } from "../viewport";

// ── computeSlideScale ──

describe("computeSlideScale", () => {
  it("returns 1 when viewport matches slide dimensions exactly", () => {
    expect(computeSlideScale(1920, 1080)).toBe(1);
  });

  it("scales down for smaller viewports (width-constrained)", () => {
    // 960 / 1920 = 0.5, 1080 / 1080 = 1 → min = 0.5
    expect(computeSlideScale(960, 1080)).toBe(0.5);
  });

  it("scales down for smaller viewports (height-constrained)", () => {
    // 1920 / 1920 = 1, 540 / 1080 = 0.5 → min = 0.5
    expect(computeSlideScale(1920, 540)).toBe(0.5);
  });

  it("scales down for both dimensions smaller", () => {
    // 960 / 1920 = 0.5, 540 / 1080 = 0.5 → 0.5
    expect(computeSlideScale(960, 540)).toBe(0.5);
  });

  it("scales up for larger viewports", () => {
    // 3840 / 1920 = 2, 2160 / 1080 = 2 → 2
    expect(computeSlideScale(3840, 2160)).toBe(2);
  });

  it("picks the smaller axis when aspect ratios differ", () => {
    // 3840 / 1920 = 2, 1080 / 1080 = 1 → min = 1
    expect(computeSlideScale(3840, 1080)).toBe(1);
  });

  it("applies zoom multiplier", () => {
    expect(computeSlideScale(1920, 1080, 1.5)).toBe(1.5);
  });

  it("applies zoom to a scaled viewport", () => {
    // base scale = 0.5, zoom = 2 → 1.0
    expect(computeSlideScale(960, 1080, 2)).toBe(1);
  });

  it("defaults zoom to 1", () => {
    expect(computeSlideScale(1920, 1080)).toBe(computeSlideScale(1920, 1080, 1));
  });
});

// ── applyWheelZoom ──

describe("applyWheelZoom", () => {
  it("zooms in with negative deltaY (scroll up)", () => {
    const result = applyWheelZoom(1, -100);
    expect(result).toBeCloseTo(1.1);
  });

  it("zooms out with positive deltaY (scroll down)", () => {
    const result = applyWheelZoom(1, 100);
    expect(result).toBeCloseTo(0.9);
  });

  it("clamps minimum zoom to 0.25", () => {
    expect(applyWheelZoom(0.3, 1000)).toBe(0.25);
  });

  it("clamps maximum zoom to 3", () => {
    expect(applyWheelZoom(2.9, -2000)).toBe(3);
  });

  it("preserves zoom when deltaY is 0", () => {
    expect(applyWheelZoom(1.5, 0)).toBe(1.5);
  });
});

// ── clickNavDirection ──

describe("clickNavDirection", () => {
  it("returns 'prev' when clicking left half", () => {
    expect(clickNavDirection(100, 1920)).toBe("prev");
  });

  it("returns 'next' when clicking right half", () => {
    expect(clickNavDirection(1500, 1920)).toBe("next");
  });

  it("returns 'next' when clicking exactly at center", () => {
    // clientX === width/2 → not < half → "next"
    expect(clickNavDirection(960, 1920)).toBe("next");
  });

  it("returns 'prev' for click at x=0", () => {
    expect(clickNavDirection(0, 1920)).toBe("prev");
  });

  it("works with different viewport widths", () => {
    expect(clickNavDirection(400, 1000)).toBe("prev");
    expect(clickNavDirection(600, 1000)).toBe("next");
  });
});
