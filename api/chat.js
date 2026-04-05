export default async function handler(req, res) {
  // Allow CORS (VERY IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { message, thread_id, business_id } = req.body;

    // Call your Make webhook
    const response = await fetch("https://hook.us2.make.com/kkyfx0yc5b82h9qpqo6v6hecdlxms0qb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        thread_id,
        business_id
      })
    });

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
}
