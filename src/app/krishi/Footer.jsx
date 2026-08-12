import { Leaf, MapPin, Phone, Mail, Twitter, Instagram, Facebook, Youtube } from "lucide-react";

export function KrishiFooter({ navigate }) {
  return (
    <footer className="bg-[#040E07] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <button onClick={() => navigate("home")} className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center"><Leaf className="w-5 h-5 text-white" /></div>
              <span className="font-extrabold text-xl font-[Plus_Jakarta_Sans]">FARMO <span className="text-[#4ADE80]">AI</span></span>
            </button>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">AI-powered smart farming platform helping Indian farmers increase productivity, detect crop diseases early and make data-driven decisions.</p>
            <div className="space-y-2 text-sm text-white/40">
              <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />Technopark, Thiruvananthapuram, Kerala 695 581</div>
              <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />+91 99950 12345</div>
              <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />hello@farmoai.in</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm text-white/40">
              {[["Features", "features"], ["Market Insight", "market"], ["Pricing", "pricing"], ["AI Assistant", "ai-assistant"], ["Contact", "contact"]].map(([l, p]) => (
                <li key={l}><button onClick={() => navigate(p)} className="hover:text-[#4ADE80] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-white/40 mb-7">
              {["About Us", "Blog", "Careers", "Privacy Policy", "Terms of Service"].map(l => (
                <li key={l}><a href="#" className="hover:text-[#4ADE80] transition-colors">{l}</a></li>
              ))}
            </ul>
            <div className="flex gap-2.5">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-[#4ADE80]/15 hover:border-[#4ADE80]/25 transition-all">
                  <Icon className="w-4 h-4 text-white/40" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <span>© 2024 FARMO AI Technologies Pvt. Ltd. All rights reserved.</span>
          <span>Smart Farming · Powered by AI · Built in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}
