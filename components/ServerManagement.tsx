
import React, { useState } from 'react';
import { Server } from '../types';
import ServerFormModal from './ServerFormModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ServerManagementProps {
  servers: Server[];
  onAddServer: (server: Omit<Server, 'id'>) => Promise<void>;
  onUpdateServer: (server: Server) => Promise<void>;
  onDeleteServer: (serverId: string) => Promise<void>;
}

const ServerManagement: React.FC<ServerManagementProps> = ({ servers, onAddServer, onUpdateServer, onDeleteServer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);

  const handleOpenModal = (server: Server | null = null) => {
    setEditingServer(server);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingServer(null);
    setIsModalOpen(false);
  };

  const handleSaveServer = async (server: Server) => {
    if (editingServer) {
      await onUpdateServer({ ...server, id: editingServer.id });
    } else {
      await onAddServer(server);
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Servidores</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Adicionar Servidor
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome do Servidor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {servers.map(server => (
                <tr key={server.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{server.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <a href={server.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
                      {server.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(server)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                       <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button onClick={() => onDeleteServer(server.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ServerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveServer}
        server={editingServer}
      />
    </div>
  );
};

export default ServerManagement;
