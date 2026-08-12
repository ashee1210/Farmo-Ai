import { Bot, ChevronRight, Star, Zap, ArrowRight, Activity, Sun, Layers, Satellite, Landmark, ShieldCheck, Users } from "lucide-react";
import { KrishiNavbar } from "./Navbar.jsx";
import { KrishiFooter } from "./Footer.jsx";
import { AnimatedBackground } from "./AnimatedBackground.jsx";
import { features } from "./data.js";

const ICON_MAP = {
  Sprout: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8.5-7 4-14-6.5 0-10 5-10 14"/><path d="M13 20c0-6 3-10 5-12-2.5 0-5 1-5 12"/></svg>,
  Microscope: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18h8"/><path d="M3 21h18"/><path d="M14 21v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><path d="M10 5a2 2 0 0 1 2 2v4"/><path d="M14 7h-4"/><circle cx="12" cy="5" r="2"/></svg>,
  Droplets: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>,
  CloudRain: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>,
  TrendingUp: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Bot: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Layers: ({ className }) => <Layers className={className} />,
  Satellite: ({ className }) => <Satellite className={className} />,
  Landmark: ({ className }) => <Landmark className={className} />,
  ShieldCheck: ({ className }) => <ShieldCheck className={className} />,
  Users: ({ className }) => <Users className={className} />,
};

const TESTIMONIALS = [
  { name: "Rajan Nair", loc: "Palakkad", text: "FARMO AI detected rice blast disease early and saved my entire crop. Yield up 40% this season — incredible!", result: "+40% Yield", img: "https://images.unsplash.com/flagged/photo-1576106035594-69a5d049173f?w=56&h=56&fit=crop&auto=format" },
  { name: "Meera Krishnan", loc: "Thrissur", text: "The Malayalam support makes it feel like talking to a knowledgeable friend. AI market price alerts help me sell at exactly the right time.", result: "+₹28K/mo", img: "https://images.unsplash.com/photo-1607892408220-c80c0f8651d0?w=56&h=56&fit=crop&auto=format" },
  { name: "Suresh Pillai", loc: "Wayanad", text: "Price prediction is accurate. I held my corn for 3 extra weeks and earned 25% more than my neighbours. This app pays for itself.", result: "+25% Income", img: "https://images.unsplash.com/photo-1696371269777-88d1ce71642c?w=56&h=56&fit=crop&auto=format" },
];

export function LandingPage({ navigate }) {
  return (
    <div className="min-h-screen bg-white text-[#132B1A]">
      <KrishiNavbar navigate={navigate} currentPage="home" />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=1920&h=1080&fit=crop&auto=format" alt="Kerala paddy fields" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C]/97 via-[#0F2817]/88 to-[#071A0C]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A0C] via-transparent to-[#071A0C]/25" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[100px] pointer-events-none" />
        <AnimatedBackground variant="dark" density="medium" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 w-full grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-bold mb-8 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              AI-Powered Smart Farming Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight font-[Plus_Jakarta_Sans]">
              Smart Farming With<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] via-[#34D399] to-[#22D3EE]">
                Artificial Intelligence
              </span>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed mb-10 max-w-lg">
              Increase crop productivity using AI-based farming decisions — crop recommendations, disease detection, weather intelligence and market insights in one platform.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => navigate("login")} className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-base hover:bg-[#155030] transition-all shadow-xl shadow-green-900/40 active:scale-95">
                <Zap className="w-5 h-5" /> Start Farming
              </button>
              <button onClick={() => navigate("features")} className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-bold text-base hover:bg-white/18 transition-all">
                Explore Features <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 border-t border-white/12 pt-8">
              {[["10K+", "Farmers"], ["95%", "Prediction Accuracy"], ["50+", "Crop Analysis"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-extrabold text-white font-[Plus_Jakarta_Sans]">{v}</div>
                  <div className="text-sm text-white/50 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating dashboard cards */}
          <div className="relative hidden lg:block h-[520px]">
            <div className="absolute top-4 right-0 w-72 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#4ADE80]" />
                <span className="text-white/90 text-sm font-bold">Farm Health Monitor</span>
                <span className="ml-auto text-[10px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-2 py-0.5 rounded-full">LIVE</span>
              </div>
              {[["Rice Field A", 94], ["Wheat Plot", 88], ["Corn Field", 91], ["Cotton Farm", 85]].map(([n, v]) => (
                <div key={n} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1 text-white/60"><span>{n}</span><span className="text-[#4ADE80] font-bold">{v}%</span></div>
                  <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#4ADE80] to-[#34D399]" style={{ width: `${v}%` }} /></div>
                </div>
              ))}
            </div>

            <div className="absolute top-24 left-4 w-56 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-2"><span className="text-2xl">☀️</span><div><div className="text-white font-extrabold text-2xl leading-none">31°C</div><div className="text-white/50 text-xs">Palakkad · Today</div></div></div>
              <div className="text-white/45 text-xs mt-2">🌧️ Rain Thu–Fri · Harvest window open</div>
            </div>

            <div className="absolute bottom-20 left-0 w-64 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1B5E38]/80 border border-[#4ADE80]/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-[#4ADE80]" />
                </div>
                <div><div className="text-white/90 text-xs font-bold mb-1">AI Recommendation</div><div className="text-white/55 text-xs leading-relaxed">Your rice crop needs more water. Apply Urea 50 kg/ha before rain Thursday.</div></div>
              </div>
            </div>

            <div className="absolute bottom-4 right-2 w-56 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
              <div className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wider">Market Prices Today</div>
              {[["🌾 Rice", "₹2,180/qt", "+3.3%"], ["🌽 Corn", "₹1,680/qt", "+3.7%"], ["☁️ Cotton", "₹6,400/qt", "+4.9%"]].map(([i, p, c]) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-white/50 text-xs">{i}</span>
                  <span className="text-white text-xs font-bold">{p}</span>
                  <span className="text-[#4ADE80] text-[10px] font-bold">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES PREVIEW ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold mb-5 uppercase tracking-widest">
              <Zap className="w-3 h-3" /> {features.length} AI Tools
            </div>
            <h2 className="text-4xl font-extrabold text-[#132B1A] mb-4 font-[Plus_Jakarta_Sans]">Everything You Need to Farm Smarter</h2>
            <p className="text-[#5A6B58] text-lg max-w-xl mx-auto">Precision AI tools designed for Indian agriculture — tailored for your crops, soil and climate.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = ICON_MAP[f.iconName];
              return (
                <button key={f.id} onClick={() => navigate("feature-detail", { id: f.id })} className="group text-left bg-white border border-[#1B5E38]/10 rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-900/8 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center`}>
                      {Icon && <Icon className={`w-6 h-6 ${f.color}`} />}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#132B1A] mb-2">{f.title}</h3>
                  <p className="text-[#5A6B58] text-sm leading-relaxed mb-4">{f.shortDesc}</p>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#1B5E38] group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate("features")} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20">
              View All Features <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F6F4EE]/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold mb-5 uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Smart Farming Uses
            </div>
            <h2 className="text-4xl font-extrabold text-[#132B1A] mb-4 font-[Plus_Jakarta_Sans]">How Farmers Use FARMO AI</h2>
            <p className="text-[#5A6B58] text-lg max-w-2xl mx-auto">From crop planning to disease checks and market timing, the platform keeps farming decisions simple and practical.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["Crop Advice", "Know what to plant, when to apply nutrients, and how to improve field performance."],
              ["Disease Detection", "Upload crop images or use AI guidance to spot issues before they spread."],
              ["Weather Planning", "Check the right window for irrigation, harvest, and seasonal risk reduction."],
              ["Market Timing", "See price trends and demand signals to make better selling decisions."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white border border-[#1B5E38]/10 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-[#1B5E38]/10 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-[#1B5E38]" />
                </div>
                <h3 className="font-bold text-[#132B1A] mb-2">{title}</h3>
                <p className="text-[#5A6B58] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KrishiFooter navigate={navigate} />
    </div>
  );
}
