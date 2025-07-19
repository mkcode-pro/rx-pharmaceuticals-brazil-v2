"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { shippingService } from "@/services/firebase-services";

interface ShippingZone {
  id?: string;
  name: string;
  states: string[];
  price: number;
  estimatedDays: number;
  freeShippingMinimum?: number;
}

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function ShippingConfigPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newZone, setNewZone] = useState<ShippingZone>({
    name: "",
    states: [],
    price: 0,
    estimatedDays: 0,
    freeShippingMinimum: 0
  });

  useEffect(() => {
    loadShippingZones();
  }, []);

  const loadShippingZones = async () => {
    try {
      const data = await shippingService.getAll();
      setZones(data as ShippingZone[]);
    } catch (error) {
      console.error("Error loading shipping zones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await shippingService.update(editingId, newZone);
      } else {
        await shippingService.create(newZone);
      }
      await loadShippingZones();
      resetForm();
    } catch (error) {
      console.error("Error saving shipping zone:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta zona de entrega?")) {
      try {
        await shippingService.delete(id);
        await loadShippingZones();
      } catch (error) {
        console.error("Error deleting shipping zone:", error);
      }
    }
  };

  const handleEdit = (zone: ShippingZone) => {
    setNewZone(zone);
    setEditingId(zone.id || null);
    setIsAddingNew(true);
  };

  const resetForm = () => {
    setNewZone({
      name: "",
      states: [],
      price: 0,
      estimatedDays: 0,
      freeShippingMinimum: 0
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleStateToggle = (state: string) => {
    setNewZone(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state]
    }));
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
          <h1 className="text-3xl font-bold text-gray-900">Configuração de Frete</h1>
          <p className="text-gray-600 mt-2">Configure zonas de entrega e preços</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2" size={18} />
          Nova Zona
        </Button>
      </div>

      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Nova"} Zona de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Zona</label>
              <input
                type="text"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Região Sul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estados</label>
              <div className="grid grid-cols-6 gap-2">
                {brazilianStates.map(state => (
                  <label key={state} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={newZone.states.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{state}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <input
                  type="number"
                  value={newZone.price}
                  onChange={(e) => setNewZone({ ...newZone, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prazo (dias)</label>
                <input
                  type="number"
                  value={newZone.estimatedDays}
                  onChange={(e) => setNewZone({ ...newZone, estimatedDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Frete Grátis Acima de (R$)</label>
                <input
                  type="number"
                  value={newZone.freeShippingMinimum}
                  onChange={(e) => setNewZone({ ...newZone, freeShippingMinimum: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
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
          <CardTitle>Zonas de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhuma zona de entrega configurada
            </p>
          ) : (
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{zone.name}</h3>
                      <p className="text-sm text-gray-600">
                        Estados: {zone.states.join(", ")}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>Preço: <strong>R$ {zone.price.toFixed(2)}</strong></span>
                        <span>Prazo: <strong>{zone.estimatedDays} dias</strong></span>
                        {zone.freeShippingMinimum && zone.freeShippingMinimum > 0 && (
                          <span>Frete grátis acima de: <strong>R$ {zone.freeShippingMinimum.toFixed(2)}</strong></span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(zone)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => zone.id && handleDelete(zone.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
