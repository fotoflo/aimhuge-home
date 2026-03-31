"use client";

import { useState, useRef } from "react";
import { CheckCircle2, Loader2, Mail, Phone } from "lucide-react";
import { subscribeAction } from "@/app/actions/subscribe";

export function NewsletterCTA({ sourcePage = "unknown" }: { sourcePage?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmail = inputValue.includes("@");
  const isPhone = !isEmail && inputValue.replace(/\D/g, "").length >= 7;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    if (!inputValue.trim()) {
      setStatus("error");
      setErrorMessage("Please enter an email or WhatsApp number");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("sourcePage", sourcePage);

    try {
      // Small artificial delay to show off the loading animation
      await new Promise((resolve) => setTimeout(resolve, 600)); 
      
      const result = await subscribeAction(null, formData);
      
      if (result?.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative isolate w-full max-w-2xl mx-auto py-16 px-6 sm:py-24 sm:px-12 rounded-3xl overflow-hidden mt-12 mb-20 group">
      {/* Background layers */}
      <div className="absolute inset-0 bg-card-bg/50 backdrop-blur-md border border-card-border rounded-3xl -z-10 transition-colors duration-500 group-hover:bg-card-bg/80" />
      <div className="absolute inset-0 grain opacity-20 -z-10 mix-blend-overlay rounded-3xl" />
      
      {/* Animated Glowing Accent Gradient */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 rounded-3xl -z-20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-1000 animate-pulse" />
      
      {/* Corner Details */}
      <div className="absolute top-0 left-6 w-px h-12 bg-gradient-to-b from-accent/50 to-transparent -z-10" />
      <div className="absolute bottom-0 right-6 w-px h-12 bg-gradient-to-t from-accent/50 to-transparent -z-10" />

      <div className="text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Stay in the loop
        </h2>
        <p className="text-muted text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          Drop your email or WhatsApp to get notified when I&apos;m in your city, drop a new video, or release new tools.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <div className={`relative flex items-center transition-all duration-500 ${status === "success" ? "scale-95 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}>
            
            {/* Input Field Form Container */}
            <div className={`absolute inset-0 bg-surface border rounded-full transition-all duration-300 ${status === "error" ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "border-card-border focus-within:border-accent/70 focus-within:shadow-[0_0_30px_rgba(124,92,252,0.15)]"}`} />
            
            {/* Input Icon matching Email or Phone */}
            <div className="absolute left-5 text-muted transition-colors duration-300 z-10 group-focus-within/input:text-accent">
              {isEmail ? <Mail size={20} /> : isPhone ? <Phone size={20} /> : <div className="w-5 h-5 rounded-full border border-muted/30" />}
            </div>

            <input
              ref={inputRef}
              type="text"
              name="contactInfo"
              placeholder="Email or WhatsApp number..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              disabled={status === "loading" || status === "success"}
              className="w-full bg-transparent py-4 pl-14 pr-32 text-foreground placeholder:text-muted focus:outline-none focus:ring-0 rounded-full z-10 peer group/input h-[60px]"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success" || !inputValue.trim()}
              className={`absolute right-2 top-2 bottom-2 bg-accent text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center z-10 overflow-hidden ${
                status === "loading" ? "w-12 px-0 bg-accent/80" : "px-6 w-auto hover:bg-accent-hover hover:scale-105 active:scale-95"
              } disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <span className={`transition-all duration-300 whitespace-nowrap ${status === "loading" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
                  Join List
                </span>
                <Loader2 size={20} className={`absolute animate-spin transition-all duration-300 ${status === "loading" ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
              </div>
            </button>
          </div>

          {/* Success State Overlay */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${status === "success" ? "opacity-100 scale-100 z-20" : "opacity-0 scale-75 -z-10 pointer-events-none"}`}>
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent animate-pulse">
              <CheckCircle2 size={32} strokeWidth={2.5} className="animate-scale-in" />
            </div>
            <p className="text-xl font-bold text-foreground">You&apos;re on the list!</p>
            <p className="text-muted text-sm mt-1">Talk to you soon.</p>
          </div>

          {/* Error Message */}
          <div className={`absolute -bottom-8 left-0 right-0 text-center transition-all duration-300 ${status === "error" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            <p className="text-sm text-red-400 font-medium">{errorMessage}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
