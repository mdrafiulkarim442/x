import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import FileUpload from '../Common/FileUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import { extractTextFromPDF } from '../../utils/pdfUtils';
import { chatWithPDF } from '../../utils/aiUtils';

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatWithPDF: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const handleFileSelected = async (files: File[]) => {
    if (files.length > 0) {
      setPdfFile(files[0]);
      setMessages([]);
      setPdfText('');
      
      setIsLoadingPDF(true);
      try {
        const text = await extractTextFromPDF(files[0]);
        setPdfText(text);
        setMessages([{
          type: 'ai',
          content: `I've analyzed your PDF "${files[0].name}". You can now ask me questions about its content!`,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Failed to load PDF. Please try again.');
      } finally {
        setIsLoadingPDF(false);
      }
    }
  };

  const sendMessage = async () => {
    if (!currentQuestion.trim() || !pdfText) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: currentQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsProcessing(true);

    try {
      const response = await chatWithPDF(currentQuestion, pdfText);
      const aiMessage: ChatMessage = {
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Chat with PDF
      </h2>
      
      <div className="space-y-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <p className="text-sm text-indigo-800 dark:text-indigo-400">
            Upload a PDF and ask questions about its content. AI will analyze the document and provide intelligent answers.
          </p>
        </div>

        <FileUpload
          onFilesSelected={handleFileSelected}
          acceptedTypes={['application/pdf']}
          multiple={false}
          uploadedFiles={pdfFile ? [pdfFile] : []}
          onRemoveFile={() => {
            setPdfFile(null);
            setPdfText('');
            setMessages([]);
          }}
        />

        {isLoadingPDF && (
          <div className="py-8">
            <LoadingSpinner text="Loading and analyzing PDF..." />
          </div>
        )}

        {pdfText && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'ai' && (
                          <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <LoadingSpinner size="sm" text="AI is thinking..." />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about the PDF..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isProcessing || !currentQuestion.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithPDF;