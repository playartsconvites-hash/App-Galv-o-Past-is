import React, { useState } from 'react';
import { Check, Plus, Minus, Ban } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, 'cartId'>) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number | ''>(product.minQuantity);
  const [isAdded, setIsAdded] = useState(false);

  // Helper to safely get number value
  const currentQty = quantity === '' ? 0 : quantity;
  const isAvailable = product.available;

  const handleIncrement = () => {
    setQuantity(currentQty + 1);
  };

  const handleDecrement = () => {
    if (currentQty > product.minQuantity) {
      setQuantity(currentQty - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
        setQuantity(num);
    }
  };

  const handleBlur = () => {
    if (quantity === '' || quantity < product.minQuantity) {
      setQuantity(product.minQuantity);
    }
  };

  const handleAdd = () => {
    if (!isAvailable) return;

    const qtyToAdd = currentQty < product.minQuantity ? product.minQuantity : currentQty;

    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.unitPrice,
      quantity: qtyToAdd,
      image: product.image,
      minQuantity: product.minQuantity,
    });

    if (quantity === '' || quantity < product.minQuantity) {
        setQuantity(product.minQuantity);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const totalPrice = product.unitPrice * (currentQty || 0);

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'pastel': return 'Mini Pastel';
      case 'enroladinho': return 'Enroladinho';
      case 'drink': return 'Bebida';
      default: return 'Outros';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-orange-100 ${!isAvailable ? 'opacity-80' : ''}`}>
      <div className="relative h-48 overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isAvailable ? 'group-hover:scale-105' : 'grayscale filter'}`}
        />
        
        {/* Overlay para produtos disponíveis */}
        {isAvailable && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        )}

        {/* Overlay de Esgotado */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg transform -rotate-12 border-2 border-white shadow-lg uppercase tracking-wider text-lg">
              Esgotado
            </span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
            <span className={`inline-block text-xs px-2 py-1 rounded font-bold shadow-sm ${isAvailable ? 'bg-amber-400 text-red-900' : 'bg-gray-400 text-white'}`}>
                {getProductTypeLabel(product.type)}
            </span>
            <span className={`font-bold px-2 py-1 rounded text-sm backdrop-blur-sm ${isAvailable ? 'text-white bg-red-700/80' : 'text-gray-200 bg-gray-800/80'}`}>
               R$ {product.unitPrice.toFixed(2).replace('.', ',')}/{product.type === 'pastel' ? 'un' : 'un'}
            </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-lg font-bold mb-1 ${isAvailable ? 'text-gray-800' : 'text-gray-500'}`}>{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto space-y-4">
          {/* Quantity Selector */}
          <div className={`flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100 ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
             <span className="text-xs font-medium text-gray-500 mb-2">
                Selecione ou digite a quantidade:
             </span>
             <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={handleDecrement}
                  disabled={!isAvailable || currentQty <= product.minQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                >
                  <Minus size={16} />
                </button>
                
                <input 
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={!isAvailable}
                    className="w-16 text-center font-bold text-lg text-gray-800 bg-transparent border-b-2 border-transparent focus:border-red-500 focus:outline-none appearance-none disabled:text-gray-400"
                    aria-label="Quantidade"
                />

                <button 
                  onClick={handleIncrement}
                  disabled={!isAvailable}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40 disabled:text-gray-400"
                >
                  <Plus size={16} />
                </button>
             </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className={`flex flex-col ${!isAvailable ? 'opacity-50' : ''}`}>
              <span className="text-xs text-gray-500">Total</span>
              <span className={`text-xl font-bold ${isAvailable ? 'text-red-600' : 'text-gray-400'}`}>
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            {isAvailable ? (
              <button
                onClick={handleAdd}
                disabled={currentQty === 0}
                className={`px-6 py-2 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  isAdded 
                    ? 'bg-green-600 text-white shadow-green-200' 
                    : 'bg-red-700 hover:bg-red-800 text-white hover:shadow-red-200 disabled:bg-gray-400 disabled:shadow-none'
                }`}
                aria-label="Adicionar ao carrinho"
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span className="text-sm font-bold">Adicionado!</span>
                  </>
                ) : (
                  <span className="text-sm font-bold">Adicionar</span>
                )}
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 font-bold"
              >
                <Ban size={18} />
                <span>Indisponível</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};