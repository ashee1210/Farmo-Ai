import { useState, useEffect } from "react";
import { Leaf, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", page: "home" },
  { label: "Features", page: "features" },
  { label: "Market Insight", page: "market" },
  { label: "AI Assistant", page: "ai-assistant" },
  { label: "Pricing", page: "pricing" },
  { label: "Contact", page: "contact" },
];

export function KrishiNavbar({ navigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const lightNavbarPages = ["farmer", "admin"];
  const dark = !scrolled && !lightNavbarPages.includes(currentPage);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-black/6" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("home")} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center shadow-md shadow-green-900/30 group-hover:bg-[#155030] transition-colors">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className={`font-extrabold text-xl font-[Plus_Jakarta_Sans] ${dark ? "text-white" : "text-[#132B1A]"}`}>
            FARMO <span className="text-[#4ADE80]">AI</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map(({ label, page, params }) => (
            <button key={label} onClick={() => navigate(page, params)} className={`text-sm font-semibold transition-colors hover:text-[#4ADE80] ${currentPage === page ? "text-[#4ADE80]" : dark ? "text-white/80" : "text-[#132B1A]/70"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => navigate("login")} className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${dark ? "text-white hover:bg-white/10" : "text-[#132B1A] hover:bg-[#EEF7F1]"}`}>
            Login
          </button>
          <button onClick={() => navigate("login")} className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#1B5E38] text-white hover:bg-[#155030] transition-all shadow-md shadow-green-900/25 active:scale-95">
            Start Farming
          </button>
        </div>

        <button className="lg:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X className={dark ? "text-white" : "text-[#132B1A]"} /> : <Menu className={dark ? "text-white" : "text-[#132B1A]"} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-black/5 px-5 py-5 space-y-1 shadow-xl">
          {LINKS.map(({ label, page, params }) => (
            <button key={label} onClick={() => { navigate(page, params); setOpen(false); }} className="w-full text-left text-sm font-semibold text-[#132B1A]/70 hover:text-[#1B5E38] py-2.5 border-b border-black/4 last:border-0 transition-colors">
              {label}
            </button>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button onClick={() => { navigate("login"); setOpen(false); }} className="py-2.5 rounded-xl border-2 border-[#1B5E38] text-[#1B5E38] text-sm font-bold">Login</button>
            <button onClick={() => { navigate("login"); setOpen(false); }} className="py-2.5 rounded-xl bg-[#1B5E38] text-white text-sm font-bold">Start Farming</button>
          </div>
        </div>
      )}
    </nav>
  );
}
