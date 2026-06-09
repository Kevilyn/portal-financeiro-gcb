import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CPFForm from '@/components/CPFForm';
import BannerCarousel from '@/components/BannerCarousel';
import SolutionsSection from '@/components/SolutionsSection';
import BenefitsSection from '@/components/BenefitsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import CBIAChat from '@/components/CBIAChat';
import WhatsAppButton from '@/components/WhatsAppButton';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Bem-vindo ao Portal Financeiro Casas Bahia</title>
        <meta name="description" content="Gerencie suas compras, negocie acordos e aproveite benefícios exclusivos no Portal Financeiro Casas Bahia." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-4 md:py-6 lg:py-8 flex items-center overflow-hidden min-h-[85vh] pt-24 md:pt-32 lg:pt-36">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-50 to-transparent -z-10 hidden lg:block" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-gray-50/50 -z-10 lg:hidden" />

          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 max-w-xl mx-auto lg:mx-0 z-10"
              >
                
                {/* Removed Logo: <Logo size="large" link={false} className="mb-2 md:mb-4" /> */}

                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold text-gray-900 leading-[1.15] tracking-tight mb-3 md:mb-4">
                    Bem-vindo ao Portal Financeiro <span className="text-[#E31C23]">Casas Bahia</span>
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                    Gerencie suas compras, negocie acordos e aproveite benefícios exclusivos pensados para você.
                  </p>
                </div>

                <div className="w-full bg-white p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
                  <CPFForm />
                </div>
                
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 bg-gray-50 px-3 md:px-4 py-2 rounded-full">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Ambiente Seguro
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="hidden sm:inline">Seus dados estão protegidos</span>
                  <span className="sm:hidden">Protegido</span>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative hidden md:flex justify-center lg:justify-end items-center"
              >
                <div className="relative w-full max-w-[350px] md:max-w-[400px] lg:max-w-[480px]">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
                  
                  <img
                    src="https://horizons-cdn.hostinger.com/5f5fd64d-365a-43a8-ad0d-f030cca0a0f7/cb-reproducao-768x333-rcB0r.webp"
                    alt="Menino usando aplicativo financeiro no celular"
                    className="w-full h-auto object-cover rounded-xl md:rounded-2xl shadow-2xl relative z-10 hover:scale-[1.01] transition-transform duration-500"
                    loading="eager"
                  />
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 lg:bottom-10 lg:-left-12 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-xl z-20 flex items-center gap-2 md:gap-3 border border-gray-100"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500 font-semibold">Status</p>
                      <p className="text-xs md:text-sm font-bold text-gray-900">100% Digital</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <BannerCarousel />
          </div>
        </section>

        <SolutionsSection />
        <BenefitsSection />
        <FAQSection />
        <Footer />
        
        <CBIAChat />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Home;