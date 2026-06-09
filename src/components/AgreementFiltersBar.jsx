import React from 'react';
import { Search, Filter, Calendar, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AgreementFiltersBar = ({ filters, onFilterChange, onClear }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input 
            placeholder="Buscar por número do contrato ou produto..." 
            className="pl-10"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select 
            value={filters.status} 
            onValueChange={(val) => onFilterChange('status', val)}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="paid">Pagos</SelectItem>
              <SelectItem value="overdue">Vencidos</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.sort} 
            onValueChange={(val) => onFilterChange('sort', val)}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Ordenar" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
              <SelectItem value="highest">Maior valor</SelectItem>
              <SelectItem value="lowest">Menor valor</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Placeholder - simplified for UI */}
          <Button variant="outline" className="text-gray-500 border-dashed">
            <Calendar className="w-4 h-4 mr-2" /> Data
          </Button>

          {(filters.search || filters.status !== 'all' || filters.sort !== 'newest') && (
             <Button 
                variant="ghost" 
                size="icon"
                onClick={onClear}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
             >
                <X className="w-4 h-4" />
             </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementFiltersBar;