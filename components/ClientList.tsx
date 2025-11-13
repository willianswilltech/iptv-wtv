import React, { useState, useMemo } from 'react';
import { Client, Plan, Server } from '../types';
import StatusBadge from './ui/StatusBadge';
import { formatDate } from '../utils/dateUtils';
import { PencilIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/solid';
import { addDays, parseISO, formatISO, isBefore } from 'date-fns';
import ConfirmationModal from './ui/ConfirmationModal';

interface ClientListProps {
  clients: Client[];
  plans: Plan[];
  servers: Server[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onUpdateClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, plans, servers, onEdit, onDelete, onUpdateClient }) => {
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showOnlyWithReminder, setShowOnlyWithReminder] = useState(false);
  const [renewalClient, setRenewalClient] = useState<Client | null>(null);

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client =>
      (client.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      client.iptvLogin.toLowerCase().includes(filter.toLowerCase())) &&
      (!showOnlyWithReminder || client.hasReminder)
    );

    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof Client] as string;
      const fieldB = b[sortField as keyof Client] as string;

      if (sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    return filtered;
  }, [clients, filter, sortField, sortDirection, showOnlyWithReminder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openRenewalConfirmation = (client: Client) => {
    setRenewalClient(client);
  };
  
  const closeRenewalConfirmation = () => {
    setRenewalClient(null);
  };

  const handleQuickRenew = () => {
    if (!renewalClient) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const currentExpiration = parseISO(renewalClient.expirationDate);
    
    // Determine the base date for renewal. If expired, use today. If not, use the expiration date.
    const baseDate = isBefore(currentExpiration, today) ? today : currentExpiration;
    
    const newExpirationDate = addDays(baseDate, 30);
    
    const updatedClient: Client = {
      ...renewalClient,
      expirationDate: formatISO(newExpirationDate, { representation: 'date' }),
      hasReminder: false,
    };
    onUpdateClient(updatedClient);
    closeRenewalConfirmation();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar clientes por nome ou login..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center">
          <input
            id="reminder-filter"
            type="checkbox"
            checked={showOnlyWithReminder}
            onChange={e => setShowOnlyWithReminder(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="reminder-filter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Mostrar apenas com lembrete
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['fullName', 'planId', 'expirationDate', 'status'].map(field => (
                <th key={field} onClick={() => handleSort(field === 'status' ? 'expirationDate' : field)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                  {field === 'fullName' ? 'Cliente' : field === 'planId' ? 'Plano' : field === 'expirationDate' ? 'Vencimento' : 'Status'}
                  {sortField === (field === 'status' ? 'expirationDate' : field) && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedClients.map(client => {
              const plan = plans.find(p => p.id === client.planId);
              const server = servers.find(s => s.id === client.serverId);
              return (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{client.fullName}</span>
                       {client.hasReminder && (
                        <BellIcon className="h-4 w-4 ml-2 text-yellow-500" title="Cliente com lembrete de pagamento pendente" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{server?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{plan?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(client.expirationDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge expirationDate={client.expirationDate} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-4">
                    <button
                      onClick={() => openRenewalConfirmation(client)}
                      title="Renovação Rápida"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    <a
                      href={`https://wa.me/${client.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Enviar WhatsApp"
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5"/>
                    </a>
                    <button onClick={() => onEdit(client)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button onClick={() => onDelete(client.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                         <TrashIcon className="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={!!renewalClient}
        onClose={closeRenewalConfirmation}
        onConfirm={handleQuickRenew}
        title="Confirmar Renovação"
        message={
          renewalClient && (
            <p>
              Deseja renovar o plano de <strong>{renewalClient.fullName}</strong> por mais 30 dias?
              <br />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                A nova data de vencimento será calculada a partir de hoje (se expirado) ou da data de vencimento atual (se ativo).
              </span>
            </p>
          )
        }
        confirmText="Renovar"
      />
    </div>
  );
};

export default ClientList;
