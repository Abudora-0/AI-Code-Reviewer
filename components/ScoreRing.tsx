"use client";

import { useEffect, useState } from "react";

interface Props { score: number; }

function getColor(score: number) {
  if (score >= 80) return { stroke: "#22c55e", textClass: "text-green-400", label: "Excellent", labelBg: "bg-green-500/10 text-green-400" };
  if (score >= 60) return { stroke: "#3b82f6", textClass: "text-blue-400",  label: "Good",      labelBg: "bg-blue-500/10 text-blue-400" };
  if (score >= 40) return { stroke: "#f59e0b", textClass: "text-amber-400", label: "Fair",      labelBg: "bg-amber-500/10 text-amber-400" };
  return              { stroke: "#ef4444", textClass: "text-red-400",   label: "Poor",      labelBg: "bg-red-500/10 text-red-400" };
}

export default function ScoreRing({ score }: Props) {
  const [animated, setAnimated] = useState(0);
  const radius       = 38;
  const circumference = 2 * Math.PI * radius;
  const color        = getColor(score);

  useEffect(() => {
    setAnimated(0);
    let current = 0;
    const step  = score / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) { current = score; clearInterval(timer); }
      setAnimated(Math.round(current));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#21262d" strokeWidth="7" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 0.04s linear",
              filter: `drop-shadow(0 0 5px ${color.stroke}50)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold tabular-nums ${color.textClass}`}>{animated}</span>
          <span className="text-[10px] text-gray-600 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${color.labelBg}`}>
        {color.label}
      </span>
    </div>
  );
}
