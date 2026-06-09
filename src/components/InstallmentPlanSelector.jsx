import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const InstallmentPlanSelector = ({ totalValue, onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState('1');

  const plans = [
    { id: '1', label: '2x (Sem juros)', installments: 2, fee: 0 },
    { id: '2', label: '3x (Sem juros)', installments: 3, fee: 0 },
    { id: '3', label: '6x (1.5% a.m.)', installments: 6, fee: 0.015 }
  ];

  const calculateInstallment = (plan) => {
    let finalValue = totalValue;
    if (plan.fee > 0) {
      finalValue = totalValue * (1 + plan.fee * plan.installments);
    }
    return finalValue / plan.installments;
  };

  const getNextDueDate = () => {
    const today = new Date();
    // Default to 28th of next month
    let nextMonth = today.getMonth() + 1;
    let year = today.getFullYear();
    if (nextMonth > 11) {
      nextMonth = 0;
      year++;
    }
    return new Date(year, nextMonth, 28);
  };

  const handleSelect = (planId) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    if (onPlanSelect) onPlanSelect(plan, calculateInstallment(plan));
  };

  const activePlan = plans.find(p => p.id === selectedPlan);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Escolha o parcelamento</h3>
      
      <RadioGroup value={selectedPlan} onValueChange={handleSelect} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
           const val = calculateInstallment(plan);
           return (
             <div key={plan.id}>
                <RadioGroupItem value={plan.id} id={plan.id} className="sr-only peer" />
                <Label 
                   htmlFor={plan.id}
                   className="flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all h-full"
                >
                   <span className="font-bold text-gray-900 block mb-1">{plan.label}</span>
                   <span className="text-2xl font-bold text-blue-700 block mb-2">
                      R$ {val.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                   </span>
                   <span className="text-xs text-gray-500 mt-auto flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> 1ª em 28/{new Date().getMonth() + 2 > 12 ? '01' : (new Date().getMonth() + 2).toString().padStart(2, '0')}
                   </span>
                </Label>
             </div>
           );
        })}
      </RadioGroup>

      {/* Summary Box */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
         <div>
            <p className="text-sm text-gray-500">Valor Total do Parcelamento</p>
            <p className="font-bold text-gray-900 text-lg">
               R$ {(calculateInstallment(activePlan) * activePlan.installments).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </p>
         </div>
         <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            Confirmar Parcelamento <ArrowRight className="w-4 h-4 ml-2" />
         </Button>
      </div>
    </div>
  );
};

export default InstallmentPlanSelector;