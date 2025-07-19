"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, Loader2, Image } from "lucide-react";
import Link from "next/link";
import { productService } from "@/services/firebase-services";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await productService.getAll();
      setProductList(products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setDeleting(id);
      try {
        await productService.delete(id);
        setProductList(productList.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Erro ao excluir produto");
      } finally {
        setDeleting(null);
      }
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
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-2">Gerencie os produtos da loja</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>
            <Plus className="mr-2" size={18} />
            Novo Produto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {filteredProducts.length} produtos encontrados
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4">Imagem</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Preço</th>
                  <th className="text-left py-3 px-4">Estoque</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Image size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">R$ {product.price.toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${
                          product.inStock ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.inStock ? 'Em estoque' : 'Esgotado'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Link href={`/admin/produtos/${product.id}/editar`}>
                            <Button variant="outline" size="sm">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                          >
                            {deleting === product.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
