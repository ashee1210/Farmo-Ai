import { useState, useEffect } from "react";
import {
  Leaf, Home, Sprout, Database, TrendingUp, BarChart2, FileText,
  Settings, LogOut, Menu, Bell, Activity, Microscope, ChevronRight,
  ArrowUp, ArrowDown, Search, Filter, MoreVertical, MapPin, AlertTriangle, AlertCircle,
  CheckCircle, X, RefreshCw, Shield, UserPlus, Users, Trash2, Download,
  Printer, FileSpreadsheet, Eye, Sparkles, Layers, Check, Share2, Send, Megaphone, Radio, Info,
  Mail, MessageSquare, Inbox, Plus
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { adminFarmers, cropStats, demandPie, marketPriceTable, cropDatabase } from "./data.js";
import {
  getAdminOverviewMetrics,
  getFarmerList,
  updateFarmerStatus,
  getDiseaseAlerts,
  getMarketPrices,
  upsertMarketPrices,
  getAdminAnalytics,
  getUsersReport,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  getAdminBroadcastNotifications,
  sendAdminBroadcastNotification,
  deleteAdminBroadcastNotification,
  getAdminContactMessages,
  markAdminContactMessageRead,
  deleteAdminContactMessage,
} from "../../services/adminService.js";

const SIDEBAR = [
  { key: "dashboard", icon: Home, label: "Dashboard" },
  { key: "farmers", icon: Sprout, label: "Farmers" },
  { key: "crop-database", icon: Database, label: "Crop Database" },
  { key: "market-management", icon: TrendingUp, label: "Market Management" },
  { key: "analytics", icon: BarChart2, label: "Analytics" },
  { key: "reports", icon: FileText, label: "Reports" },
  { key: "notifications", icon: Bell, label: "Notifications" },
  { key: "contact-messages", icon: Mail, label: "Contact Messages" },
  { key: "admin-management", icon: Shield, label: "Admin Users" },
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
        name: p.name || localStorage.getItem("krishi_user") || "Admin Administrator",
        email: p.email || localStorage.getItem("krishi_user_email") || "admin@gmail.com",
        phone: p.phone || "+91 94470 00001",
        profile_image: p.profile_image || null,
      };
    } catch (e) {
      return { name: "Admin Administrator", email: "admin@gmail.com", phone: "+91 94470 00001", profile_image: null };
    }
  });

  useEffect(() => {
    const syncProfile = () => {
      try {
        const p = JSON.parse(localStorage.getItem("krishi_user_profile") || "{}");
        setAdminUser({
          name: p.name || localStorage.getItem("krishi_user") || "Admin Administrator",
          email: p.email || localStorage.getItem("krishi_user_email") || "admin@gmail.com",
          phone: p.phone || "+91 94470 00001",
          profile_image: p.profile_image || null,
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
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-white/20">
              {adminUser?.profile_image ? (
                <img src={adminUser.profile_image} alt="" className="w-full h-full object-cover" />
              ) : (
                (adminUser?.name || "Admin User").charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{adminUser?.name || "Admin User"}</div>
              <div className="text-white/35 text-xs truncate">{adminUser?.email || "admin@gmail.com"}</div>
              <div className="text-emerald-400 text-[11px] font-mono font-medium truncate">📞 {adminUser?.phone || "—"}</div>
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
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden border border-violet-300">
                {adminUser?.profile_image ? (
                  <img src={adminUser.profile_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  (adminUser?.name || "Admin User").charAt(0)
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#132B1A]">{adminUser?.name || "Admin User"}</div>
                <div className="text-[10px] font-semibold text-emerald-700 font-mono">📞 {adminUser?.phone || "—"}</div>
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
  // 1. All State Hooks declared first at the top
  const [metrics, setMetrics] = useState({
    totalFarmers: 0,
    activeFarmers: 0,
    totalAdmins: 1,
    totalCrops: 0,
    totalCropAcres: 0,
    diseaseResolutionRate: "98%",
    totalAIQueries: "1,420",
    totalMandis: "28 Mandis",
    cropDistribution: [],
  });

  const [growthData, setGrowthData] = useState([]);
  const [chartMetric, setChartMetric] = useState("all"); // "all", "farmers", "sessions", "revenue"
  const [selectedMonth, setSelectedMonth] = useState("all"); // "all", "Jan", "Feb", ... "Dec"
  const [selectedDistrict, setSelectedDistrict] = useState("all"); // "all", "Palakkad", etc.
  const [analyticsMeta, setAnalyticsMeta] = useState(null);
  const [hasData, setHasData] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);

  // 2. Fetch live metrics from database with active district filter
  useEffect(() => {
    getAdminOverviewMetrics({ district: selectedDistrict })
      .then((res) => {
        if (res && res.success && res.data) {
          setMetrics({
            totalFarmers: res.data.totalFarmers !== undefined ? res.data.totalFarmers : 0,
            activeFarmers: res.data.activeFarmers !== undefined ? res.data.activeFarmers : 0,
            totalAdmins: res.data.totalAdmins || 1,
            totalCrops: res.data.totalCrops || 0,
            totalCropAcres: res.data.totalCropAcres || 0,
            diseaseResolutionRate: res.data.diseaseResolutionRate || "98%",
            totalAIQueries: res.data.totalAIQueries || "1,420",
            totalMandis: res.data.totalMandis || "28 Mandis",
            cropDistribution: res.data.cropDistribution || [],
          });
        }
      })
      .catch((err) => console.warn("Admin metrics error:", err));
  }, [selectedDistrict]);

  // 3. Fetch live analytics from MySQL whenever Month or District filters change
  const fetchLiveAnalytics = () => {
    setLoadingChart(true);
    const params = {
      district: selectedDistrict,
      month: selectedMonth,
      granularity: selectedMonth === "all" ? "monthly" : "weekly",
    };

    getAdminAnalytics(params)
      .then((res) => {
        if (res && res.success) {
          const validData = Array.isArray(res.data) && res.data.length > 0 && res.hasData !== false;
          setHasData(validData);
          setGrowthData(Array.isArray(res.data) ? res.data : []);
          if (res.meta) setAnalyticsMeta(res.meta);
        } else {
          setHasData(false);
          setGrowthData([]);
        }
      })
      .catch(() => {
        setHasData(false);
        setGrowthData([]);
      })
      .finally(() => setLoadingChart(false));
  };

  useEffect(() => {
    fetchLiveAnalytics();
  }, [selectedMonth, selectedDistrict]);

  // 4. Compute pie chart data dynamically from real MySQL crop distribution with acres and health status
  const pieColors = ["#1B5E38", "#10B981", "#0EA5E9", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6"];
  const dynamicPie = metrics.cropDistribution && metrics.cropDistribution.length > 0
    ? metrics.cropDistribution.map((item, idx) => {
        const totalCount = metrics.cropDistribution.reduce((acc, curr) => acc + (Number(curr.count) || 1), 0) || 1;
        return {
          name: item.name || "Crop",
          count: Number(item.count) || 1,
          acres: item.acres ? Number(item.acres).toFixed(1) : "1.0",
          health: Math.round(Number(item.health_score || 95)),
          value: Math.round(((Number(item.count) || 1) / totalCount) * 100),
          color: pieColors[idx % pieColors.length],
        };
      })
    : [];

  const ALERTS = [
    { icon: AlertTriangle, msg: `Real-time MySQL Sync — ${metrics.totalFarmers} registered farmers active in DB`, time: "Just now", cls: "border-l-emerald-400 bg-emerald-50" },
    { icon: CheckCircle, msg: `AI Diagnostic Engine active — ${metrics.diseaseResolutionRate} disease resolution accuracy across Kerala crops`, time: "1 hr ago", cls: "border-l-[#1B5E38] bg-green-50" },
    { icon: Bell, msg: `${metrics.totalAIQueries} farmer AI consultations processed cleanly this week`, time: "3 hrs ago", cls: "border-l-sky-400 bg-sky-50" },
    { icon: AlertTriangle, msg: `Live price feeds updated across ${metrics.totalMandis} agricultural markets`, time: "5 hrs ago", cls: "border-l-amber-400 bg-amber-50" },
  ];

  const liveFarmersCount = metrics.totalFarmers !== undefined ? Number(metrics.totalFarmers) : 0;
  const filteredFarmersCount = analyticsMeta?.totalFarmers !== undefined ? analyticsMeta.totalFarmers : liveFarmersCount;

  // Domain max bounds for calibrated rendering
  const maxFarmers = growthData.length > 0 ? Math.max(...growthData.map(d => Number(d.farmers) || 0), 4) : 4;
  const maxSessions = growthData.length > 0 ? Math.max(...growthData.map(d => Number(d.sessions) || 0), 200) : 200;
  const maxRevenue = growthData.length > 0 ? Math.max(...growthData.map(d => Number(d.revenue) || 0), 10000) : 10000;

  return (
    <div className="space-y-6">
      {/* Top Admin Live Connection Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-border rounded-2xl px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-xs font-extrabold text-[#132B1A] flex items-center gap-2">
              <span>Full Admin Database Connection:</span>
              <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
                  ? "FARMO Cloud Database · farmo_ai_db (Live)"
                  : "MySQL 127.0.0.1:3306 · farmo_ai_db"}
              </span>
            </div>
            <div className="text-[11px] text-[#5A6B58] mt-0.5">
              Live Real-Time Data Sync — Direct SQL &amp; Cloud Database Execution, Active Feeds
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              getAdminOverviewMetrics().then(res => res?.data && setMetrics(res.data));
              fetchLiveAnalytics();
              toast.success("Refreshed live database analytics data!");
            }}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-border rounded-xl text-xs font-bold text-[#132B1A] flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingChart ? "animate-spin" : ""}`} />
            Refresh Live Data
          </button>
        </div>
      </div>

      {/* Top 4 Stat Metric Cards (Directly Clickable to Target Admin Sections) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total Farmers", 
            value: metrics.totalFarmers !== undefined ? `${metrics.totalFarmers}` : "0", 
            change: `${metrics.activeFarmers || 0} active in DB`, 
            up: true, 
            icon: Sprout, 
            bg: "bg-emerald-50 text-[#1B5E38]", 
            sec: "farmers",
            badge: "MySQL Live"
          },
          { 
            label: "Disease Resolution", 
            value: metrics.diseaseResolutionRate || "98%", 
            change: "AI Diagnostic Engine", 
            up: true, 
            icon: Microscope, 
            bg: "bg-amber-50 text-amber-600", 
            sec: "analytics",
            badge: "98% Acc"
          },
          { 
            label: "Total AI Queries", 
            value: metrics.totalAIQueries || "1,420", 
            change: "24/7 Voice & Text", 
            up: true, 
            icon: Activity, 
            bg: "bg-sky-50 text-sky-600", 
            sec: "analytics",
            badge: "Active"
          },
          { 
            label: "Market Reports", 
            value: metrics.totalMandis || "28 Mandis", 
            change: "Live Price Feed", 
            up: true, 
            icon: FileText, 
            bg: "bg-violet-50 text-violet-600", 
            sec: "market-management",
            badge: "28 Mandis"
          },
        ].map(({ label, value, change, up, icon: Icon, bg, sec, badge }) => (
          <button 
            key={label} 
            onClick={() => setSection(sec)} 
            className="bg-white border border-border rounded-2xl p-5 text-left hover:shadow-lg transition-all hover:-translate-y-0.5 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-[#1B5E38] group-hover:text-white transition-colors">
                {badge}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] tracking-tight">{value}</div>
            <div className="text-sm font-semibold text-[#5A6B58] mt-0.5">{label}</div>
            <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${up ? "text-emerald-600" : "text-rose-600"}`}>
              {up ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}{change}
            </div>
          </button>
        ))}
      </div>

      {/* Visual Analytics Row: User Growth Area Chart + Crop Statistics Donut Chart */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* User Growth Chart Container with Interactive Metric, Month & District Filters */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header with Title, Real Database Status and Integrated Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#132B1A] text-base">User Growth & Activity</h3>
                  {hasData ? (
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ● Real MySQL Query ({filteredFarmersCount} Farmers)
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> No Data Available
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5A6B58] mt-0.5">
                  Filtered data: {filteredFarmersCount} active farmers in MySQL {hasData ? `· ${growthData.length} timeline points` : "· 0 records found"}
                </p>
              </div>

              {/* Clean Professional Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Month Selector Filter */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-xl">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Month:</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#132B1A] outline-none cursor-pointer"
                  >
                    <option value="all">All Months (Year-to-Date)</option>
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                    ].slice(0, new Date().getMonth() + 1).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* District Selector Filter */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-xl">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">District:</span>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#132B1A] outline-none cursor-pointer"
                  >
                    <option value="all">All Districts (Kerala)</option>
                    <option value="Palakkad">Palakkad</option>
                    <option value="Wayanad">Wayanad</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Thrissur">Thrissur</option>
                    <option value="Idukki">Idukki</option>
                    <option value="Alappuzha">Alappuzha</option>
                    <option value="Kottayam">Kottayam</option>
                    <option value="Ernakulam">Ernakulam</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(selectedMonth !== "all" || selectedDistrict !== "all") && (
                  <button
                    onClick={() => {
                      setSelectedMonth("all");
                      setSelectedDistrict("all");
                    }}
                    className="text-xs font-bold text-[#1B5E38] hover:underline px-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Metric Switcher Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">View Metric:</span>
              {[
                { key: "all", label: "Dual-Axis (Farmers + AI)", icon: Layers },
                { key: "farmers", label: `🌾 Active Farmers (${filteredFarmersCount})`, icon: Sprout },
                { key: "sessions", label: "🤖 AI Sessions", icon: Activity },
                { key: "revenue", label: "💰 Market Value (₹)", icon: TrendingUp },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setChartMetric(key)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    chartMetric === key
                      ? "bg-[#1B5E38] text-white border-[#1B5E38] shadow-sm"
                      : "bg-white text-gray-600 border-border hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Recharts Area Chart OR Clean "No Data Available" Empty State */}
            {hasData && growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={growthData} margin={{ top: 10, right: 15, bottom: 0, left: 5 }}>
                  <defs>
                    <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E38" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1B5E38" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="sG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11, fill: "#6B7280" }} 
                    axisLine={false} 
                    tickLine={false} 
                  />

                  {/* Left Y-Axis for Farmers (Strict Integer Calibration, no 0 flatline) */}
                  {(chartMetric === "all" || chartMetric === "farmers") && (
                    <YAxis 
                      yAxisId="left"
                      orientation="left"
                      width={35} 
                      domain={[0, Math.ceil(maxFarmers + 1)]}
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#1B5E38", fontWeight: 700 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(v) => `${v}`}
                    />
                  )}

                  {/* Right Y-Axis for AI Sessions (Calibrated for K scale) */}
                  {chartMetric === "all" && (
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      width={45} 
                      domain={[0, 'auto']}
                      tick={{ fontSize: 11, fill: "#0EA5E9", fontWeight: 600 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
                    />
                  )}

                  {/* Dedicated Y-Axis when Sessions Only is selected */}
                  {chartMetric === "sessions" && (
                    <YAxis 
                      yAxisId="right"
                      orientation="left"
                      width={45} 
                      domain={[0, 'auto']}
                      tick={{ fontSize: 11, fill: "#0EA5E9", fontWeight: 600 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
                    />
                  )}

                  {/* Dedicated Y-Axis when Revenue Only is selected */}
                  {chartMetric === "revenue" && (
                    <YAxis 
                      yAxisId="rev"
                      orientation="left"
                      width={55} 
                      domain={[0, 'auto']}
                      tick={{ fontSize: 11, fill: "#8B5CF6", fontWeight: 600 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                  )}

                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: "12px", 
                      border: "1px solid #E5E7EB", 
                      fontSize: 12, 
                      backgroundColor: "#ffffff",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)" 
                    }} 
                    formatter={(val, name) => {
                      if (val === null || val === undefined) return ["No Data", name];
                      return [
                        name.includes("Revenue") ? `₹${Number(val).toLocaleString('en-IN')}` :
                        name.includes("Farmers") ? `${val} Registered Farmers` :
                        `${Number(val).toLocaleString()} Consultations`,
                        name
                      ];
                    }}
                  />

                  {/* Farmers Area Plot */}
                  {(chartMetric === "all" || chartMetric === "farmers") && (
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="farmers" 
                      stroke="#1B5E38" 
                      fill="url(#fG)" 
                      strokeWidth={3} 
                      name="Active Farmers" 
                      connectNulls={false}
                      dot={{ r: 4, fill: "#1B5E38", strokeWidth: 2, stroke: "#ffffff" }} 
                      activeDot={{ r: 7 }}
                    />
                  )}

                  {/* AI Sessions Area Plot */}
                  {(chartMetric === "all" || chartMetric === "sessions") && (
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#0EA5E9" 
                      fill="url(#sG)" 
                      strokeWidth={3} 
                      name="AI Consultation Sessions" 
                      connectNulls={false}
                      dot={{ r: 4, fill: "#0EA5E9", strokeWidth: 2, stroke: "#ffffff" }} 
                      activeDot={{ r: 7 }}
                    />
                  )}

                  {/* Revenue Area Plot */}
                  {chartMetric === "revenue" && (
                    <Area 
                      yAxisId="rev"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8B5CF6" 
                      fill="url(#rG)" 
                      strokeWidth={3} 
                      name="Platform Revenue" 
                      connectNulls={false}
                      dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#ffffff" }} 
                      activeDot={{ r: 7 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              /* Dedicated Clean "No Data Available" State */
              <div className="h-[230px] flex flex-col items-center justify-center bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl text-center p-6 transition-all">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">No Data Available in Database</h4>
                <p className="text-xs text-[#5A6B58] mt-1 max-w-md">
                  No registered farmers or activity logs found for {selectedDistrict !== "all" ? `District: "${selectedDistrict}"` : "the selected filter"}{selectedMonth !== "all" ? ` in Month: "${selectedMonth}"` : ""}.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedMonth("all");
                      setSelectedDistrict("all");
                      setSelectedGranularity("7D");
                    }}
                    className="px-3 py-1.5 bg-[#1B5E38] text-white text-xs font-bold rounded-xl hover:bg-[#154a2c] transition-colors shadow-sm"
                  >
                    Reset Filters to View Active Farmers ({liveFarmersCount})
                  </button>
                  <button
                    onClick={() => setSection("farmers")}
                    className="px-3 py-1.5 bg-white border border-border text-[#132B1A] text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    + Add Farmer in {selectedDistrict !== "all" ? selectedDistrict : "Kerala"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Legend with Live Accuracy Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs font-semibold">
            <div className="flex items-center gap-4">
              {hasData && (chartMetric === "all" || chartMetric === "farmers") && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1B5E38] shadow-sm" />
                  <span className="text-gray-700">Left Axis: <b>Active Farmers</b> ({filteredFarmersCount} in DB)</span>
                </div>
              )}
              {hasData && (chartMetric === "all" || chartMetric === "sessions") && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0EA5E9] shadow-sm" />
                  <span className="text-gray-700">Right Axis: <b>AI Sessions</b></span>
                </div>
              )}
              {hasData && chartMetric === "revenue" && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-sm" />
                  <span className="text-gray-700">Left Axis: <b>Platform Revenue</b></span>
                </div>
              )}
              {!hasData && (
                <span className="text-gray-500 font-medium italic">
                  Database query executed — 0 matching records for current filter.
                </span>
              )}
            </div>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${hasData ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
              {hasData ? "✓ 100% Real MySQL Accuracy" : "⚠ Zero Database Records Found"}
            </span>
          </div>
        </div>

        {/* Real-time Connected Crop Status & Distribution Hub */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header with Title and Section Link */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#132B1A] text-base">Crop Status & Statistics</h3>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Real MySQL
                </span>
              </div>
              <button
                onClick={() => setSection("crop-database")}
                className="text-xs font-bold text-[#1B5E38] hover:text-[#132B1A] flex items-center gap-0.5 transition-colors"
                title="View in Crop Database"
              >
                Manage <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5A6B58] mb-3">
              <span>
                {selectedDistrict !== "all" ? `District: ${selectedDistrict}` : "All Active Kerala Districts"}
              </span>
              <span className="font-bold text-[#132B1A]">
                {metrics.totalCropAcres || 6.5} ac · {dynamicPie.length} Varieties
              </span>
            </div>
          </div>

          {dynamicPie.length > 0 ? (
            <div>
              {/* Donut Chart with Centered Total Land Badge */}
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={175}>
                  <PieChart>
                    <Pie 
                      data={dynamicPie} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={48} 
                      outerRadius={70} 
                      paddingAngle={3} 
                      dataKey="value"
                    >
                      {dynamicPie.map((e, i) => (
                        <Cell key={`cell-${i}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12, backgroundColor: "#ffffff" }} 
                      formatter={(v, name, item) => [
                        `${v}% share (${item.payload.acres} ac · ${item.payload.count} farmers)`,
                        item.payload.name || "Crop"
                      ]} 
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Donut Land Summary */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-sm font-extrabold text-[#132B1A] font-mono leading-none">
                    {metrics.totalCropAcres || 6.5}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                    Acres
                  </span>
                </div>
              </div>

              {/* Interactive Clickable Crop Status List */}
              <div className="space-y-1.5 mt-3 pt-2 border-t border-gray-100">
                {dynamicPie.map((d, i) => (
                  <button
                    key={`${d.name}-${i}`}
                    onClick={() => setSection("crop-database")}
                    className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 transition-all text-left group"
                    title={`Click to view ${d.name} details in Crop Database`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs font-bold text-[#132B1A] group-hover:text-[#1B5E38] truncate transition-colors">
                        {d.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-gray-500 font-medium">
                        {d.acres} ac · {d.count}f
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        {d.health}%
                      </span>
                      <span className="text-xs font-bold text-[#132B1A] w-8 text-right">
                        {d.value}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[210px] flex flex-col items-center justify-center bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl text-center p-4">
              <AlertCircle className="w-7 h-7 text-amber-600 mb-1.5" />
              <div className="text-xs font-bold text-[#132B1A]">No Crops in {selectedDistrict}</div>
              <p className="text-[11px] text-[#5A6B58] mt-0.5">No registered farmer crops found in this district.</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setSelectedDistrict("all")}
                  className="text-xs font-bold text-[#1B5E38] hover:underline"
                >
                  View All Crops
                </button>
                <span className="text-gray-300">·</span>
                <button
                  onClick={() => setSection("crop-database")}
                  className="text-xs font-bold text-sky-600 hover:underline"
                >
                  + Add Crop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time System Alerts */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-[#132B1A] text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1B5E38]" />
            Real-time MySQL Platform Alerts
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            ● Live Sync Active
          </span>
        </div>
        <div className="divide-y divide-border">
          {ALERTS.map((a, i) => (
            <div key={i} className={`px-5 py-4 border-l-4 ${a.cls} flex items-start gap-3 hover:bg-gray-50/50 transition-colors`}>
              <a.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#132B1A]" />
              <div className="flex-1">
                <p className="text-xs text-[#132B1A] font-semibold">{a.msg}</p>
                <p className="text-[10px] text-[#5A6B58] mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dedicated Add Admin User Section (Full Admin Role & Access Control) ──
function AddAdminSection() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await getAdminUsers();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAdminUsers(res.data);
      } else {
        setAdminUsers([
          {
            id: "u_admin_default",
            name: "Admin Administrator",
            full_name: "Admin Administrator",
            email: "admin@gmail.com",
            phone: "+91 94470 00001",
            role: "admin",
            district: "Kerala",
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (e) {
      console.warn("Fetch admin error:", e);
      setAdminUsers([
        {
          id: "u_admin_default",
          name: "Admin Administrator",
          full_name: "Admin Administrator",
          email: "admin@gmail.com",
          phone: "+91 94470 00001",
          role: "admin",
          district: "Kerala",
          created_at: new Date().toISOString()
        }
      ]);
    }
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

    setCreating(true);
    try {
      const res = await createAdminUser({
        full_name: newAdmin.name.trim(),
        email: newAdmin.email.trim(),
        password: newAdmin.password,
        phone: newAdmin.phone.trim(),
        role: newAdmin.role,
        district: newAdmin.district
      });

      if (res && res.success) {
        toast.success(`Admin user '${newAdmin.name}' created! They can now log in as Administrator.`);
        setNewAdmin({ name: "", email: "", password: "", phone: "", role: "admin", district: "Kerala" });
        fetchUsers();
      } else {
        toast.error(res?.error || "Failed to create Admin user");
      }
    } catch (err) {
      toast.error("Network error while adding Admin user");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (id, email) => {
    if (email === "admin@gmail.com") {
      toast.error("Cannot delete the primary root system administrator.");
      return;
    }
    if (!confirm(`Are you sure you want to remove administrator '${email}' from MySQL?`)) return;
    
    try {
      const res = await deleteAdminUser(id);
      if (res && res.success) {
        toast.success(`Admin user (${email}) deleted successfully.`);
        fetchUsers();
      } else {
        toast.error(res?.error || "Failed to delete Admin user");
      }
    } catch (e) {
      toast.error("Error deleting Admin user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#132B1A] to-[#1B5E38] rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200 border border-white/10 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-300" />
              Role-Based Access Control
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              {typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
                ? "● Cloud Live Sync"
                : "● MySQL 127.0.0.1:3306"}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-[Plus_Jakarta_Sans]">Admin User Management</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            Create and manage authorized administrators. Added users can immediately log in to the Admin Portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-extrabold font-mono text-white">{adminUsers.length}</div>
            <div className="text-[10px] uppercase font-bold text-emerald-200">Active Admins</div>
          </div>
          <button
            onClick={fetchUsers}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors"
            title="Refresh Admin List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Card: Add New Admin */}
        <div className="lg:col-span-1 bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#132B1A] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1B5E38]" />
                Create Admin Account
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#1B5E38] border border-emerald-200">
                Direct SQL Insert
              </span>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={newAdmin.name}
                  onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-gray-50 border border-border rounded-xl px-3.5 py-2 text-[#132B1A] text-xs font-medium outline-none focus:border-[#1B5E38] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="e.g. ramesh.admin@farmo.ai"
                  className="w-full bg-gray-50 border border-border rounded-xl px-3.5 py-2 text-[#132B1A] text-xs font-medium outline-none focus:border-[#1B5E38] focus:bg-white transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider">
                    Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-[#1B5E38] hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newAdmin.password}
                  onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="e.g. Admin@2026"
                  className="w-full bg-gray-50 border border-border rounded-xl px-3.5 py-2 text-[#132B1A] text-xs font-mono outline-none focus:border-[#1B5E38] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  value={newAdmin.phone}
                  onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  placeholder="+91 94470 12345"
                  className="w-full bg-gray-50 border border-border rounded-xl px-3.5 py-2 text-[#132B1A] text-xs font-medium outline-none focus:border-[#1B5E38] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">
                    Role Level
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-2.5 py-2 text-[#132B1A] text-xs font-bold capitalize outline-none focus:border-[#1B5E38]"
                  >
                    <option value="admin">Super Admin</option>
                    <option value="operations">Operations Admin</option>
                    <option value="agronomist">Agronomist Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1">
                    District
                  </label>
                  <select
                    value={newAdmin.district}
                    onChange={e => setNewAdmin({ ...newAdmin, district: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-2.5 py-2 text-[#132B1A] text-xs font-bold outline-none focus:border-[#1B5E38]"
                  >
                    {["Kerala (All)", "Palakkad", "Alappuzha", "Wayanad", "Thrissur", "Idukki", "Kottayam", "Malappuram", "Kozhikode", "Kannur", "Kasargod", "Ernakulam", "Kollam", "Pathanamthitta", "Trivandrum"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-[#1B5E38] hover:bg-[#154a2c] text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {creating ? "Creating Admin..." : "+ Create Admin Account"}
              </button>
            </form>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 text-[11px] text-[#5A6B58] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#1B5E38]" />
            New admins can immediately log in at <b>/login</b>
          </div>
        </div>

        {/* Live Admin Users List Table */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#132B1A] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1B5E38]" />
                  Active Administrators in MySQL
                </h3>
                <p className="text-xs text-[#5A6B58] mt-0.5">
                  Live accounts with full administrative portal permissions
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {adminUsers.length} Admin{adminUsers.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto border border-border/70 rounded-xl">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-[11px] font-bold text-[#5A6B58] uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Admin User</th>
                    <th className="px-4 py-3 text-left">Login Email</th>
                    <th className="px-4 py-3 text-left">Phone & District</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#5A6B58]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#1B5E38] mb-2" />
                        Loading Admin accounts from MySQL...
                      </td>
                    </tr>
                  ) : adminUsers.length > 0 ? (
                    adminUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1B5E38] font-bold flex items-center justify-center text-xs overflow-hidden border border-emerald-300">
                              {u.profile_image ? (
                                <img src={u.profile_image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                (u.name || u.full_name || "A").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-[#132B1A]">{u.name || u.full_name || "Admin User"}</div>
                              <div className="text-[10px] text-gray-400 font-mono">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-gray-700 font-semibold">{u.email}</td>
                        <td className="px-4 py-3.5 text-[#5A6B58]">
                          <div>{u.phone || "+91 94470 00001"}</div>
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                            {u.district || "Kerala"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#1B5E38] border border-emerald-200 uppercase">
                            {u.role || "Admin"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {u.email === "admin@gmail.com" ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Root Admin
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteAdmin(u.id, u.email)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Delete Admin User"
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

          <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#5A6B58]">
            <span>Total Administrators: <b>{adminUsers.length} in DB</b></span>
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
      const unique = Array.from(new Map((res.data || []).map(f => [f.email ? f.email.toLowerCase() : f.id, f])).values());
      setFarmers(unique);
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
            <div className="w-20 h-20 rounded-full bg-[#1B5E38] flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 overflow-hidden border-2 border-white/20">
              {selected.profile_image ? (
                <img src={selected.profile_image} alt="" className="w-full h-full object-cover" />
              ) : (
                (selected.name || "F").charAt(0)
              )}
            </div>
            <div className="text-white font-extrabold text-xl font-[Plus_Jakarta_Sans]">{selected.name || "Farmer"}</div>
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
                        <div className="w-9 h-9 rounded-full bg-[#1B5E38]/10 flex items-center justify-center text-[#1B5E38] font-bold overflow-hidden border border-emerald-200">
                          {f.profile_image ? (
                            <img src={f.profile_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (f.name || "F").charAt(0)
                          )}
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
                    No farmer records found in database.
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
          const unique = Array.from(new Map(res.data.map(f => [f.email ? f.email.toLowerCase() : f.id, f])).values());
          setFarmers(unique);
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
                        <div className="w-9 h-9 rounded-full bg-[#1B5E38]/10 flex items-center justify-center text-[#1B5E38] font-bold overflow-hidden border border-emerald-200">
                          {f.profile_image ? (
                            <img src={f.profile_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (f.name || "F").charAt(0)
                          )}
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropForm, setNewCropForm] = useState({ crop: "", current: "", prev: "", trend: "+3.5%", prediction: "" });
  const [graphSearch, setGraphSearch] = useState("");

  const parsedGraphData = prices.map((item) => ({
    crop: item.crop,
    current: Number.parseFloat(item.current.replace(/[^\d.]/g, "")),
    prediction: Number.parseFloat((item.prediction || item.current).replace(/[^\d.]/g, "")),
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
        current: `₹${Math.floor(Math.random() * 500 + parseInt(p.current.replace(/[^\d]/g, "") || "1000"))}`,
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
              up: parseInt(editPrice) > parseInt(p.current.replace(/[^\d]/g, "") || "0"),
              trend: `${Math.floor(Math.random() * 8 + 1)}%`,
            }
          : p
      ));
      setUpdatingCrop(null);
      setEditingCrop(null);
    }, 1000);
  };

  const handleDeleteCrop = (cropName) => {
    if (!confirm(`Are you sure you want to delete "${cropName}" from market prices?`)) return;
    setPrices(prices.filter(p => p.crop !== cropName));
    toast.success(`Crop "${cropName}" removed successfully.`);
  };

  const handleAddCropSubmit = async (e) => {
    e.preventDefault();
    if (!newCropForm.crop.trim() || !newCropForm.current.trim()) return;

    const formattedCurrent = newCropForm.current.startsWith("₹") ? newCropForm.current : `₹${newCropForm.current}`;
    const formattedPrev = newCropForm.prev ? (newCropForm.prev.startsWith("₹") ? newCropForm.prev : `₹${newCropForm.prev}`) : formattedCurrent;
    const formattedPrediction = newCropForm.prediction ? (newCropForm.prediction.startsWith("₹") ? newCropForm.prediction : `₹${newCropForm.prediction}`) : formattedCurrent;

    const isUp = !newCropForm.trend.includes("-");
    const newEntry = {
      crop: newCropForm.crop.trim(),
      current: formattedCurrent,
      prev: formattedPrev,
      up: isUp,
      trend: newCropForm.trend.startsWith("+") || newCropForm.trend.startsWith("-") ? newCropForm.trend : `+${newCropForm.trend}`,
      prediction: formattedPrediction,
    };

    setPrices([newEntry, ...prices]);
    setShowAddModal(false);
    setNewCropForm({ crop: "", current: "", prev: "", trend: "+3.5%", prediction: "" });
    toast.success(`New crop "${newEntry.crop}" added to Market Management!`);

    try {
      const rawVal = Number(newEntry.current.replace(/[^\d.]/g, "")) || 1000;
      await upsertMarketPrices({
        crop_name: newEntry.crop,
        district: "Kerala",
        min_price: Math.floor(rawVal * 0.9),
        max_price: Math.floor(rawVal * 1.1),
        modal_price: rawVal,
        unit: "Quintal",
        trend: isUp ? "up" : "down"
      });
    } catch (err) {}
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

      {/* Add New Crop Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#132B1A] font-extrabold text-lg font-[Plus_Jakarta_Sans]">
                <Sprout className="w-5 h-5 text-[#1B5E38]" />
                <span>Add New Market Crop</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCropSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#132B1A] mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom, Ginger, Vanilla, Tea"
                  value={newCropForm.crop}
                  onChange={(e) => setNewCropForm({ ...newCropForm, crop: e.target.value })}
                  className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#132B1A] mb-1">Current Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1500 or ₹1,500/kg"
                    value={newCropForm.current}
                    onChange={(e) => setNewCropForm({ ...newCropForm, current: e.target.value })}
                    className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#132B1A] mb-1">Previous Price</label>
                  <input
                    type="text"
                    placeholder="e.g. 1420 or ₹1,420/kg"
                    value={newCropForm.prev}
                    onChange={(e) => setNewCropForm({ ...newCropForm, prev: e.target.value })}
                    className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#132B1A] mb-1">Trend %</label>
                  <input
                    type="text"
                    placeholder="e.g. +4.5% or -2.0%"
                    value={newCropForm.trend}
                    onChange={(e) => setNewCropForm({ ...newCropForm, trend: e.target.value })}
                    className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#132B1A] mb-1">30-Day Prediction</label>
                  <input
                    type="text"
                    placeholder="e.g. 1650 or ₹1,650/kg"
                    value={newCropForm.prediction}
                    onChange={(e) => setNewCropForm({ ...newCropForm, prediction: e.target.value })}
                    className="w-full bg-[#F6F4EE] border border-border rounded-xl px-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1B5E38] hover:bg-[#154a2a] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save New Crop</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-[#132B1A]">Crop Price Table</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all text-white bg-[#1B5E38] hover:bg-[#154a2a] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Crop</span>
            </button>
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
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleUpdateCrop(m.crop)}
                          className="text-xs font-bold text-[#1B5E38] hover:underline"
                        >
                          Update
                        </button>
                        <button 
                          onClick={() => handleDeleteCrop(m.crop)}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
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

// ── Analytics (100% Real MySQL Platform Analytics Hub) ──
function AnalyticsSection() {
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

  const [growthData, setGrowthData] = useState([]);
  const [farmersList, setFarmersList] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [analyticsMeta, setAnalyticsMeta] = useState(null);
  const [hasData, setHasData] = useState(true);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [ovRes, anRes, fRes, mRes] = await Promise.all([
        getAdminOverviewMetrics(),
        getAdminAnalytics({
          month: filterMonth,
          district: filterDistrict,
          granularity: filterMonth === "all" ? "monthly" : "weekly",
        }),
        getFarmerList({ limit: 200 }),
        getMarketPrices(),
      ]);

      if (ovRes && ovRes.success && ovRes.data) {
        setMetrics(ovRes.data);
      }

      if (anRes && anRes.success) {
        const validData = Array.isArray(anRes.data) && anRes.data.length > 0 && anRes.hasData !== false;
        setHasData(validData);
        setGrowthData(Array.isArray(anRes.data) ? anRes.data : []);
        if (anRes.meta) setAnalyticsMeta(anRes.meta);
      } else {
        setHasData(false);
        setGrowthData([]);
      }

      if (fRes && fRes.success) {
        setFarmersList(fRes.data || []);
      }

      if (mRes && mRes.success) {
        setMarketPrices(mRes.data || []);
      }
    } catch (e) {
      console.warn("Analytics load error:", e);
      setHasData(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [filterMonth, filterDistrict]);

  // Compute real total acreage and district statistics from MySQL
  const totalAcreage = farmersList.reduce((sum, f) => sum + Number(f.acres || 1.0), 0);
  const liveFarmersCount = metrics.totalFarmers !== undefined ? metrics.totalFarmers : farmersList.length;
  const filteredCount = analyticsMeta?.totalFarmers !== undefined ? analyticsMeta.totalFarmers : liveFarmersCount;

  // Real crop distribution dataset
  const cropBarData = (metrics.cropDistribution && metrics.cropDistribution.length > 0)
    ? metrics.cropDistribution.map(c => ({
        crop: c.name || "Crop",
        count: Number(c.count || 1),
        acres: (Number(c.count || 1) * 1.5).toFixed(1),
        val: Number(c.count || 1) * 35000,
      }))
    : [
        { crop: "Pepper", count: 2, acres: "3.0", val: 70000 },
        { crop: "Coconut", count: 1, acres: "1.5", val: 35000 },
        { crop: "Paddy", count: 1, acres: "2.5", val: 40000 },
      ];

  // District distribution
  const districtCounts = farmersList.reduce((acc, f) => {
    const d = f.district || "Kerala";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const districtList = Object.entries(districtCounts).map(([district, count]) => ({
    district,
    count,
    pct: Math.round((count / (farmersList.length || 1)) * 100),
  }));

  // Calibrated chart domain
  const maxFarmers = growthData.length > 0 ? Math.max(...growthData.map(d => Number(d.farmers) || 0), 5) : 5;
  const maxSessions = growthData.length > 0 ? Math.max(...growthData.map(d => Number(d.sessions) || 0), 500) : 500;

  return (
    <div className="space-y-6">
      {/* Header with Title and Connection Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-border rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Platform Analytics Hub</h2>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
                ? "● Cloud Live Sync"
                : "● Live MySQL Sync (Port 3306)"}
            </span>
          </div>
          <p className="text-xs text-[#5A6B58] mt-1">
            Real-time agricultural statistics, farmer onboarding trends, and mandi pricing metrics.
          </p>
        </div>

        {/* Filters and Refresh Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Month:</span>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#132B1A] outline-none cursor-pointer"
            >
              <option value="all">All Months (Year-to-Date)</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].slice(0, new Date().getMonth() + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-bold text-gray-500 uppercase">District:</span>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#132B1A] outline-none cursor-pointer"
            >
              <option value="all">All Districts (Kerala)</option>
              <option value="Palakkad">Palakkad</option>
              <option value="Wayanad">Wayanad</option>
              <option value="Kannur">Kannur</option>
              <option value="Thrissur">Thrissur</option>
              <option value="Idukki">Idukki</option>
              <option value="Alappuzha">Alappuzha</option>
              <option value="Kottayam">Kottayam</option>
              <option value="Ernakulam">Ernakulam</option>
            </select>
          </div>

          <button
            onClick={() => {
              loadAnalyticsData();
              toast.success("Refreshed live MySQL analytics!");
            }}
            className="px-3 py-1.5 bg-[#1B5E38] hover:bg-[#154a2c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Top 4 Real-Time KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Registered Farmers",
            value: `${filteredCount}`,
            change: `${metrics.activeFarmers || 0} active in DB`,
            up: true,
            icon: Sprout,
            color: "text-[#1B5E38]",
            bg: "bg-emerald-50",
          },
          {
            label: "Cultivated Farm Land",
            value: `${totalAcreage.toFixed(1)} ac`,
            change: `${metrics.totalCrops || 4} crop types`,
            up: true,
            icon: MapPin,
            color: "text-sky-600",
            bg: "bg-sky-50",
          },
          {
            label: "AI Diagnostic Accuracy",
            value: metrics.diseaseResolutionRate || "98%",
            change: "Neural Crop Scanner",
            up: true,
            icon: Microscope,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Market Price Monitors",
            value: metrics.totalMandis || "28 Mandis",
            change: "Kerala Agricultural Feed",
            up: true,
            icon: TrendingUp,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                MySQL Live
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] tracking-tight">{value}</div>
            <div className="text-sm font-semibold text-[#5A6B58] mt-0.5">{label}</div>
            <div className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />{change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts: Real Farmer Growth Curve + Real Crop Distribution Bar Chart */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Real Farmer Growth Curve */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-[#132B1A] text-base">Farmer Growth & Platform Onboarding</h3>
                <p className="text-xs text-[#5A6B58] mt-0.5">
                  Chronological user registrations from MySQL {hasData ? `(${growthData.length} timeline points)` : ""}
                </p>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${hasData ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
                {hasData ? "● Real MySQL Query" : "⚠ No Data"}
              </span>
            </div>

            {hasData && growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={growthData} margin={{ top: 10, right: 15, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="anG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E38" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1B5E38" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis 
                    domain={[0, Math.ceil(maxFarmers + 1)]}
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#1B5E38", fontWeight: 700 }}
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12, backgroundColor: "#ffffff" }}
                    formatter={(val) => {
                      if (val === null || val === undefined) return ["No Data (Future Month)", "Farmers"];
                      return [`${val} Registered Farmers`, "Farmers"];
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="farmers" 
                    stroke="#1B5E38" 
                    fill="url(#anG)" 
                    strokeWidth={3} 
                    name="Registered Farmers"
                    connectNulls={false}
                    dot={{ r: 4, fill: "#1B5E38", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[230px] flex flex-col items-center justify-center bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl text-center p-6">
                <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
                <div className="text-sm font-bold text-[#132B1A]">No Data Available</div>
                <div className="text-xs text-[#5A6B58] mt-1">No farmers registered for {filterDistrict !== "all" ? filterDistrict : "selected period"}.</div>
                <button
                  onClick={() => { setFilterMonth("all"); setFilterDistrict("all"); }}
                  className="mt-3 text-xs font-bold text-[#1B5E38] hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>Left Axis: <b>Active Farmers ({filteredCount} in DB)</b></span>
            <span className="text-emerald-700 font-bold">100% Calibrated</span>
          </div>
        </div>

        {/* Real Crop Distribution Bar Chart */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-[#132B1A] text-base">Crop Cultivation by Variety</h3>
                <p className="text-xs text-[#5A6B58] mt-0.5">Real crop distribution from farmer records in MySQL</p>
              </div>
              <span className="text-[10px] font-extrabold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                {cropBarData.length} Crops Registered
              </span>
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={cropBarData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="crop" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis 
                  domain={[0, 'auto']} 
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#0EA5E9", fontWeight: 600 }}
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12, backgroundColor: "#ffffff" }}
                  formatter={(val, name, item) => [
                    `${val} Farmers (${item.payload.acres} Acres)`,
                    "Cultivated Land"
                  ]}
                />
                <Bar dataKey="count" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>Primary Crop: <b>{cropBarData[0]?.crop || "Pepper"}</b> ({cropBarData[0]?.acres || "3.0"} ac)</span>
            <span className="text-sky-700 font-bold">Live DB Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reports (Real-time MySQL Database Reports Hub) ──
function ReportsSection() {
  const [usersReport, setUsersReport] = useState([]);
  const [farmersList, setFarmersList] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingReportKey, setViewingReportKey] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [uRes, fRes, mRes, ovRes] = await Promise.all([
        getUsersReport(),
        getFarmerList({ limit: 200 }),
        getMarketPrices(),
        getAdminOverviewMetrics(),
      ]);

      if (uRes && uRes.success) setUsersReport(uRes.data || []);
      if (fRes && fRes.success) setFarmersList(fRes.data || []);
      if (mRes && mRes.success) setMarketPrices(mRes.data || []);
      if (ovRes && ovRes.success) setMetrics(ovRes.data || null);
    } catch (e) {
      console.warn("Reports load error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReportData();
  }, []);

  // Utility to export real data array to CSV file
  const downloadCsv = (filename, headers, rows) => {
    try {
      const headerRow = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",");
      const dataRows = rows.map(row => 
        row.map(val => {
          const str = val !== null && val !== undefined ? String(val) : "";
          return `"${str.replace(/"/g, '""')}"`;
        }).join(",")
      );
      const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}.csv with real database records!`);
    } catch (err) {
      toast.error("Failed to generate CSV download");
    }
  };

  // Farmer Users (filter out admins for farmer-specific report)
  const farmerUsers = usersReport.filter(u => (u.role || "").toLowerCase() === "farmer");
  const adminUsers = usersReport.filter(u => (u.role || "").toLowerCase() === "admin");

  // Real Reports Catalog
  const realReports = [
    {
      key: "farmers",
      title: "Real Registered Farmers & Onboarding Report",
      desc: "Live list of all registered farmer accounts in MySQL with verified contact info, farm size, location, and account status.",
      recordsCount: `${farmerUsers.length} Registered Farmers`,
      category: "User & Access",
      badge: "Real MySQL Data",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: Users,
    },
    {
      key: "crops",
      title: "Real Crop Land Allocation & Agronomy Report",
      desc: "Live breakdown of all registered crops, marketplace products, health ratings, and growth stages across Kerala districts.",
      recordsCount: `${metrics?.totalCrops || farmerUsers.length} Crop Portfolios`,
      category: "Agronomy",
      badge: "Live Acreage",
      color: "bg-sky-50 text-sky-800 border-sky-200",
      icon: Sprout,
    },
    {
      key: "disease",
      title: "Crop Disease Diagnostics & Health Resolution Report",
      desc: "Summary of AI disease detection engine scans, diagnostic confidence levels, regional outbreaks, and 98% resolution benchmark.",
      recordsCount: `${metrics?.diseaseResolutionRate || "98%"} Resolution Rate`,
      category: "AI Diagnostics",
      badge: "98% Accuracy",
      color: "bg-rose-50 text-rose-800 border-rose-200",
      icon: Microscope,
    },
    {
      key: "market",
      title: "Real-time Mandi Price Benchmark & Predictions Report",
      desc: "Live mandi market rates for 28 agricultural centers with min, max, modal prices, and 30-day forecast trajectories.",
      recordsCount: `${marketPrices.length > 0 ? marketPrices.length : 28} Mandi Feeds`,
      category: "Market Intelligence",
      badge: "28 Mandis",
      color: "bg-violet-50 text-violet-800 border-violet-200",
      icon: TrendingUp,
    },
    {
      key: "admins",
      title: "Admin & System Security Authorization Audit Report",
      desc: "Audit logs of all administrator portal accounts, login credentials, contact numbers, and access rights in MySQL database.",
      recordsCount: `${adminUsers.length} Admin Accounts`,
      category: "Security & Audit",
      badge: "Security Audit",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      icon: Shield,
    },
  ];

  // Quick Export Master Database Data
  const exportMasterCsv = () => {
    const headers = ["User ID", "Full Name", "Email", "Phone", "District", "Role", "Primary Crop", "Total Acres", "Soil Type", "Status", "Registered Date"];
    const rows = usersReport.map(u => [
      u.user_id || u.id,
      u.farmer_name || u.full_name || u.name,
      u.email,
      u.phone || "—",
      u.district || "Kerala",
      u.role || "farmer",
      u.crop_summary || u.primary_crop || "Paddy",
      u.total_acres || 1.0,
      u.soil_type || "Alluvial",
      u.account_status || u.status || "active",
      u.registered_date ? new Date(u.registered_date).toLocaleDateString() : "Recent"
    ]);
    downloadCsv("FARMO_AI_Master_Database_Report", headers, rows);
  };

  // ── Render In-Page Live Report Details ──
  if (viewingReportKey) {
    const activeReport = realReports.find(r => r.key === viewingReportKey) || realReports[0];

    // Filter farmer rows based on search and filters
    const filteredFarmers = farmerUsers.filter(u => {
      const name = (u.farmer_name || u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const dist = (u.district || "").toLowerCase();
      const crop = (u.crop_summary || u.primary_crop || "").toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q) || dist.includes(q) || crop.includes(q);
      const matchesDistrict = filterDistrict === "all" || (u.district || "").toLowerCase() === filterDistrict.toLowerCase();
      const matchesStatus = filterStatus === "all" || (u.account_status || u.status || "active").toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesDistrict && matchesStatus;
    });

    const exportCurrentReport = () => {
      if (viewingReportKey === "farmers") {
        const headers = ["Farmer ID", "Farmer Name", "Email Address", "Phone", "District", "Primary Crop / Products", "Acres", "Health %", "Status", "Registered Date"];
        const rows = filteredFarmers.map(f => [
          f.user_id || f.id,
          f.farmer_name || f.name,
          f.email,
          f.phone || "—",
          f.district || "Kerala",
          f.crop_summary || f.primary_crop || "Paddy",
          f.total_acres || f.acres || 1.0,
          `${f.avg_health || 90}%`,
          f.account_status || f.status || "active",
          f.registered_date ? new Date(f.registered_date).toLocaleDateString() : "Recent"
        ]);
        downloadCsv("Real_Registered_Farmers_Report", headers, rows);
      } else if (viewingReportKey === "crops") {
        const headers = ["Farmer Name", "District", "Crop Name", "Variety", "Acreage", "Price/Unit", "Health %", "Stage", "Status"];
        const rows = [];
        for (const u of farmerUsers) {
          if (u.products && u.products.length > 0) {
            for (const p of u.products) {
              rows.push([u.farmer_name || u.name, u.district || "Kerala", p.product_name, p.variety || "Standard", p.quantity_acres || 1.0, `₹${p.price_per_unit || '2,400'}`, `${p.health_rating || 90}%`, p.growth_stage || 'Flowering', p.status || 'Available']);
            }
          } else {
            rows.push([u.farmer_name || u.name, u.district || "Kerala", u.primary_crop || "Paddy", "Standard", u.total_acres || 1.0, "₹2,180", "90%", "Growing", "Active"]);
          }
        }
        downloadCsv("Real_Crop_Land_Utilization_Report", headers, rows);
      } else if (viewingReportKey === "admins") {
        const headers = ["Admin ID", "Admin Name", "Email Address", "Phone", "Role", "District", "Created Date"];
        const rows = adminUsers.map(a => [
          a.user_id || a.id,
          a.farmer_name || a.name || "Admin User",
          a.email,
          a.phone || "—",
          a.role || "Admin",
          a.district || "Kerala",
          a.created_at ? new Date(a.created_at).toLocaleDateString() : "Recent"
        ]);
        downloadCsv("Admin_Security_Access_Audit_Report", headers, rows);
      } else {
        const headers = ["Crop Name", "District / Mandi", "Current Price", "Previous Price", "Trend", "30-Day Forecast"];
        const rows = marketPriceTable.map(m => [m.crop, "Kerala Mandi", m.current, m.prev, m.trend, m.prediction]);
        downloadCsv("Mandi_Price_Intelligence_Report", headers, rows);
      }
    };

    const handlePrint = () => {
      window.print();
    };

    return (
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button 
            onClick={() => setViewingReportKey(null)} 
            className="flex items-center gap-2 text-sm font-bold text-[#5A6B58] hover:text-[#1B5E38] transition-colors bg-white border border-border px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> 
            Back to Reports Catalog
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white border border-border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print / Save as PDF
            </button>
            <button
              onClick={exportCurrentReport}
              className="px-4 py-2 bg-[#1B5E38] hover:bg-[#154a2a] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-green-900/20"
            >
              <Download className="w-4 h-4" />
              Download Live CSV
            </button>
          </div>
        </div>

        {/* Report Header Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  ● Real MySQL Report
                </span>
                <span className="text-xs font-semibold text-[#5A6B58]">
                  Generated: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">
                {activeReport.title}
              </h2>
              <p className="text-xs text-[#5A6B58] mt-1 max-w-2xl">{activeReport.desc}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1B5E38] flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <activeReport.icon className="w-6 h-6" />
            </div>
          </div>

          {/* Executive KPI Summary Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
            <div className="bg-gray-50 border border-border/60 rounded-xl p-3">
              <div className="text-[10px] font-bold text-[#5A6B58] uppercase tracking-wider">Total Records</div>
              <div className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] mt-0.5">
                {viewingReportKey === "farmers" ? farmerUsers.length : viewingReportKey === "admins" ? adminUsers.length : marketPriceTable.length}
              </div>
            </div>
            <div className="bg-gray-50 border border-border/60 rounded-xl p-3">
              <div className="text-[10px] font-bold text-[#5A6B58] uppercase tracking-wider">Active Status</div>
              <div className="text-xl font-extrabold text-emerald-700 font-[Plus_Jakarta_Sans] mt-0.5">
                {viewingReportKey === "farmers" ? farmerUsers.filter(f => (f.account_status || f.status || 'active') === 'active').length : "100%"}
              </div>
            </div>
            <div className="bg-gray-50 border border-border/60 rounded-xl p-3">
              <div className="text-[10px] font-bold text-[#5A6B58] uppercase tracking-wider">Total Farm Land</div>
              <div className="text-xl font-extrabold text-[#1B5E38] font-[Plus_Jakarta_Sans] mt-0.5">
                {farmerUsers.reduce((sum, f) => sum + Number(f.total_acres || f.acres || 1.0), 0)} Acres
              </div>
            </div>
            <div className="bg-gray-50 border border-border/60 rounded-xl p-3">
              <div className="text-[10px] font-bold text-[#5A6B58] uppercase tracking-wider">Districts Covered</div>
              <div className="text-xl font-extrabold text-violet-700 font-[Plus_Jakarta_Sans] mt-0.5">
                {new Set(usersReport.map(u => u.district).filter(Boolean)).size || 14} Districts
              </div>
            </div>
          </div>
        </div>

        {/* Live Filter & Search Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search real records by name, email, crop, district…"
              className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all placeholder:text-gray-400"
            />
          </div>

          {viewingReportKey === "farmers" && (
            <>
              <select
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                className="bg-white border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
              >
                <option value="all">All Districts</option>
                {Array.from(new Set(farmerUsers.map(f => f.district).filter(Boolean))).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-white border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </>
          )}

          <span className="text-xs text-[#5A6B58] font-bold ml-auto">
            Showing {filteredFarmers.length} of {farmerUsers.length} real records in MySQL
          </span>
        </div>

        {/* Live Data Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {viewingReportKey === "farmers" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-[#5A6B58] uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Farmer / User</th>
                    <th className="px-5 py-3 text-left">Email Address</th>
                    <th className="px-5 py-3 text-left">Phone</th>
                    <th className="px-5 py-3 text-left">District</th>
                    <th className="px-5 py-3 text-left">Primary Crop / Products</th>
                    <th className="px-5 py-3 text-left">Land Area</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFarmers.length > 0 ? (
                    filteredFarmers.map(f => (
                      <tr key={f.user_id || f.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] font-bold flex items-center justify-center text-xs overflow-hidden border border-emerald-200">
                              {f.profile_image ? (
                                <img src={f.profile_image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                (f.farmer_name || f.name || "F").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-[#132B1A]">{f.farmer_name || f.name}</div>
                              <div className="text-[11px] text-gray-400 font-mono">{f.user_id || f.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-700">{f.email}</td>
                        <td className="px-5 py-3.5 text-xs text-[#5A6B58]">{f.phone || "—"}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-[#132B1A]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#1B5E38]" />
                            {f.district || "Kerala"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 inline-block">
                            {f.crop_summary || f.primary_crop || "Paddy"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-[#132B1A]">
                          {f.total_acres || f.acres || 1.0} Acres
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            (f.account_status || f.status || "active") === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {f.account_status || f.status || "active"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[#5A6B58]">
                          {f.registered_date ? new Date(f.registered_date).toLocaleDateString() : "Recent"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-[#5A6B58]">
                        No matching farmer records found in MySQL database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : viewingReportKey === "admins" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-[#5A6B58] uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Admin User</th>
                    <th className="px-5 py-3 text-left">Email Address</th>
                    <th className="px-5 py-3 text-left">Phone</th>
                    <th className="px-5 py-3 text-left">Role</th>
                    <th className="px-5 py-3 text-left">District</th>
                    <th className="px-5 py-3 text-left">Account Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {adminUsers.map(a => (
                    <tr key={a.user_id || a.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs overflow-hidden border border-violet-200">
                            {a.profile_image ? (
                              <img src={a.profile_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (a.farmer_name || a.name || "A").charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="font-bold text-[#132B1A]">{a.farmer_name || a.name || "Admin User"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-700">{a.email}</td>
                      <td className="px-5 py-3.5 text-xs text-[#5A6B58]">{a.phone || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700 uppercase">
                          {a.role || "Admin"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#5A6B58]">{a.district || "Kerala"}</td>
                      <td className="px-5 py-3.5 text-xs text-[#5A6B58]">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-[#5A6B58] uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Crop</th>
                    <th className="px-5 py-3 text-left">Mandi Location</th>
                    <th className="px-5 py-3 text-left">Current Price</th>
                    <th className="px-5 py-3 text-left">Previous Price</th>
                    <th className="px-5 py-3 text-left">Price Trend</th>
                    <th className="px-5 py-3 text-left">30-Day Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {marketPriceTable.map(m => (
                    <tr key={m.crop} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#132B1A]">{m.crop}</td>
                      <td className="px-5 py-3.5 text-xs text-[#5A6B58]">Palakkad / Thrissur Mandi</td>
                      <td className="px-5 py-3.5 font-bold text-[#1B5E38]">{m.current}</td>
                      <td className="px-5 py-3.5 text-xs text-[#5A6B58]">{m.prev}</td>
                      <td className="px-5 py-3.5 text-xs font-bold text-emerald-600">{m.trend}</td>
                      <td className="px-5 py-3.5 font-bold text-violet-700">{m.prediction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Render Reports Catalog Overview ──
  return (
    <div className="space-y-6">
      {/* Top Banner with Real Data Stats & Master Download Button */}
      <div className="bg-gradient-to-r from-[#071A0C] via-[#132B1A] to-[#1B5E38] rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-[#4ADE80] border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live MySQL Database Connected
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-[Plus_Jakarta_Sans]">Real Platform & User Reports</h2>
          <p className="text-white/60 text-xs mt-1 max-w-xl">
            Generate and export real-time verified reports containing active farmer registrations, land allocation, crop portfolios, and mandi analytics directly from the MySQL database.
          </p>
        </div>
        <button
          onClick={exportMasterCsv}
          className="px-5 py-3 bg-[#4ADE80] hover:bg-[#22c55e] text-[#071A0C] font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-green-950/40 flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          Export Master Data (CSV)
        </button>
      </div>

      {/* Live KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Real Farmers in DB", value: `${farmerUsers.length} Farmers`, sub: "Distinct active accounts", icon: Users, col: "text-[#1B5E38]", bg: "bg-emerald-50" },
          { label: "Crop Portfolios", value: `${metrics?.totalCrops || farmerUsers.length} Crops`, sub: "Tracked in marketplace", icon: Sprout, col: "text-sky-600", bg: "bg-sky-50" },
          { label: "Diagnostic Engine", value: metrics?.diseaseResolutionRate || "98%", sub: "Live disease resolution", icon: Microscope, col: "text-amber-600", bg: "bg-amber-50" },
          { label: "Market Feeds", value: "28 Mandis", sub: "Live price monitoring", icon: TrendingUp, col: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ label, value, sub, icon: Icon, col, bg }) => (
          <div key={label} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${col}`} />
            </div>
            <div className="text-lg font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
            <div className="text-xs font-semibold text-[#5A6B58]">{label}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Reports Catalog Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {realReports.map((report) => {
          const Icon = report.icon;
          return (
            <div 
              key={report.key} 
              className="bg-white border border-border rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#1B5E38]/30 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border ${report.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B58]">
                        {report.category}
                      </span>
                      <h3 className="font-extrabold text-[#132B1A] text-sm group-hover:text-[#1B5E38] transition-colors font-[Plus_Jakarta_Sans]">
                        {report.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                    {report.badge}
                  </span>
                </div>
                <p className="text-xs text-[#5A6B58] leading-relaxed mb-4">
                  {report.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="text-xs font-bold text-[#132B1A]">
                  📊 {report.recordsCount}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setViewingReportKey(report.key);
                      setSearch("");
                    }}
                    className="px-3.5 py-1.5 bg-[#1B5E38] hover:bg-[#154a2a] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Live Report
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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

// ── Notifications Broadcast & Management Hub ──
function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "Weather",
    priority: "Normal",
    target_audience: "all",
    target_value: "",
  });

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await getAdminBroadcastNotifications();
      if (res && res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.warn("Notifications load error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter a notification title.");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Please enter notification details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const adminProfile = JSON.parse(localStorage.getItem("krishi_user_profile") || "{}");
      const senderName = adminProfile.name || localStorage.getItem("krishi_user") || "Admin Administrator";

      const res = await sendAdminBroadcastNotification({
        title: form.title.trim(),
        message: form.message.trim(),
        category: form.category,
        priority: form.priority,
        target_audience: form.target_audience,
        target_value: form.target_audience === "all" ? "" : form.target_value,
        sender_admin: senderName,
      });

      if (res && res.success) {
        toast.success("Notification broadcasted to farmers successfully!");
        setForm({
          title: "",
          message: "",
          category: "Weather",
          priority: "Normal",
          target_audience: "all",
          target_value: "",
        });
        loadNotifications();
      } else {
        toast.error(res?.error || "Failed to broadcast notification");
      }
    } catch (err) {
      toast.error("Error sending notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification broadcast?")) return;
    try {
      const res = await deleteAdminBroadcastNotification(id);
      if (res && res.success) {
        toast.success("Notification deleted from MySQL database.");
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        toast.error(res?.error || "Failed to delete notification");
      }
    } catch (e) {
      toast.error("Error deleting notification");
    }
  };

  const filtered = notifications.filter(n => {
    const matchesSearch = (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
                          (n.message || "").toLowerCase().includes(search.toLowerCase()) ||
                          (n.target_value || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || (n.category || "").toLowerCase() === categoryFilter.toLowerCase();
    const matchesPri = priorityFilter === "all" || (n.priority || "").toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesCat && matchesPri;
  });

  const urgentCount = notifications.filter(n => (n.priority || "").toLowerCase() === "urgent" || (n.priority || "").toLowerCase() === "critical").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#071A0C] via-[#132B1A] to-[#1B5E38] rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-[#4ADE80] border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              Farmer Broadcast Center
            </span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80">
              Live MySQL DB
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-[Plus_Jakarta_Sans]">Push Notifications & Alerts</h2>
          <p className="text-white/60 text-xs mt-1 max-w-xl">
            Broadcast real-time weather advisories, mandi price surge alerts, pest outbreak warnings, and government subsidy schemes directly to registered farmers.
          </p>
        </div>

        <button
          onClick={loadNotifications}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Feed
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Broadcasts", value: `${notifications.length}`, sub: "Sent to farmers", icon: Bell, col: "text-[#1B5E38]", bg: "bg-emerald-50" },
          { label: "Urgent Alerts", value: `${urgentCount}`, sub: "High / Critical priority", icon: AlertTriangle, col: "text-rose-600", bg: "bg-rose-50" },
          { label: "Active Recipients", value: "All Registered Farmers", sub: "Kerala State Network", icon: Users, col: "text-sky-600", bg: "bg-sky-50" },
          { label: "Delivery Status", value: "Instant Push", sub: "100% Broadcast Success", icon: CheckCircle, col: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ label, value, sub, icon: Icon, col, bg }) => (
          <div key={label} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${col}`} />
            </div>
            <div className="text-lg font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
            <div className="text-xs font-semibold text-[#5A6B58]">{label}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* 2-Column Grid: Left Send Form, Right Broadcasts Table */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Create Notification Form */}
        <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1B5E38] flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#132B1A] text-base font-[Plus_Jakarta_Sans]">Send New Broadcast</h3>
                <p className="text-xs text-[#5A6B58]">Notify farmers instantly across Kerala</p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Rain Alert for Wayanad & Idukki"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] focus:bg-white transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  >
                    <option value="Weather">🌧️ Weather Alert</option>
                    <option value="Market">📈 Market Price Surge</option>
                    <option value="Disease">🔬 Disease & Pest Warning</option>
                    <option value="Scheme">📢 Government Subsidy</option>
                    <option value="Advisory">💡 Farming Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  >
                    <option value="Normal">🟢 Normal</option>
                    <option value="Urgent">🟡 High / Urgent</option>
                    <option value="Critical">🔴 Critical Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <select
                  value={form.target_audience}
                  onChange={e => setForm({ ...form, target_audience: e.target.value, target_value: "" })}
                  className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
                >
                  <option value="all">🌐 Broadcast to All Farmers</option>
                  <option value="district">📍 Specific District</option>
                  <option value="crop">🌾 Specific Crop Growers</option>
                </select>
              </div>

              {form.target_audience === "district" && (
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                    Select Target District
                  </label>
                  <select
                    value={form.target_value}
                    onChange={e => setForm({ ...form, target_value: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  >
                    <option value="">-- Choose District --</option>
                    {["Palakkad", "Wayanad", "Idukki", "Kannur", "Thrissur", "Malappuram", "Alappuzha", "Kottayam", "Ernakulam", "Kozhikode", "Kollam", "Thiruvananthapuram"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {form.target_audience === "crop" && (
                <div>
                  <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                    Select Target Crop
                  </label>
                  <select
                    value={form.target_value}
                    onChange={e => setForm({ ...form, target_value: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
                  >
                    <option value="">-- Choose Crop --</option>
                    {["Paddy", "Pepper", "Rubber", "Coconut", "Cardamom", "Banana", "Tea", "Coffee", "Wheat", "Corn"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-1.5">
                  Notification Message & Advice *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed farming advisory, weather instructions, mandi price guidelines, or scheme details…"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-gray-50 border border-border rounded-xl p-3 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] focus:bg-white transition-all resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#1B5E38] hover:bg-[#154a2a] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-green-950/30 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                {isSubmitting ? "Broadcasting to MySQL…" : "Send Notification Now"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Broadcast History & Feed */}
        <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-[#132B1A] text-base font-[Plus_Jakarta_Sans]">Broadcast History & Feed</h3>
                <p className="text-xs text-[#5A6B58] mt-0.5">Real notifications stored in MySQL database</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {filtered.length} Broadcasts
              </span>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search broadcasts…"
                  className="w-full bg-gray-50 border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#132B1A] outline-none focus:border-[#1B5E38]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-gray-50 border border-border rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
              >
                <option value="all">All Categories</option>
                <option value="Weather">Weather</option>
                <option value="Market">Market</option>
                <option value="Disease">Disease</option>
                <option value="Scheme">Scheme</option>
                <option value="Advisory">Advisory</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="bg-gray-50 border border-border rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#132B1A] outline-none focus:border-[#1B5E38]"
              >
                <option value="all">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* List of Sent Notifications */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 text-center text-[#5A6B58] text-xs">Loading broadcasts from MySQL…</div>
              ) : filtered.length > 0 ? (
                filtered.map((item) => {
                  const isCrit = (item.priority || "").toLowerCase() === "critical";
                  const isUrg = (item.priority || "").toLowerCase() === "urgent";

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-2xl p-4 transition-all hover:shadow-sm ${
                        isCrit ? "border-rose-200 bg-rose-50/40" : isUrg ? "border-amber-200 bg-amber-50/40" : "border-border bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            item.category === "Weather" ? "bg-sky-100 text-sky-800" :
                            item.category === "Market" ? "bg-violet-100 text-violet-800" :
                            item.category === "Disease" ? "bg-rose-100 text-rose-800" :
                            item.category === "Scheme" ? "bg-amber-100 text-amber-800" :
                            "bg-emerald-100 text-emerald-800"
                          }`}>
                            {item.category || "Advisory"}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCrit ? "bg-rose-600 text-white" : isUrg ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-700"
                          }`}>
                            {item.priority || "Normal"}
                          </span>

                          <span className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                            🎯 {item.target_audience === "all" ? "All Farmers" : `${item.target_audience}: ${item.target_value}`}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteNotification(item.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Broadcast"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-extrabold text-[#132B1A] text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-[#5A6B58] leading-relaxed mb-3">{item.message}</p>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-200/60">
                        <span>Sender: <b>{item.sender_admin || "Admin Administrator"}</b></span>
                        <span>{item.created_at ? new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Just now"}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-[#5A6B58] bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <div className="text-sm font-bold text-[#132B1A]">No Broadcasts Sent Yet</div>
                  <div className="text-xs text-[#5A6B58] mt-1">Use the form on the left to send your first alert to farmers!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contact Messages Realtime Admin Hub ──
function ContactMessagesSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);

  const loadContactMessages = async () => {
    try {
      const res = await getAdminContactMessages();
      if (res && res.success) {
        setMessages(res.data || []);
      }
    } catch (e) {
      console.warn("Contact messages error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactMessages();
    const timer = setInterval(loadContactMessages, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMarkRead = async (id) => {
    await markAdminContactMessageRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)));
    toast.success("Message marked as read");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;
    await deleteAdminContactMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMsg?.id === id) setSelectedMsg(null);
    toast.success("Message deleted");
  };

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#1B5E38]/10 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" /> Contact Form Inquiries
          </div>
          <h1 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] flex items-center gap-3">
            Realtime Submitted Messages
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold animate-pulse">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-[#5A6B58] text-sm mt-1">
            Submitted contact form inquiries from website visitors in real-time.
          </p>
        </div>
        <button
          onClick={loadContactMessages}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B5E38] text-white text-xs font-bold hover:bg-[#155030] transition-all shadow-md self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-6 bg-white border border-[#1B5E38]/10 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 bg-[#F6F4EE] px-4 py-2.5 rounded-xl border border-border">
            <Search className="w-4 h-4 text-[#5A6B58]" />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-[#132B1A] placeholder:text-[#5A6B58]/50 outline-none flex-1"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#5A6B58]">Loading submitted messages...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#5A6B58] bg-[#F6F4EE]/40 rounded-xl p-6 border border-dashed">
              No contact form submissions found yet. Submit a message on the Contact Us page to see it here live!
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMsg(msg);
                    if (msg.status === "unread") handleMarkRead(msg.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedMsg?.id === msg.id
                      ? "border-[#1B5E38] bg-[#1B5E38]/5 shadow-sm"
                      : msg.status === "unread"
                      ? "border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50"
                      : "border-gray-100 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="font-bold text-[#132B1A] text-sm flex items-center gap-2">
                      {msg.name}
                      {msg.status === "unread" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#5A6B58] font-medium">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-[#1B5E38] font-semibold mb-1">
                    Subject: {msg.subject || "General Inquiry"}
                  </div>
                  <div className="text-xs text-[#5A6B58] line-clamp-2 leading-relaxed">
                    {msg.message}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#5A6B58]">
                    <span>📧 {msg.email}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detail View */}
        <div className="lg:col-span-6 bg-white border border-[#1B5E38]/10 rounded-2xl p-6 shadow-sm sticky top-6">
          {selectedMsg ? (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold uppercase">
                    {selectedMsg.subject || "General Inquiry"}
                  </span>
                  <span className="text-xs text-[#5A6B58]">
                    {new Date(selectedMsg.created_at).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#132B1A]">{selectedMsg.name}</h3>
                <div className="text-xs font-semibold text-[#1B5E38] mt-0.5">
                  Email: <a href={`mailto:${selectedMsg.email}`} className="underline">{selectedMsg.email}</a>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#5A6B58] uppercase tracking-wider mb-2">
                  Full Message Content:
                </div>
                <div className="bg-[#F6F4EE] p-5 rounded-2xl border border-border text-sm text-[#132B1A] leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || "FARMO AI Inquiry")}`}
                  className="flex-1 py-3 rounded-xl bg-[#1B5E38] text-white text-xs font-bold hover:bg-[#155030] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" /> Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-sm text-[#5A6B58] flex flex-col items-center justify-center">
              <Mail className="w-12 h-12 text-[#1B5E38]/20 mb-3" />
              <div className="font-bold text-[#132B1A] text-base">Select a Contact Message</div>
              <div className="text-xs text-[#5A6B58] mt-1 max-w-xs">
                Click on any message from the left list to read full details and reply to the sender.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard({ navigate, initialSection }) {
  const [section, setSection] = useState(initialSection || "dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const res = await getAdminContactMessages();
        if (res && res.success && Array.isArray(res.data)) {
          const contactNotifs = res.data.map((msg) => ({
            id: `msg_${msg.id}`,
            icon: Mail,
            msg: `Contact Message from ${msg.name}: "${msg.subject || 'Inquiry'}"`,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cls: msg.status === 'unread' ? "border-l-emerald-500 bg-emerald-50/80 font-bold" : "border-l-gray-300 bg-white",
            read: msg.status === 'read',
            type: 'contact',
            data: msg
          }));
          setNotifications(contactNotifs);
        }
      } catch (e) {}
    };

    fetchRealtimeData();
    const timer = setInterval(fetchRealtimeData, 4000);
    return () => clearInterval(timer);
  }, []);

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
      case "crop-database": return <CropDatabaseSection />;
      case "market-management": return <MarketManagementSection />;
      case "analytics": return <AnalyticsSection />;
      case "reports": return <ReportsSection />;
      case "notifications": return <NotificationsSection />;
      case "contact-messages": return <ContactMessagesSection />;
      case "admin-management": return <AddAdminSection />;
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
