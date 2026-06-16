import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ status: "Life Choices API is running ✅" });
});

// ── AI Wellbeing Summary ──────────────────────────────────────────────────────
app.post("/api/summary", async (req, res) => {
    const { stats, choiceHistory } = req.body;

    if (!stats || !choiceHistory) {
        return res.status(400).json({ error: "Missing stats or choiceHistory" });
    }

    const goodCount = choiceHistory.filter((c) => c.good).length;
    const total = choiceHistory.length;
    const struggles = choiceHistory.filter((c) => !c.good).map((c) => c.scenario);
    const strengths = choiceHistory.filter((c) => c.good).map((c) => c.scenario);

    const prompt = `You are a compassionate wellbeing coach for teenagers. A player just completed a 12-scenario interactive story game about Alex, a 15-year-old Macedonian teen navigating real-life challenges.

Final wellbeing stats (out of 100):
- Sleep: ${stats.sleep}
- Mood: ${stats.mood}
- Social: ${stats.social}
- Focus: ${stats.focus}

Good choices made: ${goodCount} out of ${total}.
Topics where Alex made healthy choices: ${strengths.join(", ") || "none"}.
Topics where Alex's choices were harmful: ${struggles.join(", ") || "none"}.

Write a warm, personal 4–5 sentence wellbeing summary. Mention specific strengths and 1–2 areas to work on. Reference real HBSC statistics about Macedonian teens where relevant. End with an encouraging sentence. Be conversational, not clinical. No bullet points. No greeting. No sign-off.`;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        const text = completion.choices[0]?.message?.content || "";
        res.json({ summary: text });
    } catch (error) {
        console.error("Groq API error:", error.message);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Life Choices backend running on http://localhost:${PORT}\n`);
});