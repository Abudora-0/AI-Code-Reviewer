import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const prompt = `You are an expert code reviewer. Review the following ${language} code and respond with ONLY valid JSON (no markdown, no backticks, no explanation outside the JSON).

The JSON must follow this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "issues": [
    {
      "id": "<unique string like issue-1>",
      "type": "<bug|security|performance|style>",
      "severity": "<critical|warning|info>",
      "line": <line number or null>,
      "title": "<short title>",
      "message": "<detailed explanation>",
      "suggestion": "<how to fix it>"
    }
  ],
  "positives": ["<thing done well>"],
  "refactoredCode": "<full improved version of the code>"
}

Scoring: 90-100 excellent, 70-89 good, 50-69 needs work, 30-49 significant issues, 0-29 major problems.
Find real issues. Be specific. Include 2-6 issues. Always provide refactoredCode.

Code to review (${language}):
\`\`\`${language}
${code}
\`\`\``;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", errText);
      throw new Error(`Groq API error ${groqRes.status}: ${errText}`);
    }

    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content ?? "";

    // Strip any accidental markdown fences
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const review = JSON.parse(cleaned);

    return NextResponse.json(review);
  } catch (err: any) {
    console.error("Review error:", err);
    return NextResponse.json({ error: err.message || "Review failed" }, { status: 500 });
  }
}
