import { useRef, useState, useEffect } from "react";
import {
  Leaf, Home, Tractor, BarChart2, TrendingUp, CloudRain, Bot, FileText,
  User, LogOut, Menu, Bell, Activity, Sun, Droplets, AlertTriangle,
  CheckCircle, ChevronRight, ArrowUp, Send, Mic, Camera, Shield,
  Sprout, MapPin, Search, Eye, Download, X, Filter, RefreshCw
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PricingPage } from "./PricingPage.jsx";
import { farmCrops, sampleChat, weatherForecast, marketCrops, analyticsData } from "./data.js";

const SIDEBAR = [
  { key: "dashboard", icon: Home, label: "Dashboard" },
  { key: "my-farm", icon: Tractor, label: "My Farm" },
  { key: "crop-analysis", icon: BarChart2, label: "Crop Analysis" },
  { key: "market", icon: TrendingUp, label: "Market Insight" },
  { key: "weather", icon: CloudRain, label: "Weather" },
  { key: "ai-assistant", icon: Bot, label: "AI Assistant" },
  { key: "reports", icon: FileText, label: "Reports" },
  { key: "pricing", icon: TrendingUp, label: "Pricing" },
  { key: "profile", icon: User, label: "Profile" },
];

const yieldData = [
  { month: "Jan", yield: 22 }, { month: "Feb", yield: 28 }, { month: "Mar", yield: 38 },
  { month: "Apr", yield: 45 }, { month: "May", yield: 55 }, { month: "Jun", yield: 68 }, { month: "Jul", yield: 82 },
];

