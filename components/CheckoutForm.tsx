import React, { useState } from 'react';
import { ArrowLeft, Send, MapPin, User, Phone, Bike } from 'lucide-react';
import { CartItem, OrderFormData } from '../types';
import { WHATSAPP_NUMBER, DELIVERY_FEE } from '../constants';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, total, onBack }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    street: '',
    number: '',
    neighborhood: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});

  // Cálculo do total final incluindo a taxa
  const finalTotal = total + DELIVERY_FEE;

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user types
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Partial<OrderFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
    if (formData.phone.length < 14) newErrors.phone = 'Telefone inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Construct WhatsApp Message
    let message = `*NOVO PEDIDO - GALVÃO PASTÉIS*\n`;
    message += `--------------------------------\n`;
    message += `*CLIENTE*\n`;
    message += `👤 Nome: ${formData.name}\n`;
    message += `📞 Telefone: ${formData.phone}\n\n`;
    message += `*ENTREGA*\n`;
    message += `📍 ${formData.street}, ${formData.number}\n`;
    message += `🏘️ Bairro: ${formData.neighborhood}\n\n`;
    message += `*ITENS DO PEDIDO*\n`;

    items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      // Formato solicitado: Quantidade item e valor total do item
      message += `- ${item.quantity}x ${item.name} (Total: R$ ${itemTotal.toFixed(2).replace('.', ',')})\n`;
    });

    message += `\nSubtotal: R$ ${total.toFixed(2).replace('.', ',')}\n`;
    message += `🛵 Taxa de Entrega: R$ ${DELIVERY_FEE.toFixed(2).replace('.', ',')}\n`;
    message += `*TOTAL FINAL: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n`;
    message += `--------------------------------\n`;
    message += `Aguardo confirmação!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
      <div className="bg-red-700 p-6 text-white flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="hover:bg-red-800 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            Resumo do Pedido
          </h3>
          <ul className="space-y-2 text-sm text-amber-800 mb-3">
            {items.map(item => (
                <li key={item.cartId} className="flex justify-between border-b border-amber-100 pb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </li>
            ))}
          </ul>
          
          <div className="pt-2 border-t border-amber-200 space-y-1">
             <div className="flex justify-between text-amber-900 text-sm">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
             </div>
             <div className="flex justify-between text-amber-900 text-sm items-center">
                <span className="flex items-center gap-1"><Bike size={14}/> Taxa de Entrega</span>
                <span>R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')}</span>
             </div>
          </div>

          <div className="flex flex-col pt-3 mt-2 border-t-2 border-amber-200">
            <div className="flex justify-between items-center text-xl font-bold text-red-700">
                <span>Total a Pagar</span>
                <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <span className="text-xs text-amber-700 text-right font-medium mt-1">
                (*R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')} taxa de entrega inclusa)
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <User size={16} /> Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Digite seu nome"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin size={16} /> Rua
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors.street ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Nome da rua"
              />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors.number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Nº da casa"
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors.neighborhood ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Seu bairro"
              />
              {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Phone size={16} /> Telefone / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={15}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="(XX) XXXXX-XXXX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <Send size={20} />
            <span>Enviar Pedido pelo WhatsApp</span>
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Ao clicar em enviar, você será redirecionado para o WhatsApp com os dados do seu pedido preenchidos.
          </p>
        </form>
      </div>
    </div>
  );
};