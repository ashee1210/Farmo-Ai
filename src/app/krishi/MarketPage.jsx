import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, MapPin, TrendingUp, BarChart2, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { KrishiNavbar } from "./Navbar.jsx";
import { KrishiFooter } from "./Footer.jsx";
import { AnimatedBackground } from "./AnimatedBackground.jsx";
import { marketCrops, demandPie } from "./data.js";

function CropDetail({ id, navigate, from }) {
  const c = marketCrops.find(x => x.id === id);
  if (!c) return null;

  const REC_STYLE = {
    "sell-now": "bg-emerald-500",
    "wait": "bg-amber-500",
    "increase-production": "bg-sky-500",
    "hold": "bg-violet-500",
  };
  const REC_LABEL = { "sell-now": "💰 Sell Now", "wait": "⏳ Wait for Better Price", "increase-production": "📈 Increase Production", "hold": "🤝 Hold Stock" };

  return (
    <div className="min-h-screen bg-white">
      <KrishiNavbar navigate={navigate} currentPage={from === "home" ? "home" : "market"} />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <button onClick={() => navigate(from === "home" ? "home" : "market")} className="flex items-center gap-2 text-sm font-semibold text-[#5A6B58] hover:text-[#1B5E38] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {from === "home" ? "Back to Home" : "Back to Market Insight"}
        </button>

        <div className="bg-[#071A0C] rounded-3xl overflow-hidden mb-8">
          <img src={c.image} alt={c.name} className="w-full h-48 object-cover opacity-25" />
          <div className="px-8 pb-8 -mt-16 relative flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="text-5xl">{c.emoji}</span>
              <h1 className="text-3xl font-extrabold text-white mt-2 font-[Plus_Jakarta_Sans]">{c.fullName}</h1>
              <span className="text-white/50 text-sm">{c.category}</span>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-white font-[Plus_Jakarta_Sans]">{c.currentPrice}</div>
              <div className={`flex items-center gap-1 justify-end mt-2 text-sm font-bold ${c.up ? "text-[#4ADE80]" : "text-rose-400"}`}>
                {c.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {c.change} from {c.prevPrice}
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className={`${REC_STYLE[c.aiRec]} rounded-2xl p-5 mb-6 flex items-center gap-4`}>
          <span className="text-3xl">{REC_LABEL[c.aiRec].split(" ")[0]}</span>
          <div>
            <div className="text-white font-extrabold text-lg">{REC_LABEL[c.aiRec].slice(2)}</div>
            <div className="text-white/80 text-sm">{c.aiRecText}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-6">
              <h3 className="font-bold text-[#132B1A] mb-5 font-[Plus_Jakarta_Sans]">7-Month Price History</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={c.priceHistory} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v) => [`₹${v}`, "Price"]} />
                  <Line type="monotone" dataKey="price" stroke="#1B5E38" strokeWidth={2.5} dot={{ fill: "#1B5E38", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[["Current Price", c.currentPrice, "text-[#132B1A]"], ["Previous Price", c.prevPrice, "text-[#5A6B58]"], ["30-Day Prediction", c.prediction, "text-violet-600 font-extrabold"], ["Demand Level", c.demand, c.demand === "High" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"], ["Supply Level", c.supply, "text-[#5A6B58]"], ["Category", c.category, "text-[#5A6B58]"]].map(([l, v, cls]) => (
                <div key={l} className="bg-white border border-border rounded-2xl p-4">
                  <div className="text-xs text-[#5A6B58] uppercase tracking-widest font-bold mb-1">{l}</div>
                  <div className={`text-lg font-bold font-[Plus_Jakarta_Sans] ${cls}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="font-bold text-[#132B1A] mb-4 text-sm uppercase tracking-widest">Best Selling Locations</h3>
              {c.bestLocations.map((loc, i) => (
                <div key={loc} className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
                  <div className="w-6 h-6 rounded-lg bg-[#1B5E38]/10 flex items-center justify-center text-xs font-bold text-[#1B5E38]">{i + 1}</div>
                  <div className="flex items-center gap-1 text-sm text-[#132B1A]"><MapPin className="w-3 h-3 text-[#1B5E38]" />{loc}</div>
                  {i === 0 && <span className="ml-auto text-[10px] font-bold text-[#1B5E38] bg-emerald-50 px-2 py-0.5 rounded-full">Best Rate</span>}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("login")} className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20">
              Get Full Market Analysis →
            </button>
            <div className="bg-[#F6F4EE] border border-border rounded-2xl p-5">
              <h4 className="font-bold text-[#132B1A] text-sm mb-3">Other Crops</h4>
              {marketCrops.filter(x => x.id !== id).slice(0, 4).map(x => (
                <button key={x.id} onClick={() => navigate("crop-detail", { cropId: x.id, id: x.id })} className="w-full flex items-center justify-between py-2.5 border-b border-border last:border-0 hover:text-[#1B5E38] transition-colors">
                  <span className="text-sm text-[#132B1A] font-medium">{x.emoji} {x.name}</span>
                  <div className={`text-xs font-bold flex items-center gap-0.5 ${x.up ? "text-emerald-600" : "text-rose-600"}`}>
                    {x.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{x.change}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}

export function MarketPage({ navigate, cropId, from }) {
  const [selected, setSelected] = useState(cropId || null);

  useEffect(() => {
    setSelected(cropId || null);
  }, [cropId]);

  if (selected) return <CropDetail id={selected} navigate={navigate} from={from} />;

  const OVERVIEW = [
    { label: "Avg. Market Price", value: "₹2,442", change: "+3.8%", up: true, icon: TrendingUp, bg: "bg-emerald-50", col: "text-[#1B5E38]" },
    { label: "Highest Demand", value: "Rice & Corn", change: "3 crops rising", up: true, icon: ArrowUp, bg: "bg-sky-50", col: "text-sky-600" },
    { label: "Best Performer", value: "Cotton", change: "+4.9% this week", up: true, icon: BarChart2, bg: "bg-amber-50", col: "text-amber-600" },
    { label: "AI Prediction", value: "Bullish", change: "4 of 5 crops", up: true, icon: Zap, bg: "bg-violet-50", col: "text-violet-600" },
  ];

  const trendData = marketCrops.map(c => ({ month: "Jul", crop: c.name, price: parseInt(c.currentPrice.replace(/[^0-9]/g, "")) }));

  return (
    <div className="min-h-screen bg-white">
      <KrishiNavbar navigate={navigate} currentPage="market" />
      <div className="relative bg-[#071A0C] pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/8 blur-[80px]" />
        <AnimatedBackground variant="dark" density="low" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] text-xs font-bold mb-5 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> Live Market Data
          </div>
          <h1 className="text-5xl font-extrabold text-white font-[Plus_Jakarta_Sans] mb-4">AI Market Intelligence</h1>
          <p className="text-white/60 text-lg">Real-time crop prices, demand analysis and AI-powered 30-day price predictions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 space-y-10">
        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OVERVIEW.map(({ label, value, change, up, icon: Icon, bg, col }) => (
            <div key={label} className="bg-white border border-[#1B5E38]/10 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${col}`} /></div>
              <div className="text-xl font-extrabold text-[#132B1A] font-[Plus_Jakarta_Sans]">{value}</div>
              <div className="text-sm text-[#5A6B58] mt-0.5">{label}</div>
              <div className={`text-xs font-semibold mt-1.5 ${up ? "text-emerald-600" : "text-rose-600"}`}>{change}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#1B5E38]/10 rounded-2xl p-6">
            <h3 className="font-bold text-[#132B1A] mb-1 font-[Plus_Jakarta_Sans]">Crop Price Trends</h3>
            <p className="text-sm text-[#5A6B58] mb-5">7-month price history (₹/quintal)</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={marketCrops[0].priceHistory.map((p, i) => ({
                month: p.month,
                Rice: marketCrops[0].priceHistory[i]?.price,
                Wheat: marketCrops[1].priceHistory[i]?.price,
                Corn: marketCrops[2].priceHistory[i]?.price,
              }))} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Line type="monotone" dataKey="Rice" stroke="#1B5E38" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Wheat" stroke="#0EA5E9" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Corn" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-6">
            <h3 className="font-bold text-[#132B1A] mb-1 font-[Plus_Jakarta_Sans]">Demand Analysis</h3>
            <p className="text-sm text-[#5A6B58] mb-3">Market share by crop type</p>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={demandPie} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">
                  {demandPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {demandPie.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-[#5A6B58] flex-1">{d.name}</span>
                  <span className="text-xs font-bold text-[#132B1A]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction chart */}
        <div className="bg-white border border-[#1B5E38]/10 rounded-2xl p-6">
          <h3 className="font-bold text-[#132B1A] mb-1 font-[Plus_Jakarta_Sans]">30-Day Price Prediction</h3>
          <p className="text-sm text-[#5A6B58] mb-5">AI-forecasted prices for all crops (₹)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { crop: "Rice", current: 2180, predicted: 2280 },
              { crop: "Wheat", current: 1950, predicted: 1880 },
              { crop: "Corn", current: 1680, predicted: 1820 },
              { crop: "Cotton", current: 6400, predicted: 6900 },
            ]} barSize={28} margin={{ top: 0, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE4" vertical={false} />
              <XAxis dataKey="crop" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v) => [`₹${v}`, ""]} />
              <Bar dataKey="current" fill="#1B5E38" radius={[4, 4, 0, 0]} name="Current" />
              <Bar dataKey="predicted" fill="#4ADE80" radius={[4, 4, 0, 0]} name="30-Day Prediction" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
      <KrishiFooter navigate={navigate} />
    </div>
  );
}
