
import React, { useState, useEffect } from 'react';
import { Server } from '../types';
import Modal from './ui/Modal';

interface ServerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: Server) => void;
  server: Server | null;
}

const initialServerState: Omit<Server, 'id'> = {
  name: '',
  url: '',
};

const ServerFormModal: React.FC<ServerFormModalProps> = ({ isOpen, onClose, onSave, server }) => {
  const [formData, setFormData] = useState<Omit<Server, 'id'>>(initialServerState);

  useEffect(() => {
    if (server) {
      setFormData(server);
    } else {
      setFormData(initialServerState);
    }
  }, [server, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Server);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={server ? 'Editar Servidor' : 'Adicionar Servidor'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Servidor</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL do Servidor</label>
          <input
            type="text"
            name="url"
            id="url"
            value={formData.url}
            onChange={handleChange}
            required
            placeholder="http://exemplo.com:8080"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ServerFormModal;
