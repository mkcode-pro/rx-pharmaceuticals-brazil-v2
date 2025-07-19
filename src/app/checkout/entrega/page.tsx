'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import CheckoutSteps from '@/components/checkout/checkout-steps';
import { useAuth } from '@/store/auth-context';
import { useCart } from '@/store/cart-context';
import { ArrowLeft, ArrowRight, MapPin, Loader2, Truck } from 'lucide-react';

export default function CheckoutEntregaPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { state } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [searchingCep, setSearchingCep] = useState(false);

  const [formData, setFormData] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
  });

  // Check authentication and cart
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/minha-conta?message=login-required&returnUrl=/checkout');
      } else if (state.items.length === 0) {
        router.push('/carrinho');
      } else {
        // Check if personal data exists
        const checkoutData = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('checkout-data') || '{}') : {};
        if (!checkoutData.personal) {
          router.push('/checkout');
        }
      }
    }
  }, [authLoading, isAuthenticated, state.items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const searchCep = async () => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setSearchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          district: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Error searching CEP:', error);
    } finally {
      setSearchingCep(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.cep.trim()) errors.cep = 'CEP é obrigatório';
    else if (formData.cep.replace(/\D/g, '').length !== 8) errors.cep = 'CEP inválido';
    if (!formData.street.trim()) errors.street = 'Endereço é obrigatório';
    if (!formData.number.trim()) errors.number = 'Número é obrigatório';
    if (!formData.district.trim()) errors.district = 'Bairro é obrigatório';
    if (!formData.city.trim()) errors.city = 'Cidade é obrigatório';
    if (!formData.state.trim()) errors.state = 'Estado é obrigatório';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Save address data to sessionStorage
      if (typeof window !== 'undefined') {
        const checkoutData = JSON.parse(sessionStorage.getItem('checkout-data') || '{}');
        checkoutData.address = formData;
        sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData));
      }

      // Navigate to next step
      router.push('/checkout/pagamento');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-4 md:py-8 pb-20 md:pb-0">
        <div className="container-custom px-4">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link href="/checkout" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 text-sm md:text-base">
              <ArrowLeft size={20} />
              Voltar
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Endereço de Entrega</h1>
          </div>

          {/* Steps Component */}
          <div className="mb-6 md:mb-8">
            <CheckoutSteps currentStep={2} />
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="text-primary" size={24} />
                Dados de Entrega
              </h2>

              <div className="space-y-6">
                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      onBlur={searchCep}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                        validationErrors.cep ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    <button
                      type="button"
                      onClick={searchCep}
                      disabled={searchingCep}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {searchingCep ? <Loader2 className="animate-spin" size={20} /> : 'Buscar'}
                    </button>
                  </div>
                  {validationErrors.cep && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.cep}</p>
                  )}
                </div>

                {/* Street and Number */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua/Avenida *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                        validationErrors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nome da rua"
                    />
                    {validationErrors.street && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.street}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                        validationErrors.number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123"
                    />
                    {validationErrors.number && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.number}</p>
                    )}
                  </div>
                </div>

                {/* Complement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Apartamento, bloco, etc. (opcional)"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                      validationErrors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome do bairro"
                  />
                  {validationErrors.district && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.district}</p>
                  )}
                </div>

                {/* City and State */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                        validationErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nome da cidade"
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                        validationErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                    {validationErrors.state && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Info from Cart */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="text-blue-600" size={20} />
                    <div>
                      <p className="font-medium text-blue-900">Opções de Frete</p>
                      <p className="text-sm text-blue-700">
                        As opções de entrega serão calculadas na próxima etapa
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t flex justify-between">
                <Link
                  href="/checkout"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Voltar
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processando...
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
