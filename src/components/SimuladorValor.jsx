import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/currencyUtils';

const SimuladorValor = ({ contract, onSimulationChange }) => {
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const installmentOptions = [1, 2, 3, 4, 5, 6, 12, 18, 24, 36];
  const MIN_VALUE = 10.00;

  useEffect(() => {
    if (!contract) return;

    const numAmount = parseFloat(amount);
    const numInstallments = parseInt(installments);
    let currentError = '';

    if (amount) {
      if (isNaN(numAmount)) {
        currentError = 'Valor inválido';
      } else if (numAmount < MIN_VALUE) {
        currentError = `O valor mínimo para acordo é ${formatCurrency(MIN_VALUE)}`;
      } else if (numAmount > contract.valorEmAberto) {
        currentError = 'O valor não pode exceder o saldo devedor';
      }
    }

    setError(currentError);
    const validAmount = !currentError && amount && numAmount >= MIN_VALUE;
    setIsValid(validAmount);

    if (validAmount && installments && !isNaN(numInstallments)) {
      const originalValue = contract.valorEmAberto;
      const savings = originalValue - numAmount;
      const savingsPercentage = (savings / originalValue) * 100;
      const installmentValue = numAmount / numInstallments;

      onSimulationChange({
        valorTotal: numAmount,
        parcelas: numInstallments,
        valorParcela: installmentValue,
        economia: savings,
        economiaPorcentagem: savingsPercentage
      });
    } else {
      onSimulationChange(null);
    }
  }, [amount, installments, contract, onSimulationChange]);

  if (!contract) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm flex justify-between items-center">
        <div>
           <h3 className="text-sm font-medium text-blue-800">Saldo Devedor</h3>
           <p className="text-2xl font-bold text-blue-700">
             {formatCurrency(contract.valorEmAberto)}
           </p>
        </div>
        <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center">
           <Calculator className="w-5 h-5 text-blue-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="offer-amount" className="font-semibold text-gray-700">
            Valor da Proposta
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-500">R$</span>
            <div className="relative flex-1">
                <Input
                  id="offer-amount"
                  type="number"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn(
                    "pr-10 text-lg font-bold h-12 transition-all duration-200", 
                    error 
                      ? "border-red-300 focus:ring-red-200 bg-red-50" 
                      : isValid 
                        ? "border-green-300 focus:ring-green-200 bg-green-50" 
                        : "border-gray-300 focus:ring-blue-200"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {error && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {isValid && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
          {isValid && !error && <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1"><CheckCircle2 className="w-3 h-3"/> Valor válido!</p>}
        </div>

        {/* Installments Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="installments" className="font-semibold text-gray-700">
            Parcelas
          </Label>
          <select
            id="installments"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            disabled={!isValid}
            className={cn(
              "w-full h-12 px-3 py-2 text-lg border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
              !isValid 
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                : "bg-white border-gray-300 focus:ring-blue-200 focus:border-blue-500 text-gray-900 shadow-sm"
            )}
          >
            <option value="">Selecione...</option>
            {installmentOptions.map(opt => (
              <option key={opt} value={String(opt)}>
                {opt}x {isValid && amount ? `de ${formatCurrency(parseFloat(amount) / opt)}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {isValid && installments && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md mt-6 overflow-hidden">
          <CardContent className="p-0">
             <div className="p-4 border-b border-green-100 flex justify-between items-center bg-white/50">
                <span className="font-bold text-green-800 flex items-center gap-2">
                   <TrendingDown className="w-5 h-5" /> Economia Gerada
                </span>
                <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
                   {((contract.valorEmAberto - parseFloat(amount)) / contract.valorEmAberto * 100).toFixed(0)}% OFF
                </Badge>
             </div>
             <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                   <p className="text-xs text-green-600 uppercase font-bold tracking-wider mb-1">Valor a Pagar</p>
                   <p className="text-2xl font-bold text-gray-900">
                     {formatCurrency(parseFloat(amount))}
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-green-600 uppercase font-bold tracking-wider mb-1">Você economiza</p>
                   <p className="text-2xl font-bold text-green-600">
                     {formatCurrency(contract.valorEmAberto - parseFloat(amount))}
                   </p>
                </div>
                <div className="col-span-2 pt-4 border-t border-green-200/50 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Condição escolhida:</span>
                    <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                        {installments}x de {formatCurrency(parseFloat(amount) / parseInt(installments))}
                    </span>
                </div>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimuladorValor;