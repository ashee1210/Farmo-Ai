import { Leaf, Bot, Upload } from "lucide-react";
export function CTABand({ onGetStarted }) {
    return (<section className="py-24 bg-[#071A0C] relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1563533538837-ccd3b287ec9c?w=1920&h=600&fit=crop&auto=format" alt="Coconut trees" className="w-full h-full object-cover opacity-10"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C] via-[#071A0C]/95 to-[#071A0C]"/>
      </div>
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="w-18 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center mx-auto mb-7 shadow-xl shadow-green-900/50">
          <Leaf className="w-8 h-8 text-white"/>
        </div>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
          Start Your Smart Farming Journey
        </h2>
        <p className="text-white/55 text-lg mb-9 leading-relaxed">
          Join 12,000+ Kerala farmers already using AI to grow more, earn
          more, and farm smarter — free for small farmers.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={onGetStarted} className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-base hover:bg-[#155030] transition-all shadow-xl shadow-green-900/40 active:scale-95">
            <Bot className="w-5 h-5"/>
            Try AI Assistant — Free
          </button>
          <button className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/18 transition-all backdrop-blur-sm">
            <Upload className="w-5 h-5"/>
            Download App
          </button>
        </div>
        <p className="text-white/25 text-sm mt-6">
          No credit card required · Free forever for small farmers · Available
          in Malayalam, English & Hindi
        </p>
      </div>
    </section>);
}
