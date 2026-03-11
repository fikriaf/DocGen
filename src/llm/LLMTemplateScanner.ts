import OpenAI from 'openai';

export class LLMTemplateScanner {
  private static getClient(): OpenAI {
    const apiKey = process.env.LLM_API_KEY || 'sk-sp-accba543725045d3ac24233cf0d97e48';
    
    return new OpenAI({
      baseURL: process.env.LLM_BASE_URL || 'https://coding-intl.dashscope.aliyuncs.com/v1',
      apiKey,
    });
  }

  static async scanFieldsFromText(text: string): Promise<string[]> {
    const client = this.getClient();
    const model = 'qwen3.5-plus';

    const prompt = `You are a document analyzer assistant. 
I will provide you with the raw text extracted from a business document (like an invoice, receipt, or proposal).
Some variables might be explicitly marked with {{field_name}} or {field_name}.
However, if there are NO such markers, I want you to act as a template engine and automatically identify which pieces of information in the document SHOULD BE dynamic fields.

For example, if the text contains: "Invoice No: INV-2023-001" and "Date: 12 Oct 2023" and "Total: $500", 
you should identify "invoice_no", "date", and "total" as potential dynamic fields.

Document text:
---
${text.substring(0, 4000)}
---

Respond ONLY with a valid JSON array of strings representing the field names in snake_case. 
Do not include any explanation, markdown, or code blocks.
Example output:
["invoice_no", "invoice_date", "client_name", "client_address", "total_amount"]
`;

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 1000,
      });

      const raw = completion.choices[0]?.message?.content ?? '';
      if (!raw) return [];

      // Extract JSON array
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]) as string[];
      }
      
      return [];
    } catch (err) {
      console.warn('[LLMTemplateScanner] LLM scan gagal:', err);
      return [];
    }
  }
}
