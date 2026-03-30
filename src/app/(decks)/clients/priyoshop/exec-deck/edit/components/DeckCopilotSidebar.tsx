"use client";

import { useState, useRef, useEffect } from "react";
import { Map, RefreshCw, Send, Sparkles, Trash2, X } from "lucide-react";
import type { SlideRow } from "@/app/decks/lib/slides-db";

interface DeckCopilotSidebarProps {
  deckSlug: string;
  slides: SlideRow[];
  onRefreshDeck: () => void;
  onClose: () => void;
}

interface Message {
  role: "user" | "model";
  text: string;
  id: string;
}

export function DeckCopilotSidebar({ deckSlug, slides, onRefreshDeck, onClose }: DeckCopilotSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "I'm your Deck Copilot. I have full vision of this narrative arc. I can reorder, rewrite, or delete multiple slides at once.\\n\\nWhat should we adjust?", id: "welcome" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user" as const, text: userText, id: crypto.randomUUID() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Summarize deck state for the agent map
      const currentDeckState = slides.map((s, idx) => ({
        id: s.id,
        order: s.slide_order || (idx + 1) * 10,
        title: s.frontmatter?.title || "Untitled",
        content: s.mdx_content
      }));

      // Only send previous human-bot interaction (excluding the welcome message)
      const historyToSend = newMessages.slice(1).map(m => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/decks/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckSlug,
          history: historyToSend,
          currentDeckState
        })
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "model", text: data.text || "Changes applied.", id: crypto.randomUUID() }]);

      if (data.needsRefresh) {
        onRefreshDeck();
      }

    } catch (e: unknown) {
      const err = e as Error;
      console.error(err);
      setMessages(prev => [...prev, { role: "model", text: `Error: ${err.message}`, id: crypto.randomUUID() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-white/10 bg-[#0a0a0e] flex flex-col shrink-0 relative h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 shrink-0 bg-[#0a0a0e] z-10">
        <h3 className="text-[10px] font-mono tracking-widest text-[#7c5cfc] uppercase font-bold flex items-center gap-1.5 opacity-90">
          <Map className="w-3.5 h-3.5" />
          Narrative Copilot
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
          title="Hide Deck Copilot"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {messages.map(m => (
          <div 
            key={m.id} 
            className={`max-w-[90%] rounded-xl p-3 text-[13px] leading-relaxed relative ${
              m.role === "user" 
                ? "bg-white/10 text-slate-200 text-right self-end border border-white/5" 
                : "bg-[#1b1b24] text-slate-300 self-start shadow-[0_0_15px_rgba(124,92,252,0.05)] border border-[#7c5cfc]/20"
            }`}
          >
            {m.role === "model" && (
              <Sparkles className="absolute -left-1 -top-1 w-3.5 h-3.5 text-[#7c5cfc]" />
            )}
            <div className="whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="max-w-[80%] bg-[#1b1b24] border border-[#7c5cfc]/20 rounded-xl p-3 text-[13px] text-slate-400 self-start flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-[#7c5cfc] animate-spin" />
            Rearranging architecture...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/5 bg-[#0a0a0e] shrink-0">
        <div className="relative group flex items-end bg-[#15151a] border border-white/10 focus-within:border-[#7c5cfc]/50 rounded-lg p-1 transition-colors shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="e.g. Move the market slides to the start..."
            className="w-full bg-transparent p-2 text-xs text-slate-200 placeholder-slate-600 outline-none resize-none min-h-[44px] max-h-32 [scrollbar-width:none]"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="p-2 m-1 bg-[#7c5cfc] hover:bg-[#6b4de0] disabled:bg-[#7c5cfc]/30 disabled:text-white/30 text-white rounded-md transition-colors self-end"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
           <span className="text-[9px] text-slate-600 uppercase font-mono tracking-widest">Global Agent</span>
           <button 
             onClick={() => setMessages([messages[0]])}
             className="text-[9px] text-slate-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1 transition-colors"
             title="Clear chat"
           >
             <Trash2 className="w-3 h-3" />
             Clear
           </button>
        </div>
      </div>
    </div>
  );
}
