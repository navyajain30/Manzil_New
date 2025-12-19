
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Generic Proxy Route for Groq/AI
router.post("/proxy", async (req, res) => {
  try {
    const { messages, model, temperature } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROK_API_KEY}`
        },
        body: JSON.stringify({
          model: model || "llama-3.3-70b-versatile",
          messages,
          temperature: temperature || 0.7
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Grok Proxy API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Proxy backend error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Deprecated: Chat route (kept for legacy support if needed, redirects to proxy logic or just simple impl)
router.post("/chat", async (req, res) => {
  // Simplified legacy support using the same logic as proxy if possible, or just fail cleanly.
  res.status(400).json({ error: "Please use /api/gemini/proxy endpoint" });
});

export default router;
