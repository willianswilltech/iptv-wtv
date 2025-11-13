
import { Client, Plan, NotificationLog, MessageTemplate, Server } from './types';
import { addDays, formatISO, subDays } from 'date-fns';

const today = new Date();

export const DUMMY_PLANS: Plan[] = [
  { id: 'plan1', name: 'Plano Básico', description: 'Canais SD e HD', monthlyValue: 25.00 },
  { id: 'plan2', name: 'Plano Premium', description: 'Canais Full HD e 4K', monthlyValue: 40.00 },
  { id: 'plan3', name: 'Plano Total', description: 'Todos os canais + Filmes e Séries', monthlyValue: 55.00 },
];

export const DUMMY_SERVERS: Server[] = [
  { id: 'server1', name: 'Servidor Principal (USA)', url: 'http://usa.server.com' },
  { id: 'server2', name: 'Servidor Secundário (BR)', url: 'http://br.server.com' },
  { id: 'server3', name: 'Servidor VIP (EU)', url: 'http://eu.server.com' },
];

export const DUMMY_CLIENTS: Client[] = [
  {
    id: 'client1',
    fullName: 'João da Silva',
    phone: '5511987654321',
    serverId: 'server2',
    cityState: 'São Paulo/SP',
    iptvLogin: 'joao.silva',
    activationDate: formatISO(subDays(today, 27), { representation: 'date' }),
    expirationDate: formatISO(addDays(today, 3), { representation: 'date' }),
    planId: 'plan2',
  },
  {
    id: 'client2',
    fullName: 'Maria Oliveira',
    phone: '5521912345678',
    serverId: 'server1',
    cityState: 'Rio de Janeiro/RJ',
    iptvLogin: 'maria.o',
    activationDate: formatISO(subDays(today, 15), { representation: 'date' }),
    expirationDate: formatISO(addDays(today, 15), { representation: 'date' }),
    planId: 'plan1',
  },
  {
    id: 'client3',
    fullName: 'Carlos Pereira',
    phone: '5531999998888',
    serverId: 'server3',
    cityState: 'Belo Horizonte/MG',
    iptvLogin: 'carlos.p',
    activationDate: formatISO(subDays(today, 40), { representation: 'date' }),
    expirationDate: formatISO(subDays(today, 10), { representation: 'date' }),
    planId: 'plan3',
    hasReminder: true,
  },
   {
    id: 'client4',
    fullName: 'Ana Costa',
    phone: '5571988887777',
    serverId: 'server2',
    cityState: 'Salvador/BA',
    iptvLogin: 'ana.costa',
    activationDate: formatISO(subDays(today, 5), { representation: 'date' }),
    expirationDate: formatISO(addDays(today, 25), { representation: 'date' }),
    planId: 'plan2',
  },
  {
    id: 'client5',
    fullName: 'Pedro Martins',
    phone: '5561977776666',
    serverId: 'server1',
    cityState: 'Brasília/DF',
    iptvLogin: 'pedro.m',
    activationDate: formatISO(subDays(today, 1), { representation: 'date' }),
    expirationDate: formatISO(addDays(today, 29), { representation: 'date' }),
    planId: 'plan1',
  },
];

export const DUMMY_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'notif1',
    clientId: 'client1',
    clientName: 'João da Silva',
    message: 'Olá, João da Silva! Seu plano IPTV vence em 3 dias. Valor: R$40.00. Para renovar, entre em contato conosco.',
    sentAt: subDays(today, 1).toISOString(),
  },
   {
    id: 'notif2',
    clientId: 'client3',
    clientName: 'Carlos Pereira',
    message: 'Olá, Carlos Pereira! Seu plano IPTV venceu. Para reativar, entre em contato conosco.',
    sentAt: subDays(today, 13).toISOString(),
  },
];

export const DUMMY_TEMPLATES: MessageTemplate[] = [
  {
    id: 'template1',
    name: 'Lembrete de 3 dias',
    content: 'Olá, [Nome]! Seu plano IPTV [Plano] vence em 3 dias, no dia [Vencimento]. O valor para renovação é de R$[Valor]. Para renovar, entre em contato conosco.'
  },
  {
    id: 'template2',
    name: 'Aviso de Vencimento',
    content: 'Olá, [Nome]. Gostaríamos de informar que seu plano [Plano] venceu hoje, dia [Vencimento]. Para evitar a interrupção do serviço, por favor, realize o pagamento.'
  },
];