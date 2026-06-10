"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play, Copy, RotateCcw, ChevronDown, Loader2, Sparkles,
  Check, BookOpen, Clock, Terminal, Bug, ShieldAlert, Zap, Wand2,
} from "lucide-react";
import Logo from "@/components/Logo";
import CodeEditor from "@/components/CodeEditor";
import ReviewPanel, { ReviewResult } from "@/components/ReviewPanel";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python",     label: "Python" },
  { id: "java",       label: "Java" },
  { id: "c++",        label: "C++" },
  { id: "go",         label: "Go" },
  { id: "rust",       label: "Rust" },
  { id: "php",        label: "PHP" },
  { id: "ruby",       label: "Ruby" },
  { id: "swift",      label: "Swift" },
  { id: "kotlin",     label: "Kotlin" },
  { id: "css",        label: "CSS" },
  { id: "sql",        label: "SQL" },
];

const EXAMPLES: Record<string, { label: string; code: string }[]> = {
  javascript: [
    {
      label: "Auth function",
      code: `// User authentication
function authenticateUser(username, password) {
  const query = "SELECT * FROM users WHERE username = '" + username + "'";
  const result = db.execute(query);
  if (result.length > 0) {
    const user = result[0];
    if (user.password == password) {
      console.log("User logged in: " + username);
      return { success: true, user: user };
    }
  }
  return { success: false };
}

async function getUserData(userId) {
  const response = await fetch('/api/user/' + userId);
  const data = response.json();
  return data;
}`,
    },
    {
      label: "Memory leak",
      code: `// Event listener memory leak
function setupDashboard() {
  const data = new Array(100000).fill({ value: Math.random() });

  document.getElementById('btn').addEventListener('click', function() {
    console.log('Data length:', data.length);
    updateUI(data);
  });
}

function updateUI(data) {
  var result = '';
  for (var i = 0; i < data.length; i++) {
    result += '<div>' + data[i].value + '</div>';
  }
  document.getElementById('container').innerHTML = result;
}

setInterval(setupDashboard, 1000);`,
    },
  ],
  python: [
    {
      label: "Insecure file handler",
      code: `import os
import pickle

def load_user_data(filename):
    with open('/data/' + filename, 'rb') as f:
        data = pickle.load(f)
    return data

def execute_command(user_input):
    result = os.system("echo " + user_input)
    return result

def get_users(db, search_term):
    query = "SELECT * FROM users WHERE name = '%s'" % search_term
    cursor = db.execute(query)
    return cursor.fetchall()

passwords = ["admin123", "password", "123456"]
user_pass = input("Enter password: ")
if user_pass in passwords:
    print("Access granted")`,
    },
  ],
  typescript: [
    {
      label: "Unsafe any types",
      code: `interface User {
  id: any;
  name: any;
  data: any;
}

async function fetchUser(id: any): Promise<any> {
  const res = await fetch('/api/users/' + id);
  const user: any = await res.json();
  return user;
}

function processUsers(users: any[]) {
  var total = 0;
  for (var i = 0; i < users.length; i++) {
    total = total + users[i].score;
  }
  return total;
}

const userData = fetchUser(123);
console.log(userData.name);`,
    },
  ],
  sql: [
    {
      label: "Slow queries",
      code: `-- User activity report
SELECT u.*, o.*, p.*
FROM users u, orders o, products p
WHERE u.id = o.user_id
AND o.product_id = p.id
AND u.status = 'active';

SELECT * FROM orders
WHERE DATE(created_at) = CURDATE();

SELECT user_id, COUNT(*) as total
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5
ORDER BY total DESC;

SELECT * FROM users WHERE email LIKE '%@gmail.com';`,
    },
  ],
};

