import { Request, Response } from 'express';
import { LLMFieldParser } from '../llm/LLMFieldParser';
import { PDFScanner } from '../engine/PDFScanner';
import { DataExtractor } from '../engine/DataExtractor';
import { ZodError } from 'zod';

// ── POST /api/v1/scan ─────────────────────────────────────────────────────

export async function scanDocument(req: Request, res: Response): Promise<void> {
  // File sudah di-attach oleh multer middleware sebagai req.file
  if (!req.file) {
    res.status(400).json({ success: false, error: 'File PDF wajib di-upload (field name: file)' });
    return;
  }

  // templateId opsional — dari query string, default ke _generic
  const templateId = (req.query['templateId'] as string | undefined) ?? '_generic';

  try {
    // 1. Extract teks dari PDF (dengan OCR fallback jika image-based)
    const scanResult = await PDFScanner.scan(req.file.buffer);

    let extracted: Record<string, unknown>;
    let confidence: Record<string, number>;
    let avgConfidence: number;
    let method: string;

    if (scanResult.usedOCR) {
      // 2a. PDF image-based → pakai LLMFieldParser untuk extract fields dari OCR text
      console.log('[scanDocument] usedOCR=true → LLMFieldParser');
      
      // Menggunakan fallback empty fields karena TemplateLoader dihilangkan
      const fields: any[] = [];

      const parsed = await LLMFieldParser.parse(scanResult.text, templateId, fields);
      extracted = parsed.extracted;
      confidence = parsed.confidence;
      console.log('[scanDocument] LLMFieldParser result keys:', Object.keys(extracted));

      const scores = Object.values(confidence);
      avgConfidence =
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
          : 0;
      method = 'ocr+llm';
    } else {
      // 2b. PDF text-based → DataExtractor (regex)
      console.log('[scanDocument] usedOCR=false → DataExtractor (regex)');
      const extraction = DataExtractor.extract(scanResult, templateId);
      extracted = extraction.extracted;
      confidence = extraction.confidence;
      avgConfidence = extraction.avgConfidence;
      method = 'regex';
    }

    res.status(200).json({
      success: true,
      templateId,
      numPages: scanResult.numPages,
      method,
      usedOCR: scanResult.usedOCR,
      avgConfidence,
      extracted,
      confidence,
      rawText: scanResult.text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[scanDocument] Error:', err);
    res.status(500).json({ success: false, error: 'Gagal scan PDF', detail: message });
  }
}
