import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

export const convertImagesToPDF = async (images: File[]): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();

  for (const image of images) {
    const imageBytes = await image.arrayBuffer();
    let embeddedImage;

    if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else if (image.type === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else {
      throw new Error(`Unsupported image type: ${image.type}`);
    }

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const imageAspectRatio = embeddedImage.width / embeddedImage.height;
    const pageAspectRatio = width / height;

    let imageWidth, imageHeight;
    if (imageAspectRatio > pageAspectRatio) {
      imageWidth = width * 0.9;
      imageHeight = imageWidth / imageAspectRatio;
    } else {
      imageHeight = height * 0.9;
      imageWidth = imageHeight * imageAspectRatio;
    }

    const x = (width - imageWidth) / 2;
    const y = (height - imageHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const convertTextToPDF = async (text: string, title?: string): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  const margin = 50;

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let yPosition = height - margin;

  if (title) {
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: 16,
      font: titleFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;
  }

  const lines = text.split('\n');
  const maxWidth = width - 2 * margin;

  for (const line of lines) {
    const words = line.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          if (yPosition < margin) {
            page = pdfDoc.addPage();
            yPosition = height - margin;
          }
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      if (yPosition < margin) {
        page = pdfDoc.addPage();
        yPosition = height - margin;
      }
      page.drawText(currentLine, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const splitPDF = async (file: File, startPage: number, endPage: number): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdfDoc = await PDFDocument.create();

  const pageIndices = Array.from(
    { length: endPage - startPage + 1 }, 
    (_, i) => startPage - 1 + i
  );

  const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdfDoc.addPage(page));

  const pdfBytes = await newPdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const compressPDF = async (file: File): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Basic compression by re-saving the PDF
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
    addDefaultPage: false,
  });
  
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const addImageToPDF = async (
  pdfFile: File, 
  imageFile: File, 
  pageNumber: number, 
  x: number, 
  y: number,
  width?: number,
  height?: number
): Promise<Blob> => {
  const pdfArrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
  
  const imageBytes = await imageFile.arrayBuffer();
  let embeddedImage;

  if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
    embeddedImage = await pdfDoc.embedJpg(imageBytes);
  } else if (imageFile.type === 'image/png') {
    embeddedImage = await pdfDoc.embedPng(imageBytes);
  } else {
    throw new Error(`Unsupported image type: ${imageFile.type}`);
  }

  const pages = pdfDoc.getPages();
  if (pageNumber > pages.length) {
    throw new Error('Page number exceeds PDF page count');
  }

  const page = pages[pageNumber - 1];
  const imageWidth = width || embeddedImage.width * 0.5;
  const imageHeight = height || embeddedImage.height * 0.5;

  page.drawImage(embeddedImage, {
    x,
    y,
    width: imageWidth,
    height: imageHeight,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const downloadFile = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};