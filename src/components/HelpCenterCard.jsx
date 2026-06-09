import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HelpCenterCard = ({ icon: Icon, title, description, link = "/suporte", className }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn("bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full min-h-[180px]", className)}
    >
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-3 transition-colors group-hover:bg-blue-100">
        {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6" />}
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{description}</p>
      
      <Button variant="ghost" className="w-full justify-center group hover:bg-blue-50 hover:text-blue-700 h-auto font-semibold py-2 px-2" asChild>
        <Link to={link} className="flex items-center gap-2">
          Ler Mais
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </motion.div>
  );
};

export default HelpCenterCard;