import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      id: 1,
      title: 'Carnê Digital sem juros',
      description: 'Parcele suas compras em até 24x sem juros',
      bg: 'linear-gradient(135deg, #E31C23 0%, #ff4757 100%)',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d'
    },
    {
      id: 2,
      title: 'Cartão Casas Bahia',
      description: 'Aproveite benefícios exclusivos',
      bg: 'linear-gradient(135deg, #003DA5 0%, #0066ff 100%)',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3'
    },
    {
      id: 3,
      title: 'Negocie sua dívida',
      description: 'Condições especiais de pagamento',
      bg: 'linear-gradient(135deg, #28A745 0%, #5cb85c 100%)',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c'
    },
    {
      id: 4,
      title: 'BanQi Casas Bahia',
      description: 'Conta digital completa e gratuita',
      bg: 'linear-gradient(135deg, #6c757d 0%, #95a5a6 100%)',
      image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc'
    },
    {
      id: 5,
      title: 'App Casas Bahia',
      description: 'Tudo na palma da sua mão',
      bg: 'linear-gradient(135deg, #E31C23 0%, #003DA5 100%)',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{ background: banners[currentIndex].bg }}
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${banners[currentIndex].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative h-full flex items-center justify-center text-center p-6 md:p-8">
            <div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {banners[currentIndex].title}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                {banners[currentIndex].description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full transition-all"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full transition-all"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-6 md:w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;