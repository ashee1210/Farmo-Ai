import { Star, Users, Award, TrendingUp, ThumbsUp } from "lucide-react";
const testimonials = [
    {
        name: "Rajan Nair",
        location: "Palakkad, Kerala",
        crop: "Paddy Farmer",
        image: "https://images.unsplash.com/flagged/photo-1576106035594-69a5d049173f?w=80&h=80&fit=crop&auto=format",
        text: "Farmo AI saved my entire paddy crop last season by detecting blast disease early. My yield jumped by 40% and I finally feel in control of my farm.",
        improvement: "+40% Yield",
        rating: 5,
    },
    {
        name: "Meera Krishnan",
        location: "Thrissur, Kerala",
        crop: "Vegetable Farmer",
        image: "https://images.unsplash.com/photo-1607892408220-c80c0f8651d0?w=80&h=80&fit=crop&auto=format",
        text: "The Malayalam language support makes it feel like talking to a knowledgeable friend. Soil advice, weather alerts — everything in one app.",
        improvement: "+₹28,000/mo",
        rating: 5,
    },
    {
        name: "Suresh Pillai",
        location: "Wayanad, Kerala",
        crop: "Spice Farmer",
        image: "https://images.unsplash.com/photo-1696371269777-88d1ce71642c?w=80&h=80&fit=crop&auto=format",
        text: "Market price prediction helped me sell pepper at the perfect time. I earned 25% more than last year just by timing my sales with AI guidance.",
        improvement: "+25% Income",
        rating: 5,
    },
];
export function SuccessStories() {
    return (<section id="success-stories" className="py-28 bg-[#F0EDE4]/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold mb-5 uppercase tracking-widest">
            <Users className="w-3 h-3"/>
            Farmer Stories
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
            Real Farmers, Real Results
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Thousands of Kerala farmers have transformed their livelihoods
            with Farmo AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10 mt-14">
          {testimonials.map((t) => (<div key={t.name} className="bg-card border border-border rounded-2xl p-7 hover:shadow-2xl hover:shadow-green-900/7 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>))}
              </div>
              <p className="text-foreground/75 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3.5 pt-5 border-t border-border">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover bg-green-100 ring-2 ring-[#1B5E38]/15"/>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-sm">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {t.crop} · {t.location}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1B5E38] bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full flex-shrink-0">
                  {t.improvement}
                </span>
              </div>
            </div>))}
        </div>

        {/* Stats row */}
        <div className="bg-card border border-border rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            {
                icon: Users,
                val: "12,000+",
                label: "Active Farmers",
                color: "text-[#1B5E38]",
                bg: "bg-emerald-50",
            },
            {
                icon: Award,
                val: "98%",
                label: "Satisfaction Rate",
                color: "text-amber-600",
                bg: "bg-amber-50",
            },
            {
                icon: TrendingUp,
                val: "₹2.4 Cr",
                label: "Extra Income Generated",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
            },
            {
                icon: ThumbsUp,
                val: "50,000+",
                label: "AI Consultations",
                color: "text-sky-600",
                bg: "bg-sky-50",
            },
        ].map(({ icon: Icon, val, label, color, bg }) => (<div key={label}>
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 ${color}`}/>
              </div>
              <div className="text-2xl font-extrabold text-foreground font-[Plus_Jakarta_Sans]">
                {val}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>))}
        </div>
      </div>
    </section>);
}
