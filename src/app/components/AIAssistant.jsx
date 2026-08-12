import { useState } from "react";
import { Bot, CheckCircle, Sprout } from "lucide-react";
import { KrishiNavbar } from "../krishi/Navbar.jsx";
import { KrishiFooter } from "../krishi/Footer.jsx";

const initialMessages = [
  {
    role: "user",
    text: "എന്റെ നെൽ‌പ്പാടത്ത് ഇലകൾ മഞ്ഞ നിറത്തിൽ ആകുന്നു. എന്ത് ചെയ്യണം?",
  },
  {
    role: "ai",
    text: "ഇത് നൈട്രജൻ കുറവിന്റെ ലക്ഷണം ആണ്. Urea (46-0-0) ഹെക്ടർ ഒന്നിന് 50 kg വിതറുക. ഒരാഴ്ചക്ക് ശേഷം ഫലം കാണാം. ☘️",
  },
  {
    role: "user",
    text: "When should I harvest my paddy?",
  },
  {
    role: "ai",
    text: "Based on your location (Palakkad) and crop age of 95 days — harvest window opens in 8–12 days. Grain moisture should read 20–25%. Best time: early morning to avoid heat stress.",
  },
];

export function AIAssistant({ navigate }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Based on Kerala agricultural data and your soil profile, I recommend monitoring closely for 48 hours and applying foliar micronutrient spray if the condition persists. Would you like a detailed treatment plan?",
        },
      ]);
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-[#071A0C] flex flex-col">
      <KrishiNavbar navigate={navigate} currentPage="ai-assistant" />
      <div className="flex-1 pt-16">
        <section
          id="ai-assistant"
          className="py-20 bg-[#071A0C] relative overflow-hidden"
        >
      {/* Background texture */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1766671966028-618f17c3c51f?w=1920&h=800&fit=crop&auto=format"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-8"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C] to-[#071A0C]/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] text-xs font-bold mb-6 uppercase tracking-widest">
            <Bot className="w-3.5 h-3.5" />
            AI Farming Assistant
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Your Personal Farming
            <br />
            Expert — 24/7
          </h2>
          <p className="text-white/55 text-lg leading-relaxed mb-10">
            Get instant support for crop advice, disease checks, weather timing,
            and market decisions in Malayalam or English — wherever you are.
          </p>
          <div className="space-y-5">
            {[
              [
                "Malayalam & English Support",
                "Speak your language, get expert answers instantly",
              ],
              [
                "Voice Assistant Mode",
                "Just speak your question — no typing needed",
              ],
              [
                "Kerala Agriculture Trained",
                "Powered by data from Kerala Agricultural University",
              ],
            ].map(([title, desc]) => (
              <div key={String(title)} className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-[#4ADE80]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{title}</div>
                  <div className="text-white/40 text-sm mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center shadow-md shadow-green-900/40">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Farmo AI Assistant</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="text-[#4ADE80] text-xs font-medium">
                  Benefits at a glance
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
              <div className="text-white font-semibold text-sm mb-1">Instant, relevant advice</div>
              <div className="text-white/55 text-sm">Get crop, disease, and weather guidance in seconds without waiting for expert support.</div>
            </div>
            <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
              <div className="text-white font-semibold text-sm mb-1">Built for local farming</div>
              <div className="text-white/55 text-sm">Recommendations are tailored for Kerala conditions, field timing, and practical farm decisions.</div>
            </div>
            <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
              <div className="text-white font-semibold text-sm mb-1">Easy to use in your language</div>
              <div className="text-white/55 text-sm">Use Malayalam or English to ask what matters most for your crop, schedule, and market.</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[#4ADE80] text-xs font-bold uppercase tracking-widest mb-3">Reminder options</div>
            <div className="flex flex-wrap gap-2.5">
              {[
                "What fertilizer for rice?",
                "When to harvest paddy?",
                "Best price for corn?",
                "Monsoon advice?",
              ].map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-white/10 bg-white/8 px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-[#1B5E38]/60 hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
    <KrishiFooter navigate={navigate} />
    </div>
  );
}
