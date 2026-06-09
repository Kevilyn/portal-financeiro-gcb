import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ContactValidationModal = ({ isOpen, onClose, onSuccess, context = "alteração" }) => {
  const { validateContactCodes } = useAuth();
  const [smsCode, setSmsCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setCanResend(false);
      setSmsCode('');
      setEmailCode('');
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResend = () => {
    setTimeLeft(300);
    setCanResend(false);
    toast({ title: "Códigos reenviados", description: "Verifique seu SMS e E-mail." });
  };

  const handleVerify = async () => {
    if (smsCode.length < 6 || emailCode.length < 6) {
      toast({ title: "Erro", description: "Preencha os códigos corretamente.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await validateContactCodes(smsCode, emailCode);
      toast({ title: "Sucesso!", description: "Validação concluída com sucesso." });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ title: "Erro na validação", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Validação de Segurança
          </DialogTitle>
          <DialogDescription>
            Para confirmar a {context}, digite os códigos enviados para seu contato.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2 text-blue-900">
                <Smartphone className="w-4 h-4" /> Código SMS
              </label>
              <input
                type="text"
                maxLength={6}
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-widest py-2 rounded border-2 border-blue-200 focus:border-blue-500 outline-none"
                placeholder="000000"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2 text-blue-900">
                <Mail className="w-4 h-4" /> Código E-mail
              </label>
              <input
                type="text"
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-widest py-2 rounded border-2 border-blue-200 focus:border-blue-500 outline-none"
                placeholder="000000"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Expira em: {formatTime(timeLeft)}</span>
            <button 
              onClick={handleResend}
              disabled={!canResend}
              className={`font-semibold ${canResend ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
            >
              Reenviar códigos
            </button>
          </div>

          <Button 
            onClick={handleVerify} 
            disabled={isLoading || smsCode.length < 6 || emailCode.length < 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Confirmar Validação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactValidationModal;