export const config = {
  api: {
    bodyParser: { sizeLimit: '20mb' },
  },
};

const MODEL = 'gemini-3-flash-preview';

const PROMPT = `You are an expert math tutor. Solve every math problem provided — whether from an image, typed text, or both.

For EACH distinct problem found, respond in this EXACT JSON format (return an array):

[
  {
    "problem": "State the problem clearly (use LaTeX for math: wrap in $ or $$)",
    "steps": [
      {
        "title": "Short step title",
        "explanation": "Clear explanation of this step",
        "math": "LaTeX expression for this step (optional, leave empty string if not needed)"
      }
    ],
    "final_answer": "The complete final answer with units if applicable"
  }
]

IMPORTANT:
- Return ONLY a valid JSON array. No markdown code blocks, no extra text before or after.
- Use LaTeX notation for all math expressions (e.g., x^2, \\frac{a}{b}, \\sqrt{x})
- Be thorough with steps — show all work
- If no math problem is found, return: [{"problem":"No math problem found","steps":[{"title":"Note","explanation":"I couldn't detect a math problem. Please type one or upload a clearer photo.","math":""}],"final_answer":"N/A"}]`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel environment variables.' });
  }

  const { images = [], question = '' } = req.body;

  if (images.length === 0 && !question.trim()) {
    return res.status(400).json({ error: 'Please provide an image or type a math problem.' });
  }

  const parts = [
    ...images.map(img => ({
      inline_data: { mime_type: img.mimeType, data: img.base64 },
    })),
    ...(question.trim() ? [{ text: `The user typed this problem: ${question.trim()}` }] : []),
    { text: PROMPT },
  ];

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.1 },
        }),
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = data?.error?.message || `Gemini API error ${upstream.status}`;
      return res.status(upstream.status).json({ error: msg });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
}
