import { useRef, useState } from "react";
import { Leaf, Eye, EyeOff, ArrowLeft, AlertCircle, Mic, Sparkles, CheckCircle, XCircle, Shield } from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground.jsx";

export function KrishiLoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const recognitionRef = useRef(null);

  const DEMO_FARMER = { email: "farmer@gmail.com", pass: "Farmer@123" };
  const DEMO_ADMIN  = { email: "admin@gmail.com",  pass: "admin@123" };
  const ADMIN_PASSWORD = "admin@123";

  // ── Detect admin email in real-time for conditional UI hints ──
  const isAdminEmailTyped = email.trim().toLowerCase().includes("admin");

  // ── Password strength criteria (same rules for BOTH farmer & admin) ──
  const passwordCriteria = [
    { label: "At least 6 characters",        met: pass.length >= 6 },
    { label: "Contains a letter",             met: /[a-zA-Z]/.test(pass) },
    { label: "Contains a number or symbol",   met: /[0-9!@#$%^&*_\-.]/.test(pass) },
  ];
  const showCriteria = pass.length > 0;
  const allCriteriaMet = passwordCriteria.every(c => c.met);

  // ── Voice input ──
  const startVoiceTyping = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice input is not supported in this browser. Please use typing instead.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) { setEmail(transcript); setError(""); }
    };
    recognition.onerror = () => {
      setError("Voice capture failed. Please try again or use typing.");
      setVoiceListening(false);
    };
    recognition.onend = () => setVoiceListening(false);
    recognitionRef.current = recognition;
    setVoiceListening(true);
    recognition.start();
  };

  const stopVoiceTyping = () => {
    recognitionRef.current?.stop();
    setVoiceListening(false);
  };

  // ── Shared validation (applies equally to farmers AND admins) ──
  const validateForm = () => {
    const targetEmail = email.trim().toLowerCase();
    const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!targetEmail) {
      setError("Email address is required.");
      setLoading(false);
      return false;
    }
    if (!emailRegex.test(targetEmail)) {
      setError("Please enter a valid email address (e.g. farmer@gmail.com).");
      setLoading(false);
      return false;
    }
    if (!pass) {
      setError("Password is required.");
      setLoading(false);
      return false;
    }
    if (pass.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ── Run shared validation first ──
    if (!validateForm()) return;

    const targetEmail  = email.trim().toLowerCase();
    const isAdminEmail = targetEmail === "admin@gmail.com";

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res  = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: pass }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token && data.user) {
        localStorage.setItem("krishi_token",        data.token);
        localStorage.setItem("krishi_user_email",   targetEmail);
        localStorage.setItem("krishi_user",         data.user.name || (data.user.role === "admin" ? "Admin Administrator" : targetEmail.split("@")[0]));
        localStorage.setItem("krishi_user_profile", JSON.stringify(data.user));

        if (data.user.role === "admin" || isAdminEmail) navigate("admin");
        else navigate("farmer");
        return;
      }

      // ── Offline / fallback: admin (server responded but login failed) ──
      if (isAdminEmail && pass === ADMIN_PASSWORD) {
        const demoAdmin = { id: "u_admin_default", name: "Admin Administrator", email: "admin@gmail.com", phone: "+91 94470 00001", district: "Kerala", role: "admin" };
        localStorage.setItem("krishi_token",        `jwt_admin_u_admin_default`);
        localStorage.setItem("krishi_user_email",   "admin@gmail.com");
        localStorage.setItem("krishi_user",         demoAdmin.name);
        localStorage.setItem("krishi_user_profile", JSON.stringify(demoAdmin));
        navigate("admin");
        return;
      }

      // ── Offline / fallback: farmer ──
      if (targetEmail === DEMO_FARMER.email && (pass === DEMO_FARMER.pass || pass === "farmer123")) {
        const demoUser = { id: "f_demo", name: "Demo Farmer", email: "farmer@gmail.com", phone: "+91 94470 12345", district: "Palakkad", role: "farmer" };
        localStorage.setItem("krishi_token",        "jwt_farmer_demo");
        localStorage.setItem("krishi_user_email",   "farmer@gmail.com");
        localStorage.setItem("krishi_user",         demoUser.name);
        localStorage.setItem("krishi_user_profile", JSON.stringify(demoUser));
        navigate("farmer");
        return;
      }

      setLoading(false);
      setError(data.error || "Invalid email or password. Please try again.");

    } catch (err) {
      // ── Network error fallbacks ──
      const targetEmail  = email.trim().toLowerCase();
      const isAdminEmail = targetEmail === "admin@gmail.com";

      if (isAdminEmail && pass === ADMIN_PASSWORD) {
        const demoAdmin = { id: "u_admin_default", name: "Admin Administrator", email: "admin@gmail.com", phone: "+91 94470 00001", district: "Kerala", role: "admin" };
        localStorage.setItem("krishi_token",        "jwt_admin_u_admin_default");
        localStorage.setItem("krishi_user_email",   "admin@gmail.com");
        localStorage.setItem("krishi_user",         demoAdmin.name);
        localStorage.setItem("krishi_user_profile", JSON.stringify(demoAdmin));
        navigate("admin");
        return;
      }

      if (targetEmail === DEMO_FARMER.email && (pass === DEMO_FARMER.pass || pass === "farmer123")) {
        const demoUser = { id: "f_demo", name: "Demo Farmer", email: "farmer@gmail.com", phone: "+91 94470 12345", district: "Palakkad", role: "farmer" };
        localStorage.setItem("krishi_token",        "jwt_farmer_demo");
        localStorage.setItem("krishi_user_email",   "farmer@gmail.com");
        localStorage.setItem("krishi_user",         demoUser.name);
        localStorage.setItem("krishi_user_profile", JSON.stringify(demoUser));
        navigate("farmer");
        return;
      }

      setLoading(false);
      setError("Database server unreachable. Please verify backend server ('npm run server').");
    }
  };

  return (
    <div className="min-h-screen flex font-[Inter]">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-[50%] bg-[#071A0C] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=1200&h=900&fit=crop&auto=format"
          alt="Farmo AI paddy fields"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071A0C]/96 to-[#071A0C]/75" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[80px]" />
        <AnimatedBackground variant="dark" density="medium" />

        <div className="relative flex flex-col h-full p-12">
          <button onClick={() => navigate("home")} className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-[#1B5E38] flex items-center justify-center shadow-lg shadow-green-900/50">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl font-[Plus_Jakarta_Sans]">
              FARMO <span className="text-[#4ADE80]">AI</span>
            </span>
          </button>

          <div className="my-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/25 text-[#4ADE80] text-xs font-bold mb-6 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              AI-Powered Agriculture Platform
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-5 font-[Plus_Jakarta_Sans]">
              Smarter farming<br />begins with<br />smarter data.
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-10 max-w-sm">
              Access AI crop recommendations, disease detection, real-time market prices, and weather intelligence — all personalised for your farm.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[["🌾","10K+","Farmers"],["🤖","95%","AI Accuracy"],["📈","50+","Crop Types"],["⚡","<3s","Response Time"]].map(([e,v,l]) => (
                <div key={l} className="bg-white/5 border border-white/8 rounded-xl p-3.5">
                  <div className="text-xl mb-1">{e}</div>
                  <div className="text-white font-extrabold text-lg font-[Plus_Jakarta_Sans]">{v}</div>
                  <div className="text-white/40 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/8 text-white/30 text-xs flex items-center justify-between">
            <span>© 2026 FARMO AI · Enterprise Network</span>
            <span className="font-mono text-emerald-400/60">MySQL 127.0.0.1:3306</span>
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col bg-[#F6F4EE] overflow-y-auto">
        <div className="flex items-center justify-between px-8 pt-8 mb-4">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 text-sm font-semibold text-[#132B1A]/60 hover:text-[#1B5E38] transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to home
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1B5E38] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-[#132B1A] font-[Plus_Jakarta_Sans]">
              FARMO <span className="text-[#1B5E38]">AI</span>
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#132B1A] mb-2 font-[Plus_Jakarta_Sans]">
                Welcome back
              </h1>
              <p className="text-[#5A6B58] text-sm">
                Sign in to access your Farmo AI farming dashboard or{" "}
                <span className="text-[#1B5E38] font-semibold">administrator portal</span>.
              </p>
            </div>

            {/* ── Admin badge (shown when admin email detected) ── */}
            {isAdminEmailTyped && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4">
                <Shield className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>Administrator portal detected — the same password criteria apply as for farmer accounts.</span>
              </div>
            )}

            {/* ── UNIFIED LOGIN FORM (All Users & Admins) ── */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="e.g. farmer@gmail.com or admin@gmail.com"
                    required
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-11 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/40 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={voiceListening ? stopVoiceTyping : startVoiceTyping}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      voiceListening ? "text-[#1B5E38]" : "text-[#5A6B58]/60 hover:text-[#1B5E38]"
                    }`}
                    aria-label="Use voice typing"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-1.5 text-[11px] text-[#5A6B58]">
                  {voiceListening ? "Listening for voice input…" : "Tap the mic to speak your email"}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-[#132B1A]">
                    Password
                  </label>
                  <button type="button" className="text-xs text-[#1B5E38] font-semibold hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={pass}
                    onChange={e => { setPass(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-11 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/40 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6B58]/60 hover:text-[#132B1A]"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* ── Password criteria checklist (same for admin & farmer) ── */}
                {showCriteria && (
                  <div className="mt-2.5 p-3 rounded-xl bg-white border border-border space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A6B58] mb-1">
                      Password requirements
                    </div>
                    {passwordCriteria.map(({ label, met }) => (
                      <div key={label} className={`flex items-center gap-2 text-xs font-medium transition-colors ${met ? "text-emerald-700" : "text-[#5A6B58]"}`}>
                        {met
                          ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          : <XCircle   className="w-3.5 h-3.5 text-[#5A6B58]/40 flex-shrink-0" />
                        }
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing In…
                  </>
                ) : (
                  "Sign In to Farmo AI →"
                )}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-border text-center">
              <p className="text-sm text-[#5A6B58]">
                New to FARMO AI?{" "}
                <button
                  onClick={() => navigate("register")}
                  className="text-[#1B5E38] font-bold hover:underline"
                >
                  Create a free farmer account
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
