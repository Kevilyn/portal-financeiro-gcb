import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AgreementEmailModal = ({ isOpen, onClose, agreementId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
        toast({ title: "Email inválido", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast({ 
        title: "Email enviado!", 
        description: `Os detalhes do acordo ${agreementId} foram enviados para ${email}.`,
        className: "bg-green-50 border-green-200 text-green-900"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Enviar Detalhes por Email</DialogTitle>
          <DialogDescription>
            Receba o boleto e os termos do seu acordo diretamente na sua caixa de entrada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-4 py-4">
           <div className="space-y-2">
              <Label htmlFor="email-input">Endereço de Email</Label>
              <div className="relative">
                 <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                 <Input 
                    id="email-input" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                 />
              </div>
           </div>
           
           <DialogFooter>
               <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
               <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Enviar Agora
               </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementEmailModal;