"use client";

import { useState } from "react";
import { Bug, Shield, Zap, Paintbrush, ChevronDown, ChevronUp } from "lucide-react";

export interface Issue {
  id: string;
  type: "bug" | "security" | "performance" | "style";
  severity: "critical" | "warning" | "info";
  line: number | null;
  title: string;
  message: string;
  suggestion: string;
}

const TYPE_CONFIG = {
  bug:         { icon: Bug,        color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    label: "Bug" },
  security:    { icon: Shield,     color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Security" },
  performance: { icon: Zap,        color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Performance" },
  style:       { icon: Paintbrush, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   label: "Style" },
};

const SEVERITY_CONFIG = {
  critical: { dot: "bg-red-500",    text: "text-red-400",    label: "Critical" },
  warning:  { dot: "bg-amber-500",  text: "text-amber-400",  label: "Warning" },
  info:     { dot: "bg-blue-500",   text: "text-blue-400",   label: "Info" },
};

interface Props {
  issue: Issue;
  index: number;
}

export default function IssueCard({ issue, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const t = TYPE_CONFIG[issue.type] || TYPE_CONFIG.bug;
  const s = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.info;
  const Icon = t.icon;

  return (
    <div
      className={`rounded-xl border ${t.border} ${t.bg} animate-slide-in overflow-hidden`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`mt-0.5 flex-shrink-0 ${t.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${t.color}`}>{issue.title}</span>
            {issue.line && (
              <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-gray-500 font-mono">
                line {issue.line}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex items-center gap-1 text-xs font-medium ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <span className="text-xs text-gray-600">·</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${t.color} bg-white/5`}>{t.label}</span>
          </div>
        </div>
        <div className="text-gray-600 flex-shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          <p className="text-sm text-gray-300 leading-relaxed">{issue.message}</p>
          <div className="bg-[#0d1117] rounded-lg p-3 border border-[#30363d]">
            <p className="text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">Suggestion</p>
            <p className="text-sm text-gray-300 leading-relaxed">{issue.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
