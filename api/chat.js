// /api/chat.js
export default async function handler(req, res) {
  // -------------------------------
  // CORS headers so your website can call this endpoint
  // -------------------------------
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins for now
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request (browser sends OPTIONS first)
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // -------------------------------
    // Get data from widget
    // -------------------------------
    const { message, thread_id, business_id } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' in request body" });
    }

    // -------------------------------
    // Forward to Make webhook
    // -------------------------------
    const makeWebhookUrl = "https://hook.us2.make.com/kkyfx0yc5b82h9qpqo6v6hecdlxms0qb";

    const makeResponse = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, thread_id, business_id })
    });

    // Parse Make response if possible
    let data;
    try {
      data = await makeResponse.json();
    } catch {
      data = { status: "sent to Make webhook" }; // fallback if Make doesn't return JSON
    }

    // -------------------------------
    // Return response to widget
    // -------------------------------
    return res.status(200).json(data);

  } catch (error) {
    console.error("chat.js error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
