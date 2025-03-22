import React from 'react';
import { cn } from '@/lib/utils';
import { OfferStatus } from '@/schemas/OfferSchemas';

interface StatusBadgeProps {
  status?: OfferStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  if (!status) {
    return '';
  }
  const getStatusClasses = () => {
    switch (status) {
      // Offer statuses
      case 'PENDING':
        return 'status-badge-pending';
      case 'IN_REVIEW':
        return 'status-badge-in-review';
      case 'REALTOR_CONTACTED':
        return 'status-badge-realtor-contacted';
      case 'REALTOR_REVIEW':
        return 'status-badge-realtor-review';
      case 'FINAL_SIGN_OFF':
        return 'status-badge-final-sign-off';
      case 'ACCEPTED':
        return 'status-badge-accepted';
      case 'REJECTED':
        return 'status-badge-rejected';

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
