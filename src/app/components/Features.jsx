import { Sprout, Microscope, CloudRain, TestTubes, Zap, TrendingUp, ChevronRight, } from "lucide-react";
const features = [
    {
        icon: Sprout,
        title: "AI Crop Recommendation",
        desc: "Personalized crop suggestions based on your soil, local climate, and current market demand across Kerala.",
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        border: "hover:border-emerald-200",
    },
    {
        icon: Microscope,
        title: "Plant Disease Detection",
        desc: "Upload a photo and get instant AI diagnosis of 200+ plant diseases with step-by-step treatment plans.",
        bg: "bg-rose-50",
        iconColor: "text-rose-600",
        border: "hover:border-rose-200",
    },
    {
        icon: CloudRain,
        title: "Weather Intelligence",
        desc: "Hyperlocal 7-day forecasts with farming-specific alerts — rain, harvest windows, and spray advisories.",
        bg: "bg-sky-50",
        iconColor: "text-sky-600",
        border: "hover:border-sky-200",
    },
    {
        icon: TestTubes,
        title: "Soil Analysis",
        desc: "Monitor NPK levels, pH, and organic matter. Get AI-powered soil improvement plans in minutes.",
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
        border: "hover:border-amber-200",
    },
    {
        icon: Zap,
        title: "Smart Fertilizer Advice",
        desc: "AI calculates the optimal fertilizer mix and application schedule for maximum yield at minimum cost.",
        bg: "bg-violet-50",
        iconColor: "text-violet-600",
        border: "hover:border-violet-200",
    },
    {
        icon: TrendingUp,
        title: "Market Price Prediction",
        desc: "Real-time mandi prices and 30-day AI forecasts for all major Kerala crops. Know when to sell.",
        bg: "bg-teal-50",
        iconColor: "text-teal-600",
        border: "hover:border-teal-200",
    },
];
export function Features() {
    return (<section id="features" className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold mb-5 uppercase tracking-widest">
            <Zap className="w-3 h-3"/>
            Six AI-Powered Tools
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
            Everything a Kerala Farmer Needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Six precision AI tools designed specifically for Kerala's unique
            crops, soil types, and monsoon patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {features.map((f, i) => (<div key={f.title} className={`group bg-card border border-border ${f.border} rounded-2xl p-7 hover:shadow-2xl hover:shadow-green-900/6 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer`}>
              <div className="flex items-start justify-between mb-5">
                <div className={`w-13 h-13 w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`}/>
                </div>
                <span className="text-xs font-bold text-muted-foreground/60 tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-2.5">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-bold text-[#1B5E38] group-hover:gap-2 transition-all">
                Learn more
                <ChevronRight className="w-4 h-4"/>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
