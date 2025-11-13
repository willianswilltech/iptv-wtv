
export interface Client {
  id: string;
  fullName: string;
  phone: string;
  serverId: string;
  cityState: string;
  iptvLogin: string;
  iptvPassword?: string;
  activationDate: string; // YYYY-MM-DD
  expirationDate: string; // YYYY-MM-DD
  planId: string;
  hasReminder?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyValue: number;
}

export interface Server {
  id: string;
  name: string;
  url: string;
}

export interface NotificationLog {
  id: string;
  clientId: string;
  clientName: string;
  message: string;
  sentAt: string; // ISO 8601 format
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}