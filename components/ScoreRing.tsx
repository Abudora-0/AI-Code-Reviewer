"use client";

import { useEffect, useState } from "react";

interface Props { score: number; }

function getColor(score: number) {
  if (score >= 80) return { stroke: "#10b981", glow: "rgba(16,185,129,0.55)",  text: "#34d399", label: "Excellent", lBg: "rgba(16,185,129,0.1)",  lBorder: "rgba(16,185,129,0.28)", lText: "#6ee7b7" };
  if (score >= 60) return { stroke: "#3b82f6", glow: "rgba(59,130,246,0.55)",  text: "#60a5fa", label: "Good",      lBg: "rgba(59,130,246,0.1)",  lBorder: "rgba(59,130,246,0.28)", lText: "#93c5fd" };
  if (score >= 40) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.55)", text: "#fbbf24", label: "Fair",      lBg: "rgba(245,158,11,0.1)", lBorder: "rgba(245,158,11,0.28)", lText: "#fde047" };
  return              { stroke: "#ef4444", glow: "rgba(239,68,68,0.55)",  text: "#f87171", label: "Poor",      lBg: "rgba(239,68,68,0.1)",  lBorder: "rgba(239,68,68,0.28)",  lText: "#fca5a5" };
}

export default function ScoreRing({ score }: Props) {
  const [animated, setAnimated] = useState(0);
  const radius        = 38;
  const circumference = 2 * Math.PI * radius;
  const c             = getColor(score);

  useEffect(() => {
    setAnimated(0);
    let cur = 0;
    const step = score / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= score) { cur = score; clearInterval(t); }
      setAnimated(Math.round(cur));
    }, 16);
    return () => clearInterval(t);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.04s linear", filter: `drop-shadow(0 0 5px ${c.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums" style={{ color: c.text }}>{animated}</span>
          <span className="text-[10px] text-slate-600 font-medium">/ 100</span>
        </div>
      </div>
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
        style={{ background: c.lBg, border: `1px solid ${c.lBorder}`, color: c.lText }}>
        {c.label}
      </span>
    </div>
  );
}
