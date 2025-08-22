import React, { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import FileUpload from '../Common/FileUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import { extractTextFromPDF } from '../../utils/pdfUtils';
import { summarizePDF } from '../../utils/aiUtils';

const SummarizePDF: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setPdfFile(files[0]);
      setSummary('');
    }
  };

  const generateSummary = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(pdfFile);
      const summaryText = await summarizePDF(text);
      setSummary(summaryText);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy summary:', error);
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdfFile?.name.replace('.pdf', '')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        AI PDF Summarizer
      </h2>
      
      <div className="space-y-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-sm text-purple-800 dark:text-purple-400">
            Upload a PDF document and get an AI-generated summary of its content.
          </p>
        </div>

        <FileUpload
          onFilesSelected={handleFileSelected}
          acceptedTypes={['application/pdf']}
          multiple={false}
          uploadedFiles={pdfFile ? [pdfFile] : []}
          onRemoveFile={() => {
            setPdfFile(null);
            setSummary('');
          }}
        />

        {pdfFile && !summary && (
          <button
            onClick={generateSummary}
            disabled={isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Generating Summary...' : 'Generate AI Summary'}
          </button>
        )}

        {isProcessing && (
          <div className="py-8">
            <LoadingSpinner text="AI is analyzing and summarizing your PDF..." />
          </div>
        )}

        {summary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                AI Generated Summary
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
                  onClick={downloadSummary}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizePDF;