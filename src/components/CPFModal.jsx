import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, X, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const CPFModal = ({ open, onOpenChange, type, cpf }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    onOpenChange(false);
    
    if (type === 'registered') {
      navigate('/login', { state: { cpf } });
    } else {
      navigate('/signup', { state: { cpf } });
    }
  };

  const isRegistered = type === 'registered';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative p-8 text-center"
            >
              <button 
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Logo added to modal */}
              <div className="flex justify-center -mt-2">
                 <Logo size="medium" link={false} className="mb-6" />
              </div>

              <div className="flex justify-center mb-6">
                <div className={`rounded-full p-4 ${isRegistered ? 'bg-blue-100' : 'bg-red-100'}`}>
                  {isRegistered ? (
                    <UserCheck className="w-12 h-12 text-blue-600" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-[#E31C23]" />
                  )}
                </div>
              </div>

              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-2">
                  {isRegistered ? 'Que bom te ver de volta!' : 'Eba! Que bom te ver por aqui'}
                </DialogTitle>
                <DialogDescription className="text-center text-base text-gray-600">
                  {isRegistered
                    ? 'Identificamos que você já tem cadastro. Faça login para acessar sua conta.'
                    : 'Vamos criar seu cadastro agora mesmo para você aproveitar todos os benefícios!'}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-3">
                <Button
                  onClick={handleAction}
                  className={`w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all ${
                    isRegistered
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-[#E31C23] hover:bg-[#c41a1f] text-white'
                  }`}
                  aria-label={isRegistered ? 'Ir para login' : 'Criar cadastro'}
                >
                  {isRegistered ? 'Ir para login' : 'Criar cadastro'}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="w-full text-base text-gray-500 hover:text-gray-900"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CPFModal;