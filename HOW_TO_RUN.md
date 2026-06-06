# CodeReview AI — How to Run

## What it does
Paste any code into the VS Code-style editor and get an instant AI-powered review:
- **Quality score** (0–100) with animated ring
- **Bug, security, performance & style issues** with line numbers
- **AI-refactored version** of your code
- **Copy review as Markdown** for sharing

---

## Prerequisites
- Node.js v18+
- A free Groq API key (see step 2)

---

## 1. Install Dependencies

```powershell
cd D:\Projects\ai-code-reviewer
npm install
```

---

## 2. Get a Free Groq API Key

1. Go to **https://console.groq.com**
2. Sign up / log in
3. Click **"API Keys"** in the sidebar
4. Click **"Create API Key"** and copy it (starts with `gsk_...`)

---

## 3. Set Up Environment Variables

Create `.env` at the project root:

```env
GROQ_API_KEY="gsk_your-key-here"
```

---

## 4. Run the App

```powershell
npm run dev
```

Open **http://localhost:3000**

---

## How to Use

1. **Select a language** from the dropdown (13 supported)
2. **Load an example** via the Examples button, or paste your own code
3. Click **Review Code** or press **Ctrl+Enter**
4. Review the results:
   - Animated score ring (0–100)
   - Issues list — click any issue to expand details & fix suggestion
   - "What's good" section
   - Click **"View AI-refactored code"** to see the improved version
   - Click **"Copy review as Markdown"** to export the review

---

## Features

| Feature | Description |
|---------|-------------|
| 🎨 Monaco Editor | VS Code-style editor with syntax highlighting |
| 🤖 AI Review | Powered by Groq + Llama 3.3 70B |
| 📊 Quality Score | Animated 0–100 score ring |
| 🐛 Bug Detection | Identifies bugs with line numbers |
| 🔒 Security Audit | Flags SQL injection, XSS, etc. |
| ⚡ Performance Tips | Highlights inefficient code |
| ✨ Refactored Code | Full AI-rewritten version |
| 📋 Markdown Export | Copy full review as Markdown |
| ⌨️ Keyboard Shortcut | Ctrl+Enter to trigger review |
| ⏱️ Review Time | Shows how fast Groq responded |

---

## Supported Languages

JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, CSS, SQL

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| AI Model | Llama 3.3 70B via Groq API |
| Icons | Lucide React |

---

## Folder Structure

```
ai-code-reviewer/
├── app/
│   ├── api/
│   │   └── review/route.ts     # Groq API call + JSON parsing
│   ├── globals.css             # Dark theme + animations
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page (editor + results)
├── components/
│   ├── CodeEditor.tsx          # Monaco editor wrapper
│   ├── IssueCard.tsx           # Expandable issue card
│   ├── Logo.tsx                # Custom SVG logo
│   ├── ReviewPanel.tsx         # Results panel
│   └── ScoreRing.tsx           # Animated SVG score ring
└── .env                        # API key (not committed)
```
