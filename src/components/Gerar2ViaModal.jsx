import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Download, Copy, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Gerar2ViaModal = ({ open, onOpenChange, contract }) => {
  const [method, setMethod] = useState('email');
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    // Simulate API call
    setTimeout(() => {
      setIsSent(true);
      toast({
        title: "Sucesso!",
        description: `Boleto enviado via ${method === 'email' ? 'E-mail' : 'SMS'}.`,
        className: "bg-green-50 border-green-200"
      });
    }, 1000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("34191.79001 01043.510047 91020.150008 5 83520000025000");
    toast({
      title: "Código copiado!",
      description: "Código de barras copiado para a área de transferência.",
    });
  };

  const resetModal = () => {
    setIsSent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Gerar 2ª Via do Boleto</DialogTitle>
          <DialogDescription>
            {contract ? `${contract.product} - Parcela atual` : 'Selecione a forma de recebimento'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Como deseja receber?</label>
                
                <div 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === 'email' ? 'border-[#E31C23] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setMethod('email')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${method === 'email' ? 'border-[#E31C23]' : 'border-gray-400'}`}>
                    {method === 'email' && <div className="w-2 h-2 rounded-full bg-[#E31C23]" />}
                  </div>
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Enviar por E-mail</span>
                </div>

                <div 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === 'sms' ? 'border-[#E31C23] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setMethod('sms')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${method === 'sms' ? 'border-[#E31C23]' : 'border-gray-400'}`}>
                    {method === 'sms' && <div className="w-2 h-2 rounded-full bg-[#E31C23]" />}
                  </div>
                  <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Enviar por SMS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleCopyCode} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Código
                </Button>
                <Button variant="outline" onClick={() => toast({ title: "Baixando PDF..." })} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>

              <Button onClick={handleSend} className="w-full bg-[#E31C23] hover:bg-[#c41a1f] text-white">
                Enviar Boleto
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enviado com sucesso!</h3>
              <p className="text-gray-600 mb-6">
                O boleto foi enviado para o seu {method === 'email' ? 'e-mail' : 'celular'} cadastrado.
              </p>
              <Button onClick={resetModal} className="w-full bg-gray-900 text-white">
                Fechar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default Gerar2ViaModal;