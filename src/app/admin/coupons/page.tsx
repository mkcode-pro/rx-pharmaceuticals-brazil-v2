"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, Copy, Check } from "lucide-react";
import { couponService } from "@/services/firebase-services";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Coupon } from "@/types";

export default function CouponsConfigPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    discount: 0,
    value: 0,
    type: "percentage",
    minPurchase: 0,
    maxUses: undefined,
    usedCount: 0,
    usageCount: 0,
    active: true,
    validFrom: new Date(),
    validUntil: undefined,
    description: ""
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await couponService.getAll();
      setCoupons(data as Coupon[]);
    } catch (error) {
      console.error("Error loading coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const code = `RX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setNewCoupon({ ...newCoupon, code });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await couponService.update(editingId, newCoupon);
      } else {
        await couponService.create(newCoupon);
      }
      await loadCoupons();
      resetForm();
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cupom?")) {
      try {
        await couponService.delete(id);
        await loadCoupons();
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setNewCoupon(coupon);
    setEditingId(coupon.id || null);
    setIsAddingNew(true);
  };

  const resetForm = () => {
    setNewCoupon({
      code: "",
      discount: 0,
      value: 0,
      type: "percentage",
      minPurchase: 0,
      maxUses: undefined,
      usedCount: 0,
      usageCount: 0,
      active: true,
      validFrom: new Date(),
      validUntil: undefined,
      description: ""
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await couponService.update(coupon.id!, { ...coupon, active: !coupon.active });
      await loadCoupons();
    } catch (error) {
      console.error("Error toggling coupon:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cupons</h1>
          <p className="text-gray-600 mt-2">Crie e gerencie cupons de desconto</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2" size={18} />
          Novo Cupom
        </Button>
      </div>

      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Novo"} Cupom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Código do Cupom</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PROMO10"
                  />
                  <Button variant="outline" onClick={generateCode}>
                    Gerar
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Desconto</label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as "percentage" | "fixed" })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor do Desconto {newCoupon.type === "percentage" ? "(%)" : "(R$)"}
                </label>
                <input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step={newCoupon.type === "percentage" ? "1" : "0.01"}
                  max={newCoupon.type === "percentage" ? "100" : undefined}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Compra Mínima (R$)</label>
                <input
                  type="number"
                  value={newCoupon.minPurchase}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Usos Máximos</label>
                <input
                  type="number"
                  value={newCoupon.maxUses || ""}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ilimitado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Válido Até</label>
                <input
                  type="date"
                  value={newCoupon.validUntil ? format(newCoupon.validUntil, "yyyy-MM-dd") : ""}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value ? new Date(e.target.value) : undefined })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Descrição do cupom (opcional)"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newCoupon.active}
                onChange={(e) => setNewCoupon({ ...newCoupon, active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Cupom Ativo</label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Salvar</Button>
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cupons Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum cupom cadastrado
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`p-4 border rounded-lg ${
                    coupon.active ? "border-gray-200" : "border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{coupon.code}</h3>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {coupon.type === "percentage" ? `${coupon.discount || coupon.value}%` : `R$ ${(coupon.discount || coupon.value).toFixed(2)}`}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        coupon.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {coupon.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {coupon.description && (
                    <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                  )}

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    {coupon.minPurchase && coupon.minPurchase > 0 && (
                      <p>Compra mínima: R$ {coupon.minPurchase.toFixed(2)}</p>
                    )}
                    <p>
                      Usos: {coupon.usedCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : " (ilimitado)"}
                    </p>
                    {coupon.validUntil && (
                      <p>Válido até: {format(coupon.validUntil, "dd/MM/yyyy", { locale: ptBR })}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(coupon)}
                    >
                      {coupon.active ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => coupon.id && handleDelete(coupon.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
