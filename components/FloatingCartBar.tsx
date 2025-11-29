import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DELIVERY_FEE, MIN_ORDER_VALUE } from '../constants';
import { CartItem } from '../types';

interface FloatingCartBarProps {
  items: CartItem[];
  total: number;
  onClick: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ items, total, onClick }) => {
  if (items.length === 0) return null;

  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = total + DELIVERY_FEE;
  // A verificação considera o total com taxa (pois a taxa faz parte do valor final pago)
  const isMinMet = finalTotal >= MIN_ORDER_VALUE;

  // Gerar resumo curto dos itens (ex: 50x Frango, 10x Carne...)
  const itemSummary = items
    .map(item => `${item.quantity}x ${item.name.replace('Mini Pastel de ', '').replace('Enroladinho de ', '').replace('Guaraná 2 Litros', 'Guaraná')}`)
    .join(', ');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-40 animate-slide-in-up pb-safe">
      <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between gap-4">
        <div className="flex flex-col flex-grow min-w-0 pr-2">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Total do Pedido</span>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-800">
                R$ {finalTotal.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                • {count} {count === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-medium">
              (*R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')} taxa de entrega)
            </span>
            {/* Resumo dos itens */}
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate w-full">
              {itemSummary}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end flex-shrink-0">
          <button
            onClick={onClick}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 group whitespace-nowrap ${
              isMinMet 
                ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200' 
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-200'
            }`}
          >
            <span>Finalizar</span>
            <ArrowRight size={20} className="hidden sm:block group-hover:translate-x-1 transition-transform" />
            <ArrowRight size={16} className="block sm:hidden" />
          </button>
          {!isMinMet && (
            <span className="text-[10px] text-red-600 font-bold mt-1 text-right leading-tight max-w-[120px] sm:max-w-none">
              (Mínimo R$ {MIN_ORDER_VALUE.toFixed(2).replace('.', ',')})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};