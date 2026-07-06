"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language, readOnly = false }: Props) {
  return (
    <MonacoEditor
      height="100%"
      language={language === "c++" ? "cpp" : language}
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      theme="phosphor"
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("phosphor", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment",  foreground: "575340", fontStyle: "italic" },
            { token: "keyword",  foreground: "ffb000" },
            { token: "string",   foreground: "86c46a" },
            { token: "number",   foreground: "6fb7c9" },
            { token: "type",     foreground: "d8b45a" },
            { token: "function", foreground: "e8e2c8" },
          ],
          colors: {
            "editor.background": "#0b0b09",
            "editor.foreground": "#d8d3c0",
            "editor.lineHighlightBackground": "#12110d",
            "editorLineNumber.foreground": "#575340",
            "editorLineNumber.activeForeground": "#b57e06",
            "editorCursor.foreground": "#ffb000",
            "editor.selectionBackground": "#4d452666",
            "editorIndentGuide.background1": "#1c1a13",
            "editorWidget.background": "#12110d",
            "editorWidget.border": "#332f20",
            "scrollbarSlider.background": "#332f2088",
            "scrollbarSlider.hoverBackground": "#4d4526aa",
          },
        });
      }}
      options={{
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        renderLineHighlight: "line",
        padding: { top: 14, bottom: 14 },
        readOnly,
        wordWrap: "on",
        smoothScrolling: true,
        cursorBlinking: "solid",
        cursorStyle: "block",
        automaticLayout: true,
        tabSize: 2,
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
        suggest: { showKeywords: true },
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
}
