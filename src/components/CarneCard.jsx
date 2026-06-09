import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CarneCard = ({ data, onOpenDetails, onAdiantar, on2Via }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group border border-gray-100"
    >
      <div className="absolute top-0 bottom-0 left-0 w-2 md:w-3 bg-gradient-to-b from-[#003DA5] to-[#002d7a]" />

      <div className="pl-5 md:pl-6 p-4 md:p-6">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div>
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Carnê Digital</span>
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {data.product}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Contrato: {data.contract}</p>
          </div>
          <div className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border border-green-200">
            {data.status}
          </div>
        </div>

        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          <div className="flex items-center text-xs md:text-sm text-gray-600">
            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2 text-[#003DA5]" />
            <span>Compra: {data.purchaseDate}</span>
          </div>
          <div className="flex items-center text-xs md:text-sm text-gray-600">
            <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-2 text-[#003DA5]" />
            <span>{data.installments}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-[10px] md:text-xs h-8 md:h-9 border-[#003DA5] text-[#003DA5] hover:bg-blue-50"
            onClick={() => onOpenDetails(data)}
          >
            Ver detalhes
          </Button>
          <Button 
            size="sm"
            className="w-full text-[10px] md:text-xs h-8 md:h-9 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
            onClick={() => onAdiantar(data)}
          >
            Adiantar
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="col-span-2 w-full text-[10px] md:text-xs h-7 md:h-8 text-gray-500 hover:text-gray-900"
            onClick={() => on2Via(data)}
          >
            Gerar 2ª via do boleto
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarneCard;