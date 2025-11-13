
import React, { useState, useEffect } from 'react';
import { Client, Plan, NotificationLog, MessageTemplate, Server } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import PlanManagement from './components/PlanManagement';
import ServerManagement from './components/ServerManagement';
import TemplateEditor from './components/TemplateEditor';
import NotificationHistory from './components/NotificationHistory';
import * as api from './services/apiService';

type View = 'dashboard' | 'clients' | 'plans' | 'servers' | 'templates' | 'history';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [
          clientsData,
          plansData,
          serversData,
          templatesData,
          notificationsData
        ] = await api.getAllData();
        
        setClients(clientsData);
        setPlans(plansData);
        setServers(serversData);
        setTemplates(templatesData);
        setNotifications(notificationsData);

      } catch (err) {
        setError('Falha ao carregar os dados do servidor. Por favor, tente recarregar a página.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addClient = async (client: Omit<Client, 'id'>) => {
    await api.addClient(client);
    setClients(await api.getClients());
  };

  const updateClient = async (updatedClient: Client) => {
    await api.updateClient(updatedClient);
    setClients(await api.getClients());
  };

  const deleteClient = async (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
        await api.deleteClient(clientId);
        setClients(await api.getClients());
    }
  };

  const addPlan = async (plan: Omit<Plan, 'id'>) => {
    await api.addPlan(plan);
    setPlans(await api.getPlans());
  };

  const updatePlan = async (updatedPlan: Plan) => {
    await api.updatePlan(updatedPlan);
    setPlans(await api.getPlans());
  };
  
  const deletePlan = async (planId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
        await api.deletePlan(planId);
        setPlans(await api.getPlans());
    }
  };
  
  const addServer = async (server: Omit<Server, 'id'>) => {
    await api.addServer(server);
    setServers(await api.getServers());
  };

  const updateServer = async (updatedServer: Server) => {
    await api.updateServer(updatedServer);
    setServers(await api.getServers());
  };

  const deleteServer = async (serverId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este servidor?')) {
        await api.deleteServer(serverId);
        setServers(await api.getServers());
    }
  };

  const updateTemplate = async (updatedTemplate: MessageTemplate) => {
    await api.updateTemplate(updatedTemplate);
    setTemplates(await api.getTemplates());
  };

  const addNotifications = async (newLogs: Omit<NotificationLog, 'id' | 'sentAt'>[]) => {
    await api.addNotifications(newLogs);
    setNotifications(await api.getNotifications());
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-semibold">Carregando dados...</span>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex justify-center items-center h-full text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erro!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard clients={clients} plans={plans} addNotifications={addNotifications} onUpdateClient={updateClient} />;
      case 'clients':
        return <ClientManagement clients={clients} plans={plans} servers={servers} onAddClient={addClient} onUpdateClient={updateClient} onDeleteClient={deleteClient} />;
      case 'plans':
        return <PlanManagement plans={plans} onAddPlan={addPlan} onUpdatePlan={updatePlan} onDeletePlan={deletePlan} />;
      case 'servers':
        return <ServerManagement servers={servers} onAddServer={addServer} onUpdateServer={updateServer} onDeleteServer={deleteServer} />;
      case 'templates':
        return <TemplateEditor templates={templates} onUpdateTemplate={updateTemplate} />;
      case 'history':
        return <NotificationHistory notifications={notifications} />;
      default:
        return <Dashboard clients={clients} plans={plans} addNotifications={addNotifications} onUpdateClient={updateClient} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