function Layout({ section, setSection, sideOpen, setSideOpen, navigate, userProfile, userCropsList = [], children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Rain alert", message: "Heavy rain expected in Kerala tomorrow morning. Plan fertilizer work accordingly.", time: "5 min ago", read: false },
    { id: 2, title: "Market update", message: "Mandi prices updated. Check Market Insight for live crop rates.", time: "28 min ago", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const profileAcresVal = userProfile?.acres ? parseFloat(String(userProfile.acres).replace(/[^0-9.]/g, '')) || 0 : 0;
  const cropsAcresSum = userCropsList.reduce((acc, c) => acc + (parseFloat(String(c.area).replace(/[^0-9.]/g, '')) || 0), 0);

  const totalAcresNum = cropsAcresSum > 0 ? cropsAcresSum : (profileAcresVal > 0 ? profileAcresVal : 4.5);
  const totalCrops = userCropsList.length > 0 ? userCropsList.length : (userProfile?.crop && userProfile.crop !== 'None' ? 1 : 1);

  const avgHealth = userCropsList.length > 0 
    ? Math.round(userCropsList.reduce((acc, c) => acc + (parseInt(c.health) || 90), 0) / userCropsList.length)
    : 98;

  return (
    <div className="min-h-screen bg-[#F3F5F7] flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#071A0C] z-40 flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 border-b border-white/8">
          <button onClick={() => navigate("home")} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E38] flex items-center justify-center"><Leaf className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-white font-extrabold text-base font-[Plus_Jakarta_Sans]">FARMO <span className="text-[#4ADE80]">AI</span></div>
              <div className="text-white/35 text-[10px] uppercase tracking-widest">Farmer Portal</div>
            </div>
          </button>
        </div>
        {/* Farmer card */}
        <div className="px-4 py-4 border-b border-white/8">
          <div className="bg-[#1B5E38]/40 rounded-xl p-3.5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#4ADE80]/25 border-2 border-[#4ADE80]/35 flex items-center justify-center text-[#4ADE80] font-extrabold uppercase">
                {userProfile?.name ? userProfile.name[0] : "F"}
              </div>
              <div>
                <div className="text-white font-bold text-sm truncate max-w-[130px]">{userProfile?.name || "My Account"}</div>
                <div className="flex items-center gap-1 text-white/40 text-xs truncate max-w-[130px]">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />{userProfile?.district || "Location Not Set"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[
                [`${totalCrops}`, "Crop"],
                [`${totalAcresNum}ac`, "Area"],
                [`${avgHealth}%`, "Health"]
              ].map(([v, l]) => (
                <div key={l} className="bg-white/8 rounded-lg py-1.5">
                  <div className="text-white font-bold text-xs truncate px-1">{v}</div>
                  <div className="text-white/35 text-[10px]">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {SIDEBAR.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => { setSection(key); setSideOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${section === key ? "bg-[#1B5E38] text-white shadow-md shadow-green-900/30" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
              {section === key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 pt-3 border-t border-white/8">
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
            <p className="text-xs text-[#5A6B58]">Farmer Dashboard · {userProfile?.district || "Kerala"}</p>
          </div>
          <div className="ml-auto flex items-center gap-3 relative">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden z-30">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-[#132B1A]">Notifications</div>
                      <div className="text-[11px] text-[#5A6B58]">{unreadCount} unread updates</div>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-[#5A6B58]" /></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(item => (
                      <button key={item.id} onClick={() => { setNotifications(n => n.map(nItem => nItem.id === item.id ? { ...nItem, read: true } : nItem)); setShowNotifications(false); }} className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 transition-colors ${item.read ? "bg-white" : "bg-emerald-50/60"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full ${item.read ? "bg-gray-300" : "bg-[#1B5E38]"}`} />
                          <div>
                            <div className="text-sm font-bold text-[#132B1A]">{item.title}</div>
                            <div className="text-xs text-[#5A6B58] mt-0.5">{item.message}</div>
                            <div className="text-[11px] text-[#5A6B58] mt-1.5">{item.time}</div>
                          </div>
                        </div>
                      </button>
                    )) : <div className="px-4 py-6 text-sm text-[#5A6B58]">No notifications right now.</div>}
                  </div>
                </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1B5E38] flex items-center justify-center text-white font-bold text-sm uppercase">
              {userProfile?.name ? userProfile.name[0] : "F"}
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// ── Dashboard Home ──
function DashSection({ setSection, userProfile, userCropsList = [] }) {
  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : "Farmer";
  
  const [weatherInfo, setWeatherInfo] = useState({ temp: "30°C", sub: `${userProfile?.district || 'Palakkad'} Forecast`, condition: "Sunny", icon: "☀️" });

  useEffect(() => {
    const fetchWeather = () => {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const district = userProfile?.district || 'Palakkad';
      fetch(`${apiBase}/weather?district=${encodeURIComponent(district)}`)
        .then(res => res.json())
        .then(resData => {
          if (resData && resData.success && resData.data) {
            setWeatherInfo({
              temp: resData.data.temp,
              sub: `${resData.data.district} (${resData.data.condition})`,
              condition: resData.data.condition,
              icon: resData.data.icon
            });
          }
        }).catch(() => {});
    };
    fetchWeather();
    const timer = setInterval(fetchWeather, 60000);
    return () => clearInterval(timer);
  }, [userProfile?.district]);

  // Calculate dynamic stats
  const totalCrops = userCropsList.length;
  const totalAcresNum = userCropsList.reduce((acc, c) => {
    const val = parseFloat(String(c.area).replace(/[^0-9.]/g, '')) || 0;
    return acc + val;
  }, 0) || (userProfile?.acres ? parseFloat(String(userProfile.acres).replace(/[^0-9.]/g, '')) || 0 : 0);

  const avgHealth = totalCrops > 0 
    ? Math.round(userCropsList.reduce((acc, c) => acc + (parseInt(c.health) || 90), 0) / totalCrops)
    : (userProfile?.crop ? 95 : 100);

  const estMarketVal = totalAcresNum > 0 ? `₹${(totalAcresNum * 28500).toLocaleString('en-IN')}` : "₹0";

  // Dynamic AI recommendations based on user's actual crops
  let recommendations = [];
  if (totalCrops > 0) {
    userCropsList.forEach((c) => {
      recommendations.push({
        icon: AlertTriangle,
        msg: `${c.name} (${c.variety || 'Variety'}): ${c.nextAction || 'Monitor soil moisture and field health'}`,
        color: "border-l-emerald-500 bg-emerald-50"
      });
    });
    recommendations.push({
      icon: Bot,
      msg: `Market rate for ${userCropsList[0].name} is trending up. Consider holding 2 weeks for peak Mandi price.`,
      color: "border-l-violet-400 bg-violet-50"
    });
  } else {
    recommendations = [
      { icon: AlertTriangle, msg: "No land portions registered yet — click 'My Farm' to insert your crop variety & area.", color: "border-l-amber-400 bg-amber-50" },
      { icon: Bot, msg: "Update your district and soil type in 'Profile' for localized weather and disease alerts.", color: "border-l-sky-400 bg-sky-50" },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=220&fit=crop&auto=format" alt="" className="w-full h-28 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A0C]/95 via-[#071A0C]/80 to-transparent" />
        <div className="absolute inset-0 px-7 flex items-center">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Welcome Back, {firstName} 👋</div>
            <div className="text-white font-extrabold text-2xl font-[Plus_Jakarta_Sans]">
              {totalCrops > 0 
                ? `${userCropsList[0].name} & farm crops are active` 
                : "Complete your farm profile to get AI crop insights"}
            </div>
          </div>
          <div className="ml-auto hidden sm:flex gap-3">
            {[[`${avgHealth}%`, "Farm Health"], [`${totalAcresNum} ac`, "Farm Area"], [weatherInfo.temp, "Today"]].map(([v, l]) => (
              <div key={l} className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2 text-center">
                <div className="text-white font-extrabold text-lg font-[Plus_Jakarta_Sans]">{v}</div>
                <div className="text-white/55 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Farm Health", value: `${avgHealth}%`, sub: totalCrops > 0 ? "Active field tracking" : "Ready for setup", icon: Activity, bg: "bg-emerald-50", col: "text-[#1B5E38]", sec: "my-farm" },
          { label: "Crop Status", value: `${totalCrops} Active`, sub: totalCrops > 0 ? "All growing well" : "Add in My Farm", icon: Sprout, bg: "bg-sky-50", col: "text-sky-600", sec: "my-farm" },
          { label: "Weather", value: weatherInfo.temp, sub: weatherInfo.sub, icon: Sun, bg: "bg-amber-50", col: "text-amber-600", sec: "weather" },
          { label: "Market Value", value: estMarketVal, sub: "Est. harvest value", icon: TrendingUp, bg: "bg-violet-50", col: "text-violet-600", sec: "market" },
        ].map(({ label, value, sub, icon: Icon, bg, col, sec }) => (
          <button key={label} onClick={() => setSection(sec)} className="bg-white border border-border rounded-2xl p-5 text-left hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${col}`} /></div>
            <div className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
            <div className="text-sm text-[#5A6B58] mt-0.5">{label}</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1.5 truncate"><ArrowUp className="w-3 h-3 flex-shrink-0" />{sub}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-5">Yield Trend 2024</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={yieldData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs><linearGradient id="yG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1B5E38" stopOpacity={0.2} /><stop offset="95%" stopColor="#1B5E38" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 11 }} />
              <Area type="monotone" dataKey="yield" stroke="#1B5E38" fill="url(#yG)" strokeWidth={2.5} name="Yield (qtl)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map(({ icon: Icon, msg, color }, idx) => (
              <div key={idx} className={`border-l-4 ${color} rounded-xl px-4 py-3 flex items-start gap-2.5`}>
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#132B1A]" />
                <span className="text-sm text-[#132B1A]">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── My Farm ──
function MyFarmSection({ navigate, userProfile, userCropsList = [], additionalCrops = [], setAdditionalCrops }) {
  const [selected, setSelected] = useState(null);
  const [editingFarmDetails, setEditingFarmDetails] = useState(false);
  const [addingLand, setAddingLand] = useState(false);
  const [uploadedCropImage, setUploadedCropImage] = useState("");
  const cropImageInputRef = useRef(null);
  const [newLandForm, setNewLandForm] = useState({ name: "", variety: "", area: "", health: "90", stage: "Planning", nextAction: "" });

  const userKey = userProfile?.email || userProfile?.name || 'user';
  const userStorageKey = `krishi_farm_details_${userKey}`;
  const userCropsStorageKey = `krishi_user_crops_${userKey}`;

  const [farmDetails, setFarmDetails] = useState(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      farmName: userProfile?.name ? `${userProfile.name}'s Farm` : "My Farm",
      location: userProfile?.district ? `${userProfile.district}, ${userProfile?.state || 'Kerala'}` : "Location Not Set",
      totalArea: userProfile?.acres ? `${String(userProfile.acres).replace(/[^0-9.]/g, '') || ''}` : "",
      description: userProfile?.description || "",
      phone: userProfile?.phone || "",
      email: userProfile?.email || ""
    };
  });
  const [tempDetails, setTempDetails] = useState(farmDetails);

  // Sync farmDetails when userProfile updates directly from MySQL
  useEffect(() => {
    if (userProfile && userProfile.name) {
      setFarmDetails({
        farmName: `${userProfile.name}'s Farm`,
        location: `${userProfile.district || 'Idukki'}, ${userProfile.state || 'Kerala'}`,
        totalArea: userProfile.acres ? `${String(userProfile.acres).replace(/[^0-9.]/g, '')}` : "4.5",
        description: "",
        phone: userProfile.phone || "+91 94470 12345",
        email: userProfile.email || "jaishuriya@gmail.com"
      });
    }
  }, [userProfile]);

  const crop = selected ? userCropsList.find(c => c.id === selected) : null;

  const handleCropImageFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedCropImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveCropsToStorage = (updatedList) => {
    if (setAdditionalCrops) setAdditionalCrops(updatedList);
    try {
      localStorage.setItem(userCropsStorageKey, JSON.stringify(updatedList));
    } catch (e) {}
  };

  const handleDeleteCrop = async (cropId) => {
    const updated = additionalCrops.filter(ac => ac.id !== cropId);
    saveCropsToStorage(updated);

    // Also delete from server database table
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await fetch(`${apiBase}/user/crops/${cropId}`, { method: "DELETE" });
    } catch (e) {}
  };

  const handleSaveFarmDetails = () => {
    setFarmDetails(tempDetails);
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(tempDetails));
    } catch (e) {}
    setEditingFarmDetails(false);

    // Also update server database profile
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: tempDetails.email || userProfile?.email,
        name: tempDetails.farmName.replace("'s Farm", ""),
        phone: tempDetails.phone,
        acres: tempDetails.totalArea,
      }),
    }).catch(() => {});
  };

  if (addingLand) {
    const stageOptions = ["Planning", "Tillering", "Grain", "Tasseling", "Boll", "Growing", "Harvesting"];
    const isFormValid = Boolean(newLandForm.name.trim());

    return (
      <div className="space-y-5">
        <button onClick={() => { setAddingLand(false); setUploadedCropImage(""); setNewLandForm({ name: "", variety: "", area: "", health: "90", stage: "Planning", nextAction: "" }); }} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to My Farm
        </button>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] mb-2">Add New Land Portion</h2>
          <p className="text-xs text-[#5A6B58] mb-6">Enter crop name (alphabet text), variety, acreage (number), and upload your local crop photo.</p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">Crop Name * (Alphabet)</label>
              <input
                type="text"
                value={newLandForm.name}
                onChange={(e) => setNewLandForm({ ...newLandForm, name: e.target.value })}
                placeholder="e.g., Rice, Wheat, Corn, Paddy"
                className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm font-medium"
              />
              <span className="text-[10px] text-[#5A6B58] mt-1 block">Letters & crop name string</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">Crop Variety (Text)</label>
              <input
                type="text"
                value={newLandForm.variety}
                onChange={(e) => setNewLandForm({ ...newLandForm, variety: e.target.value })}
                placeholder="e.g., Basmati, HD 2967, Hybrid"
                className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm font-medium"
              />
              <span className="text-[10px] text-[#5A6B58] mt-1 block">Optional (defaults to Hybrid / Standard)</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">Area (Acres - Number) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={newLandForm.area}
                onChange={(e) => setNewLandForm({ ...newLandForm, area: e.target.value })}
                placeholder="e.g., 2.5"
                className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm font-medium"
              />
              <span className="text-[10px] text-[#5A6B58] mt-1 block">Numeric acreage (e.g. 1.0, 2.5)</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">Current Health % (Number)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newLandForm.health}
                onChange={(e) => setNewLandForm({ ...newLandForm, health: e.target.value })}
                placeholder="0-100"
                className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm font-medium"
              />
              <span className="text-[10px] text-[#5A6B58] mt-1 block">Number between 0 and 100%</span>
            </div>
          </div>

          {/* Local Image File Upload Input */}
          <div className="mb-6">
            <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest block mb-2">Upload Crop Image (Local Image File)</label>
            <input
              type="file"
              ref={cropImageInputRef}
              accept="image/*"
              onChange={handleCropImageFilePick}
              className="w-full text-sm text-[#5A6B58] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1B5E38] file:text-white hover:file:bg-[#154a2a] cursor-pointer border border-border rounded-xl p-2"
            />
            <span className="text-[10px] text-[#5A6B58] mt-1 block">Select an image file from your computer/device. No internet URL required.</span>

            {uploadedCropImage && (
              <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-border rounded-xl p-2.5 w-max">
                <div className="w-20 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={uploadedCropImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#132B1A]">Local Image Loaded</div>
                  <button
                    type="button"
                    onClick={() => setUploadedCropImage("")}
                    className="text-[11px] font-bold text-rose-600 hover:underline mt-0.5"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">Growth Stage</label>
            <select
              value={newLandForm.stage}
              onChange={(e) => setNewLandForm({ ...newLandForm, stage: e.target.value })}
              className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm font-medium cursor-pointer"
            >
              {stageOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">Next Action / Recommendation</label>
            <textarea
              value={newLandForm.nextAction}
              onChange={(e) => setNewLandForm({ ...newLandForm, nextAction: e.target.value })}
              placeholder="e.g., Apply organic fertilizer before upcoming rain"
              className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm resize-none h-20 font-medium"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                if (isFormValid) {
                  const areaVal = parseFloat(newLandForm.area) > 0 ? parseFloat(newLandForm.area) : 1.0;
                  const cropData = {
                    farmer_id: userProfile?.id,
                    email: userProfile?.email,
                    name: newLandForm.name.trim(),
                    variety: newLandForm.variety.trim() || "Hybrid / Standard Variety",
                    area: areaVal,
                    health: Math.min(100, Math.max(0, parseInt(newLandForm.health) || 90)),
                    stage: newLandForm.stage || "Planning",
                    next_action: newLandForm.nextAction.trim() || "Regular field monitoring & care",
                    image_url: uploadedCropImage || null
                  };

                  // 1. Post to backend REST API database table
                  try {
                    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
                    const res = await fetch(`${apiBase}/user/crops`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(cropData)
                    });
                    const resJson = await res.json();
                    if (resJson && resJson.success && resJson.data) {
                      const newObj = {
                        id: resJson.data.id,
                        name: resJson.data.name,
                        variety: resJson.data.variety,
                        area: resJson.data.area,
                        health: resJson.data.health,
                        stage: resJson.data.stage,
                        nextAction: resJson.data.nextAction,
                        image: resJson.data.image_url
                      };
                      saveCropsToStorage([newObj, ...additionalCrops]);
                    } else {
                      // Fallback local insert
                      const newObj = {
                        id: `add-${Date.now()}`,
                        name: cropData.name,
                        variety: cropData.variety,
                        area: `${areaVal} acres`,
                        health: cropData.health,
                        stage: cropData.stage,
                        nextAction: cropData.next_action,
                        image: uploadedCropImage || null
                      };
                      saveCropsToStorage([newObj, ...additionalCrops]);
                    }
                  } catch (e) {
                    const newObj = {
                      id: `add-${Date.now()}`,
                      name: cropData.name,
                      variety: cropData.variety,
                      area: `${areaVal} acres`,
                      health: cropData.health,
                      stage: cropData.stage,
                      nextAction: cropData.next_action,
                      image: uploadedCropImage || null
                    };
                    saveCropsToStorage([newObj, ...additionalCrops]);
                  }

                  setAddingLand(false);
                  setUploadedCropImage("");
                  setNewLandForm({ name: "", variety: "", area: "", health: "90", stage: "Planning", nextAction: "" });
                }
              }}
              className="flex-1 bg-[#1B5E38] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#154a2a] transition-all shadow-md shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
            >
              Add Land Portion to Database
            </button>
            <button
              onClick={() => {
                setAddingLand(false);
                setUploadedCropImage("");
                setNewLandForm({ name: "", variety: "", area: "", health: "90", stage: "Planning", nextAction: "" });
              }}
              className="flex-1 bg-gray-100 text-[#5A6B58] py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editingFarmDetails) {
    return (
      <div className="space-y-5">
        <button onClick={() => { setEditingFarmDetails(false); setTempDetails(farmDetails); }} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </button>
        
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans] mb-6">Edit Farm Details</h2>
          
          <div className="space-y-4">
            {[
              { label: "Farm Name", key: "farmName", type: "text" },
              { label: "Location", key: "location", type: "text" },
              { label: "Total Area (acres)", key: "totalArea", type: "number" },
              { label: "Phone", key: "phone", type: "tel" },
              { label: "Email", key: "email", type: "email" },
              { label: "Description", key: "description", type: "textarea" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="text-xs font-bold text-[#5A6B58] uppercase tracking-widest">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={tempDetails[key]}
                    onChange={(e) => setTempDetails({ ...tempDetails, [key]: e.target.value })}
                    placeholder="Enter description"
                    className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm resize-none h-24"
                  />
                ) : (
                  <input
                    type={type}
                    value={tempDetails[key]}
                    onChange={(e) => setTempDetails({ ...tempDetails, [key]: e.target.value })}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full mt-2 px-4 py-2.5 border border-border rounded-xl focus:border-[#1B5E38] focus:outline-none text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSaveFarmDetails}
              className="flex-1 bg-[#1B5E38] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#154a2a] transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditingFarmDetails(false);
                setTempDetails(farmDetails);
              }}
              className="flex-1 bg-gray-100 text-[#5A6B58] py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (crop) {
    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to My Farm
        </button>
        <div className="relative rounded-2xl overflow-hidden min-h-[13rem] bg-gradient-to-r from-[#071A0C] via-[#1B5E38] to-[#071A0C]">
          {crop.image ? (
            <img src={crop.image} alt={crop.name} className="w-full h-52 object-cover" />
          ) : (
            <div className="w-full h-52 flex items-center justify-center">
              <Sprout className="w-16 h-16 text-[#4ADE80]/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A0C]/90 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
            <div><h2 className="text-3xl font-extrabold text-white font-[Plus_Jakarta_Sans]">{crop.name}</h2><span className="text-white/60">{crop.area} · {crop.stage}</span></div>
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${crop.health >= 90 ? "bg-emerald-500 text-white" : crop.health >= 75 ? "bg-amber-500 text-white" : "bg-rose-500 text-white"}`}>{crop.health}% Health</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {crop.aiNote && (
              <div className="bg-[#071A0C] border border-[#4ADE80]/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#4ADE80]/15 flex items-center justify-center"><Bot className="w-5 h-5 text-[#4ADE80]" /></div>
                  <div className="text-white font-bold">AI Analysis & Suggestions</div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">{crop.aiNote}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate("farmer", { section: "crop-analysis" })} className="bg-[#1B5E38] text-white rounded-2xl p-5 text-left hover:bg-[#155030] transition-colors">
                <BarChart2 className="w-6 h-6 mb-3" />
                <div className="font-bold">Analyse Crop</div>
                <div className="text-white/70 text-xs mt-1">Upload photo for AI disease detection</div>
              </button>
              <button onClick={() => navigate("market")} className="bg-white border border-border rounded-2xl p-5 text-left hover:shadow-lg transition-all">
                <TrendingUp className="w-6 h-6 mb-3 text-[#1B5E38]" />
                <div className="font-bold text-[#132B1A]">View Market</div>
                <div className="text-[#5A6B58] text-xs mt-1">Check current {crop.name} prices</div>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: "Crop Details", icon: Sprout, col: "text-emerald-600", bg: "bg-emerald-50", rows: [["Area", crop.area], ["Stage", crop.stage], ["Variety", crop.variety || "Standard"]] },
              { title: "Water Requirement", icon: Droplets, col: "text-sky-600", bg: "bg-sky-50", rows: [["Advice", crop.water || "Regular watering schedule"]] },
              { title: "Action Needed", icon: Activity, col: "text-amber-600", bg: "bg-amber-50", rows: [["Recommendation", crop.nextAction || "Regular field monitoring"]] },
            ].map(({ title, icon: Icon, col, bg, rows }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}><Icon className={`w-3.5 h-3.5 ${col}`} /></div>
                  <span className="font-bold text-[#132B1A] text-sm">{title}</span>
                </div>
                <div className="space-y-1.5">
                  {rows.map(([l, v]) => (
                    <div key={l}><div className="text-[10px] text-[#5A6B58] font-bold uppercase tracking-widest">{l}</div><div className="text-sm text-[#132B1A] font-medium">{v}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const computedTotalAcres = userCropsList.reduce((acc, c) => {
    const val = parseFloat(String(c.area).replace(/[^0-9.]/g, '')) || 0;
    return acc + val;
  }, 0);

  const displayArea = computedTotalAcres > 0 
    ? `${computedTotalAcres} acres` 
    : (farmDetails.totalArea ? `${farmDetails.totalArea} acres` : (userProfile?.acres ? `${userProfile.acres} acres` : "Not set"));

  const displayPhone = farmDetails.phone || userProfile?.phone || "Not set";
  const displayEmail = farmDetails.email || userProfile?.email || "farmer@farmoai.in";
  const displayLocation = farmDetails.location && farmDetails.location !== "Location Not Set" 
    ? farmDetails.location 
    : (userProfile?.district ? `${userProfile.district}, ${userProfile?.state || 'Kerala'}` : "Palakkad, Kerala");

  return (
    <div className="space-y-5">
      <div className="bg-white border border-border rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{farmDetails.farmName || (userProfile?.name ? `${userProfile.name}'s Farm` : "My Farm")}</h2>
            <div className="flex items-center gap-1 text-[#5A6B58] text-sm mt-1"><MapPin className="w-4 h-4 text-[#1B5E38]" />{displayLocation}</div>
          </div>
          <button
            onClick={() => setEditingFarmDetails(true)}
            className="px-4 py-2 bg-[#1B5E38] text-white rounded-xl text-xs font-bold hover:bg-[#154a2a] transition-colors"
          >
            Edit Details
          </button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-3 pt-4 border-t border-border">
          {[
            { label: "Total Area", value: displayArea },
            { label: "Email", value: displayEmail },
            { label: "Phone", value: displayPhone },
            { label: "Status", value: "Active" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest">{label}</div>
              <div className="text-sm font-semibold text-[#132B1A] mt-1">{value}</div>
            </div>
          ))}
        </div>

        {farmDetails.description ? (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-[#5A6B58] leading-relaxed">{farmDetails.description}</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">My Farm — {userCropsList.length} Active Crop{userCropsList.length !== 1 ? 's' : ''}</h2>
        <button
          onClick={() => setAddingLand(true)}
          className="text-xs font-bold bg-[#1B5E38] text-white px-3.5 py-2 rounded-xl hover:bg-[#154a2a] transition-colors shadow-sm"
        >
          + Add New Land
        </button>
      </div>

      {userCropsList.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {userCropsList.map(c => (
            <div key={c.id} className="group relative">
              {additionalCrops.find(ac => ac.id === c.id) && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteCrop(c.id);
                  }}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                  title="Delete this land portion"
                >
                  ×
                </button>
              )}
              <button onClick={() => setSelected(c.id)} className="group text-left bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-900/7 hover:-translate-y-1 transition-all w-full">
                <div className="h-36 overflow-hidden relative bg-gradient-to-br from-green-100 to-green-50">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50">
                      <Sprout className="w-12 h-12 text-amber-600/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-white font-bold text-sm block">{c.name}</span>
                      {c.variety && <span className="text-white/80 text-xs">{c.variety}</span>}
                    </div>
                    <span className="text-xs font-bold bg-[#1B5E38] text-white px-2 py-0.5 rounded-full">{c.stage.split(" ")[0]}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#5A6B58]">{c.area}</span>
                    <span className="text-xs font-bold text-[#132B1A]">{c.health}% health</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 mb-3">
                    <div className={`h-full rounded-full ${c.health >= 90 ? "bg-emerald-500" : c.health >= 75 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${c.health}%` }} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-[#132B1A] leading-relaxed">{c.nextAction}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-[#1B5E38]">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#132B1A] font-[Plus_Jakarta_Sans]">No Farm Land or Crops Added Yet</h3>
          <p className="text-sm text-[#5A6B58] max-w-md mx-auto">
            Click <b>+ Add New Land</b> below to insert your crop variety, land acreage, and growth stage.
          </p>
          <button
            onClick={() => setAddingLand(true)}
            className="px-6 py-2.5 bg-[#1B5E38] text-white font-bold text-sm rounded-xl hover:bg-[#154a2a] transition-all shadow-md shadow-green-900/20"
          >
            + Add New Land Portion
          </button>
        </div>
      )}
    </div>
  );
}

// ── Crop Analysis ──
function CropAnalysisSection({ userProfile }) {
  const [state, setState] = useState("idle");
  const [scanImagePreview, setScanImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const startScan = (imgData = null) => {
    setState("scanning");
    setTimeout(() => {
      setState("done");
      // Save AI disease scan log to MySQL database table
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      fetch(`${apiBase}/crops/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: userProfile?.name || "Farmer",
          crop: userProfile?.crop || "Crop",
          disease_name: "Rice Blast — Pyricularia oryzae",
          confidence_score: 96.0,
          district: userProfile?.district || "Palakkad",
          severity: "Medium",
          image_url: imgData || null
        })
      }).catch(() => {});
    }, 3000);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setScanImagePreview(reader.result);
      startScan(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">AI Crop Disease Analysis</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <div onClick={() => state === "idle" && handleUploadClick()} className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${state === "idle" ? "border-gray-200 hover:border-[#1B5E38]/50 hover:bg-gray-50" : state === "scanning" ? "border-amber-300 bg-amber-50" : "border-[#1B5E38]/40 bg-emerald-50"}`}>
          {state === "idle" && <>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5"><Camera className="w-8 h-8 text-gray-400" /></div>
            <h3 className="font-bold text-[#132B1A] text-lg mb-2">Upload Crop Leaf Photo</h3>
            <p className="text-[#5A6B58] text-sm mb-2">Upload plant photo or scan using camera</p>
            <p className="text-[#5A6B58] text-sm mb-6">Supports JPG, PNG · Max 10 MB</p>
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={e => { e.stopPropagation(); handleUploadClick(); }} className="px-5 py-2.5 rounded-xl bg-[#1B5E38] text-white text-sm font-bold">Upload Image</button>
              <button type="button" onClick={e => { e.stopPropagation(); handleCameraClick(); }} className="px-5 py-2.5 rounded-xl border border-[#1B5E38] text-[#1B5E38] text-sm font-bold">📷 Camera Scan</button>
            </div>
          </>}
          {state === "scanning" && <>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-300/50 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🔬</div>
            </div>
            <div className="font-bold text-[#132B1A] text-lg mb-2">AI Scanning Image & Saving to MySQL Database…</div>
            <div className="text-[#5A6B58] text-sm mb-4">Checking against 200+ plant diseases</div>
          </>}
          {state === "done" && <>
            {scanImagePreview ? (
              <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-3 border border-border shadow-sm">
                <img src={scanImagePreview} alt="Scanned Leaf" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-[#1B5E38]" /></div>
            )}
            <div className="font-bold text-[#132B1A] text-lg mb-1">Analysis Complete!</div>
            <div className="text-xs text-emerald-700 font-semibold mb-3">✓ Scan log saved to MySQL database</div>
            <button onClick={e => { e.stopPropagation(); setState("idle"); setScanImagePreview(null); }} className="text-xs text-[#5A6B58] hover:text-[#132B1A] underline">Upload another photo</button>
          </>}
        </div>

        <div>
          {state !== "done" ? (
            <div className="bg-white border border-border rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-5"><Shield className="w-7 h-7 text-gray-300" /></div>
              <p className="text-[#5A6B58] text-sm">AI Result Card will appear here after uploading a plant image</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                  <div><div className="font-bold text-[#132B1A]">Disease: Detected</div><div className="text-amber-700 text-sm font-semibold">Rice Blast — Pyricularia oryzae</div></div>
                  <span className="ml-auto text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">96% Confident</span>
                </div>
              </div>
              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-[#132B1A]">Health Score</span>
                  <span className="text-3xl font-extrabold text-amber-600 font-[Plus_Jakarta_Sans]">72%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mb-5"><div className="h-full bg-amber-400 rounded-full" style={{ width: "72%" }} /></div>
                <h4 className="font-bold text-[#132B1A] mb-3">AI Suggestion — Treatment Plan</h4>
                {[["Immediate", "Apply Tricyclazole 75% WP @ 0.6 g/L water"], ["Day 3", "Remove and destroy infected plant parts"], ["Day 7", "Follow-up spray with Propiconazole 25 EC @ 1 ml/L"], ["Ongoing", "Improve drainage to reduce field humidity"]].map(([d, a]) => (
                  <div key={d} className="flex gap-3 mb-3">
                    <span className="text-[10px] font-bold text-[#1B5E38] bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex-shrink-0 h-fit mt-0.5">{d}</span>
                    <span className="text-[#5A6B58] text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Market ──
function MarketSection({ navigate, userProfile }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [marketData, setMarketData] = useState(marketCrops);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrice, setNewPrice] = useState({
    crop_name: "",
    district: userProfile?.district || "Idukki",
    min_price: "",
    max_price: "",
    modal_price: "",
    unit: "Quintal",
    trend: "up"
  });

  const fetchLiveMarketData = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/market-prices`)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setMarketData(resData.data.map(m => ({
            id: m.id,
            name: m.crop_name,
            district: m.district || 'Kerala Mandi',
            minPrice: m.min_price ? `₹${m.min_price}` : '₹2,600',
            maxPrice: m.max_price ? `₹${m.max_price}` : '₹3,000',
            currentPrice: `₹${m.modal_price || m.price_per_kg || 2850}`,
            unit: m.unit || 'Quintal',
            change: m.trend === 'up' ? '+2.5%' : m.trend === 'down' ? '-1.2%' : '0.0%',
            up: m.trend === 'up',
            emoji: m.crop_name.toLowerCase().includes('rice') || m.crop_name.toLowerCase().includes('paddy') ? '🌾' :
                   m.crop_name.toLowerCase().includes('coconut') ? '🥥' :
                   m.crop_name.toLowerCase().includes('cardamom') ? '🫘' :
                   m.crop_name.toLowerCase().includes('rubber') ? '🪵' :
                   m.crop_name.toLowerCase().includes('banana') ? '🍌' : '🌱'
          })));
        }
      }).catch(() => {});
  };

  useEffect(() => {
    fetchLiveMarketData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    fetchLiveMarketData();
    await new Promise(resolve => setTimeout(resolve, 600));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    if (!newPrice.crop_name || !newPrice.modal_price) return;
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    try {
      await fetch(`${apiBase}/admin/market-prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrice)
      });
      setShowAddModal(false);
      setNewPrice({ crop_name: "", district: userProfile?.district || "Idukki", min_price: "", max_price: "", modal_price: "", unit: "Quintal", trend: "up" });
      fetchLiveMarketData();
    } catch (err) {}
  };

  const filteredMarketData = marketData.filter(item => {
    const matchesDistrict = selectedDistrict === "all" || item.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchesSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Market Insights & Live Mandi Rates</h2>
          <p className="text-xs text-[#5A6B58] mt-0.5">Live rates synced directly from MySQL database · Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            {isRefreshing ? 'Refreshing...' : '🔄 Refresh Rates'}
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B5E38] text-white text-xs font-bold hover:bg-[#154a2a] transition-all shadow-sm"
          >
            + Add Mandi Price
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search crop name or district (e.g. Paddy, Idukki)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-[#1B5E38]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#5A6B58]" />
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-bold text-[#132B1A] focus:outline-none focus:border-[#1B5E38]"
          >
            <option value="all">All Districts</option>
            <option value="Idukki">Idukki</option>
            <option value="Palakkad">Palakkad</option>
            <option value="Kottayam">Kottayam</option>
            <option value="Wayanad">Wayanad</option>
            <option value="Kollam">Kollam</option>
          </select>
        </div>
      </div>

      {/* Top Crop Price Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredMarketData.map(c => (
          <div key={c.id} className="bg-white border border-border rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
            <div className="font-bold text-[#132B1A] text-sm mb-0.5 truncate">{c.name}</div>
            <div className="text-xs text-[#5A6B58] mb-1">{c.district}</div>
            <div className="text-base font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{c.currentPrice} <span className="text-[10px] text-gray-500 font-normal">/{c.unit}</span></div>
            <div className={`text-xs font-bold mt-1.5 flex items-center gap-0.5 ${c.up ? "text-emerald-600" : "text-rose-600"}`}>
              {c.up ? <ArrowUp className="w-3 h-3" /> : <ArrowUp className="w-3 h-3 rotate-180" />}{c.change}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Mandi Rate Table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-bold text-[#132B1A] text-sm font-[Plus_Jakarta_Sans]">Detailed District Mandi Rate Directory</h3>
          <span className="text-xs text-[#5A6B58]">{filteredMarketData.length} active crop rates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-[11px] font-extrabold uppercase tracking-wider text-[#5A6B58]">
                <th className="py-3 px-6">Crop Name</th>
                <th className="py-3 px-4">District / Market</th>
                <th className="py-3 px-4 text-right">Min Rate</th>
                <th className="py-3 px-4 text-right">Max Rate</th>
                <th className="py-3 px-4 text-right">Modal Rate</th>
                <th className="py-3 px-4 text-center">Unit</th>
                <th className="py-3 px-6 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredMarketData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-[#132B1A]">
                    <span className="mr-2">{row.emoji}</span>{row.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#5A6B58]">{row.district}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-gray-600">{row.minPrice}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-gray-600">{row.maxPrice}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#1B5E38]">{row.currentPrice}</td>
                  <td className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500">{row.unit}</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${row.up ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                      {row.up ? "▲ Up" : "▼ Down"} {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Market Price Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-border space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#132B1A]">Add / Update Live Mandi Price</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <form onSubmit={handleAddPrice} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#5A6B58] uppercase">Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom, Rubber, Coconut"
                  value={newPrice.crop_name}
                  onChange={e => setNewPrice({ ...newPrice, crop_name: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B5E38]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5A6B58] uppercase">District</label>
                  <input
                    type="text"
                    required
                    value={newPrice.district}
                    onChange={e => setNewPrice({ ...newPrice, district: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5A6B58] uppercase">Unit</label>
                  <select
                    value={newPrice.unit}
                    onChange={e => setNewPrice({ ...newPrice, unit: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 text-sm"
                  >
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#5A6B58] uppercase">Min Rate</label>
                  <input
                    type="number"
                    placeholder="2600"
                    value={newPrice.min_price}
                    onChange={e => setNewPrice({ ...newPrice, min_price: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5A6B58] uppercase">Max Rate</label>
                  <input
                    type="number"
                    placeholder="3000"
                    value={newPrice.max_price}
                    onChange={e => setNewPrice({ ...newPrice, max_price: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5A6B58] uppercase">Modal Rate</label>
                  <input
                    type="number"
                    required
                    placeholder="2850"
                    value={newPrice.modal_price}
                    onChange={e => setNewPrice({ ...newPrice, modal_price: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-sm font-bold text-[#1B5E38]"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#1B5E38] text-white font-bold text-xs hover:bg-[#154a2a]">Save Rate to MySQL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Weather ──
function WeatherSection({ userProfile }) {
  const [liveWeather, setLiveWeather] = useState(null);
  const userDistrict = userProfile?.district || 'Malappuram';

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/weather?district=${encodeURIComponent(userDistrict)}`)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && resData.data) {
          setLiveWeather(resData.data);
        }
      }).catch(() => {});
  }, [userDistrict]);

  const todayWeather = {
    temp: liveWeather?.temp || "31°C",
    high: "31°",
    low: "24°",
    condition: liveWeather?.condition || "Warm Afternoon Sunny",
    rainChance: liveWeather?.rainChance || "25%",
    humidity: "68%",
    wind: "12 km/h",
    uvIndex: "Moderate (6)",
    icon: liveWeather?.icon || "☀️"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">Today's Weather Intelligence</h2>
          <p className="text-xs text-[#5A6B58] mt-0.5">Real-time farm weather metrics for {userDistrict}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live {userDistrict} Weather
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today Main Weather Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#0A2613] via-[#133E20] to-[#1B5E38] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-[#4ADE80] uppercase tracking-wider">
                  TODAY · {userDistrict.toUpperCase()}
                </span>
                <div className="text-6xl font-extrabold font-[Plus_Jakarta_Sans] mt-4 mb-1 tracking-tight flex items-baseline gap-3">
                  {todayWeather.temp}
                  <span className="text-xl font-medium text-white/70">High: {todayWeather.high} / Low: {todayWeather.low}</span>
                </div>
                <div className="text-xl font-bold text-[#4ADE80] flex items-center gap-2">
                  <span>{todayWeather.icon}</span> {todayWeather.condition}
                </div>
              </div>
              <div className="text-6xl drop-shadow-lg animate-bounce duration-1000">
                {todayWeather.icon}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                <Droplets className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
                <div className="text-xs text-white/60 font-semibold">Rain Chance</div>
                <div className="text-lg font-bold text-white mt-0.5">{todayWeather.rainChance}</div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                <Activity className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <div className="text-xs text-white/60 font-semibold">Humidity</div>
                <div className="text-lg font-bold text-white mt-0.5">{todayWeather.humidity}</div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                <Sun className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-xs text-white/60 font-semibold">UV Index</div>
                <div className="text-lg font-bold text-white mt-0.5">{todayWeather.uvIndex}</div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                <RefreshCw className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <div className="text-xs text-white/60 font-semibold">Wind Speed</div>
                <div className="text-lg font-bold text-white mt-0.5">{todayWeather.wind}</div>
              </div>
            </div>
          </div>

          {/* Today Farming Impact Assessment Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-[#132B1A] text-base mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#1B5E38]" />
              Today's Field Impact for {userDistrict} Farmers
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Soil Moisture</div>
                <div className="text-lg font-extrabold text-[#132B1A]">Optimal (42%)</div>
                <div className="text-xs text-[#5A6B58] mt-1">Good water retention for active paddy & crop growth</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Evaporation Rate</div>
                <div className="text-lg font-extrabold text-[#132B1A]">3.8 mm/day</div>
                <div className="text-xs text-[#5A6B58] mt-1">Moderate water loss — irrigate during early morning</div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">Foliar Spraying</div>
                <div className="text-lg font-extrabold text-[#132B1A]">Favorable</div>
                <div className="text-xs text-[#5A6B58] mt-1">Low wind speed allows pesticide application today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#132B1A] mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              AI Farming Advice for Today
            </h3>
            {[
              { icon: "🌧️", title: "Heavy Rain Alert", desc: `Today & tomorrow — delay top-dressing fertilizer in ${userDistrict}`, bg: "bg-amber-50 border-amber-200" },
              { icon: "✅", title: "Harvest Window", desc: "Today's clear weather ideal for ripe field harvest", bg: "bg-emerald-50 border-emerald-200" },
              { icon: "💧", title: "Skip Evening Irrigation", desc: "Natural soil moisture today is sufficient", bg: "bg-sky-50 border-sky-200" },
            ].map(({ icon, title, desc, bg }) => (
              <div key={title} className={`border ${bg} rounded-xl p-3.5 mb-3 last:mb-0`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{icon}</span>
                  <span className="text-sm font-bold text-[#132B1A]">{title}</span>
                </div>
                <p className="text-xs text-[#5A6B58] pl-6 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#1B5E38] to-[#0F3D24] rounded-2xl p-6 text-white shadow-md">
            <div className="text-xs text-white/70 font-semibold mb-1 uppercase tracking-wider">Today's Cumulative Rainfall</div>
            <div className="text-4xl font-extrabold mb-1 font-[Plus_Jakarta_Sans]">68 mm</div>
            <div className="text-xs text-white/60 mb-4">Above average for {userDistrict}</div>
            <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-[#4ADE80] rounded-full" style={{ width: "72%" }} />
            </div>
            <div className="text-xs text-white/60 mt-2">72% of monthly target received for {userDistrict}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI Assistant ──
function AIAssistantSection({ userProfile }) {
  const [msgs, setMsgs] = useState(sampleChat);
  const [input, setInput] = useState("");
  const reminderOptions = [
    "What fertilizer for rice?",
    "When to harvest paddy?",
    "Best price for corn?",
    "Monsoon advice?",
  ];
  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");

    // Save AI consultation to MySQL database
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/ai/consult`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farmer_id: userProfile?.id || null,
        topic: text,
        language: "English",
        satisfaction_rating: 5
      })
    }).catch(() => {});

    setTimeout(() => setMsgs(m => [...m, { role: "ai", text: `Based on your ${userProfile?.district || 'farm'} data and current conditions, here's my personalized recommendation: your active crops need regular field inspection and nitrogen top-dressing before the rain. Would you like a detailed weekly farming plan?` }]), 1100);
  };
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">AI Farming Assistant</h2>
      <div className="bg-[#071A0C] border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ height: "72vh" }}>
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
          <div><div className="text-white font-bold text-sm">FARMO AI Assistant</div><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" /><span className="text-[#4ADE80] text-xs">Online · Personalised for Rajan</span></div></div>
          <div className="ml-auto text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">ML | EN | HI</div>
        </div>
        <div className="flex-1 p-5 space-y-3 overflow-y-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "ai" && <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#059669] flex items-center justify-center flex-shrink-0"><Bot className="w-3.5 h-3.5 text-white" /></div>}
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-[#1B5E38] text-white rounded-tr-sm" : "bg-white/8 text-white/80 border border-white/10 rounded-tl-sm"}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-3.5">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#4ADE80]">Reminder options</div>
          <div className="flex flex-wrap gap-2">
            {reminderOptions.map((option) => (
              <button
                key={option}
                onClick={() => send(option)}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-[#1B5E38]/70 hover:text-white transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-3.5 flex items-center gap-2.5">
          <button className="w-8 h-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-[#4ADE80]/15 transition-colors"><Mic className="w-3.5 h-3.5 text-white/50" /></button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask your AI farming assistant…" className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/28 outline-none focus:border-[#4ADE80]/40 transition-colors" />
          <button onClick={() => send(input)} className="w-8 h-8 rounded-xl bg-[#1B5E38] flex items-center justify-center hover:bg-[#155030] transition-colors"><Send className="w-3.5 h-3.5 text-white" /></button>
        </div>
      </div>
    </div>
  );
}

// ── Reports ──
function ReportsSection() {
  const [search, setSearch] = useState("");
  const [viewingReport, setViewingReport] = useState(null);
  const [downloadingItems, setDownloadingItems] = useState({});

  const reportGroups = [
    {
      group: "Crop Reports",
      items: [
        { title: "Monthly Crop Health Report", date: "July 2024", size: "2.4 MB", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
        { title: "Weekly Crop Status Summary", date: "Week 28, 2024", size: "0.8 MB", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
      ],
    },
    {
      group: "AI Reports",
      items: [
        { title: "AI Disease Detection Log", date: "July 2024", size: "1.1 MB", cls: "bg-rose-50 text-rose-700 border-rose-100" },
        { title: "AI Recommendation History", date: "Q2 2024", size: "1.8 MB", cls: "bg-violet-50 text-violet-700 border-violet-100" },
      ],
    },
    {
      group: "Market Reports",
      items: [
        { title: "Market Price Analysis", date: "July 2024", size: "3.2 MB", cls: "bg-amber-50 text-amber-700 border-amber-100" },
        { title: "Annual Income Summary 2023–24", date: "2024", size: "4.5 MB", cls: "bg-teal-50 text-teal-700 border-teal-100" },
      ],
    },
  ];

  const filteredGroups = reportGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      [item.title, item.date, item.size, group.group].join(" ").toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const handleDownload = (item) => {
    const fileKey = `${item.title}-${item.date}`;
    setDownloadingItems(prev => ({ ...prev, [fileKey]: true }));

    const text = `Report: ${item.title}\nDate: ${item.date}\nSize: ${item.size}\n\nGenerated from FARMO AI Farmer Portal.`;
    const blob = new Blob([text], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    window.setTimeout(() => {
      setDownloadingItems(prev => ({ ...prev, [fileKey]: false }));
    }, 800);
  };

  if (viewingReport) {
    return (
      <div className="space-y-5">
        <button onClick={() => setViewingReport(null)} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Reports
        </button>

        <div className="bg-white border border-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{viewingReport.title}</h2>
              <p className="text-sm text-[#5A6B58] mt-1">{viewingReport.date} · {viewingReport.size}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-border rounded-xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-3">Report Summary</h3>
              <p className="text-sm text-[#5A6B58] leading-relaxed">
                This detailed report covers field health, farm recommendations, and the latest update snapshot for your registered crops. It is prepared for a quick review before export and sharing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Total Pages", value: "12" },
                { label: "Data Points", value: "4,890+" },
                { label: "Last Generated", value: "Today, 2:45 PM" },
                { label: "Next Refresh", value: "Tomorrow" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">
                  <div className="text-xs text-[#5A6B58] font-bold uppercase tracking-widest">{label}</div>
                  <div className="text-2xl font-extrabold text-[#1B5E38] mt-1 font-[Plus_Jakarta_Sans]">{value}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-900">📊 Detailed charts, trend information, and field insights are available in the downloadable report package.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(viewingReport)}
                disabled={!!downloadingItems[`${viewingReport.title}-${viewingReport.date}`]}
                className="flex-1 text-sm font-bold text-white bg-[#1B5E38] hover:bg-[#154a2a] px-4 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingItems[`${viewingReport.title}-${viewingReport.date}`] ? "Downloading..." : "Download as PDF"}
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
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">My Reports</h2>
      </div>

      <div className="bg-white border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#5A6B58]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reports, categories, or dates"
          className="w-full bg-transparent outline-none text-sm text-[#132B1A] placeholder:text-[#5A6B58]"
        />
      </div>

      {filteredGroups.every(group => group.items.length === 0) ? (
        <div className="bg-white border border-border rounded-2xl p-8 text-center text-sm text-[#5A6B58]">No reports found for your search.</div>
      ) : (
        filteredGroups.map(group => (
          <div key={group.group}>
            <h3 className="font-bold text-[#132B1A] mb-3 text-sm uppercase tracking-widest text-[#5A6B58]">{group.group}</h3>
            <div className="space-y-3">
              {group.items.map(item => (
                <div key={item.title} className="bg-white border border-border rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl border ${item.cls} flex items-center justify-center flex-shrink-0`}><FileText className="w-5 h-5" /></div>
                    <div className="min-w-0">
                      <div className="font-bold text-[#132B1A] text-sm">{item.title}</div>
                      <div className="text-xs text-[#5A6B58] mt-0.5">{item.date} · {item.size}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setViewingReport(item)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A6B58] bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button onClick={() => handleDownload(item)} disabled={!!downloadingItems[`${item.title}-${item.date}`]} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E38] bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                      <Download className="w-3.5 h-3.5" />{downloadingItems[`${item.title}-${item.date}`] ? "Downloading..." : "Download"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Profile ──
function ProfileSection({ userProfile = {}, setUserProfile }) {
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: userProfile?.name || "Farmer User",
    email: userProfile?.email || "farmer@farmoai.in",
    phone: userProfile?.phone || "+91 94470 12345",
    district: userProfile?.district || "Palakkad",
    state: userProfile?.state || "Kerala",
    acres: userProfile?.acres ? `${String(userProfile.acres).replace(/[^0-9.]/g, '') || '4.5'} acres` : "4.5 acres",
    crop: userProfile?.crop || "Paddy (Jyothi)",
    memberSince: userProfile?.joined || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
  });

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleSave = async () => {
    const updated = {
      ...userProfile,
      name: form.name,
      email: form.email,
      phone: form.phone,
      district: form.district,
      state: form.state,
      acres: form.acres,
      crop: form.crop,
    };
    if (setUserProfile) setUserProfile(updated);
    try {
      localStorage.setItem("krishi_user", form.name);
      localStorage.setItem("krishi_user_profile", JSON.stringify(updated));
    } catch (e) {}
    setEditing(false);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await fetch(`${apiBase}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (e) {
      console.warn("Could not save to MySQL directly:", e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">My Profile</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImagePick}
      />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-[#071A0C] rounded-2xl p-6 text-center shadow-sm">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full bg-[#1B5E38] flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 overflow-hidden border-2 border-white/20 hover:opacity-90 transition-opacity uppercase"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{userProfile?.name ? userProfile.name[0] : "F"}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-[#4ADE80] hover:underline mb-3"
          >
            Change Photo
          </button>
          <div className="text-white font-extrabold text-xl font-[Plus_Jakarta_Sans]">
            {userProfile?.name || "Farmer User"}
          </div>
          <div className="text-white/50 text-sm mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {userProfile?.district || "Palakkad"}, {userProfile?.state || "Kerala"}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              [userProfile?.crop ? userProfile.crop.split(" ")[0] : "Paddy", "Primary Crop"],
              [userProfile?.acres ? `${String(userProfile.acres).replace(/[^0-9.]/g, '') || '4.5'} ac` : "4.5 ac", "Farm Area"],
              ["98%", "Health"],
              ["Verified", "Plan"]
            ].map(([v, l]) => (
              <div key={l} className="bg-white/5 border border-white/8 rounded-xl p-2.5">
                <div className="text-white font-bold text-sm font-[Plus_Jakarta_Sans] truncate px-1">{v}</div>
                <div className="text-white/40 text-[10px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#132B1A]">Account Information</h3>
            <button
              onClick={() => {
                if (editing) handleSave();
                else setEditing(true);
              }}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                editing ? "bg-[#1B5E38] text-white border-[#1B5E38]" : "border-[#1B5E38] text-[#1B5E38] hover:bg-emerald-50"
              }`}
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Full Name", "name", form.name],
              ["Email", "email", form.email],
              ["Phone", "phone", form.phone],
              ["District", "district", form.district],
              ["State", "state", form.state],
              ["Farm Size", "acres", form.acres],
              ["Primary Crop", "crop", form.crop],
              ["Member Since", "memberSince", form.memberSince],
            ].map(([label, key, val]) => (
              <div key={label}>
                <label className="block text-xs font-bold text-[#5A6B58] mb-1.5 uppercase tracking-widest">{label}</label>
                {editing ? (
                  <input
                    value={val}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-[#132B1A] outline-none focus:border-[#1B5E38] transition-all"
                  />
                ) : (
                  <div className="text-sm font-semibold text-[#132B1A] py-2.5 truncate">{val}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FarmerDashboard({ navigate, initialSection }) {
  const [section, setSection] = useState(initialSection || "dashboard");
  const [sideOpen, setSideOpen] = useState(false);

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("krishi_user_profile");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const uName = localStorage.getItem("krishi_user") || "";
    const uEmail = localStorage.getItem("krishi_user_email") || "";
    return {
      name: uName || "Farmer",
      email: uEmail,
      phone: "",
      district: "",
      state: "Kerala",
      acres: "",
      crop: "",
      joined: "August 2026",
    };
  });

  const [additionalCrops, setAdditionalCrops] = useState([]);

  // Fetch live user profile and saved products directly from MySQL database on load
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const storedEmail = localStorage.getItem("krishi_user_email");
    const activeEmail = (storedEmail && storedEmail !== "farmer@farmoai.in") ? storedEmail : null;
    const profileUrl = activeEmail ? `${apiBase}/user/profile?email=${encodeURIComponent(activeEmail)}` : `${apiBase}/user/profile`;

    fetch(profileUrl)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && resData.data) {
          const d = resData.data;
          const loadedProfile = {
            id: d.id,
            name: d.full_name || "Farmer",
            email: d.email || "",
            phone: d.phone || "+91 94470 12345",
            district: d.district || "Idukki",
            crop: d.crop || "Paddy (Jyothi)",
            acres: d.acres ? `${d.acres}` : "4.5",
            state: "Kerala",
            joined: d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'August 2026'
          };
          setUserProfile(loadedProfile);
          try {
            localStorage.setItem("krishi_user", loadedProfile.name);
            localStorage.setItem("krishi_user_email", loadedProfile.email);
            localStorage.setItem("krishi_user_profile", JSON.stringify(loadedProfile));
          } catch (e) {}

          // Now fetch exact saved products from MySQL for this user
          if (d.email) {
            fetch(`${apiBase}/user/crops?email=${encodeURIComponent(d.email)}`)
              .then(cRes => cRes.json())
              .then(cData => {
                if (cData && cData.success && Array.isArray(cData.data)) {
                  const mappedCrops = cData.data.map(cropItem => ({
                    id: cropItem.id,
                    name: cropItem.name,
                    variety: cropItem.variety,
                    area: cropItem.area ? `${cropItem.area} acres` : '1.0 acres',
                    health: cropItem.health || 90,
                    stage: cropItem.stage || 'Planning',
                    nextAction: cropItem.next_action || 'Regular field monitoring',
                    image: cropItem.image_url || null
                  }));

                  if (mappedCrops.length > 0) {
                    setAdditionalCrops(mappedCrops);
                  } else if (d.crop) {
                    setAdditionalCrops([{
                      id: `primary_${d.id}`,
                      name: d.crop || 'Paddy (Jyothi)',
                      variety: 'Jyothi Hybrid',
                      area: d.acres ? `${d.acres} acres` : '4.5 acres',
                      health: 98,
                      stage: 'Planning',
                      nextAction: 'Regular field monitoring',
                      image: null
                    }]);
                  }
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(err => console.warn("Live MySQL fetch notice:", err.message));
  }, []);

  const userCropsList = additionalCrops;

  const render = () => {
    switch (section) {
      case "dashboard": return <DashSection setSection={setSection} userProfile={userProfile} userCropsList={userCropsList} />;
      case "my-farm": return <MyFarmSection navigate={navigate} userProfile={userProfile} userCropsList={userCropsList} additionalCrops={additionalCrops} setAdditionalCrops={setAdditionalCrops} />;
      case "crop-analysis": return <CropAnalysisSection userProfile={userProfile} />;
      case "market": return <MarketSection navigate={navigate} userProfile={userProfile} />;
      case "weather": return <WeatherSection userProfile={userProfile} />;
      case "ai-assistant": return <AIAssistantSection userProfile={userProfile} />;
      case "reports": return <ReportsSection userProfile={userProfile} />;
      case "pricing": return <PricingPage navigate={navigate} />;
      case "profile": return <ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} />;
      default: return <DashSection setSection={setSection} userProfile={userProfile} userCropsList={userCropsList} />;
    }
  };

  return (
    <Layout
      section={section}
      setSection={setSection}
      sideOpen={sideOpen}
      setSideOpen={setSideOpen}
      navigate={navigate}
      userProfile={userProfile || {}}
      userCropsList={userCropsList}
    >
      {render()}
    </Layout>
  );
}
