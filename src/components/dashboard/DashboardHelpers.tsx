
import React from 'react';
import { Check, X } from 'lucide-react';

// This file contains small components and helpers used across dashboard pages

export const StatusIcon: React.FC<{status: string}> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Check className="h-5 w-5" />;
    case 'cancelled':
      return <X className="h-5 w-5" />;
    default:
      return null;
  }
};
