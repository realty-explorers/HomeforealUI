import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  tooltip?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  error,
  required = false,
  className = '',
  tooltip
}) => {
  return (
    <div className={cn('form-group', className)}>
      <div className="flex justify-between">
        <Label htmlFor={id} className="flex text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {tooltip && <span className="text-xs text-gray-500">{tooltip}</span>}
      </div>

      {children}

      {error && (
        <p className="text-xs text-red-500 mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FormField;
