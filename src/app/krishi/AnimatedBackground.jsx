const LEAF_PATH =
  "M12 2C7 2 3 6 3 12c0 6 4 9 9 10 5-1 9-4 9-10 0-6-4-10-9-10z";

export function AnimatedBackground({ variant = "dark", density = "medium", className = "" }) {
  const leafCount = density === "low" ? 5 : density === "high" ? 12 : 8;
  const leafColor = variant === "dark" ? "rgba(74, 222, 128, 0.18)" : "rgba(27, 94, 56, 0.10)";
  const orbA = variant === "dark" ? "bg-emerald-400/10" : "bg-emerald-300/25";
  const orbB = variant === "dark" ? "bg-cyan-400/8" : "bg-sky-300/20";
  const orbC = variant === "dark" ? "bg-amber-300/6" : "bg-amber-200/20";

  const leaves = Array.from({ length: leafCount }).map((_, i) => {
    const size = 14 + ((i * 7) % 22);
    const left = (i * 97) % 100;
    const delay = (i * 1.7) % 9;
    const duration = 8 + (i % 5) * 2.4;
    const slow = i % 2 === 0;
    return (
      <svg
        key={i}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: `${left}%`,
          top: `${(i * 53) % 90}%`,
          width: size,
          height: size,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity: 0.9,
        }}
        className={slow ? "krishi-anim-float-slow" : "krishi-anim-float"}
        fill={leafColor}
      >
        <path d={LEAF_PATH} />
      </svg>
    );
  });

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Glowing gradient orbs — the ambient "premium" glow */}
      <div className={`absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full blur-[110px] ${orbA} krishi-anim-blob`} />
      <div className={`absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full blur-[120px] ${orbB} krishi-anim-blob`} style={{ animationDelay: "-5s" }} />
      <div className={`absolute -bottom-24 left-1/3 w-[360px] h-[360px] rounded-full blur-[100px] ${orbC} krishi-anim-blob`} style={{ animationDelay: "-10s" }} />

      {/* Drifting leaf particles */}
      {leaves}

      {/* Faint moving light sweep across the top */}
      <div
        className="absolute top-0 left-0 w-40 h-full opacity-[0.06] krishi-anim-drift"
        style={{
          background: "linear-gradient(100deg, transparent, white, transparent)",
          animationDuration: "11s",
        }}
      />
    </div>
  );
}
