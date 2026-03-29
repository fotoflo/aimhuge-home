import type { SlideFrontmatter } from "./mdx-types";

// ── Image parsing (from DOM → editor state) ──

/**
 * Parse crop insets from a CSS style string containing clip-path: inset(...).
 * Returns all zeros if no clip-path is found.
 */
export function parseCropFromStyle(style: string): CropState {
  const match = style.match(/clip-path:\s*inset\(([^)]+)\)/);
  if (!match) return { cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0 };
  const parts = match[1].replace(/%/g, "").trim().split(/\s+/).map(Number);
  return {
    cropTop: parts[0] ?? 0,
    cropRight: parts[1] ?? 0,
    cropBottom: parts[2] ?? 0,
    cropLeft: parts[3] ?? 0,
  };
}

/**
 * Parse a Tailwind width class string into a percentage (0–100).
 * Inverse of `widthToClass`.
 */
export function parseWidthFromClass(classStr: string): number {
  if (classStr.includes("w-full")) return 100;
  if (classStr.includes("w-1/2")) return 50;
  if (classStr.includes("w-1/3")) return 33;
  if (classStr.includes("w-2/3")) return 66;
  if (classStr.includes("w-1/4")) return 25;
  if (classStr.includes("w-3/4")) return 75;
  if (classStr.includes("w-2/5")) return 40;
  const widthMatch = classStr.match(/w-(\d+)/);
  if (widthMatch) return Math.round((parseInt(widthMatch[1]) / 96) * 100);
  return 100;
}

/**
 * Find the `<img ... />` tag in MDX content that matches a given src.
 * Returns the matched tag string, or empty string if not found.
 */
export function findImageTagInMdx(mdxContent: string, src: string): string {
  const srcAttr = src.includes('"') ? `'${src}'` : `"${src}"`;
  const match =
    mdxContent.match(new RegExp(`<img[^>]*src=${srcAttr}[^>]*/>`)) ??
    mdxContent.match(new RegExp(`<img[^>]*src=${srcAttr}[^>]*>`));
  return match?.[0] ?? "";
}

// ── Image editor geometry ──

/**
 * Clamp a crop percentage to [0, 90] and round to 1 decimal place.
 */
export function clampCrop(value: number): number {
  return Math.round(Math.max(0, Math.min(90, value)) * 10) / 10;
}

/**
 * Compute a new width percentage after a corner-drag resize.
 *
 * @param startWidth  - width% when drag started
 * @param dx          - pointer delta in pixels
 * @param containerW  - container width in pixels
 * @param corner      - which corner is being dragged
 */
export function computeResize(
  startWidth: number,
  dx: number,
  containerW: number,
  corner: "tl" | "tr" | "bl" | "br",
): number {
  const delta = (dx / containerW) * 100;
  if (corner === "br" || corner === "tr") return Math.max(10, startWidth + delta);
  return Math.max(10, startWidth - delta);
}

/**
 * Compute new crop insets after dragging a crop edge.
 *
 * @param edge        - which edge is being dragged
 * @param dx          - pointer delta X in pixels
 * @param dy          - pointer delta Y in pixels
 * @param rectWidth   - image wrapper width in pixels
 * @param rectHeight  - image wrapper height in pixels
 * @param startCrop   - crop state when drag started
 */
export function computeCropEdge(
  edge: "top" | "right" | "bottom" | "left",
  dx: number,
  dy: number,
  rectWidth: number,
  rectHeight: number,
  startCrop: CropState,
): CropState {
  const crop = { ...startCrop };
  const dxPct = (dx / rectWidth) * 100;
  const dyPct = (dy / rectHeight) * 100;

  if (edge === "top") crop.cropTop = clampCrop(startCrop.cropTop + dyPct);
  else if (edge === "bottom") crop.cropBottom = clampCrop(startCrop.cropBottom - dyPct);
  else if (edge === "left") crop.cropLeft = clampCrop(startCrop.cropLeft + dxPct);
  else if (edge === "right") crop.cropRight = clampCrop(startCrop.cropRight - dxPct);

  return crop;
}

/**
 * Compute the new `current` index after a drag-reorder.
 * Returns the index that should remain selected so the user
 * keeps looking at the same slide they had selected before the move.
 */
export function currentAfterReorder(
  current: number,
  oldIndex: number,
  newIndex: number,
): number {
  if (current === oldIndex) return newIndex;
  if (current > oldIndex && current <= newIndex) return current - 1;
  if (current < oldIndex && current >= newIndex) return current + 1;
  return current;
}

/**
 * Determine whether an indent/outdent operation is allowed,
 * and if so return the new level. Returns null when the operation
 * should be rejected.
 *
 * Rules:
 *  - First slide (index 0) cannot be indented.
 *  - Max level is 1 (2 visual levels: 0 and 1).
 *  - Cannot outdent past 0.
 */
export function computeIndent(
  direction: "indent" | "outdent",
  slideIndex: number,
  frontmatter: SlideFrontmatter,
): number | null {
  const currentLevel = frontmatter.level ?? 0;

  if (direction === "indent") {
    if (slideIndex === 0 || currentLevel >= 1) return null;
    return currentLevel + 1;
  }
  // outdent
  if (currentLevel <= 0) return null;
  return currentLevel - 1;
}

/**
 * Map a percentage width (0–100) to a Tailwind width class.
 */
export function widthToClass(width: number): string {
  if (width <= 25) return "w-1/4";
  if (width <= 35) return "w-1/3";
  if (width <= 45) return "w-2/5";
  if (width <= 55) return "w-1/2";
  if (width <= 68) return "w-2/3";
  if (width <= 80) return "w-3/4";
  return "w-full";
}

export interface CropState {
  cropTop: number;
  cropRight: number;
  cropBottom: number;
  cropLeft: number;
}

/**
 * Build an MDX `<img />` tag from image source, width, and crop values.
 */
export function buildImageTag(
  src: string,
  width: number,
  crop: CropState,
): string {
  const widthClass = widthToClass(width);
  const hasCrop =
    crop.cropTop > 0 ||
    crop.cropRight > 0 ||
    crop.cropBottom > 0 ||
    crop.cropLeft > 0;

  const clipStyle = hasCrop
    ? ` style={{ clipPath: "inset(${Math.round(crop.cropTop)}% ${Math.round(crop.cropRight)}% ${Math.round(crop.cropBottom)}% ${Math.round(crop.cropLeft)}%)" }}`
    : "";

  return `<img src="${src}" alt="" className="${widthClass} rounded-lg"${clipStyle} />`;
}
