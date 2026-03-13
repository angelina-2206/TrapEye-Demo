import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Call Gemini with a text prompt and optional inline image data.
 */
export async function callGemini(
  prompt: string,
  imageData?: { base64: string; mimeType: string }
): Promise<string> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: MODEL_NAME });

  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
    { text: prompt },
  ];

  if (imageData) {
    parts.push({
      inlineData: { data: imageData.base64, mimeType: imageData.mimeType },
    });
  }

  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  const response = result.response;

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("Gemini returned no candidates — response blocked or empty.");
  }

  return response.text();
}

/**
 * Robustly extract JSON from a Gemini response string.
 */
export function parseJsonResponse(text: string): Record<string, unknown> {
  // Strip markdown code fences
  let cleaned = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // noop
  }

  // Find outermost { ... }
  try {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
  } catch {
    // noop
  }

  return {};
}
