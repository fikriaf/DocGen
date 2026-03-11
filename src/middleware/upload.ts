import multer from 'multer';
import { Request } from 'express';

/**
 * Multer middleware untuk upload file PDF dan DOCX.
 */

const storage = multer.memoryStorage();

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diperbolehkan'));
  }
}

export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single('file');

export const uploadDocx = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname.endsWith('.docx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file DOCX yang diperbolehkan'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');
