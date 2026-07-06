"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, RotateCcw, ChevronDown, Check } from "lucide-react";
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

  const ledClass = status === "loading" ? "led-busy" : status === "error" ? "led-err" : "led-ok";
  const modeLabel =
    status === "loading" ? "AUDITING" :
    status === "error"   ? "FAULT"    :
    showRefactored       ? "REFACTOR" : "READY";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ── Header ── */}
      <header
        className="flex-shrink-0"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-muted)" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 flex items-center gap-3" style={{ height: 46 }}>
          <Logo size={22} />
          <span className="font-bold text-[13px] tracking-[0.08em]" style={{ color: "var(--ink)" }}>
            CODEREVIEW<span style={{ color: "var(--amber)" }}>.SYS</span>
          </span>

          <span
            className="hidden sm:block text-[10px] px-2 py-0.5 tracking-[0.15em]"
            style={{ border: "1px solid var(--border-muted)", color: "var(--ink-muted)" }}
          >
            ENGINE: GROQ / LLAMA-3.3-70B
          </span>

          <div className="ml-auto flex items-center gap-4 text-[10px] tracking-[0.12em]">
            {status === "done" && reviewTime && (
              <span className="tabular-nums" style={{ color: "var(--ok)" }}>
                AUDIT COMPLETE · {reviewTime.toFixed(1)}s
              </span>
            )}
            <span className="flex items-center gap-2" style={{ color: "var(--ink-muted)" }}>
              <span className={`led ${ledClass}`} />
              {modeLabel}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div
        className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full px-4 py-4 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 46px - 30px)" }}
      >

        {/* LEFT: Editor panel */}
        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 panel">

          {/* panel titlebar + toolbar */}
          <div
            className="flex items-center gap-2 px-3 py-2 flex-wrap flex-shrink-0"
            style={{ borderBottom: "1px solid var(--border-muted)", background: "var(--bg-elevated)" }}
          >
            <span className="panel-title mr-1">
              ▌ Source {showRefactored && <span style={{ color: "var(--ok)" }}>· Refactored</span>}
            </span>

            {/* Language selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => { setShowLangMenu(!showLangMenu); setShowExamples(false); }}
                className="tbtn"
              >
                <span style={{ color: "var(--amber)" }}>{selectedLang.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLangMenu && (
                <div className="absolute top-full mt-1 left-0 z-30 grid grid-cols-2 min-w-[220px] dropdown p-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => { setLanguage(lang.id); setShowLangMenu(false); }}
                      className={`dropdown-item ${language === lang.id ? "active" : ""}`}
                    >
                      {language === lang.id ? "▸ " : "  "}{lang.label}
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
                  className="tbtn"
                >
                  Samples
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showExamples && (
                  <div className="absolute top-full mt-1 left-0 z-30 min-w-[180px] dropdown p-1">
                    {examples.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => { setCode(ex.code); setLineCount(ex.code.split("\n").length); setShowExamples(false); setResult(null); setStatus("idle"); setShowRefactored(false); }}
                        className="dropdown-item"
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <button onClick={handleCopy} className="tbtn">
                {copied
                  ? <><Check className="w-3 h-3" style={{ color: "var(--ok)" }} /><span className="hidden sm:inline">Copied</span></>
                  : <><Copy className="w-3 h-3" /><span className="hidden sm:inline">Copy</span></>}
              </button>
              <button onClick={handleReset} className="tbtn">
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden" style={{ background: "#0b0b09" }}>
            <CodeEditor
              value={displayCode}
              onChange={showRefactored ? undefined : handleCodeChange}
              language={language}
              readOnly={showRefactored}
            />
          </div>

          {/* Run button */}
          <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid var(--border-muted)" }}>
            <button
              onClick={handleReview}
              disabled={status === "loading" || !code.trim()}
              className="tbtn tbtn-primary w-full justify-center py-3 text-[12px] tracking-[0.18em]"
            >
              {status === "loading"
                ? <>▚ AUDIT IN PROGRESS…</>
                : <>▶ RUN AUDIT <span className="opacity-50 normal-case tracking-normal font-normal ml-1">Ctrl+Enter</span></>}
            </button>
          </div>
        </div>

        {/* RIGHT: Report panel */}
        <div className="w-full lg:w-[430px] xl:w-[460px] flex-shrink-0 flex flex-col overflow-hidden">

          {status === "idle" && <EmptyState />}

          {status === "loading" && <LoadingState />}

          {status === "error" && (
            <div
              className="flex-1 flex flex-col items-center justify-center text-center p-8 panel"
              style={{ borderColor: "rgba(255,84,73,0.4)" }}
            >
              <p className="text-[10px] font-bold tracking-[0.25em] mb-3" style={{ color: "var(--sev-critical)" }}>
                ▌ SYSTEM FAULT
              </p>
              <p className="text-[13px] max-w-[280px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                {error}
              </p>
              <button onClick={() => setStatus("idle")} className="tbtn mt-5">
                Acknowledge · Reset
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

      {/* ── Status line ── */}
      <footer
        className="flex-shrink-0 flex items-center text-[10px] tracking-[0.12em] tabular-nums"
        style={{ height: 30, background: "var(--bg-surface)", borderTop: "1px solid var(--border-muted)", color: "var(--ink-faint)" }}
      >
        <div className="max-w-[1600px] mx-auto w-full px-4 flex items-center gap-0">
          <span className="px-2 py-0.5 font-bold" style={{ background: "var(--amber)", color: "#14120a" }}>
            {modeLabel}
          </span>
          <span className="px-3" style={{ color: "var(--ink-muted)" }}>{selectedLang.label.toUpperCase()}</span>
          <span className="px-3" style={{ borderLeft: "1px solid var(--border)" }}>{lineCount} LN</span>
          <span className="px-3 hidden sm:inline" style={{ borderLeft: "1px solid var(--border)" }}>UTF-8</span>
          <span className="ml-auto hidden md:inline">CTRL+ENTER ▸ RUN AUDIT</span>
        </div>
      </footer>
    </div>
  );
}

