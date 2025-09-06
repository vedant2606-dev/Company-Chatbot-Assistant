import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { queryDocuments } from "./prepare.js";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: "Question is required" });
    }

    // retrieval
    const relevant = await queryDocuments(question, 5);

    if (relevant.length === 0) {
      return res.json({
        answer: "I don't have that information in the company documents.",
      });
    }

    const prompt = `You are a helpful company assistant. Answer questions using ONLY the provided company documents.

RESPONSE RULES:
1. GREETINGS: For casual greetings (hi, hello, thanks, bye, etc.), respond warmly and offer help
   - Example: "Hello! I'm here to help you with any questions about our company. What would you like to know?"

2. COMPANY QUESTIONS: Use ONLY the document information provided
   - Give concise, accurate answers (1-3 sentences)
   - Quote specific details when available
   - Stay factual and professional

3. UNKNOWN INFORMATION: If the answer isn't in the documents, say:
   "I don't have that specific information in our company documents. Please contact our support team for more details."

4. TONE: Be professional, helpful, and friendly

COMPANY DOCUMENTS:
${relevant.join("\n\n")}

USER QUESTION: ${question}

RESPONSE:`;

    //LLM
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Give SHORT, DIRECT answers under 50 words.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 150,
    });

    const answer = response.choices[0].message.content;

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Something went wrong processing your question.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server running on http://localhost:${PORT}`);
});
