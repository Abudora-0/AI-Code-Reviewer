"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface Issue {
  id: string;
  type: "bug" | "security" | "performance" | "style";
  severity: "critical" | "warning" | "info";
  line: number | null;
  title: string;
  message: string;
  suggestion: string;
}

const TYPE_LABEL: Record<Issue["type"], string> = {
  bug:         "BUG",
  security:    "SEC",
  performance: "PERF",
  style:       "STYLE",
};

const SEV_CFG: Record<Issue["severity"], { color: string; code: string; label: string }> = {
  critical: { color: "var(--sev-critical)", code: "E", label: "CRITICAL" },
  warning:  { color: "var(--sev-warning)",  code: "W", label: "WARNING" },
  info:     { color: "var(--sev-info)",     code: "I", label: "INFO" },
};

/* diagnostics styled like compiler output: E01 · SEC · L42 — title */
export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const s = SEV_CFG[issue.severity] ?? SEV_CFG.info;
  const code = `${s.code}${String(index + 1).padStart(2, "0")}`;

  return (
    <div
      className="animate-slide-in"
      style={{
        background: "var(--bg-panel)",
        borderTop: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        borderLeft: `2px solid ${s.color}`,
        animationDelay: `${index * 55}ms`,
        animationFillMode: "both",
      }}
    >
      <button
        className="w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span
          className="text-[11px] font-bold tabular-nums flex-shrink-0 mt-px"
          style={{ color: s.color }}
        >
          {code}
        </span>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium leading-snug" style={{ color: "var(--ink)" }}>
            {issue.title}
          </div>
          <div className="flex items-center gap-2 mt-1 text-[10px] tracking-[0.12em]">
            <span style={{ color: s.color }}>{s.label}</span>
            <span style={{ color: "var(--ink-faint)" }}>·</span>
            <span style={{ color: "var(--ink-muted)" }}>{TYPE_LABEL[issue.type] ?? "BUG"}</span>
            {issue.line && (
              <>
                <span style={{ color: "var(--ink-faint)" }}>·</span>
                <span className="tabular-nums" style={{ color: "var(--ink-muted)" }}>L{issue.line}</span>
              </>
            )}
          </div>
        </div>

        <span className="flex-shrink-0 mt-0.5" style={{ color: "var(--ink-faint)" }}>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-2.5 space-y-2.5" style={{ borderTop: "1px dashed var(--border-muted)" }}>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            {issue.message}
          </p>
          <div className="p-2.5" style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
            <p className="text-[9px] font-bold tracking-[0.22em] mb-1.5" style={{ color: s.color }}>
              ── SUGGESTED FIX
            </p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink)" }}>
              {issue.suggestion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
