// /api/chat.js
export default async function handler(req, res) {
  // -------------------------------
  // CORS headers so your widget can call this endpoint
  // -------------------------------
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (change to your domain in production)
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // -------------------------------
    // Extract data from the widget
    // -------------------------------
    const { message, thread_id, business_id } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' in request body" });
    }

    // -------------------------------
    // Send data to Make webhook
    // -------------------------------
    const makeWebhookUrl = "https://hook.us2.make.com/kkyfx0yc5b82h9qpqo6v6hecdlxms0qb";

    const makeResponse = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, thread_id, business_id })
    });

    // Try to parse JSON returned by Make
    let data;
    try {
      data = await makeResponse.json();
    } catch (err) {
      console.warn("Make webhook did not return JSON:", err);
      data = { status: "sent to Make webhook" };
    }

    // -------------------------------
    // Return Make response to widget
    // -------------------------------
    return res.status(200).json(data);

  } catch (error) {
    console.error("chat.js error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
