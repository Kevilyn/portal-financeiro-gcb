import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Assuming primitive or using native input if primitive fails
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Assuming primitive
import { cn } from '@/lib/utils';
import { format } from 'date-fns'; // Assuming date-fns might be available or use native
import useBusinessDays from '@/hooks/useBusinessDays';

const DatePickerVencimento = ({ selectedDate, onDateSelect }) => {
  const { getBusinessDateRange } = useBusinessDays();
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Calculate next 10 business days
    const dates = getBusinessDateRange(new Date(), 10);
    setAvailableDates(dates);
  }, [getBusinessDateRange]);

  const handleDateClick = (date) => {
    const formatted = date.toISOString().split('T')[0];
    onDateSelect(formatted);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
         <h3 className="text-blue-800 font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Escolha a data de vencimento
         </h3>
         <p className="text-sm text-blue-600 mt-1">
            Selecione uma data para o pagamento da primeira parcela (entrada).
         </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {availableDates.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
            const dayNum = date.getDate();
            const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

            return (
                <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95",
                        isSelected 
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200" 
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    )}
                >
                    <span className="text-xs uppercase font-bold opacity-80">{dayName}</span>
                    <span className="text-2xl font-bold my-1">{dayNum}</span>
                    <span className="text-xs uppercase opacity-80">{monthName}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 mt-1" />}
                </button>
            );
        })}
      </div>
      
      <div className="flex items-start gap-2 text-xs text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg">
         <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
         <p>
            Datas disponíveis consideram apenas dias úteis bancários. O pagamento deve ser realizado até o vencimento para garantir as condições do acordo.
         </p>
      </div>
    </div>
  );
};

export default DatePickerVencimento;