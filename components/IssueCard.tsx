"use client";

import { useState } from "react";
import { Bug, ShieldAlert, Zap, Paintbrush, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface Issue {
  id: string;
  type: "bug" | "security" | "performance" | "style";
  severity: "critical" | "warning" | "info";
  line: number | null;
  title: string;
  message: string;
  suggestion: string;
}

const TYPE_CFG = {
  bug:         { icon: Bug,        label: "Bug",         color: "#f87171", bg: "rgba(239,68,68,0.06)",  border: "rgba(239,68,68,0.2)",  tagBg: "rgba(239,68,68,0.1)"  },
  security:    { icon: ShieldAlert, label: "Security",   color: "#fb923c", bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.2)", tagBg: "rgba(249,115,22,0.1)" },
  performance: { icon: Zap,        label: "Performance", color: "#fbbf24", bg: "rgba(234,179,8,0.06)",  border: "rgba(234,179,8,0.2)",  tagBg: "rgba(234,179,8,0.1)"  },
  style:       { icon: Paintbrush, label: "Style",       color: "#60a5fa", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.2)", tagBg: "rgba(59,130,246,0.1)" },
};

const SEV_CFG = {
  critical: { icon: AlertCircle,  color: "#f87171", dot: "#ef4444", label: "Critical", glow: "0 0 5px rgba(239,68,68,0.5)" },
  warning:  { icon: AlertTriangle, color: "#fbbf24", dot: "#f59e0b", label: "Warning",  glow: "0 0 5px rgba(245,158,11,0.5)" },
  info:     { icon: Info,          color: "#60a5fa", dot: "#3b82f6", label: "Info",     glow: "0 0 5px rgba(59,130,246,0.5)" },
};

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const t = TYPE_CFG[issue.type]     ?? TYPE_CFG.bug;
  const s = SEV_CFG[issue.severity]  ?? SEV_CFG.info;
  const TypeIcon     = t.icon;
  const SeverityIcon = s.icon;

  return (
    <div
      className="rounded-xl overflow-hidden animate-slide-in"
      style={{ background: t.bg, border: `1px solid ${t.border}`, animationDelay: `${index * 55}ms`, animationFillMode: "both" }}
    >
      {/* Header row */}
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/[0.025] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <TypeIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: t.color }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: t.color }}>{issue.title}</span>
            {issue.line && (
              <span className="text-[11px] px-1.5 py-0.5 rounded font-mono text-slate-500"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                line {issue.line}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: s.color }}>
              <SeverityIcon className="w-3 h-3" />
              {s.label}
            </span>
            <span className="text-slate-700 text-xs">·</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ color: t.color, background: t.tagBg }}>
              {t.label}
            </span>
          </div>
        </div>

        <div className="text-slate-600 flex-shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-sm text-slate-300 leading-relaxed">{issue.message}</p>
          <div className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: t.color, opacity: 0.65 }}>
              Suggested fix
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{issue.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
