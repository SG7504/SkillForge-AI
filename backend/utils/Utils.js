export function extractJSON(text) {
  try {
    // Remove markdown code blocks if present
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract first JSON object or array
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);

    if (!match) return null;

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON PARSE ERROR:", err);
    return null;
  }
}