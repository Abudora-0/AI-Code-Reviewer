"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
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

  const tally = [
    { label: "BUG",   n: counts.bug },
    { label: "SEC",   n: counts.security },
    { label: "PERF",  n: counts.performance },
    { label: "STYLE", n: counts.style },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in-up panel">

      {/* panel titlebar */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-muted)", background: "var(--bg-elevated)" }}
      >
        <span className="panel-title">▌ Audit Report</span>
        {reviewTime && (
          <span className="text-[10px] tabular-nums tracking-[0.12em]" style={{ color: "var(--ink-faint)" }}>
            T+{reviewTime.toFixed(1)}s
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">

        {/* score gauge */}
        <ScoreRing score={result.score} />

        {/* issue tally strip */}
        <div className="grid grid-cols-4" style={{ border: "1px solid var(--border-muted)" }}>
          {tally.map((t, i) => (
            <div
              key={t.label}
              className="flex flex-col items-center py-2 gap-0.5"
              style={i > 0 ? { borderLeft: "1px solid var(--border-muted)" } : undefined}
            >
              <span
                className="text-lg font-bold tabular-nums leading-none"
                style={{ color: t.n > 0 ? "var(--ink)" : "var(--ink-faint)" }}
              >
                {t.n}
              </span>
              <span className="text-[9px] tracking-[0.2em]" style={{ color: "var(--ink-faint)" }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* summary */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.22em] mb-1.5" style={{ color: "var(--ink-faint)" }}>
            ── SUMMARY
          </p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            {result.summary}
          </p>
        </div>

        {/* positives */}
        {result.positives?.length > 0 && (
          <div>
            <p className="text-[9px] font-bold tracking-[0.22em] mb-1.5" style={{ color: "var(--ok)" }}>
              ── PASSED CHECKS
            </p>
            <ul className="space-y-1">
              {result.positives.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  <span className="flex-shrink-0 font-bold" style={{ color: "var(--ok)" }}>+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* diagnostics */}
        {sorted.length > 0 && (
          <div>
            <p className="text-[9px] font-bold tracking-[0.22em] mb-2" style={{ color: "var(--sev-warning)" }}>
              ── DIAGNOSTICS ({sorted.length})
            </p>
            <div className="space-y-1.5">
              {sorted.map((issue, i) => (
                <IssueCard key={issue.id || i} issue={issue} index={i} />
              ))}
            </div>
          </div>
        )}

        {sorted.length === 0 && (
          <div className="py-4 text-center text-[12px]" style={{ color: "var(--ok)" }}>
            ✓ 0 DIAGNOSTICS — CLEAN PASS
          </div>
        )}
      </div>

      {/* actions footer */}
      <div className="flex-shrink-0 p-3 flex flex-col gap-2" style={{ borderTop: "1px solid var(--border-muted)" }}>
        {result.refactoredCode && (
          <button
            onClick={onViewRefactored}
            className={`tbtn justify-center w-full py-2.5 ${showingRefactored ? "" : "tbtn-primary"}`}
          >
            {showingRefactored ? "◂ Restore original source" : "▸ Load refactored source"}
          </button>
        )}
        <button onClick={copyMarkdown} className="tbtn justify-center w-full py-2.5">
          {copied
            ? <><Check className="w-3.5 h-3.5" style={{ color: "var(--ok)" }} />Copied to clipboard</>
            : <><Copy className="w-3.5 h-3.5" />Export report · Markdown</>}
        </button>
      </div>
    </div>
  );
}
