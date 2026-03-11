declare module 'pizzip' {
  export default class PizZip {
    constructor(data?: Buffer | Uint8Array | string | null);
    file(name: string): { asText(): string } | null;
    generate(options: { type: string }): Buffer;
    getZip(): PizZip;
  }
}

declare module 'docxtemplater' {
  export default class Docxtemplater {
    constructor(zip: any, options?: any);
    render(data: Record<string, any>): void;
    getZip(): any;
    getFullText(): string;
  }
}

declare module 'mammoth' {
  export function convertToHtml(options: { buffer: Buffer }): Promise<{ value: string }>;
}
