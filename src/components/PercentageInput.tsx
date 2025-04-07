import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { parseCurrency, percentFormatter } from '@/utils/converters';

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  error?: boolean;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter amount',
  className = '',
  id,
  error = false
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    percentFormatter(value)
  );

  // useEffect(() => {
  //   // Update display value when prop value changes
  //   if (value !== parsePercentage(displayValue)) {
  //     setDisplayValue(formatPercentage(value));
  //   }
  // }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store the raw input value
    const rawValue = e.target.value;
    setDisplayValue(rawValue);

    // Only update the parent state if we have a valid number
    const numericValue = parseCurrency(rawValue);
    onChange(numericValue);
  };

  const handleBlur = () => {
    // Format the value on blur
    setDisplayValue(percentFormatter(value));
  };

  return (
    <div className="relative">
      {/* Dollar sign prefix */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        {displayValue.startsWith('%') ? '' : '%'}
      </div>

      <Input
        id={id}
        type="text"
        className={`pl-7 ${className} ${
          error ? 'border-red-500 focus-visible:ring-red-500' : ''
        }`}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default PercentageInput;
