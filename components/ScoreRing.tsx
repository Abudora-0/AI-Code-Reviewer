"use client";

import { useEffect, useState } from "react";

interface Props { score: number; }

function getVerdict(score: number) {
  if (score >= 80) return { color: "var(--ok)",           label: "PASS",     grade: score >= 90 ? "A" : "B" };
  if (score >= 60) return { color: "var(--sev-info)",     label: "REVIEW",   grade: "C" };
  if (score >= 40) return { color: "var(--sev-warning)",  label: "CAUTION",  grade: "D" };
  return              { color: "var(--sev-critical)", label: "REJECT",   grade: "F" };
}

const SEGMENTS = 20;

export default function ScoreRing({ score }: Props) {
  const [animated, setAnimated] = useState(0);
  const v = getVerdict(score);

  useEffect(() => {
    setAnimated(0);
    let cur = 0;
    const step = Math.max(score / 40, 1);
    const t = setInterval(() => {
      cur += step;
      if (cur >= score) { cur = score; clearInterval(t); }
      setAnimated(Math.round(cur));
    }, 16);
    return () => clearInterval(t);
  }, [score]);

  const lit = Math.round((animated / 100) * SEGMENTS);

  return (
    <div className="flex flex-col gap-2 flex-shrink-0 w-full">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span
            className="tabular-nums font-extrabold leading-none"
            style={{ fontSize: 44, color: v.color, textShadow: `0 0 18px ${v.color}` }}
          >
            {String(animated).padStart(3, "0")}
          </span>
          <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>/100</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="px-2 py-0.5 text-[11px] font-bold tracking-[0.2em]"
            style={{ border: `1px solid ${v.color}`, color: v.color }}
          >
            {v.label}
          </span>
          <span className="text-[10px] tracking-[0.15em]" style={{ color: "var(--ink-faint)" }}>
            GRADE {v.grade}
          </span>
        </div>
      </div>

      {/* segmented gauge */}
      <div className="flex gap-[3px] w-full">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="h-[10px] flex-1 transition-colors duration-75"
            style={
              i < lit
                ? { background: v.color, boxShadow: `0 0 5px ${v.color}` }
                : { background: "transparent", border: "1px solid var(--border-muted)" }
            }
          />
        ))}
      </div>
    </div>
  );
}
