import { useState } from "react";
import { CloudRain, Droplets, Thermometer, Wind, Bell } from "lucide-react";
const weatherData = [
    { day: "Mon", high: 31, low: 24, rain: 20, icon: "sun" },
    { day: "Tue", high: 29, low: 23, rain: 65, icon: "rain" },
    { day: "Wed", high: 27, low: 22, rain: 80, icon: "rain" },
    { day: "Thu", high: 30, low: 24, rain: 40, icon: "cloud" },
    { day: "Fri", high: 32, low: 25, rain: 15, icon: "sun" },
    { day: "Sat", high: 33, low: 26, rain: 10, icon: "sun" },
    { day: "Sun", high: 28, low: 23, rain: 55, icon: "cloud" },
];
export function WeatherIntelligence() {
    const [selectedDay, setSelectedDay] = useState(0);
    const weatherIcon = (type) => type === "sun" ? "☀️" : type === "rain" ? "🌧️" : "⛅";
    return (<section id="weather" className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-5 uppercase tracking-widest">
            <CloudRain className="w-3.5 h-3.5"/>
            Weather Intelligence
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
            Farmer-Specific Weather Forecasts
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Hyperlocal 7-day forecasts with harvest windows, spray advisories,
            and farming-specific insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7 mt-14">
          {/* 7-Day + Detail */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground">
                    7-Day Forecast
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Palakkad District, Kerala
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
                  Live · Updated 12 min ago
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weatherData.map((day, i) => (<button key={day.day} onClick={() => setSelectedDay(i)} className={`rounded-xl p-3 text-center transition-all ${selectedDay === i
                ? "bg-[#1B5E38] text-white shadow-lg shadow-green-900/20"
                : "bg-muted hover:bg-secondary text-foreground"}`}>
                    <div className="text-[10px] font-bold mb-2 uppercase tracking-widest">
                      {day.day}
                    </div>
                    <div className="text-xl mb-2">{weatherIcon(day.icon)}</div>
                    <div className="text-xs font-bold">{day.high}°</div>
                    <div className={`text-[10px] mt-0.5 ${selectedDay === i
                ? "text-white/65"
                : "text-muted-foreground"}`}>
                      {day.low}°
                    </div>
                  </button>))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 grid grid-cols-3 gap-5">
              {[
            {
                icon: Droplets,
                label: "Rain Probability",
                value: `${weatherData[selectedDay].rain}%`,
                color: "text-sky-600",
                bg: "bg-sky-50",
            },
            {
                icon: Thermometer,
                label: "High / Low",
                value: `${weatherData[selectedDay].high}° / ${weatherData[selectedDay].low}°`,
                color: "text-amber-600",
                bg: "bg-amber-50",
            },
            {
                icon: Wind,
                label: "Wind Speed",
                value: "14 km/h NE",
                color: "text-teal-600",
                bg: "bg-teal-50",
            },
        ].map(({ icon: Icon, label, value, color, bg }) => (<div key={label} className="text-center">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`}/>
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>))}
            </div>
          </div>

          {/* Alerts + Rainfall */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500"/>
                Farming Alerts
              </h3>
              <div className="space-y-3.5">
                {[
            {
                icon: "🌧️",
                title: "Heavy Rain Alert",
                desc: "Expected Tue & Wed. Delay fertilizer application by 3 days.",
                bg: "bg-amber-50 border-amber-200",
                titleColor: "text-amber-800",
            },
            {
                icon: "✅",
                title: "Harvest Window Open",
                desc: "Clear skies Fri–Sun. Ideal 3-day paddy harvest window.",
                bg: "bg-emerald-50 border-emerald-200",
                titleColor: "text-emerald-800",
            },
            {
                icon: "💧",
                title: "Skip Irrigation",
                desc: "Natural rain Thu–Fri will meet crop water needs. Save water.",
                bg: "bg-sky-50 border-sky-200",
                titleColor: "text-sky-800",
            },
        ].map(({ icon, title, desc, bg, titleColor }) => (<div key={title} className={`border ${bg} rounded-xl p-3.5`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{icon}</span>
                      <span className={`text-sm font-bold ${titleColor}`}>
                        {title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                      {desc}
                    </p>
                  </div>))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1B5E38] to-[#0F3D24] rounded-2xl p-6 text-white">
              <div className="text-sm font-semibold text-white/70 mb-1">
                This Week — Rainfall
              </div>
              <div className="text-4xl font-extrabold mb-1 font-[Plus_Jakarta_Sans]">
                68 mm
              </div>
              <div className="text-sm text-white/60 mb-5">
                Above average for Palakkad
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-[#4ADE80] rounded-full" style={{ width: "72%" }}/>
              </div>
              <div className="text-xs text-white/50 mt-2">
                72% of monthly target already received
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
