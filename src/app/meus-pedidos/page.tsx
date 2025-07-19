'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAuth } from '@/store/auth-context';
import { Package, Eye, MessageSquare, ArrowLeft, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

interface Order {
  id: string;
  number: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  trackingCode?: string;
}

export default function MeusPedidosPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/minha-conta?message=login-required');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // TODO: Firestore - Fetch user orders
      // const ordersRef = collection(db, 'orders');
      // const q = query(
      //   ordersRef,
      //   where('userId', '==', user.id),
      //   orderBy('createdAt', 'desc')
      // );
      // const querySnapshot = await getDocs(q);
      // const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Mock orders for now
      const mockOrders: Order[] = [
        {
          id: '1',
          number: 'RX1734567890',
          date: '2024-12-18',
          status: 'pending',
          total: 1500.00,
          items: 3,
        },
        {
          id: '2',
          number: 'RX1734567891',
          date: '2024-12-15',
          status: 'confirmed',
          total: 850.00,
          items: 2,
        },
        {
          id: '3',
          number: 'RX1734567892',
          date: '2024-12-10',
          status: 'shipped',
          total: 2200.00,
          items: 5,
          trackingCode: 'BR123456789BR',
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Aguardando Confirmação',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
        };
      case 'confirmed':
        return {
          label: 'Pagamento Confirmado',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle,
        };
      case 'shipped':
        return {
          label: 'Enviado',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'Entregue',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Package,
        };
    }
  };

  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container-custom">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/minha-conta" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
                <ArrowLeft size={20} />
                Voltar à Minha Conta
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
              <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
            </div>

            {/* Orders List */}
            {loadingOrders ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package size={64} className="mx-auto mb-6 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h2>
                <p className="text-gray-600 mb-6">
                  Você ainda não fez nenhum pedido. Que tal explorar nossos produtos?
                </p>
                <Link
                  href="/loja"
                  className="btn-primary px-6 py-3 rounded-lg font-bold"
                >
                  Ver Produtos
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">Pedido #{order.number}</h3>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${statusInfo.color}`}>
                              <StatusIcon size={16} />
                              {statusInfo.label}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Data:</span>
                              <p className="font-medium">{formatDate(order.date)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Itens:</span>
                              <p className="font-medium">{order.items} produto{order.items > 1 ? 's' : ''}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Total:</span>
                              <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                            </div>
                            {order.trackingCode && (
                              <div>
                                <span className="text-gray-600">Rastreamento:</span>
                                <p className="font-medium text-blue-600">{order.trackingCode}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye size={16} />
                            <span className="text-sm font-medium">Detalhes</span>
                          </button>

                          <a
                            href={`https://wa.me/5511999999999?text=Olá! Gostaria de saber sobre o pedido ${order.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <MessageSquare size={16} />
                            <span className="text-sm font-medium">Suporte</span>
                          </a>

                          {order.trackingCode && (
                            <a
                              href={`https://rastreamento.correios.com.br/objeto/${order.trackingCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Truck size={16} />
                              <span className="text-sm font-medium">Rastrear</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Additional Info for Pending Orders */}
                      {order.status === 'pending' && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Seu pedido está sendo analisado.</strong> Assim que confirmarmos o pagamento PIX,
                            você receberá um e-mail e o status será atualizado.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
