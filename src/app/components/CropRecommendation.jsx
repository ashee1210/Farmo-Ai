import { useState } from "react";
import { Sprout, Zap, CheckCircle } from "lucide-react";
const cropResults = [
    {
        name: "Paddy (Jyothi Variety)",
        period: "120–140 days",
        profit: "₹45,000/acre",
        match: 96,
        image: "https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?w=300&h=180&fit=crop&auto=format",
        tag: "Best Match",
        tagColor: "bg-green-100 text-green-800",
    },
    {
        name: "Coconut (West Coast Tall)",
        period: "5–6 years",
        profit: "₹1,20,000/acre",
        match: 88,
        image: "https://images.unsplash.com/photo-1527160666479-3131d2b7042d?w=300&h=180&fit=crop&auto=format",
        tag: "High Profit",
        tagColor: "bg-amber-100 text-amber-800",
    },
    {
        name: "Banana (Nendran)",
        period: "10–12 months",
        profit: "₹60,000/acre",
        match: 82,
        image: "https://images.unsplash.com/photo-1609554259885-d5a52e01e83d?w=300&h=180&fit=crop&auto=format",
        tag: "Quick Return",
        tagColor: "bg-sky-100 text-sky-800",
    },
];
export function CropRecommendation() {
    const [cropForm, setCropForm] = useState({
        location: "Palakkad",
        soil: "Clay Loam",
        season: "Kharif (Jun–Nov)",
        water: "High",
    });
    const [showCrops, setShowCrops] = useState(true);
    return (<section id="crop-recommendation" className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-5 uppercase tracking-widest">
            <Sprout className="w-3 h-3"/>
            Crop Intelligence
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
            Find the Perfect Crop for Your Land
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            AI analyses your soil, local climate, and market demand to
            recommend the most profitable crops for your specific plot.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start mt-14">
          {/* Form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-7 shadow-md shadow-green-900/4">
            <h3 className="font-bold text-foreground text-lg mb-6 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1B5E38]/10 flex items-center justify-center">
                <Sprout className="w-3.5 h-3.5 text-[#1B5E38]"/>
              </div>
              Enter Farm Details
            </h3>
            <div className="space-y-5">
              {[
            {
                label: "District / Location",
                key: "location",
                opts: [
                    "Palakkad",
                    "Thrissur",
                    "Wayanad",
                    "Kozhikode",
                    "Malappuram",
                    "Ernakulam",
                    "Alappuzha",
                    "Kottayam",
                ],
            },
            {
                label: "Soil Type",
                key: "soil",
                opts: [
                    "Clay Loam",
                    "Sandy Loam",
                    "Laterite",
                    "Alluvial",
                    "Black Cotton",
                    "Red Loam",
                ],
            },
            {
                label: "Farming Season",
                key: "season",
                opts: [
                    "Kharif (Jun–Nov)",
                    "Rabi (Nov–Apr)",
                    "Zaid (Mar–Jun)",
                ],
            },
            {
                label: "Water Availability",
                key: "water",
                opts: ["High", "Medium", "Low", "Rainfed Only"],
            },
        ].map(({ label, key, opts }) => (<div key={key}>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    {label}
                  </label>
                  <select className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#1B5E38] transition-colors appearance-none cursor-pointer" value={cropForm[key]} onChange={(e) => setCropForm((f) => ({ ...f, [key]: e.target.value }))}>
                    {opts.map((o) => (<option key={o}>{o}</option>))}
                  </select>
                </div>))}
              <button onClick={() => setShowCrops(true)} className="w-full py-3.5 rounded-xl bg-[#1B5E38] text-white font-bold text-sm hover:bg-[#155030] transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4"/>
                Get AI Recommendations
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {showCrops && (<>
                <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0"/>
                  <span className="text-sm font-semibold text-emerald-800">
                    AI found 3 ideal crops for{" "}
                    <strong>{cropForm.location}</strong> — {cropForm.soil} soil
                    in {cropForm.season}
                  </span>
                </div>
                {cropResults.map((crop, i) => (<div key={crop.name} className="bg-card border border-border rounded-2xl p-5 flex gap-5 hover:shadow-xl hover:shadow-green-900/6 hover:-translate-y-0.5 transition-all">
                    <div className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-green-100">
                      <img src={crop.image} alt={crop.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-bold text-foreground text-base">
                            {crop.name}
                          </h4>
                          <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${crop.tagColor}`}>
                            {crop.tag}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-extrabold text-[#1B5E38] font-[Plus_Jakarta_Sans]">
                            {crop.match}%
                          </div>
                          <div className="text-xs text-muted-foreground">Match</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          ⏱ <span>{crop.period}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          💰 <span className="font-semibold text-foreground">{crop.profit}</span>
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1B5E38] to-[#4ADE80] transition-all" style={{ width: `${crop.match}%` }}/>
                      </div>
                    </div>
                  </div>))}
              </>)}
          </div>
        </div>
      </div>
    </section>);
}
