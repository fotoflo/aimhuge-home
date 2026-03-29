import { describe, it, expect } from "vitest";
import {
  currentAfterReorder,
  computeIndent,
  widthToClass,
  buildImageTag,
  parseCropFromStyle,
  parseWidthFromClass,
  findImageTagInMdx,
  clampCrop,
  computeResize,
  computeCropEdge,
} from "../editor-utils";
import type { SlideFrontmatter } from "../mdx-types";

// ── currentAfterReorder ──

describe("currentAfterReorder", () => {
  it("follows the dragged slide when it is selected", () => {
    // Slide 1 (selected) dragged to position 3
    expect(currentAfterReorder(1, 1, 3)).toBe(3);
  });

  it("follows the dragged slide when moved backward", () => {
    expect(currentAfterReorder(3, 3, 0)).toBe(0);
  });

  it("shifts selected down when a slide above is dragged below it", () => {
    // Selected: 2, drag slide 1 → 4  →  selected should become 1
    expect(currentAfterReorder(2, 1, 4)).toBe(1);
  });

  it("shifts selected up when a slide below is dragged above it", () => {
    // Selected: 2, drag slide 4 → 1  →  selected should become 3
    expect(currentAfterReorder(2, 4, 1)).toBe(3);
  });

  it("does not change when the drag does not cross the selected slide", () => {
    // Selected: 0, drag slide 3 → 5
    expect(currentAfterReorder(0, 3, 5)).toBe(0);
  });

  it("handles drag to adjacent position forward", () => {
    expect(currentAfterReorder(2, 2, 3)).toBe(3);
  });

  it("handles drag to adjacent position backward", () => {
    expect(currentAfterReorder(2, 2, 1)).toBe(1);
  });

  it("returns current when oldIndex equals newIndex (no-op)", () => {
    expect(currentAfterReorder(3, 2, 2)).toBe(3);
  });
});

// ── computeIndent ──

describe("computeIndent", () => {
  const fm = (level?: number): SlideFrontmatter =>
    ({ order: 0, variant: "dark" as const, level }) as SlideFrontmatter;

  describe("indent", () => {
    it("indents a top-level slide to level 1", () => {
      expect(computeIndent("indent", 1, fm(0))).toBe(1);
    });

    it("indents a slide with no level set (defaults to 0)", () => {
      expect(computeIndent("indent", 2, fm())).toBe(1);
    });

    it("rejects indent on first slide", () => {
      expect(computeIndent("indent", 0, fm(0))).toBeNull();
    });

    it("rejects indent when already at max level", () => {
      expect(computeIndent("indent", 2, fm(1))).toBeNull();
    });
  });

  describe("outdent", () => {
    it("outdents a level-1 slide to level 0", () => {
      expect(computeIndent("outdent", 1, fm(1))).toBe(0);
    });

    it("rejects outdent when already at level 0", () => {
      expect(computeIndent("outdent", 1, fm(0))).toBeNull();
    });

    it("rejects outdent when level is not set (defaults to 0)", () => {
      expect(computeIndent("outdent", 1, fm())).toBeNull();
    });

    it("allows outdent on first slide if somehow at level 1", () => {
      expect(computeIndent("outdent", 0, fm(1))).toBe(0);
    });
  });
});

// ── widthToClass ──

describe("widthToClass", () => {
  it.each([
    [10, "w-1/4"],
    [25, "w-1/4"],
    [30, "w-1/3"],
    [35, "w-1/3"],
    [40, "w-2/5"],
    [45, "w-2/5"],
    [50, "w-1/2"],
    [55, "w-1/2"],
    [60, "w-2/3"],
    [68, "w-2/3"],
    [75, "w-3/4"],
    [80, "w-3/4"],
    [81, "w-full"],
    [100, "w-full"],
  ])("maps width %i → %s", (width, expected) => {
    expect(widthToClass(width)).toBe(expected);
  });
});

// ── buildImageTag ──

