import { useState } from "react";
import { Leaf, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Shield, Sprout, ChevronDown } from "lucide-react";

const DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
  "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
];

export function RegisterPage({ onLogin, onBack }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("farmer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    password: "",
    confirm: "",
    farmSize: "1–5 acres",
    primaryCrop: "Paddy (Jyothi)",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setError("");
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Full name is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (form.email.trim().toLowerCase() === "admin@gmail.com") {
      setError("The email 'admin@gmail.com' is reserved for system administrator access. Admin accounts cannot be created.");
      return;
    }
    if (!form.district) { setError("Please select your district."); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (form.email.trim().toLowerCase() === "admin@gmail.com") {
      setError("The email 'admin@gmail.com' is reserved for system administrator access. Admin accounts cannot be created.");
      return;
    }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setError("");

    const trimmedEmail = form.email.trim().toLowerCase();
    const newUserObj = {
      id: `u_${Date.now()}`,
      name: form.name.trim(),
      email: trimmedEmail,
      password: form.password,
      phone: form.phone || "+91 94470 12345",
      district: form.district || "Palakkad",
      crop: form.primaryCrop || "Paddy (Jyothi)",
      acres: form.farmSize || "4.5",
      role: "farmer"
    };

    const saveOfflineUserAndProceed = () => {
      let registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem("krishi_registered_users") || "[]");
      } catch (e) {}

      // Check if email already registered locally
      const existing = registeredUsers.find(u => u.email?.trim().toLowerCase() === trimmedEmail);
      if (existing) {
        setError(`Email '${trimmedEmail}' is already registered. Please go to login.`);
        return false;
      }

      registeredUsers.push(newUserObj);
      try {
        localStorage.setItem("krishi_registered_users", JSON.stringify(registeredUsers));
      } catch (e) {}

      localStorage.setItem("krishi_token", `jwt_${newUserObj.id}`);
      localStorage.setItem("krishi_user_email", trimmedEmail);
      localStorage.setItem("krishi_user", newUserObj.name);
      localStorage.setItem("krishi_user_profile", JSON.stringify(newUserObj));
      setSubmitted(true);
      setTimeout(() => {
        if (onLogin) onLogin();
      }, 2200);
      return true;
    };

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: trimmedEmail,
          password: form.password,
          phone: form.phone,
          district: form.district,
          role: "farmer",
          crop: form.primaryCrop || "Paddy (Jyothi)",
          acres: form.farmSize || 1.0,
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also sync to local registry
        let registeredUsers = [];
        try {
          registeredUsers = JSON.parse(localStorage.getItem("krishi_registered_users") || "[]");
        } catch (e) {}
        if (!registeredUsers.some(u => u.email?.trim().toLowerCase() === trimmedEmail)) {
          registeredUsers.push(newUserObj);
          localStorage.setItem("krishi_registered_users", JSON.stringify(registeredUsers));
        }

        localStorage.setItem("krishi_user_email", trimmedEmail);
        localStorage.setItem("krishi_user", form.name);
        localStorage.setItem("krishi_user_profile", JSON.stringify(newUserObj));
        setSubmitted(true);
        setTimeout(() => {
          if (onLogin) onLogin();
        }, 2200);
      } else {
        // If server is up and explicitly rejected duplicate
        setError(data.error || "User with this name or email already exists in database.");
      }
    } catch (err) {
      // Offline / Vercel cloud environment: gracefully persist in localStorage
      saveOfflineUserAndProceed();
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* ── Registration Success Notification Toast ── */}
      {submitted && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-11/12 bg-[#071A0C] border border-[#4ADE80]/40 text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1B5E38] flex items-center justify-center flex-shrink-0 border border-[#4ADE80]">
              <CheckCircle className="w-6 h-6 text-[#4ADE80]" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white font-[Plus_Jakarta_Sans]">Account Created Successfully! 🎉</div>
              <div className="text-xs text-white/70 mt-0.5">Welcome, <strong className="text-[#4ADE80]">{form.name}</strong>. Your <span className="capitalize">{role || "Farmer"}</span> account is active. Redirecting to login…</div>
            </div>
          </div>
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded-xl bg-[#4ADE80] text-[#071A0C] text-xs font-extrabold hover:bg-emerald-400 transition-all flex-shrink-0 shadow-md"
          >
            Go to Login →
          </button>
        </div>
      )}
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#071A0C] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1766671966028-618f17c3c51f?w=1200&h=900&fit=crop&auto=format"
          alt="Kerala hills"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071A0C]/96 to-[#071A0C]/70" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px]" />

        <div className="relative flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-[#1B5E38] flex items-center justify-center shadow-lg shadow-green-900/50">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl font-[Plus_Jakarta_Sans]">
              Farmo <span className="text-[#4ADE80]">AI</span>
            </span>
          </div>

          <div className="my-auto">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-5 font-[Plus_Jakarta_Sans]">
              Join Kerala's largest<br />
              AI farming network.
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-xs">
              Set up your free account in under 2 minutes and start getting
              personalised AI farming advice today.
            </p>

            {/* Steps */}
            <div className="space-y-4">
              {[
                ["Step 1", "Personal & farm details", step >= 1],
                ["Step 2", "Create your password", step >= 2],
                ["Done!", "Access your dashboard", false],
              ].map(([s, desc, done], i) => (
                <div key={String(s)} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    done ? "bg-[#4ADE80] text-[#071A0C]" : "bg-white/10 text-white/40"
                  }`}>
                    {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${done ? "text-[#4ADE80]" : "text-white/40"}`}>{s}</div>
                    <div className="text-white/35 text-xs">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/8 text-white/30 text-xs">
            Free forever for small farmers · No credit card required
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col bg-[#F6F4EE] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 mb-2">
          <button
            onClick={step === 1 ? onBack : () => setStep(1)}
            className="flex items-center gap-2 text-sm font-semibold text-[#132B1A]/60 hover:text-[#1B5E38] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Back to home" : "Previous step"}
          </button>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? "bg-[#1B5E38]" : "bg-[#1B5E38]/40"}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? "bg-[#1B5E38]" : "bg-[#1B5E38]/20"}`} />
            <span className="text-xs text-[#5A6B58] ml-2">Step {step} of 2</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-md">

            <div className="mb-7">
              <h1 className="text-3xl font-extrabold text-[#132B1A] mb-2 font-[Plus_Jakarta_Sans]">
                {step === 1 ? "Create your account" : "Secure your account"}
              </h1>
              <p className="text-[#5A6B58] text-sm">
                {step === 1
                  ? "Tell us about yourself to personalise your AI farming experience."
                  : "Choose a strong password to protect your Farmo AI account."}
              </p>
            </div>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-5">
                {/* Farmer Registration Notice */}
                <div className="p-3.5 rounded-xl bg-[#1B5E38]/8 border border-[#1B5E38]/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1B5E38] text-white flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-[#132B1A]">
                    <span className="font-bold block text-sm text-[#1B5E38]">Farmer Registration</span>
                    Create your personalized farmer account to unlock AI crop advisory and mandi insights.
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/50" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Rajan Nair"
                      className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/50" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/50" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+91 99950 00000"
                      className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Kerala District</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/50 pointer-events-none z-10" />
                    <select
                      value={form.district}
                      onChange={(e) => set("district", e.target.value)}
                      className="w-full bg-white border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all appearance-none cursor-pointer relative z-0"
                    >
                      <option value="">Select your district</option>
                      {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/60 pointer-events-none z-10" />
                  </div>
                </div>

                {/* Farm Size & Crop */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Farm Size</label>
                    <div className="relative">
                      <select
                        value={form.farmSize}
                        onChange={(e) => set("farmSize", e.target.value)}
                        className="w-full bg-white border border-border rounded-xl pl-3 pr-8 py-3 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all appearance-none cursor-pointer"
                      >
                        <option value="Under 1 acre">Under 1 acre</option>
                        <option value="1–5 acres">1–5 acres</option>
                        <option value="5–20 acres">5–20 acres</option>
                        <option value="20+ acres">20+ acres</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/60 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Primary Crop</label>
                    <div className="relative">
                      <select
                        value={form.primaryCrop}
                        onChange={(e) => set("primaryCrop", e.target.value)}
                        className="w-full bg-white border border-border rounded-xl pl-3 pr-8 py-3 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all appearance-none cursor-pointer"
                      >
                        <option value="Paddy (Jyothi)">Paddy</option>
                        <option value="Coconut">Coconut</option>
                        <option value="Banana (Nendran)">Banana</option>
                        <option value="Pepper">Pepper</option>
                        <option value="Rubber (RSI 4)">Rubber</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B58]/60 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                  Continue to Step 2 →
                </button>
              </form>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <form onSubmit={handleStep2} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-11 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6B58]/60 hover:text-[#1B5E38]"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicators */}
                  <div className="flex gap-1.5 mt-2">
                    {[8, 12, 16].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          form.password.length >= n ? "bg-[#1B5E38]" : "bg-border"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-[#5A6B58] ml-1">
                      {form.password.length < 8 ? "Weak" : form.password.length < 12 ? "Fair" : "Strong"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-11 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/45 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6B58]/60 hover:text-[#1B5E38]"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.confirm && (
                    <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-medium ${
                      form.password === form.confirm ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {form.password === form.confirm
                        ? <><CheckCircle className="w-3.5 h-3.5" /> Passwords match</>
                        : <><AlertCircle className="w-3.5 h-3.5" /> Passwords do not match</>}
                    </div>
                  )}
                </div>

                {/* Summary card */}
                <div className="bg-white border border-border rounded-xl p-4">
                  <div className="text-xs font-bold text-[#132B1A] mb-3 uppercase tracking-widest">
                    Account Summary
                  </div>
                  <div className="space-y-1.5 text-sm text-[#5A6B58]">
                    <div className="flex justify-between">
                      <span>Name</span>
                      <span className="font-semibold text-[#132B1A]">{form.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email</span>
                      <span className="font-semibold text-[#132B1A] truncate ml-3">{form.email || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Role</span>
                      <span className="font-bold capitalize px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        Farmer
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>District</span>
                      <span className="font-semibold text-[#132B1A]">{form.district || "—"}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                  Create My Account
                </button>
              </form>
            )}

            <p className="text-center text-sm text-[#5A6B58] mt-6">
              Already have an account?{" "}
              <button
                onClick={onLogin}
                className="text-[#1B5E38] font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
