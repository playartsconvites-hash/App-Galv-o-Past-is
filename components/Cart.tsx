import React from 'react';
import { X, Trash2, ArrowRight, Minus, Plus, AlertCircle, Bike } from 'lucide-react';
import { CartItem } from '../types';
import { MIN_ORDER_VALUE, DELIVERY_FEE } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;
  // A verificação agora considera o TOTAL (incluindo taxa)
  const isMinOrderMet = total >= MIN_ORDER_VALUE;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-5 bg-red-700 text-white flex justify-between items-center shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Seu Pedido
            <span className="bg-amber-400 text-red-900 text-xs px-2 py-0.5 rounded-full font-bold">
              {items.length} itens
            </span>
          </h2>
          <button onClick={onClose} className="hover:bg-red-800 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="bg-gray-200 p-6 rounded-full">
                <Trash2 size={48} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">Seu carrinho está vazio</p>
              <button 
                onClick={onClose}
                className="text-red-700 font-semibold hover:underline"
              >
                Voltar ao cardápio
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 animate-fade-in"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                    <span className="text-xs text-gray-500">
                        {item.minQuantity > 1 ? `Mínimo de ${item.minQuantity} un` : 'Unitário'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        disabled={item.quantity <= item.minQuantity}
                        title={item.quantity <= item.minQuantity ? `Quantidade mínima é ${item.minQuantity}` : 'Diminuir'}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-green-600 hover:bg-green-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        <button 
                            onClick={() => onRemoveItem(item.cartId)}
                            className="text-xs text-red-500 hover:text-red-700 underline mt-1"
                        >
                            Remover
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span className="flex items-center gap-1"><Bike size={16}/> Taxa de Entrega</span>
                <span>R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-red-600">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-700 font-medium">
                  (*R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')} taxa de entrega)
                </span>
              </div>
            </div>

            {!isMinOrderMet && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 flex items-start gap-2 text-red-700 animate-fade-in">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">
                        Valor mínimo para finalizar o pedido R$ {MIN_ORDER_VALUE.toFixed(2).replace('.', ',')} (com taxa)
                    </p>
                </div>
            )}

            <button
              onClick={onCheckout}
              disabled={!isMinOrderMet}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                ${isMinOrderMet 
                    ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200' 
                    : 'bg-red-600 text-white opacity-50 cursor-not-allowed shadow-none'}
              `}
            >
              <span>Finalizar Pedido</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};