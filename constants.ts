import { Product } from './types';

// Link da Logo
export const LOGO_URL = 'https://i.postimg.cc/nhJBXGXf/galvao-pasteis-transparente.png';

// Número do WhatsApp para onde o pedido será enviado (formato: 55 + DDD + Numero)
export const WHATSAPP_NUMBER = '5544997394844';

// Link da Planilha Google (Publicada como CSV)
export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMuS6vkSxWKT32bWzB6KGCA5hTWkxDzwLKcjoKwVgQ7gk5HxhoCQfwJsOsWSqh2VV0v__NIagNAism/pub?gid=0&single=true&output=csv';

// Configurações de Preço
export const DELIVERY_FEE = 5.00; // Taxa de entrega fixa
export const MIN_ORDER_VALUE = 25.00; // Valor mínimo do pedido em Reais (com taxa inclusa)

const PRICE_PASTEL = 0.85;
const MIN_QTY_PASTEL = 1; 
const PRICE_DRINK = 8.00;
const MIN_QTY_DRINK = 1;

// Produtos de Fallback (Caso a planilha falhe)
export const PRODUCTS: Product[] = [
  {
    id: 'p-frango',
    name: 'Mini Pastel de Frango',
    type: 'pastel',
    description: 'Delicioso recheio de frango temperado.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    unitPrice: PRICE_PASTEL,
    minQuantity: MIN_QTY_PASTEL,
    available: true,
  },
  {
    id: 'p-carne',
    name: 'Mini Pastel de Carne',
    type: 'pastel',
    description: 'Carne moída selecionada e bem temperada.',
    image: 'https://i0.wp.com/anamariabraga.globo.com/wp-content/uploads/2019/04/pastel-de-carne.jpg?fit=1510%2C647&ssl=1',
    unitPrice: PRICE_PASTEL,
    minQuantity: MIN_QTY_PASTEL,
    available: true,
  },
  {
    id: 'p-queijo',
    name: 'Mini Pastel de Queijo',
    type: 'pastel',
    description: 'Muito queijo derretido.',
    image: 'https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=800&q=80',
    unitPrice: PRICE_PASTEL,
    minQuantity: MIN_QTY_PASTEL,
    available: true,
  },
  {
    id: 'p-salsicha',
    name: 'Enroladinho de Salsicha',
    type: 'enroladinho',
    description: 'Clássico enroladinho de salsicha.',
    image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=800&q=80',
    unitPrice: PRICE_PASTEL,
    minQuantity: MIN_QTY_PASTEL,
    available: true,
  },
  {
    id: 'd-guarana',
    name: 'Guaraná 2 Litros',
    type: 'drink',
    description: 'Refrigerante bem gelado para acompanhar.',
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=800&q=80',
    unitPrice: PRICE_DRINK,
    minQuantity: MIN_QTY_DRINK,
    available: true,
  },
];