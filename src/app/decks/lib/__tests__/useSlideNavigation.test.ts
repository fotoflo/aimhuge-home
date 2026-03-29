import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSlideNavigation } from "../useSlideNavigation";

describe("useSlideNavigation", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("starts at slide 0 by default", () => {
    const { result } = renderHook(() => useSlideNavigation(5));
    expect(result.current.current).toBe(0);
  });

  it("respects startAt parameter", () => {
    const { result } = renderHook(() => useSlideNavigation(5, 2));
    expect(result.current.current).toBe(2);
  });

  it("reads initial slide from URL hash", () => {
    window.location.hash = "#slide-3";
    const { result } = renderHook(() => useSlideNavigation(5));
    expect(result.current.current).toBe(2); // 0-indexed
  });

  it("navigates forward with next()", () => {
    const { result } = renderHook(() => useSlideNavigation(5));
    act(() => result.current.next());
    expect(result.current.current).toBe(1);
    expect(window.location.hash).toBe("#slide-2");
  });

  it("navigates backward with prev()", () => {
    window.location.hash = "#slide-3";
    const { result } = renderHook(() => useSlideNavigation(5));
    act(() => result.current.prev());
    expect(result.current.current).toBe(1);
    expect(window.location.hash).toBe("#slide-2");
  });

  it("wraps around forward from last slide", () => {
    window.location.hash = "#slide-5";
    const { result } = renderHook(() => useSlideNavigation(5));
    act(() => result.current.next());
    expect(result.current.current).toBe(0);
    expect(window.location.hash).toBe("#slide-1");
  });

  it("wraps around backward from first slide", () => {
    const { result } = renderHook(() => useSlideNavigation(5));
    act(() => result.current.prev());
    expect(result.current.current).toBe(4);
    expect(window.location.hash).toBe("#slide-5");
  });

  it("ignores invalid hash values and falls back to startAt", () => {
    window.location.hash = "#slide-999";
    const { result } = renderHook(() => useSlideNavigation(5, 1));
    expect(result.current.current).toBe(1);
  });

  it("ignores non-slide hash values", () => {
    window.location.hash = "#something-else";
    const { result } = renderHook(() => useSlideNavigation(5));
    expect(result.current.current).toBe(0);
  });

  it("updates current when hash changes externally", async () => {
    const { result } = renderHook(() => useSlideNavigation(5));
    expect(result.current.current).toBe(0);

    act(() => {
      window.location.hash = "#slide-4";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(result.current.current).toBe(3);
  });

  it("reports ready immediately", () => {
    const { result } = renderHook(() => useSlideNavigation(5));
    expect(result.current.ready).toBe(true);
  });
});
