import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Clock, FileText, Zap, Shield } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Smartphone,
      title: '100% online',
      description: 'Resolva tudo pelo celular ou computador'
    },
    {
      icon: Clock,
      title: 'Negocie quando quiser',
      description: 'Disponível 24 horas por dia, 7 dias por semana'
    },
    {
      icon: FileText,
      title: 'Sem burocracia',
      description: 'Processo simples e descomplicado'
    },
    {
      icon: Zap,
      title: 'Agilidade',
      description: 'Respostas e aprovações rápidas'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Seus dados protegidos com criptografia'
    }
  ];

  return (
    <section id="beneficios" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Por que escolher a gente?
          </h2>
          <p className="text-lg md:text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Benefícios pensados para facilitar sua vida
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center text-center min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E31C23] to-[#ff4757] flex items-center justify-center shadow-md mb-3">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col items-center gap-2"> {/* Added flex-col and gap-2 */}
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;