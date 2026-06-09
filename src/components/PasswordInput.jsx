import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Digite sua senha", 
  error, 
  name, 
  id,
  disabled 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-1">
      <div 
        className={`
          flex items-center w-full border-2 rounded-xl bg-white overflow-hidden transition-all duration-200
          ${error 
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' 
            : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
        `}
      >
        <div className={`pl-4 pr-2 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
          <Lock className="w-5 h-5" />
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 md:py-3.5 text-base outline-none border-none bg-transparent text-gray-900 placeholder:text-gray-400"
        />

        <button
          type="button"
          onMouseDown={toggleVisibility}
          disabled={disabled}
          className="pr-4 pl-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-red-500 font-medium pl-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default PasswordInput;