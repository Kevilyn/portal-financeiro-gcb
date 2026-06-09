import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordStrengthIndicator = ({ password = '' }) => {
  const requirements = useMemo(() => [
    { label: 'Mínimo de 8 caracteres', test: (p) => p.length >= 8 },
    { label: 'Pelo menos uma letra maiúscula', test: (p) => /[A-Z]/.test(p) },
    { label: 'Pelo menos um número', test: (p) => /[0-9]/.test(p) },
    { label: 'Pelo menos um caractere especial (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
  ], []);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.test(password)).length;
    if (metCount <= 1) return { label: 'Fraca', color: 'bg-red-500', width: '25%' };
    if (metCount === 2) return { label: 'Média', color: 'bg-yellow-500', width: '50%' };
    if (metCount === 3) return { label: 'Boa', color: 'bg-blue-500', width: '75%' };
    return { label: 'Forte', color: 'bg-green-500', width: '100%' };
  }, [password, requirements]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-1">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium text-gray-500">
          <span>Força da senha:</span>
          <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${strength.color}`}
            initial={{ width: 0 }}
            animate={{ width: strength.width }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <li key={index} className="flex items-center gap-2 text-xs transition-colors duration-200">
              {isMet ? (
                <Check className="w-3 h-3 text-green-500 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-gray-400 shrink-0" />
              )}
              <span className={isMet ? 'text-green-700 font-medium' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;