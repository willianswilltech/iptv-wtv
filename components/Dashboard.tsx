
import React, { useMemo, useState, useEffect } from 'react';
import { Client, Plan, NotificationLog } from '../types';
import { getClientStatus, formatDate } from '../utils/dateUtils';
import { UsersIcon, ClipboardDocumentListIcon, ExclamationTriangleIcon, CheckCircleIcon as CheckCircleIconOutline, PaperAirplaneIcon as PaperAirplaneIconOutline, PhotoIcon, BellAlertIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Modal from './ui/Modal';
import ConfirmationModal from './ui/ConfirmationModal';
import { addDays, parseISO, formatISO, isBefore } from 'date-fns';

// Modal component for sending reminders
interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clientsToNotify: Client[];
  plans: Plan[];
  messageGenerator: (client: Client, plan?: Plan) => string;
  onNotificationSent: (notification: Omit<NotificationLog, 'id' | 'sentAt'>) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  title,
  clientsToNotify,
  plans,
  messageGenerator,
  onNotificationSent,
}) => {
  const [sentStatus, setSentStatus] = useState<{ [clientId: string]: { sent: boolean; sticker: boolean } }>({});
  const [selectedStickers, setSelectedStickers] = useState<{ [clientId: string]: File | null }>({});

  const handleStickerChange = (clientId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedStickers(prev => ({ ...prev, [clientId]: e.target.files[0] }));
    }
  };

  const handleSendMessage = async (client: Client) => {
    const stickerFile = selectedStickers[client.id];
    let stickerCopied = false;

    if (stickerFile) {
        try {
            const blob = new Blob([stickerFile], { type: stickerFile.type });
            const clipboardItem = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([clipboardItem]);
            stickerCopied = true;
        } catch (error) {
            console.error("Failed to copy sticker to clipboard:", error);
            alert("Não foi possível copiar o sticker. Você pode arrastar o arquivo manualmente para a conversa do WhatsApp.");
        }
    }

    const plan = plans.find(p => p.id === client.planId);
    const message = messageGenerator(client, plan);
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${client.phone}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    onNotificationSent({
        clientId: client.id,
        clientName: client.fullName,
        message: message,
    });
    
    setSentStatus(prev => ({ ...prev, [client.id]: { sent: true, sticker: stickerCopied } }));
  };
  
  // Reseta o status de envio ao abrir o modal
  useEffect(() => {
    if (isOpen) {
        setSentStatus({});
        setSelectedStickers({});
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Clique em "Enviar" para abrir uma conversa no WhatsApp com uma mensagem pronta.
        </p>
         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Para incluir uma figurinha, clique em "Adicionar Sticker", selecione o arquivo, e ao enviar a mensagem, o sticker será copiado para sua área de transferência. Basta colar (Ctrl+V) na conversa.
        </p>
        <div className="max-h-80 overflow-y-auto pr-2">
          {clientsToNotify.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {clientsToNotify.map(client => (
                <li key={client.id} className="py-3">
                  <div className="flex justify-between items-center gap-4">
                     <div>
                        <p className="font-medium text-gray-900 dark:text-white">{client.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</p>
                    </div>
                    <button
                        onClick={() => handleSendMessage(client)}
                        disabled={sentStatus[client.id]?.sent}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg font-semibold text-white transition-colors shadow-sm text-sm whitespace-nowrap ${
                        sentStatus[client.id]?.sent
                            ? 'bg-green-600 cursor-not-allowed'
                            : 'bg-teal-500 hover:bg-teal-600'
                        }`}
                    >
                        {sentStatus[client.id]?.sent ? (
                        <>
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            {sentStatus[client.id]?.sticker ? 'Enviado e Copiado' : 'Enviado'}
                        </>
                        ) : (
                        <>
                            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                            Enviar
                        </>
                        )}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                     <label htmlFor={`sticker-${client.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md">
                        <PhotoIcon className="h-4 w-4" />
                        {selectedStickers[client.id] ? 'Trocar Sticker' : 'Adicionar Sticker'}
                    </label>
                    <input
                        id={`sticker-${client.id}`}
                        type="file"
                        accept="image/webp, image/png, image/gif"
                        className="hidden"
                        onChange={(e) => handleStickerChange(client.id, e)}
                    />
                    {selectedStickers[client.id] && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs" title={selectedStickers[client.id]?.name}>
                            {selectedStickers[client.id]?.name}
                        </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum cliente para notificar.</p>
          )}
        </div>
        <div className="flex justify-end mt-6">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
                Fechar
            </button>
        </div>
      </div>
    </Modal>
  );
};

interface DashboardProps {
  clients: Client[];
  plans: Plan[];
  addNotifications: (notifications: Omit<NotificationLog, 'id' | 'sentAt'>[]) => void;
  onUpdateClient: (client: Client) => void;
}

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; color: string }> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ clients, plans, addNotifications, onUpdateClient }) => {
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    clients: Client[];
    messageGenerator: (client: Client, plan?: Plan) => string;
  } | null>(null);
  const [renewalClient, setRenewalClient] = useState<Client | null>(null);

  const stats = useMemo(() => {
    const activeClients = clients.filter(c => getClientStatus(c.expirationDate).text !== 'Expirado').length;
    const expiringSoon = clients.filter(c => getClientStatus(c.expirationDate).text === 'Vencendo').length;
    return {
      totalClients: clients.length,
      activeClients: activeClients,
      expiringSoon: expiringSoon,
      totalPlans: plans.length
    }
  }, [clients, plans]);
  
  const handleOpen3DayReminders = () => {
    const expiringClients = clients.filter(c => getClientStatus(c.expirationDate).daysRemaining === 3);
    if (expiringClients.length === 0) {
        alert('Nenhum cliente com vencimento em exatamente 3 dias.');
        return;
    }
    setModalConfig({
        title: 'Lembretes (Vence em 3 dias)',
        clients: expiringClients,
        messageGenerator: (client, plan) => `Olá, ${client.fullName}! Seu plano IPTV vence em 3 dias. Valor: R$${plan?.monthlyValue.toFixed(2)}. Para renovar, entre em contato conosco.`
    });
  };
  
  const handleOpenTodayReminders = () => {
    const expiringClients = clients.filter(c => getClientStatus(c.expirationDate).daysRemaining === 0);
    if (expiringClients.length === 0) {
        alert('Nenhum cliente com vencimento hoje.');
        return;
    }
    setModalConfig({
        title: 'Avisos (Vence Hoje)',
        clients: expiringClients,
        messageGenerator: (client, plan) => `Olá, ${client.fullName}! Gostaríamos de lembrar que seu plano IPTV vence hoje. Valor: R$${plan?.monthlyValue.toFixed(2)}. Evite a interrupção do serviço! Fale conosco para renovar.`
    });
  };

  const handleOpenOverdueReminders = () => {
    const overdueClients = clients.filter(c => getClientStatus(c.expirationDate).daysRemaining === -1);
     if (overdueClients.length === 0) {
        alert('Nenhum cliente com plano vencido ontem.');
        return;
    }
    setModalConfig({
        title: 'Cobrança (Vencido)',
        clients: overdueClients,
        messageGenerator: (client, plan) => `Olá, ${client.fullName}. Identificamos que seu plano IPTV venceu ontem. Para reativar seu acesso e continuar aproveitando, por favor, entre em contato.`
    });
  };

  const handleNotificationSent = (notification: Omit<NotificationLog, 'id' | 'sentAt'>) => {
    addNotifications([notification]);
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
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <div className="flex flex-wrap gap-2 justify-center">
            <button
                onClick={handleOpen3DayReminders}
                className="flex items-center justify-center bg-teal-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-sm text-sm"
            >
                <PaperAirplaneIconOutline className="h-5 w-5 mr-2" />
                Lembretes (3 dias)
            </button>
             <button
                onClick={handleOpenTodayReminders}
                className="flex items-center justify-center bg-orange-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm text-sm"
            >
                <BellAlertIcon className="h-5 w-5 mr-2" />
                Avisos (Vence Hoje)
            </button>
             <button
                onClick={handleOpenOverdueReminders}
                className="flex items-center justify-center bg-red-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-sm text-sm"
            >
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                Cobrança (Vencidos)
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={UsersIcon} title="Total de Clientes" value={stats.totalClients} color="bg-blue-500" />
        <StatCard icon={CheckCircleIconOutline} title="Clientes Ativos" value={stats.activeClients} color="bg-green-500" />
        <StatCard icon={ExclamationTriangleIcon} title="Vencendo em 3 dias" value={stats.expiringSoon} color="bg-yellow-500" />
        <StatCard icon={ClipboardDocumentListIcon} title="Planos Disponíveis" value={stats.totalPlans} color="bg-indigo-500" />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Clientes com Vencimento Próximo</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plano</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vencimento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dias Restantes</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                 {clients
                  .map(client => ({...client, status: getClientStatus(client.expirationDate)}))
                  .filter(client => client.status.daysRemaining >= 0 && client.status.daysRemaining <= 7)
                  .sort((a,b) => a.status.daysRemaining - b.status.daysRemaining)
                  .map(client => {
                    const plan = plans.find(p => p.id === client.planId);
                    return (
                        <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{client.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{plan?.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(client.expirationDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600 dark:text-yellow-400">{client.status.daysRemaining}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => openRenewalConfirmation(client)}
                                  title="Renovação Rápida"
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <ArrowPathIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    );
                 })}
              </tbody>
            </table>
        </div>
      </div>
      {modalConfig && (
        <ReminderModal
            isOpen={!!modalConfig}
            onClose={() => setModalConfig(null)}
            title={modalConfig.title}
            clientsToNotify={modalConfig.clients}
            plans={plans}
            messageGenerator={modalConfig.messageGenerator}
            onNotificationSent={handleNotificationSent}
        />
      )}
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

export default Dashboard;
