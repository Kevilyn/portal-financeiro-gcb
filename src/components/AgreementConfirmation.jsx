import React, { useState } from 'react';
import { CheckCircle, Copy, ArrowRight, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const AgreementConfirmation = ({ agreement, onNext }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate a random-looking agreement code if one isn't provided
  const agreementCode = agreement?.id || `AC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(agreementCode);
    setCopied(true);
    toast({
      title: "Código copiado!",
      description: "Número do acordo copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Acordo Gerado com Sucesso!</h2>
        <p className="text-gray-500 mt-2">
            Os detalhes foram enviados para o seu e-mail. Realize o pagamento da entrada para efetivar.
        </p>
      </div>

      <Card className="border-t-4 border-t-green-500 shadow-lg">
        <CardHeader className="pb-2 bg-gray-50/50">
            <p className="text-xs text-center text-gray-500 uppercase tracking-wide font-bold">Número do Acordo</p>
            <div className="flex items-center justify-center gap-2 mt-1">
                <CardTitle className="text-2xl font-mono text-gray-900">{agreementCode}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={handleCopyCode}>
                    <Copy className="w-4 h-4" />
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Valor da Entrada</span>
                <span className="font-bold text-lg">R$ {agreement?.valor?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Vencimento</span>
                <span className="font-medium">{agreement?.dueDate ? new Date(agreement.dueDate).toLocaleDateString('pt-BR') : 'Hoje'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Forma de Pagamento</span>
                <span className="font-medium capitalize">{agreement?.paymentMethod || 'Boleto'}</span>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2 bg-gray-50/50 rounded-b-xl">
             <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold" onClick={onNext}>
                Ir para Meus Acordos <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
             <div className="flex gap-2 w-full">
                 <Button variant="outline" className="flex-1 text-xs h-9">
                    <Download className="w-3 h-3 mr-2" /> Baixar PDF
                 </Button>
                 <Button variant="outline" className="flex-1 text-xs h-9">
                    <Mail className="w-3 h-3 mr-2" /> Reenviar Email
                 </Button>
             </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AgreementConfirmation;