const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function analyzeImage(base64Image, prompt) {
  if (!GEMINI_KEY || GEMINI_KEY === 'your_key_here') {
    throw new Error('Add your real Gemini API key to .env first.');
  }

  if (!base64Image) {
    throw new Error('No image data was captured.');
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${details}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return normalizeAnalysis(parseJsonResponse(text));
}

function parseJsonResponse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return valid JSON.');
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (innerErr) {
      throw new Error('Gemini did not return valid JSON.');
    }
  }
}

function normalizeAnalysis(value) {
  const objects = Array.isArray(value.objects)
    ? value.objects.map(String)
    : splitList(value.objects);

  return {
    objects: objects.length ? objects : ['No clear objects identified'],
    context: toText(value.context, 'No context provided.'),
    activity: toText(value.activity, 'No activity described.'),
    recommendations: toText(
      value.recommendations,
      'No recommendations provided.'
    ),
  };
}

function splitList(value) {
  if (typeof value !== 'string') return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toText(value, fallback) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return fallback;
}
