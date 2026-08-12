import { useState } from "react";
import { Leaf, Bot, CloudRain, Microscope, TrendingUp, Bell, LogOut, Menu, Activity, Sprout, Sun, Droplets, CheckCircle, Send, Mic, MapPin, ChevronRight, ArrowUp, Home, Settings, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
const yieldData = [
    { month: "Jan", yield: 28 }, { month: "Feb", yield: 32 },
    { month: "Mar", yield: 45 }, { month: "Apr", yield: 52 },
    { month: "May", yield: 60 }, { month: "Jun", yield: 74 },
    { month: "Jul", yield: 88 },
];
const rainfallData = [
    { day: "Mon", mm: 12 }, { day: "Tue", mm: 48 },
    { day: "Wed", mm: 62 }, { day: "Thu", mm: 35 },
    { day: "Fri", mm: 8 }, { day: "Sat", mm: 4 },
    { day: "Sun", mm: 22 },
];
const myCrops = [
    {
        name: "Paddy — Field A",
        area: "2.4 acres",
        stage: "Tillering",
        daysLeft: 45,
        health: 94,
        nextAction: "Apply N fertilizer in 3 days",
        image: "https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=300&h=160&fit=crop&auto=format",
        statusColor: "text-emerald-600 bg-emerald-50",
    },
    {
        name: "Coconut Grove",
        area: "1.8 acres",
        stage: "Mature",
        daysLeft: 0,
        health: 87,
        nextAction: "Harvest ready — 60 nuts available",
        image: "https://images.unsplash.com/photo-1527160666479-3131d2b7042d?w=300&h=160&fit=crop&auto=format",
        statusColor: "text-amber-600 bg-amber-50",
    },
    {
        name: "Banana Plantation",
        area: "0.6 acres",
        stage: "Flowering",
        daysLeft: 90,
        health: 91,
        nextAction: "Bunch emergence — increase watering",
        image: "https://images.unsplash.com/photo-1609554259885-d5a52e01e83d?w=300&h=160&fit=crop&auto=format",
        statusColor: "text-sky-600 bg-sky-50",
    },
];
const recommendations = [
    { type: "fertilizer", icon: Sprout, title: "Apply Urea to Paddy Field A", priority: "High", detail: "50 kg/ha in next 3 days before rain", color: "border-l-amber-400" },
    { type: "pest", icon: Microscope, title: "Monitor for Brown Plant Hopper", priority: "Medium", detail: "High humidity this week increases risk", color: "border-l-rose-400" },
    { type: "market", icon: TrendingUp, title: "Good time to sell coconuts", priority: "Info", detail: "Price up 8% — ₹28/nut at Palakkad mandi", color: "border-l-emerald-400" },
    { type: "weather", icon: CloudRain, title: "Rain expected Tue–Wed", priority: "Info", detail: "Avoid spraying pesticides — 65% rain chance", color: "border-l-sky-400" },
];
const chatInitial = [
    { role: "ai", text: "👋 Good morning! Your paddy crop in Field A looks healthy at 94%. Rain expected Tuesday — I recommend applying urea today or Friday. Anything else I can help with?" },
];
const sideLinks = [
    { icon: Home, label: "My Farm", key: "farm" },
    { icon: Bot, label: "AI Assistant", key: "ai" },
    { icon: Sprout, label: "My Crops", key: "crops" },
    { icon: CloudRain, label: "Weather", key: "weather" },
    { icon: Microscope, label: "Disease Check", key: "disease" },
    { icon: TrendingUp, label: "Market Prices", key: "market" },
    { icon: BarChart2, label: "Analytics", key: "analytics" },
    { icon: Settings, label: "Settings", key: "settings" },
];
export function FarmerDashboardPage({ user, onLogout }) {
    const [activeSection, setActiveSection] = useState("farm");
    const [sideOpen, setSideOpen] = useState(false);
    const [messages, setMessages] = useState(chatInitial);
    const [chatInput, setChatInput] = useState("");
    const sendMessage = () => {
        if (!chatInput.trim())
            return;
        const text = chatInput.trim();
        setMessages((m) => [...m, { role: "user", text }]);
        setChatInput("");
        setTimeout(() => {
            setMessages((m) => [...m, {
                    role: "ai",
                    text: "Based on current soil moisture data and the upcoming rain forecast, I suggest holding off on irrigation for 48 hours. Your paddy nitrogen levels are optimal for now. Would you like a detailed weekly plan?",
                }]);
        }, 1100);
    };
    const district = user.district || "Kerala";
    return (<div className="min-h-screen bg-[#F6F4EE] flex">
      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#071A0C] z-40 flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white"/>
            </div>
            <div>
              <div className="text-white font-extrabold text-base font-[Plus_Jakarta_Sans]">
                Farmo <span className="text-[#4ADE80]">AI</span>
              </div>
              <div className="text-white/35 text-[10px] uppercase tracking-widest">Farmer Portal</div>
            </div>
          </div>
        </div>

        {/* Farmer card */}
        <div className="px-4 py-5 border-b border-white/8">
          <div className="bg-[#1B5E38]/40 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#4ADE80]/20 border-2 border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] font-extrabold">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{user.name}</div>
                <div className="flex items-center gap-1 text-white/40 text-xs mt-0.5">
                  <MapPin className="w-3 h-3"/>{district}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["3", "Crops"], ["4.8 ac", "Area"], ["94%", "Health"]].map(([v, l]) => (<div key={l} className="bg-white/5 rounded-xl py-2">
                  <div className="text-white font-bold text-sm">{v}</div>
                  <div className="text-white/35 text-[10px]">{l}</div>
                </div>))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {sideLinks.map(({ icon: Icon, label, key }) => (<button key={key} onClick={() => { setActiveSection(key); setSideOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeSection === key
                ? "bg-[#1B5E38] text-white shadow-md shadow-green-900/40"
                : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4 flex-shrink-0"/>
              {label}
              {activeSection === key && <ChevronRight className="w-3.5 h-3.5 ml-auto"/>}
            </button>))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 pt-4 border-t border-white/8">
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors">
            <LogOut className="w-4 h-4"/>
            Sign Out
          </button>
        </div>
      </aside>

      {sideOpen && (<div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSideOpen(false)}/>)}

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#F6F4EE]/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setSideOpen(true)}>
            <Menu className="w-5 h-5 text-[#132B1A]"/>
          </button>
          <div>
            <h1 className="font-extrabold text-[#132B1A] text-lg font-[Plus_Jakarta_Sans]">
              Good morning, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs text-[#5A6B58]">
              <MapPin className="w-3 h-3 inline mr-1"/>{district} · Tuesday, 25 June 2024
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-[#5A6B58]"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1B5E38] flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {activeSection === "ai" ? (
            <div className="bg-[#071A0C] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">AI Farming Assistant</h2>
              <div className="flex-1 p-5 space-y-3 h-96 overflow-y-auto bg-black/20 rounded-xl mb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1B5E38] text-white rounded-tr-sm"
                        : "bg-white/8 text-white/80 border border-white/10 rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask your AI farming assistant…"
                  className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/28 outline-none focus:border-[#4ADE80]/40 transition-colors"
                />
                <button onClick={sendMessage} className="px-5 py-2.5 rounded-xl bg-[#1B5E38] text-white text-sm font-bold hover:bg-[#155030] transition-colors">
                  Send
                </button>
              </div>
            </div>
          ) : (
          <>
          {/* ── Hero banner ── */}
          <div className="relative rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=1200&h=280&fit=crop&auto=format" alt="Your farm" className="w-full h-36 object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C]/95 via-[#0F2817]/80 to-transparent"/>
            <div className="absolute inset-0 px-7 flex items-center">
              <div>
                <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Your Farm Overview</div>
                <div className="text-white font-extrabold text-2xl font-[Plus_Jakarta_Sans]">
                  All 3 crops healthy
                </div>
                <div className="text-white/60 text-sm mt-1">
                  AI confidence: 98% · Last scan: 2 hours ago
                </div>
              </div>
              <div className="ml-auto hidden sm:flex gap-4">
                {[["94%", "Health"], ["₹2,180", "Paddy/qt"], ["☀️ 31°", "Today"]].map(([v, l]) => (<div key={l} className="text-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5">
                    <div className="text-white font-extrabold text-lg font-[Plus_Jakarta_Sans]">{v}</div>
                    <div className="text-white/55 text-xs mt-0.5">{l}</div>
                  </div>))}
              </div>
            </div>
          </div>

          {/* ── KPI row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
            { label: "Crop Health", value: "94%", sub: "+2.3% this week", icon: Activity, bg: "bg-emerald-50", col: "text-[#1B5E38]" },
            { label: "Today's Weather", value: "31°C", sub: "Sunny · Low rain", icon: Sun, bg: "bg-amber-50", col: "text-amber-600" },
            { label: "Soil Moisture", value: "Good", sub: "68% optimal", icon: Droplets, bg: "bg-sky-50", col: "text-sky-600" },
            { label: "AI Alerts", value: "4", sub: "2 high priority", icon: Bell, bg: "bg-rose-50", col: "text-rose-600" },
        ].map(({ label, value, sub, icon: Icon, bg, col }) => (<div key={label} className="bg-white border border-border rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${col}`}/>
                </div>
                <div className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
                <div className="text-sm text-[#5A6B58] mt-0.5">{label}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1.5">
                  <ArrowUp className="w-3 h-3"/>{sub}
                </div>
              </div>))}
          </div>

          {/* ── My crops ── */}
          <div>
            <h2 className="font-extrabold text-[#132B1A] text-lg mb-4 font-[Plus_Jakarta_Sans]">
              My Crops
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {myCrops.map((c) => (<div key={c.name} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-900/7 hover:-translate-y-1 transition-all">
                  <div className="h-32 overflow-hidden relative">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <span className="text-white font-bold text-sm">{c.name}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.statusColor}`}>
                        {c.stage}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-[#5A6B58] mb-3">
                      <span>📏 {c.area}</span>
                      {c.daysLeft > 0 && <span>🌾 {c.daysLeft} days to harvest</span>}
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5A6B58]">Crop Health</span>
                        <span className="font-bold text-[#132B1A]">{c.health}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${c.health >= 90 ? "bg-emerald-500" : c.health >= 75 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${c.health}%` }}/>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-[#F6F4EE] rounded-xl p-3">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1B5E38] mt-0.5 flex-shrink-0"/>
                      <span className="text-xs text-[#132B1A]">{c.nextAction}</span>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>

          {/* ── Charts + AI chat ── */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Yield chart */}
            <div className="lg:col-span-1 bg-white border border-border rounded-2xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-1">My Yield Trend</h3>
              <p className="text-sm text-[#5A6B58] mb-5">Quintals — 2024</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={yieldData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="fYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E38" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1B5E38" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE4" vertical={false}/>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 11 }}/>
                  <Area type="monotone" dataKey="yield" stroke="#1B5E38" fill="url(#fYield)" strokeWidth={2.5} name="Yield (qtl)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600">
                <ArrowUp className="w-4 h-4"/>
                +214% growth since January
              </div>
            </div>

            {/* AI chat */}
            <div className="lg:col-span-2 bg-[#071A0C] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white"/>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">FARMO AI Assistant</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"/>
                    <span className="text-[#4ADE80] text-xs">Personalised for {user.name.split(" ")[0]}</span>
                  </div>
                </div>
                <div className="ml-auto text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  ML | EN
                </div>
              </div>

              <div className="flex-1 p-5 space-y-3 h-48 overflow-y-auto">
                {messages.map((msg, i) => (<div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "ai" && (<div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white"/>
                      </div>)}
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                ? "bg-[#1B5E38] text-white rounded-tr-sm"
                : "bg-white/8 text-white/80 border border-white/10 rounded-tl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>))}
              </div>

              <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2.5">
                <button className="w-8 h-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-[#4ADE80]/15 transition-colors">
                  <Mic className="w-3.5 h-3.5 text-white/50"/>
                </button>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask your AI farming assistant…" className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/28 outline-none focus:border-[#4ADE80]/40 transition-colors"/>
                <button onClick={sendMessage} className="w-8 h-8 rounded-xl bg-[#1B5E38] flex items-center justify-center hover:bg-[#155030] transition-colors">
                  <Send className="w-3.5 h-3.5 text-white"/>
                </button>
              </div>
            </div>
          </div>

          {/* ── AI Recommendations ── */}
          <div>
            <h2 className="font-extrabold text-[#132B1A] text-lg mb-4 font-[Plus_Jakarta_Sans]">
              AI Recommendations for You
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((r) => (<div key={r.title} className={`bg-white border border-border border-l-4 ${r.color} rounded-2xl p-5 hover:shadow-md hover:shadow-green-900/5 transition-all`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <r.icon className="w-4 h-4 text-[#1B5E38]"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-[#132B1A] text-sm">{r.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${r.priority === "High" ? "bg-rose-100 text-rose-700" :
                r.priority === "Medium" ? "bg-amber-100 text-amber-700" :
                    "bg-sky-100 text-sky-700"}`}>
                          {r.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A6B58] leading-relaxed">{r.detail}</p>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>

          {/* ── Rainfall + Market row ── */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Rainfall */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-1">Weekly Rainfall</h3>
              <p className="text-sm text-[#5A6B58] mb-5">{district} · This week (mm)</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={rainfallData} barSize={20} margin={{ top: 0, right: 5, bottom: 0, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE4" vertical={false}/>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v) => [`${v} mm`, "Rainfall"]}/>
                  <Bar dataKey="mm" fill="#0EA5E9" radius={[6, 6, 0, 0]} name="Rainfall (mm)"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Market snapshot */}
            <div className="bg-gradient-to-br from-[#071A0C] to-[#0F2817] border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-1">Today's Market Prices</h3>
              <p className="text-white/40 text-sm mb-5">{district} Mandi · Live rates</p>
              <div className="space-y-3">
                {[
            ["🌾", "Paddy (Quintal)", "₹2,180", "+3.2%", true],
            ["🥥", "Coconut (100 nos)", "₹2,800", "+1.1%", true],
            ["🌿", "Pepper (kg)", "₹580", "-0.8%", false],
            ["🍌", "Banana Nendran (doz)", "₹95", "+2.4%", true],
        ].map(([emoji, item, price, change, up]) => (<div key={String(item)} className="flex items-center gap-3 py-2.5 border-b border-white/8 last:border-0">
                    <span className="text-xl">{emoji}</span>
                    <span className="text-white/65 text-sm flex-1">{item}</span>
                    <span className="text-white font-bold text-sm">{price}</span>
                    <div className={`flex items-center gap-0.5 text-xs font-bold w-14 justify-end ${up ? "text-[#4ADE80]" : "text-rose-400"}`}>
                      {up ? <ArrowUp className="w-3 h-3"/> : <ArrowUp className="w-3 h-3 rotate-180"/>}
                      {change}
                    </div>
                  </div>))}
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
    </div>);
}
