import React, { useState } from 'react';
import { Download } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { convertTextToPDF, downloadFile } from '../../utils/pdfUtils';

const TextToPDF: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Blob | null>(null);

  const convertToPDF = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const pdfBlob = await convertTextToPDF(text, title || undefined);
      setProcessedPDF(pdfBlob);
    } catch (error) {
      console.error('Error converting text to PDF:', error);
      alert('Failed to convert text to PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (processedPDF) {
      const filename = title ? `${title}.pdf` : 'text-document.pdf';
      downloadFile(processedPDF, filename);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Convert Text to PDF
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste your text here..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {text.trim() && (
          <button
            onClick={convertToPDF}
            disabled={isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to PDF'}
          </button>
        )}

        {isProcessing && (
          <div className="py-8">
            <LoadingSpinner text="Converting text to PDF..." />
          </div>
        )}

        {processedPDF && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-green-800 dark:text-green-400">
                  PDF Created Successfully!
                </h3>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Your text has been converted to a PDF document.
                </p>
              </div>
              <button
                onClick={downloadPDF}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToPDF;