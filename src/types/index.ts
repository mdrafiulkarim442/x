export interface PDFFile {
  file: File;
  name: string;
  size: number;
  pages?: number;
  preview?: string;
}

export interface ProcessedResult {
  type: 'pdf' | 'image' | 'text';
  data: Blob | string;
  filename: string;
}

export interface AIResponse {
  summary?: string;
  translation?: string;
  answer?: string;
  title?: string;
  keywords?: string[];
}

export type ToolType = 
  | 'image-to-pdf'
  | 'pdf-to-image' 
  | 'pdf-to-text'
  | 'text-to-pdf'
  | 'split-pdf'
  | 'compress-pdf'
  | 'add-image'
  | 'preview-pdf'
  | 'ocr'
  | 'summarize'
  | 'translate'
  | 'chat'
  | 'auto-generate';