function EmptyState() {
  const checks = [
    ["01", "BUG DETECTION",     "logic faults · null refs · leaks"],
    ["02", "SECURITY AUDIT",    "injection · XSS · OWASP flags"],
    ["03", "PERFORMANCE SCAN",  "hot loops · wasted allocations"],
    ["04", "AI REFACTOR",       "full rewritten source output"],
  ];

  return (
    <div className="flex-1 flex flex-col panel">
      <div
        className="flex items-center px-3 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-muted)", background: "var(--bg-elevated)" }}
      >
        <span className="panel-title">▌ Audit Report</span>
      </div>

      <div className="flex-1 flex flex-col justify-center p-6 gap-6">
        <div>
          <p className="text-[15px] font-bold mb-1" style={{ color: "var(--ink)" }}>
            AWAITING INPUT<span className="cursor-blink ml-1" />
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            Load source into the editor, then run the audit.
          </p>
        </div>

        <div style={{ border: "1px solid var(--border-muted)" }}>
          {checks.map(([n, title, desc], i) => (
            <div
              key={n}
              className="flex items-baseline gap-3 px-3 py-2.5"
              style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
            >
              <span className="text-[10px] tabular-nums" style={{ color: "var(--amber)" }}>{n}</span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em]" style={{ color: "var(--ink)" }}>{title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-faint)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.12em]" style={{ color: "var(--ink-faint)" }}>
          13 LANGUAGES SUPPORTED · NO CODE STORED
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  const logs = [
    "$ codereview --run --deep",
    "reading source buffer… ok",
    "tokenizing input… ok",
    "loading llama-3.3-70b via groq… ok",
    "running heuristics: bugs sec perf style",
    "compiling audit report…",
  ];

  return (
    <div className="flex-1 flex flex-col panel">
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-muted)", background: "var(--bg-elevated)" }}
      >
        <span className="panel-title">▌ Audit Report</span>
        <span className="led led-busy" />
      </div>

      <div className="p-4 flex flex-col gap-1.5 text-[12px]" style={{ color: "var(--ink-muted)" }}>
        {logs.map((line, i) => (
          <p key={i} className="log-line" style={{ animationDelay: `${i * 450}ms` }}>
            {line.startsWith("$")
              ? <span style={{ color: "var(--amber)" }}>{line}</span>
              : <><span style={{ color: "var(--ink-faint)" }}>▸ </span>{line}</>}
          </p>
        ))}
        <p className="log-line" style={{ animationDelay: `${logs.length * 450}ms` }}>
          <span className="cursor-blink" />
        </p>
      </div>

      <div className="px-4 pb-4 mt-auto flex flex-col gap-2">
        <div className="skeleton h-[64px]" />
        <div className="skeleton h-[40px]" />
        <div className="skeleton h-[90px]" />
      </div>
    </div>
  );
}
