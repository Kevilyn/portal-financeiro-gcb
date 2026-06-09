import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const CPFWelcomeModal = ({ open, onOpenChange, customerData }) => {
  const navigate = useNavigate();
  
  if (!customerData) return null;

  const { cpf, temCadastro } = customerData;
  const isRegistered = temCadastro;

  const handlePrimaryAction = () => {
    onOpenChange(false);
    if (isRegistered) {
      navigate('/login', { state: { cpf } });
    } else {
      navigate('/signup', { state: { cpf, customerData } });
    }
  };

  const handleSecondaryAction = () => {
    onOpenChange(false); // Close the modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white border-0 shadow-xl rounded-xl">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative p-8 text-center"
            >
              <button 
                onClick={handleSecondaryAction}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex justify-center -mt-2 mb-6">
                 <Logo size="medium" link={false} />
              </div>

              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {isRegistered ? 'Que bom te ver por aqui!' : 'Eba! Feliz em te ter aqui'}
                </DialogTitle>
                <DialogDescription className="text-center text-base text-gray-600 font-normal mb-6">
                  {isRegistered ? 'Vamos fazer o login?' : 'Vamos criar um cadastro?'}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-3">
                <Button
                  onClick={handlePrimaryAction}
                  className="w-full h-12 text-lg font-bold shadow-lg bg-[#0066CC] hover:bg-[#0052a3] text-white rounded-lg transition-all duration-200"
                >
                  {isRegistered ? "Fazer login" : "Criar cadastro"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleSecondaryAction}
                  className="w-full h-12 text-base text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  Voltar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CPFWelcomeModal;