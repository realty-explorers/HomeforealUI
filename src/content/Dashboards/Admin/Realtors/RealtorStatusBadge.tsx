import React from 'react';
import { cn } from '@/lib/utils';
import { OfferStatus } from '@/schemas/OfferSchemas';
import { RealtorStatus } from '@/schemas/RealtorSchema';

interface StatusBadgeProps {
  status?: RealtorStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  if (!status) {
    return '';
  }
  const getStatusClasses = () => {
    switch (status) {
      case 'PENDING_INTRO':
        return 'status-badge-pending-intro';
      case 'INTRO_SENT':
        return 'status-badge-intro-sent';
      case 'INTRO_RECEIVED':
        return 'status-badge-intro-received';
      case 'INTERESTED':
        return 'status-badge-interested';
      case 'NOT_INTERESTED':
        return 'status-badge-not-interested';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisplayText = () => {
    // Convert status from UPPER_SNAKE_CASE to Title Case
    return status
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <span className={cn('status-badge', getStatusClasses(), className)}>
      {getDisplayText()}
    </span>
  );
};

export default StatusBadge;
