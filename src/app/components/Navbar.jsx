import { useState, useEffect } from "react";
import { Leaf, Menu, X } from "lucide-react";
const navLinks = [
    "Home",
    "AI Assistant",
    "Crop Recommendation",
    "Disease Detection",
    "Weather",
    "Market Insights",
    "Contact",
];
export function Navbar({ onLoginClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (<nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-white/92 backdrop-blur-xl shadow-sm border-b border-black/5"
            : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center shadow-md shadow-green-900/30">
            <Leaf className="w-5 h-5 text-white"/>
          </div>
          <span className={`font-bold text-xl tracking-tight font-[Plus_Jakarta_Sans] ${scrolled ? "text-[#132B1A]" : "text-white"}`}>
            Farmo{" "}
            <span className="text-[#4ADE80]">AI</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (<a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className={`text-sm font-medium transition-colors hover:text-[#4ADE80] ${scrolled ? "text-[#132B1A]/65" : "text-white/75"}`}>
              {link}
            </a>))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={onLoginClick} className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${scrolled
            ? "text-[#132B1A] hover:bg-[#EEF7F1]"
            : "text-white hover:bg-white/10"}`}>
            Login
          </button>
          <button className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#1B5E38] text-white hover:bg-[#155030] transition-all shadow-lg shadow-green-900/25 active:scale-95">
            Get Started Free
          </button>
        </div>

        <button className="lg:hidden p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? (<X className={scrolled ? "text-[#132B1A]" : "text-white"}/>) : (<Menu className={scrolled ? "text-[#132B1A]" : "text-white"}/>)}
        </button>
      </div>

      {menuOpen && (<div className="lg:hidden bg-white border-t border-black/5 px-6 py-5 space-y-3 shadow-xl">
          {navLinks.map((link) => (<a key={link} href="#" className="block text-sm font-medium text-[#132B1A]/70 hover:text-[#1B5E38] py-1.5" onClick={() => setMenuOpen(false)}>
              {link}
            </a>))}
          <button className="w-full text-sm font-bold px-5 py-3 rounded-xl bg-[#1B5E38] text-white mt-2">
            Get Started Free
          </button>
        </div>)}
    </nav>);
}
