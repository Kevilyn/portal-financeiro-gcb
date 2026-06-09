import React from 'react';
import { motion } from 'framer-motion';
import CPFForm from '@/components/CPFForm';

const Hero = () => {
  return (
    <section className="relative py-4 md:py-6 lg:py-8 flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1641790016911-0353099329f6)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#E31C23]/90 via-[#003DA5]/80 to-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight"
        >
          Bem-vindo ao Portal<br />Financeiro Casas Bahia
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Gerencie suas compras, negocie acordos e aproveite benefícios exclusivos
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8"
        >
          <CPFForm />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;