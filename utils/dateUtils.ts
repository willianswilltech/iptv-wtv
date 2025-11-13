
import { differenceInDays, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getClientStatus = (expirationDate: string): { text: string; color: string; daysRemaining: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const expiry = parseISO(expirationDate);
  const daysRemaining = differenceInDays(expiry, today);

  if (daysRemaining < 0) {
    return { text: 'Expirado', color: 'bg-red-500 text-white', daysRemaining };
  }
  if (daysRemaining <= 3) {
    return { text: 'Vencendo', color: 'bg-yellow-500 text-white', daysRemaining };
  }
  return { text: 'Ativo', color: 'bg-green-500 text-white', daysRemaining };
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
};
