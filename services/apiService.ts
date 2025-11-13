import { Client, Plan, NotificationLog, MessageTemplate, Server } from '../types';
import { DUMMY_CLIENTS, DUMMY_PLANS, DUMMY_NOTIFICATIONS, DUMMY_TEMPLATES, DUMMY_SERVERS } from '../mockData';

// --- Local Storage Helpers ---
const STORAGE_KEYS = {
  clients: 'wtv_clients',
  plans: 'wtv_plans',
  servers: 'wtv_servers',
  templates: 'wtv_templates',
  notifications: 'wtv_notifications',
};

const readFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const writeToStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

// --- In-memory database, initialized from localStorage or mock data ---
let clients: Client[] = readFromStorage(STORAGE_KEYS.clients, DUMMY_CLIENTS);
let plans: Plan[] = readFromStorage(STORAGE_KEYS.plans, DUMMY_PLANS);
let servers: Server[] = readFromStorage(STORAGE_KEYS.servers, DUMMY_SERVERS);
let templates: MessageTemplate[] = readFromStorage(STORAGE_KEYS.templates, DUMMY_TEMPLATES);
let notifications: NotificationLog[] = readFromStorage(STORAGE_KEYS.notifications, DUMMY_NOTIFICATIONS).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

// Seed localStorage if it's empty on first load
if (!window.localStorage.getItem(STORAGE_KEYS.clients)) {
    writeToStorage(STORAGE_KEYS.clients, clients);
    writeToStorage(STORAGE_KEYS.plans, plans);
    writeToStorage(STORAGE_KEYS.servers, servers);
    writeToStorage(STORAGE_KEYS.templates, templates);
    writeToStorage(STORAGE_KEYS.notifications, notifications);
}


// --- Clients API ---
export const getClients = async (): Promise<Client[]> => {
  return Promise.resolve([...clients]);
};

export const addClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  const newClient: Client = { ...clientData, id: `client-${Date.now()}` };
  clients.push(newClient);
  writeToStorage(STORAGE_KEYS.clients, clients);
  return Promise.resolve(newClient);
};

export const updateClient = async (updatedClient: Client): Promise<Client> => {
  const index = clients.findIndex(c => c.id === updatedClient.id);
  if (index === -1) throw new Error("Client not found");
  clients[index] = updatedClient;
  writeToStorage(STORAGE_KEYS.clients, clients);
  return Promise.resolve(updatedClient);
};

export const deleteClient = async (clientId: string): Promise<void> => {
  clients = clients.filter(c => c.id !== clientId);
  writeToStorage(STORAGE_KEYS.clients, clients);
  return Promise.resolve();
};

// --- Plans API ---
export const getPlans = async (): Promise<Plan[]> => {
  return Promise.resolve([...plans]);
};

export const addPlan = async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    const newPlan: Plan = { ...planData, id: `plan-${Date.now()}` };
    plans.push(newPlan);
    writeToStorage(STORAGE_KEYS.plans, plans);
    return Promise.resolve(newPlan);
};

export const updatePlan = async (updatedPlan: Plan): Promise<Plan> => {
    const index = plans.findIndex(p => p.id === updatedPlan.id);
    if (index === -1) throw new Error("Plan not found");
    plans[index] = updatedPlan;
    writeToStorage(STORAGE_KEYS.plans, plans);
    return Promise.resolve(updatedPlan);
};

export const deletePlan = async (planId: string): Promise<void> => {
    plans = plans.filter(p => p.id !== planId);
    writeToStorage(STORAGE_KEYS.plans, plans);
    return Promise.resolve();
};

// --- Servers API ---
export const getServers = async (): Promise<Server[]> => {
    return Promise.resolve([...servers]);
};

export const addServer = async (serverData: Omit<Server, 'id'>): Promise<Server> => {
    const newServer: Server = { ...serverData, id: `server-${Date.now()}` };
    servers.push(newServer);
    writeToStorage(STORAGE_KEYS.servers, servers);
    return Promise.resolve(newServer);
};

export const updateServer = async (updatedServer: Server): Promise<Server> => {
    const index = servers.findIndex(s => s.id === updatedServer.id);
    if (index === -1) throw new Error("Server not found");
    servers[index] = updatedServer;
    writeToStorage(STORAGE_KEYS.servers, servers);
    return Promise.resolve(updatedServer);
};

export const deleteServer = async (serverId: string): Promise<void> => {
    servers = servers.filter(s => s.id !== serverId);
    writeToStorage(STORAGE_KEYS.servers, servers);
    return Promise.resolve();
};

// --- Templates API ---
export const getTemplates = async (): Promise<MessageTemplate[]> => {
    return Promise.resolve([...templates]);
};

export const updateTemplate = async (updatedTemplate: MessageTemplate): Promise<MessageTemplate> => {
    const index = templates.findIndex(t => t.id === updatedTemplate.id);
    if (index === -1) throw new Error("Template not found");
    templates[index] = updatedTemplate;
    writeToStorage(STORAGE_KEYS.templates, templates);
    return Promise.resolve(updatedTemplate);
};

// --- Notifications API ---
export const getNotifications = async (): Promise<NotificationLog[]> => {
    return Promise.resolve([...notifications]);
};

export const addNotifications = async (newLogs: Omit<NotificationLog, 'id' | 'sentAt'>[]): Promise<NotificationLog[]> => {
    const fullLogs: NotificationLog[] = newLogs.map((log, index) => ({
      ...log,
      id: `notif-${log.clientId}-${Date.now()}-${index}`,
      sentAt: new Date().toISOString()
    }));
    notifications = [...fullLogs, ...notifications].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    writeToStorage(STORAGE_KEYS.notifications, notifications);
    return Promise.resolve(fullLogs);
};

// --- All Data ---
export const getAllData = async (): Promise<[Client[], Plan[], Server[], MessageTemplate[], NotificationLog[