describe("buildImageTag", () => {
  const noCrop = { cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0 };

  it("builds a basic tag without crop", () => {
    const tag = buildImageTag("/img/test.png", 100, noCrop);
    expect(tag).toBe(
      '<img src="/img/test.png" alt="" className="w-full rounded-lg" />',
    );
  });

  it("applies the correct width class", () => {
    const tag = buildImageTag("/img/test.png", 50, noCrop);
    expect(tag).toContain('className="w-1/2 rounded-lg"');
  });

  it("includes clip-path style when cropped", () => {
    const crop = { cropTop: 10, cropRight: 5, cropBottom: 15, cropLeft: 0 };
    const tag = buildImageTag("/img/test.png", 100, crop);
    expect(tag).toContain('clipPath: "inset(10% 5% 15% 0%)"');
  });

  it("omits style when all crop values are 0", () => {
    const tag = buildImageTag("/img/test.png", 100, noCrop);
    expect(tag).not.toContain("style");
  });

  it("rounds fractional crop values", () => {
    const crop = { cropTop: 10.7, cropRight: 5.3, cropBottom: 0, cropLeft: 0 };
    const tag = buildImageTag("/img/test.png", 100, crop);
    expect(tag).toContain("inset(11% 5% 0% 0%)");
  });

  it("handles special characters in src", () => {
    const tag = buildImageTag("/img/photo (1).png", 100, noCrop);
    expect(tag).toContain('src="/img/photo (1).png"');
  });
});

// ── parseCropFromStyle ──

describe("parseCropFromStyle", () => {
  it("parses a standard inset clip-path", () => {
    expect(parseCropFromStyle("clip-path: inset(10% 5% 15% 0%)")).toEqual({
      cropTop: 10, cropRight: 5, cropBottom: 15, cropLeft: 0,
    });
  });

  it("returns zeros when no clip-path is present", () => {
    expect(parseCropFromStyle("color: red;")).toEqual({
      cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0,
    });
  });

  it("returns zeros for empty string", () => {
    expect(parseCropFromStyle("")).toEqual({
      cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0,
    });
  });

  it("handles decimal percentages", () => {
    expect(parseCropFromStyle("clip-path: inset(10.5% 5.3% 0% 0%)")).toEqual({
      cropTop: 10.5, cropRight: 5.3, cropBottom: 0, cropLeft: 0,
    });
  });

  it("handles clip-path among other styles", () => {
    const style = "border-radius: 8px; clip-path: inset(5% 10% 15% 20%); opacity: 1";
    expect(parseCropFromStyle(style)).toEqual({
      cropTop: 5, cropRight: 10, cropBottom: 15, cropLeft: 20,
    });
  });
});

// ── parseWidthFromClass ──

describe("parseWidthFromClass", () => {
  it.each([
    ["w-full rounded-lg", 100],
    ["w-1/2 rounded-lg", 50],
    ["w-1/3 rounded-lg", 33],
    ["w-2/3 rounded-lg", 66],
    ["w-1/4 rounded-lg", 25],
    ["w-3/4 rounded-lg", 75],
    ["w-2/5 rounded-lg", 40],
  ])("parses '%s' → %i", (cls, expected) => {
    expect(parseWidthFromClass(cls)).toBe(expected);
  });

  it("returns 100 for unknown classes", () => {
    expect(parseWidthFromClass("rounded-lg")).toBe(100);
  });

  it("returns 100 for empty string", () => {
    expect(parseWidthFromClass("")).toBe(100);
  });

  it("parses numeric w-48 style class", () => {
    // w-48 = 48/96 * 100 = 50
    expect(parseWidthFromClass("w-48")).toBe(50);
  });
});

// ── findImageTagInMdx ──

describe("findImageTagInMdx", () => {
  it("finds a self-closing img tag", () => {
    const mdx = 'Some text\n<img src="/photo.png" alt="" className="w-full" />\nMore text';
    expect(findImageTagInMdx(mdx, "/photo.png")).toBe(
      '<img src="/photo.png" alt="" className="w-full" />',
    );
  });

  it("finds a non-self-closing img tag", () => {
    const mdx = '<img src="/photo.png" alt="" className="w-full">';
    expect(findImageTagInMdx(mdx, "/photo.png")).toBe(
      '<img src="/photo.png" alt="" className="w-full">',
    );
  });

  it("returns empty string when not found", () => {
    expect(findImageTagInMdx("# Hello", "/missing.png")).toBe("");
  });

  it("handles src with double quotes in value (uses single-quote attr)", () => {
    const mdx = `<img src='has"quote.png' alt="" />`;
    expect(findImageTagInMdx(mdx, 'has"quote.png')).toBe(
      `<img src='has"quote.png' alt="" />`,
    );
  });

  it("finds the correct tag when multiple images exist", () => {
    const mdx = '<img src="/a.png" />\n<img src="/b.png" className="w-1/2" />';
    expect(findImageTagInMdx(mdx, "/b.png")).toContain('src="/b.png"');
    expect(findImageTagInMdx(mdx, "/b.png")).toContain("w-1/2");
  });
});

