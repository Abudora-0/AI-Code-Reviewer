"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Copy, Check, Clock } from "lucide-react";
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
    const lines = [
      `# Code Review`,
      ``,
      `**Quality Score:** ${result.score}/100`,
      ``,
      `## Summary`,
      result.summary,
      ``,
    ];

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
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 flex-shrink-0">
        <div className="flex items-start gap-4">
          <ScoreRing score={result.score} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm font-semibold text-white">Code Quality</h3>
              {reviewTime && (
                <span className="flex items-center gap-1 text-[11px] text-gray-600">
                  <Clock className="w-3 h-3" />{reviewTime.toFixed(1)}s
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{result.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {counts.bug > 0        && <Badge color="red"    label={`🐛 ${counts.bug} bug${counts.bug > 1 ? "s" : ""}`} />}
              {counts.security > 0   && <Badge color="orange" label={`🔒 ${counts.security} security`} />}
              {counts.performance > 0 && <Badge color="yellow" label={`⚡ ${counts.performance} perf`} />}
              {counts.style > 0      && <Badge color="blue"   label={`🎨 ${counts.style} style`} />}
              {result.issues.length === 0 && <Badge color="green" label="✨ No issues" />}
            </div>
          </div>
        </div>
      </div>

      {/* Positives */}
      {result.positives?.length > 0 && (
        <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-4 flex-shrink-0">
          <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> What's good
          </h3>
          <ul className="space-y-1.5">
            {result.positives.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {sorted.length > 0 && (
        <div className="flex-shrink-0">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5 px-1">
            <AlertCircle className="w-3.5 h-3.5" /> Issues ({sorted.length})
          </h3>
          <div className="space-y-2">
            {sorted.map((issue, i) => (
              <IssueCard key={issue.id || i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex-shrink-0 flex flex-col gap-2 pb-2">
        {result.refactoredCode && (
          <button
            onClick={onViewRefactored}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border ${
              showingRefactored
                ? "bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-transparent shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {showingRefactored ? "← Back to original code" : "✨ View AI-refactored code"}
          </button>
        )}
        <button
          onClick={copyMarkdown}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-[#30363d] bg-[#161b22] text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy review as Markdown</>}
        </button>
      </div>
    </div>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  const styles: Record<string, string> = {
    red:    "bg-red-500/10 text-red-400 border-red-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    blue:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green:  "bg-green-500/10 text-green-400 border-green-500/20",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[color]}`}>{label}</span>
  );
}
