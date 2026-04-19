export async function optimizeQuery(query: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content: `You are a shopping search optimizer for Indian e-commerce. 
Convert the user's query into the most effective product search string.
- Be specific: include brand, model, key spec if implied
- Remove filler words
- Return ONLY the optimized search string, nothing else.
Examples:
"ps5" → "Sony PlayStation 5 Console"
"good headphones under 2000" → "wireless headphones under 2000 rupees"
"mousepad" → "gaming mousepad large"`,
        },
        {
          role: "user",
          content: query,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? query;
}