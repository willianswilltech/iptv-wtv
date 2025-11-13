
import React, { useState, useEffect } from 'react';
import { Client, Plan, Server } from '../types';
import Modal from './ui/Modal';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  client: Client | null;
  plans: Plan[];
  servers: Server[];
}

const initialClientState = {
  fullName: '',
  phone: '',
  cityState: '',
  iptvLogin: '',
  iptvPassword: '',
  activationDate: new Date().toISOString().split('T')[0],
  expirationDate: '',
  planId: '',
  serverId: '',
  hasReminder: false,
};

// FIX: Define a specific type for client fields that are strings to avoid type errors with boolean fields like 'hasReminder'.
type ClientStringField = 'fullName' | 'phone' | 'cityState' | 'iptvLogin' | 'iptvPassword' | 'activationDate' | 'expirationDate';

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, client, plans, servers }) => {
  const [formData, setFormData] = useState<Omit<Client, 'id'>>(initialClientState);

  useEffect(() => {
    if (client) {
      setFormData({ ...initialClientState, ...client });
    } else {
      setFormData(initialClientState);
    }
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ 
        ...prev, 
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.planId && formData.serverId) {
       onSave(formData as Client);
    } else {
      alert("Por favor, selecione um plano e um servidor.");
    }
  };
  
  const formFields: { name: ClientStringField; label: string; type: string; required: boolean }[] = [
    { name: 'fullName', label: 'Nome Completo', type: 'text', required: true },
    { name: 'phone', label: 'Telefone (WhatsApp)', type: 'tel', required: true },
    { name: 'cityState', label: 'Cidade/Estado', type: 'text', required: true },
    { name: 'iptvLogin', label: 'Login IPTV', type: 'text', required: true },
    { name: 'iptvPassword', label: 'Senha IPTV', type: 'text', required: false },
    { name: 'activationDate', label: 'Data de Ativação', type: 'date', required: true },
    { name: 'expirationDate', label: 'Data de Vencimento', type: 'date', required: true },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? 'Editar Cliente' : 'Adicionar Cliente'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map(field => (
                 <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    />
                </div>
            ))}
            <div>
              <label htmlFor="planId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plano</label>
              <select
                name="planId"
                id="planId"
                value={formData.planId}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              >
                <option value="">Selecione um plano</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - R${plan.monthlyValue.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="serverId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Servidor</label>
              <select
                name="serverId"
                id="serverId"
                value={formData.serverId}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              >
                <option value="">Selecione um servidor</option>
                {servers.map(server => (
                  <option key={server.id} value={server.id}>
                    {server.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex items-center pt-2">
              <input
                  type="checkbox"
                  name="hasReminder"
                  id="hasReminder"
                  checked={!!formData.hasReminder}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="hasReminder" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Adicionar Lembrete (Ex: renovado, não pago)
              </label>
            </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;