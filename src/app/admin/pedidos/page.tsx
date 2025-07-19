"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Filter, Download } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    cep: string;
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado"
};

// Mock data - será substituído por dados do Firebase
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#0001",
    customer: {
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 98765-4321"
    },
    items: [
      { productName: "Trembolona 100mg", quantity: 2, price: 350 },
      { productName: "Dianabol 10mg", quantity: 1, price: 180 }
    ],
    total: 880,
    status: "pending",
    paymentMethod: "PIX",
    createdAt: new Date(),
    shippingAddress: {
      street: "Rua Example, 123",
      city: "São Paulo",
      state: "SP",
      cep: "01234-567"
    }
  }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os pedidos da loja</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2" size={18} />
          Exportar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total de Pedidos</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Pedidos Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Pedidos Hoje</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => {
                const today = new Date();
                return o.createdAt.toDateString() === today.toDateString();
              }).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Receita Total</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {calculateTotalRevenue().toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por número ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6">Pedido</th>
                  <th className="text-left py-4 px-6">Cliente</th>
                  <th className="text-left py-4 px-6">Data</th>
                  <th className="text-left py-4 px-6">Total</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Pagamento</th>
                  <th className="text-center py-4 px-6">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-600">{order.customer.email}</p>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {format(order.createdAt, "dd 'de' MMM", { locale: ptBR })}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {order.paymentMethod}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={16} />
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="px-2 py-1 text-sm border rounded"
                        >
                          <option value="pending">Pendente</option>
                          <option value="processing">Processando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detalhes do Pedido {selectedOrder.orderNumber}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Fechar
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Informações do Cliente</h3>
                  <p>{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                  <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                  </p>
                  <p className="text-sm">CEP: {selectedOrder.shippingAddress.cep}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Itens do Pedido</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4">Produto</th>
                        <th className="text-center py-2 px-4">Qtd</th>
                        <th className="text-right py-2 px-4">Preço</th>
                        <th className="text-right py-2 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4">{item.productName}</td>
                          <td className="text-center py-2 px-4">{item.quantity}</td>
                          <td className="text-right py-2 px-4">R$ {item.price.toFixed(2)}</td>
                          <td className="text-right py-2 px-4">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t">
                      <tr>
                        <td colSpan={3} className="text-right py-2 px-4 font-semibold">
                          Total:
                        </td>
                        <td className="text-right py-2 px-4 font-semibold">
                          R$ {selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Status do Pedido</p>
                  <Badge className={`${statusColors[selectedOrder.status]} mt-1`}>
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Método de Pagamento</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
