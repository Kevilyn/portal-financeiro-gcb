import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AdiantarParcelasFlow from './AdiantarParcelasFlow';
import Gerar2ViaModal from './Gerar2ViaModal';

const CarneDetailsModal = ({ open, onOpenChange, contract }) => {
  const [view, setView] = useState('details'); // details, adiantar
  const [show2Via, setShow2Via] = useState(false);

  if (!contract) return null;

  const handleAdiantar = () => {
    setView('adiantar');
  };

  const resetModal = () => {
    setView('details');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={resetModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
              {view === 'adiantar' ? 'Adiantar Parcelas' : 'Detalhes do Carnê'}
            </DialogTitle>
            <DialogDescription>
              {contract.product} - Contrato: {contract.contract}
            </DialogDescription>
          </DialogHeader>

          {view === 'details' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500">Data da Compra</p>
                  <p className="font-semibold text-gray-900">{contract.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor Parcela</p>
                  <p className="font-semibold text-gray-900">R$ {contract.installmentValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total de Parcelas</p>
                  <p className="font-semibold text-gray-900">{contract.totalInstallments}</p>
                </div>
                <div>
                   <p className="text-gray-500">Status</p>
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                     {contract.status}
                   </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Histórico de Parcelas</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {contract.history.map((parcela, idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        parcela.status === 'Paga' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-gray-900">{parcela.number}ª Parcela</span>
                        <div className="text-xs text-gray-500">
                          {parcela.status === 'Paga' ? `Paga em ${parcela.date}` : `Vence em ${parcela.date}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-gray-700">R$ {parcela.value.toFixed(2)}</span>
                        <span className={`text-xs font-medium ${
                          parcela.status === 'Paga' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {parcela.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShow2Via(true)}>
                  Gerar 2ª Via
                </Button>
                <Button className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white" onClick={handleAdiantar}>
                  Adiantar Parcelas
                </Button>
              </div>
            </div>
          ) : (
            <AdiantarParcelasFlow 
              contract={contract} 
              onClose={resetModal} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Gerar2ViaModal 
        open={show2Via} 
        onOpenChange={setShow2Via} 
        contract={contract} 
      />
    </>
  );
};

export default CarneDetailsModal;