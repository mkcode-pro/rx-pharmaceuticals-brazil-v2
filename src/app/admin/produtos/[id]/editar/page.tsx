'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import { productService, storageService, categoryService } from '@/services/firebase-services';
import { Product } from '@/types';

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [productId, setProductId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    tags: "",
    discount: "",
    inStock: true,
    featured: false,
    description: "",
    dosage: "",
    composition: "",
    usage: "",
    sideEffects: "",
    contraindications: "",
    manufacturer: "",
    rating: "5",
    reviewCount: "0",
    currentImage: "",
    newImage: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, [params]);

  const loadData = async () => {
    try {
      const { id } = await params;
      setProductId(id);
      const product = await productService.getById(id);
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || "",
          category: product.category,
          subcategory: product.subcategory || "",
          tags: product.tags?.join(", ") || "",
          discount: product.discount?.toString() || "",
          inStock: product.inStock,
          featured: product.featured || false,
          description: product.description || "",
          dosage: product.dosage || "",
          composition: product.composition || "",
          usage: product.usage || "",
          sideEffects: product.sideEffects || "",
          contraindications: product.contraindications || "",
          manufacturer: product.manufacturer || "",
          rating: product.rating?.toString() || "5",
          reviewCount: product.reviewCount?.toString() || "0",
          currentImage: product.image,
          newImage: null,
        });
      }

      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Erro ao carregar produto');
      router.push('/admin/produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, newImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.currentImage;

      // Upload new image if provided
      if (formData.newImage) {
        // Delete old image if exists
        if (formData.currentImage) {
          await storageService.deleteProductImage(formData.currentImage);
        }
        // Upload new image
        imageUrl = await storageService.uploadProductImage(formData.newImage, productId);
      }

      const updatedProduct: Partial<Product> = {
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: imageUrl,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        inStock: formData.inStock,
        featured: formData.featured,
        description: formData.description || undefined,
        dosage: formData.dosage || undefined,
        composition: formData.composition || undefined,
        usage: formData.usage || undefined,
        sideEffects: formData.sideEffects || undefined,
        contraindications: formData.contraindications || undefined,
        manufacturer: formData.manufacturer || undefined,
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
      };

      await productService.update(productId, updatedProduct);
      alert('Produto atualizado com sucesso!');
      router.push('/admin/produtos');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Erro ao atualizar produto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/produtos"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Editar Produto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Produto *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preço *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preço Original</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoria *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fabricante</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="emagrecimento, definição, força"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Imagem do Produto</label>

              {formData.currentImage && !formData.newImage && (
                <div className="mb-4 relative inline-block">
                  <Image
                    src={formData.currentImage}
                    alt="Current product"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <p className="text-sm text-gray-600 mt-2">Imagem atual</p>
                </div>
              )}

              {formData.newImage && (
                <div className="mb-4 relative inline-block">
                  <Image
                    src={URL.createObjectURL(formData.newImage)}
                    alt="New product"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, newImage: null })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Upload size={20} />
                  {formData.newImage ? 'Trocar Imagem' : 'Selecionar Nova Imagem'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium mb-2">Dosagem</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Uso</label>
              <input
                type="text"
                value={formData.usage}
                onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Composição</label>
              <textarea
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Efeitos Colaterais</label>
              <input
                type="text"
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Contraindicações</label>
              <textarea
                value={formData.contraindications}
                onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="rounded text-primary"
                />
                <span className="text-sm">Em Estoque</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-primary"
                />
                <span className="text-sm">Destaque</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Desconto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Link
              href="/admin/produtos"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
