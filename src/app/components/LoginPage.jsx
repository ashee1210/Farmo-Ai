import { useState } from "react";
import { Leaf, Eye, EyeOff, ArrowLeft, Bot, Shield, Sprout, AlertCircle } from "lucide-react";

export function LoginPage({ onLogin, onRegister, onBack }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${apiBase}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });
            const data = await res.json();
            if (res.ok && data.success && data.user) {
                localStorage.setItem("krishi_token", data.token);
                localStorage.setItem("krishi_user", data.user.name);
                localStorage.setItem("krishi_user_profile", JSON.stringify(data.user));
                onLogin(data.user);
                return;
            } else {
                setError(data.error || "Invalid email or password. Please check your registered credentials.");
                setLoading(false);
            }
        } catch (err) {
            setError("Database server unreachable. Please make sure the backend server ('npm run server') is running.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left panel: brand + illustration ── */}
            <div className="hidden lg:flex flex-col w-[52%] bg-[#071A0C] relative overflow-hidden">
                {/* Background */}
                <img src="https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=1200&h=900&fit=crop&auto=format" alt="Kerala paddy fields" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
                <div className="absolute inset-0 bg-gradient-to-br from-[#071A0C]/95 via-[#0F2817]/80 to-[#071A0C]/70"/>

                {/* Glows */}
                <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[80px]"/>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-sky-400/8 blur-[60px]"/>

                <div className="relative flex flex-col h-full p-12">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-auto">
                        <div className="w-10 h-10 rounded-xl bg-[#1B5E38] flex items-center justify-center shadow-lg shadow-green-900/50">
                            <Leaf className="w-5 h-5 text-white"/>
                        </div>
                        <span className="text-white font-extrabold text-2xl font-[Plus_Jakarta_Sans]">
                            Farmo <span className="text-[#4ADE80]">AI</span>
                        </span>
                    </div>

                    {/* Main copy */}
                    <div className="my-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/25 text-[#4ADE80] text-xs font-bold mb-6 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"/>
                            AI-Powered Farming
                        </div>
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-5 font-[Plus_Jakarta_Sans]">
                            Smart farming begins<br />
                            with smarter decisions.
                        </h2>
                        <p className="text-white/50 text-base leading-relaxed mb-10 max-w-sm">
                            Access real-time crop health, disease detection, weather alerts and
                            market insights — all personalised for your farm.
                        </p>

                        {/* Feature chips */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Bot, label: "AI Crop Advice", sub: "Personalised guidance" },
                                { icon: Shield, label: "Disease Detection", sub: "Upload & diagnose" },
                                { icon: Sprout, label: "Soil Analysis", sub: "NPK monitoring" },
                                { icon: Leaf, label: "Market Prices", sub: "Live mandi rates" },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#1B5E38]/60 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-[#4ADE80]"/>
                                    </div>
                                    <div>
                                        <div className="text-white text-xs font-bold">{label}</div>
                                        <div className="text-white/40 text-[11px]">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Farmer stat */}
                    <div className="mt-auto pt-8 border-t border-white/8 flex items-center gap-6">
                        {[["12,000+", "Farmers"], ["98%", "Accuracy"], ["3", "Languages"]].map(([n, l]) => (
                            <div key={l}>
                                <div className="text-xl font-extrabold text-white font-[Plus_Jakarta_Sans]">{n}</div>
                                <div className="text-white/40 text-xs mt-0.5">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right panel: login form ── */}
            <div className="flex-1 flex flex-col bg-[#F6F4EE] overflow-y-auto">
                {/* Top nav */}
                <div className="flex items-center justify-between px-8 pt-8 mb-2">
                    <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[#132B1A]/60 hover:text-[#1B5E38] transition-colors">
                        <ArrowLeft className="w-4 h-4"/>
                        Back to home
                    </button>
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#1B5E38] flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-white"/>
                        </div>
                        <span className="font-extrabold text-lg text-[#132B1A] font-[Plus_Jakarta_Sans]">
                            Farmo <span className="text-[#1B5E38]">AI</span>
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-8 py-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-[#132B1A] mb-2 font-[Plus_Jakarta_Sans]">
                                Welcome back
                            </h1>
                            <p className="text-[#5A6B58] text-sm">
                                Sign in with your registered email and password.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#132B1A] mb-1.5">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }} 
                                    placeholder="you@example.com" 
                                    required 
                                    className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/50 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-semibold text-[#132B1A]">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password} 
                                        onChange={(e) => { setPassword(e.target.value); setError(""); }} 
                                        placeholder="Enter your password" 
                                        required 
                                        className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-11 text-sm text-[#132B1A] placeholder:text-[#5A6B58]/50 outline-none focus:border-[#1B5E38] focus:ring-2 focus:ring-[#1B5E38]/10 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6B58]/60 hover:text-[#1B5E38] transition-colors">
                                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Signing in…
                                    </>
                                ) : ("Sign In to Farmo AI")}
                            </button>
                        </form>

                        <p className="text-center text-sm text-[#5A6B58] mt-6">
                            New to Farmo AI?{" "}
                            <button onClick={onRegister} className="text-[#1B5E38] font-bold hover:underline">
                                Create a free account
                            </button>
                        </p>

                        <p className="text-center text-[11px] text-[#5A6B58]/50 mt-8">
                            By signing in you agree to our Terms of Service & Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
