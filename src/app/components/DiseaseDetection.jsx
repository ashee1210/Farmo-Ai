import { useState } from "react";
import { Microscope, Camera, CheckCircle, Shield, AlertTriangle } from "lucide-react";
export function DiseaseDetection() {
    const [uploadState, setUploadState] = useState("idle");
    const simulateUpload = () => {
        if (uploadState !== "idle")
            return;
        setUploadState("scanning");
        setTimeout(() => setUploadState("done"), 3200);
    };
    return (<section id="disease-detection" className="py-28 bg-[#071A0C] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"/>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold mb-5 uppercase tracking-widest">
            <Microscope className="w-3.5 h-3.5"/>
            Plant Health AI
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Detect Plant Diseases Instantly
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Upload a photo of your plant — our AI identifies diseases in
            seconds across 200+ conditions, with complete treatment plans.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start mt-14">
          {/* Upload area */}
          <div onClick={simulateUpload} className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group ${uploadState === "idle"
            ? "border-white/15 hover:border-[#4ADE80]/40 hover:bg-white/2"
            : uploadState === "scanning"
                ? "border-amber-400/30 bg-amber-400/3"
                : "border-[#4ADE80]/40 bg-[#4ADE80]/3"}`}>
            {uploadState === "idle" && (<>
                <div className="w-20 h-20 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#4ADE80]/15 transition-colors">
                  <Camera className="w-10 h-10 text-white/35 group-hover:text-[#4ADE80] transition-colors"/>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  Upload Plant Photo
                </h3>
                <p className="text-white/40 text-sm mb-7 leading-relaxed">
                  Click to upload or drag & drop
                  <br />
                  Supports JPG, PNG · Max 10 MB
                </p>
                <button className="px-7 py-3 rounded-xl bg-[#1B5E38] text-white text-sm font-bold hover:bg-[#155030] transition-colors shadow-lg shadow-green-900/40">
                  Choose Plant Image
                </button>
              </>)}

            {uploadState === "scanning" && (<div className="py-6">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 animate-ping"/>
                  <div className="absolute inset-2 rounded-full border-4 border-amber-300/40 animate-spin"/>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Microscope className="w-10 h-10 text-amber-300"/>
                  </div>
                </div>
                <div className="text-white font-bold text-lg mb-2">
                  AI Scanning Image…
                </div>
                <div className="text-white/45 text-sm">
                  Checking against 200+ known plant diseases
                </div>
                <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="h-full bg-amber-400 rounded-full animate-pulse w-3/4"/>
                </div>
              </div>)}

            {uploadState === "done" && (<div className="py-6">
                <div className="w-20 h-20 rounded-2xl bg-[#4ADE80]/15 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-10 h-10 text-[#4ADE80]"/>
                </div>
                <div className="text-white font-bold text-xl mb-2">
                  Analysis Complete!
                </div>
                <div className="text-white/45 text-sm mb-5">
                  Disease identified — see results on the right
                </div>
                <button onClick={(e) => {
                e.stopPropagation();
                setUploadState("idle");
            }} className="text-xs text-white/35 hover:text-white/60 underline transition-colors">
                  Upload another image
                </button>
              </div>)}
          </div>

          {/* Detection results */}
          <div className="space-y-4">
            {uploadState !== "done" ? (<div className="bg-white/4 border border-white/10 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
                  <Shield className="w-7 h-7 text-white/25"/>
                </div>
                <div className="text-white/35 text-sm leading-relaxed">
                  Upload a plant photo to start AI disease detection.
                  <br />
                  Results and treatment plan will appear here.
                </div>
              </div>) : (<>
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-rose-400"/>
                    </div>
                    <div>
                      <div className="text-white font-bold">
                        Disease Detected
                      </div>
                      <div className="text-rose-400 text-sm font-semibold">
                        Rice Blast — Pyricularia oryzae
                      </div>
                    </div>
                    <span className="ml-auto text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-400/25 px-3 py-1 rounded-full">
                      96% Confident
                    </span>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">
                    Fungal disease affecting leaf, neck, and panicle. Most
                    severe during high humidity (&gt;90%) and temperatures of
                    24–28°C. Spreads rapidly in densely planted fields.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-white font-bold mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#4ADE80]/15 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]"/>
                    </div>
                    AI Treatment Plan
                  </h4>
                  <div className="space-y-4">
                    {[
                [
                    "Immediate",
                    "Apply Tricyclazole 75% WP @ 0.6 g/L water. Spray thoroughly on affected areas.",
                    "bg-rose-500/15 text-rose-300 border-rose-500/20",
                ],
                [
                    "Day 3",
                    "Remove and destroy all visibly infected plant parts. Do not compost.",
                    "bg-amber-500/15 text-amber-300 border-amber-500/20",
                ],
                [
                    "Day 7",
                    "Follow-up spray with Propiconazole 25 EC @ 1 ml/L water for full control.",
                    "bg-sky-500/15 text-sky-300 border-sky-500/20",
                ],
                [
                    "Ongoing",
                    "Improve field drainage. Maintain 5 cm water depth. Reduce plant density next season.",
                    "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20",
                ],
            ].map(([day, action, cls]) => (<div key={String(day)} className="flex gap-3 items-start">
                        <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg flex-shrink-0 ${cls}`}>
                          {day}
                        </span>
                        <span className="text-white/60 text-sm leading-relaxed">
                          {action}
                        </span>
                      </div>))}
                  </div>
                </div>
              </>)}
          </div>
        </div>
      </div>
    </section>);
}
