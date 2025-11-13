
import React, { useState } from 'react';
import { Client, Plan, Server } from '../types';
import ClientFormModal from './ClientFormModal';
import ClientList from './ClientList';

interface ClientManagementProps {
  clients: Client[];
  plans: Plan[];
  servers: Server[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, plans, servers, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleOpenModal = (client: Client | null = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSaveClient = (client: Client) => {
    if (editingClient) {
      onUpdateClient({ ...client, id: editingClient.id });
    } else {
      onAddClient(client);
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Clientes</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Adicionar Cliente
        </button>
      </div>

      <ClientList 
        clients={clients} 
        plans={plans}
        servers={servers} 
        onEdit={handleOpenModal} 
        onDelete={onDeleteClient}
        onUpdateClient={onUpdateClient} 
      />

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={editingClient}
        plans={plans}
        servers={servers}
      />
    </div>
  );
};

export default ClientManagement;