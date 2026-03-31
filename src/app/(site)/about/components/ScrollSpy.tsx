"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Map, Overlay } from "pigeon-maps";
import createGlobe from "cobe";

type SectionConfig = {
  id: string;
  label: string;
  type: "text" | "map" | "globe" | "user";
  zoom?: number;
  center?: [number, number];
  pins?: { lat: number; lng: number; label: string; primary: boolean }[];
};

const sectionsConfig: SectionConfig[] = [
  { id: "hero", label: "Intro", type: "text" },
  {
    id: "new-york",
    label: "New York Roots",
    type: "map",
    zoom: 12,
    center: [40.7308, -73.9973], // Washington Square Park
    pins: [{ lat: 40.7308, lng: -73.9973, label: "Manhattan", primary: true }],
  },
  {
    id: "first-exit",
    label: "First Exit",
    type: "map",
    zoom: 10,
    center: [41.2939, -82.2174], // Oberlin
    pins: [{ lat: 41.2939, lng: -82.2174, label: "Oberlin", primary: true }],
  },
  {
    id: "harvard",
    label: "Harvard Summer",
    type: "map",
    zoom: 13,
    center: [42.377, -71.1167], // Harvard
    pins: [{ lat: 42.377, lng: -71.1167, label: "Harvard", primary: true }],
  },
  {
    id: "china",
    label: "My Time In China",
    type: "map",
    zoom: 3.5,
    center: [35.8617, 108.1954], // China center shifted slightly for balance
    pins: [
      { lat: 39.9042, lng: 116.4074, label: "Beijing", primary: true },
      { lat: 31.2304, lng: 121.4737, label: "Shanghai", primary: false },
      { lat: 23.1291, lng: 113.2644, label: "Guangzhou", primary: false },
      { lat: 25.0425, lng: 102.7107, label: "Kunming", primary: false },
      { lat: 30.6586, lng: 104.0649, label: "Chengdu", primary: false },
      { lat: 34.3416, lng: 108.9398, label: "Xi'an", primary: false },
      { lat: 36.4026, lng: 94.9037, label: "Golmud", primary: false },
      { lat: 36.0611, lng: 103.8343, label: "Lanzhou", primary: false },
      { lat: 22.3193, lng: 114.1694, label: "Hong Kong", primary: false },
      { lat: 36.0671, lng: 120.3826, label: "Qingdao", primary: false },
      { lat: 24.4798, lng: 118.0894, label: "Xiamen", primary: false },
      { lat: 22.5431, lng: 114.0579, label: "Shenzhen", primary: false },
    ],
  },
  {
    id: "500-startups",
    label: "500 Startups",
    type: "map",
    zoom: 8,
    center: [37.58, -122.25], // Bay Area
    pins: [
      { lat: 37.3861, lng: -122.0839, label: "Mountain View", primary: true },
      { lat: 37.7749, lng: -122.4194, label: "San Francisco", primary: true },
    ],
  },
  {
    id: "accelerating-asia",
    label: "Accelerating Asia",
    type: "map",
    zoom: 4,
    center: [5, 105], // SE Asia Center
    pins: [
      { lat: 1.3521, lng: 103.8198, label: "Singapore", primary: true },
      { lat: -8.4095, lng: 115.1889, label: "Bali", primary: false },
      { lat: 18.7953, lng: 98.962, label: "Chiang Mai", primary: false },
      { lat: 5.4141, lng: 100.3288, label: "Penang", primary: false },
    ],
  },
  {
    id: "asia",
    label: "25+ Years In Asia",
    type: "map",
    zoom: 2,
    center: [25, 110], // Broad Asia
    pins: [],
  },
  { id: "ai-advisor", label: "AI Advisor", type: "text" },
  { id: "beyond-work", label: "Beyond Work", type: "text" },
  { id: "languages", label: "Languages", type: "globe" },
  { id: "newsletter", label: "Stay In The Loop", type: "user" },
];

function darkMatterProvider(x: number, y: number, z: number, dpr?: number) {
  return `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${z}/${x}/${y}${dpr && dpr >= 2 ? "@2x" : ""}.png`;
}

// Minimalistic rotating globe for the "I Speak Computer" feature
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600,
      height: 600,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.08, 0.08, 0.08], // Very dark globe body
      markerColor: [0.486, 0.361, 0.988], // Accent #7c5cfc
      glowColor: [0.1, 0.1, 0.1], // Soft dark halo
      markers: [],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => globe.destroy();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", maxWidth: 300, aspectRatio: 1 }}
        className="opacity-90"
      />
    </div>
  );
}

