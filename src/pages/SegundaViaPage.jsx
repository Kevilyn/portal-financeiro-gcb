import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Barcode, Calendar, ChevronLeft, Copy, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currencyUtils';

const SegundaViaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const boletos = (user?.contratos || []).flatMap((contract) =>
    (contract.parcelas || [])
      .filter((parcela) => parcela.status !== 'paga')
      .slice(0, 3)
      .map((parcela) => ({ ...parcela, contract }))
  );

  const handleCopy = () => {
    navigator.clipboard.writeText('34191.79001 01043.510047 91020.150008 5 83520000025000');
    toast({ title: 'Código copiado', description: 'Linha digitável copiada para pagamento.' });
  };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <Helmet><title>Segunda Via - Portal Financeiro Casas Bahia</title></Helmet>

      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 pl-0 text-gray-500">
        <ChevronLeft className="mr-1 h-4 w-4" /> Voltar ao início
      </Button>

      <div className="mb-6">
        <p className="text-sm font-bold text-[#E31C23]">Intenção de pagamento</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-950">Segunda Via</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Emita novamente um boleto ou fatura já existente para pagar uma parcela em aberto sem alterar as condições do contrato.
        </p>
      </div>

      <div className="grid gap-4">
        {boletos.length > 0 ? boletos.map((boleto) => (
          <div key={`${boleto.contract.id}-${boleto.id}`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="rounded-lg bg-blue-50 p-3">
                  <Barcode className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-gray-950">{boleto.contract.produto}</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
                      Parcela {boleto.numero}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Contrato {boleto.contract.numero || boleto.contract.id}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}</span>
                    <span className="font-bold text-gray-950">{formatCurrency(boleto.valorComDesconto || boleto.valor)}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setSelected(boleto)} className="bg-[#E31C23] hover:bg-[#c41a1f]">
                Emitir segunda via <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <h2 className="font-bold text-gray-950">Nenhuma parcela em aberto</h2>
            <p className="mt-1 text-sm text-gray-500">Não encontramos boletos disponíveis para segunda via.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
          <h2 className="font-bold text-green-900">Boleto atualizado gerado</h2>
          <p className="mt-1 text-sm text-green-800">
            Use a linha digitável abaixo para pagar a parcela {selected.numero} do contrato {selected.contract.numero || selected.contract.id}.
          </p>
          <div className="mt-4 rounded-lg bg-white p-4 font-mono text-sm text-gray-800">
            34191.79001 01043.510047 91020.150008 5 83520000025000
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleCopy} variant="outline" className="bg-white">
              <Copy className="mr-2 h-4 w-4" /> Copiar código
            </Button>
            <Button onClick={() => toast({ title: 'Download iniciado', description: 'O PDF do boleto será baixado em instantes.' })} className="bg-green-700 hover:bg-green-800">
              <Download className="mr-2 h-4 w-4" /> Baixar PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegundaViaPage;
