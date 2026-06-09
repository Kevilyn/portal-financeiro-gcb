import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Send, User, Mail, MessageSquare, HelpCircle, Tag } from 'lucide-react';

const SupportContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.message || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Mensagem enviada!",
        description: "Recebemos sua solicitação e entraremos em contato em breve.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    }, 1500);
  };

  const InputWithIcon = ({ icon: Icon, className, ...props }) => (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
        <div className="pl-3 pr-2 text-gray-400">
            <Icon className="w-5 h-5" />
        </div>
        <input 
            {...props}
            className={`w-full py-2.5 px-2 outline-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 ${className}`}
        />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">Nome Completo *</Label>
          <InputWithIcon 
            icon={User}
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">Email *</Label>
          <InputWithIcon 
            icon={Mail}
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-700">Categoria *</Label>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
             <div className="pl-3 pr-2 text-gray-400">
                <Tag className="w-5 h-5" />
             </div>
             <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full py-2.5 px-2 outline-none border-none bg-transparent text-sm text-gray-900 cursor-pointer"
             >
                <option value="">Selecione um assunto</option>
                <option value="duvidas">Dúvidas Gerais</option>
                <option value="pagamentos">Pagamentos e Boletos</option>
                <option value="negociacao">Negociação de Dívidas</option>
                <option value="acesso">Problemas de Acesso</option>
                <option value="cartao">Cartão Casas Bahia</option>
             </select>
          </div>
        </div>
        <div className="space-y-2">
           <Label htmlFor="subject" className="text-gray-700">Assunto</Label>
           <InputWithIcon 
             icon={HelpCircle}
             id="subject"
             name="subject"
             value={formData.subject}
             onChange={handleChange}
             placeholder="Resumo do problema"
           />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">Mensagem *</Label>
        <div className="flex items-start border border-gray-200 rounded-md overflow-hidden bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
            <div className="pl-3 pr-2 pt-3 text-gray-400">
                <MessageSquare className="w-5 h-5" />
            </div>
            <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Descreva detalhadamente como podemos ajudar..."
                className="w-full py-2.5 px-2 outline-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 resize-y min-h-[100px]"
            />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md hover:shadow-lg transition-all">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            Enviar Mensagem <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};

export default SupportContactForm;