export function ScrollSpy() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city: string} | null>(null);

  // Grab the reader's approximate location over Vercel Edge upon component mount
  useEffect(() => {
    fetch("/api/geo")
      .then(res => res.json())
      .then(data => setUserLocation(data))
      .catch(() => {});
  }, []);

  // Update active section natively via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px" } // Triggers only firmly in the middle horizontal third
    );

    sectionsConfig.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const activeConfig = useMemo(() => sectionsConfig.find(s => s.id === activeId) || sectionsConfig[0], [activeId]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-[45%] flex-row items-center gap-6 z-40 pointer-events-none">
      
      {/* The Dynamic Context / Telemetry Card */}
      <div 
        className={`relative w-[320px] h-[320px] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto border border-white/10 bg-[#0d0d0d] backdrop-blur-3xl transform ${
          activeConfig.type === "text" ? "opacity-0 scale-90 translate-x-12" : "opacity-100 scale-100 translate-x-0"
        }`}
      >
        {activeConfig.type === "globe" && <Globe />}
        
        {/* Render Dynamic Fly Map */}
        {(activeConfig.type === "map" || activeConfig.type === "user") && (
          <Map
            provider={darkMatterProvider}
            center={activeConfig.type === "user" ? (userLocation ? [userLocation.lat, userLocation.lng] : [0,0]) : activeConfig.center}
            zoom={activeConfig.type === "user" ? (userLocation ? 10 : 2) : activeConfig.zoom}
            animate={true}
            animateMaxScreens={8}
            mouseEvents={false}
            touchEvents={false}
          >
            {activeConfig.type === "map" && activeConfig.pins?.map((pin, i) => (
              <Overlay key={i} anchor={[pin.lat, pin.lng]} offset={[12, 12]}>
                <div className="flex items-center gap-2 -translate-y-1/2 -translate-x-1/2 group-pin">
                  <div className={`rounded-full shadow-[0_0_12px_rgba(124,92,252,0.8)] transition-transform duration-500 ease-out scale-in ${pin.primary ? "w-3 h-3 bg-accent animate-pulse" : "w-1.5 h-1.5 bg-accent/70"}`} style={{ animation: `fill-in 0.5s ease-out ${i * 0.05}s both`}} />
                  {pin.primary && (
                    <span className="text-white text-[10px] font-bold tracking-[0.1em] uppercase bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/10 whitespace-nowrap opacity-90 transition-opacity">
                      {pin.label}
                    </span>
                  )}
                </div>
              </Overlay>
            ))}

            {activeConfig.type === "user" && userLocation && (
              <Overlay anchor={[userLocation.lat, userLocation.lng]} offset={[12, 12]}>
                <div className="flex flex-col items-center gap-1.5 -translate-y-full -translate-x-1/2 -mt-2">
                  <span className="text-white text-[10px] font-bold tracking-[0.1em] uppercase bg-accent px-2 py-1 rounded shadow-[0_0_20px_var(--accent)] border border-white/20 whitespace-nowrap animate-fade-up">
                    {userLocation.city}
                  </span>
                  <div className="w-3.5 h-3.5 bg-accent rounded-full border border-white/50 shadow-[0_0_15px_var(--accent)] animate-pulse" />
                </div>
              </Overlay>
            )}
          </Map>
        )}

        {/* Glare and Ambient Borders */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none mix-blend-screen" />
      </div>

      {/* The Navigation Edge Rail */}
      <div className="flex flex-col gap-[14px] pointer-events-auto items-end py-6">
        {sectionsConfig.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="group relative flex items-center justify-end w-40"
              aria-label={label}
            >
              <span
                className={`absolute right-5 text-[11px] font-medium tracking-wide transition-all duration-300 pointer-events-none text-right whitespace-nowrap ${
                  isActive
                    ? "opacity-100 translate-x-0 text-white"
                    : "opacity-0 translate-x-1 text-muted group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {label}
              </span>

              <div
                className={`w-1 rounded-full transition-all duration-[400ms] ease-out transform origin-right ${
                  isActive
                    ? "h-8 bg-accent shadow-[0_0_15px_var(--accent)]"
                    : "h-1 bg-card-border/60 group-hover:bg-muted group-hover:h-3"
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {/* Small inject for keyframe animations on mounting pins */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fill-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
