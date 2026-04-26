export async function safeAI(fn, fallback) {
  try {
    const res = await fn();

    if (!res) return fallback;

    return res;
  } catch (err) {
    console.error("AI ERROR:", err.message);
    return fallback;
  }
}