import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, Key, Calculator, FileSignature, CreditCard } from 'lucide-react';

const ActivityFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'Todos', icon: Clock },
    { id: 'login', label: 'Logins', icon: Key },
    { id: 'simulation', label: 'Simulações', icon: Calculator },
    { id: 'agreement', label: 'Acordos', icon: FileSignature },
    { id: 'payment', label: 'Pagamentos', icon: CreditCard },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={currentFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "rounded-full whitespace-nowrap h-8 text-xs font-medium px-4",
            currentFilter === filter.id ? "bg-blue-600 text-white" : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
          )}
        >
          <filter.icon className="w-3 h-3 mr-2" />
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default ActivityFilter;