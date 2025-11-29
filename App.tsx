import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { CheckoutForm } from './components/CheckoutForm';
import { FloatingCartBar } from './components/FloatingCartBar';
import { PRODUCTS, GOOGLE_SHEET_CSV_URL } from './constants';
import { CartItem, Product, ProductType } from './types';

// Função auxiliar robusta para analisar CSV
const parseCSV = (text: string): Product[] => {
  const lines = text.split('\n');
  const products: Product[] = [];

  // Pula o cabeçalho (linha 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // REGEX CORRIGIDO: Divide por vírgula APENAS se não estiver entre aspas
    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => {
      // Remove aspas extras do Excel/Sheets ("texto") -> texto
      return col.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    });

    // Precisamos de pelo menos 5 colunas preenchidas para ser um produto válido
    if (cols.length < 5) continue;

    // Mapeamento das colunas da planilha:
    // A(0): id | B(1): nome | C(2): tipo | D(3): descricao | E(4): preco | F(5): imagem | G(6): disponivel

    const id = cols[0];
    const name = cols[1];
    
    // Lógica de mapeamento inteligente para o Tipo
    const rawType = cols[2] ? cols[2].toLowerCase().trim() : 'pastel';
    let type: ProductType = 'pastel'; // Padrão

    if (rawType.includes('bebida') || rawType.includes('drink') || rawType.includes('refrigerante') || rawType.includes('refri')) {
      type = 'drink';
    } else if (rawType.includes('enroladinho') || rawType.includes('salsicha')) {
      type = 'enroladinho';
    } else {
      type = 'pastel';
    }
    
    const description = cols[3];
    
    // Tratamento de preço: Remove 'R$', troca vírgula por ponto
    const priceStr = cols[4].replace('R$', '').replace(/\s/g, '').replace(',', '.');
    const unitPrice = parseFloat(priceStr);
    
    const image = cols[5];
    
    // Tratamento de disponibilidade: Aceita TRUE, VERDADEIRO, SIM, S, 1
    const availRaw = cols[6] ? cols[6].toUpperCase().trim() : 'TRUE';
    const available = ['TRUE', 'VERDADEIRO', 'SIM', 'S', '1', 'YES'].includes(availRaw);

    if (id && name && !isNaN(unitPrice)) {
      products.push({
        id,
        name,
        type,
        description,
        unitPrice,
        image: image || 'https://placehold.co/600x400?text=Sem+Imagem',
        minQuantity: 1, 
        available // Agora usa o valor corretamente lido da planilha
      });
    }
  }
  return products;
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'catalog' | 'checkout'>('catalog');
  const [products, setProducts] = useState<Product[]>(PRODUCTS); // Começa com fallback
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Função isolada para buscar produtos
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Adiciona timestamp para evitar cache do navegador (cache busting)
      const noCacheUrl = `${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`;
      const response = await fetch(noCacheUrl);
      
      if (response.ok) {
        const text = await response.text();
        const sheetProducts = parseCSV(text);
        
        if (sheetProducts.length > 0) {
          setProducts(sheetProducts);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error("Erro ao carregar planilha. Usando catálogo padrão.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar produtos ao iniciar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (newItem: Omit<CartItem, 'cartId'>) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          { ...newItem, cartId: `${newItem.productId}-${Date.now()}` },
        ];
      }
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = Math.max(item.minQuantity, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setView('catalog');
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-gray-800 flex flex-col">
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-8 pb-32 flex-grow">
        {view === 'catalog' ? (
          <div className="space-y-8 animate-fade-in">
            <section className="text-center space-y-2 mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Faça Seu pedido!</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Escolha seus sabores favoritos
              </p>
            </section>

            {isLoading ? (
               <div className="flex justify-center items-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 text-lg">Nenhum produto disponível no momento.</p>
                    </div>
                ) : (
                    products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))
                )}
              </div>
            )}
          </div>
        ) : (
          <CheckoutForm items={cart} total={total} onBack={handleBackToCatalog} />
        )}
      </main>

      {/* Floating Bottom Bar - Only shows in catalog view when items exist */}
      {view === 'catalog' && (
        <FloatingCartBar 
          items={cart}
          total={total} 
          onClick={() => setIsCartOpen(true)} 
        />
      )}

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckoutStart}
      />

      {/* Simple Footer */}
      <footer className="bg-red-900 text-red-100 py-6 text-center mt-auto mb-20 md:mb-0">
        <div className="container mx-auto px-4">
          <p className="font-medium">Galvão Pastéis &copy; {new Date().getFullYear()}</p>
          <p className="text-sm opacity-75">Sabor e qualidade que você confia.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;