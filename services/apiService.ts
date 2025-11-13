import { Client, Plan, NotificationLog, MessageTemplate, Server } from '../types';
import { DUMMY_CLIENTS, DUMMY_PLANS, DUMMY_NOTIFICATIONS, DUMMY_TEMPLATES, DUMMY_SERVERS } from '../mockData';

// Simulate a database in memory
let clients: Client[] = [...DUMMY_CLIENTS];
let plans: Plan[] = [...DUMMY_PLANS];
let servers: Server[] = [...DUMMY_SERVERS];
let templates: MessageTemplate[] = [...DUMMY_TEMPLATES];
let notifications: NotificationLog[] = [...DUMMY_NOTIFICATIONS].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

const simulateNetworkDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

// --- Clients API ---
export const getClients = async (): Promise<Client[]> => {
  await simulateNetworkDelay();
  return [...clients];
};

export const addClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  await simulateNetworkDelay();
  const newClient: Client = { ...clientData, id: `client-${Date.now()}` };
  clients.push(newClient);
  return newClient;
};

export const updateClient = async (updatedClient: Client): Promise<Client> => {
  await simulateNetworkDelay();
  const index = clients.findIndex(c => c.id === updatedClient.id);
  if (index === -1) throw new Error("Client not found");
  clients[index] = updatedClient;
  return updatedClient;
};

export const deleteClient = async (clientId: string): Promise<void> => {
  await simulateNetworkDelay();
  clients = clients.filter(c => c.id !== clientId);
};

// --- Plans API ---
export const getPlans = async (): Promise<Plan[]> => {
  await simulateNetworkDelay();
  return [...plans];
};

export const addPlan = async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    await simulateNetworkDelay();
    const newPlan: Plan = { ...planData, id: `plan-${Date.now()}` };
    plans.push(newPlan);
    return newPlan;
};

export const updatePlan = async (updatedPlan: Plan): Promise<Plan> => {
    await simulateNetworkDelay();
    const index = plans.findIndex(p => p.id === updatedPlan.id);
    if (index === -1) throw new Error("Plan not found");
    plans[index] = updatedPlan;
    return updatedPlan;
};

export const deletePlan = async (planId: string): Promise<void> => {
    await simulateNetworkDelay();
    plans = plans.filter(p => p.id !== planId);
};

// --- Servers API ---
export const getServers = async (): Promise<Server[]> => {
    await simulateNetworkDelay();
    return [...servers];
};

export const addServer = async (serverData: Omit<Server, 'id'>): Promise<Server> => {
    await simulateNetworkDelay();
    const newServer: Server = { ...serverData, id: `server-${Date.now()}` };
    servers.push(newServer);
    return newServer;
};

export const updateServer = async (updatedServer: Server): Promise<Server> => {
    await simulateNetworkDelay();
    const index = servers.findIndex(s => s.id === updatedServer.id);
    if (index === -1) throw new Error("Server not found");
    servers[index] = updatedServer;
    return updatedServer;
};

export const deleteServer = async (serverId: string): Promise<void> => {
    await simulateNetworkDelay();
    servers = servers.filter(s => s.id !== serverId);
};

// --- Templates API ---
export const getTemplates = async (): Promise<MessageTemplate[]> => {
    await simulateNetworkDelay();
    return [...templates];
};

export const updateTemplate = async (updatedTemplate: MessageTemplate): Promise<MessageTemplate> => {
    await simulateNetworkDelay();
    const index = templates.findIndex(t => t.id === updatedTemplate.id);
    if (index === -1) throw new Error("Template not found");
    templates[index] = updatedTemplate;
    return updatedTemplate;
};

// --- Notifications API ---
export const getNotifications = async (): Promise<NotificationLog[]> => {
    await simulateNetworkDelay();
    return [...notifications];
};

export const addNotifications = async (newLogs: Omit<NotificationLog, 'id' | 'sentAt'>[]): Promise<NotificationLog[]> => {
    await simulateNetworkDelay();
    const fullLogs: NotificationLog[] = newLogs.map((log, index) => ({
      ...log,
      id: `notif-${log.clientId}-${Date.now()}-${index}`,
      sentAt: new Date().toISOString()
    }));
    notifications = [...fullLogs, ...notifications].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    return fullLogs;
};

// --- All Data ---
// FIX: Add an explicit return type to ensure TypeScript infers a tuple, not an array of unions.
export const getAllData = async (): Promise<[Client[], Plan[], Server[], MessageTemplate[], NotificationLog[