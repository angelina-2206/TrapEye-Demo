import { NextRequest, NextResponse } from "next/server";
import { callGemini, parseJsonResponse } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text, source } = await req.json();
    if (!text) return NextResponse.json({ error: "Text content is required" }, { status: 400 });

    /* ── Optional NewsAPI cross-reference ── */
    const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
    let newsContext = "";

    if (NEWS_API_KEY && text.length < 200) {
      try {
        const newsResp = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(text.slice(0, 100))}&pageSize=3&sortBy=relevancy&apiKey=${NEWS_API_KEY}`,
          { signal: AbortSignal.timeout(10000) }
        );
        if (newsResp.ok) {
          const newsData = await newsResp.json();
          const articles = newsData.articles || [];
          if (articles.length > 0) {
            newsContext = `\nRelated articles found: ${JSON.stringify(articles.map((a: Record<string, unknown>) => ({
              title: (a.title as string || "").slice(0, 80),
              source: (a.source as Record<string, string>)?.name || "Unknown",
            })))}`;
          }
        }
      } catch {
        /* NewsAPI error — continue */
      }
    }

    const prompt = `You are a fact-checker and media literacy expert with deep knowledge of journalism standards, propaganda techniques, and misinformation patterns.

Analyze this content for credibility and truthfulness:

INPUT: ${text}
${source ? `Source: ${source}` : ""}
${newsContext}

Return ONLY this JSON structure:
{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIABLE" | "SATIRE",
  "confidence": <float 0-1>,
  "credibility_score": <float 0-1>,
  "bias_score": <float -1 to 1, negative=left, positive=right>,
  "sensationalism_score": <float 0-1>,
  "summary": "<one clear sentence verdict>",
  "factors": [
    {"factor": "Factual Accuracy", "explanation": "<detail>"},
    {"factor": "Source Credibility", "explanation": "<detail>"},
    {"factor": "Logical Consistency", "explanation": "<detail>"},
    {"factor": "Emotional Manipulation", "explanation": "<detail>"},
    {"factor": "Missing Context", "explanation": "<detail>"}
  ],
  "red_flags": ["<flag1>", "<flag2>"],
  "positive_signals": ["<signal1>", "<signal2>"],
  "fact_check_suggestion": "<what to search or verify>",
  "media_literacy_tip": "<educational tip>"
}

Respond ONLY with valid JSON.`;

    const raw = await callGemini(prompt);
    const result = parseJsonResponse(raw);

    if (!result || Object.keys(result).length === 0) {
      return NextResponse.json({ error: "Could not parse AI response", raw: raw.slice(0, 300) }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
