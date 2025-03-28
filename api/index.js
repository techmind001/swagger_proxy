export default async function handler(req, res) {
    const { target } = req.query;
  
    if (!target || !target.startsWith("https://")) {
      return res.status(400).json({ error: "Missing or invalid 'target' query parameter" });
    }
  
    try {
      const response = await fetch(target, {
        method: req.method,
        headers: {
          ...req.headers,
          host: new URL(target).host,
        },
        body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
      });
  
      const text = await response.text();
  
      res.status(response.status);
      res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*"); // на всякий случай
      res.send(text);
    } catch (error) {
      res.status(500).json({ error: "Proxy error", details: error.message });
    }
  }
  