import { Activity, Sun, TestTubes, Bell, BarChart2, } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
const productivityData = [
    { month: "Jan", yield: 42, income: 38 },
    { month: "Feb", yield: 38, income: 35 },
    { month: "Mar", yield: 55, income: 48 },
    { month: "Apr", yield: 67, income: 60 },
    { month: "May", yield: 72, income: 65 },
    { month: "Jun", yield: 85, income: 78 },
    { month: "Jul", yield: 91, income: 88 },
];
const soilData = [
    { nutrient: "Nitrogen", value: 72 },
    { nutrient: "Phosphorus", value: 58 },
    { nutrient: "Potassium", value: 83 },
    { nutrient: "pH Level", value: 67 },
    { nutrient: "Org. Matter", value: 45 },
];
export function FarmerDashboard() {
    return (<section id="dashboard" className="py-28 bg-[#F0EDE4]/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B5E38]/10 text-[#1B5E38] text-xs font-bold mb-5 uppercase tracking-widest">
            <BarChart2 className="w-3 h-3"/>
            Smart Dashboard
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
            Your Farm at a Glance
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Real-time monitoring across all your fields, crops, and activities
            — in one clean dashboard.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
                label: "Crop Health",
                value: "94%",
                sub: "+2.3% this week",
                icon: Activity,
                bg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                subColor: "text-emerald-600",
            },
            {
                label: "Today's Weather",
                value: "31°C",
                sub: "Sunny · Palakkad",
                icon: Sun,
                bg: "bg-amber-50",
                iconColor: "text-amber-600",
                subColor: "text-amber-600",
            },
            {
                label: "Soil Quality",
                value: "Good",
                sub: "pH 6.8 · Optimal",
                icon: TestTubes,
                bg: "bg-violet-50",
                iconColor: "text-violet-600",
                subColor: "text-violet-600",
            },
            {
                label: "Active Alerts",
                value: "3",
                sub: "2 weather · 1 pest",
                icon: Bell,
                bg: "bg-rose-50",
                iconColor: "text-rose-600",
                subColor: "text-rose-600",
            },
        ].map(({ label, value, sub, icon: Icon, bg, iconColor, subColor }) => (<div key={label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-green-900/6 transition-all">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`}/>
              </div>
              <div className="text-2xl font-extrabold text-foreground font-[Plus_Jakarta_Sans]">
                {value}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
              <div className={`text-xs font-semibold mt-1.5 ${subColor}`}>{sub}</div>
            </div>))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-foreground">
                  Productivity Analytics
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Yield (quintals) & Income (₹000) — 2024
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                +18% vs last year
              </span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={productivityData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="yieldG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5E38" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#1B5E38" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="incomeG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{
            borderRadius: "14px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            fontSize: 12,
        }}/>
                <Area type="monotone" dataKey="yield" stroke="#1B5E38" fill="url(#yieldG)" strokeWidth={2.5} name="Yield (qtl)" dot={false}/>
                <Area type="monotone" dataKey="income" stroke="#0EA5E9" fill="url(#incomeG)" strokeWidth={2.5} name="Income (₹000)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-1">
              Soil Nutrient Profile
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Last tested: 3 days ago · Field A
            </p>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={soilData} layout="vertical" barSize={9} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]}/>
                <YAxis dataKey="nutrient" type="category" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={72}/>
                <Tooltip contentStyle={{
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            fontSize: 12,
        }} formatter={(v) => [`${v}%`, "Level"]}/>
                <Bar dataKey="value" fill="#1B5E38" radius={[0, 6, 6, 0]} name="Level %"/>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground">Overall</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  Good
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground">Needs</div>
                <div className="text-sm font-bold text-amber-700 mt-0.5">
                  +Phosphorus
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
