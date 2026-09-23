import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, Loader2 } from "lucide-react";
import { KrishiNavbar } from "./Navbar.jsx";
import { KrishiFooter } from "./Footer.jsx";
import { AnimatedBackground } from "./AnimatedBackground.jsx";
import { sendContactFormMessage } from "../../services/adminService.js";

export function ContactPage({ navigate }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await sendContactFormMessage(form);
      setSent(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <KrishiNavbar navigate={navigate} currentPage="contact" />
      <div className="bg-[#071A0C] pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/8 blur-[80px]" />
        <AnimatedBackground variant="dark" density="low" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] text-xs font-bold mb-5 uppercase tracking-widest">
            <Mail className="w-3 h-3" />Get in Touch
          </div>
          <h1 className="text-5xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-4">Contact Us</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto">Questions, partnerships or support — we reply within 24 hours on business days.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Get in touch</h2>
            <p className="text-[#5A6B58] leading-relaxed text-sm">Our team is ready to help with any questions about FARMO AI, partnerships or technical support.</p>
            {[
              { icon: MapPin, label: "Address", value: "Technopark, Thiruvananthapuram, Kerala 695 581" },
              { icon: Phone, label: "Phone", value: "+91 99950 12345" },
              { icon: Mail, label: "Email", value: "hello@farmoai.in" },
              { icon: Clock, label: "Support Hours", value: "Mon–Sat, 9 AM – 6 PM IST" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#1B5E38]/10 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-[#1B5E38]" /></div>
                <div>
                  <div className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest mb-0.5">{label}</div>
                  <div className="text-sm text-[#132B1A] font-semibold leading-relaxed">{value}</div>
                </div>
              </div>
            ))}
            <div className="bg-[#071A0C] rounded-2xl p-6">
              <h4 className="text-white font-bold mb-3">Quick Links</h4>
              {[["Features", "features"], ["Market Insight", "market"], ["Pricing", "pricing"], ["Login", "login"]].map(([l, p]) => (
                <button key={l} onClick={() => navigate(p)} className="block text-sm text-white/50 hover:text-[#4ADE80] transition-colors py-1">→ {l}</button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#1B5E38]/10 rounded-3xl p-8 shadow-md shadow-green-900/4">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-14">
                <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6"><CheckCircle className="w-10 h-10 text-[#1B5E38]" /></div>
                <h3 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] mb-3">Message Sent!</h3>
                <p className="text-[#5A6B58] mb-7 max-w-xs">Thank you! We'll reply within 24 hours to <strong>{form.email}</strong>.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="px-6 py-3 rounded-xl border border-[#1B5E38] text-[#1B5E38] font-bold hover:bg-emerald-50 transition-all">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] mb-7">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Full Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required
                        className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Email Address *</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required
                        className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-3 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all appearance-none cursor-pointer">
                      <option value="">Select a subject</option>
                      {["General Enquiry", "Technical Support", "Partnership / Business", "Feature Request", "Pricing Question", "Report a Bug"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help…" required rows={5}
                      className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{submitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}
