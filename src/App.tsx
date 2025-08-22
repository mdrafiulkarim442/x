import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ImageToPDF from './components/Tools/ImageToPDF';
import PDFToText from './components/Tools/PDFToText';
import TextToPDF from './components/Tools/TextToPDF';
import OCRTool from './components/Tools/OCRTool';
import SummarizePDF from './components/Tools/SummarizePDF';
import ChatWithPDF from './components/Tools/ChatWithPDF';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('image-to-pdf');

  const renderTool = () => {
    switch (activeTool) {
      case 'image-to-pdf':
        return <ImageToPDF />;
      case 'pdf-to-text':
        return <PDFToText />;
      case 'text-to-pdf':
        return <TextToPDF />;
      case 'ocr':
        return <OCRTool />;
      case 'summarize':
        return <SummarizePDF />;
      case 'chat':
        return <ChatWithPDF />;
      default:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tool Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This tool is currently under development. Please check back soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar activeTool={activeTool} onToolChange={setActiveTool} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderTool()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;