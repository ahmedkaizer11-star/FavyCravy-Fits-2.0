import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image,
  Upload,
  Check,
  X,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageFallback';

export function AdminProducts() {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'Shirts',
    categorySlug: 'shirts',
    subcategory: '',
    price: 1850,
    salePrice: 0,
    stock: 25,
    material: '100% Egyptian Giza Long-Staple Cotton',
    shortDescription: '',
    description: '',
    features: 'Button-down collar\nTailored fit drape\nSingle chest pocket',
    sizes: 'S, M, L, XL, XXL',
    colors: 'White, Oxford Blue, Charcoal',
    images: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    published: true,
    newArrival: true,
    bestSeller: false
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.getAdminProducts(),
        api.getCategories()
      ]);
      setProducts(pRes.products || []);
      setCategories(cRes.categories || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `FCF-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.name || 'Shirts',
      categorySlug: categories[0]?.slug || 'shirts',
      subcategory: '',
      price: 1850,
      salePrice: 0,
      stock: 30,
      material: '100% Long-Staple Combed Cotton',
      shortDescription: 'Modern minimalist silhouette tailored for distinguished daily wear.',
      description: 'Crafted with premium cotton yarn, double-needle reinforced stitching, and tailored drape.',
      features: 'Contemporary silhouette\nBreathable weave\nPreshrunk fabric',
      sizes: 'S, M, L, XL, XXL',
      colors: 'Black, White, Navy',
      images: '',
      published: true,
      newArrival: true,
      bestSeller: false
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug || '',
      sku: p.sku || '',
      category: p.category,
      categorySlug: p.categorySlug,
      subcategory: p.subcategory || '',
      price: p.price,
      salePrice: p.salePrice || 0,
      stock: p.stock,
      material: p.material || '',
      shortDescription: p.shortDescription || '',
      description: p.description,
      features: p.features.join('\n'),
      sizes: p.sizes.join(', '),
      colors: p.colors.join(', '),
      images: (p.images || []).join('\n'),
      published: p.published !== false,
      newArrival: !!p.newArrival,
      bestSeller: !!p.bestSeller
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        setFormData((prev) => {
          const currentList = prev.images
            .split('\n')
            .map((s) => s.trim())
            .filter((s) => s.length > 3);
          
          return {
            ...prev,
            images: currentList.length > 0 ? [...currentList, res.url].join('\n') : res.url
          };
        });
        showToast('Image uploaded successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const handleRemoveImageIndex = (idxToRemove: number) => {
    setFormData((prev) => {
      const currentList = prev.images
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 3);
      const filtered = currentList.filter((_, idx) => idx !== idxToRemove);
      return {
        ...prev,
        images: filtered.join('\n')
      };
    });
  };

  const handleSetPrimaryImage = (idxToPrimary: number) => {
    setFormData((prev) => {
      const currentList = prev.images
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 3);
      if (idxToPrimary <= 0 || idxToPrimary >= currentList.length) return prev;
      const item = currentList[idxToPrimary];
      const rest = currentList.filter((_, idx) => idx !== idxToPrimary);
      return {
        ...prev,
        images: [item, ...rest].join('\n')
      };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        categorySlug: formData.categorySlug,
        subcategory: formData.subcategory.trim(),
        price: Number(formData.price),
        salePrice: Number(formData.salePrice) || undefined,
        stock: Number(formData.stock),
        material: formData.material.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: formData.images.split('\n').map((img) => img.trim()).filter((img) => img.length > 3),
        thumbnail: formData.images.split('\n').map((img) => img.trim()).filter((img) => img.length > 3)[0] || '',
        published: formData.published,
        newArrival: formData.newArrival,
        bestSeller: formData.bestSeller
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await api.createProduct(payload);
        showToast('New product created successfully', 'success');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(deletingProduct.id);
      showToast(`Deleted "${deletingProduct.name}" permanently`, 'info');
      setDeletingProduct(null);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (p: Product) => {
    try {
      await api.updateProduct(p.id, { published: !p.published });
      setProducts(products.map((item) => (item.id === p.id ? { ...item, published: !item.published } : item)));
      showToast(`Product ${!p.published ? 'Published' : 'Hidden'}`, 'success');
    } catch (err: any) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categorySlug !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Product Management
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            {products.length} Garment models in catalog
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-neutral-400 uppercase hidden sm:inline">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-neutral-800 text-white text-xs px-3 py-2 rounded-lg border border-neutral-700 w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase bg-neutral-950/60">
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">SKU / Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filtered.map((p) => {
                const isOutOfStock = p.stock <= 0;
                return (
                  <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images[0] || DEFAULT_PRODUCT_IMAGE}
                          alt={p.name}
                          className="w-10 h-12 object-cover object-top rounded bg-neutral-800 border border-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            Sizes: {p.sizes.join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <p className="text-white font-medium">{p.sku}</p>
                      <p className="text-[11px] text-neutral-400">{p.category}</p>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <p className="text-white font-bold">
                        {settings.currencySymbol}
                        {(p.salePrice || p.price).toLocaleString()}
                      </p>
                      {p.salePrice && (
                        <p className="text-[10px] text-neutral-400 line-through">
                          {settings.currencySymbol}
                          {p.price.toLocaleString()}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          isOutOfStock
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : p.stock <= 5
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'text-neutral-200'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {p.newArrival && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-white text-neutral-950 font-bold">
                            NEW
                          </span>
                        )}
                        {p.bestSeller && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold">
                            BEST
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                          p.published !== false
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {p.published !== false ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setModalOpen(false)} />

          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] space-y-6 z-10 text-neutral-100">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                {editingProduct ? 'Edit Menswear Garment' : 'Create New Menswear Model'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Row 1: Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-neutral-300 font-semibold">Garment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Classic Oxford Cotton Shirt"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">SKU Identifier</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Row 2: Category, Subcategory, Price, Sale Price, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Category</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c.slug === e.target.value);
                      setFormData({
                        ...formData,
                        categorySlug: e.target.value,
                        category: selCat?.name || 'Shirts'
                      });
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Subcategory/Cut</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="Tailored Fit"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Regular Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Sale Price (৳)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-neutral-300 font-semibold">Stock Total</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Material & Sizes/Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Fabric / Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="100% Cotton 240 GSM"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Black, Navy, Olive"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Row 4: Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Short Summary</label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Key Features (one per line)</label>
                  <textarea
                    rows={2}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Row 5: Visual Image Gallery & Upload */}
              <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-neutral-200 font-semibold text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <Image className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Garment Images</span>
                    </label>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      First image is the primary cover displayed in shop catalog.
                    </p>
                  </div>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded-lg cursor-pointer font-bold text-xs transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Visual Image Previews */}
                {(() => {
                  const imageList = formData.images
                    .split('\n')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 3);

                  if (imageList.length === 0) {
                    return (
                      <div className="p-4 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-400 bg-neutral-900/40">
                        No photos added yet. Click &ldquo;Upload Photo&rdquo; or paste image URLs below.
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {imageList.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border ${
                            idx === 0 ? 'border-amber-500/80 ring-1 ring-amber-500/40' : 'border-neutral-800'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Garment ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                          />

                          {/* Primary Cover Badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1.5 left-1.5 bg-amber-500 text-neutral-950 font-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                              Cover / Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1.5 left-1.5 bg-black/75 hover:bg-black text-neutral-300 hover:text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              Make Cover
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImageIndex(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded-md shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Raw URL Input */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] text-neutral-400 font-mono">
                    Direct Image URLs (One per line):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl p-2.5 text-white font-mono text-[11px] outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-white"
                  />
                  <span>Published (Live in store)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="accent-white"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="accent-white"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prodToDelete = editingProduct;
                      setModalOpen(false);
                      setDeletingProduct(prodToDelete);
                    }}
                    className="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Garment</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingProduct ? 'Update Garment' : 'Publish Garment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Custom Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => !isDeleting && setDeletingProduct(null)}
          />

          <div className="relative w-full max-w-md bg-neutral-900 border border-red-900/40 rounded-2xl shadow-2xl p-6 space-y-5 z-10 text-neutral-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-950/80 border border-red-800/80 text-red-400 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Delete Garment
                </h3>
                <p className="text-xs text-neutral-400">
                  This action will permanently remove the garment and its inventory records from the catalog.
                </p>
              </div>
            </div>

            {/* Product Card Preview */}
            <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <img
                src={deletingProduct.thumbnail || deletingProduct.images[0] || DEFAULT_PRODUCT_IMAGE}
                alt={deletingProduct.name}
                className="w-12 h-14 object-cover object-top rounded bg-neutral-800 border border-neutral-700 shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{deletingProduct.name}</p>
                <p className="text-xs text-neutral-400 font-mono">
                  SKU: {deletingProduct.sku} | Stock: {deletingProduct.stock}
                </p>
                <p className="text-xs font-bold text-amber-400 font-mono mt-0.5">
                  {settings.currencySymbol}{(deletingProduct.salePrice || deletingProduct.price).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-red-950 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
