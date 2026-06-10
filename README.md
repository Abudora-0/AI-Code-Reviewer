# AI Code Reviewer

**Live Demo:** [ai-code-reviewer-lyart-xi.vercel.app](https://ai-code-reviewer-lyart-xi.vercel.app)

An AI-powered code review tool that analyzes your code and delivers instant, structured feedback — bugs, security vulnerabilities, performance issues, and a fully refactored version — all in seconds.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036)

## Features

- **Quality Score** — animated 0–100 ring score with letter grade
- **Bug Detection** — pinpoints issues with exact line numbers
- **Security Analysis** — flags SQL injection, XSS, and other OWASP vulnerabilities
- **Performance Suggestions** — highlights inefficient patterns and proposes fixes
- **AI Refactor** — delivers a fully rewritten, improved version of your code
- **13 Languages** — JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, CSS, SQL
- **Monaco Editor** — VS Code-style editor with syntax highlighting
- **Copy as Markdown** — export the full review report in one click
- **Keyboard Shortcut** — `Ctrl+Enter` to trigger a review instantly

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| AI / LLM | Groq API — Llama 3.3 70B Versatile |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/) (free tier available)

### Installation

```bash
git clone https://github.com/yourusername/ai-code-reviewer.git
cd ai-code-reviewer
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. Paste any code snippet into the Monaco editor
2. Select the language from the dropdown (or use a built-in example)
3. Click **Review Code** or press `Ctrl+Enter`
4. The review panel renders your quality score, detected issues, and a refactored version side-by-side
5. Copy the full report as Markdown with one click

## Project Structure

```
├── app/
│   ├── api/review/route.ts   # Groq API integration
│   └── page.tsx              # Main layout
├── components/
│   ├── CodeEditor.tsx        # Monaco editor wrapper
│   ├── ReviewPanel.tsx       # Results display
│   ├── ScoreRing.tsx         # Animated quality score ring
│   └── IssueCard.tsx         # Bug / security / performance cards
```

## License

MIT
