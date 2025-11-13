
import React, { useState, useCallback, useMemo } from 'react';
import { Client, Plan, NotificationLog, MessageTemplate, Server } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import PlanManagement from './components/PlanManagement';
import ServerManagement from './components/ServerManagement';
import TemplateEditor from './components/TemplateEditor';
import NotificationHistory from './components/NotificationHistory';
import { DUMMY_CLIENTS, DUMMY_PLANS, DUMMY_NOTIFICATIONS, DUMMY_TEMPLATES, DUMMY_SERVERS } from './mockData';

type View = 'dashboard' | 'clients' | 'plans' | 'servers' | 'templates' | 'history';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>(DUMMY_CLIENTS);
  const [plans, setPlans] = useState<Plan[]>(DUMMY_PLANS);
  const [servers, setServers] = useState<Server[]>(DUMMY_SERVERS);
  const [templates, setTemplates] = useState<MessageTemplate[]>(DUMMY_TEMPLATES);
  const [notifications, setNotifications] = useState<NotificationLog[]>(DUMMY_NOTIFICATIONS);

  const addClient = (client: Client) => {
    setClients(prev => [...prev, { ...client, id: Date.now().toString() }]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const addPlan = (plan: Plan) => {
    setPlans(prev => [...prev, { ...plan, id: Date.now().toString() }]);
  };

  const updatePlan = (updatedPlan: Plan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };
  
  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  };
  
  const addServer = (server: Server) => {
    setServers(prev => [...prev, { ...server, id: Date.now().toString() }]);
  };

  const updateServer = (updatedServer: Server) => {
    setServers(prev => prev.map(s => s.id === updatedServer.id ? updatedServer : s));
  };

  const deleteServer = (serverId: string) => {
    setServers(prev => prev.filter(s => s.id !== serverId));
  };

  const updateTemplate = (updatedTemplate: MessageTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const addNotifications = (newLogs: Omit<NotificationLog, 'id' | 'sentAt'>[]) => {
    const fullLogs: NotificationLog[] = newLogs.map((log, index) => ({
      ...log,
      id: `notif-${log.clientId}-${Date.now()}-${index}`,
      sentAt: new Date().toISOString()
    }));
    setNotifications(prev => [...fullLogs, ...prev].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
  };

  const renderView = () => {
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
