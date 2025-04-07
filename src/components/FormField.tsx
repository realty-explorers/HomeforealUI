import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import HelperIcon from './HelperIcon';

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  tooltip?: string;
  helperText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  error,
  required = false,
  className = '',
  tooltip,
  helperText
}) => {
  return (
    <div className={cn('form-group', className)}>
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <Label htmlFor={id} className="flex text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {helperText && <HelperIcon helperText={helperText} />}
        </div>
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
