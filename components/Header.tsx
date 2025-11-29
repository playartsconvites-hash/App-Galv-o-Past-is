import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { LOGO_URL } from '../constants';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-50 bg-red-700 text-white shadow-lg border-b border-red-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img 
              src={LOGO_URL} 
              alt="Galvão Pastéis Logo" 
              className="h-14 w-auto md:h-16 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white drop-shadow-sm leading-none">
              Galvão Pastéis
            </h1>
            <span className="text-xs md:text-sm text-red-100 font-medium mt-1">
              Umuarama - PR
            </span>
          </div>
        </div>

        <button
          onClick={onOpenCart}
          className="relative p-2 hover:bg-red-800 rounded-full transition-colors group"
          aria-label="Abrir carrinho"
        >
          <ShoppingBag size={28} className="text-white group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-amber-400 text-red-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm border border-red-600">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};