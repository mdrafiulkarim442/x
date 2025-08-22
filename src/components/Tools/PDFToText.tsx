import React, { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import FileUpload from '../Common/FileUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import { extractTextFromPDF } from '../../utils/pdfUtils';

const PDFToText: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setPdfFile(files[0]);
      setExtractedText('');
    }
  };

  const extractText = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(pdfFile);
      setExtractedText(text);
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Failed to extract text from PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      alert('Text copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdfFile?.name.replace('.pdf', '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Extract Text from PDF
      </h2>
      
      <div className="space-y-6">
        <FileUpload
          onFilesSelected={handleFileSelected}
          acceptedTypes={['application/pdf']}
          multiple={false}
          uploadedFiles={pdfFile ? [pdfFile] : []}
          onRemoveFile={() => {
            setPdfFile(null);
            setExtractedText('');
          }}
        />

        {pdfFile && !extractedText && (
          <button
            onClick={extractText}
            disabled={isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Extracting...' : 'Extract Text'}
          </button>
        )}

        {isProcessing && (
          <div className="py-8">
            <LoadingSpinner text="Extracting text from PDF..." />
          </div>
        )}

        {extractedText && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Extracted Text
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={downloadText}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                {extractedText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFToText;