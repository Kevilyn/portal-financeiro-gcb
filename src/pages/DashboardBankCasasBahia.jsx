import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Building2, CheckCircle, Wallet, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DashboardBanQiCasasBahia = () => {
  const [activeTab, setActiveTab] = useState('abrir');

  const tabs = [
    { id: 'ativa', label: 'Conta Ativa' },
    { id: 'abrir', label: 'Abrir Conta' }
  ];

  return (
    <>
      <Helmet>
        <title>BanQi Casas Bahia - Portal Financeiro</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">BanQi Casas Bahia</h1>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'ativa' && (
            <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Você ainda não possui uma conta ativa</h3>
              <p className="text-gray-500 mb-6">Abra sua conta agora mesmo e aproveite benefícios exclusivos.</p>
              <Button 
                onClick={() => setActiveTab('abrir')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Quero minha conta
              </Button>
            </div>
          )}

          {activeTab === 'abrir' && (
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 relative">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Sua vida financeira completa em um só lugar</h2>
                <p className="text-purple-100 text-lg mb-8">
                  Abra sua conta digital BanQi Casas Bahia grátis e tenha acesso a Pix ilimitado, cartão sem anuidade e empréstimo pessoal na hora.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    'Conta 100% digital e gratuita',
                    'Cartão de crédito sem anuidade*',
                    'Saques na rede Banco24Horas',
                    'Empréstimo pessoal com taxas especiais'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-purple-900">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => toast({ title: "Solicitação enviada!", description: "Em breve entraremos em contato." })}
                  className="bg-green-400 hover:bg-green-500 text-purple-900 font-bold text-lg px-8 py-6 h-auto"
                >
                  Abrir conta grátis <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-purple-300 mt-4">*Sujeito à análise de crédito</p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20" />
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DashboardBanQiCasasBahia;