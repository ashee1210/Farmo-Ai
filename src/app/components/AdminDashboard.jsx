import { useState, useEffect } from "react";
import { Leaf, Users, Activity, Microscope, CloudRain, TrendingUp, Bell, LogOut, Menu, BarChart2, Settings, Home, ChevronRight, AlertTriangle, CheckCircle, Search, Filter, MoreVertical, Sprout, MapPin, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";
import { getFarmerList } from "../../services/adminService";

const analyticsData = [
    { month: "Jan", farmers: 8200, sessions: 24000, diseases: 1200 },
    { month: "Feb", farmers: 8800, sessions: 28000, diseases: 1400 },
    { month: "Mar", farmers: 9400, sessions: 34000, diseases: 1100 },
    { month: "Apr", farmers: 10200, sessions: 42000, diseases: 890 },
    { month: "May", farmers: 10900, sessions: 48000, diseases: 760 },
    { month: "Jun", farmers: 11500, sessions: 54000, diseases: 920 },
    { month: "Jul", farmers: 12000, sessions: 61000, diseases: 830 },
];
const districtData = [
    { name: "Palakkad", value: 2800, color: "#1B5E38" },
    { name: "Thrissur", value: 2100, color: "#4ADE80" },
    { name: "Wayanad", value: 1900, color: "#0EA5E9" },
    { name: "Kozhikode", value: 1600, color: "#8B5CF6" },
    { name: "Others", value: 3600, color: "#E5E7EB" },
];
const sideLinks = [
    { icon: Home, label: "Overview", key: "overview" },
    { icon: Users, label: "Farmers", key: "farmers" },
    { icon: BarChart2, label: "Analytics", key: "analytics" },
    { icon: Microscope, label: "Disease Reports", key: "disease" },
    { icon: CloudRain, label: "Weather Alerts", key: "weather" },
    { icon: TrendingUp, label: "Market Data", key: "market" },
    { icon: Settings, label: "Settings", key: "settings" },
];
export function AdminDashboard({ user, onLogout }) {
    const [activeSection, setActiveSection] = useState("overview");
    const [sideOpen, setSideOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [dbFarmers, setDbFarmers] = useState([]);

    useEffect(() => {
        let isMounted = true;
        getFarmerList().then((res) => {
            if (isMounted && res && res.success && res.data) {
                const uniqueFarmers = [];
                const seenEmails = new Set();
                for (const f of res.data) {
                    const cleanEmail = f.email ? f.email.trim().toLowerCase() : f.name;
                    if (!seenEmails.has(cleanEmail)) {
                        seenEmails.add(cleanEmail);
                        uniqueFarmers.push({
                            id: f.id,
                            name: f.name || f.full_name || "Registered Farmer",
                            district: f.district || "Kerala",
                            crop: f.crop || "Paddy (Jyothi)",
                            status: (f.status && f.status !== "inactive") ? "Active" : "Inactive",
                            joined: f.created_at ? new Date(f.created_at).toLocaleDateString() : "Recently",
                            health: f.health || 95,
                        });
                    }
                }
                setDbFarmers(uniqueFarmers);
            }
        });
        return () => { isMounted = false; };
    }, []);

    const filtered = dbFarmers.filter((f) => 
        (f.name && f.name.toLowerCase().includes(search.toLowerCase())) ||
        (f.district && f.district.toLowerCase().includes(search.toLowerCase())) ||
        (f.crop && f.crop.toLowerCase().includes(search.toLowerCase()))
    );

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
              <div className="text-white/35 text-[10px] uppercase tracking-widest">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sideLinks.map(({ icon: Icon, label, key }) => (<button key={key} onClick={() => { setActiveSection(key); setSideOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeSection === key
                ? "bg-[#1B5E38] text-white shadow-md shadow-green-900/40"
                : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4 flex-shrink-0"/>
              {label}
              {activeSection === key && <ChevronRight className="w-3.5 h-3.5 ml-auto"/>}
            </button>))}
        </nav>

        {/* User + logout */}
        <div className="px-4 pb-6 border-t border-white/8 pt-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user.name}</div>
              <div className="text-white/35 text-xs truncate">{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors">
            <LogOut className="w-4 h-4"/>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sideOpen && (<div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSideOpen(false)}/>)}

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#F6F4EE]/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setSideOpen(true)}>
            <Menu className="w-5 h-5 text-[#132B1A]"/>
          </button>
          <div>
            <h1 className="font-extrabold text-[#132B1A] text-lg font-[Plus_Jakarta_Sans] capitalize">
              {activeSection === "overview" ? "Dashboard Overview" : activeSection}
            </h1>
            <p className="text-xs text-[#5A6B58]">
              Good morning, {user.name.split(" ")[0]} · Kerala AI Farming Platform
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Bell className="w-5 h-5 text-[#5A6B58]"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">4</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
            { label: "Total Farmers", value: "12,000", change: "+8.4%", up: true, icon: Users, bg: "bg-emerald-50", color: "text-[#1B5E38]" },
            { label: "AI Sessions Today", value: "2,841", change: "+12.1%", up: true, icon: Activity, bg: "bg-sky-50", color: "text-sky-600" },
            { label: "Diseases Detected", value: "834", change: "-3.2%", up: false, icon: Microscope, bg: "bg-rose-50", color: "text-rose-600" },
            { label: "Avg. Yield Increase", value: "+23%", change: "+2.1%", up: true, icon: TrendingUp, bg: "bg-violet-50", color: "text-violet-600" },
        ].map(({ label, value, change, up, icon: Icon, bg, color }) => (<div key={label} className="bg-white border border-border rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`}/>
                </div>
                <div className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
                <div className="text-sm text-[#5A6B58] mt-0.5">{label}</div>
                <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${up ? "text-emerald-600" : "text-rose-600"}`}>
                  {up ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
                  {change} vs last month
                </div>
              </div>))}
          </div>

          {/* ── Charts row ── */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Area chart */}
            <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-[#132B1A]">Platform Growth</h3>
                  <p className="text-sm text-[#5A6B58] mt-0.5">Farmers, sessions & disease reports — 2024</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  +46% YoY
                </span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={analyticsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="farmG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E38" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1B5E38" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="sessG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE4" vertical={false}/>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", fontSize: 12 }}/>
                  <Area type="monotone" dataKey="farmers" stroke="#1B5E38" fill="url(#farmG)" strokeWidth={2.5} name="Farmers" dot={false}/>
                  <Area type="monotone" dataKey="sessions" stroke="#0EA5E9" fill="url(#sessG)" strokeWidth={2.5} name="AI Sessions" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-1">Farmers by District</h3>
              <p className="text-sm text-[#5A6B58] mb-4">Top 4 districts + others</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={districtData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                    {districtData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {districtData.map((d) => (<div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }}/>
                    <span className="text-xs text-[#5A6B58] flex-1">{d.name}</span>
                    <span className="text-xs font-bold text-[#132B1A]">{d.value.toLocaleString()}</span>
                  </div>))}
              </div>
            </div>
          </div>

          {/* ── Bottom row: Farmers table + Alerts ── */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Farmers table */}
            <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                <h3 className="font-bold text-[#132B1A] flex-1">Recent Farmers</h3>
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B58]/50"/>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="bg-muted rounded-xl pl-8 pr-3 py-2 text-xs outline-none border border-transparent focus:border-[#1B5E38]/30 text-[#132B1A] placeholder:text-[#5A6B58]/50 w-40"/>
                </div>
                <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4 text-[#5A6B58]"/>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Farmer", "District", "Crop", "Health", "Status", ""].map((h) => (<th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#5A6B58] uppercase tracking-widest">
                          {h}
                        </th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (<tr key={f.name} className="border-b border-border/50 hover:bg-[#F6F4EE]/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1B5E38]/10 flex items-center justify-center text-[#1B5E38] font-bold text-sm">
                              {f.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#132B1A]">{f.name}</div>
                              <div className="text-xs text-[#5A6B58]">{f.joined}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 text-sm text-[#5A6B58]">
                            <MapPin className="w-3 h-3"/>{f.district}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 text-sm text-[#5A6B58]">
                            <Sprout className="w-3 h-3 text-[#1B5E38]"/>{f.crop}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={`h-full rounded-full ${f.health >= 90 ? "bg-emerald-500" : f.health >= 75 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${f.health}%` }}/>
                            </div>
                            <span className="text-xs font-bold text-[#132B1A]">{f.health}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.status === "Active"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button className="p-1 rounded-lg hover:bg-muted text-[#5A6B58]">
                            <MoreVertical className="w-4 h-4"/>
                          </button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-[#132B1A]">Recent Alerts</h3>
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {alerts.length}
                </span>
              </div>
              <div className="divide-y divide-border">
                {alerts.map((a, i) => (<div key={i} className={`px-5 py-4 border-l-4 ${a.color}`}>
                    <div className="flex items-start gap-2.5">
                      <a.icon className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                      <div>
                        <p className="text-xs text-[#132B1A] leading-relaxed font-medium">{a.msg}</p>
                        <p className="text-[10px] text-[#5A6B58] mt-1">{a.time}</p>
                      </div>
                    </div>
                  </div>))}
              </div>
              <div className="px-6 py-4">
                <button className="w-full text-xs font-bold text-[#1B5E38] hover:text-[#155030] transition-colors">
                  View all alerts →
                </button>
              </div>
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { icon: Users, label: "Add Farmer", sub: "Register a new farmer", color: "bg-emerald-50 text-[#1B5E38]" },
            { icon: Bell, label: "Send Alert", sub: "Broadcast to all users", color: "bg-amber-50 text-amber-700" },
            { icon: BarChart2, label: "Export Report", sub: "Download analytics CSV", color: "bg-sky-50 text-sky-700" },
            { icon: Settings, label: "AI Settings", sub: "Configure model parameters", color: "bg-violet-50 text-violet-700" },
        ].map(({ icon: Icon, label, sub, color }) => (<button key={label} className="bg-white border border-border rounded-2xl p-5 text-left hover:shadow-md hover:shadow-green-900/5 transition-all hover:-translate-y-0.5 group">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5"/>
                </div>
                <div className="font-bold text-[#132B1A] text-sm">{label}</div>
                <div className="text-xs text-[#5A6B58] mt-0.5">{sub}</div>
              </button>))}
          </div>
        </div>
      </main>
    </div>);
}
