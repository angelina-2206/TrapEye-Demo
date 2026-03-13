import { NextRequest, NextResponse } from "next/server";
import { callGemini, parseJsonResponse } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const contextText = (formData.get("context") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    /* Detect mime type */
    let mimeType = file.type || "image/jpeg";
    const header = new Uint8Array(bytes.slice(0, 4));
    if (header[0] === 0x89 && header[1] === 0x50) mimeType = "image/png";
    else if (header[0] === 0xff && header[1] === 0xd8) mimeType = "image/jpeg";
    else if (header[0] === 0x52 && header[1] === 0x49) mimeType = "image/webp";

    const prompt = `You are an expert digital forensics analyst specialising in deepfake detection, GAN-generated images, face-swapping, and photo manipulation.

Carefully examine the provided image for any signs of:
- AI / GAN generation (StyleGAN, Stable Diffusion, DALL-E, Midjourney, etc.)
- Face swapping or face replacement (DeepFaceLab, FaceSwap, etc.)
- Photo retouching or compositing
- Any other digital manipulation

${contextText ? `Additional context: ${contextText}` : ""}

Return ONLY a single valid JSON object — no markdown, no explanation outside the JSON:
{
  "verdict": "REAL" or "FAKE" or "SUSPICIOUS",
  "confidence": <number 0.0-1.0>,
  "manipulation_score": <number 0.0-1.0>,
  "summary": "<one clear sentence>",
  "factors": [
    {"factor": "Facial Consistency",    "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Lighting & Shadows",    "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Texture & Skin Detail", "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Edge & Boundary",       "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Background Coherence",  "explanation": "<what you observed>", "score": <0.0-1.0>}
  ],
  "technical_details": "<2-4 sentences of technical findings>",
  "recommendation": "<practical advice for the user>"
}`;

    const raw = await callGemini(prompt, { base64, mimeType });
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