type Status = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [code, setCode]                     = useState(EXAMPLES.javascript[0].code);
  const [language, setLanguage]             = useState("javascript");
  const [status, setStatus]                 = useState<Status>("idle");
  const [result, setResult]                 = useState<ReviewResult | null>(null);
  const [error, setError]                   = useState("");
  const [showRefactored, setShowRefactored] = useState(false);
  const [copied, setCopied]                 = useState(false);
  const [showLangMenu, setShowLangMenu]     = useState(false);
  const [showExamples, setShowExamples]     = useState(false);
  const [reviewTime, setReviewTime]         = useState<number | null>(null);
  const [lineCount, setLineCount]           = useState(code.split("\n").length);

  const langMenuRef    = useRef<HTMLDivElement>(null);
  const exampleMenuRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find(l => l.id === language)!;
  const examples     = EXAMPLES[language] ?? [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setShowLangMenu(false);
      if (exampleMenuRef.current && !exampleMenuRef.current.contains(e.target as Node)) setShowExamples(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (status !== "loading") handleReview();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [status, code, language]);

  function handleCodeChange(val: string) {
    setCode(val);
    setLineCount(val.split("\n").length);
  }

  async function handleReview() {
    if (!code.trim()) return;
    setStatus("loading");
    setResult(null);
    setError("");
    setShowRefactored(false);
    const t0 = Date.now();

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      setResult(data);
      setReviewTime((Date.now() - t0) / 1000);
      setStatus("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Review failed");
      setStatus("error");
    }
  }

  function handleReset() {
    setCode(EXAMPLES.javascript[0].code);
    setLanguage("javascript");
    setResult(null);
    setStatus("idle");
    setError("");
    setShowRefactored(false);
    setReviewTime(null);
    setLineCount(EXAMPLES.javascript[0].code.split("\n").length);
  }

  async function handleCopy() {
    const text = showRefactored && result?.refactoredCode ? result.refactoredCode : code;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayCode = showRefactored && result?.refactoredCode ? result.refactoredCode : code;

  /* ── shared style tokens ── */
  const surface  = { background: "var(--bg-elevated)", border: "1px solid var(--border)" } as const;
  const surfaceHover = "hover:border-[#2d527a] hover:text-white";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex-shrink-0"
        style={{ background: "rgba(5,12,24,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1600px] mx-auto px-5 flex items-center gap-3" style={{ height: 52 }}>

          <Logo size={26} />
          <span className="font-bold text-white text-sm tracking-tight">
            Code<span className="text-blue-400">Review</span> <span className="text-slate-500 font-normal">AI</span>
          </span>

          {/* model badge */}
          <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", color: "#67e8f9" }}>
            <Sparkles className="w-3 h-3" />
            Groq · Llama 3.3
          </span>

          <div className="ml-auto flex items-center gap-4 text-xs">
            {status === "done" && reviewTime && (
              <span className="flex items-center gap-1 font-medium" style={{ color: "#34d399" }}>
                <Clock className="w-3.5 h-3.5" />{reviewTime.toFixed(1)}s
              </span>
            )}
            <span className="hidden md:flex items-center gap-1.5 text-slate-500">
              <Terminal className="w-3.5 h-3.5" />
              Ctrl+Enter to run
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
              <span style={{ color: "#6ee7b7" }}>Live</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full px-4 py-4 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 52px)" }}>

        {/* LEFT: Editor */}
        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0">

          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">

            {/* Language selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => { setShowLangMenu(!showLangMenu); setShowExamples(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${surfaceHover}`}
                style={surface}
              >
                <span className="font-mono text-xs font-bold text-blue-400">{selectedLang.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-600" />
              </button>

              {showLangMenu && (
                <div className="absolute top-full mt-1 left-0 rounded-xl p-1 z-30 grid grid-cols-2 gap-0.5 min-w-[210px]"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
                  {LANGUAGES.map(lang => (
                    <button key={lang.id}
                      onClick={() => { setLanguage(lang.id); setShowLangMenu(false); }}
                      className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        language === lang.id
                          ? "text-blue-300"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                      style={language === lang.id ? { background: "rgba(59,130,246,0.15)" } : {}}>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Examples */}
            {examples.length > 0 && (
              <div className="relative" ref={exampleMenuRef}>
                <button
                  onClick={() => { setShowExamples(!showExamples); setShowLangMenu(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-400 transition-all ${surfaceHover}`}
                  style={surface}
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Examples
                  <ChevronDown className="w-3 h-3 text-slate-600" />
                </button>
                {showExamples && (
                  <div className="absolute top-full mt-1 left-0 rounded-xl p-1 z-30 min-w-[160px]"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
                    {examples.map((ex, i) => (
                      <button key={i}
                        onClick={() => { setCode(ex.code); setLineCount(ex.code.split("\n").length); setShowExamples(false); setResult(null); setStatus("idle"); setShowRefactored(false); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        {ex.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showRefactored && (
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-medium"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }}>
                <Wand2 className="w-3 h-3" /> AI Refactored
              </span>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-600 tabular-nums hidden sm:block">{lineCount} lines</span>

              <button onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-400 transition-all ${surfaceHover}`}
                style={surface}>
                {copied
                  ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="hidden sm:inline">Copied!</span></>
                  : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>}
              </button>

              <button onClick={handleReset}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-400 transition-all ${surfaceHover}`}
                style={surface}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 rounded-2xl overflow-hidden bg-[#1e1e1e]"
            style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
            <CodeEditor
              value={displayCode}
              onChange={showRefactored ? undefined : handleCodeChange}
              language={language}
              readOnly={showRefactored}
            />
          </div>

          {/* Review button */}
          <button
            onClick={handleReview}
            disabled={status === "loading" || !code.trim()}
            className="mt-3 flex items-center justify-center gap-2 w-full py-3 font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 text-white"
            style={
              status === "loading" || !code.trim()
                ? { background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "#334155" }
                : {
                    background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0891b2 100%)",
                    border: "1px solid rgba(59,130,246,0.4)",
                    boxShadow: "0 4px 20px rgba(37,99,235,0.35), 0 1px 0 rgba(255,255,255,0.08) inset",
                  }
            }
          >
            {status === "loading"
              ? <><Loader2 className="w-4 h-4 animate-spin" />Reviewing with Llama 3.3...</>
              : <><Play className="w-4 h-4 fill-current" />Review Code <span className="hidden md:inline text-white/40 text-xs ml-1 font-normal">Ctrl+Enter</span></>
            }
          </button>
        </div>

        {/* RIGHT: Results panel */}
        <div className="w-full lg:w-[430px] xl:w-[460px] flex-shrink-0 flex flex-col overflow-hidden">

          {status === "idle" && <EmptyState />}

          {status === "loading" && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="skeleton h-[160px]" />
              <div className="skeleton h-[72px]" />
              <div className="skeleton h-[100px]" />
              <div className="skeleton h-[100px]" />
              <div className="skeleton h-[100px]" />
              <div className="text-center text-xs text-slate-600 mt-1 flex items-center justify-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                Analysing with Llama 3.3 70B...
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-red-400 font-semibold mb-1">Review failed</h3>
              <p className="text-sm text-slate-500 max-w-[260px]">{error}</p>
              <button onClick={() => setStatus("idle")}
                className="mt-4 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)" }}>
                Try again
              </button>
            </div>
          )}

          {status === "done" && result && (
            <ReviewPanel
              result={result}
              reviewTime={reviewTime}
              onViewRefactored={() => setShowRefactored(!showRefactored)}
              showingRefactored={showRefactored}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const features = [
    { icon: Bug,         label: "Bug detection",    bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.18)",   color: "#f87171" },
    { icon: ShieldAlert, label: "Security audit",   bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.18)",  color: "#fb923c" },
    { icon: Zap,         label: "Performance tips", bg: "rgba(234,179,8,0.08)",   border: "rgba(234,179,8,0.18)",   color: "#facc15" },
    { icon: Wand2,       label: "Refactored code",  bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.18)",  color: "#60a5fa" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-2xl gap-5"
      style={{ border: "1px dashed rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.02)" }}>

      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(29,78,216,0.2), rgba(8,145,178,0.1))",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 24px rgba(37,99,235,0.12)",
        }}>
        <Terminal className="w-6 h-6 text-blue-400" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-white mb-1.5">Ready to review</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
          Paste your code and click <strong className="text-slate-300">Review Code</strong> or press{" "}
          <kbd className="px-1.5 py-0.5 rounded text-xs font-mono text-slate-300"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)" }}>Ctrl+Enter</kbd>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
        {features.map(({ icon: Icon, label, bg, border, color }) => (
          <div key={label}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium"
            style={{ background: bg, border: `1px solid ${border}`, color }}>
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
