import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function parseTransaction(text) {
  try {
    const prompt = `
You are a finance assistant. 
Extract structured transaction details as JSON with fields:
- date
- amount
- currency
- category
- description

Return ONLY valid JSON, no markdown, no explanation.
Input: ${text}
Output: JSON
`;

    const result = await model.generateContent(prompt);
    let raw = result.response.text();
    console.log("Gemini raw response:", raw);
    if (!raw) throw new Error("No response from Gemini");

    // 🛠 Clean code fences if Gemini adds them
    raw = raw.trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/```[a-z]*\n?/, "").replace(/```$/, "").trim();
    }

    // 🛠 Extract first valid JSON block if extra text sneaks in
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");

    const parsed = JSON.parse(match[0]);

    return { success: true, data: parsed };
  } catch (err) {
    console.error("Gemini parse failed:", err?.message || err);
    return {
      success: false,
      data: null,
      error: "Gemini parsing failed",
    };
  }
}






// import OpenAI from "openai";

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function parseTransaction(text) {
//   try {
//     const completion = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a finance assistant. Extract structured transaction details as JSON with fields: date, amount, currency, category, description." },
//         { role: "user", content: text }
//       ],
//       response_format: { type: "json_object" }
//     });

//     const raw = completion.choices[0].message?.content;
//     if (!raw) {
//       throw new Error("No response from AI");
//     }

//     const parsed= JSON.parse(raw);

//     return { success: true, data: parsed };
//   } catch (err) {
//     console.error("AI parse failed:", err?.message || err);
//     return {
//       success: false,
//       data: null,
//       error: "AI parsing failed",
//     };
//   }
// }
