import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportContactForm from '@/components/SupportContactForm';
import HelpCenterCard from '@/components/HelpCenterCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, FileText, CreditCard, ShieldCheck, HelpCircle, Phone, Mail, Clock, ChevronRight, Home } from 'lucide-react';

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    { question: 'Como acesso minha fatura do Cartão Casas Bahia?', answer: 'Você pode acessar sua fatura através do App Cartão Casas Bahia ou pelo nosso portal na área de "Meus Cartões". Lá você encontra a fatura atual e o histórico dos meses anteriores.' },
    { question: 'Como renegociar minha dívida online?', answer: 'Acesse a área "Simular Acordo", insira seus dados e confira as opções de parcelamento disponíveis com descontos especiais. Todo o processo é 100% digital e seguro.' },
    { question: 'O que é o Carnê Digital?', answer: 'É uma forma prática de parcelar suas compras sem cartão de crédito, gerenciando tudo pelo aplicativo ou site. Você paga as parcelas via boleto ou Pix.' },
    { question: 'Como antecipar parcelas e ganhar desconto?', answer: 'Na seção de pagamentos, selecione as parcelas que deseja antecipar. O desconto é calculado automaticamente e você pode gerar um boleto com valor reduzido.' },
    { question: 'Esqueci minha senha, como recuperar?', answer: 'Clique em "Esqueci minha senha" na tela de login e siga as instruções enviadas para seu e-mail ou SMS cadastrado para redefinir seu acesso.' },
    { question: 'Como atualizo meu cadastro?', answer: 'Faça login no portal, vá em "Meu Perfil" e edite suas informações pessoais, endereço e contatos de forma simples e rápida.' },
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const helpCards = [
    { icon: FileText, title: 'Guias de Renegociação', description: 'Passo a passo completo para quitar suas dívidas com os melhores descontos do mercado.' },
    { icon: CreditCard, title: 'Cartões e Faturas', description: 'Tudo sobre seu Cartão Casas Bahia, limites, melhor dia de compra e faturas digitais.' },
    { icon: ShieldCheck, title: 'Segurança e Privacidade', description: 'Saiba como protegemos seus dados e confira dicas para não cair em golpes.' },
  ];

  return (
    <>
      <Helmet>
        <title>Central de Ajuda e Suporte - Casas Bahia</title>
        <meta name="description" content="Tire suas dúvidas, acesse guias e entre em contato com nosso suporte." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        {/* Breadcrumb Area */}
        <div className="bg-white border-b border-gray-200 pt-24 pb-6 shadow-sm">
           <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <nav className="flex items-center text-sm text-gray-500 mb-4">
                 <Link to="/" className="hover:text-blue-600 flex items-center transition-colors">
                    <Home className="w-4 h-4 mr-1" /> Início
                 </Link>
                 <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                 <span className="text-gray-900 font-semibold bg-gray-100 px-2 py-0.5 rounded text-xs">Suporte</span>
              </nav>
              <div className="max-w-2xl">
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Central de Ajuda</h1>
                 <p className="text-gray-500 text-lg">Estamos aqui para ajudar. Como podemos facilitar seu dia hoje?</p>
              </div>
           </div>
        </div>

        <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-16">
           
           {/* Section 1: FAQ & Search */}
           <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
           >
              <div className="relative mb-10 group">
                 <div className="absolute inset-0 bg-blue-200 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <Input 
                        placeholder="Busque por dúvidas (ex: fatura, senha, acordo)..." 
                        className="pl-12 h-14 text-lg bg-white shadow-lg border-transparent focus:border-blue-300 rounded-full transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <HelpCircle className="w-6 h-6 text-blue-600" /> Perguntas Frequentes
                 </h2>
                 <Accordion type="single" collapsible className="w-full space-y-3">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 border-gray-100">
                            <AccordionTrigger className="hover:no-underline font-semibold text-left text-gray-800 py-4">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-gray-600 pb-4 leading-relaxed">{faq.answer}</AccordionContent>
                        </AccordionItem>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Nenhum resultado encontrado para "{searchTerm}".</p>
                            <button onClick={() => setSearchTerm('')} className="text-blue-600 font-medium mt-2 hover:underline">Limpar busca</button>
                        </div>
                    )}
                 </Accordion>
              </div>
           </motion.section>

           {/* Section 2: Help Center Cards */}
           <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
           >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Navegue por Tópicos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                 {helpCards.map((card, idx) => (
                    <HelpCenterCard key={idx} {...card} />
                 ))}
              </div>
           </motion.section>

           {/* Section 3: Contact & Support */}
           <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4"
           >
              
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6">Canais de Atendimento</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">4003-0515</p>
                                    <p className="text-sm text-blue-100 opacity-90">Capitais e regiões metropolitanas</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">0800 888 0515</p>
                                    <p className="text-sm text-blue-100 opacity-90">Demais localidades</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">sac@casasbahia.com.br</p>
                                    <p className="text-sm text-blue-100 opacity-90">Resposta em até 24h úteis</p>
                                </div>
                            </li>
                            <li className="pt-6 border-t border-white/20">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Horário de Atendimento</p>
                                        <p className="text-sm text-blue-100 opacity-90">Seg. a Sex. das 08h às 20h</p>
                                        <p className="text-sm text-blue-100 opacity-90">Sábado das 08h às 18h</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Decorative Background Circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
                 </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Ainda precisa de ajuda?</h2>
                    <p className="text-gray-500 text-lg">Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.</p>
                 </div>
                 <SupportContactForm />
              </div>

           </motion.section>

        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default SupportPage;