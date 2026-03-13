import OpenAI from 'openai';

export class LLMSmartReplacer {
  private static getClient(): OpenAI {
    const apiKey = process.env.LLM_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('API key tidak di-set di environment variables (LLM_API_KEY atau OPENROUTER_API_KEY)');

    return new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL || 'https://coding-intl.dashscope.aliyuncs.com/v1',
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': process.env.APP_SITE_URL ?? 'http://localhost:3000',
        'X-Title': process.env.APP_SITE_NAME ?? 'DocGen Engine',
      },
    });
  }

  static async findReplacements(
    htmlText: string,
    payload: Record<string, any>
  ): Promise<{ old: string; new: string }[]> {
    const client = this.getClient();
    const model = process.env.LLM_MODEL || 'qwen3.5-plus'; // Use whatever model is configured

    // Clean HTML to just text to save tokens and avoid confusing the LLM with tags
    const plainText = htmlText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

    const prompt = `You are a strict data extraction and replacement assistant.
I have a text document that acts as a filled-out template, and a JSON payload of NEW values to replace the old ones.

Document Text (excerpt):
${plainText.substring(0, 8000)}

New values to inject:
${JSON.stringify(payload, null, 2)}

Your task:
Identify the exact literal strings currently in the document that represent the old values corresponding to the payload keys.
Return a JSON array of objects with "old" (the exact string to be replaced in the text) and "new" (the value from the payload).
If a payload key doesn't seem to match anything in the text, skip it.

Example output format:
[
  {"old": "MELLY CANDRAWAN CICIKELOLA", "new": "Bapak Anton Supriadi"},
  {"old": "CAEGR-INV-260227-MCT26", "new": "INV-12345"},
  {"old": "27 February 2026", "new": "13 Maret 2026"}
]

Respond with ONLY the raw JSON array. Do not wrap in markdown \`\`\`json.`;

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      });

      let raw = completion.choices[0]?.message?.content ?? '[]';
      
      // Cleanup markdown if LLM still returned it
      if (raw.startsWith('```json')) raw = raw.replace(/^```json/g, '').replace(/```$/g, '');
      if (raw.startsWith('```')) raw = raw.replace(/^```/g, '').replace(/```$/g, '');
      
      const parsed = JSON.parse(raw.trim());
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.warn('[LLMSmartReplacer] LLM failed to find replacements:', err);
      return [];
    }
  }
}
