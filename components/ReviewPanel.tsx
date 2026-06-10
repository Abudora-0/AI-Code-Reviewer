"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Copy, Check, Clock, Wand2 } from "lucide-react";
import ScoreRing from "./ScoreRing";
import IssueCard, { Issue } from "./IssueCard";

export interface ReviewResult {
  score: number;
  summary: string;
  issues: Issue[];
  positives: string[];
  refactoredCode: string;
}

interface Props {
  result: ReviewResult;
  reviewTime: number | null;
  onViewRefactored: () => void;
  showingRefactored: boolean;
}

export default function ReviewPanel({ result, reviewTime, onViewRefactored, showingRefactored }: Props) {
  const [copied, setCopied] = useState(false);

  const sorted = [...result.issues].sort(
    (a, b) =>
      ["critical", "warning", "info"].indexOf(a.severity) -
      ["critical", "warning", "info"].indexOf(b.severity)
  );

  const counts = {
    bug:         result.issues.filter(i => i.type === "bug").length,
    security:    result.issues.filter(i => i.type === "security").length,
    performance: result.issues.filter(i => i.type === "performance").length,
    style:       result.issues.filter(i => i.type === "style").length,
  };

  async function copyMarkdown() {
    const lines = [`# Code Review\n`, `**Quality Score:** ${result.score}/100\n`, `## Summary`, result.summary, ``];
    if (result.positives?.length) {
      lines.push(`## What's Good`);
      result.positives.forEach(p => lines.push(`- ✓ ${p}`));
      lines.push(``);
    }
    if (result.issues.length) {
      lines.push(`## Issues (${result.issues.length})`);
      result.issues.forEach(issue => {
        lines.push(``, `### ${issue.title}${issue.line ? ` (line ${issue.line})` : ""}`);
        lines.push(`**Severity:** ${issue.severity} · **Type:** ${issue.type}`);
        lines.push(``, issue.message, ``, `**Fix:** ${issue.suggestion}`);
      });
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="h-full flex flex-col gap-3 overflow-y-auto pr-1 animate-fade-in-up">

      {/* Score card */}
      <div className="rounded-2xl p-4 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #080f1e 0%, #0c1830 100%)",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 28px rgba(37,99,235,0.08)",
        }}>
        <div className="flex items-start gap-4">
          <ScoreRing score={result.score} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">Code Quality</h3>
              {reviewTime && (
                <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#6ee7b7" }}>
                  <Clock className="w-3 h-3" />{reviewTime.toFixed(1)}s
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{result.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {counts.bug > 0         && <Pill color="red"    label={`${counts.bug} bug${counts.bug > 1 ? "s" : ""}`} />}
              {counts.security > 0    && <Pill color="orange" label={`${counts.security} security`} />}
              {counts.performance > 0 && <Pill color="yellow" label={`${counts.performance} perf`} />}
              {counts.style > 0       && <Pill color="blue"   label={`${counts.style} style`} />}
              {result.issues.length === 0 && <Pill color="green" label="No issues found" />}
            </div>
          </div>
        </div>
      </div>

      {/* Positives */}
      {result.positives?.length > 0 && (
        <div className="rounded-2xl p-4 flex-shrink-0"
          style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5"
            style={{ color: "#34d399" }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> What&apos;s good
          </h3>
          <ul className="space-y-1.5">
            {result.positives.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {sorted.length > 0 && (
        <div className="flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 px-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Issues ({sorted.length})
          </h3>
          <div className="space-y-2">
            {sorted.map((issue, i) => (
              <IssueCard key={issue.id || i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex-shrink-0 flex flex-col gap-2 pb-2">
        {result.refactoredCode && (
          <button
            onClick={onViewRefactored}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={
              showingRefactored
                ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }
                : {
                    background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                  }
            }
          >
            <Wand2 className="w-3.5 h-3.5" />
            {showingRefactored ? "Back to original code" : "View AI-refactored code"}
          </button>
        )}
        <button
          onClick={copyMarkdown}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)" }}
        >
          {copied
            ? <><Check className="w-3.5 h-3.5 text-emerald-400" />Copied to clipboard</>
            : <><Copy className="w-3.5 h-3.5" />Copy review as Markdown</>}
        </button>
      </div>
    </div>
  );
}

const PILL_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  red:    { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.22)",  color: "#fca5a5" },
  orange: { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.22)", color: "#fdba74" },
  yellow: { bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.22)",  color: "#fde047" },
  blue:   { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.22)", color: "#93c5fd" },
  green:  { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.22)", color: "#6ee7b7" },
};

function Pill({ color, label }: { color: string; label: string }) {
  const s = PILL_STYLES[color];
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {label}
    </span>
  );
}
