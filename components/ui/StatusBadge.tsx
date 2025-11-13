
import React from 'react';
import { getClientStatus } from '../../utils/dateUtils';

interface StatusBadgeProps {
  expirationDate: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ expirationDate }) => {
  const status = getClientStatus(expirationDate);

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
      {status.text}
    </span>
  );
};

export default StatusBadge;
