import React, { useState, useCallback } from 'react';
import { MessageTemplate } from '../types';

interface TemplateEditorProps {
  templates: MessageTemplate[];
  onUpdateTemplate: (template: MessageTemplate) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ templates, onUpdateTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>(templates[0]);
  const [content, setContent] = useState<string>(templates[0].content);

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setContent(template.content);
  };

  const handleSave = () => {
    onUpdateTemplate({ ...selectedTemplate, content });
    alert('Modelo salvo com sucesso!');
  };

  return (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Editor de Modelos de Mensagem</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Modelos Disponíveis</h3>
                <ul>
                    {templates.map(template => (
                        <li key={template.id}>
                            <button 
                                onClick={() => handleSelectTemplate(template)}
                                className={`w-full text-left p-3 rounded-md transition-colors ${selectedTemplate.id === template.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                {template.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Editando: {selectedTemplate.name}</h3>
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Placeholders disponíveis:</h4>
                    <div className="flex flex-wrap gap-2">
                        {['[Nome]', '[Plano]', '[Vencimento]', '[Valor]'].map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md">{tag}</span>
                        ))}
                    </div>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={handleSave} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Salvar Modelo
                </button>
            </div>
        </div>
    </div>
  );
};

export default TemplateEditor;