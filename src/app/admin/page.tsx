"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, ShoppingCart, DollarSign, TrendingUp, Users, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { analyticsService } from "@/services/firebase-services";

// Mock data for charts
const salesData = [
  { day: "Seg", vendas: 4500 },
  { day: "Ter", vendas: 5200 },
  { day: "Qua", vendas: 4800 },
  { day: "Qui", vendas: 6100 },
  { day: "Sex", vendas: 7200 },
  { day: "Sáb", vendas: 8900 },
  { day: "Dom", vendas: 6500 },
];

const categoryData = [
  { name: "Injetáveis", value: 35, color: "#3B82F6" },
  { name: "Orais", value: 25, color: "#10B981" },
  { name: "SARMs", value: 20, color: "#F59E0B" },
  { name: "Peptídeos", value: 15, color: "#EF4444" },
  { name: "PCT", value: 5, color: "#8B5CF6" },
];

const quickActions = [
  { label: "Adicionar Produto", href: "/admin/produtos/novo", icon: Package },
  { label: "Gerenciar Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
  { label: "Configurar Frete", href: "/admin/shipping", icon: TrendingUp },
  { label: "Criar Cupom", href: "/admin/coupons", icon: Tags },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    todayOrders: 0,
    todayRevenue: 0,
    monthRevenue: 45890,
    totalCustomers: 324
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await analyticsService.getDashboardStats();
      setStats({
        ...stats,
        ...dashboardStats
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total de Produtos",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up"
    },
    {
      label: "Categorias",
      value: stats.totalCategories,
      icon: Tags,
      color: "bg-green-500",
      change: "0%",
      trend: "neutral"
    },
    {
      label: "Pedidos Hoje",
      value: stats.todayOrders,
      icon: ShoppingCart,
      color: "bg-purple-500",
      change: "+23%",
      trend: "up"
    },
    {
      label: "Faturamento Mês",
      value: `R$ ${stats.monthRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+18%",
      trend: "up"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu e-commerce</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUp className="text-green-500" size={16} />
                      ) : stat.trend === "down" ? (
                        <ArrowDown className="text-red-500" size={16} />
                      ) : null}
                      <span className={`text-sm ${
                        stat.trend === "up" ? "text-green-500" :
                        stat.trend === "down" ? "text-red-500" : "text-gray-500"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vendas da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon size={20} className="text-gray-600" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Link href="/admin/pedidos" className="text-sm text-blue-600 hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "#0001", customer: "João Silva", total: 890.00, status: "pending" },
                { id: "#0002", customer: "Maria Santos", total: 1250.00, status: "processing" },
                { id: "#0003", customer: "Pedro Costa", total: 650.00, status: "shipped" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {order.total.toFixed(2)}</p>
                    <p className={`text-xs ${
                      order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'processing' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {order.status === 'pending' ? 'Pendente' :
                       order.status === 'processing' ? 'Processando' : 'Enviado'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Trembolona 100mg", sales: 45, revenue: 15750 },
              { name: "Dianabol 10mg", sales: 38, revenue: 6840 },
              { name: "Oxandrolona 10mg", sales: 32, revenue: 9600 },
              { name: "Stanozolol 50mg", sales: 28, revenue: 7000 },
              { name: "Deca Durabolin 300mg", sales: 25, revenue: 10000 },
            ].map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} vendas</p>
                  </div>
                </div>
                <p className="font-medium">R$ {product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Versão do Sistema</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-600">Última Atualização</p>
              <p className="font-medium">18 de Julho, 2025</p>
            </div>
            <div>
              <p className="text-gray-600">Status Firebase</p>
              <p className="font-medium text-green-600">Conectado</p>
            </div>
            <div>
              <p className="text-gray-600">Total de Clientes</p>
              <p className="font-medium">{stats.totalCustomers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
