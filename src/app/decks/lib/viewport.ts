/**
 * Compute the scale factor to fit a 1920×1080 slide into a viewport,
 * optionally multiplied by a zoom level.
 */
export function computeSlideScale(
  viewportWidth: number,
  viewportHeight: number,
  zoom = 1,
): number {
  const scaleX = viewportWidth / 1920;
  const scaleY = viewportHeight / 1080;
  return Math.min(scaleX, scaleY) * zoom;
}

/**
 * Clamp a zoom value to [0.25, 3].
 * Applies a wheel deltaY to the current zoom.
 */
export function applyWheelZoom(currentZoom: number, deltaY: number): number {
  return Math.max(0.25, Math.min(3, currentZoom - deltaY * 0.001));
}

/**
 * Determine navigation direction based on click position.
 * Returns "prev" if click is in the left half, "next" for right half.
 */
export function clickNavDirection(
  clientX: number,
  viewportWidth: number,
): "prev" | "next" {
  return clientX < viewportWidth / 2 ? "prev" : "next";
}