// ── clampCrop ──

describe("clampCrop", () => {
  it("clamps to 0 minimum", () => {
    expect(clampCrop(-10)).toBe(0);
  });

  it("clamps to 90 maximum", () => {
    expect(clampCrop(95)).toBe(90);
  });

  it("rounds to 1 decimal place", () => {
    expect(clampCrop(33.456)).toBe(33.5);
  });

  it("passes through valid values", () => {
    expect(clampCrop(45)).toBe(45);
  });

  it("handles 0", () => {
    expect(clampCrop(0)).toBe(0);
  });

  it("handles 90 exactly", () => {
    expect(clampCrop(90)).toBe(90);
  });
});

// ── computeResize ──

describe("computeResize", () => {
  it("increases width when dragging BR corner right", () => {
    // 50px drag on 1000px container = 5% increase from startWidth 50
    expect(computeResize(50, 50, 1000, "br")).toBe(55);
  });

  it("increases width when dragging TR corner right", () => {
    expect(computeResize(50, 50, 1000, "tr")).toBe(55);
  });

  it("decreases width when dragging TL corner right", () => {
    // TL/BL: width - delta
    expect(computeResize(50, 50, 1000, "tl")).toBe(45);
  });

  it("decreases width when dragging BL corner right", () => {
    expect(computeResize(50, 50, 1000, "bl")).toBe(45);
  });

  it("clamps to minimum 10%", () => {
    expect(computeResize(15, -100, 1000, "br")).toBe(10);
  });

  it("allows width above 100%", () => {
    expect(computeResize(90, 200, 1000, "br")).toBe(110);
  });
});

// ── computeCropEdge ──

describe("computeCropEdge", () => {
  const zeroCrop = { cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0 };
  const rect = { w: 500, h: 400 };

  it("increases cropTop when dragging top edge down", () => {
    const result = computeCropEdge("top", 0, 80, rect.w, rect.h, zeroCrop);
    expect(result.cropTop).toBe(20); // 80/400 * 100 = 20
    expect(result.cropRight).toBe(0);
    expect(result.cropBottom).toBe(0);
    expect(result.cropLeft).toBe(0);
  });

  it("increases cropBottom when dragging bottom edge up", () => {
    const result = computeCropEdge("bottom", 0, -80, rect.w, rect.h, zeroCrop);
    expect(result.cropBottom).toBe(20);
  });

  it("increases cropLeft when dragging left edge right", () => {
    const result = computeCropEdge("left", 100, 0, rect.w, rect.h, zeroCrop);
    expect(result.cropLeft).toBe(20); // 100/500 * 100 = 20
  });

  it("increases cropRight when dragging right edge left", () => {
    const result = computeCropEdge("right", -100, 0, rect.w, rect.h, zeroCrop);
    expect(result.cropRight).toBe(20);
  });

  it("clamps negative crop values to 0", () => {
    const result = computeCropEdge("top", 0, -50, rect.w, rect.h, zeroCrop);
    expect(result.cropTop).toBe(0);
  });

  it("clamps crop values to max 90", () => {
    const result = computeCropEdge("top", 0, 400, rect.w, rect.h, zeroCrop);
    expect(result.cropTop).toBe(90);
  });

  it("preserves other edges when dragging one", () => {
    const start = { cropTop: 10, cropRight: 20, cropBottom: 5, cropLeft: 15 };
    const result = computeCropEdge("top", 0, 40, rect.w, rect.h, start);
    expect(result.cropTop).toBe(20); // 10 + (40/400)*100 = 20
    expect(result.cropRight).toBe(20);
    expect(result.cropBottom).toBe(5);
    expect(result.cropLeft).toBe(15);
  });
});
