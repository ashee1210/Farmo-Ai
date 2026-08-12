import { CheckCircle, X, Star, Zap } from "lucide-react";
import { KrishiNavbar } from "./Navbar.jsx";
import { KrishiFooter } from "./Footer.jsx";
import { AnimatedBackground } from "./AnimatedBackground.jsx";
import { pricingPlans } from "./data.js";

export function PricingPage({ navigate }) {
  return (
    <div className="min-h-screen bg-white">
      <KrishiNavbar navigate={navigate} currentPage="pricing" />
      <div className="bg-[#071A0C] pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-[100px]" />
        <AnimatedBackground variant="dark" density="low" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] text-xs font-bold mb-5 uppercase tracking-widest"><Zap className="w-3 h-3" />Simple Pricing</div>
          <h1 className="text-5xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-5">Plans for Every Farmer</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">Start free. Upgrade when you need more. No contracts, no hidden fees — cancel anytime.</p>
          <div className="inline-flex items-center gap-2 mt-6 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-white/70 text-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Free plan available for all small farmers — no credit card needed
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl bg-white relative ${plan.popular ? "border-[#1B5E38] shadow-xl shadow-green-900/10" : "border-border"}`}>
              {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><span className="bg-[#1B5E38] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">Most Popular</span></div>}
              <div className="p-8">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{plan.name}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{plan.tag}</span>
                </div>
                <div className="flex items-end gap-1 mt-4 mb-7">
                  <span className="text-5xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{plan.price}</span>
                  <span className="text-[#5A6B58] text-sm pb-2">{plan.period}</span>
                </div>
                <button onClick={() => navigate("login")} className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-md ${plan.buttonClass}`}>
                  {plan.price === "₹0" ? "Get Started Free" : `Choose ${plan.name}`}
                </button>
              </div>
              <div className="px-8 pb-8 border-t border-border pt-6 space-y-3">
                <div className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest mb-4">What's included</div>
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B5E38] flex-shrink-0 mt-0.5" /><span className="text-sm text-[#132B1A]">{f}</span></div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-start gap-2.5 opacity-35"><X className="w-4 h-4 text-[#5A6B58] flex-shrink-0 mt-0.5" /><span className="text-sm text-[#5A6B58]">{f}</span></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          <h2 className="text-3xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] md:col-span-2 text-center mb-2">Frequently Asked Questions</h2>
          {[
            ["Is the free plan really free?", "Yes! Permanently free for small farmers up to 1 acre with no credit card required."],
            ["Can I switch plans anytime?", "Absolutely. Upgrades take effect immediately; downgrades apply at the next billing cycle."],
            ["Is it available in regional languages?", "Yes — full support for Malayalam, Hindi and English across all features including the AI assistant."],
            ["What payment methods are accepted?", "UPI, credit/debit cards, net banking and all major Indian payment methods via Razorpay."],
            ["Is my farm data private?", "Yes. Your data is encrypted and never shared with third parties. You fully own your data."],
            ["Is there a free trial for paid plans?", "Yes — all paid plans include a 30-day free trial. No payment until the trial ends."],
          ].map(([q, a]) => (
            <div key={q} className="bg-[#F6F4EE] rounded-2xl p-6">
              <h4 className="font-bold text-[#132B1A] mb-2 text-sm">{q}</h4>
              <p className="text-[#5A6B58] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-[#071A0C] to-[#1B5E38] rounded-3xl p-10 text-center">
          <h3 className="text-3xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-3">Still undecided? Start free today.</h3>
          <p className="text-white/60 mb-7">No commitment, no credit card. See the difference AI farming makes on your own fields.</p>
          <button onClick={() => navigate("login")} className="px-8 py-3.5 rounded-xl bg-white text-[#1B5E38] font-bold text-base hover:bg-white/90 transition-all shadow-lg">
            Get Started Free →
          </button>
        </div>
      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}
