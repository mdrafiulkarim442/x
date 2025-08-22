import React from 'react';
import { Moon, Sun, FileText, Brain } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <FileText className="w-8 h-8 text-primary-600" />
            <Brain className="w-4 h-4 text-primary-500 absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SmartPDF AI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smarter PDFs, Powered by AI
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;