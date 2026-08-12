import { Bot, ChevronRight, ChevronDown, Activity } from "lucide-react";

export function Hero({ onGetStarted }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Bg image + overlays */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=1920&h=1080&fit=crop&auto=format"
          alt="Kerala paddy fields"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C]/97 via-[#0F2417]/88 to-[#071A0C]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A0C] via-transparent to-[#071A0C]/30" />
      </div>

      {/* Ambient glows */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-sky-400/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-14 items-center w-full">
        {/* ── Left: Copy ── */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            AI-Powered Smart Farming for Kerala
          </div>

          <h1 className="text-5xl lg:text-[3.6rem] font-extrabold text-white leading-[1.1] mb-6 tracking-tight font-[Plus_Jakarta_Sans]">
            Empowering<br />
            Kerala Farmers<br />
            with{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] via-[#34D399] to-[#22D3EE]">
                AI Smart Farming
              </span>
            </span>
          </h1>

          <p className="text-lg text-white/65 leading-relaxed mb-10 max-w-lg">
            Get personalized crop advice, instant disease detection, weather
            intelligence and market insights — powered by AI, available in
            Malayalam and English.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button onClick={onGetStarted} className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-base hover:bg-[#155030] transition-all shadow-xl shadow-green-900/40 active:scale-95">
              <Bot className="w-5 h-5" />
              Try AI Assistant
            </button>
            <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-bold text-base hover:bg-white/18 transition-all">
              Explore Features
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-8 border-t border-white/10 pt-8">
            {[
              ["12,000+", "Active Farmers"],
              ["98%", "AI Accuracy"],
              ["6", "Smart Tools"],
              ["3", "Languages"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-extrabold text-white font-[Plus_Jakarta_Sans]">
                  {num}
                </div>
                <div className="text-sm text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Floating UI cards ── */}
        <div className="relative hidden lg:block h-[540px]">
          {/* Main health monitor */}
          <div className="absolute top-6 right-0 w-72 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#4ADE80]" />
              <span className="text-white/90 text-sm font-bold">
                Crop Health Monitor
              </span>
              <span className="ml-auto text-[10px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <div className="space-y-3.5">
              {[
                ["Paddy Field — Plot A", 94, "#4ADE80"],
                ["Coconut Grove — North", 87, "#34D399"],
                ["Banana Plantation", 91, "#22D3EE"],
              ].map(([label, val, color]) => (
                <div key={String(label)}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{label}</span>
                    <span className="font-bold" style={{ color: String(color) }}>
                      {val}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${val}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI recommendation */}
          <div className="absolute bottom-20 left-0 w-64 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1B5E38]/80 flex items-center justify-center flex-shrink-0 border border-[#4ADE80]/30">
                <Bot className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div>
                <div className="text-white/90 text-xs font-bold mb-1">
                  AI Recommendation
                </div>
                <div className="text-white/55 text-xs leading-relaxed">
                  Apply 25 kg urea in next 48 hrs. Heavy rain expected Thursday — delay spraying.
                </div>
              </div>
            </div>
          </div>

          {/* Weather card */}
          <div className="absolute top-24 left-4 w-56 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">☀️</span>
              <div>
                <div className="text-white font-extrabold text-2xl leading-none">31°C</div>
                <div className="text-white/50 text-xs mt-0.5">Palakkad, Kerala</div>
              </div>
            </div>
            <div className="h-px bg-white/10 mb-3" />
            <div className="text-white/45 text-xs">
              🌧️ Rain in 3 days &nbsp;·&nbsp; Harvest window open
            </div>
          </div>

          {/* Market card */}
          <div className="absolute bottom-6 right-2 w-60 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
            <div className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wider">
              Market Prices Today
            </div>
            <div className="space-y-2">
              {[
                ["🌾 Paddy (Quintal)", "₹2,180", "+3.2%"],
                ["🥥 Coconut (100 nos)", "₹2,800", "+1.1%"],
                ["🍌 Banana (Bunch)", "₹320", "+0.8%"],
              ].map(([item, price, change]) => (
                <div key={String(item)} className="flex items-center justify-between">
                  <span className="text-white/55 text-xs">{item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-bold">{price}</span>
                    <span className="text-[#4ADE80] text-[10px] font-bold">{change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/35 text-xs">
        <span className="tracking-widest uppercase text-[10px]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
