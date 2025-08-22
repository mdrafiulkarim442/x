import React, { useState } from 'react';
import { Download } from 'lucide-react';
import FileUpload from '../Common/FileUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import { convertImagesToPDF, downloadFile } from '../../utils/pdfUtils';

const ImageToPDF: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Blob | null>(null);

  const handleImagesSelected = (files: File[]) => {
    setImages(prev => [...prev, ...files]);
    setProcessedPDF(null);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setProcessedPDF(null);
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    try {
      const pdfBlob = await convertImagesToPDF(images);
      setProcessedPDF(pdfBlob);
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('Failed to convert images to PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (processedPDF) {
      downloadFile(processedPDF, 'converted-images.pdf');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Convert Images to PDF
      </h2>
      
      <div className="space-y-6">
        <FileUpload
          onFilesSelected={handleImagesSelected}
          acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
          multiple={true}
          uploadedFiles={images}
          onRemoveFile={removeImage}
        />

        {images.length > 0 && (
          <div className="flex space-x-4">
            <button
              onClick={convertToPDF}
              disabled={isProcessing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="py-8">
            <LoadingSpinner text="Converting images to PDF..." />
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
                  Your images have been converted to a PDF document.
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

export default ImageToPDF;