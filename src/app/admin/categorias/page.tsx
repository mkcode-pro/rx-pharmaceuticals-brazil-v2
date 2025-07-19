"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { categoryService } from "@/services/firebase-services";

interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data as Category[]);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newCategory.name && newCategory.description) {
      try {
        const slug = newCategory.name.toLowerCase().replace(/\s+/g, '-');
        await categoryService.create({
          name: newCategory.name,
          slug,
          description: newCategory.description,
          productCount: 0
        });
        await loadCategories();
        setNewCategory({ name: "", description: "" });
        setIsAddingNew(false);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await categoryService.delete(id);
        await loadCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = async (id: string, name: string, description: string) => {
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      await categoryService.update(id, { name, description, slug });
      await loadCategories();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating category:", error);
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
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-2">Gerencie as categorias de produtos</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2" size={18} />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAddingNew && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={handleAdd}>Salvar</Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsAddingNew(false);
                    setNewCategory({ name: "", description: "" });
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {categories.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma categoria cadastrada
              </p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  {editingId === category.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        defaultValue={category.name}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id={`name-${category.id}`}
                      />
                      <input
                        type="text"
                        defaultValue={category.description}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id={`desc-${category.id}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => {
                          const name = (document.getElementById(`name-${category.id}`) as HTMLInputElement).value;
                          const desc = (document.getElementById(`desc-${category.id}`) as HTMLInputElement).value;
                          handleEdit(category.id!, name, desc);
                        }}>
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Slug: {category.slug} | {category.productCount || 0} produtos
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(category.id!)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(category.id!)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
