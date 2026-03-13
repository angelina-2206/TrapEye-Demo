import { NextRequest, NextResponse } from "next/server";
import { callGemini, parseJsonResponse } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { url, context } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const VIRUSTOTAL_KEY = process.env.VIRUSTOTAL_KEY || "";
    let vtResult: Record<string, unknown> = {};
    let vtStats: Record<string, number> = {};

    /* ── VirusTotal scan ── */
    if (VIRUSTOTAL_KEY) {
      try {
        const urlId = Buffer.from(url).toString("base64url").replace(/=+$/, "");
        const vtResp = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
          headers: { "x-apikey": VIRUSTOTAL_KEY },
          signal: AbortSignal.timeout(15000),
        });

        if (vtResp.ok) {
          const vtData = await vtResp.json();
          const attrs = vtData?.data?.attributes || {};
          const lastAnalysis = attrs.last_analysis_stats || {};
          vtStats = lastAnalysis;
          vtResult = {
            malicious: lastAnalysis.malicious || 0,
            suspicious: lastAnalysis.suspicious || 0,
            clean: lastAnalysis.undetected || 0,
            harmless: lastAnalysis.harmless || 0,
            total: Object.values(lastAnalysis as Record<string, number>).reduce((a: number, b: number) => a + b, 0),
            reputation: attrs.reputation || 0,
            categories: attrs.categories || {},
          };
        } else if (vtResp.status === 404) {
          await fetch("https://www.virustotal.com/api/v3/urls", {
            method: "POST",
            headers: { "x-apikey": VIRUSTOTAL_KEY },
            body: new URLSearchParams({ url }),
            signal: AbortSignal.timeout(10000),
          });
          vtResult = { status: "submitted", message: "URL submitted for scanning." };
        }
      } catch {
        /* VirusTotal error — continue with AI analysis */
      }
    }

    /* ── Gemini AI URL analysis ── */
    const vtContext = Object.keys(vtResult).length > 0 ? `\nVirusTotal results: ${JSON.stringify(vtResult)}` : "";

    const prompt = `You are a cybersecurity expert specializing in URL threat analysis, phishing detection, and malware distribution.

Analyze this URL for security threats:
URL: ${url}
${context ? `Context: ${context}` : ""}
${vtContext}

Return ONLY this JSON:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "PHISHING" | "MALWARE",
  "risk_score": <float 0-1>,
  "confidence": <float 0-1>,
  "summary": "<one sentence assessment>",
  "threat_types": ["<type1>", "<type2>"],
  "factors": [
    {"factor": "Domain Reputation", "explanation": "<detail>", "risk": <0-1>},
    {"factor": "URL Structure", "explanation": "<detail>", "risk": <0-1>},
    {"factor": "Phishing Indicators", "explanation": "<detail>", "risk": <0-1>},
    {"factor": "Redirect Chains", "explanation": "<detail>", "risk": <0-1>},
    {"factor": "Content Risk", "explanation": "<detail>", "risk": <0-1>}
  ],
  "technical_indicators": ["<indicator1>", "<indicator2>"],
  "safe_to_visit": <true/false>,
  "recommendation": "<clear action recommendation>"
}
Respond ONLY with valid JSON.`;

    const raw = await callGemini(prompt);
    const result = parseJsonResponse(raw);

    if (!result || Object.keys(result).length === 0) {
      return NextResponse.json({ error: "Could not parse AI response", raw: raw.slice(0, 300) }, { status: 500 });
    }

    return NextResponse.json({ ...result, virusTotal: vtStats });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
