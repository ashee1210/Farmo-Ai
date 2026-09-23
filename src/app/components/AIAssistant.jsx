import { useState, useEffect, useRef } from "react";
import { Bot, CheckCircle, Sprout, Send, Mic, Sparkles, RefreshCw, Zap } from "lucide-react";
import { KrishiNavbar } from "../krishi/Navbar.jsx";
import { KrishiFooter } from "../krishi/Footer.jsx";

const initialMessages = [
  {
    role: "user",
    text: "എന്റെ നെൽ‌പ്പാടത്ത് ഇലകൾ മഞ്ഞ നിറത്തിൽ ആകുന്നു. എന്ത് ചെയ്യണം?",
  },
  {
    role: "ai",
    text: "ഇത് നൈട്രജൻ കുറവിന്റെ ലക്ഷണമാണ്. Urea (46-0-0) ഹെക്ടറിന് 50 kg വിതറുക. വെള്ളക്കെട്ട് ഒഴിവാക്കി, മഴയ്ക്ക് മുമ്പ് പ്രയോഗിച്ചാൽ വേഗത്തിൽ ഫലം ലഭിക്കും. ☘️",
    source: "ollama",
    model: "Llama 3.2",
  },
  {
    role: "user",
    text: "When should I harvest my paddy crop?",
  },
  {
    role: "ai",
    text: "Paddy is typically ready for harvest when 80–85% of the panicles turn golden yellow and grain moisture reads 20–22%. Drain standing field water 7–10 days prior to harvest, and harvest in the early morning to avoid grain shattering.",
    source: "ollama",
    model: "Llama 3.2",
  },
];

export function AIAssistant({ navigate }) {
  return (
    <div className="min-h-screen bg-[#071A0C] flex flex-col">
      <KrishiNavbar navigate={navigate} currentPage="ai-assistant" />
      <div className="flex-1 pt-16">
        <section id="ai-assistant" className="py-20 bg-[#071A0C] relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=1920&h=800&fit=crop&auto=format"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C] via-[#071A0C]/90 to-[#071A0C]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Info & Value Prop */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] text-xs font-bold uppercase tracking-widest">
                <Bot className="w-3.5 h-3.5" />
                AI Farming Assistant
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight font-[Plus_Jakarta_Sans]">
                Your Personal Farming Expert — 24/7
              </h1>
              <p className="text-white/60 text-base leading-relaxed">
                Powered by FARMO AI (Llama 3.2), get instant answers on crop management, fertilizer dosage, disease cure, and market prices in Malayalam or English.
              </p>

              {/* Status Badge */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                  <div>
                    <div className="text-white text-xs font-bold flex items-center gap-1.5">
                      FARMO AI Assistant Active
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">Interactive Showcase</span>
                    </div>
                    <div className="text-white/45 text-[11px]">
                      Kerala Agricultural Intelligence Preview
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("login")}
                  className="px-3 py-1.5 rounded-xl bg-[#1B5E38] hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Zap className="w-3 h-3 text-[#4ADE80]" />
                  <span>Full Version</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  ["Malayalam & English Support", "Speak your language, get expert agricultural answers instantly."],
                  ["Voice Assistant Enabled", "Simply tap the mic to speak your question directly."],
                  ["Kerala Agriculture Grounded", "Trained on regional soil, monsoon patterns, and crop guidelines."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#4ADE80]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{title}</div>
                      <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Chat Showcase Interface */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center shadow-md shadow-green-950/40">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-sm flex items-center gap-2">
                      FARMO AI Assistant
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                    </div>
                    <div className="text-[#4ADE80] text-xs font-medium">
                      Ollama Llama 3.2 · Kerala Crop Intelligence
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  ML | EN | HI
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {initialMessages.map((m, i) => (
                  <div key={i} className={`flex gap-3 items-start animate-in fade-in duration-200 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {m.role === "ai" && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[84%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-[#1B5E38] text-white rounded-tr-sm shadow-md"
                          : "bg-white/10 text-white/90 border border-white/10 rounded-tl-sm backdrop-blur-sm shadow-sm"
                      }`}
                    >
                      <div className="whitespace-pre-line">{m.text}</div>
                      {m.role === "ai" && (
                        <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          {m.source === "ollama" ? `Ollama (${m.model || "Llama 3.2"}) Local AI` : "FARMO Agricultural AI"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}
