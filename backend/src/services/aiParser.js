import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseTransaction(text) {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a finance assistant that extracts structured transactions." },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    return { success: true, data: parsed };
  } catch (err) {
    console.error("AI parse failed:", err);
    return {
      success: false,
      data: null,
      error: "AI parsing failed",
    };
  }
}
