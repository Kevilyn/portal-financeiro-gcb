import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PIXPaymentModal = ({ isOpen, onClose, value, qrCodeValue }) => {
  const { toast } = useToast();
  // Mock PIX Copy Paste string if not provided
  const pixKey = qrCodeValue || "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913BanQi Pagamentos6008Sao Paulo62070503***6304E2CA";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave PIX Copiada!",
      description: "Cole no app do seu banco na opção 'PIX Copia e Cola'.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Pagamento via PIX</DialogTitle>
          <DialogDescription className="text-center">
            Aprovação imediata - Valor: R$ {value?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg p-2 flex items-center justify-center">
             {/* Placeholder for QR Code generation library */}
             <div className="w-full h-full bg-gray-900 opacity-90 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                    {Array.from({length: 36}).map((_, i) => (
                        <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                    ))}
                </div>
                {/* Visual center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded">
                        <div className="w-6 h-6 bg-teal-600 rounded-sm"></div>
                    </div>
                </div>
             </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm font-bold text-gray-700 text-center">PIX Copia e Cola</p>
            <div className="flex gap-2">
                <input 
                    readOnly 
                    value={pixKey} 
                    className="flex-1 bg-gray-100 border border-gray-200 rounded px-3 py-2 text-xs text-gray-500 truncate"
                />
                <Button onClick={handleCopyPix} size="icon" className="shrink-0 bg-teal-600 hover:bg-teal-700">
                    <Copy className="w-4 h-4" />
                </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg w-full text-xs text-blue-800 space-y-1">
             <p className="font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Como pagar:</p>
             <ol className="list-decimal pl-4 space-y-1 opacity-90">
                <li>Abra o aplicativo do seu banco</li>
                <li>Escolha a opção PIX</li>
                <li>Selecione "PIX Copia e Cola" ou "Ler QR Code"</li>
             </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PIXPaymentModal;