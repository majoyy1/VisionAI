const JSON_SHAPE = `Return only valid JSON with this exact shape:
{
  "objects": ["object 1", "object 2"],
  "context": "One short paragraph describing the scene.",
  "activity": "What appears to be happening in the image.",
  "recommendations": "Practical recommendations based on what you see."
}`;

export const PROMPTS = {
  academic: `Act as a professor reviewing this image for a learning activity.
Focus on what a student could observe, explain, or improve.
${JSON_SHAPE}`,

  safety: `Act as a safety inspector reviewing this image.
Identify visible hazards, risky conditions, clutter, blocked paths, cords, sharp items, or unsafe behavior.
Make recommendations practical and safety-focused.
${JSON_SHAPE}`,

  inventory: `Act as an inventory assistant.
List visible assets and useful item categories as neutrally as possible.
Keep the context and recommendations concise.
${JSON_SHAPE}`,
};

export const PROMPT_LABELS = {
  academic: 'Academic Analysis',
  safety: 'Safety Analysis',
  inventory: 'Inventory Analysis',
};

