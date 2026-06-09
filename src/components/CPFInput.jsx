import React from 'react';
import { AlertCircle, CheckCircle, User } from 'lucide-react';
import { formatCPF, validateCPFCheckDigits } from '@/lib/cpfUtils';

const CPFInput = ({ value, onChange, error, disabled, id = "cpf-input" }) => {
  
  const handleChange = (e) => {
    const formatted = formatCPF(e.target.value);
    onChange(formatted);
  };

  // Real-time validation for visual feedback
  const isValidFormat = value.length === 14 && validateCPFCheckDigits(value);
  const isInvalidFormat = value.length > 0 && (value.length === 14 && !isValidFormat);

  return (
    <div className="space-y-2 w-full">
      {/* Flex container for Icon + Input */}
      <div 
        className={`
          flex items-center w-full border-2 rounded-xl bg-white overflow-hidden transition-all duration-200
          ${error || isInvalidFormat
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' 
            : isValidFormat 
              ? 'border-green-500 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200' 
              : 'border-gray-300 focus-within:border-[#0066CC] focus-within:ring-2 focus-within:ring-blue-100'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Left Icon */}
        <div className="pl-4 pr-2 text-gray-400">
          <User className="w-5 h-5" />
        </div>

        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="000.000.000-00"
          maxLength={14}
          aria-label="Campo de CPF"
          aria-invalid={!!error || isInvalidFormat}
          aria-describedby={`${id}-helper`}
          className="w-full py-3 md:py-4 text-base md:text-lg border-none outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
        />
        
        {/* Right Validation Icons */}
        <div className="pr-4">
          {(error || isInvalidFormat) && <AlertCircle className="w-5 h-5 text-red-500" />}
          {isValidFormat && !error && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>
      </div>
      
      {/* Helper Text or Error Message */}
      <div className="min-h-[20px]">
        {error ? (
          <p 
            id={`${id}-error`} 
            className="text-sm text-red-600 flex items-center gap-1 font-medium animate-in slide-in-from-top-1 fade-in duration-200"
            role="alert"
          >
            {error}
          </p>
        ) : (
          <p id={`${id}-helper`} className="text-xs text-gray-500 ml-1">
            Formato: 000.000.000-00
          </p>
        )}
      </div>
    </div>
  );
};

export default CPFInput;