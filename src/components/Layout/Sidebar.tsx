import React from 'react';
import { 
  Image, 
  FileImage, 
  FileText, 
  Type, 
  Scissors, 
  Archive, 
  ImagePlus,
  Eye,
  Scan,
  FileSearch,
  Languages,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { ToolType } from '../../types';

interface SidebarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolChange }) => {
  const tools = [
    {
      category: 'Convert',
      items: [
        { id: 'image-to-pdf' as ToolType, label: 'Image → PDF', icon: Image },
        { id: 'pdf-to-image' as ToolType, label: 'PDF → Image', icon: FileImage },
        { id: 'pdf-to-text' as ToolType, label: 'PDF → Text', icon: FileText },
        { id: 'text-to-pdf' as ToolType, label: 'Text → PDF', icon: Type },
      ]
    },
    {
      category: 'Edit',
      items: [
        { id: 'split-pdf' as ToolType, label: 'Split PDF', icon: Scissors },
        { id: 'compress-pdf' as ToolType, label: 'Compress PDF', icon: Archive },
        { id: 'add-image' as ToolType, label: 'Add Image', icon: ImagePlus },
        { id: 'preview-pdf' as ToolType, label: 'Preview PDF', icon: Eye },
      ]
    },
    {
      category: 'AI Tools',
      items: [
        { id: 'ocr' as ToolType, label: 'OCR Extract', icon: Scan },
        { id: 'summarize' as ToolType, label: 'Summarize', icon: FileSearch },
        { id: 'translate' as ToolType, label: 'Translate', icon: Languages },
        { id: 'chat' as ToolType, label: 'Chat with PDF', icon: MessageCircle },
        { id: 'auto-generate' as ToolType, label: 'Auto Generate', icon: Sparkles },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {tools.map((category) => (
          <div key={category.category}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {category.category}
            </h3>
            <div className="space-y-1">
              {category.items.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    className={`sidebar-item w-full ${activeTool === tool.id ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;