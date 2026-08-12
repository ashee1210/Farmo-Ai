import { useState, useEffect } from "react";
import {
  Leaf, Home, Sprout, Database, TrendingUp, BarChart2, FileText,
  Settings, LogOut, Menu, Bell, Activity, Microscope, ChevronRight,
  ArrowUp, ArrowDown, Search, Filter, MoreVertical, MapPin, AlertTriangle,
  CheckCircle, X, RefreshCw, Shield, UserPlus, Users, Trash2
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { adminFarmers, analyticsData, cropStats, demandPie, marketPriceTable, cropDatabase } from "./data.js";
import {
  getAdminOverviewMetrics,
  getFarmerList,
  updateFarmerStatus,
  getDiseaseAlerts,
  getMarketPrices,
  upsertMarketPrices,
} from "../../services/adminService.js";

const SIDEBAR = [
  { key: "dashboard", icon: Home, label: "Dashboard" },
  { key: "farmers", icon: Sprout, label: "Farmers" },
  { key: "add-admin", icon: Shield, label: "Add Admin User" },
  { key: "crop-database", icon: Database, label: "Crop Database" },
  { key: "market-management", icon: TrendingUp, label: "Market Management" },
  { key: "analytics", icon: BarChart2, label: "Analytics" },
  { key: "reports", icon: FileText, label: "Reports" },
  { key: "settings", icon: Settings, label: "Settings" },
];

// ── Notifications Full Page ──
function NotificationsFullPage({ notifications, setNotifications, onBack }) {
  const [filter, setFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Array.from(selectedNotifications);
    setNotifications(notifications.filter(n => !idsToDelete.includes(n.id)));
    setSelectedNotifications(new Set());
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard</button>
      
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">All Notifications</h2>
          <span className="text-xs font-bold text-[#5A6B58] bg-white border border-border px-3 py-1.5 rounded-full">{notifications.length} total</span>
        </div>

        <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-gray-50">
          <div className="flex gap-2">
            {["all", "unread", "read"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors capitalize ${
                  filter === f
                    ? "text-white bg-[#1B5E38]"
                    : "text-[#5A6B58] bg-white border border-border hover:border-[#1B5E38]"
                }`}
              >
                {f} {f === "all" ? "" : f === "unread" ? `(${notifications.filter(n => !n.read).length})` : `(${notifications.filter(n => n.read).length})`}
              </button>
            ))}
          </div>
          
          {selectedNotifications.size > 0 && (
            <div className="ml-auto flex gap-2">
              <span className="text-xs font-bold text-[#5A6B58]">{selectedNotifications.size} selected</span>
              <button
                onClick={handleDeleteSelected}
                className="text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-border">
          <div className="px-6 py-3 bg-gray-50 flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-border cursor-pointer"
            />
            <span className="text-xs font-bold text-[#5A6B58] uppercase">Select All</span>
          </div>
          
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(n => (
              <div key={n.id} className={`px-6 py-4 border-l-4 ${n.cls} flex items-start gap-3 hover:bg-gray-50/50 transition-colors`}>
                <input
                  type="checkbox"
                  checked={selectedNotifications.has(n.id)}
                  onChange={() => {
                    const updated = new Set(selectedNotifications);
                    if (updated.has(n.id)) {
                      updated.delete(n.id);
                    } else {
                      updated.add(n.id);
                    }
                    setSelectedNotifications(updated);
                  }}
                  className="w-4 h-4 rounded border-border cursor-pointer mt-0.5 flex-shrink-0"
                />
                <n.icon className="w-5 h-5 text-[#132B1A] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.read ? "text-[#5A6B58]" : "text-[#132B1A] font-semibold"}`}>{n.msg}</p>
                  <p className="text-xs text-[#5A6B58] mt-1">{n.time}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-xs font-bold text-[#1B5E38] hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-[#5A6B58]">
              <p className="text-sm">No {filter !== "all" ? filter : ""} notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminLayout({ section, setSection, sideOpen, setSideOpen, navigate, children, showAllNotifications, setShowAllNotifications, notifications, setNotifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem("krishi_user_profile") || "{}");
      return {
        name: p.name || localStorage.getItem("krishi_user") || "Admin User",
        email: p.email || localStorage.getItem("krishi_user_email") || "admin@gmail.com",
        phone: p.phone || "",
      };
    } catch (e) {
      return { name: "Admin User", email: "admin@gmail.com", phone: "" };
    }
  });

  useEffect(() => {
    const syncProfile = () => {
      try {
        const p = JSON.parse(localStorage.getItem("krishi_user_profile") || "{}");
        setAdminUser({
          name: p.name || localStorage.getItem("krishi_user") || "Admin User",
          email: p.email || localStorage.getItem("krishi_user_email") || "admin@gmail.com",
          phone: p.phone || "",
        });
      } catch (e) {}
    };
    window.addEventListener("profileUpdated", syncProfile);
    return () => window.removeEventListener("profileUpdated", syncProfile);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F3F5F7] flex">
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#071A0C] z-40 flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 border-b border-white/8">
          <button onClick={() => navigate("home")} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center"><Leaf className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-white font-extrabold text-base font-[Plus_Jakarta_Sans]">FARMO <span className="text-[#4ADE80]">AI</span></div>
              <div className="text-white/35 text-[10px] uppercase tracking-widest">Admin Portal</div>
            </div>
          </button>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {SIDEBAR.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => { setSection(key); setSideOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${section === key ? "bg-[#1B5E38] text-white shadow-md shadow-green-900/30" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
              {section === key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 pt-3 border-t border-white/8">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
              {adminUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{adminUser.name}</div>
              <div className="text-white/35 text-xs truncate">{adminUser.email}</div>
              <div className="text-emerald-400 text-[11px] font-mono font-medium truncate">📞 {adminUser.phone}</div>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("krishi_token");
              localStorage.removeItem("krishi_user_profile");
              localStorage.removeItem("krishi_user_email");
              localStorage.removeItem("krishi_current_route");
              navigate("login");
            }} 
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>
      {sideOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setSideOpen(true)}><Menu className="w-5 h-5 text-gray-700" /></button>
          <div>
            <h1 className="font-extrabold text-[#132B1A] text-lg font-[Plus_Jakarta_Sans] capitalize">
              {SIDEBAR.find(s => s.key === section)?.label ?? "Dashboard"}
            </h1>
            <p className="text-xs text-[#5A6B58]">Admin Dashboard · FARMO AI Platform</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>}
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-border rounded-2xl shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-[#132B1A]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs font-bold text-[#1B5E38] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-y-auto flex-1">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={`px-5 py-4 border-b border-border/30 border-l-4 ${n.cls} flex items-start gap-3 hover:bg-gray-50/50 transition-colors`}>
                          <n.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#132B1A]" />
                          <div className="flex-1">
                            <p className="text-xs text-[#132B1A] font-medium">{n.msg}</p>
                            <p className="text-[10px] text-[#5A6B58] mt-1">{n.time}</p>
                          </div>
                          <button 
                            onClick={() => clearNotification(n.id)}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center text-[#5A6B58] text-sm">
                        No notifications
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="px-5 py-3 border-t border-border bg-gray-50 text-center">
                      <button onClick={() => setShowAllNotifications(true)} className="text-xs font-bold text-[#1B5E38] hover:underline">View all notifications →</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
                {adminUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#132B1A]">{adminUser.name}</div>
                <div className="text-[10px] font-semibold text-emerald-700 font-mono">📞 {adminUser.phone}</div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// ── Admin Home ──
function AdminHome({ setSection }) {
  const [metrics, setMetrics] = useState({
    totalFarmers: 0,
    activeFarmers: 0,
    totalAdmins: 1,
    totalCrops: 0,
    diseaseResolutionRate: "98%",
    totalAIQueries: "1,420",
    totalMandis: "28 Mandis",
    cropDistribution: [],
  });

  useEffect(() => {
    getAdminOverviewMetrics().then((res) => {
      if (res && res.success && res.data) {
        setMetrics({
          totalFarmers: res.data.totalFarmers,
          activeFarmers: res.data.activeFarmers,
          totalAdmins: res.data.totalAdmins || 1,
          totalCrops: res.data.totalCrops || 0,
          diseaseResolutionRate: res.data.diseaseResolutionRate || "98%",
          totalAIQueries: res.data.totalAIQueries || "1,420",
          totalMandis: res.data.totalMandis || "28 Mandis",
          cropDistribution: res.data.cropDistribution || [],
        });
      }
    });
  }, []);

  // Compute pie chart data dynamically from real MySQL crop distribution or fallback
  const pieColors = ["#1B5E38", "#4ADE80", "#0EA5E9", "#F59E0B", "#8B5CF6"];
  const dynamicPie = metrics.cropDistribution && metrics.cropDistribution.length > 0
    ? metrics.cropDistribution.map((item, idx) => {
        const totalCount = metrics.cropDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
        return {
          name: item.name || "Crop",
          value: Math.round((item.count / totalCount) * 100),
          color: pieColors[idx % pieColors.length],
        };
      })
    : demandPie;

  const ALERTS = [
    { icon: AlertTriangle, msg: `Real-time MySQL Sync — ${metrics.totalFarmers} registered farmers active in DB`, time: "Just now", cls: "border-l-emerald-400 bg-emerald-50" },
    { icon: CheckCircle, msg: "AI model updated — Disease detection engine active for Kerala crops", time: "1 hr ago", cls: "border-l-[#1B5E38] bg-green-50" },
    { icon: Bell, msg: `${metrics.totalAIQueries} farmer AI queries processed cleanly this week`, time: "3 hrs ago", cls: "border-l-sky-400 bg-sky-50" },
    { icon: AlertTriangle, msg: "Monsoon agricultural advice distributed to all active districts", time: "5 hrs ago", cls: "border-l-amber-400 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Farmers", value: metrics.totalFarmers !== undefined ? `${metrics.totalFarmers}` : "0", change: `${metrics.activeFarmers || 0} active in DB`, up: true, icon: Sprout, bg: "bg-emerald-50", col: "text-[#1B5E38]", sec: "farmers" },
          { label: "Disease Resolution", value: metrics.diseaseResolutionRate || "98%", change: "AI Diagnostic Engine", up: true, icon: Microscope, bg: "bg-amber-50", col: "text-amber-600", sec: "farmers" },
          { label: "Total AI Queries", value: metrics.totalAIQueries || "1,420", change: "24/7 Voice & Text", up: true, icon: Activity, bg: "bg-sky-50", col: "text-sky-600", sec: "farmers" },
          { label: "Market Reports", value: metrics.totalMandis || "28 Mandis", change: "Live Price Feed", up: true, icon: FileText, bg: "bg-violet-50", col: "text-violet-600", sec: "market-management" },
        ].map(({ label, value, change, up, icon: Icon, bg, col, sec }) => (
          <button key={label} onClick={() => setSection(sec)} className="bg-white border border-border rounded-2xl p-5 text-left hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${col}`} /></div>
            <div className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
            <div className="text-sm text-[#5A6B58] mt-0.5">{label}</div>
            <div className={`flex items-center gap-1 text-xs font-semibold mt-1.5 ${up ? "text-emerald-600" : "text-rose-600"}`}>
              {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{change}
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="font-bold text-[#132B1A]">User Growth</h3><p className="text-sm text-[#5A6B58]">Farmers & AI queries — 2024</p></div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">+46% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1B5E38" stopOpacity={0.2} /><stop offset="95%" stopColor="#1B5E38" stopOpacity={0} /></linearGradient>
                <linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} /><stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Area type="monotone" dataKey="farmers" stroke="#1B5E38" fill="url(#fG)" strokeWidth={2.5} name="Farmers" dot={false} />
              <Area type="monotone" dataKey="sessions" stroke="#0EA5E9" fill="url(#sG)" strokeWidth={2.5} name="AI Sessions" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-3">Crop Statistics</h3>
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie data={dynamicPie} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">
                {dynamicPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {dynamicPie.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-[#5A6B58] flex-1">{d.name}</span>
                <span className="text-xs font-bold text-[#132B1A]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border"><h3 className="font-bold text-[#132B1A]">Recent System Alerts</h3></div>
        <div className="divide-y divide-border">
          {ALERTS.map((a, i) => (
            <div key={i} className={`px-5 py-4 border-l-4 ${a.cls} flex items-start gap-3`}>
              <a.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#132B1A]" />
              <div className="flex-1"><p className="text-xs text-[#132B1A] font-medium">{a.msg}</p><p className="text-[10px] text-[#5A6B58] mt-1">{a.time}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dedicated Add Admin User Section ──
function AddAdminSection() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
    district: "Kerala"
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/admin/admins`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminUsers(data.data || []);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) {
      toast.error("Please enter Name, Email, and Password.");
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdmin.name.trim(),
          email: newAdmin.email.trim(),
          password: newAdmin.password,
          phone: newAdmin.phone,
          role: newAdmin.role,
          district: newAdmin.district
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`New ${newAdmin.role} (${newAdmin.email}) added to MySQL database!`);
        setNewAdmin({ name: "", email: "", password: "", phone: "", role: "admin", district: "Kerala" });
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to create Admin user");
      }
    } catch (err) {
      toast.error("Network error while adding Admin user");
    }
  };

  const handleDeleteAdmin = async (id, email) => {
    if (!confirm(`Are you sure you want to delete Admin account (${email})?`)) return;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Admin account (${email}) deleted from MySQL.`);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to delete Admin");
      }
    } catch (e) {
      toast.error("Error deleting Admin user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-violet-200">
              Admin Access Management
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-[Plus_Jakarta_Sans]">Add New Admin User</h2>
          <p className="text-violet-200 text-xs mt-1">Create and manage admin portal login users directly in MySQL database.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
          <Shield className="w-6 h-6 text-violet-300" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-1 bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-[#132B1A] mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-violet-700" />
            Create Admin Credentials
          </h3>
          <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Full Name *</label>
              <input
                required
                value={newAdmin.name}
                onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="e.g. Jaishuriya Admin"
                className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newAdmin.email}
                onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="e.g. admin2@gmail.com"
                className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Login Password *</label>
              <input
                type="password"
                required
                value={newAdmin.password}
                onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                placeholder="e.g. admin@1234"
                className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Phone Number</label>
              <input
                value={newAdmin.phone}
                onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                placeholder="+91 94470 99999"
                className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-[#132B1A] font-bold capitalize outline-none focus:border-violet-600"
                >
                  <option value="admin">Admin</option>
                  <option value="agronomist">Agronomist</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">District</label>
                <select
                  value={newAdmin.district}
                  onChange={e => setNewAdmin({ ...newAdmin, district: e.target.value })}
                  className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-[#132B1A] outline-none focus:border-violet-600"
                >
                  {["Kerala", "Palakkad", "Alappuzha", "Wayanad", "Thrissur", "Idukki", "Kottayam", "Malappuram", "Kozhikode", "Kannur", "Kasargod", "Ernakulam", "Kollam", "Pathanamthitta", "Trivandrum"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-violet-700 hover:bg-violet-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              + Add Admin Account
            </button>
          </form>
        </div>

        {/* Live Admin Users List Table */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#132B1A] flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-700" />
                Active Admin Users in MySQL Database
              </h3>
              <p className="text-xs text-[#5A6B58] mt-0.5">Real-time accounts with Admin portal authorization</p>
            </div>
            <button
              onClick={fetchUsers}
              className="p-2 rounded-xl border border-border text-[#5A6B58] hover:text-[#1B5E38] hover:border-[#1B5E38] transition-colors"
              title="Refresh Admin List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="overflow-x-auto border border-border/60 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-xs font-bold text-[#5A6B58] uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Admin User</th>
                  <th className="px-4 py-3 text-left">Email Address</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#5A6B58]">
                      Loading Admin accounts from MySQL...
                    </td>
                  </tr>
                ) : adminUsers.length > 0 ? (
                  adminUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs">
                            {u.name ? u.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <span className="font-bold text-[#132B1A]">{u.name || "Admin User"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-700">{u.email}</td>
                      <td className="px-4 py-3.5 text-xs text-[#5A6B58]">{u.phone || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700 uppercase">
                          {u.role || "Admin"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {u.email === "admin@gmail.com" ? (
                          <span className="text-[11px] font-semibold text-gray-400">Primary Admin</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteAdmin(u.id, u.email)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#5A6B58]">
                      No custom Admin users found. Fill out the form to create your first Admin account!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Farmer Management ──
function FarmersSection() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionRow, setActionRow] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Admin User state
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
    district: "Kerala"
  });

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newAdminUser.name.trim() || !newAdminUser.email.trim() || !newAdminUser.password.trim()) {
      toast.error("Please enter Name, Email, and Password.");
      return;
    }
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdminUser.name.trim(),
          email: newAdminUser.email.trim(),
          password: newAdminUser.password,
          phone: newAdminUser.phone,
          role: newAdminUser.role,
          district: newAdminUser.district
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`New ${newAdminUser.role} (${newAdminUser.email}) created successfully in MySQL!`);
        setShowAddAdminModal(false);
        setNewAdminUser({ name: "", email: "", password: "", phone: "", role: "admin", district: "Kerala" });
        loadFarmers();
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (err) {
      toast.error("Network error while creating user");
    }
  };

  // New farmer form state
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    phone: "",
    location: "",
    district: "Palakkad",
    crop: "Paddy (Jyothi)",
    acres: "2.5",
    soil_type: "Alluvial",
    status: "active",
  });

  const loadFarmers = async () => {
    setLoading(true);
    const res = await getFarmerList({ search, status: statusFilter });
    if (res && res.success) {
      setFarmers(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFarmers();
  }, [search, statusFilter]);

  const handleAddFarmerSubmit = async (e) => {
    e.preventDefault();
    if (!newFarmer.name.trim() || !newFarmer.crop.trim()) {
      toast.error("Please enter a valid farmer name and crop");
      return;
    }
    const res = await addFarmer(newFarmer);
    if (res.success) {
      toast.success("Farmer inserted into SQL database!");
      setShowAddModal(false);
      setNewFarmer({ name: "", phone: "", location: "", district: "Palakkad", crop: "Paddy (Jyothi)", acres: "2.5", soil_type: "Alluvial", status: "active" });
      loadFarmers();
    } else {
      toast.error(res.error || "Failed to add farmer");
    }
  };

  const handleDeleteFarmer = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    const res = await deleteFarmer(id);
    if (res.success) {
      toast.success(`Farmer ${name} deleted successfully`);
      setActionRow(null);
      loadFarmers();
    } else {
      toast.error(res.error || "Failed to delete farmer");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await updateFarmerStatus(id, newStatus);
    if (res.success) {
      toast.success(`Status updated to ${newStatus}`);
      setActionRow(null);
      loadFarmers();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  if (selected) {
    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Farmers</button>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="bg-[#071A0C] rounded-2xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#1B5E38] flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4">{selected.name.charAt(0)}</div>
            <div className="text-white font-extrabold text-xl font-[Plus_Jakarta_Sans]">{selected.name}</div>
            <div className="text-white/50 text-sm mt-1 flex items-center justify-center gap-1"><MapPin className="w-3 h-3" />{selected.location || selected.district}</div>
            <span className={`mt-3 inline-block text-xs font-bold px-3 py-1.5 rounded-full ${selected.status === "active" || selected.status === "Active" ? "bg-emerald-500/20 text-[#4ADE80]" : "bg-gray-500/20 text-gray-400"}`}>{selected.status}</span>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[["Acres", `${selected.acres || 1.0} ac`], ["Crop", (selected.crop || "Paddy").split(" ")[0]], ["ID", selected.id], ["Joined", selected.join_date || selected.joined || "Recent"]].map(([l, v]) => (
                <div key={l} className="bg-white/5 border border-white/8 rounded-xl p-3">
                  <div className="text-white font-bold text-sm font-[Plus_Jakarta_Sans]">{v}</div>
                  <div className="text-white/40 text-[10px]">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-5">Farm & Contact Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[["Name", selected.name], ["Email", selected.email || "Not provided"], ["Phone", selected.phone || "Not provided"], ["District", selected.district || selected.location], ["Total Land Area", `${selected.acres || 1.0} acres`], ["Account Status", selected.status], ["Registered Date", selected.created_at || selected.join_date || "Recent"]].map(([l, v]) => (
                  <div key={l}><div className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest mb-0.5">{l}</div><div className="font-semibold text-[#132B1A]">{v}</div></div>
                ))}
              </div>
            </div>

            {/* Farmer Added Products Section */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-4 flex items-center justify-between">
                <span>Farmer's Added Products</span>
                <span className="text-xs bg-[#1B5E38]/10 text-[#1B5E38] font-bold px-2.5 py-1 rounded-full">
                  {selected.products ? selected.products.length : 0} Products
                </span>
              </h3>
              {selected.products && selected.products.length > 0 ? (
                <div className="space-y-3">
                  {selected.products.map((p, idx) => (
                    <div key={p.id || idx} className="p-3.5 rounded-xl border border-border bg-gray-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-sm text-[#132B1A]">{p.product_name} <span className="text-gray-500 font-normal">({p.variety || 'Standard'})</span></div>
                        <div className="text-[#5A6B58] mt-0.5">Stage: <span className="font-semibold text-[#132B1A]">{p.growth_stage || 'Vegetative'}</span> • Rating: <span className="font-semibold text-emerald-600">{p.health_rating || 90}%</span></div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-[#1B5E38]">{p.quantity_acres} Acres</div>
                        <div className="text-gray-500">₹{p.price_per_unit || '2,400'} / unit</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-gray-500 text-xs">
                  This farmer has not added any products to the marketplace yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search real farmers…" className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all placeholder:text-gray-400" />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(v => !v)}
            className="p-2.5 rounded-xl bg-white border border-border hover:bg-gray-50 flex items-center gap-2 text-xs font-bold text-gray-600"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter}</span>
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white border border-border rounded-xl shadow-lg p-2 z-10">
              {["all", "active", "pending", "suspended", "inactive"].map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setStatusFilter(option);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors capitalize ${statusFilter === option ? "bg-[#1B5E38] text-white" : "text-[#132B1A] hover:bg-gray-50"}`}
                >
                  {option === "all" ? "All Farmers" : option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#1B5E38] hover:bg-[#155030] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-green-900/20 flex items-center gap-1.5 ml-auto sm:ml-0"
        >
          + Add New Farmer
        </button>

        <span className="text-xs text-[#5A6B58] ml-auto">{farmers.length} real records</span>
      </div>

      {/* Farmers Table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                {["Farmer Name", "District / Location", "Crop", "Acres", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#5A6B58] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#5A6B58] text-sm">
                    Loading farmers from SQL database…
                  </td>
                </tr>
              ) : farmers.length > 0 ? (
                farmers.map(f => (
                  <tr key={f.id} className="border-b border-border/50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#1B5E38]/10 flex items-center justify-center text-[#1B5E38] font-bold">
                          {f.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#132B1A]">{f.name}</div>
                          <div className="text-xs text-[#5A6B58]">{f.phone || "No phone"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-[#5A6B58]">
                        <MapPin className="w-3.5 h-3.5 text-[#1B5E38]" />
                        {f.district || f.location}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5A6B58] font-medium">{f.crop}</td>
                    <td className="px-5 py-4 text-sm text-[#5A6B58]">{f.acres ? `${f.acres} ac` : "1.0 ac"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                        f.status === "active" || f.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : f.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5A6B58]">{f.join_date || "Recent"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(f)} className="text-xs font-bold text-[#1B5E38] hover:underline">
                          View →
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActionRow(actionRow === f.id ? null : f.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {actionRow === f.id && (
                            <div className="absolute right-0 top-8 w-44 bg-white border border-border rounded-xl shadow-lg z-20 py-1">
                              <button
                                onClick={() => handleStatusUpdate(f.id, f.status === "active" ? "suspended" : "active")}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Set as {f.status === "active" ? "Suspended" : "Active"}
                              </button>
                              <button
                                onClick={() => handleDeleteFarmer(f.id, f.name)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                              >
                                Delete Farmer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#5A6B58] text-sm">
                    No farmer records found in database. Click <b>+ Add New Farmer</b> to insert one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add New Farmer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50">
              <h3 className="font-extrabold text-[#132B1A] text-lg font-[Plus_Jakarta_Sans]">Insert Real Farmer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFarmerSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Farmer Full Name *</label>
                <input
                  required
                  value={newFarmer.name}
                  onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
                  placeholder="e.g. KR Vijayakumar"
                  className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    value={newFarmer.phone}
                    onChange={e => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                    placeholder="+91 98470 12345"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">District</label>
                  <select
                    value={newFarmer.district}
                    onChange={e => setNewFarmer({ ...newFarmer, district: e.target.value, location: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  >
                    {["Palakkad", "Alappuzha", "Wayanad", "Thrissur", "Idukki", "Kottayam", "Malappuram", "Kozhikode", "Kannur", "Kasargod", "Ernakulam", "Kollam", "Pathanamthitta", "Trivandrum"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Primary Crop *</label>
                  <input
                    required
                    value={newFarmer.crop}
                    onChange={e => setNewFarmer({ ...newFarmer, crop: e.target.value })}
                    placeholder="e.g. Paddy (Uma)"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Acres</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFarmer.acres}
                    onChange={e => setNewFarmer({ ...newFarmer, acres: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Soil Type</label>
                  <input
                    value={newFarmer.soil_type}
                    onChange={e => setNewFarmer({ ...newFarmer, soil_type: e.target.value })}
                    placeholder="e.g. Alluvial / Red Clay"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">Initial Status</label>
                  <select
                    value={newFarmer.status}
                    onChange={e => setNewFarmer({ ...newFarmer, status: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1B5E38] hover:bg-[#155030] text-white font-bold shadow-md shadow-green-900/20"
                >
                  Save to SQL Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Crop Database ──
function CropDatabaseSection() {
  const [search, setSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFarmerList({ limit: 100 })
      .then(res => {
        if (res && res.success && Array.isArray(res.data)) {
          setFarmers(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = farmers.filter(f => 
    (f.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (f.location || f.district || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.crop || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Farmer Crop Database</h2>
      
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search real farmers by name, location or crop…" 
            className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all placeholder:text-gray-400" 
          />
        </div>
        <span className="text-xs text-[#5A6B58] font-bold">{filtered.length} registered farmers</span>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                {["Farmer Name", "District / Location", "Primary Crop", "Farm Size", "Status", "Joined"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#5A6B58] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5A6B58] text-sm">
                    Loading real farmer crops from database…
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map(f => (
                  <tr key={f.id} className="border-b border-border/50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#1B5E38]/10 flex items-center justify-center text-[#1B5E38] font-bold">
                          {(f.name || "F").charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#132B1A]">{f.name}</div>
                          <div className="text-xs text-[#5A6B58]">{f.phone || "No phone"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-[#5A6B58]">
                        <MapPin className="w-3.5 h-3.5 text-[#1B5E38]" />
                        {f.district || f.location || "Kerala"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5A6B58] font-semibold">{f.crop || "Paddy"}</td>
                    <td className="px-5 py-4 text-sm text-[#5A6B58]">{f.acres ? `${f.acres} ac` : "1.0 ac"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                        f.status === "active" || f.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {f.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5A6B58]">{f.join_date || "Recent"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5A6B58] text-sm">
                    No farmer crops in database. Newly registered farmers will appear here automatically in real time!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Market Management ──
function MarketManagementSection() {
  const [prices, setPrices] = useState(marketPriceTable.map(p => ({ ...p })));
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updatingCrop, setUpdatingCrop] = useState(null);
  const [editingCrop, setEditingCrop] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [graphSearch, setGraphSearch] = useState("");

  const parsedGraphData = prices.map((item) => ({
    crop: item.crop,
    current: Number.parseFloat(item.current.replace(/[^\d.]/g, "")),
    prediction: Number.parseFloat(item.prediction.replace(/[^\d.]/g, "")),
  }));

  const filteredGraphData = parsedGraphData
    .filter((item) => item.crop.toLowerCase().includes(graphSearch.toLowerCase()))
    .sort((a, b) => a.crop.localeCompare(b.crop));

  const handleUpdateAllPrices = () => {
    setUpdatingAll(true);
    setTimeout(() => {
      setPrices(prices.map(p => ({
        ...p,
        prev: p.current,
        current: `₹${Math.floor(Math.random() * 500 + parseInt(p.current.replace("₹", "")))}`,
        up: Math.random() > 0.5,
        trend: `${Math.floor(Math.random() * 10 + 1)}%`,
      })));
      setUpdatingAll(false);
      setShowUpdateModal(true);
      setTimeout(() => setShowUpdateModal(false), 2000);
    }, 1500);
  };

  const handleUpdateCrop = (crop) => {
    setEditingCrop(crop);
    const cropData = prices.find(p => p.crop === crop);
    if (cropData) {
      setEditPrice(cropData.current.replace("₹", ""));
    }
  };

  const savePrice = (crop) => {
    setUpdatingCrop(crop);
    setTimeout(() => {
      setPrices(prices.map(p => 
        p.crop === crop 
          ? {
              ...p,
              prev: p.current,
              current: `₹${editPrice}`,
              up: parseInt(editPrice) > parseInt(p.current.replace("₹", "")),
              trend: `${Math.floor(Math.random() * 8 + 1)}%`,
            }
          : p
      ));
      setUpdatingCrop(null);
      setEditingCrop(null);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Market Management</h2>
      
      {showUpdateModal && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-900">All prices updated successfully!</p>
            <p className="text-xs text-emerald-800">Market data refreshed at {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-[#132B1A]">Crop Price Table</h3>
          <button 
            onClick={handleUpdateAllPrices}
            disabled={updatingAll}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              updatingAll
                ? "text-emerald-700 bg-emerald-100 border border-emerald-200"
                : "text-[#1B5E38] bg-emerald-50 border border-emerald-100 hover:bg-emerald-100"
            }`}
          >
            {updatingAll ? "Updating..." : "Update All Prices"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-gray-50">
              {["Crop", "Current Price", "Previous Price", "Trend", "30-Day Prediction", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#5A6B58] uppercase tracking-widest">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {prices.map(m => (
                <tr key={m.crop} className="border-b border-border/50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4 font-semibold text-sm text-[#132B1A]">{m.crop}</td>
                  {editingCrop === m.crop ? (
                    <>
                      <td className="px-5 py-4">
                        <input
                          type="text"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          placeholder="Enter price"
                          className="w-20 px-2 py-1 border border-border rounded text-sm focus:border-[#1B5E38] focus:outline-none"
                        />
                      </td>
                      <td className="px-5 py-4 text-sm text-[#5A6B58]">{m.prev}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4 text-sm font-bold text-[#132B1A]">{m.current}</td>
                      <td className="px-5 py-4 text-sm text-[#5A6B58]">{m.prev}</td>
                    </>
                  )}
                  <td className="px-5 py-4"><span className={`text-xs font-bold flex items-center gap-0.5 ${m.up ? "text-emerald-600" : "text-rose-600"}`}>{m.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{m.trend}</span></td>
                  <td className="px-5 py-4 text-sm font-bold text-violet-600">{m.prediction}</td>
                  <td className="px-5 py-4">
                    {editingCrop === m.crop ? (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => savePrice(m.crop)}
                          disabled={updatingCrop === m.crop}
                          className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                            updatingCrop === m.crop
                              ? "text-emerald-700 bg-emerald-100"
                              : "text-white bg-[#1B5E38] hover:bg-[#154a2a]"
                          }`}
                        >
                          {updatingCrop === m.crop ? "..." : "Save"}
                        </button>
                        <button 
                          onClick={() => setEditingCrop(null)}
                          className="text-xs font-bold px-2 py-1 rounded text-[#5A6B58] bg-gray-100 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleUpdateCrop(m.crop)}
                        className="text-xs font-bold text-[#1B5E38] hover:underline"
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white border border-border rounded-2xl p-6">
        <h3 className="font-bold text-[#132B1A] mb-1">Market Prediction Graph</h3>
        <p className="text-sm text-[#5A6B58] mb-5">AI-predicted 30-day price movement (₹/quintal)</p>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={graphSearch}
            onChange={(e) => setGraphSearch(e.target.value)}
            placeholder="Search crop type…"
            className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all placeholder:text-gray-400"
          />
        </div>

        {filteredGraphData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredGraphData} barSize={18} margin={{ top: 0, right: 10, bottom: 70, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis
                dataKey="crop"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={90}
                minTickGap={0}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 11 }} formatter={(v) => [`₹${v}`, ""]} />
              <Bar dataKey="current" fill="#1B5E38" radius={[4, 4, 0, 0]} name="Current" />
              <Bar dataKey="prediction" fill="#4ADE80" radius={[4, 4, 0, 0]} name="Prediction" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-[#5A6B58] text-center">
            No crops found matching “{graphSearch}”
          </div>
        )}
      </div>
    </div>
  );
}

// ── Analytics ──
function AnalyticsSection() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Platform Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[["₹8.8L", "Monthly Revenue", "text-[#1B5E38]"], ["95%", "AI Accuracy", "text-sky-600"], ["58K", "Daily Sessions", "text-violet-600"], ["11,500", "Active Users", "text-amber-600"]].map(([v, l, c]) => (
          <div key={l} className="bg-white border border-border rounded-2xl p-5 text-center">
            <div className={`text-3xl font-extrabold font-[Plus_Jakarta_Sans] ${c}`}>{v}</div>
            <div className="text-sm text-[#5A6B58] mt-1">{l}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">User Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs><linearGradient id="uG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1B5E38" stopOpacity={0.2} /><stop offset="95%" stopColor="#1B5E38" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 11 }} />
              <Area type="monotone" dataKey="farmers" stroke="#1B5E38" fill="url(#uG)" strokeWidth={2.5} name="Users" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData} barSize={24} margin={{ top: 0, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 11 }} formatter={(v) => [`₹${(v / 1000).toFixed(0)}K`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Reports ──
function ReportsSection() {
  const [viewingReport, setViewingReport] = useState(null);
  const [downloadingReports, setDownloadingReports] = useState(new Set());

  const reports = [
    { title: "Monthly Platform Analytics", date: "July 2024", size: "4.8 MB", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { title: "Crop Disease Summary Report", date: "July 2024", size: "2.1 MB", cls: "bg-rose-50 text-rose-700 border-rose-100" },
    { title: "Farmer Onboarding Report", date: "July 2024", size: "1.4 MB", cls: "bg-sky-50 text-sky-700 border-sky-100" },
    { title: "AI Usage & Accuracy Report", date: "July 2024", size: "3.2 MB", cls: "bg-violet-50 text-violet-700 border-violet-100" },
    { title: "Market Price Accuracy Report", date: "June 2024", size: "2.8 MB", cls: "bg-amber-50 text-amber-700 border-amber-100" },
    { title: "Annual Impact Summary 2023–24", date: "Q1–Q2 2024", size: "6.5 MB", cls: "bg-teal-50 text-teal-700 border-teal-100" },
  ];

  const handleView = (title) => {
    setViewingReport(title);
  };

  const handleDownload = (title) => {
    const newDownloading = new Set(downloadingReports);
    newDownloading.add(title);
    setDownloadingReports(newDownloading);
    
    setTimeout(() => {
      const updated = new Set(downloadingReports);
      updated.delete(title);
      setDownloadingReports(updated);
    }, 2000);
  };

  if (viewingReport) {
    return (
      <div className="space-y-5">
        <button onClick={() => setViewingReport(null)} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Reports</button>
        
        <div className="bg-white border border-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{viewingReport}</h2>
              <p className="text-sm text-[#5A6B58] mt-1">Detailed report analysis and insights</p>
            </div>
            <button onClick={() => handleDownload(viewingReport)} className="text-sm font-bold text-white bg-[#1B5E38] hover:bg-[#154a2a] px-4 py-2.5 rounded-lg transition-colors">
              Download Report
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-border rounded-xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-3">Report Summary</h3>
              <p className="text-sm text-[#5A6B58] leading-relaxed">
                This comprehensive report provides detailed analysis of platform metrics, user engagement, crop performance, and AI model accuracy. It includes actionable insights and recommendations for optimization across all major operational areas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Total Pages", value: "24" },
                { label: "Data Points Analyzed", value: "12,450+" },
                { label: "Date Generated", value: "Today, 2:45 PM" },
                { label: "Next Update", value: "Tomorrow" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">
                  <div className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest">{label}</div>
                  <div className="text-2xl font-extrabold text-[#1B5E38] mt-1 font-[Plus_Jakarta_Sans]">{value}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-900">📊 Detailed charts, tables, and visualizations are included in the full PDF report.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleDownload(viewingReport)} className="flex-1 text-sm font-bold text-white bg-[#1B5E38] hover:bg-[#154a2a] px-4 py-3 rounded-lg transition-colors">
                Download as PDF
              </button>
              <button className="flex-1 text-sm font-bold text-[#1B5E38] bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 px-4 py-3 rounded-lg transition-colors">
                Export as Excel
              </button>
              <button onClick={() => setViewingReport(null)} className="flex-1 text-sm font-bold text-[#5A6B58] bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Platform Reports</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {reports.map(({ title, date, size, cls }) => (
          <div key={title} className="bg-white border border-border rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl border ${cls} flex items-center justify-center flex-shrink-0`}><FileText className="w-5 h-5" /></div>
              <div><div className="font-bold text-[#132B1A] text-sm">{title}</div><div className="text-xs text-[#5A6B58] mt-0.5">{date} · {size}</div></div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleView(title)}
                className="text-xs font-bold text-[#5A6B58] bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-[#132B1A] transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => handleDownload(title)}
                disabled={downloadingReports.has(title)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  downloadingReports.has(title)
                    ? "text-emerald-700 bg-emerald-100 border border-emerald-200"
                    : "text-[#1B5E38] bg-emerald-50 border border-emerald-100 hover:bg-emerald-100"
                }`}
              >
                {downloadingReports.has(title) ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings ──
function SettingsSection() {
  const [settings, setSettings] = useState({
    diseaseAlerts: true,
    priceAlerts: true,
    weeklyReports: true,
    systemUpdates: true,
    twoFactorAuth: true,
    apiRateLimit: true,
    emailNotifications: true,
    smsNotifications: true,
  });

  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem("krishi_user_profile") || "{}");
      return {
        adminName: p.name || localStorage.getItem("krishi_user") || "Admin User",
        email: p.email || localStorage.getItem("krishi_user_email") || "admin@gmail.com",
        phone: p.phone || "",
        role: p.role || "Platform Administrator",
        sessionTimeout: "8 hours",
        apiLimit: "100 req/min",
        diseaseThreshold: "95%",
        forecastWindow: "30 days",
        alertLeadTime: "48 hours",
        languages: "ML, EN, HI",
      };
    } catch (e) {
      return {
        adminName: "Admin User",
        email: "admin@gmail.com",
        phone: "",
        role: "Platform Administrator",
        sessionTimeout: "8 hours",
        apiLimit: "100 req/min",
        diseaseThreshold: "95%",
        forecastWindow: "30 days",
        alertLeadTime: "48 hours",
        languages: "ML, EN, HI",
      };
    }
  });

  const [tempFormData, setTempFormData] = useState(formData);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startEdit = (section) => {
    setTempFormData(formData);
    setEditMode(section);
  };

  const saveEdit = async () => {
    setFormData(tempFormData);
    const activeEdit = editMode;
    setEditMode(null);

    if (activeEdit === "profile") {
      const updatedProfile = {
        name: tempFormData.adminName,
        email: tempFormData.email,
        phone: tempFormData.phone,
        role: tempFormData.role,
        district: "Kerala"
      };
      localStorage.setItem("krishi_user", tempFormData.adminName);
      localStorage.setItem("krishi_user_email", tempFormData.email);
      localStorage.setItem("krishi_user_profile", JSON.stringify(updatedProfile));

      window.dispatchEvent(new Event("profileUpdated"));

      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/admin/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: tempFormData.adminName,
            email: tempFormData.email,
            phone: tempFormData.phone,
            role: tempFormData.role,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("Admin profile updated manually in MySQL database!");
        } else {
          toast.success("Admin profile saved!");
        }
      } catch (err) {
        toast.success("Admin profile saved locally!");
      }
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
  };

  const handleInputChange = (key, value) => {
    setTempFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Platform Settings</h2>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Profile Settings */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">Profile Settings</h3>
          {editMode === "profile" ? (
            <div className="space-y-4">
              {[
                { label: "Admin Name", key: "adminName" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Role", key: "role" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={tempFormData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-[#1B5E38] focus:outline-none"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-3">
                <button onClick={saveEdit} className="flex-1 text-xs font-bold text-white bg-[#1B5E38] hover:bg-[#154a2a] px-3 py-2.5 rounded-lg transition-colors">Save</button>
                <button onClick={cancelEdit} className="flex-1 text-xs font-bold text-[#5A6B58] bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {[["Admin Name", "adminName"], ["Email", "email"], ["Phone", "phone"], ["Role", "role"]].map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-[#5A6B58]">{label}</span>
                    <span className="text-sm font-bold text-[#132B1A]">{formData[key]}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => startEdit("profile")} className="mt-4 text-xs font-bold text-[#1B5E38] hover:underline">Edit Profile →</button>
            </>
          )}
        </div>

        {/* Security Settings */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">Security</h3>
          {editMode === "security" ? (
            <div className="space-y-4">
              {[
                { label: "Session Timeout", key: "sessionTimeout" },
                { label: "API Rate Limit", key: "apiLimit" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={tempFormData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-[#1B5E38] focus:outline-none"
                  />
                </div>
              ))}
              <div className="pt-3 space-y-3">
                {[["Two-Factor Auth", "Enabled"], ["Last Login", "Today, 9:12 AM"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-[#5A6B58]">{l}</span>
                    <span className="text-sm font-bold text-[#132B1A]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-3">
                <button onClick={saveEdit} className="flex-1 text-xs font-bold text-white bg-[#1B5E38] hover:bg-[#154a2a] px-3 py-2.5 rounded-lg transition-colors">Save</button>
                <button onClick={cancelEdit} className="flex-1 text-xs font-bold text-[#5A6B58] bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {[["Session Timeout", "sessionTimeout"], ["API Rate Limit", "apiLimit"], ["Two-Factor Auth", "Enabled"], ["Last Login", "Today, 9:12 AM"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-[#5A6B58]">{l}</span>
                    <span className="text-sm font-bold text-[#132B1A]">{v === "sessionTimeout" || v === "apiLimit" ? formData[v] : v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => startEdit("security")} className="mt-4 text-xs font-bold text-[#1B5E38] hover:underline">Edit Security →</button>
            </>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">Notification Settings</h3>
          <div className="space-y-3">
            {[
              { label: "Disease Alert Emails", key: "diseaseAlerts" },
              { label: "Market Price Alerts", key: "priceAlerts" },
              { label: "Weekly Reports", key: "weeklyReports" },
              { label: "System Updates", key: "systemUpdates" },
            ].map(({ label, key }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-[#5A6B58]">{label}</span>
                <button
                  onClick={() => toggleSetting(key)}
                  className={`w-11 h-6 rounded-full transition-all flex items-center px-1 ${
                    settings[key]
                      ? "bg-emerald-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs font-bold text-[#1B5E38] hover:underline">Manage Notifications →</button>
        </div>

        {/* AI Configuration */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">AI Configuration</h3>
          {editMode === "ai" ? (
            <div className="space-y-4">
              {[
                { label: "Disease Detection Threshold", key: "diseaseThreshold" },
                { label: "Price Forecast Window", key: "forecastWindow" },
                { label: "Alert Lead Time", key: "alertLeadTime" },
                { label: "Supported Languages", key: "languages" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={tempFormData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-[#1B5E38] focus:outline-none"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-3">
                <button onClick={saveEdit} className="flex-1 text-xs font-bold text-white bg-[#1B5E38] hover:bg-[#154a2a] px-3 py-2.5 rounded-lg transition-colors">Save</button>
                <button onClick={cancelEdit} className="flex-1 text-xs font-bold text-[#5A6B58] bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {[["Disease Detection Threshold", "diseaseThreshold"], ["Price Forecast Window", "forecastWindow"], ["Alert Lead Time", "alertLeadTime"], ["Supported Languages", "languages"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-[#5A6B58]">{l}</span>
                    <span className="text-sm font-bold text-[#132B1A]">{formData[v]}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => startEdit("ai")} className="mt-4 text-xs font-bold text-[#1B5E38] hover:underline">Configure AI →</button>
            </>
          )}
        </div>

        {/* Additional Notification Options */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">Additional Preferences</h3>
          <div className="space-y-3">
            {[
              { label: "Email Notifications", key: "emailNotifications" },
              { label: "SMS Notifications", key: "smsNotifications" },
              { label: "Two-Factor Auth", key: "twoFactorAuth" },
              { label: "API Rate Limiting", key: "apiRateLimit" },
            ].map(({ label, key }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-[#5A6B58]">{label}</span>
                <button
                  onClick={() => toggleSetting(key)}
                  className={`w-11 h-6 rounded-full transition-all flex items-center px-1 ${
                    settings[key]
                      ? "bg-emerald-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs font-bold text-[#1B5E38] hover:underline">Save Preferences →</button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard({ navigate, initialSection }) {
  const [section, setSection] = useState(initialSection || "dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, icon: AlertTriangle, msg: "High disease reports in Palakkad — 34 new detections today", time: "12 min ago", cls: "border-l-amber-400 bg-amber-50", read: false },
    { id: 2, icon: CheckCircle, msg: "AI model updated — Disease detection accuracy improved to 96%", time: "2 hrs ago", cls: "border-l-emerald-400 bg-emerald-50", read: false },
    { id: 3, icon: Bell, msg: "120 crop queries from Wayanad farmers this morning", time: "4 hrs ago", cls: "border-l-sky-400 bg-sky-50", read: false },
    { id: 4, icon: AlertTriangle, msg: "Heavy rain advisory — 18 Thrissur farmers notified", time: "6 hrs ago", cls: "border-l-amber-400 bg-amber-50", read: false },
  ]);

  if (showAllNotifications) {
    return (
      <AdminLayout 
        section={section} 
        setSection={setSection} 
        sideOpen={sideOpen} 
        setSideOpen={setSideOpen} 
        navigate={navigate}
        showAllNotifications={showAllNotifications}
        setShowAllNotifications={setShowAllNotifications}
        notifications={notifications}
        setNotifications={setNotifications}
      >
        <NotificationsFullPage 
          notifications={notifications} 
          setNotifications={setNotifications} 
          onBack={() => setShowAllNotifications(false)} 
        />
      </AdminLayout>
    );
  }

  const render = () => {
    switch (section) {
      case "dashboard": return <AdminHome setSection={setSection} />;
      case "farmers": return <FarmersSection />;
      case "add-admin": return <AddAdminSection />;
      case "crop-database": return <CropDatabaseSection />;
      case "market-management": return <MarketManagementSection />;
      case "analytics": return <AnalyticsSection />;
      case "reports": return <ReportsSection />;
      case "settings": return <SettingsSection />;
      default: return <AdminHome setSection={setSection} />;
    }
  };

  return (
    <AdminLayout 
      section={section} 
      setSection={setSection} 
      sideOpen={sideOpen} 
      setSideOpen={setSideOpen} 
      navigate={navigate}
      showAllNotifications={showAllNotifications}
      setShowAllNotifications={setShowAllNotifications}
      notifications={notifications}
      setNotifications={setNotifications}
    >
      {render()}
    </AdminLayout>
  );
}
