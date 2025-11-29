export type ProductType = 'pastel' | 'drink' | 'enroladinho';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description?: string;
  image: string;
  unitPrice: number;    // Preço por unidade
  minQuantity: number;  // Quantidade mínima para compra
  available: boolean;   // Se está disponível para venda (da planilha)
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  minQuantity: number; // Para controle no carrinho
}

export interface OrderFormData {
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  phone: string;
}