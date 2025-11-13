
import React from 'react';
import { NotificationLog } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationHistoryProps {
  notifications: NotificationLog[];
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ notifications }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Histórico de Notificações</h2>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mensagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data de Envio</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map(log => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-md truncate">{log.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {format(new Date(log.sentAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationHistory;
