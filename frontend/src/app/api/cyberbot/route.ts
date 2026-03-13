import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are CyberBot, a cybersecurity expert assistant for TrapEye — a platform that detects deepfakes, fake news, and URL threats. Answer questions clearly and concisely about cybersecurity, phishing, malware, deepfakes, online safety, and digital threats. Keep responses friendly, helpful, and under 150 words unless more detail is needed.",
        messages: messages,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Anthropic API Error" }, { status: response.status });
    }

    return NextResponse.json({ text: data.content[0].text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
