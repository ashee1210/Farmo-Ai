import { ArrowLeft, CheckCircle, ChevronRight, Zap, Layers, Satellite, Landmark, ShieldCheck, Users } from "lucide-react";
import { KrishiNavbar } from "./Navbar.jsx";
import { KrishiFooter } from "./Footer.jsx";
import { AnimatedBackground } from "./AnimatedBackground.jsx";
import { features } from "./data.js";

const ICONS = {
  Sprout: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8.5-7 4-14-6.5 0-10 5-10 14"/><path d="M13 20c0-6 3-10 5-12-2.5 0-5 1-5 12"/></svg>,
  Microscope: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18h8"/><path d="M3 21h18"/><path d="M14 21v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><circle cx="12" cy="5" r="2"/><path d="M10 5a2 2 0 0 1 2 2v4"/><path d="M14 7h-4"/></svg>,
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

const IMGS = {
  "crop-recommendation": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=380&fit=crop&auto=format",
  "disease-detection": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&h=380&fit=crop&auto=format",
  "smart-irrigation": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=380&fit=crop&auto=format",
  "weather-prediction": "https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&h=380&fit=crop&auto=format",
  "market-price": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=380&fit=crop&auto=format",
  "ai-assistant": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=380&fit=crop&auto=format",
  "soil-health": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=380&fit=crop&auto=format",
  "iot-drone": "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&h=380&fit=crop&auto=format",
  "govt-schemes": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=380&fit=crop&auto=format",
  "crop-insurance": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=380&fit=crop&auto=format",
  "community": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=380&fit=crop&auto=format",
};

function FeatureDetail({ id, navigate }) {
  const f = features.find(x => x.id === id);
  if (!f) return null;
  const Icon = ICONS[f.iconName];
  return (
    <div className="min-h-screen bg-white">
      <KrishiNavbar navigate={navigate} currentPage="features" />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <button onClick={() => navigate("features")} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Features
        </button>

        <div className="relative rounded-3xl overflow-hidden mb-10 bg-[#071A0C]">
          <img src={IMGS[f.id]} alt={f.title} className="w-full h-60 object-cover opacity-30" />
          <div className="absolute inset-0 flex items-center px-10">
            <div>
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                {Icon && <Icon className={`w-7 h-7 ${f.color}`} />}
              </div>
              <h1 className="text-4xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-3">{f.title}</h1>
              <p className="text-white/65 text-lg max-w-xl">{f.shortDesc}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-7">
              <h2 className="text-xl font-bold text-[#132B1A] mb-4 font-[Plus_Jakarta_Sans]">About This Feature</h2>
              <p className="text-[#5A6B58] leading-relaxed">{f.description}</p>
            </div>
            <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-7">
              <h2 className="text-xl font-bold text-[#132B1A] mb-5 font-[Plus_Jakarta_Sans]">How the AI Works</h2>
              <div className="space-y-4">
                {f.howItWorks.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#1B5E38] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <p className="text-[#5A6B58] text-sm leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-7">
              <h2 className="text-xl font-bold text-[#132B1A] mb-5 font-[Plus_Jakarta_Sans]">Key Benefits</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {f.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1B5E38] flex-shrink-0" />
                    <span className="text-sm text-[#5A6B58]">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#071A0C] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-5">Sample Results</h3>
              {f.stats.map(s => (
                <div key={s.label} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50 text-xs">{s.label}</span>
                    <span className="text-xl font-extrabold text-[#4ADE80] font-[Plus_Jakarta_Sans]">{s.value}</span>
                  </div>
                  <div className="h-px bg-white/8" />
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[#1B5E38] to-[#0F3D24] rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Try This Feature</h3>
              <p className="text-white/60 text-sm mb-5">Access all 6 AI tools in your personalised farmer dashboard.</p>
              <button onClick={() => navigate("login")} className="w-full py-3 rounded-xl bg-white text-[#1B5E38] font-bold text-sm hover:bg-white/90 transition-colors">
                Get Started Free →
              </button>
            </div>
            <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-5">
              <h3 className="font-bold text-[#132B1A] mb-4 text-sm">Other Features</h3>
              {features.filter(x => x.id !== id).map(x => {
                const XI = ICONS[x.iconName];
                return (
                  <button key={x.id} onClick={() => navigate("feature-detail", { id: x.id })} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEF7F1] transition-colors group mb-1">
                    <div className={`w-7 h-7 rounded-lg ${x.bg} flex items-center justify-center`}>{XI && <XI className={`w-3.5 h-3.5 ${x.color}`} />}</div>
                    <span className="text-[#132B1A] text-xs font-semibold flex-1 text-left">{x.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#5A6B58] group-hover:text-[#1B5E38]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 bg-[#F6F4EE] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-extrabold text-[#132B1A] text-xl font-[Plus_Jakarta_Sans]">Ready to try {f.title}?</h3>
            <p className="text-[#5A6B58] text-sm mt-1">Free to start. No credit card required.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("login")} className="px-6 py-3 rounded-xl bg-[#1B5E38] text-white font-bold hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20">Start Free →</button>
            <button onClick={() => navigate("pricing")} className="px-6 py-3 rounded-xl border border-[#1B5E38] text-[#1B5E38] font-bold hover:bg-emerald-50 transition-all">See Pricing</button>
          </div>
        </div>
      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}

export function FeaturesPage({ navigate, featureId }) {
  if (featureId) return <FeatureDetail id={featureId} navigate={navigate} />;

  return (
    <div className="min-h-screen bg-white">
      <KrishiNavbar navigate={navigate} currentPage="features" />
      <div className="relative bg-[#071A0C] pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/8 blur-[80px]" />
        <AnimatedBackground variant="dark" density="low" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] text-xs font-bold mb-5 uppercase tracking-widest">
            <Zap className="w-3 h-3" /> {features.length} AI-Powered Tools
          </div>
          <h1 className="text-5xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-5">Platform Features</h1>
          <p className="text-white/60 text-lg">Six precision AI tools built for Indian agriculture — click any feature to learn more.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = ICONS[f.iconName];
            return (
              <button key={f.id} onClick={() => navigate("feature-detail", { id: f.id })} className="group text-left bg-white border border-[#1B5E38]/10 rounded-2xl p-7 hover:shadow-2xl hover:shadow-green-900/8 hover:-translate-y-1.5 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center`}>
                    {Icon && <Icon className={`w-6 h-6 ${f.color}`} />}
                  </div>
                  <span className="text-xs font-bold text-[#5A6B58]/40 tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="font-extrabold text-[#132B1A] mb-3">{f.title}</h3>
                <p className="text-[#5A6B58] text-sm leading-relaxed mb-5">{f.shortDesc}</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {f.stats.slice(0, 2).map(s => (
                    <div key={s.label} className="bg-[#F6F4EE] rounded-xl p-2.5 text-center">
                      <div className={`font-extrabold text-sm ${f.color}`}>{s.value}</div>
                      <div className="text-[10px] text-[#5A6B58] mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-[#1B5E38] group-hover:gap-2 transition-all">
                  View Details <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-[#071A0C] to-[#1B5E38] rounded-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-3">Access All 6 Features Free</h3>
            <p className="text-white/60 max-w-md">Start with our free plan — includes AI crop advice, disease detection, weather alerts and market prices. Upgrade anytime.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={() => navigate("login")} className="px-7 py-3.5 rounded-xl bg-white text-[#1B5E38] font-bold hover:bg-white/90 transition-all shadow-lg">Get Started Free</button>
            <button onClick={() => navigate("pricing")} className="px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/18 transition-all">See Pricing</button>
          </div>
        </div>
      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}
