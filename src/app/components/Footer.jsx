import { Leaf, MapPin, Phone, Mail, Twitter, Instagram, Facebook, Youtube } from "lucide-react";
export function Footer() {
    return (<footer id="contact" className="bg-[#040E07] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white"/>
              </div>
              <span className="font-bold text-xl font-[Plus_Jakarta_Sans]">
                Farmo <span className="text-[#4ADE80]">AI</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered personal farming assistant built specifically for
              Kerala farmers. Smart farming in your language, on your terms.
            </p>
            <div className="space-y-2.5 text-sm text-white/40">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#4ADE80] flex-shrink-0"/>
                <span>Technopark, Thiruvananthapuram, Kerala 695 581</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4ADE80] flex-shrink-0"/>
                <span>+91 99950 12345</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4ADE80] flex-shrink-0"/>
                <span>hello@farmoai.in</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-sm mb-5 text-white uppercase tracking-widest">
              Features
            </h4>
            <ul className="space-y-3 text-sm text-white/40">
              {[
            "AI Crop Recommendation",
            "Disease Detection",
            "Weather Forecast",
            "Soil Analysis",
            "Fertilizer Advice",
            "Market Prices",
        ].map((l) => (<li key={l}>
                  <a href="#" className="hover:text-[#4ADE80] transition-colors">
                    {l}
                  </a>
                </li>))}
            </ul>
          </div>

          {/* Company + Social */}
          <div>
            <h4 className="font-bold text-sm mb-5 text-white uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-white/40 mb-8">
              {[
            "About Us",
            "Contact",
            "Blog",
            "Privacy Policy",
            "Terms of Service",
            "Help Center",
        ].map((l) => (<li key={l}>
                  <a href="#" className="hover:text-[#4ADE80] transition-colors">
                    {l}
                  </a>
                </li>))}
            </ul>
            <h4 className="font-bold text-sm mb-4 text-white uppercase tracking-widest">
              Follow Us
            </h4>
            <div className="flex gap-2.5">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (<a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-[#4ADE80]/15 hover:border-[#4ADE80]/25 transition-all">
                  <Icon className="w-4 h-4 text-white/40"/>
                </a>))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <span>© 2024 Farmo AI Technologies Pvt. Ltd. All rights reserved.</span>
          <span>
            Made with ❤️ for Kerala Farmers · Built in Kerala 🌿
          </span>
        </div>
      </div>
    </footer>);
}
